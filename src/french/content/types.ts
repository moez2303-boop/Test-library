/** A French phrase with its English meaning. These drive every practice activity. */
export interface Phrase {
  fr: string;
  en: string;
  /** Optional literal translation or usage hint. */
  note?: string;
}

export interface DialogueLine extends Phrase {
  speaker: string;
}

export interface NoteSection {
  heading: string;
  body: string;
  examples?: Phrase[];
}

export type LessonKind = "audio" | "culture";

export interface Lesson {
  id: string;
  level: number;
  module: number;
  kind: LessonKind;
  title: string;
  subtitle: string;
  intro: string;
  /** Interactive audio lessons have a dialogue; culture lessons usually don't. */
  dialogue?: DialogueLine[];
  notes: NoteSection[];
  /** Key phrases practised in Hear It Say It, Write It, Know It and Quiz. */
  phrases: Phrase[];
}

export interface Level {
  level: number;
  title: string;
  blurb: string;
  modules: { module: number; title: string }[];
}
