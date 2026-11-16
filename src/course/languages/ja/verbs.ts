import type { ConjRow, VerbSet } from "../types";

type VerbType = "ru" | "u" | "suru" | "kuru";

interface JVerb {
  kanji: string;
  kana: string;
  en: string;
  type: VerbType;
}

const VERBS: JVerb[] = [
  { kanji: "する", kana: "する", en: "to do", type: "suru" },
  { kanji: "来る", kana: "くる", en: "to come", type: "kuru" },
  { kanji: "行く", kana: "いく", en: "to go", type: "u" },
  { kanji: "食べる", kana: "たべる", en: "to eat", type: "ru" },
  { kanji: "飲む", kana: "のむ", en: "to drink", type: "u" },
  { kanji: "見る", kana: "みる", en: "to see / watch", type: "ru" },
  { kanji: "話す", kana: "はなす", en: "to speak", type: "u" },
  { kanji: "書く", kana: "かく", en: "to write", type: "u" },
  { kanji: "読む", kana: "よむ", en: "to read", type: "u" },
  { kanji: "聞く", kana: "きく", en: "to listen / ask", type: "u" },
  { kanji: "待つ", kana: "まつ", en: "to wait", type: "u" },
  { kanji: "買う", kana: "かう", en: "to buy", type: "u" },
  { kanji: "会う", kana: "あう", en: "to meet", type: "u" },
  { kanji: "帰る", kana: "かえる", en: "to go home", type: "u" },
  { kanji: "入る", kana: "はいる", en: "to enter", type: "u" },
  { kanji: "作る", kana: "つくる", en: "to make", type: "u" },
  { kanji: "使う", kana: "つかう", en: "to use", type: "u" },
  { kanji: "持つ", kana: "もつ", en: "to hold / have", type: "u" },
  { kanji: "遊ぶ", kana: "あそぶ", en: "to play / hang out", type: "u" },
  { kanji: "泳ぐ", kana: "およぐ", en: "to swim", type: "u" },
  { kanji: "起きる", kana: "おきる", en: "to get up", type: "ru" },
  { kanji: "寝る", kana: "ねる", en: "to sleep", type: "ru" },
  { kanji: "教える", kana: "おしえる", en: "to teach", type: "ru" },
  { kanji: "いる", kana: "いる", en: "to be (people, animals)", type: "ru" },
  { kanji: "勉強する", kana: "べんきょうする", en: "to study", type: "suru" },
];

type FormKey =
  | "masu" | "masen" | "mashita" | "masendeshita" | "mashou"
  | "dict" | "nai" | "ta" | "nakatta"
  | "te" | "tai" | "potential" | "volitional" | "ba" | "imperative" | "passive" | "causative";

const GROUPS: { id: string; label: string; en: string; rows: { key: FormKey; label: string }[] }[] = [
  {
    id: "polite",
    label: "Polite",
    en: "The ます forms used with people you don't know well",
    rows: [
      { key: "masu", label: "Present (〜ます)" },
      { key: "masen", label: "Negative (〜ません)" },
      { key: "mashita", label: "Past (〜ました)" },
      { key: "masendeshita", label: "Past negative (〜ませんでした)" },
      { key: "mashou", label: "Let's… (〜ましょう)" },
    ],
  },
  {
    id: "plain",
    label: "Plain",
    en: "Casual forms used with friends, and inside longer sentences",
    rows: [
      { key: "dict", label: "Dictionary form" },
      { key: "nai", label: "Negative (〜ない)" },
      { key: "ta", label: "Past (〜た)" },
      { key: "nakatta", label: "Past negative (〜なかった)" },
    ],
  },
  {
    id: "more",
    label: "More forms",
    en: "て form and the forms built for wanting, ability, plans and conditions",
    rows: [
      { key: "te", label: "て form" },
      { key: "tai", label: "Want to (〜たい)" },
      { key: "potential", label: "Can (potential)" },
      { key: "volitional", label: "Let's / I'll (volitional)" },
      { key: "ba", label: "If (〜ば)" },
      { key: "imperative", label: "Command (imperative)" },
      { key: "passive", label: "Passive" },
      { key: "causative", label: "Causative (make / let)" },
    ],
  },
];

const ROWS: Record<string, string[]> = {
  う: ["わ", "い", "う", "え", "お"],
  く: ["か", "き", "く", "け", "こ"],
  ぐ: ["が", "ぎ", "ぐ", "げ", "ご"],
  す: ["さ", "し", "す", "せ", "そ"],
  つ: ["た", "ち", "つ", "て", "と"],
  ぬ: ["な", "に", "ぬ", "ね", "の"],
  ぶ: ["ば", "び", "ぶ", "べ", "ぼ"],
  む: ["ま", "み", "む", "め", "も"],
  る: ["ら", "り", "る", "れ", "ろ"],
};

