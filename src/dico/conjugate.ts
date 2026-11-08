/** Conjugation tables for verbs and い-adjectives (shown on a word's page). */

export interface Conj {
  label: string;
  plain: string;
  polite?: string;
}

const GODAN: Record<string, { i: string; a: string; e: string; o: string; te: string; ta: string }> = {
  う: { i: "い", a: "わ", e: "え", o: "お", te: "って", ta: "った" },
  く: { i: "き", a: "か", e: "け", o: "こ", te: "いて", ta: "いた" },
  ぐ: { i: "ぎ", a: "が", e: "げ", o: "ご", te: "いで", ta: "いだ" },
  す: { i: "し", a: "さ", e: "せ", o: "そ", te: "して", ta: "した" },
  つ: { i: "ち", a: "た", e: "て", o: "と", te: "って", ta: "った" },
  ぬ: { i: "に", a: "な", e: "ね", o: "の", te: "んで", ta: "んだ" },
  ぶ: { i: "び", a: "ば", e: "べ", o: "ぼ", te: "んで", ta: "んだ" },
  む: { i: "み", a: "ま", e: "め", o: "も", te: "んで", ta: "んだ" },
  る: { i: "り", a: "ら", e: "れ", o: "ろ", te: "って", ta: "った" },
};

export function conjugationKind(pos: string[]): "v1" | "v5" | "vs" | "vk" | "adj-i" | "adj-ix" | null {
  for (const p of pos) {
    if (p === "v1" || p === "v1-s") return "v1";
    if (p === "vk") return "vk";
    if (p === "vs-i" || p === "vs-s") return "vs";
    if (p.startsWith("v5") && p !== "v5aru") return "v5";
    if (p === "adj-i") return "adj-i";
    if (p === "adj-ix") return "adj-ix";
  }
  return null;
}

export function conjugate(word: string, pos: string[]): Conj[] | null {
  const kind = conjugationKind(pos);
  if (!kind) return null;
  if (kind === "adj-i" || kind === "adj-ix") {
    if (!word.endsWith("い")) return null;
    const s = kind === "adj-ix" ? word.slice(0, -2) + "よ" : word.slice(0, -1);
    return [
      { label: "Présent", plain: word, polite: word + "です" },
      { label: "Négatif", plain: s + "くない", polite: s + "くないです" },
      { label: "Passé", plain: s + "かった", polite: s + "かったです" },
      { label: "Passé négatif", plain: s + "くなかった", polite: s + "くなかったです" },
      { label: "Forme en -te", plain: s + "くて" },
      { label: "Adverbe", plain: s + "く" },
      { label: "Conditionnel", plain: s + "ければ" },
      { label: "Nom (-sa)", plain: s + "さ" },
    ];
  }
  let stem: string, neg: string, te: string, ta: string, cond: string, vol: string, imp: string, pot: string, pass: string, caus: string;
  if (kind === "v1") {
    if (!word.endsWith("る")) return null;
    const b = word.slice(0, -1);
    stem = b; neg = b; te = b + "て"; ta = b + "た"; cond = b + "れば"; vol = b + "よう"; imp = b + "ろ";
    pot = b + "られる"; pass = b + "られる"; caus = b + "させる";
  } else if (kind === "vs") {
    if (!word.endsWith("する")) return null;
    const b = word.slice(0, -2);
    stem = b + "し"; neg = b + "し"; te = b + "して"; ta = b + "した"; cond = b + "すれば"; vol = b + "しよう"; imp = b + "しろ";
    pot = b + "できる"; pass = b + "される"; caus = b + "させる";
  } else if (kind === "vk") {
    const kanji = word.endsWith("来る");
    if (!kanji && !word.endsWith("くる")) return null;
    const b = word.slice(0, -2);
    const k = (kana: string) => b + (kanji ? "来" + kana.slice(1) : kana);
    stem = k("き"); neg = k("こ"); te = k("きて"); ta = k("きた"); cond = k("くれば"); vol = k("こよう"); imp = b + (kanji ? "来い" : "こい");
    pot = k("こられる"); pass = k("こられる"); caus = k("こさせる");
  } else {
    const last = word.slice(-1);
    const g = GODAN[last];
    if (!g) return null;
    const b = word.slice(0, -1);
    const iku = /(行|い|ゆ)く$/.test(word) && pos.includes("v5k-s");
    stem = b + g.i; neg = b + g.a; te = b + (iku ? "って" : g.te); ta = b + (iku ? "った" : g.ta);
    cond = b + g.e + "ば"; vol = b + g.o + "う"; imp = b + g.e; pot = b + g.e + "る"; pass = b + g.a + "れる"; caus = b + g.a + "せる";
    if (word === "ある" || word === "有る" || word === "在る") neg = "";
  }
  const negPlain = neg ? neg + "ない" : "ない";
  const negPast = neg ? neg + "なかった" : "なかった";
  return [
    { label: "Présent", plain: word, polite: stem + "ます" },
    { label: "Négatif", plain: negPlain, polite: stem + "ません" },
    { label: "Passé", plain: ta, polite: stem + "ました" },
    { label: "Passé négatif", plain: negPast, polite: stem + "ませんでした" },
    { label: "Forme en -te", plain: te, polite: stem + "まして" },
    { label: "Volitif", plain: vol, polite: stem + "ましょう" },
    { label: "Désir (-tai)", plain: stem + "たい" },
    { label: "Conditionnel (-ba)", plain: cond },
    { label: "Conditionnel (-tara)", plain: ta + "ら" },
    { label: "Impératif", plain: imp },
    { label: "Potentiel", plain: pot },
    { label: "Passif", plain: pass },
    { label: "Causatif", plain: caus },
  ];
}
