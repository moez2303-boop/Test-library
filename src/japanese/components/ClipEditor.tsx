import { useState } from "react";
import { saveClip } from "../db";
import { GraderError, generateQuestions } from "../grader";
import { LEVELS, type Clip, type JlptLevel, type Question, type Settings } from "../types";
import { IS_ARTIFACT } from "../env";
import { fetchTikTokInfo } from "../tiktok";
import {
  extractUrl,
  formatTime,
  parseTikTokId,
  parseTime,
  parseYouTubeId,
  parseYouTubeStart,
  uid,
} from "../util";

type SourceTab = "tiktok" | "youtube" | "file" | "none";

const input =
  "mt-1 w-full rounded-lg border border-sumi/20 bg-card px-3 py-2 text-sm focus:border-shu focus:outline-none";

export function ClipEditor({
  clip,
  settings,
  onCancel,
  onSaved,
  onNeedSettings,
}: {
  clip: Clip | null;
  settings: Settings;
  onCancel: () => void;
  onSaved: (id: string) => void;
  onNeedSettings: () => void;
}) {
  const [title, setTitle] = useState(clip?.title ?? "");
  const [anime, setAnime] = useState(clip?.anime ?? "");
  const [level, setLevel] = useState<JlptLevel>(clip?.level ?? "N5");
  const [tab, setTab] = useState<SourceTab>(clip?.source.kind ?? "tiktok");
  const [tiktokUrl, setTiktokUrl] = useState(clip?.source.kind === "tiktok" ? clip.source.url : "");
  const [caption, setCaption] = useState(clip?.caption ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(
    clip?.source.kind === "youtube" ? `https://youtu.be/${clip.source.videoId}` : "",
  );
  const [file, setFile] = useState<File | null>(null);
  const existingFileName = clip?.source.kind === "file" ? clip.source.fileName : null;
  const [start, setStart] = useState(formatTime(clip?.start ?? 0));
  const [end, setEnd] = useState(formatTime(clip?.end ?? 0));
  const [transcript, setTranscript] = useState(clip?.transcript ?? "");
  const [translation, setTranslation] = useState(clip?.translation ?? "");
  const [questions, setQuestions] = useState<Question[]>(clip?.questions ?? []);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startSec = parseTime(start);
  const endSec = parseTime(end);
  const timeError =
    Number.isNaN(startSec) || Number.isNaN(endSec)
      ? "Use times like 1:23 or 83."
      : endSec && endSec <= startSec
        ? "End must be after start."
        : null;
  const lengthNote =
    !timeError && endSec ? `${Math.round(endSec - startSec)} s clip` : "Plays to the end of the video";

  const buildClip = async (): Promise<Clip | string> => {
    if (!title.trim()) return "Give the clip a title.";
    if (timeError) return timeError;
    let source: Clip["source"];
    if (tab === "tiktok") {
      const url = extractUrl(tiktokUrl);
      const prev = clip?.source.kind === "tiktok" && clip.source.url === url ? clip.source : null;
      let videoId = prev?.videoId ?? parseTikTokId(url);
      let author = prev?.author ?? url.match(/@([\w.-]+)/)?.[1];
      let thumbnail = prev?.thumbnail;
      if (!prev && !IS_ARTIFACT) {
        const info = await fetchTikTokInfo(url);
        videoId = info?.videoId ?? videoId;
        author = info?.author || author;
        thumbnail = info?.thumbnail || undefined;
        if (info?.caption && !caption) setCaption(info.caption);
      }
      if (!/tiktok\.com\//.test(url)) return "That doesn't look like a TikTok link.";
      if (!videoId && !IS_ARTIFACT)
        return "Couldn't read that TikTok link. Use the full address that contains /video/….";
      source = { kind: "tiktok", videoId: videoId ?? "", url, author, thumbnail };
    } else if (tab === "youtube") {
      const id = parseYouTubeId(youtubeUrl);
      if (!id) return "That doesn't look like a YouTube link.";
      source = { kind: "youtube", videoId: id };
    } else if (tab === "file") {
      const name = file?.name ?? existingFileName;
      if (!name) return "Choose a video file.";
      source = { kind: "file", fileName: name };
    } else {
      source = { kind: "none" };
    }
    return {
      id: clip?.id ?? uid(),
      title: title.trim(),
      anime: anime.trim(),
      level,
      source,
      start: startSec,
      end: endSec,
      transcript,
      translation,
      caption: caption.trim() || undefined,
      questions: questions
        .map((q) => ({
          ...q,
          prompt: q.prompt.trim(),
          promptEn: q.promptEn?.trim() || undefined,
          referenceAnswer: q.referenceAnswer?.trim() || undefined,
        }))
        .filter((q) => q.prompt),
      createdAt: clip?.isDemo ? Date.now() : (clip?.createdAt ?? Date.now()),
      isDemo: clip?.isDemo && tab === "none" ? true : undefined,
    };
  };

  const save = async () => {
    setSaving(true);
    const built = await buildClip();
    if (typeof built === "string") {
      setSaving(false);
      return setError(built);
    }
    await saveClip(built, tab === "file" ? file : null);
    setSaving(false);
    onSaved(built.id);
  };

  const generate = async () => {
    if (!IS_ARTIFACT && !settings.apiKey) return onNeedSettings();
    setGenerating(true);
    setError(null);
    try {
      const generated = await generateQuestions(settings, buildClipLoose(), 4);
      setQuestions((prev) => [...prev, ...generated.map((q) => ({ ...q, id: uid() }))]);
    } catch (err) {
      setError(err instanceof GraderError ? err.message : "Couldn't generate questions.");
    } finally {
      setGenerating(false);
    }
  };

  // A permissive Clip for question generation (validation isn't needed there).
  const buildClipLoose = (): Clip => ({
    id: clip?.id ?? "draft",
    title: title || "Untitled clip",
    anime,
    level,
    source: { kind: "none" },
    start: 0,
    end: 0,
    transcript,
    translation,
    caption,
    questions: [],
    createdAt: 0,
  });

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onCancel} className="mb-4 text-sm text-sumi-soft hover:text-sumi">
        ← Back
      </button>
      <h1 className="font-display text-2xl font-bold">{clip ? "Edit clip" : "Add a clip"}</h1>

      <section className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">1. Clip details</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block text-sm font-medium">
            Title
            <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The confession on the rooftop" />
          </label>
          <label className="block text-sm font-medium">
            Anime
            <input className={input} value={anime} onChange={(e) => setAnime(e.target.value)} placeholder="Series, episode" />
          </label>
          <label className="block text-sm font-medium">
            Level
            <select className={input} value={level} onChange={(e) => setLevel(e.target.value as JlptLevel)}>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">2. Video</h2>
        <div className="mt-3 inline-flex overflow-hidden rounded-full border border-sumi/15 text-sm">
          {(
            [
              ["tiktok", "TikTok"],
              ["youtube", "YouTube"],
              ["file", "Video file"],
              ["none", "No video"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-1.5 ${tab === value ? "bg-sumi text-washi" : "hover:bg-washi"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "tiktok" && (
          <label className="mt-4 block text-sm font-medium">
            TikTok link
            <input
              className={input}
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@…/video/…"
              inputMode="url"
            />
          </label>
        )}
        {tab === "youtube" && (
          <label className="mt-4 block text-sm font-medium">
            YouTube URL
            <input
              className={input}
              value={youtubeUrl}
              onChange={(e) => {
                setYoutubeUrl(e.target.value);
                const t = parseYouTubeStart(e.target.value);
                if (t !== null && !start) setStart(formatTime(t) || "0:00");
              }}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </label>
        )}
        {tab === "file" && (
          <label className="mt-4 block text-sm font-medium">
            Video file (mp4, webm…) — kept only in this browser
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-sumi file:px-4 file:py-1.5 file:text-washi"
            />
            {!file && existingFileName && (
              <span className="mt-1 block text-xs text-sumi-soft">Current: {existingFileName}</span>
            )}
          </label>
        )}
        {tab === "none" && (
          <p className="mt-4 text-sm text-sumi-soft">
            Practice from the transcript only. You can attach a video later.
          </p>
        )}

        {(tab === "youtube" || tab === "file") && (
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="block w-28 text-sm font-medium">
              Start
              <input className={input} value={start} onChange={(e) => setStart(e.target.value)} placeholder="0:00" />
            </label>
            <label className="block w-28 text-sm font-medium">
              End
              <input className={input} value={end} onChange={(e) => setEnd(e.target.value)} placeholder="0:30" />
            </label>
            <span className={`pb-2 text-sm ${timeError ? "text-shu" : "text-sumi-soft"}`}>
              {timeError ?? lengthNote}
            </span>
          </div>
        )}
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">
          3. Script <span className="font-normal text-sumi-soft">(optional)</span>
        </h2>
        <p className="mt-1 text-sm text-sumi-soft">
          The grader can't watch the video. With the dialogue it can also check that your answers
          match what happens; without it, it grades your Japanese and whether you answered the
          question.
        </p>
        <label className="mt-3 block text-sm font-medium">
          Japanese dialogue
          <textarea
            className={`${input} jp min-h-32 text-base`}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            lang="ja"
            placeholder={"A：おはよう！\nB：おはよう。今日は早いね。"}
          />
        </label>
        {tab === "tiktok" && (
          <label className="mt-3 block text-sm font-medium">
            TikTok caption
            <textarea
              className={`${input} jp min-h-16`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Filled in from TikTok when available"
            />
          </label>
        )}
        <label className="mt-3 block text-sm font-medium">
          English translation <span className="font-normal text-sumi-soft">(optional)</span>
          <textarea
            className={`${input} min-h-20`}
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
          />
        </label>
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="flex-1 font-semibold">4. Questions</h2>
          <button
            onClick={() => void generate()}
            disabled={generating || (!transcript.trim() && !caption.trim())}
            className="rounded-full border border-ai/30 px-4 py-1.5 text-sm font-medium text-ai hover:bg-ai/5 disabled:opacity-40"
            title={transcript.trim() || caption.trim() ? "" : "Add the script first"}
          >
            {generating ? "Writing questions…" : "✨ Suggest questions"}
          </button>
          <button
            onClick={() => setQuestions((qs) => [...qs, { id: uid(), prompt: "" }])}
            className="rounded-full border border-sumi/15 px-4 py-1.5 text-sm hover:bg-washi"
          >
            + Add
          </button>
        </div>

        {questions.length === 0 && (
          <p className="mt-3 text-sm text-sumi-soft">
            No questions yet. Write your own, or let Claude suggest some from the script.
          </p>
        )}
        <ol className="mt-3 space-y-4">
          {questions.map((q, i) => (
            <li key={q.id} className="rounded-xl bg-washi p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Q{i + 1}</span>
                <div className="flex-1" />
                <button
                  onClick={() => setQuestions((qs) => qs.filter((x) => x.id !== q.id))}
                  className="text-xs text-shu hover:underline"
                >
                  Remove
                </button>
              </div>
              <input
                className={`${input} jp text-base`}
                value={q.prompt}
                onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                placeholder="質問（日本語）"
                lang="ja"
              />
              <input
                className={input}
                value={q.promptEn ?? ""}
                onChange={(e) => updateQuestion(q.id, { promptEn: e.target.value })}
                placeholder="English hint (optional)"
              />
              <input
                className={`${input} jp`}
                value={q.referenceAnswer ?? ""}
                onChange={(e) => updateQuestion(q.id, { referenceAnswer: e.target.value })}
                placeholder="Reference answer (optional — leave empty for open questions)"
                lang="ja"
              />
            </li>
          ))}
        </ol>
      </section>

      {error && <p className="mt-4 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}

      <div className="sticky bottom-0 mt-6 flex justify-end gap-2 border-t border-washi-dark bg-washi/95 py-4">
        <button onClick={onCancel} className="rounded-full px-4 py-2 text-sm hover:bg-washi-dark">
          Cancel
        </button>
        <button
          onClick={() => void save()}
          disabled={saving}
          className="rounded-full bg-shu px-6 py-2 text-sm font-semibold text-white hover:bg-shu-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save clip"}
        </button>
      </div>
    </div>
  );
}
