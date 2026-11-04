import { useCallback, useEffect, useState } from "react";
import { generateQuestions } from "./grader";
import { ATASHINCHI, pickRandomVideo } from "./packs";
import { GENERIC_QUESTIONS } from "./tiktok";
import { loadLevel, saveLevel, uid } from "./util";
import { RandomLessonCard } from "./components/RandomLessonCard";
import {
  deleteClip,
  deleteMangaLesson,
  getAllAttempts,
  getAllClips,
  getAllMangaLessons,
  saveClip,
  saveMangaLesson,
} from "./db";
import { GraderError } from "./grader";
import { MangaHome } from "./manga/MangaHome";
import { MangaLessonView } from "./manga/MangaLessonView";
import { shrinkImage } from "./manga/images";
import { generateStoryLesson, lessonFromPages, pickExerciseTypes } from "./manga/prompts";
import type { MangaLesson, StyleKey } from "./manga/types";
import { IS_ARTIFACT } from "./env";
import { useSettings } from "./settings";
import type { Attempt, Clip, JlptLevel } from "./types";
import { ClipLibrary } from "./components/ClipLibrary";
import { ClipEditor } from "./components/ClipEditor";
import { Practice } from "./components/Practice";
import { SettingsDialog } from "./components/SettingsDialog";
import { TikTokQuickAdd } from "./components/TikTokQuickAdd";

type View =
  | { name: "manga" }
  | { name: "manga-lesson"; lessonId: string }
  | { name: "library" }
  | { name: "practice"; clipId: string }
  | { name: "edit"; clipId: string | null };

