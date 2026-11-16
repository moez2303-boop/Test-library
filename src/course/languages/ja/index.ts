import type { CourseLanguage } from "../types";
import { level1 } from "./level1";
import { level2 } from "./level2";
import { level3 } from "./level3";
import { SURVIVAL } from "./survival";
import { japaneseVerbs } from "./verbs";

export const japanese: CourseLanguage = {
  id: "ja",
  name: "Japanese",
  native: "日本語",
  brand: "Ikimashō",
  mark: "行",
  flag: "🇯🇵",
  speechLocale: "ja-JP",
  shortCode: "ja",
  levels: [
    {
      level: 1,
      title: "初級 Beginner",
      blurb: "Introduce yourself, greet people, order in a café, find your way and talk about what you like.",
      modules: [
        { module: 1, title: "First steps" },
        { module: 2, title: "Out and about" },
        { module: 3, title: "Everyday life" },
      ],
    },
    {
      level: 2,
      title: "中級 Intermediate",
      blurb: "Travel by shinkansen, stay at a ryokan, talk about work, make plans and tell stories about the past.",
      modules: [
        { module: 4, title: "On the road" },
        { module: 5, title: "Work and plans" },
        { module: 6, title: "Telling stories" },
      ],
    },
    {
      level: 3,
      title: "上級 Advanced",
      blurb: "Share memories, speak casually with friends, handle a formal interview and give your opinion.",
      modules: [
        { module: 7, title: "Settling in" },
        { module: 8, title: "Hopes and opinions" },
      ],
    },
  ],
  lessons: [...level1, ...level2, ...level3],
  survival: SURVIVAL,
  verbs: japaneseVerbs,
  typingKeys: [],
  typingHint: "Listen and type what you hear, in kana or romaji (e.g. ohayou gozaimasu). Spaces and long-vowel spelling don't matter.",
  cheers: {
    welcome: "ようこそ！",
    welcomeBack: "おかえりなさい！",
    congrats: "おめでとう！",
    excellent: "すばらしい！",
    almost: "おしい！ Almost there",
    perfect: "完璧！",
    bravo: "よくできました！",
    veryGood: "いいですね！",
    correct: "正解！",
    notQuite: "ちょっと違います…",
    noMistakes: "全問正解！",
    allRated: "できました！",
    typeHere: "Type in kana or romaji…",
  },
  badgeTitles: {
    "first-steps": "第一歩",
    "points-100": "百点",
    "points-1000": "千点",
    "points-5000": "チャンピオン",
    goal: "目標達成",
    "streak-3": "三日連続",
    "streak-7": "一週間",
    "streak-30": "一か月",
    "perfect-quiz": "全問正解",
    actor: "役者",
    "lesson-1": "レッスン完了",
    "lesson-10": "努力家",
    "vocab-25": "コレクター",
    "level-1": "初級修了",
    "level-2": "中級修了",
    "level-3": "上級修了",
  },
  certificateHeading: "修了証書",
};
