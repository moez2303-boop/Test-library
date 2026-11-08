import type { Card } from "./types";

export type Grade = 0 | 1 | 2 | 3; // à revoir, difficile, bien, facile

const DAY = 86_400_000;

/** A small SM-2 variant: returns the card's next state. */
export function schedule(card: Card, grade: Grade, now = Date.now()): Card {
  let { interval, ease, reps, lapses } = card;
  if (grade === 0) {
    lapses += 1;
    reps = 0;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
    return { ...card, interval, ease, reps, lapses, due: now + 10 * 60_000 };
  }
  reps += 1;
  if (reps === 1) interval = grade === 3 ? 4 : 1;
  else if (reps === 2) interval = grade === 1 ? 2 : grade === 3 ? 8 : 4;
  else interval = Math.round(interval * (grade === 1 ? 1.2 : grade === 3 ? ease * 1.3 : ease));
  ease = Math.max(1.3, ease + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0));
  return { ...card, interval, ease, reps, lapses, due: now + interval * DAY };
}

export function nextLabel(card: Card, grade: Grade): string {
  const next = schedule(card, grade);
  if (next.interval === 0) return "10 min";
  return next.interval === 1 ? "1 j" : next.interval < 30 ? `${next.interval} j` : `${Math.round(next.interval / 30)} mois`;
}
