import { isJapanese, isKana, toHiragana, toKana, toRomaji } from "wanakana";

/** Katakana → hiragana, leaving everything else (kanji, ー) untouched. */
export function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** Key used in the Japanese index: forms are compared without caring about katakana vs hiragana. */
export function jpKey(s: string): string {
  return kataToHira(s.normalize("NFKC").trim());
}

export function hasJapanese(s: string): boolean {
  return /[぀-ヿ㐀-鿿豈-﫿々〆ヶ]/.test(s);
}

export function isKanjiChar(c: string): boolean {
  return /[㐀-鿿豈-﫿々〆ヶ]/.test(c);
}

export function kanjiIn(s: string): string[] {
  return [...new Set([...s].filter(isKanjiChar))];
}

/**
 * Converts romaji typed by the learner to hiragana, or returns null when the
 * text is not plausible romaji (e.g. a French word like "chien" still converts,
 * which is why French and romaji searches run side by side).
 */
export function romajiToKana(s: string): string | null {
  const t = s.trim().toLowerCase();
  if (!/^[a-z' -]+$/.test(t) || !/[aeiou]/.test(t)) return null;
  const kana = toHiragana(t.replace(/[ -]/g, ""), { IMEMode: false });
  return isKana(kana.replace(/ー/g, "")) ? kana : null;
}

export { isJapanese, toKana, toRomaji };

const FR_STOP = new Set(
  "le la les l un une des de du d à a au aux et ou en se s sa son ses qn qch quelqu un e par pour sur dans avec sans ne pas que qui ce c y etc".split(
    " ",
  ),
);

/** Lowercase, no accents, œ → oe: "Œuvre d'Été" → "oeuvre d'ete". */
export function foldFr(s: string): string {
  return s
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’`]/g, "'");
}

/** Words of a French gloss used for search (text inside parentheses is left out). */
export function frTokens(gloss: string): string[] {
  const outside = foldFr(gloss).replace(/\([^)]*\)/g, " ");
  return outside
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !FR_STOP.has(w));
}

/** The gloss as a whole, folded, without parentheses: used to rank exact matches first. */
export function frGlossKey(gloss: string): string {
  return foldFr(gloss)
    .replace(/\([^)]*\)/g, " ")
    .replace(/^(se |s'|l'|le |la |les |un |une )/, "")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();
}
