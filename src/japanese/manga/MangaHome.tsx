import { useEffect, useState } from "react";
import { IS_ARTIFACT } from "../env";
import { imageLimit } from "../claudeAccount";
import { LEVELS, type JlptLevel } from "../types";
import { STYLES } from "./prompts";
import { stripRuby } from "./Ruby";
import { lessonProgress } from "./score";
import type { MangaLesson, StyleKey } from "./types";

export function MangaHome({
  lessons,
  level,
  onLevel,
  busy,
  error,
  onGenerate,
  onFromPages,
  onOpen,
  onDelete,
}: {
  lessons: MangaLesson[];
  level: JlptLevel;
  onLevel: (l: JlptLevel) => void;
  busy: string | null;
  error: string | null;
  onGenerate: (style: StyleKey, pages: number) => void;
  onFromPages: (files: File[]) => void;
  onOpen: (id: string) => void;
  onDelete: (lesson: MangaLesson) => void;
}) {
  const [style, setStyle] = useState<StyleKey>("random");
  const [pages, setPages] = useState(3);
  const [maxImages, setMaxImages] = useState<number | null>(IS_ARTIFACT ? null : 4);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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
          {maxImages === null ? (
            <p className="mt-2 text-sm text-sumi-soft">Checking whether this view can send images…</p>
          ) : maxImages === 0 ? (
            <p className="mt-2 text-sm text-sumi-soft">
              Sending images to Claude isn't available in this view. Open the page on claude.ai or in
              the Claude app to use your own pages.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-sumi-soft">
                Add 1–{maxImages} screenshots or photos of consecutive pages, in reading order, for
                example from a free chapter in an official manga app.
              </p>
              <label
                className={`mt-4 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-sumi/20 px-4 py-6 text-sm font-medium hover:bg-washi ${
                  busy ? "pointer-events-none opacity-40" : ""
                }`}
              >
                📷 Choose pages
                <input
                  id="manga-pages"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).slice(0, maxImages);
                    e.target.value = "";
                    if (files.length) onFromPages(files);
                  }}
                />
              </label>
            </>
          )}
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
                  <span className="jp">{lesson.source === "pages" ? "📷 Your pages" : styleLabel?.jp ?? "Story"}</span>
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
