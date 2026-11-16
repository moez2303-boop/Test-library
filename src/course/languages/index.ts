import { useSyncExternalStore } from "react";
import { french } from "./fr";
import { japanese } from "./ja";
import type { CourseLanguage, LangId, Lesson } from "./types";

export const LANGUAGES: Record<LangId, CourseLanguage> = { fr: french, ja: japanese };
export const LANG_IDS: LangId[] = ["fr", "ja"];

const KEY = "course:language";

function initial(): LangId {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "fr" || v === "ja") return v;
  } catch {
    /* storage unavailable */
  }
  return "fr";
}

let current: LangId = initial();
const listeners = new Set<() => void>();

/** The course being studied right now. */
export function lang(): CourseLanguage {
  return LANGUAGES[current];
}

export function langId(): LangId {
  return current;
}

export function setLang(id: LangId) {
  if (id === current) return;
  current = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* remembered for this visit only */
  }
  listeners.forEach((l) => l());
}

export function onLangChange(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function useLang(): CourseLanguage {
  const id = useSyncExternalStore(onLangChange, langId);
  return LANGUAGES[id];
}

export function getLesson(id: string): Lesson | undefined {
  return lang().lessons.find((l) => l.id === id);
}

export function lessonsForLevel(level: number): Lesson[] {
  return lang().lessons.filter((l) => l.level === level);
}

export function nextLesson(id: string): Lesson | undefined {
  const ls = lang().lessons;
  const i = ls.findIndex((l) => l.id === id);
  return i >= 0 ? ls[i + 1] : undefined;
}

export type * from "./types";
