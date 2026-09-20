import type { Box, Grade, WordProgress } from "./types";

/** Days to wait before the next review, indexed by box (1-5). */
const BOX_INTERVAL_DAYS: Record<Box, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 16,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function freshProgress(wordId: string): WordProgress {
  return {
    wordId,
    box: 1,
    dueAt: Date.now(),
    seen: 0,
    correct: 0,
    lastReviewed: null,
  };
}

export function nextBox(box: Box, grade: Grade): Box {
  if (grade === "again") return 1;
  if (grade === "easy") return Math.min(5, box + 2) as Box;
  return Math.min(5, box + 1) as Box;
}

export function applyGrade(progress: WordProgress, grade: Grade): WordProgress {
  const box = nextBox(progress.box, grade);
  const now = Date.now();
  return {
    ...progress,
    box,
    dueAt: now + BOX_INTERVAL_DAYS[box] * DAY_MS,
    seen: progress.seen + 1,
    correct: progress.correct + (grade === "again" ? 0 : 1),
    lastReviewed: now,
  };
}

export function isDue(progress: WordProgress | undefined, now = Date.now()): boolean {
  if (!progress) return true;
  return progress.dueAt <= now;
}

export function isMastered(progress: WordProgress | undefined): boolean {
  return progress?.box === 5;
}
