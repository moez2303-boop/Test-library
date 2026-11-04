import { useCallback, useEffect, useState } from "react";
import { generateQuestions } from "./grader";
import { ATASHINCHI, pickRandomVideo } from "./packs";
import { GENERIC_QUESTIONS } from "./tiktok";
import { loadLevel, saveLevel, uid } from "./util";
import { RandomLessonCard } from "./components/RandomLessonCard";
import { deleteClip, getAllAttempts, getAllClips, saveClip } from "./db";
import { IS_ARTIFACT } from "./env";
import { useSettings } from "./settings";
import type { Attempt, Clip, JlptLevel } from "./types";
import { ClipLibrary } from "./components/ClipLibrary";
import { ClipEditor } from "./components/ClipEditor";
import { Practice } from "./components/Practice";
import { SettingsDialog } from "./components/SettingsDialog";
import { TikTokQuickAdd } from "./components/TikTokQuickAdd";

type View =
  | { name: "library" }
  | { name: "practice"; clipId: string }
  | { name: "edit"; clipId: string | null };

export default function App() {
  const [settings, setSettings] = useSettings();
  const [clips, setClips] = useState<Clip[] | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [view, setView] = useState<View>({ name: "library" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tiktokOpen, setTiktokOpen] = useState(false);
  const [level, setLevel] = useState<JlptLevel>(loadLevel);
  const [randomBusy, setRandomBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [c, a] = await Promise.all([getAllClips(), getAllAttempts()]);
    setClips(c);
    setAttempts(a);
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
      questions: GENERIC_QUESTIONS.map((q) => ({ ...q, id: uid() })),
      createdAt: Date.now(),
      pack: ATASHINCHI.key,
      packVideoId: video.id,
    };
    if (video.script && (IS_ARTIFACT || settings.apiKey)) {
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

  const current =
    view.name !== "library" && view.clipId ? clips?.find((c) => c.id === view.clipId) : undefined;

  return (
    <div className="min-h-screen">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-washi-dark bg-washi/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              setView({ name: "library" });
              void refresh();
            }}
            className="flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-shu font-display text-lg text-white jp">
              言
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-lg font-bold">Kotoba Clips</span>
              <span className="block text-xs text-sumi-soft">Learn Japanese from anime scenes</span>
            </span>
          </button>
          <div className="flex-1" />
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
        {clips === null ? (
          <p className="py-20 text-center text-sumi-soft">Loading…</p>
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
