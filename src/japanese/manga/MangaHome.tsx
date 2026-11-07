import { useEffect, useState } from "react";
import { IS_ARTIFACT } from "../env";
import { imageLimit } from "../claudeAccount";
import { LEVELS, type JlptLevel } from "../types";
import { STYLES } from "./prompts";
import { stripRuby } from "./Ruby";
import { lessonProgress } from "./score";
import type { MangaLesson, StyleKey } from "./types";
import { openPdf, readTextFile, splitText, type OpenPdf } from "./files";

type Pending =
  | { kind: "pdf"; name: string; pdf: OpenPdf; start: number }
  | { kind: "txt"; name: string; parts: string[]; part: number };

export function MangaHome({
  lessons,
  level,
  onLevel,
  busy,
  error,
  onGenerate,
  onFromPages,
  onFromText,
  onOpen,
  onDelete,
}: {
  lessons: MangaLesson[];
  level: JlptLevel;
  onLevel: (l: JlptLevel) => void;
  busy: string | null;
  error: string | null;
  onGenerate: (style: StyleKey, pages: number) => void;
  onFromPages: (images: Blob[], label?: string, textLayer?: string) => void;
  onFromText: (text: string, label: string) => void;
  onOpen: (id: string) => void;
  onDelete: (lesson: MangaLesson) => void;
}) {
  const [style, setStyle] = useState<StyleKey>("random");
  const [pages, setPages] = useState(3);
  const [maxImages, setMaxImages] = useState<number | null>(IS_ARTIFACT ? null : 4);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const perLesson = Math.max(1, Math.min(4, maxImages ?? 4));

  const chooseFiles = async (files: File[]) => {
    setFileError(null);
    setPending(null);
    const first = files[0];
    const isPdf = first.type === "application/pdf" || /\.pdf$/i.test(first.name);
    const isTxt = first.type.startsWith("text/") || /\.txt$/i.test(first.name);
    try {
      if (isTxt) {
        const parts = splitText(await readTextFile(first));
        if (!parts.length) return setFileError("That text file is empty.");
        if (parts.length === 1) return onFromText(parts[0], first.name);
        return setPending({ kind: "txt", name: first.name, parts, part: 0 });
      }
      if (!maxImages) {
        return setFileError("This view can't send images or PDF pages to Claude. Open the page on claude.ai or in the Claude app, or use a .txt file.");
      }
      if (isPdf) {
        setOpening(true);
        const pdf = await openPdf(first);
        setOpening(false);
        if (!pdf.pageCount) return setFileError("That PDF has no pages.");
        if (pdf.pageCount <= perLesson) {
          const images = await pdf.render(1, pdf.pageCount);
          return onFromPages(images, first.name, await pdf.text(1, pdf.pageCount));
        }
        return setPending({ kind: "pdf", name: first.name, pdf, start: 1 });
      }
      const images = files.filter((f) => f.type.startsWith("image/")).slice(0, perLesson);
      if (!images.length) return setFileError("Choose images, a PDF or a .txt file.");
      onFromPages(images);
    } catch {
      setOpening(false);
      setFileError(isPdf ? "Couldn't open that PDF. It may be damaged or password-protected." : "Couldn't read that file.");
    }
  };

  const startPending = async () => {
    if (!pending) return;
    if (pending.kind === "txt") {
      onFromText(pending.parts[pending.part], `${pending.name} · part ${pending.part + 1}/${pending.parts.length}`);
    } else {
      const { pdf, start, name } = pending;
      const end = Math.min(pdf.pageCount, start + perLesson - 1);
      setOpening(true);
      try {
        const images = await pdf.render(start, end - start + 1);
        const text = await pdf.text(start, end - start + 1);
        onFromPages(images, `${name} · p.${start}–${end}`, text);
      } catch {
        setFileError("Couldn't render those PDF pages.");
      } finally {
        setOpening(false);
      }
    }
    setPending(null);
  };

  useEffect(() => {
    if (IS_ARTIFACT) void imageLimit().then((n) => setMaxImages(Math.min(4, n)));
  }, []);

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm ${active ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi"}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Manga reading</h1>
        <p className="mt-1 max-w-2xl text-sm text-sumi-soft">
          Read a few manga pages in Japanese, then work through a random mix of exercises:
          questions, vocabulary, grammar, readings, and writing what happens next.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm text-sumi-soft">Your level</span>
        {LEVELS.map((l) => (
          <button key={l} onClick={() => onLevel(l)} className={chip(level === l)}>
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">New story</div>
          <h2 className="mt-1 font-semibold">A new manga chapter, written for your level</h2>
          <p className="mt-1 text-sm text-sumi-soft">Original characters, with furigana on harder kanji.</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {STYLES.map((s) => (
              <button key={s.key} onClick={() => setStyle(s.key)} className={chip(style === s.key)}>
                <span className="jp">{s.jp}</span>
                <span className="ml-1.5 text-xs opacity-70">{s.en}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-sumi-soft">Pages</span>
              {[3, 4].map((n) => (
                <button key={n} onClick={() => setPages(n)} className={chip(pages === n)}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <button
              onClick={() => onGenerate(style, pages)}
              disabled={busy !== null}
              className="rounded-full bg-shu px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-shu-dark disabled:opacity-40"
            >
              {busy ?? "✍️ Write my manga"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">Your own pages</div>
          <h2 className="mt-1 font-semibold">Study pages from manga you're reading</h2>
          <p className="mt-1 text-sm text-sumi-soft">
            {maxImages === 0
              ? "Add a .txt file with the manga's text. (Images and PDFs need the page open on claude.ai or in the Claude app.)"
              : `Add screenshots or photos of up to ${perLesson} consecutive pages, a PDF of a chapter, or a .txt file with the text.`}
          </p>

          {pending ? (
            <div className="mt-4 rounded-xl bg-washi p-4 text-sm">
              <div className="truncate font-medium">{pending.name}</div>
              {pending.kind === "pdf" ? (
                <>
                  <p className="mt-1 text-sumi-soft">
                    {pending.pdf.pageCount} pages. Each lesson uses {perLesson}.
                  </p>
                  <label className="mt-3 flex flex-wrap items-center gap-2" htmlFor="pdf-start">
                    <span>Start at page</span>
                    <input
                      id="pdf-start"
                      type="number"
                      min={1}
                      max={pending.pdf.pageCount}
                      value={pending.start}
                      onChange={(e) => {
                        const n = Math.max(1, Math.min(pending.pdf.pageCount, Number(e.target.value) || 1));
                        setPending({ ...pending, start: n });
                      }}
                      className="w-20 rounded-lg border border-sumi/20 bg-card px-2 py-1"
                    />
                    <span className="text-sumi-soft">
                      → pages {pending.start}–{Math.min(pending.pdf.pageCount, pending.start + perLesson - 1)}
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sumi-soft">Long text, split into {pending.parts.length} parts. Each lesson reads one.</p>
                  <label className="mt-3 flex items-center gap-2" htmlFor="txt-part">
                    <span>Part</span>
                    <select
                      id="txt-part"
                      value={pending.part}
                      onChange={(e) => setPending({ ...pending, part: Number(e.target.value) })}
                      className="rounded-lg border border-sumi/20 bg-card px-2 py-1"
                    >
                      {pending.parts.map((_, i) => (
                        <option key={i} value={i}>
                          {i + 1} of {pending.parts.length}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="jp mt-2 line-clamp-3 text-sumi-soft">{pending.parts[pending.part]}</p>
                </>
              )}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setPending(null)} className="rounded-full px-4 py-2 hover:bg-washi-dark">
                  Cancel
                </button>
                <button
                  onClick={() => void startPending()}
                  disabled={busy !== null || opening}
                  className="flex-1 rounded-full bg-shu px-4 py-2 font-semibold text-white hover:bg-shu-dark disabled:opacity-40"
                >
                  {opening ? "Preparing pages…" : "Make my lesson"}
                </button>
              </div>
            </div>
          ) : (
            <label
              className={`mt-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-sumi/20 px-4 py-6 text-center text-sm font-medium hover:bg-washi ${
                busy || opening || maxImages === null ? "pointer-events-none opacity-40" : ""
              }`}
            >
              {opening ? "Opening…" : maxImages === null ? "Checking…" : "📄 Choose images, a PDF or a .txt file"}
              <input
                id="manga-pages"
                type="file"
                accept={maxImages === 0 ? ".txt,text/plain" : "image/*,.pdf,application/pdf,.txt,text/plain"}
                multiple
                className="sr-only"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (files.length) void chooseFiles(files);
                }}
              />
            </label>
          )}
          {fileError && <p className="mt-3 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{fileError}</p>}
        </section>
      </div>

      {error && <p className="mt-4 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}

      <h2 className="mt-8 mb-3 font-semibold">Your lessons</h2>
      {lessons.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sumi/15 p-10 text-center">
          <p className="jp text-2xl">まだレッスンがありません</p>
          <p className="mt-2 text-sm text-sumi-soft">
            Write a new story or add your own pages, and your lessons will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => {
            const p = lessonProgress(lesson);
            const styleLabel = STYLES.find((s) => s.key === lesson.style);
            return (
              <article key={lesson.id} className="flex flex-col rounded-2xl bg-card p-4 shadow-sm ring-1 ring-sumi/5">
                <div className="flex items-center gap-2 text-xs text-sumi-soft">
                  <span className="rounded-full bg-washi-dark px-2 py-0.5 font-bold text-sumi">{lesson.level}</span>
                  <span className="jp">{lesson.source === "pages" ? "📷 Your pages" : lesson.source === "text" ? "📄 Your text" : lesson.topic ?? styleLabel?.jp ?? "Story"}</span>
                  <span className="ml-auto">{lesson.pageCount} pages</span>
                </div>
                <h3 className="jp mt-2 text-lg font-bold">{stripRuby(lesson.title)}</h3>
                <p className="text-sm text-sumi-soft">{lesson.titleEn}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 text-sm">
                  <span className="text-sumi-soft">
                    {p.done}/{p.total} exercises
                  </span>
                  {p.choiceAnswered > 0 && (
                    <span>
                      ✓ {p.choiceCorrect}/{p.choiceAnswered}
                    </span>
                  )}
                  {p.writingAvg !== null && <span>✍️ {p.writingAvg}</span>}
                </div>
                {confirmingId === lesson.id ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-shu/10 p-2 text-sm">
                    <span className="flex-1 px-1">Delete this lesson?</span>
                    <button onClick={() => setConfirmingId(null)} className="rounded-full px-3 py-1.5 hover:bg-card">
                      Keep
                    </button>
                    <button
                      onClick={() => {
                        setConfirmingId(null);
                        onDelete(lesson);
                      }}
                      className="rounded-full bg-shu px-3 py-1.5 font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onOpen(lesson.id)}
                      className="flex-1 rounded-full bg-sumi px-3 py-2 text-sm font-semibold text-washi hover:bg-sumi/85"
                    >
                      {p.done === 0 ? "Read" : p.done < p.total ? "Continue" : "Review"}
                    </button>
                    <button
                      onClick={() => setConfirmingId(lesson.id)}
                      className="rounded-full border border-sumi/15 px-3 py-2 text-sm text-shu hover:bg-shu/5"
                      aria-label="Delete lesson"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
