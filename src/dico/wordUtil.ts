import type { Word } from "./types";

/** Headword shown in lists: the first kanji form, unless the word is usually written in kana. */
export function headword(w: Word): string {
  const uk = w.s.length > 0 && (w.s[0].u === 1 || !w.k?.length);
  return (!uk && w.k?.[0]) || w.r[0];
}

export function mainReading(w: Word): string {
  const nk = new Set(w.nk ?? []);
  return w.r.find((_, i) => !nk.has(i)) ?? w.r[0];
}

/** The glosses shown in a result row: French where there is French, else English. */
export function shortMeaning(w: Word, max = 3): { text: string; english: boolean } {
  const fr = w.s.filter((s) => s.f?.length).flatMap((s) => s.f!.slice(0, 2));
  if (fr.length) return { text: [...new Set(fr)].slice(0, max).join(" ; "), english: false };
  const en = w.s.flatMap((s) => s.e?.slice(0, 2) ?? []);
  return { text: en.slice(0, max).join("; "), english: true };
}

export function otherForms(w: Word): string[] {
  const head = headword(w);
  return [...(w.k ?? []), ...w.r].filter((f) => f !== head && f !== mainReading(w));
}
