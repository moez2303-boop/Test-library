export interface Word {
  id: string;
  french: string;
  english: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
}

export type Level = "A1" | "A2" | "B1" | "B2";

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  description: string;
  level: Level;
  words: Word[];
}

/** Leitner spaced-repetition box, 1 (new/hard) through 5 (mastered). */
export type Box = 1 | 2 | 3 | 4 | 5;

export interface WordProgress {
  wordId: string;
  box: Box;
  dueAt: number;
  seen: number;
  correct: number;
  lastReviewed: number | null;
}

export interface Stats {
  streak: number;
  lastActiveDay: string | null;
  totalReviews: number;
}

export type Grade = "again" | "good" | "easy";

export interface ListeningQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface ListeningClip {
  id: string;
  title: string;
  level: Level;
  youtubeId: string;
  start: number;
  end: number;
  topic: string;
  source: string;
  sourceUrl: string;
  questions: ListeningQuestion[];
}

export interface ListeningProgress {
  clipId: string;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  lastAttempted: number;
}
