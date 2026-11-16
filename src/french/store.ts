import { useSyncExternalStore } from "react";
import { LESSONS, type Lesson, type Phrase } from "./content";

/** Self-rating used by Hear It Say It and Know It: 1 = hard, 2 = good, 3 = easy. */
export type Rating = 1 | 2 | 3;

export type ActivityId = "lesson" | "hear" | "write" | "know" | "quiz" | "play";

export interface LessonProgress {
  lesson?: boolean;
  hear?: Record<number, Rating>;
  write?: Record<number, boolean>;
  know?: Record<number, Rating>;
  /** Best quiz score as a fraction 0–1. */
  quiz?: number;
  play?: boolean;
}

export interface VocabCard extends Phrase {
  lessonId?: string;
  added: number;
  /** Next review time (ms). */
  due: number;
  /** Current interval in days. */
  interval: number;
  ease: number;
  reps: number;
}

export interface Settings {
  rate: number;
  voiceURI?: string;
  dailyGoal: number;
  showEnglish: boolean;
  theme: "system" | "light" | "dark";
}

export interface State {
  version: 1;
  progress: Record<string, LessonProgress>;
  /** Points earned per local day (YYYY-MM-DD). */
  points: Record<string, number>;
  vocab: Record<string, VocabCard>;
  lastLesson?: string;
  settings: Settings;
  /** Badge ids already unlocked, with the time they were earned. */
  badges: Record<string, number>;
  /** Last change (ms), used to pick the newer copy when syncing devices. */
  savedAt?: number;
}

const KEY = "allons-y-french:v1";

const DEFAULT: State = {
  version: 1,
  progress: {},
  points: {},
  vocab: {},
  settings: { rate: 0.95, dailyGoal: 50, showEnglish: true, theme: "system" },
  badges: {},
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      return { ...DEFAULT, ...s, settings: { ...DEFAULT.settings, ...s.settings } };
    }
  } catch {
    /* storage unavailable */
  }
  return DEFAULT;
}

let state: State = load();
const listeners = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: progress lasts for this visit only */
  }
}

function set(next: State) {
  state = { ...next, savedAt: Date.now() };
  save();
  listeners.forEach((l) => l());
}

export function getState(): State {
  return state;
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Replace everything with a copy loaded from elsewhere (another device). */
export function replaceState(s: State) {
  if (s?.version !== 1 || typeof s.progress !== "object") return;
  state = { ...DEFAULT, ...s, settings: { ...DEFAULT.settings, ...s.settings } };
  save();
  listeners.forEach((l) => l());
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => select(state),
  );
}

/* ───────── Dates ───────── */

export function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/* ───────── Points ───────── */

export function addPoints(n: number) {
  if (n <= 0) return;
  const k = dayKey();
  set({ ...state, points: { ...state.points, [k]: (state.points[k] ?? 0) + n } });
  checkBadges();
}

export function totalPoints(s: State): number {
  return Object.values(s.points).reduce((a, b) => a + b, 0);
}

export function todayPoints(s: State): number {
  return s.points[dayKey()] ?? 0;
}

/** Consecutive days (ending today, or yesterday if today has no points yet) with any points. */
export function streak(s: State): number {
  let d = new Date();
  if (!s.points[dayKey(d)]) d = addDays(d, -1);
  let n = 0;
  while (s.points[dayKey(d)]) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function lastNDays(s: State, n: number): { key: string; label: string; points: number }[] {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    out.push({
      key: dayKey(d),
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      points: s.points[dayKey(d)] ?? 0,
    });
  }
  return out;
}

/* ───────── Lesson progress ───────── */

function patchLesson(id: string, patch: (p: LessonProgress) => LessonProgress) {
  const prev = state.progress[id] ?? {};
  set({ ...state, lastLesson: id, progress: { ...state.progress, [id]: patch(prev) } });
  checkBadges();
}

export function markLessonRead(id: string) {
  if (state.progress[id]?.lesson) return patchLesson(id, (p) => p);
  patchLesson(id, (p) => ({ ...p, lesson: true }));
  addPoints(10);
}

export function rateHear(id: string, i: number, r: Rating) {
  patchLesson(id, (p) => ({ ...p, hear: { ...p.hear, [i]: r } }));
  addPoints(r);
}

