/**
 * Turns a conjugated Japanese word back into candidate dictionary forms
 * (食べなかった → 食べない → 食べる). Each candidate carries the word classes it
 * may belong to; the search keeps a candidate only if the dictionary entry it
 * finds has a matching part of speech.
 */

export const T = {
  V1: 1, // ichidan
  V5: 2, // godan
  VS: 4, // する
  VK: 8, // 来る
  ADJ: 16, // い-adjective
  TE: 32, // て-form (internal)
  STEM: 64, // 連用形 (internal)
  NEG: 128, // 未然形 (internal)
  FIN: 256, // the text as typed (internal)
  NA: 512, // noun / な-adjective followed by the copula
} as const;

const WORD = T.V1 | T.V5 | T.VS | T.VK | T.ADJ;

interface Rule {
  from: string;
  to: string;
  inT: number;
  outT: number;
  why: string;
}

const rules: Rule[] = [];
function add(why: string, inT: number, outT: number, pairs: [string, string][]) {
  for (const [from, to] of pairs) rules.push({ from, to, inT, outT, why });
}

const godan: [string, string, string, string, string, string][] = [
  // dict, masu-stem, nai-stem, e-row, o-row volitional, te/ta prefix
  ["う", "い", "わ", "え", "おう", "っ"],
  ["く", "き", "か", "け", "こう", "い"],
  ["ぐ", "ぎ", "が", "げ", "ごう", "い"],
  ["す", "し", "さ", "せ", "そう", "し"],
  ["つ", "ち", "た", "て", "とう", "っ"],
  ["ぬ", "に", "な", "ね", "のう", "ん"],
  ["ぶ", "び", "ば", "べ", "ぼう", "ん"],
  ["む", "み", "ま", "め", "もう", "ん"],
  ["る", "り", "ら", "れ", "ろう", "っ"],
];
const voiced = (d: string) => d === "ぐ" || d === "ぬ" || d === "ぶ" || d === "む";

// Stems used by auxiliaries.
add("", T.STEM, T.V1, [["", "る"]]);
add("", T.STEM, T.V5, godan.map(([d, stem]) => [stem, d]));
add("", T.STEM, T.VS, [["し", "する"]]);
add("", T.STEM, T.VK, [["き", "くる"], ["来", "来る"]]);
add("", T.NEG, T.V1, [["", "る"]]);
add("", T.NEG, T.V5, godan.map(([d, , neg]) => [neg, d]));
add("", T.NEG, T.VS, [["し", "する"], ["さ", "する"]]);
add("", T.NEG, T.VK, [["こ", "くる"], ["来", "来る"]]);

// て-form and past.
for (const suffix of ["て", "た"] as const) {
  const why = suffix === "て" ? "forme en -te" : "passé";
  const inT = suffix === "て" ? T.FIN | T.TE : T.FIN;
  add(why, inT, T.V1, [[suffix, "る"]]);
  const pairs: [string, string][] = [];
  for (const [d, , , , , pre] of godan) {
    const s = voiced(d) ? (suffix === "て" ? "で" : "だ") : suffix;
    pairs.push([pre + s, d]);
  }
  pairs.push([`行っ${suffix}`, "行く"], [`いっ${suffix}`, "いく"]);
  add(why, inT, T.V5, pairs);
  add(why, inT, T.VS, [[`し${suffix}`, "する"]]);
  add(why, inT, T.VK, [[`き${suffix}`, "くる"], [`来${suffix}`, "来る"]]);
}
add("forme en -te", T.FIN | T.TE, T.ADJ, [["くて", "い"]]);
add("passé", T.FIN, T.ADJ, [["かった", "い"]]);
add("forme en -tara", T.FIN, T.FIN, [["たら", "た"], ["だら", "だ"]]);
add("forme en -tari", T.FIN, T.FIN, [["たり", "た"], ["だり", "だ"]]);

// Polite.
add("poli", T.FIN, T.STEM, [["ます", ""]]);
add("poli négatif", T.FIN, T.STEM, [["ません", ""]]);
add("poli passé", T.FIN, T.STEM, [["ました", ""]]);
add("poli passé négatif", T.FIN, T.STEM, [["ませんでした", ""]]);
add("poli volitif", T.FIN, T.STEM, [["ましょう", ""]]);
add("poli, forme en -te", T.FIN | T.TE, T.STEM, [["まして", ""]]);

