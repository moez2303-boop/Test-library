/** Conjugation data for the verb trainer. Compound and derived tenses are built from a few stems. */

export const PRONOUNS = ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"] as const;

export type Tense =
  | "présent"
  | "passé composé"
  | "imparfait"
  | "futur simple"
  | "conditionnel"
  | "subjonctif";

export const TENSES: { id: Tense; en: string }[] = [
  { id: "présent", en: "Present" },
  { id: "passé composé", en: "Perfect (past)" },
  { id: "imparfait", en: "Imperfect" },
  { id: "futur simple", en: "Future" },
  { id: "conditionnel", en: "Conditional" },
  { id: "subjonctif", en: "Subjunctive" },
];

export interface Verb {
  inf: string;
  en: string;
  group: "-er" | "-ir" | "-re" | "irregular";
  present: string[];
  participle: string;
  aux: "avoir" | "être";
  /** Imperfect stem; defaults to the nous present form minus -ons. */
  impStem?: string;
  futStem: string;
  subj: string[];
}

export const VERBS: Verb[] = [
  {
    inf: "être", en: "to be", group: "irregular",
    present: ["suis", "es", "est", "sommes", "êtes", "sont"],
    participle: "été", aux: "avoir", impStem: "ét", futStem: "ser",
    subj: ["sois", "sois", "soit", "soyons", "soyez", "soient"],
  },
  {
    inf: "avoir", en: "to have", group: "irregular",
    present: ["ai", "as", "a", "avons", "avez", "ont"],
    participle: "eu", aux: "avoir", futStem: "aur",
    subj: ["aie", "aies", "ait", "ayons", "ayez", "aient"],
  },
  {
    inf: "aller", en: "to go", group: "irregular",
    present: ["vais", "vas", "va", "allons", "allez", "vont"],
    participle: "allé", aux: "être", futStem: "ir",
    subj: ["aille", "ailles", "aille", "allions", "alliez", "aillent"],
  },
  {
    inf: "faire", en: "to do / make", group: "irregular",
    present: ["fais", "fais", "fait", "faisons", "faites", "font"],
    participle: "fait", aux: "avoir", futStem: "fer",
    subj: ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"],
  },
  {
    inf: "pouvoir", en: "can / to be able", group: "irregular",
    present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
    participle: "pu", aux: "avoir", futStem: "pourr",
    subj: ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"],
  },
  {
    inf: "vouloir", en: "to want", group: "irregular",
    present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
    participle: "voulu", aux: "avoir", futStem: "voudr",
    subj: ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"],
  },
  {
    inf: "devoir", en: "must / to owe", group: "irregular",
    present: ["dois", "dois", "doit", "devons", "devez", "doivent"],
    participle: "dû", aux: "avoir", futStem: "devr",
    subj: ["doive", "doives", "doive", "devions", "deviez", "doivent"],
  },
  {
    inf: "venir", en: "to come", group: "irregular",
    present: ["viens", "viens", "vient", "venons", "venez", "viennent"],
    participle: "venu", aux: "être", futStem: "viendr",
    subj: ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"],
  },
  {
    inf: "prendre", en: "to take", group: "irregular",
    present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
    participle: "pris", aux: "avoir", futStem: "prendr",
    subj: ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"],
  },
  {
    inf: "savoir", en: "to know (facts)", group: "irregular",
    present: ["sais", "sais", "sait", "savons", "savez", "savent"],
    participle: "su", aux: "avoir", futStem: "saur",
    subj: ["sache", "saches", "sache", "sachions", "sachiez", "sachent"],
  },
  {
    inf: "dire", en: "to say", group: "irregular",
    present: ["dis", "dis", "dit", "disons", "dites", "disent"],
    participle: "dit", aux: "avoir", futStem: "dir",
    subj: ["dise", "dises", "dise", "disions", "disiez", "disent"],
  },
  {
    inf: "voir", en: "to see", group: "irregular",
    present: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
    participle: "vu", aux: "avoir", futStem: "verr",
    subj: ["voie", "voies", "voie", "voyions", "voyiez", "voient"],
  },
  {
    inf: "mettre", en: "to put", group: "irregular",
    present: ["mets", "mets", "met", "mettons", "mettez", "mettent"],
    participle: "mis", aux: "avoir", futStem: "mettr",
    subj: ["mette", "mettes", "mette", "mettions", "mettiez", "mettent"],
  },
  {
    inf: "boire", en: "to drink", group: "irregular",
    present: ["bois", "bois", "boit", "buvons", "buvez", "boivent"],
    participle: "bu", aux: "avoir", futStem: "boir",
    subj: ["boive", "boives", "boive", "buvions", "buviez", "boivent"],
  },
  {
    inf: "partir", en: "to leave", group: "irregular",
    present: ["pars", "pars", "part", "partons", "partez", "partent"],
    participle: "parti", aux: "être", futStem: "partir",
    subj: ["parte", "partes", "parte", "partions", "partiez", "partent"],
  },
  {
    inf: "parler", en: "to speak", group: "-er",
    present: ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
    participle: "parlé", aux: "avoir", futStem: "parler",
    subj: ["parle", "parles", "parle", "parlions", "parliez", "parlent"],
  },
  {
    inf: "aimer", en: "to like / love", group: "-er",
    present: ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
    participle: "aimé", aux: "avoir", futStem: "aimer",
    subj: ["aime", "aimes", "aime", "aimions", "aimiez", "aiment"],
  },
  {
    inf: "habiter", en: "to live (somewhere)", group: "-er",
    present: ["habite", "habites", "habite", "habitons", "habitez", "habitent"],
    participle: "habité", aux: "avoir", futStem: "habiter",
    subj: ["habite", "habites", "habite", "habitions", "habitiez", "habitent"],
  },
  {
    inf: "manger", en: "to eat", group: "-er",
    present: ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
    participle: "mangé", aux: "avoir", futStem: "manger",
    subj: ["mange", "manges", "mange", "mangions", "mangiez", "mangent"],
  },
  {
    inf: "finir", en: "to finish", group: "-ir",
    present: ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
    participle: "fini", aux: "avoir", futStem: "finir",
    subj: ["finisse", "finisses", "finisse", "finissions", "finissiez", "finissent"],
  },
  {
    inf: "choisir", en: "to choose", group: "-ir",
    present: ["choisis", "choisis", "choisit", "choisissons", "choisissez", "choisissent"],
    participle: "choisi", aux: "avoir", futStem: "choisir",
    subj: ["choisisse", "choisisses", "choisisse", "choisissions", "choisissiez", "choisissent"],
  },
  {
    inf: "attendre", en: "to wait", group: "-re",
    present: ["attends", "attends", "attend", "attendons", "attendez", "attendent"],
    participle: "attendu", aux: "avoir", futStem: "attendr",
    subj: ["attende", "attendes", "attende", "attendions", "attendiez", "attendent"],
  },
];