export function recordWrite(id: string, i: number, ok: boolean) {
  const was = state.progress[id]?.write?.[i];
  patchLesson(id, (p) => ({ ...p, write: { ...p.write, [i]: was || ok } }));
  if (ok) addPoints(2);
}

export function rateKnow(id: string, i: number, r: Rating, phrase: Phrase) {
  patchLesson(id, (p) => ({ ...p, know: { ...p.know, [i]: r } }));
  addPoints(r);
  // Anything that felt hard goes into the review deck automatically.
  if (r === 1) addToVocab(phrase, id);
}

export function recordQuiz(id: string, fraction: number, correct: number) {
  patchLesson(id, (p) => ({ ...p, quiz: Math.max(p.quiz ?? 0, fraction) }));
  addPoints(correct * 2);
}

export function markPlayed(id: string) {
  const first = !state.progress[id]?.play;
  patchLesson(id, (p) => ({ ...p, play: true }));
  addPoints(first ? 15 : 5);
}

export function setLastLesson(id: string) {
  if (state.lastLesson !== id) set({ ...state, lastLesson: id });
}

export function activitiesFor(lesson: Lesson): ActivityId[] {
  const base: ActivityId[] = ["lesson", "hear", "write", "know", "quiz"];
  return lesson.dialogue ? [...base, "play"] : base;
}

/** Completion of one activity from 0 to 1. */
export function activityCompletion(lesson: Lesson, p: LessonProgress | undefined, a: ActivityId): number {
  if (!p) return 0;
  const n = lesson.phrases.length || 1;
  switch (a) {
    case "lesson":
      return p.lesson ? 1 : 0;
    case "hear":
      return Object.keys(p.hear ?? {}).length / n;
    case "write":
      return Object.values(p.write ?? {}).filter(Boolean).length / n;
    case "know":
      return Object.keys(p.know ?? {}).length / n;
    case "quiz":
      return p.quiz ?? 0;
    case "play":
      return p.play ? 1 : 0;
  }
}

export function lessonCompletion(lesson: Lesson, p: LessonProgress | undefined): number {
  const acts = activitiesFor(lesson);
  return acts.reduce((sum, a) => sum + Math.min(1, activityCompletion(lesson, p, a)), 0) / acts.length;
}

export function levelCompletion(s: State, level: number): number {
  const ls = LESSONS.filter((l) => l.level === level);
  return ls.reduce((sum, l) => sum + lessonCompletion(l, s.progress[l.id]), 0) / ls.length;
}

/* ───────── Vocabulary deck (simple SM-2 style spacing) ───────── */

export function addToVocab(phrase: Phrase, lessonId?: string) {
  if (state.vocab[phrase.fr]) return;
  const card: VocabCard = {
    ...phrase,
    lessonId,
    added: Date.now(),
    due: Date.now(),
    interval: 0,
    ease: 2.5,
    reps: 0,
  };
  set({ ...state, vocab: { ...state.vocab, [phrase.fr]: card } });
  checkBadges();
}

export function removeFromVocab(fr: string) {
  const vocab = { ...state.vocab };
  delete vocab[fr];
  set({ ...state, vocab });
}

export function reviewVocab(fr: string, r: Rating) {
  const c = state.vocab[fr];
  if (!c) return;
  let { interval, ease, reps } = c;
  if (r === 1) {
    interval = 0;
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    interval = reps === 1 ? (r === 3 ? 3 : 1) : reps === 2 ? (r === 3 ? 7 : 4) : Math.round(interval * ease * (r === 3 ? 1.3 : 1));
    if (r === 3) ease += 0.1;
  }
  // A hard card comes back in ten minutes; others after their interval in days.
  const due = r === 1 ? Date.now() + 10 * 60_000 : Date.now() + interval * 86_400_000;
  set({ ...state, vocab: { ...state.vocab, [fr]: { ...c, interval, ease, reps, due } } });
  addPoints(1);
}

export function dueCards(s: State): VocabCard[] {
  const now = Date.now();
  return Object.values(s.vocab)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due);
}

/* ───────── Settings ───────── */

