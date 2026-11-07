import type { Feedback, JlptLevel } from "../types";

export interface MangaLine {
  speaker: string;
  /** Japanese, with optional readings marked as {漢字|かんじ}. */
  text: string;
  en: string;
}

export interface MangaPanel {
  /** Short stage direction in Japanese (may contain {漢字|かんじ}). */
  scene: string;
  sceneEn: string;
  lines: MangaLine[];
}

export interface MangaPage {
  panels: MangaPanel[];
}

export interface GlossaryItem {
  word: string;
  reading: string;
  meaning: string;
}

/** Exercise kinds. "Choice" kinds are checked instantly; "writing" kinds are graded by Claude. */
export type ExerciseType =
  | "open_question"
  | "continue_story"
  | "say_it_in_japanese"
  | "vocabulary"
  | "grammar"
  | "kanji_reading"
  | "who_said_it"
  | "true_false"
  | "fill_blank";

export const WRITING_TYPES: ExerciseType[] = ["open_question", "continue_story", "say_it_in_japanese"];
export const CHOICE_TYPES: ExerciseType[] = [
  "vocabulary",
  "grammar",
  "kanji_reading",
  "who_said_it",
  "true_false",
  "fill_blank",
];

export const EXERCISE_LABELS: Record<ExerciseType, { label: string; jp: string }> = {
  open_question: { label: "Open question", jp: "自由回答" },
  continue_story: { label: "What happens next?", jp: "続きを書こう" },
  say_it_in_japanese: { label: "Say it in Japanese", jp: "日本語で言おう" },
  vocabulary: { label: "Vocabulary", jp: "語彙" },
  grammar: { label: "Grammar", jp: "文法" },
  kanji_reading: { label: "Kanji reading", jp: "読み方" },
  who_said_it: { label: "Who said it?", jp: "だれのセリフ？" },
  true_false: { label: "True or false", jp: "○か×か" },
  fill_blank: { label: "Fill the blank", jp: "穴うめ" },
};

export interface Exercise {
  type: ExerciseType;
  prompt: string;
  promptEn: string;
  /** Choice exercises only. */
  options: string[];
  answerIndex: number;
  explanation: string;
  /** Writing exercises: an example of a good answer (may be empty). */
  referenceAnswer: string;
}

export interface ExerciseResult {
  answer: string;
  /** Choice exercises. */
  correct?: boolean;
  /** Writing exercises. */
  feedback?: Feedback;
  at: number;
}

export type StyleKey = "overpowered" | "hitman" | "teacher" | "spy" | "random";

export interface MangaLesson {
  id: string;
  title: string;
  titleEn: string;
  summaryEn: string;
  level: JlptLevel;
  /** "story": written by Claude. "pages": the learner's page images (photos or a PDF). "text": a .txt file. */
  source: "story" | "pages" | "text";
  /** The uploaded file's name, with the part or page range used. */
  fileLabel?: string;
  style?: StyleKey;
  /** Shown on ready-made lessons, e.g. "政治 · Politics". */
  topic?: string;
  pageCount: number;
  pages: MangaPage[];
  glossary: GlossaryItem[];
  exercises: Exercise[];
  results: Record<number, ExerciseResult>;
  createdAt: number;
}
