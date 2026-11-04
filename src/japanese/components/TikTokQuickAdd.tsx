import { useState } from "react";
import { saveClip } from "../db";
import { IS_ARTIFACT } from "../env";
import { generateQuestions } from "../grader";
import { GENERIC_QUESTIONS, TIKTOK_SEARCHES, fetchTikTokInfo, tiktokSearchUrl } from "../tiktok";
import { LEVELS, type Clip, type JlptLevel, type Settings } from "../types";
import { extractUrl, isTikTokLink, loadLevel, parseTikTokId, saveLevel, uid } from "../util";

function cleanCaption(caption: string) {
  return caption.replace(/#[^\s#]+/g, "").replace(/\s+/g, " ").trim();
}

export function TikTokQuickAdd({
  settings,
  onClose,
  onAdded,
}: {
  settings: Settings;
  onClose: () => void;
  onAdded: (id: string) => void;
}) {
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [level, setLevel] = useState<JlptLevel>(loadLevel);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Reading the clipboard is blocked on claude.ai; the system Paste still works there.
  const canPaste =
    !IS_ARTIFACT && typeof navigator !== "undefined" && !!navigator.clipboard?.readText;

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setLink(text);
    } catch {
      setError("Couldn't read the clipboard — long-press the box and choose Paste.");
    }
  };

  const add = async () => {
    setError(null);
    const url = extractUrl(link);
    if (!isTikTokLink(url) && !parseTikTokId(url)) {
      setError("That doesn't look like a TikTok link. In TikTok, tap Share → Copy link, then paste it here.");
      return;
    }
    saveLevel(level);

    // On claude.ai the page can't reach TikTok, so clips open in TikTok instead of
    // playing inline and any link (short ones too) is fine as it is.
    if (!IS_ARTIFACT) setStatus("Looking up the video…");
    const info = IS_ARTIFACT ? null : await fetchTikTokInfo(url);
    const videoId = info?.videoId ?? parseTikTokId(url) ?? "";
    if (!videoId && !IS_ARTIFACT) {
      setStatus(null);
      setError(
        "TikTok didn't answer for this short link. Open the video in your browser and copy the full address (it contains /video/…), then paste that instead.",
      );
      return;
    }

    const caption = cleanCaption([info?.caption ?? "", notes].filter(Boolean).join("\n"));
    const author = info?.author ?? url.match(/@([\w.-]+)/)?.[1] ?? "";
    const clip: Clip = {
      id: uid(),
      title: caption ? caption.slice(0, 60) : `TikTok clip${author ? ` by @${author}` : ""}`,
      anime: author ? `@${author} on TikTok` : "TikTok",
      level,
      source: {
        kind: "tiktok",
        videoId,
        url: url.includes("/video/") || !videoId ? url : `https://www.tiktok.com/@${author || "_"}/video/${videoId}`,
        author: author || undefined,
        thumbnail: info?.thumbnail || undefined,
      },
      start: 0,
      end: 0,
      transcript: "",
      translation: "",
      caption: caption || undefined,
      questions: GENERIC_QUESTIONS.map((q) => ({ ...q, id: uid() })),
      createdAt: Date.now(),
    };

    if (caption && (IS_ARTIFACT || settings.apiKey)) {
      setStatus("Writing questions for this clip…");
      try {
        const generated = await generateQuestions(settings, clip, 3);
        if (generated.length) clip.questions = generated.map((q) => ({ ...q, id: uid() }));
      } catch {
        /* keep the general questions */
      }
    }

    await saveClip(clip);
    setStatus(null);
    onAdded(clip.id);
  };

  const busy = status !== null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-sumi/40 sm:place-items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="font-display text-xl font-bold">Add a TikTok clip</h2>
        <p className="mt-1 text-sm text-sumi-soft">
          Find an anime clip on TikTok, tap <b>Share → Copy link</b>, and paste it here. The
          app sets up questions for you.
          {IS_ARTIFACT && " The video opens in TikTok; come back here to answer."}
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.tiktok.com/@…/video/…"
            inputMode="url"
            autoComplete="off"
            id="tiktok-link"
            className="min-w-0 flex-1 rounded-lg border border-sumi/20 px-3 py-2 text-sm focus:border-shu focus:outline-none"
            disabled={busy}
          />
          {canPaste && (
            <button
              onClick={() => void paste()}
              disabled={busy}
              className="rounded-lg border border-sumi/15 px-3 text-sm hover:bg-washi"
            >
              Paste
            </button>
          )}
        </div>

        <label className="mt-4 block text-sm font-medium" htmlFor="tiktok-notes">
          What's said in the clip? <span className="font-normal text-sumi-soft">(optional)</span>
        </label>
        <textarea
          id="tiktok-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          lang="ja"
          placeholder="Paste the caption or a line you hear — questions and grading get more specific"
          className="jp mt-1 w-full rounded-lg border border-sumi/20 bg-card px-3 py-2 text-sm focus:border-shu focus:outline-none"
          disabled={busy}
        />

        <div className="mt-4">
          <div className="text-sm font-medium">Your level</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                disabled={busy}
                className={`rounded-full px-3 py-1 text-sm ${
                  level === l ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mt-4 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}

        <button
          onClick={() => void add()}
          disabled={busy || !link.trim()}
          className="mt-5 w-full rounded-full bg-shu py-2.5 text-sm font-semibold text-white hover:bg-shu-dark disabled:opacity-40"
        >
          {status ?? "Add clip"}
        </button>

        <div className="mt-6 border-t border-washi-dark pt-4">
          <div className="text-sm font-medium">Need a clip? Search TikTok</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TIKTOK_SEARCHES.map((s) => (
              <a
                key={s.query}
                href={tiktokSearchUrl(s.query)}
                target="_blank"
                rel="noreferrer"
                className="jp rounded-full bg-washi px-3 py-1 text-sm hover:bg-washi-dark"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