export default function App() {
  const [settings, setSettings] = useSettings();
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState<View>({ name: "manga" });
  const [lessons, setLessons] = useState<MangaLesson[] | null>(null);
  const [mangaBusy, setMangaBusy] = useState<string | null>(null);
  const [mangaError, setMangaError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tiktokOpen, setTiktokOpen] = useState(false);
  const [level, setLevel] = useState<JlptLevel>(loadLevel);
  const [randomBusy, setRandomBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [c, a, m] = await Promise.all([getAllClips(), getAllAttempts(), getAllMangaLessons()]);
    setClips(c);
    setAttempts(a);
    setLessons(m);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Opens a random episode from the pack as a lesson, creating it the first time. */
  const startRandomLesson = async (avoidVideoId?: string) => {
    if (randomBusy) return;
    const all = clips ?? [];
    const practiced = new Set(
      all
        .filter((c) => c.packVideoId && attempts.some((a) => a.clipId === c.id))
        .map((c) => c.packVideoId!),
    );
    const video = pickRandomVideo(ATASHINCHI, practiced, avoidVideoId);
    if (!video) return;

    const existing = all.find((c) => c.packVideoId === video.id);
    if (existing) {
      setView({ name: "practice", clipId: existing.id });
      return;
    }

    const clip: Clip = {
      id: uid(),
      title: video.title,
      anime: ATASHINCHI.name,
      level,
      source: { kind: "youtube", videoId: video.id },
      start: 0,
      end: 0,
      transcript: video.script,
      translation: "",
      // No subtitles: the title is the only hint of what the episode is about.
      caption: video.script ? undefined : `Episode title: ${video.title}`,
      questions: GENERIC_QUESTIONS.map((q) => ({ ...q, id: uid() })),
      createdAt: Date.now(),
      pack: ATASHINCHI.key,
      packVideoId: video.id,
    };
    if (IS_ARTIFACT || settings.apiKey) {
      setRandomBusy("Writing questions for this episode…");
      try {
        const generated = await generateQuestions(settings, clip, 3);
        if (generated.length) clip.questions = generated.map((q) => ({ ...q, id: uid() }));
      } catch {
        /* keep the general questions */
      }
    }
    await saveClip(clip);
    setRandomBusy(null);
    await refresh();
    setView({ name: "practice", clipId: clip.id });
  };

  const writingStatus = (verb: string) => (chars: number) =>
    setMangaBusy(chars ? `${verb}… ${chars.toLocaleString()} characters` : `${verb}…`);

  /** Runs one manga-lesson build (story or pages) and opens the result. */
  const buildLesson = async (
    build: (types: ReturnType<typeof pickExerciseTypes>) => Promise<Omit<MangaLesson, "id" | "level" | "source" | "style" | "pageCount" | "results" | "createdAt">>,
    meta: Pick<MangaLesson, "source" | "style">,
    images?: Blob[],
  ) => {
    if (!IS_ARTIFACT && !settings.apiKey) return setSettingsOpen(true);
    setMangaError(null);
    try {
      const data = await build(pickExerciseTypes());
      if (data.pages.length === 0 || data.exercises.length === 0)
        throw new GraderError("Claude didn't return a usable lesson. Please try again.");
      const lesson: MangaLesson = {
        ...data,
        ...meta,
        id: uid(),
        level,
        pageCount: images?.length ?? data.pages.length,
        results: {},
        createdAt: Date.now(),
      };
      await saveMangaLesson(lesson, images);
      await refresh();
      setView({ name: "manga-lesson", lessonId: lesson.id });
      window.scrollTo(0, 0);
    } catch (err) {
      setMangaError(err instanceof GraderError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setMangaBusy(null);
    }
  };

  const generateStory = (style: StyleKey, pages: number) => {
    setMangaBusy("Writing your manga…");
    void buildLesson(
      (types) =>
        generateStoryLesson(settings, level, style, pages, types, { onProgress: writingStatus("Writing your manga") }),
      { source: "story", style },
    );
  };

  const fromPages = async (files: File[]) => {
    setMangaBusy("Preparing pages…");
    const images = await Promise.all(files.map((f) => shrinkImage(f)));
    setMangaBusy("Reading your pages…");
    void buildLesson(
      (types) => lessonFromPages(settings, level, images, types, { onProgress: writingStatus("Reading your pages") }),
      { source: "pages" },
      images,
    );
  };

  const currentLesson =
    view.name === "manga-lesson" ? lessons?.find((l) => l.id === view.lessonId) : undefined;

  const current =
    (view.name === "practice" || view.name === "edit") && view.clipId
      ? clips?.find((c) => c.id === view.clipId)
      : undefined;

  return (
    <div className="min-h-screen">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-washi-dark bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              setView({ name: "manga" });
              void refresh();
            }}
            className="flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-shu font-display text-lg text-white jp">
              言
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-bold">Kotoba Clips</span>
              <span className="block text-xs text-sumi-soft">Read manga, learn Japanese</span>
            </span>
          </button>
          <div className="flex-1" />
          <nav className="flex overflow-hidden rounded-full border border-sumi/15 text-sm">
            {(
              [
                ["manga", "マンガ", "Manga"],
                ["library", "動画", "Clips"],
              ] as const
            ).map(([name, jp, en]) => {
              const active = name === "manga" ? view.name.startsWith("manga") : !view.name.startsWith("manga");
              return (
                <button
                  key={name}
                  onClick={() => {
                    setView(name === "manga" ? { name: "manga" } : { name: "library" });
                    void refresh();
                  }}
                  className={`px-3 py-1.5 sm:px-4 ${active ? "bg-sumi text-washi" : "hover:bg-washi-dark"}`}
                >
                  <span className="jp">{jp}</span>
                  <span className="ml-1 hidden sm:inline">{en}</span>
                </button>
              );
            })}
          </nav>
          {!IS_ARTIFACT && (
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-full border border-sumi/15 px-4 py-2 text-sm font-medium hover:bg-washi-dark"
            >
              Settings
            </button>
          )}
        </div>
        {!IS_ARTIFACT && !settings.apiKey && (
          <div className="bg-kin/15 px-4 py-2 text-center text-sm">
            Grading uses Claude.{" "}
            <button className="font-semibold underline" onClick={() => setSettingsOpen(true)}>
              Add your Anthropic API key
            </button>{" "}
            to get feedback on your answers.
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {clips === null || lessons === null ? (
          <p className="py-20 text-center text-sumi-soft">Loading…</p>
        ) : view.name === "manga" ? (
          <MangaHome
            lessons={lessons}
            level={level}
            onLevel={(l) => {
              setLevel(l);
              saveLevel(l);
            }}
            busy={mangaBusy}
            error={mangaError}
            onGenerate={generateStory}
            onFromPages={(files) => void fromPages(files)}
            onOpen={(id) => {
              setView({ name: "manga-lesson", lessonId: id });
              window.scrollTo(0, 0);
            }}
            onDelete={async (lesson) => {
              await deleteMangaLesson(lesson);
              await refresh();
            }}
          />
        ) : view.name === "manga-lesson" && currentLesson ? (
          <MangaLessonView
            key={currentLesson.id}
            lesson={currentLesson}
            settings={settings}
            onBack={() => setView({ name: "manga" })}
            onNeedSettings={() => setSettingsOpen(true)}
            onChanged={(next) => setLessons((ls) => ls?.map((l) => (l.id === next.id ? next : l)) ?? ls)}
          />
        ) : view.name === "library" ? (
          <ClipLibrary
            clips={clips}
            attempts={attempts}
            onPractice={(id) => setView({ name: "practice", clipId: id })}
            onEdit={(id) => setView({ name: "edit", clipId: id })}
            onNew={() => setView({ name: "edit", clipId: null })}
            onAddTikTok={() => setTiktokOpen(true)}
            header={
              <RandomLessonCard
                pack={ATASHINCHI}
                level={level}
                onLevel={(l) => {
                  setLevel(l);
                  saveLevel(l);
                }}
                onStart={() => void startRandomLesson()}
                busy={randomBusy}
              />
            }
            onDelete={async (id) => {
              await deleteClip(id);
              await refresh();
            }}
          />
        ) : view.name === "practice" && current ? (
          <Practice
            clip={current}
            settings={settings}
            onBack={() => {
              setView({ name: "library" });
              void refresh();
            }}
            onEdit={() => setView({ name: "edit", clipId: current.id })}
            onNeedSettings={() => setSettingsOpen(true)}
            onAnotherRandom={
              current.packVideoId ? () => void startRandomLesson(current.packVideoId) : undefined
            }
            randomBusy={randomBusy}
          />
        ) : view.name === "edit" ? (
          <ClipEditor
            key={view.clipId ?? "new"}
            clip={current ?? null}
            settings={settings}
            onCancel={() =>
              setView(current ? { name: "practice", clipId: current.id } : { name: "library" })
            }
            onSaved={async (id) => {
              await refresh();
              setView({ name: "practice", clipId: id });
            }}
            onNeedSettings={() => setSettingsOpen(true)}
          />
        ) : (
          <p className="py-20 text-center text-sumi-soft">Clip not found.</p>
        )}
      </main>

      {tiktokOpen && (
        <TikTokQuickAdd
          settings={settings}
          onClose={() => setTiktokOpen(false)}
          onAdded={async (id) => {
            setTiktokOpen(false);
            await refresh();
            setView({ name: "practice", clipId: id });
          }}
        />
      )}

      {settingsOpen && (
        <SettingsDialog
          settings={settings}
          onSave={(s) => {
            setSettings(s);
            setSettingsOpen(false);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
