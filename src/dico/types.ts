export interface Sense {
  p: string[]; // parts of speech (JMdict codes)
  f?: string[]; // French glosses
  e?: string[]; // English glosses
  h?: 1; // French written or confirmed by a JMdict contributor
  d?: string[]; // fields (comp, med…)
  u?: 1; // usually written in kana
}

export interface Word {
  i: number;
  k?: string[]; // kanji forms
  ks?: string[]; // search-only kanji forms
  r: string[]; // readings
  rs?: string[]; // search-only readings
  nk?: number[]; // readings that are not used with the kanji
  s: Sense[];
  z?: number; // word frequency (Zipf × 100)
  c?: number; // common-word rank bucket (1 = most common)
  t?: string; // theme
}

export interface StoredWord extends Word {
  jp: string[];
  fr: string[];
  kj: string[];
}

export interface Kanji {
  c: string;
  n: number; // strokes
  on?: string[];
  kun?: string[];
  fr?: string[];
  en?: string[];
  g?: number; // school grade (1–6 kyōiku, 8 jōyō, 9–10 jinmeiyō)
  f?: number; // frequency rank in newspapers
  m?: number; // Kangxi radical number
  t?: string[]; // stroke paths (KanjiVG, 109×109)
}

export interface WordList {
  id: string;
  name: string;
  createdAt: number;
}

export interface ListItem {
  listId: string;
  wordId: number;
  addedAt: number;
}

export interface Card {
  wordId: number;
  due: number;
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
}

export interface HistoryItem {
  wordId: number;
  at: number;
}

export interface Settings {
  showEnglish: boolean;
  showRomaji: boolean;
  theme: "system" | "light" | "dark";
}
