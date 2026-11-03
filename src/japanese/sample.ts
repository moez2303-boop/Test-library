import type { Clip } from "./types";

/**
 * A demo scene with original dialogue so the grader can be tried right away.
 * It has no video attached — edit it to attach your own clip.
 */
export const DEMO_CLIP: Clip = {
  id: "demo-station",
  title: "Late at the station (demo)",
  anime: "Original demo scene",
  level: "N5",
  source: { kind: "none" },
  start: 0,
  end: 0,
  transcript: [
    "ハル：ごめん、待った？",
    "ユイ：ううん、今来たところ。…って、うそ。三十分も待ったよ！",
    "ハル：本当にごめん！電車が止まっちゃって…",
    "ユイ：もう…。じゃあ、ラーメンおごってくれたら許してあげる。",
    "ハル：いいよ！駅の前の店、行こう！",
  ].join("\n"),
  translation: [
    "Haru: Sorry, did you wait long?",
    "Yui: No, I just got here. …Just kidding. I waited thirty whole minutes!",
    "Haru: I'm really sorry! The train stopped…",
    "Yui: Geez… Fine, I'll forgive you if you treat me to ramen.",
    "Haru: Deal! Let's go to the place in front of the station!",
  ].join("\n"),
  questions: [
    {
      id: "q1",
      prompt: "ユイさんはどのくらい待ちましたか。",
      promptEn: "How long did Yui wait?",
      referenceAnswer: "三十分待ちました。",
    },
    {
      id: "q2",
      prompt: "ハルさんはどうして遅れましたか。",
      promptEn: "Why was Haru late?",
      referenceAnswer: "電車が止まったからです。",
    },
    {
      id: "q3",
      prompt: "ユイさんは何をしてもらったら、ハルさんを許しますか。",
      promptEn: "What does Haru have to do to be forgiven?",
      referenceAnswer: "ラーメンをおごってもらったら許します。",
    },
    {
      id: "q4",
      prompt: "友達が三十分遅れたら、あなたはどうしますか。",
      promptEn: "What would you do if a friend were 30 minutes late?",
    },
  ],
  createdAt: 0,
  isDemo: true,
};