export function updateSettings(patch: Partial<Settings>) {
  set({ ...state, settings: { ...state.settings, ...patch } });
}

export function resetProgress() {
  set({ ...DEFAULT, settings: state.settings });
}

export function exportData(): string {
  return JSON.stringify(state, null, 2);
}

export function importData(json: string): boolean {
  try {
    const s = JSON.parse(json) as State;
    if (s.version !== 1 || typeof s.progress !== "object") return false;
    set({ ...DEFAULT, ...s, settings: { ...DEFAULT.settings, ...s.settings } });
    return true;
  } catch {
    return false;
  }
}

/* ───────── Badges ───────── */

export interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  test: (s: State) => boolean;
}

const lessonsDone = (s: State) =>
  LESSONS.filter((l) => lessonCompletion(l, s.progress[l.id]) >= 0.999).length;

export const BADGES: Badge[] = [
  { id: "first-steps", icon: "👣", title: "Premiers pas", desc: "Finish reading your first lesson", test: (s) => Object.values(s.progress).some((p) => p.lesson) },
  { id: "points-100", icon: "⭐", title: "Cent points", desc: "Earn 100 points", test: (s) => totalPoints(s) >= 100 },
  { id: "points-1000", icon: "🌟", title: "Mille points", desc: "Earn 1,000 points", test: (s) => totalPoints(s) >= 1000 },
  { id: "points-5000", icon: "🏆", title: "Champion", desc: "Earn 5,000 points", test: (s) => totalPoints(s) >= 5000 },
  { id: "goal", icon: "🎯", title: "Objectif atteint", desc: "Hit your daily goal", test: (s) => todayPoints(s) >= s.settings.dailyGoal || Object.values(s.points).some((p) => p >= s.settings.dailyGoal) },
  { id: "streak-3", icon: "🔥", title: "En feu", desc: "Practise 3 days in a row", test: (s) => streak(s) >= 3 },
  { id: "streak-7", icon: "📅", title: "Une semaine", desc: "Practise 7 days in a row", test: (s) => streak(s) >= 7 },
  { id: "streak-30", icon: "🗓️", title: "Un mois", desc: "Practise 30 days in a row", test: (s) => streak(s) >= 30 },
  { id: "perfect-quiz", icon: "💯", title: "Sans faute", desc: "Score 100% on a quiz", test: (s) => Object.values(s.progress).some((p) => (p.quiz ?? 0) >= 1) },
  { id: "actor", icon: "🎭", title: "Comédien", desc: "Complete a role-play", test: (s) => Object.values(s.progress).some((p) => p.play) },
  { id: "lesson-1", icon: "✅", title: "Leçon terminée", desc: "Complete every activity in a lesson", test: (s) => lessonsDone(s) >= 1 },
  { id: "lesson-10", icon: "📚", title: "Studieux", desc: "Complete 10 lessons", test: (s) => lessonsDone(s) >= 10 },
  { id: "vocab-25", icon: "🗂️", title: "Collectionneur", desc: "Save 25 words to My Vocab", test: (s) => Object.keys(s.vocab).length >= 25 },
  { id: "level-1", icon: "🥉", title: "Niveau 1", desc: "Complete Level 1", test: (s) => levelCompletion(s, 1) >= 0.999 },
  { id: "level-2", icon: "🥈", title: "Niveau 2", desc: "Complete Level 2", test: (s) => levelCompletion(s, 2) >= 0.999 },
  { id: "level-3", icon: "🥇", title: "Niveau 3", desc: "Complete Level 3", test: (s) => levelCompletion(s, 3) >= 0.999 },
];

type BadgeListener = (b: Badge) => void;
const badgeListeners = new Set<BadgeListener>();
export function onBadge(l: BadgeListener) {
  badgeListeners.add(l);
  return () => {
    badgeListeners.delete(l);
  };
}

function checkBadges() {
  const earned: Badge[] = [];
  for (const b of BADGES) {
    if (!state.badges[b.id] && b.test(state)) earned.push(b);
  }
  if (!earned.length) return;
  const badges = { ...state.badges };
  for (const b of earned) badges[b.id] = Date.now();
  set({ ...state, badges });
  earned.forEach((b) => badgeListeners.forEach((l) => l(b)));
}
