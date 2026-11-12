import { useEffect, useMemo, useRef, useState } from "react";
import { speakJapanese } from "../util";
import {
  WORDS,
  isMastered,
  loadStats,
  pickRound,
  saveStats,
  shuffle,
  type GameWord,
  type WordLevel,
} from "./words";

const PAIRS = 6;
/** One color per matched pair, so you can see which words go together. */
const PAIR_COLORS = [
  "bg-matcha/15 border-matcha text-matcha",
  "bg-ai/15 border-ai text-ai",
  "bg-kin/15 border-kin text-kin",
  "bg-shu/10 border-shu text-shu",
  "bg-[#7a5ea8]/15 border-[#7a5ea8] text-[#7a5ea8]",
  "bg-[#2e8b84]/15 border-[#2e8b84] text-[#2e8b84]",
];

type Filter = WordLevel | "all";
type Side = "en" | "jp";

function loadPref<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const hasKanji = (s: string) => /[一-鿿]/.test(s);

export function WordMatchGame() {
  const [filter, setFilter] = useState<Filter>(() => loadPref("kotoba.gameLevel", "all", ["all", "N3", "N2"] as const));
  const [furigana, setFurigana] = useState(() => loadPref("kotoba.gameFurigana", "on", ["on", "off"] as const) === "on");
  const [stats, setStats] = useState(loadStats);
  const pool = useMemo(() => (filter === "all" ? WORDS : WORDS.filter((w) => w.level === filter)), [filter]);

  const [round, setRound] = useState<GameWord[]>([]);
  const [enOrder, setEnOrder] = useState<GameWord[]>([]);
  const [jpOrder, setJpOrder] = useState<GameWord[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [missed, setMissed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<{ side: Side; word: string } | null>(null);
  const [wrong, setWrong] = useState<{ en: string; jp: string } | null>(null);
  const [roundNo, setRoundNo] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem("kotoba.gameBest")) || 0;
    } catch {
      return 0;
    }
  });
  const recent = useRef<Set<string>>(new Set());

  const newRound = (p = pool) => {
    const words = pickRound(p, loadStats(), PAIRS, recent.current);
    recent.current = new Set(words.map((w) => w.word));
    setRound(words);
    setEnOrder(shuffle(words));
    setJpOrder(shuffle(words));
    setMatched([]);
    setMissed(new Set());
    setSelected(null);
    setWrong(null);
    setRoundNo((n) => n + 1);
  };

  useEffect(() => {
    newRound(pool);
    // A new round whenever the level filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  const recordStat = (word: string, firstTry: boolean) => {
    setStats((prev) => {
      const s = prev[word] ?? { right: 0, wrong: 0, last: 0 };
      const next = {
        ...prev,
        [word]: {
          right: s.right + (firstTry ? 1 : 0),
          wrong: s.wrong + (firstTry ? 0 : 1),
          last: Date.now(),
        },
      };
      saveStats(next);
      return next;
    });
  };

  const tap = (side: Side, word: string) => {
    if (matched.includes(word) || wrong) return;
    if (!selected || selected.side === side) {
      setSelected(selected?.word === word && selected.side === side ? null : { side, word });
      return;
    }
    const en = side === "en" ? word : selected.word;
    const jp = side === "jp" ? word : selected.word;
    setSelected(null);
    if (en === jp) {
      const firstTry = !missed.has(en);
      recordStat(en, firstTry);
      if (side === "jp" || selected.side === "jp") speakJapanese(round.find((w) => w.word === jp)?.reading ?? jp);
      const nextMatched = [...matched, en];
      setMatched(nextMatched);
      setScore((s) => s + (firstTry ? 10 : 5));
      setStreak((st) => {
        const n = firstTry ? st + 1 : 0;
        if (n > best) {
          setBest(n);
          savePref("kotoba.gameBest", String(n));
        }
        return n;
      });
    } else {
      // Both words in the wrong pair need another look.
      setMissed((m) => new Set([...m, en, jp]));
      setStreak(0);
      setWrong({ en, jp });
      window.setTimeout(() => setWrong(null), 550);
    }
  };

  const done = round.length > 0 && matched.length === round.length;
  const masteredCount = WORDS.filter((w) => isMastered(stats[w.word])).length;
  const poolMastered = pool.filter((w) => isMastered(stats[w.word])).length;

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm ${active ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi-dark"}`;

  const cardClass = (side: Side, w: GameWord) => {
    const i = matched.indexOf(w.word);
    if (i >= 0) return `${PAIR_COLORS[i % PAIR_COLORS.length]} opacity-80`;
    const isWrong = wrong && (side === "en" ? wrong.en : wrong.jp) === w.word;
    if (isWrong) return "border-shu bg-shu/10 animate-[shake_0.45s_ease-in-out]";
    if (selected?.side === side && selected.word === w.word) return "border-sumi bg-sumi text-washi";
    return "border-sumi/15 bg-card hover:border-sumi/40";
  };

  return (
    <div className="mx-auto max-w-3xl">
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@media (prefers-reduced-motion: reduce){[class*="animate-["]{animation:none!important}}`}</style>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold">
            言葉つなぎ <span className="font-sans text-base font-semibold text-sumi-soft">Word match</span>
          </h1>
          <p className="mt-1 text-sm text-sumi-soft">
            Tap an English word, then its Japanese match. Words you miss come back more often.
          </p>
        </div>
        <button
          onClick={() => {
            setFurigana((v) => {
              savePref("kotoba.gameFurigana", v ? "off" : "on");
              return !v;
            });
          }}
          aria-pressed={furigana}
          className={chip(furigana)}
        >
          ふりがな {furigana ? "ON" : "OFF"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {(["all", "N3", "N2"] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              savePref("kotoba.gameLevel", f);
            }}
            className={chip(filter === f)}
          >
            {f === "all" ? "N3 + N2" : f}
          </button>
        ))}
        <div className="ml-auto flex gap-3 text-sm tabular-nums">
          <span title="Score">⭐ {score}</span>
          <span title="Streak (best)">🔥 {streak}<span className="text-sumi-soft"> / {best}</span></span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-sumi-soft">
          <span>
            Mastered {poolMastered} of {pool.length}
            {filter !== "all" && ` ${filter}`} words
          </span>
          <span>All words: {masteredCount} / {WORDS.length}</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-washi-dark">
          <div
            className="h-full rounded-full bg-matcha transition-all"
            style={{ width: `${(poolMastered / Math.max(1, pool.length)) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-2 flex justify-between text-xs font-semibold tracking-wide text-sumi-soft uppercase">
        <span>English</span>
        <span>Round {roundNo}</span>
        <span>日本語</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="grid gap-2 sm:gap-3">
          {enOrder.map((w) => (
            <button
              key={w.word}
              onClick={() => tap("en", w.word)}
              disabled={matched.includes(w.word)}
              aria-pressed={selected?.side === "en" && selected.word === w.word}
              className={`min-h-16 rounded-xl border-2 px-3 py-2 text-left text-sm leading-snug transition-colors sm:text-base ${cardClass("en", w)}`}
            >
              {w.en}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:gap-3">
          {jpOrder.map((w) => (
            <button
              key={w.word}
              onClick={() => tap("jp", w.word)}
              disabled={matched.includes(w.word)}
              aria-pressed={selected?.side === "jp" && selected.word === w.word}
              className={`jp min-h-16 rounded-xl border-2 px-3 py-2 text-center text-lg transition-colors sm:text-xl ${cardClass("jp", w)}`}
            >
              {furigana && hasKanji(w.word) ? (
                <ruby>
                  {w.word}
                  <rt className="text-[0.5em] font-normal opacity-70">{w.reading}</rt>
                </ruby>
              ) : (
                w.word
              )}
            </button>
          ))}
        </div>
      </div>

      {done && (
        <section className="mt-6 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="jp font-display text-2xl font-bold">
              {missed.size === 0 ? "パーフェクト！" : "クリア！"}
            </p>
            <span className="text-sm text-sumi-soft">
              {round.length - round.filter((w) => missed.has(w.word)).length}/{round.length} on the first try
            </span>
            <div className="flex-1" />
            <button
              onClick={() => newRound()}
              autoFocus
              className="rounded-full bg-shu px-6 py-2.5 text-sm font-semibold text-white hover:bg-shu-dark"
            >
              Next round →
            </button>
          </div>
          <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
            {round.map((w) => (
              <li key={w.word} className="flex items-center gap-2">
                <button
                  onClick={() => speakJapanese(w.reading)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-washi"
                  aria-label={`Listen to ${w.word}`}
                >
                  🔊
                </button>
                <span className={`jp shrink-0 font-medium whitespace-nowrap ${missed.has(w.word) ? "text-shu" : ""}`}>{w.word}</span>
                <span className="jp shrink-0 text-xs whitespace-nowrap text-sumi-soft">{w.reading}</span>
                <span className="truncate text-sumi-soft">· {w.en}</span>
                <span className="ml-auto text-xs text-sumi-soft">{w.level}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
