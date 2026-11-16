import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import type { Lesson, Level } from "./types";

export const LEVELS: Level[] = [
  {
    level: 1,
    title: "Débutant",
    blurb: "Greet people, order in a café, find your way and talk about yourself.",
    modules: [
      { module: 1, title: "First steps" },
      { module: 2, title: "Out and about" },
      { module: 3, title: "Everyday life" },
    ],
  },
  {
    level: 2,
    title: "Intermédiaire",
    blurb: "Travel, talk about work, make plans and tell stories about the past.",
    modules: [
      { module: 4, title: "On the road" },
      { module: 5, title: "Work and plans" },
      { module: 6, title: "Telling stories" },
    ],
  },
  {
    level: 3,
    title: "Avancé",
    blurb: "Share memories, handle formal situations and argue your point of view.",
    modules: [
      { module: 7, title: "Settling in" },
      { module: 8, title: "Hopes and opinions" },
    ],
  },
];

export const LESSONS: Lesson[] = [...level1, ...level2, ...level3];

const byId = new Map(LESSONS.map((l) => [l.id, l]));
export function getLesson(id: string): Lesson | undefined {
  return byId.get(id);
}

export function lessonsForLevel(level: number): Lesson[] {
  return LESSONS.filter((l) => l.level === level);
}

export function nextLesson(id: string): Lesson | undefined {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? LESSONS[i + 1] : undefined;
}

export type { Lesson, Level, Phrase, DialogueLine, NoteSection } from "./types";