// Negative: ない behaves like an い-adjective.
add("négatif", T.ADJ | T.FIN, T.NEG, [["ない", ""]]);
add("négatif", T.FIN, T.NEG, [["ず", ""], ["ずに", ""], ["ぬ", ""], ["ん", ""]]);
add("négatif, forme en -te", T.FIN | T.TE, T.NEG, [["ないで", ""]]);
add("négatif", T.ADJ | T.FIN, T.ADJ, [["くない", "い"]]);
add("négatif (familier)", T.FIN, T.NEG, [["なきゃ", ""], ["なくちゃ", ""]]);

// Wish, appearance, excess.
add("désir (-tai)", T.ADJ | T.FIN, T.STEM, [["たい", ""]]);
add("simultanéité (-nagara)", T.FIN, T.STEM, [["ながら", ""]]);
add("ordre poli (-nasai)", T.FIN, T.STEM, [["なさい", ""]]);
add("apparence (-sou)", T.FIN | T.NA, T.STEM, [["そう", ""]]);
add("apparence (-sou)", T.FIN | T.NA, T.ADJ, [["そう", "い"]]);
add("excès (-sugiru)", T.V1, T.STEM, [["すぎる", ""], ["過ぎる", ""]]);
add("excès (-sugiru)", T.V1, T.ADJ, [["すぎる", "い"], ["過ぎる", "い"]]);
add("facilité (-yasui)", T.ADJ, T.STEM, [["やすい", ""]]);
add("difficulté (-nikui)", T.ADJ, T.STEM, [["にくい", ""]]);
add("début (-hajimeru)", T.V1, T.STEM, [["始める", ""], ["はじめる", ""]]);
add("fin (-owaru)", T.V5, T.STEM, [["終わる", ""], ["おわる", ""]]);

// Passive, potential, causative.
add("passif", T.V1, T.NEG, [["れる", ""]]);
add("passif / potentiel", T.V1, T.V1, [["られる", "る"]]);
add("potentiel (familier)", T.V1, T.V1, [["れる", "る"]]);
add("causatif", T.V1, T.NEG, [["せる", ""]]);
add("causatif", T.V1, T.V1, [["させる", "る"]]);
add("causatif-passif", T.V1, T.NEG, [["される", ""], ["せられる", ""]]);
add("causatif-passif", T.V1, T.V1, [["させられる", "る"]]);
add("potentiel", T.V1, T.V5, godan.map(([d, , , e]) => [e + "る", d]));
add("passif", T.V1, T.VS, [["される", "する"]]);
add("causatif", T.V1, T.VS, [["させる", "する"]]);
add("potentiel", T.V1, T.VS, [["できる", "する"], ["出来る", "する"]]);
add("passif / potentiel", T.V1, T.VK, [["こられる", "くる"], ["来られる", "来る"]]);
add("causatif", T.V1, T.VK, [["こさせる", "くる"], ["来させる", "来る"]]);

// Volitional, imperative, conditional.
add("volitif", T.FIN, T.V1, [["よう", "る"]]);
add("volitif", T.FIN, T.V5, godan.map(([d, , , , o]) => [o, d]));
add("volitif", T.FIN, T.VS, [["しよう", "する"]]);
add("volitif", T.FIN, T.VK, [["こよう", "くる"], ["来よう", "来る"]]);
add("impératif", T.FIN, T.V1, [["ろ", "る"], ["よ", "る"]]);
add("impératif", T.FIN, T.V5, godan.map(([d, , , e]) => [e, d]));
add("impératif", T.FIN, T.VS, [["しろ", "する"], ["せよ", "する"]]);
add("impératif", T.FIN, T.VK, [["こい", "くる"], ["来い", "来る"]]);
add("impératif négatif", T.FIN, T.V1 | T.V5 | T.VS | T.VK, [["な", ""]]);
add("conditionnel", T.FIN, T.V1, [["れば", "る"]]);
add("conditionnel", T.FIN, T.V5, godan.map(([d, , , e]) => [e + "ば", d]));
add("conditionnel", T.FIN, T.VS, [["すれば", "する"]]);
add("conditionnel", T.FIN, T.VK, [["くれば", "くる"], ["来れば", "来る"]]);
add("conditionnel", T.FIN, T.ADJ, [["ければ", "い"]]);
add("conditionnel (familier)", T.FIN, T.V1, [["りゃ", "る"]]);

