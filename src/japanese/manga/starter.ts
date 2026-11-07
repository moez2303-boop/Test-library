import type { MangaLesson } from "./types";
import more from "./starters.json";

/**
 * A ready-made original chapter, so the Manga tab has something to read on
 * first open. Original characters and story.
 */
export const STARTER_LESSON: MangaLesson = {
  id: "starter-ninja-konbini",
  title: "{深夜|しんや}コンビニの{忍者|にんじゃ}{店員|てんいん}",
  titleEn: "The Ninja Clerk of the Late-Night Convenience Store",
  summaryEn:
    "Hayate, a college student secretly from a ninja clan, works the night shift at a convenience store and nearly blows his cover chasing a shoplifter.",
  level: "N3",
  source: "story",
  style: "random",
  topic: "コメディ · Comedy",
  pageCount: 3,
  pages: [
    {
      panels: [
        {
          scene: "{午前|ごぜん}{二時|にじ}。{駅前|えきまえ}のコンビニ。",
          sceneEn: "2 a.m. A convenience store in front of the station.",
          lines: [
            {
              speaker: "ナレーション",
              text: "{霧島|きりしま}ハヤテ、二十歳。{大学生|だいがくせい}。そして――",
              en: "Hayate Kirishima, 20. College student. And also...",
            },
            { speaker: "ナレーション", text: "{最後|さいご}の{忍者|にんじゃ}である。", en: "...the last ninja." },
          ],
        },
        {
          scene: "ハヤテがレジに{立|た}っている。{眠|ねむ}そうな{店長|てんちょう}。",
          sceneEn: "Hayate stands at the register. The manager looks sleepy.",
          lines: [
            {
              speaker: "店長",
              text: "ハヤテくん、{棚|たな}の{整理|せいり}、お{願|ねが}いできる？",
              en: "Hayate, could you tidy up the shelves?",
            },
            { speaker: "ハヤテ", text: "はい、すぐやります。", en: "Sure, right away." },
          ],
        },
        {
          scene: "{一瞬|いっしゅん}で{棚|たな}がきれいになる。",
          sceneEn: "In an instant, the shelves are spotless.",
          lines: [
            { speaker: "SFX", text: "シュッ", en: "(whoosh)" },
            { speaker: "店長", text: "…え？もう{終|お}わったの？", en: "...Huh? You're already done?" },
            { speaker: "ハヤテ", text: "{慣|な}れてますから。", en: "I'm used to it." },
          ],
        },
        {
          scene: "ハヤテ、{冷|ひ}や{汗|あせ}。",
          sceneEn: "Hayate breaks into a cold sweat.",
          lines: [
            {
              speaker: "ハヤテ（心の声）",
              text: "{危|あぶ}ない…。{本気|ほんき}を{出|だ}しすぎた。",
              en: "That was close... I went way too all-out.",
            },
            {
              speaker: "ハヤテ（心の声）",
              text: "{忍者|にんじゃ}だとバレたら、{一族|いちぞく}の{掟|おきて}で{村|むら}に{帰|かえ}らなきゃいけないんだ。",
              en: "If anyone finds out I'm a ninja, the clan's rules say I have to go back to the village.",
            },
          ],
        },
      ],
    },
    {
      panels: [
        {
          scene: "ドアが{開|ひら}き、{女|おんな}の{子|こ}が{入|はい}ってくる。",
          sceneEn: "The door opens and a girl comes in.",
          lines: [
            { speaker: "SFX", text: "ピンポーン", en: "(door chime)" },
            { speaker: "ミオ", text: "こんばんは。{肉|にく}まん、まだありますか？", en: "Good evening. Do you still have meat buns?" },
          ],
        },
        {
          scene: "ハヤテがケースを{見|み}る。",
          sceneEn: "Hayate checks the warmer.",
          lines: [
            { speaker: "ハヤテ", text: "あと{一|ひと}つだけです。", en: "Just one left." },
            {
              speaker: "ミオ",
              text: "よかった！{試験|しけん}{勉強|べんきょう}の{夜食|やしょく}なんです。",
              en: "Great! It's my late-night snack for exam studying.",
            },
          ],
        },
        {
          scene: "{帽子|ぼうし}の{男|おとこ}が{棚|たな}の{陰|かげ}でおにぎりをポケットに{入|い}れる。",
          sceneEn: "Behind a shelf, a man in a cap slips a rice ball into his pocket.",
          lines: [{ speaker: "ナレーション", text: "その{時|とき}――", en: "Just then..." }],
        },
        {
          scene: "{男|おとこ}がドアへ{走|はし}る。",
          sceneEn: "The man runs for the door.",
          lines: [
            {
              speaker: "ミオ",
              text: "あっ！あの{人|ひと}、お{金|かね}を{払|はら}わないで{出|で}ていく！",
              en: "Ah! That guy is leaving without paying!",
            },
            { speaker: "帽子の男", text: "{邪魔|じゃま}するな！", en: "Out of my way!" },
            { speaker: "SFX", text: "ダッ", en: "(dash)" },
          ],
        },
      ],
    },
    {
      panels: [
        {
          scene: "ハヤテのアップ。",
          sceneEn: "Close-up on Hayate.",
          lines: [
            {
              speaker: "ハヤテ（心の声）",
              text: "{追|お}いかけたら、{正体|しょうたい}がバレるかもしれない。でも…",
              en: "If I chase him, my true identity might come out. But...",
            },
          ],
        },
        {
          scene: "レジからハヤテが{消|き}える。",
          sceneEn: "Hayate vanishes from behind the register.",
          lines: [
            { speaker: "SFX", text: "ヒュン", en: "(swish)" },
            { speaker: "ミオ", text: "え…？{店員|てんいん}さんが{消|き}えた！？", en: "Huh...? The clerk disappeared!?" },
          ],
        },
        {
          scene: "{店|みせ}の{外|そと}。{逃|に}げる{男|おとこ}の{前|まえ}に、ハヤテが{立|た}っている。",
          sceneEn: "Outside the store. Hayate is already standing in front of the fleeing man.",
          lines: [
            { speaker: "帽子の男", text: "な、なんで{前|まえ}にいるんだ！？", en: "Wh-why are you in front of me!?" },
            {
              speaker: "ハヤテ",
              text: "おにぎり、{百五十円|ひゃくごじゅうえん}になります。",
              en: "That'll be 150 yen for the rice ball.",
            },
          ],
        },
        {
          scene: "{店|みせ}の{中|なか}。{男|おとこ}は{頭|あたま}を{下|さ}げてお{金|かね}を{払|はら}った。",
          sceneEn: "Back inside. The man bowed and paid.",
          lines: [
            {
              speaker: "ミオ",
              text: "ねえ、{今|いま}の{何|なに}？{走|はし}るの、{速|はや}すぎない？",
              en: "Hey, what was that? Aren't you way too fast?",
            },
            { speaker: "ハヤテ", text: "…{高校|こうこう}で{陸上部|りくじょうぶ}だったんです。", en: "...I was on the track team in high school." },
            { speaker: "ミオ", text: "ふーん。{明日|あした}も{来|く}るね。", en: "Hmm. I'll come back tomorrow, too." },
            {
              speaker: "ナレーション",
              text: "ハヤテの{秘密|ひみつ}が、{少|すこ}しずつ{危|あや}うくなっていく――。",
              en: "Little by little, Hayate's secret is in danger...",
            },
          ],
        },
      ],
    },
  ],
  glossary: [
    { word: "深夜", reading: "しんや", meaning: "late at night" },
    { word: "整理", reading: "せいり", meaning: "tidying up, sorting" },
    { word: "慣れる", reading: "なれる", meaning: "to get used to" },
    { word: "本気を出す", reading: "ほんきをだす", meaning: "to go all out, get serious" },
    { word: "掟", reading: "おきて", meaning: "rule, code (of a group)" },
    { word: "夜食", reading: "やしょく", meaning: "late-night snack" },
    { word: "払う", reading: "はらう", meaning: "to pay" },
    { word: "邪魔する", reading: "じゃまする", meaning: "to get in the way" },
    { word: "追いかける", reading: "おいかける", meaning: "to chase" },
    { word: "正体", reading: "しょうたい", meaning: "true identity" },
    { word: "バレる", reading: "ばれる", meaning: "to be found out (casual)" },
    { word: "危うい", reading: "あやうい", meaning: "in danger, precarious" },
  ],
  exercises: [
    {
      type: "vocabulary",
      prompt: "「{正体|しょうたい}がバレる」の「{正体|しょうたい}」の{意味|いみ}は？",
      promptEn: "In 正体がバレる, what does 正体 mean?",
      options: ["part-time job", "true identity", "secret technique", "store manager"],
      answerIndex: 1,
      explanation:
        "正体 (しょうたい) is someone's true identity. 正体がバレる means \"your true identity gets found out\", exactly what Hayate is afraid of.",
      referenceAnswer: "",
    },
    {
      type: "grammar",
      prompt: "{忍者|にんじゃ}だとバレたら、{村|むら}に{帰|かえ}ら＿＿いけない。",
      promptEn: "If they find out I'm a ninja, I have to go back to the village.",
      options: ["なきゃ", "ないで", "ずに", "なくても"],
      answerIndex: 0,
      explanation:
        "〜なきゃいけない is the casual, spoken form of 〜なければいけない: \"have to\". 帰らなきゃいけない = \"I have to go back\".",
      referenceAnswer: "",
    },
    {
      type: "who_said_it",
      prompt: "「おにぎり、{百五十円|ひゃくごじゅうえん}になります。」",
      promptEn: "\"That'll be 150 yen for the rice ball.\" Who said it?",
      options: ["ミオ", "店長", "ハヤテ", "帽子の男"],
      answerIndex: 2,
      explanation:
        "Hayate says it after catching the shoplifter outside. 〜になります is the polite phrase store clerks use for prices.",
      referenceAnswer: "",
    },
    {
      type: "true_false",
      prompt: "ミオは{試験|しけん}{勉強|べんきょう}の{夜食|やしょく}を{買|か}いに{来|き}た。",
      promptEn: "Mio came to buy a late-night snack for exam studying.",
      options: ["○ 正しい", "× まちがい"],
      answerIndex: 0,
      explanation: "True: she says 試験勉強の夜食なんです when she buys the last meat bun.",
      referenceAnswer: "",
    },
    {
      type: "open_question",
      prompt: "ハヤテはどうして「{陸上部|りくじょうぶ}だった」と{言|い}ったと{思|おも}いますか。",
      promptEn: "Why do you think Hayate said he \"was on the track team\"?",
      options: [],
      answerIndex: -1,
      explanation: "",
      referenceAnswer: "{忍者|にんじゃ}だとバレたくなかったから、うそをついたんだと{思|おも}います。",
    },
    {
      type: "continue_story",
      prompt:
        "{次|つぎ}の{日|ひ}の{夜|よる}、ミオがまたコンビニに{来|き}ます。{何|なに}が{起|お}きると{思|おも}いますか。2〜4{文|ぶん}で{書|か}いてください。",
      promptEn: "The next night, Mio comes to the store again. What do you think happens? Write 2-4 sentences.",
      options: [],
      answerIndex: -1,
      explanation: "",
      referenceAnswer:
        "ミオはハヤテを{試|ため}すために、わざと{高|たか}い{棚|たな}の{上|うえ}の{物|もの}を{落|お}とします。ハヤテは{一瞬|いっしゅん}で{受|う}け{止|と}めてしまいます。ミオは「やっぱり！」と{笑|わら}いました。",
    },
  ],
  results: {},
  createdAt: 0,
};

/** Every ready-made lesson, newest first in the list. */
export const STARTER_LESSONS: MangaLesson[] = [
  ...(more as Omit<MangaLesson, "results" | "createdAt">[]).map((l) => ({ ...l, results: {}, createdAt: 0 })),
  STARTER_LESSON,
];
