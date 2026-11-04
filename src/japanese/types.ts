export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export const LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export type VideoSource =
  | { kind: "youtube"; videoId: string }
  | { kind: "tiktok"; videoId: string; url: string; author?: string; thumbnail?: string }
  | { kind: "file"; fileName: string }
  | { kind: "none" };

export interface Question {
  id: string;
  /** The question as shown to the learner (usually Japanese). */
  prompt: string;
  /** Optional English hint/translation of the question. */
  promptEn?: string;
  /** Optional reference answer; leave empty for open/opinion questions. */
  referenceAnswer?: string;
}

export interface Clip {
  id: string;
  title: string;
  anime: string;
  level: JlptLevel;
  source: VideoSource;
  /** Clip start in seconds. */
  start: number;
  /** Clip end in seconds (0 = play to the end). */
  end: number;
  /** Japanese dialogue of the clip. The grader uses it as ground truth. */
  transcript: string;
  /** Optional English translation of the dialogue. */
  translation: string;
  /** The video's own caption (e.g. from TikTok), used as extra context. */
  caption?: string;
  questions: Question[];
  createdAt: number;
  isDemo?: boolean;
  /** Set on clips made by "Random lesson" from a built-in video pack. */
  pack?: "atashinchi";
  packVideoId?: string;
}

export interface Scores {
  grammar: number;
  vocabulary: number;
  relevance: number;
  naturalness: number;
}

export type IssueCategory =
  | "grammar"
  | "vocabulary"
  | "spelling"
  | "relevance"
  | "naturalness";

export interface Issue {
  category: IssueCategory;
  excerpt: string;
  explanation: string;
  suggestion: string;
}

export interface Feedback {
  scores: Scores;
  /** 0–100, computed client-side from the four scores. */
  overall: number;
  summary: string;
  strengths: string[];
  issues: Issue[];
  correctedAnswer: string;
  correctedReading: string;
  modelAnswer: string;
  modelAnswerEn: string;
}

export interface Attempt {
  id: string;
  clipId: string;
  questionId: string;
  answer: string;
  feedback: Feedback;
  createdAt: number;
}

export interface Settings {
  apiKey: string;
  model: string;
}
