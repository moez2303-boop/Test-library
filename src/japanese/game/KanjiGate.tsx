import { useMemo, useState } from "react";
import { speakJapanese } from "../util";
import { WORDS, loadStats, saveStats, shuffle, type GameWord } from "./words";

const hasKanji = (s: string) => /[一-鿿]/.test(s);
const KANJI_WORDS = WORDS.filter((w) => hasKanji(w.word));
const PASS_KEY = "kotoba.gatePasses";

interface Question {
  word: GameWord;
  options: string[];
}

/** How alike two readings look: same length, same first sound, shared kana. */
function similarity(a: string, b: string): number {
  let score = 0;
  if (a.length === b.length) score += 2;
  if (a[0] === b[0]) score += 3;
  if (a.at(-1) === b.at(-1)) score += 1.5; // e.g. verbs ending in る
  for (const ch of new Set(a)) if (b.includes(ch)) score += 1;
  return score + Math.random(); // a little variety between plays
}

/** A kanji word plus the 3 most similar-looking readings from the other words. */
function makeQuestion(): Question {
  const word = KANJI_WORDS[Math.floor(Math.random() * KANJI_WORDS.length)];
  const decoys: string[] = [];
  const ranked = KANJI_WORDS.filter((w) => w.reading !== word.reading)
    .map((w) => ({ r: w.reading, s: similarity(word.reading, w.reading) }))
    .sort((x, y) => y.s - x.s);
  for (const { r } of ranked) {
    if (!decoys.includes(r)) decoys.push(r);
    if (decoys.length === 3) break;
  }
  return { word, options: shuffle([word.reading, ...decoys]) };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadPasses(): { day: string; count: number } {
  try {
    const p = JSON.parse(localStorage.getItem(PASS_KEY) ?? "null") as { day: string; count: number } | null;
    return p && p.day === todayKey() ? p : { day: todayKey(), count: 0 };
  } catch {
    return { day: todayKey(), count: 0 };
  }
}

/**
 * The kanji gate: one random kanji word, four readings. Answer correctly to
 * pass. Opened at #kanji-gate, e.g. by a phone automation when Instagram opens.
 */
export function KanjiGate({ onOpenApp }: { onOpenApp: () => void }) {
  const [q, setQ] = useState(makeQuestion);
  const [picked, setPicked] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [passes, setPasses] = useState(loadPasses);
  const passed = picked === q.word.reading;
  const levelLabel = useMemo(() => q.word.level, [q]);

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
    setTries((t) => t + 1);
    const right = o === q.word.reading;
    speakJapanese(q.word.reading);
    // Shared with the word games' progress.
    const stats = loadStats();
    const s = stats[q.word.word] ?? { right: 0, wrong: 0, last: 0 };
    stats[q.word.word] = { right: s.right + (right ? 1 : 0), wrong: s.wrong + (right ? 0 : 1), last: Date.now() };
    saveStats(stats);
    if (right) {
      const next = { day: todayKey(), count: loadPasses().count + 1 };
      setPasses(next);
      try {
        localStorage.setItem(PASS_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    }
  };

  const another = () => {
    setQ(makeQuestion());
    setPicked(null);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-4 pt-[calc(env(safe-area-inset-top,0px)+24px)] pb-[calc(env(safe-area-inset-bottom,0px)+24px)]">
      <div className="flex items-center gap-2 text-sm text-sumi-soft">
        <span className="jp grid h-8 w-8 place-items-center rounded-full bg-shu font-display text-white">言</span>
        <span className="flex-1">Kanji gate</span>
        <span className="tabular-nums">Today: {passes.count} ✓</span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p className="text-center text-sm text-sumi-soft">
          How do you read this? <span className="ml-1 rounded-full bg-washi-dark px-2 py-0.5 text-xs">{levelLabel}</span>
        </p>
        <p className="jp mt-4 text-center font-display text-6xl font-bold">{q.word.word}</p>
        {picked && <p className="mt-3 text-center text-sm text-sumi-soft">= {q.word.en}</p>}

        <div className="mt-8 grid grid-cols-2 gap-3">
          {q.options.map((o) => {
            const style = !picked
              ? "border-sumi/15 bg-card hover:border-sumi/40"
              : o === q.word.reading
                ? "border-matcha bg-matcha/10"
                : o === picked
                  ? "border-shu bg-shu/10"
                  : "border-sumi/10 bg-card opacity-50";
            return (
              <button
                key={o}
                disabled={!!picked}
                onClick={() => choose(o)}
                className={`jp min-h-16 rounded-2xl border-2 px-3 text-xl ${style}`}
              >
                {o}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={`mt-6 rounded-2xl p-5 text-center ${passed ? "bg-matcha/10" : "bg-shu/10"}`}>
            {passed ? (
              <>
                <p className="jp font-display text-2xl font-bold">正解！</p>
                <p className="mt-1 text-sm">
                  You're through{tries > 1 ? ` (after ${tries} tries)` : ""}. Go back to your app: tap ◀ at the
                  top-left of the screen, or switch apps.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={another} className="rounded-full border border-sumi/15 px-4 py-2 text-sm hover:bg-card">
                    One more
                  </button>
                  <button onClick={onOpenApp} className="rounded-full bg-sumi px-4 py-2 text-sm font-semibold text-washi">
                    Open Kotoba Clips
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  Not quite: it's <span className="jp">{q.word.word}（{q.word.reading}）</span>.
                </p>
                <p className="mt-1 text-sm">Get one right to pass.</p>
                <button
                  onClick={another}
                  autoFocus
                  className="mt-4 rounded-full bg-shu px-6 py-2.5 text-sm font-semibold text-white"
                >
                  Next kanji →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