// Adjectives.
add("adverbe", T.FIN, T.ADJ, [["く", "い"]]);
add("nom (-sa)", T.FIN, T.ADJ, [["さ", "い"]]);
add("volitif / supposition", T.FIN, T.ADJ, [["かろう", "い"]]);

// Auxiliaries after the て-form.
add("progressif / état (-te iru)", T.V1, T.TE, [["いる", ""], ["る", ""]]);
add("résultat (-te aru)", T.V5, T.TE, [["ある", ""]]);
add("achèvement (-te shimau)", T.V5, T.TE, [["しまう", ""]]);
add("achèvement (-chau)", T.V5, T.FIN, [["ちゃう", "て"], ["じゃう", "で"]]);
add("préparation (-te oku)", T.V5, T.TE, [["おく", ""]]);
add("préparation (-toku)", T.V5, T.FIN, [["とく", "て"], ["どく", "で"]]);
add("essai (-te miru)", T.V1, T.TE, [["みる", ""]]);
add("direction (-te iku)", T.V5, T.TE, [["いく", ""]]);
add("direction (-te kuru)", T.VK, T.TE, [["くる", ""]]);
add("demande (-te kudasai)", T.FIN, T.TE, [["ください", ""], ["下さい", ""]]);
add("souhait (-te hoshii)", T.ADJ, T.TE, [["ほしい", ""], ["欲しい", ""]]);
add("bienfait (-te kureru)", T.V1, T.TE, [["くれる", ""]]);
add("bienfait (-te ageru)", T.V1, T.TE, [["あげる", ""]]);
add("bienfait (-te morau)", T.V5, T.TE, [["もらう", ""]]);

// Copula after nouns and な-adjectives.
add("copule", T.FIN, T.NA, [
  ["だ", ""],
  ["です", ""],
  ["だった", ""],
  ["でした", ""],
  ["じゃない", ""],
  ["ではない", ""],
  ["じゃなかった", ""],
  ["ではなかった", ""],
  ["な", ""],
  ["に", ""],
  ["で", ""],
]);

export interface Candidate {
  term: string;
  types: number; // word classes the dictionary entry must have (0 = any, the text itself)
  reasons: string[];
}

export function deinflect(text: string): Candidate[] {
  const out: Candidate[] = [{ term: text, types: 0, reasons: [] }];
  const seen = new Map<string, number>([[`${text}`, T.FIN]]);
  const queue: { term: string; t: number; reasons: string[] }[] = [{ term: text, t: T.FIN | WORD | T.TE, reasons: [] }];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const r of rules) {
      if (!(cur.t & r.inT) || !cur.term.endsWith(r.from)) continue;
      const base = cur.term.slice(0, cur.term.length - r.from.length);
      const term = base + r.to;
      if (!term) continue;
      const key = `${term}|${r.outT}`;
      if (seen.has(key)) continue;
      seen.set(key, r.outT);
      const reasons = r.why ? [r.why, ...cur.reasons] : cur.reasons;
      if (reasons.length > 6) continue;
      queue.push({ term, t: r.outT, reasons });
      if (r.outT & (WORD | T.NA)) out.push({ term, types: r.outT, reasons });
      if (r.outT & T.VS && term.endsWith("する") && term.length > 2) {
        out.push({ term: term.slice(0, -2), types: T.NA | T.VS, reasons });
      }
    }
  }
  return out;
}

/** Which deinflection classes a dictionary entry's parts of speech allow. */
export function posTypes(pos: string[]): number {
  let t = 0;
  for (const p of pos) {
    if (p === "v1" || p === "v1-s" || p === "vz") t |= T.V1;
    else if (p.startsWith("v5")) t |= T.V5;
    else if (p === "vs" || p === "vs-s" || p === "vs-i") t |= T.VS;
    else if (p === "vk") t |= T.VK;
    else if (p === "adj-i" || p === "adj-ix") t |= T.ADJ;
    if (p === "n" || p === "adj-na" || p === "adj-no" || p === "vs" || p === "pn" || p === "adv" || p === "exp")
      t |= T.NA;
  }
  return t;
}
