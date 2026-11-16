import type { CourseLanguage, VerbSet } from "../types";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { SURVIVAL } from "./survival";
import { PRONOUNS, TENSES, VERBS, answerFor, conjugate, type Tense } from "./verbs";

const spoken = (line: string) => line.replace(/\(e\)|\(s\)|\/elle\/on|\/elles/g, "");

const verbs: VerbSet = {
  verbs: VERBS.map((v) => ({
    id: v.inf,
    head: v.inf,
    en: v.en,
    group: v.group,
    info: `past participle: ${v.participle} · auxiliary: ${v.aux}`,
  })),
  forms: TENSES.map((t) => ({ id: t.id, label: t.id, en: t.en })),
  rows(verbId, formId) {
    const v = VERBS.find((x) => x.inf === verbId)!;
    const tense = formId as Tense;
    return conjugate(v, tense).map((line, i) => {
      const answer = answerFor(v, tense, i);
      // Past participles with être agree with the subject: allé, allée, allés, allées.
      const answers = tense === "passé composé" && v.aux === "être" ? ["", "e", "s", "es"].map((x) => answer + x) : [answer];
      const que = tense === "subjonctif" ? (i === 2 || i === 5 ? "qu'" : "que ") : "";
      return { label: "", text: line, speak: spoken(line), prompt: que + PRONOUNS[i], answers };
    });
  },
};

export const french: CourseLanguage = {
  id: "fr",
  name: "French",
  native: "Français",
  brand: "Allons-y",
  mark: "A",
  flag: "🇫🇷",
  speechLocale: "fr-FR",
  shortCode: "fr",
  levels: [
    {
      level: 1,
      title: "Débutant",
      blurb: "Greet people, order in a café, find your way and talk about yourself.",
      modules: [
        { module: 1, title: "First steps" },
        { module: 2, title: "Out and about" },
        { module: 3, title: "Everyday life" },
      ],
    },
    {
      level: 2,
      title: "Intermédiaire",
      blurb: "Travel, talk about work, make plans and tell stories about the past.",
      modules: [
        { module: 4, title: "On the road" },
        { module: 5, title: "Work and plans" },
        { module: 6, title: "Telling stories" },
      ],
    },
    {
      level: 3,
      title: "Avancé",
      blurb: "Share memories, handle formal situations and argue your point of view.",
      modules: [
        { module: 7, title: "Settling in" },
        { module: 8, title: "Hopes and opinions" },
      ],
    },
  ],
  lessons: [...level1, ...level2, ...level3],
  survival: SURVIVAL,
  verbs,
  typingKeys: ["à", "â", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "ù", "û", "œ", "«", "»"],
  typingHint: "Listen and type what you hear in French. Punctuation and capitals don't matter.",
  cheers: {
    welcome: "Bienvenue !",
    welcomeBack: "Bon retour !",
    congrats: "Félicitations !",
    excellent: "Excellent !",
    almost: "Pas mal — almost there",
    perfect: "Parfait !",
    bravo: "Bravo !",
    veryGood: "Très bien !",
    correct: "Correct !",
    notQuite: "Pas tout à fait…",
    noMistakes: "Sans faute !",
    allRated: "Ça y est !",
    typeHere: "Tapez ici…",
  },
  badgeTitles: {
    "first-steps": "Premiers pas",
    "points-100": "Cent points",
    "points-1000": "Mille points",
    "points-5000": "Champion",
    goal: "Objectif atteint",
    "streak-3": "En feu",
    "streak-7": "Une semaine",
    "streak-30": "Un mois",
    "perfect-quiz": "Sans faute",
    actor: "Comédien",
    "lesson-1": "Leçon terminée",
    "lesson-10": "Studieux",
    "vocab-25": "Collectionneur",
    "level-1": "Niveau 1",
    "level-2": "Niveau 2",
    "level-3": "Niveau 3",
  },
  certificateHeading: "Certificat de réussite",
};
