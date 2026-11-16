export type LangId = "fr" | "ja";

/** A phrase in the language being learned, with its English meaning. These drive every practice activity. */
export interface Phrase {
  /** The phrase as written (French, or Japanese with kanji). */
  text: string;
  en: string;
  /** Japanese only: the phrase in kana, used for furigana, romaji and typed answers. */
  reading?: string;
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

export interface SurvivalGroup {
  title: string;
  icon: string;
  phrases: Phrase[];
}

/* ───────── Verbs ───────── */

export interface VerbEntry {
  id: string;
  /** The dictionary form as written. */
  head: string;
  reading?: string;
  en: string;
  /** e.g. "-er", "irregular", "ru-verb". */
  group: string;
  /** One line of extra facts shown under the heading. */
  info?: string;
}

export interface VerbForm {
  id: string;
  label: string;
  en: string;
}

export interface ConjRow {
  /** Row label, e.g. "Polite past". Empty when the text already carries a pronoun. */
  label: string;
  /** What the table shows, e.g. "je suis allé(e)" or "食べました". */
  text: string;
  reading?: string;
  /** What text-to-speech reads. */
  speak: string;
  /** Drill: shown before the input, e.g. "je" or "que nous". */
  prompt: string;
  /** Drill: what the learner must type; any one is right. */
  answers: string[];
}

export interface VerbSet {
  verbs: VerbEntry[];
  forms: VerbForm[];
  rows(verbId: string, formId: string): ConjRow[];
}

/* ───────── A whole course ───────── */

/** Words of encouragement and labels, written in the language being learned. */
export interface Cheers {
  welcome: string;
  welcomeBack: string;
  congrats: string;
  excellent: string;
  almost: string;
  perfect: string;
  bravo: string;
  veryGood: string;
  correct: string;
  notQuite: string;
  noMistakes: string;
  allRated: string;
  typeHere: string;
}

export interface CourseLanguage {
  id: LangId;
  /** English name: "French". */
  name: string;
  /** Name in the language itself: "Français", "日本語". */
  native: string;
  /** App brand for this course: "Allons-y", "Ikimashō". */
  brand: string;
  /** Letter or character on the logo tile. */
  mark: string;
  flag: string;
  /** BCP 47 tag for browser speech: "fr-FR". */
  speechLocale: string;
  /** Short tag for Claude's voice and dictation: "fr". */
  shortCode: string;
  levels: Level[];
  lessons: Lesson[];
  survival: SurvivalGroup[];
  verbs: VerbSet;
  /** Extra keys shown under typing fields (accents); empty when the keyboard's IME is enough. */
  typingKeys: string[];
  /** One-line hint shown above typing activities. */
  typingHint: string;
  cheers: Cheers;
  /** Badge titles by badge id, in this language. */
  badgeTitles: Record<string, string>;
  certificateHeading: string;
}
