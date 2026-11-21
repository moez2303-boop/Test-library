import { z } from "zod";
import { callJson } from "../grader";
import type { JlptLevel, Settings } from "../types";

/** The conversation-partner instructions, as written by the learner. */
const PARTNER_PROMPT = `You are a friendly Japanese conversation partner in a language-learning app.
The learner is at about JLPT N3 level and is working mainly on speaking
fluently and sounding natural. Their level: {{level}}. Today's topic: {{topic}}.

GOAL
Hold a real, flowing conversation about the topic. The learner should feel
they are talking to a person, not doing a drill.

HOW TO REPLY
- Always reply in Japanese, in short natural turns (1-3 sentences).
- Respond to what the learner actually said first, with real interest or an
  opinion, then ask ONE follow-up question to keep the conversation going.
- Use mostly vocabulary at their level. If you use a new word, make its
  meaning clear from context.
- Match the register the learner uses (casual or polite) unless they are
  practicing a specific register.
- If the learner gets stuck or says わからない, give a short English hint and
  one Japanese phrase they could try, then move on.

LIVE CORRECTIONS
After each learner message, check it for:
1. Particle or grammar errors (は/が, に/で, verb forms, て-form, etc.)
2. Unnatural or textbook-sounding phrasing (the meaning is right but a native
   speaker would say it differently)
3. Register mismatch (polite where casual is natural, or the reverse)
4. Missed natural fillers or reactions (えっと, そうですね, へえ, まあ, etc.)

Rules for corrections:
- Give at most 2 corrections per message. Prioritize errors that change
  meaning or sound clearly wrong over minor polish.
- If the message is already natural, give no correction. Do not invent one.
- Never correct so much that the conversation stops. Corrections come after
  your reply, not in place of it.
- Explain each correction in one short English line.
- Be warm and encouraging. Point out one thing they said well when it happens.

OUTPUT FORMAT (return only valid JSON, no extra text)
{
  "reply": "Your Japanese reply and follow-up question",
  "corrections": [
    {
      "original": "what the learner wrote",
      "better": "the more natural version",
      "type": "particle | grammar | naturalness | register",
      "note_en": "one short English explanation"
    }
  ],
  "praise": "one phrase they used well, or null"
}

SPEECH INPUT
The learner's messages may come from speech recognition, so they can contain
kana/kanji variants, missing punctuation, or small transcription errors. Read
for intent. Do not "correct" a transcription error as if the learner made it.`;

export const TOPICS = [
  { jp: "週末の予定", en: "Weekend plans" },
  { jp: "好きなアニメやマンガ", en: "Favorite anime & manga" },
  { jp: "仕事や学校", en: "Work or school" },
  { jp: "旅行の思い出", en: "Travel memories" },
  { jp: "食べ物と料理", en: "Food & cooking" },
  { jp: "ゲーム", en: "Video games" },
  { jp: "日本の文化", en: "Japanese culture" },
  { jp: "最近うれしかったこと", en: "Something good lately" },
];

export type CorrectionType = "particle" | "grammar" | "naturalness" | "register";

export interface Correction {
  original: string;
  better: string;
  type: CorrectionType;
  noteEn: string;
}

export interface ChatTurn {
  role: "partner" | "learner";
  text: string;
  /** On learner turns, filled in once the partner has answered. */
  corrections?: Correction[];
  praise?: string | null;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "corrections", "praise"],
  properties: {
    reply: { type: "string" },
    corrections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["original", "better", "type", "note_en"],
        properties: {
          original: { type: "string" },
          better: { type: "string" },
          type: { type: "string", enum: ["particle", "grammar", "naturalness", "register"] },
          note_en: { type: "string" },
        },
      },
    },
    praise: { anyOf: [{ type: "string" }, { type: "null" }] },
  },
};

const Result = z.object({
  reply: z.string().min(1),
  corrections: z
    .array(
      z.object({
        original: z.string(),
        better: z.string(),
        type: z.string(),
        note_en: z.string(),
      }),
    )
    .default([]),
  praise: z.string().nullable().optional(),
});

const TYPES: CorrectionType[] = ["particle", "grammar", "naturalness", "register"];

/** Keeps the request small: the opening plus the most recent turns. */
function transcript(history: ChatTurn[]): string {
  const recent = history.length > 24 ? [history[0], ...history.slice(-23)] : history;
  return recent.map((t) => `${t.role === "partner" ? "Partner" : "Learner"}: ${t.text}`).join("\n");
}

/**
 * Gets the partner's next turn. With no learner message, the partner opens
 * the conversation.
 */
export async function partnerTurn(
  settings: Settings,
  level: JlptLevel,
  topic: string,
  history: ChatTurn[],
  learnerMessage: string | null,
): Promise<{ reply: string; corrections: Correction[]; praise: string | null }> {
  const system = PARTNER_PROMPT.replace("{{level}}", level).replace("{{topic}}", topic);
  const userText =
    learnerMessage === null
      ? `The conversation hasn't started yet. Open it: greet the learner and ask one question about today's topic. There is no learner message, so return "corrections": [] and "praise": null.`
      : `${history.length ? `Conversation so far (oldest first):\n<conversation>\n${transcript(history)}\n</conversation>\n\n` : ""}The learner's new message:\n<learner_message>${learnerMessage}</learner_message>`;
  const r = await callJson(settings, system, userText, SCHEMA, Result, { fresh: true });
  return {
    reply: r.reply,
    corrections: r.corrections.slice(0, 2).map((c) => ({
      original: c.original,
      better: c.better,
      type: (TYPES as string[]).includes(c.type) ? (c.type as CorrectionType) : "naturalness",
      noteEn: c.note_en,
    })),
    praise: r.praise?.trim() ? r.praise : null,
  };
}