const IMP_END = ["ais", "ais", "ait", "ions", "iez", "aient"];
const FUT_END = ["ai", "as", "a", "ons", "ez", "ont"];
const AVOIR = ["ai", "as", "a", "avons", "avez", "ont"];
const ETRE = ["suis", "es", "est", "sommes", "êtes", "sont"];
const AGREE = ["(e)", "(e)", "(e)", "(e)s", "(e)(s)", "(e)s"];

const startsWithVowel = (s: string) => /^[aeiouyhàâéèêëîïôûù]/i.test(s);

/** Join a pronoun to a verb form, eliding je → j'. */
function withPronoun(i: number, form: string): string {
  if (i === 0 && startsWithVowel(form)) return `j'${form}`;
  return `${PRONOUNS[i]} ${form}`;
}

function impForm(v: Verb, i: number): string {
  const stem = v.impStem ?? v.present[3].replace(/ons$/, "");
  const end = IMP_END[i];
  // mangeons → mangeais but mangions: the e is only kept before a or o.
  const s = stem.endsWith("ge") && end.startsWith("i") ? stem.slice(0, -1) : stem;
  return s + end;
}

/** Full "pronoun + form" lines for one verb and tense. */
export function conjugate(v: Verb, tense: Tense): string[] {
  return PRONOUNS.map((_, i) => {
    switch (tense) {
      case "présent":
        return withPronoun(i, v.present[i]);
      case "imparfait":
        return withPronoun(i, impForm(v, i));
      case "futur simple":
        return withPronoun(i, v.futStem + FUT_END[i]);
      case "conditionnel":
        return withPronoun(i, v.futStem + IMP_END[i]);
      case "passé composé": {
        const aux = v.aux === "avoir" ? AVOIR[i] : ETRE[i];
        const part = v.aux === "être" ? v.participle + AGREE[i] : v.participle;
        return `${withPronoun(i, aux)} ${part}`;
      }
      case "subjonctif": {
        const line = withPronoun(i, v.subj[i]);
        return i === 2 || i === 5 ? `qu'${line}` : `que ${line}`;
      }
    }
  });
}

/** The bare verb form a learner is asked to type in the drill (without pronoun). */
export function answerFor(v: Verb, tense: Tense, i: number): string {
  const line = conjugate(v, tense)[i];
  return line
    .replace(/^qu'|^que /, "")
    .replace(/^j'/, "")
    .replace(new RegExp(`^${PRONOUNS[i].replace("/", "\\/")} `), "")
    .replace(/\(e\)\(s\)|\(e\)s|\(e\)/g, "");
}
