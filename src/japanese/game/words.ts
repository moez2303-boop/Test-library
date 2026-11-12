import raw from "./words.tsv?raw";

export type WordLevel = "N3" | "N2";

export interface GameWord {
  word: string;
  reading: string;
  en: string;
  level: WordLevel;
}

function parse(text: string): GameWord[] {
  const out: GameWord[] = [];
  let level: WordLevel = "N3";
  for (const line of text.split("\n")) {
    if (line.startsWith("# N")) {
      level = line.slice(2).trim() as WordLevel;
      continue;
    }
    if (!line.trim() || line.startsWith("#")) continue;
    const [word, reading, en] = line.split("\t");
    if (word && reading && en) out.push({ word, reading, en, level });
  }
  return out;
}

export const WORDS: GameWord[] = parse(raw);

// ---------------------------------------------------------------------------
// Per-word progress, kept in this browser
// ---------------------------------------------------------------------------

export interface WordStat {
  /** Times matched on the first try. */
  right: number;
  /** Times matched wrongly before getting it. */
  wrong: number;
  last: number;
}

const STATS_KEY = "kotoba.wordStats";

export function loadStats(): Record<string, WordStat> {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}") as Record<string, WordStat>;
  } catch {
    return {};
  }
}

export function saveStats(stats: Record<string, WordStat>) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
}

export function isMastered(s: WordStat | undefined) {
  return !!s && s.right >= 2 && s.right > s.wrong;
}

/**
 * Picks `count` words for a round: words you got wrong come back first,
 * then new words, then ones not yet mastered, with a little randomness.
 */
export function pickRound(
  pool: GameWord[],
  stats: Record<string, WordStat>,
  count: number,
  avoid: Set<string>,
): GameWord[] {
  const scored = pool
    .filter((w) => !avoid.has(w.word))
    .map((w) => {
      const s = stats[w.word];
      let score = Math.random() * 2;
      if (!s) score += 3; // new
      else if (s.wrong > s.right) score += 5; // struggling
      else if (!isMastered(s)) score += 2.5;
      return { w, score };
    })
    .sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, count).map((x) => x.w);
  // Fall back to avoided words if the pool is small.
  if (picked.length < count) {
    for (const w of pool) if (picked.length < count && !picked.includes(w)) picked.push(w);
  }
  return picked;
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