const SURU: Record<FormKey, string> = {
  masu: "します", masen: "しません", mashita: "しました", masendeshita: "しませんでした", mashou: "しましょう",
  dict: "する", nai: "しない", ta: "した", nakatta: "しなかった",
  te: "して", tai: "したい", potential: "できる", volitional: "しよう", ba: "すれば", imperative: "しろ", passive: "される", causative: "させる",
};
const KURU: Record<FormKey, string> = {
  masu: "きます", masen: "きません", mashita: "きました", masendeshita: "きませんでした", mashou: "きましょう",
  dict: "くる", nai: "こない", ta: "きた", nakatta: "こなかった",
  te: "きて", tai: "きたい", potential: "こられる", volitional: "こよう", ba: "くれば", imperative: "こい", passive: "こられる", causative: "こさせる",
};

/** Conjugate one spelling (kanji or kana) of a verb; both end in the same kana. */
function inflect(word: string, v: JVerb, key: FormKey): string {
  if (v.type === "suru") return word.slice(0, -2) + SURU[key];
  if (v.type === "kuru") {
    const kana = KURU[key];
    // 来 replaces the first kana: 来ます, 来ない, 来られる.
    return word === v.kanji ? "来" + kana.slice(1) : kana;
  }
  if (v.type === "ru") {
    const s = word.slice(0, -1);
    const end: Record<FormKey, string> = {
      masu: "ます", masen: "ません", mashita: "ました", masendeshita: "ませんでした", mashou: "ましょう",
      dict: "る", nai: "ない", ta: "た", nakatta: "なかった",
      te: "て", tai: "たい", potential: "られる", volitional: "よう", ba: "れば", imperative: "ろ", passive: "られる", causative: "させる",
    };
    return s + end[key];
  }
  // u-verbs: change the last kana along its row.
  const last = word.slice(-1);
  const base = word.slice(0, -1);
  const row = ROWS[last];
  const [a, i, , e, o] = row;
  const teTa = (t: "て" | "た") => {
    if (v.kana === "いく") return base + (t === "て" ? "って" : "った");
    if ("うつる".includes(last)) return base + (t === "て" ? "って" : "った");
    if ("むぶぬ".includes(last)) return base + (t === "て" ? "んで" : "んだ");
    if (last === "く") return base + (t === "て" ? "いて" : "いた");
    if (last === "ぐ") return base + (t === "て" ? "いで" : "いだ");
    return base + (t === "て" ? "して" : "した");
  };
  switch (key) {
    case "masu": return base + i + "ます";
    case "masen": return base + i + "ません";
    case "mashita": return base + i + "ました";
    case "masendeshita": return base + i + "ませんでした";
    case "mashou": return base + i + "ましょう";
    case "dict": return word;
    case "nai": return base + a + "ない";
    case "ta": return teTa("た");
    case "nakatta": return base + a + "なかった";
    case "te": return teTa("て");
    case "tai": return base + i + "たい";
    case "potential": return base + e + "る";
    case "volitional": return base + o + "う";
    case "ba": return base + e + "ば";
    case "imperative": return base + e;
    case "passive": return base + a + "れる";
    case "causative": return base + a + "せる";
  }
}

const GROUP_NAMES: Record<VerbType, string> = { ru: "る-verb (ichidan)", u: "う-verb (godan)", suru: "irregular", kuru: "irregular" };

export const japaneseVerbs: VerbSet = {
  verbs: VERBS.map((v) => ({
    id: v.kana,
    head: v.kanji,
    reading: v.kanji === v.kana ? undefined : v.kana,
    en: v.en,
    group: GROUP_NAMES[v.type],
    info: v.kana === "いく" ? "て form is 行って, an exception" : v.kana === "かえる" || v.kana === "はいる" ? "Looks like a る-verb but conjugates as an う-verb" : undefined,
  })),
  forms: GROUPS.map((g) => ({ id: g.id, label: g.label, en: g.en })),
  rows(verbId, formId): ConjRow[] {
    const v = VERBS.find((x) => x.kana === verbId)!;
    const g = GROUPS.find((x) => x.id === formId)!;
    return g.rows.map(({ key, label }) => {
      const text = inflect(v.kanji, v, key);
      const reading = inflect(v.kana, v, key);
      return { label, text, reading: text === reading ? undefined : reading, speak: text, prompt: "", answers: [reading, text] };
    });
  },
};
