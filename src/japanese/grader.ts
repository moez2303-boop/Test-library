import { z } from "zod";
import type { Clip, Feedback, Question, Settings } from "./types";
import { GraderError } from "./errors";
import { callViaClaudeAccount } from "./claudeAccount";


export const MODELS = [
  { id: "claude-opus-5-5", label: "Claude Opus 5.5 — most detailed feedback" },
  { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5 — faster" },
  { id: "claude-haiku-5-5", label: "Claude Haiku 5.5 — cheapest" },
] as const;

export const DEFAULT_MODEL = MODELS[0].id;

/** Weights used to turn the four 0–10 scores into one 0–100 score. */
export const WEIGHTS = { relevance: 0.35, grammar: 0.3, vocabulary: 0.2, naturalness: 0.15 };

export { GraderError };

// ---------------------------------------------------------------------------
// Shared call helper: one request, JSON-schema-constrained output, validated.
// ---------------------------------------------------------------------------

async function callJson<T>(
  settings: Settings,
  system: string,
  userText: string,
  schema: Record<string, unknown>,
  validator: z.ZodType<T>,
): Promise<T> {
  // The claude.ai build uses the viewer's Claude account; the web build uses an API key.
  // The API module (and the SDK) is loaded only when needed, and left out of the claude.ai build.
  const data = __ARTIFACT__
    ? await callViaClaudeAccount(system, userText, schema)
    : await (await import("./api")).callViaApi(settings, system, userText, schema);
  const parsed = validator.safeParse(data);
  if (!parsed.success) throw new GraderError("Got an unexpected response shape. Please try again.");
  return parsed.data;
}

function clipContext(clip: Clip): string {
  const lines = [
    `<clip>`,
    `Title: ${clip.title}`,
    clip.anime ? `Anime: ${clip.anime}` : "",
    `Learner level: JLPT ${clip.level}`,
    clip.transcript.trim()
      ? `<transcript>\n${clip.transcript.trim()}\n</transcript>`
      : "<transcript>(not available)</transcript>",
    clip.translation.trim() ? `<translation>\n${clip.translation.trim()}\n</translation>` : "",
    clip.caption?.trim() ? `<video_caption>\n${clip.caption.trim()}\n</video_caption>` : "",
    `</clip>`,
  ];
  return lines.filter(Boolean).join("\n");
}

// ---------------------------------------------------------------------------
// Grading a free-text answer
// ---------------------------------------------------------------------------

const GRADE_SYSTEM = `You are an experienced, encouraging Japanese teacher. A learner watched a short anime clip (about 30 seconds) and typed a free-text answer to a question about it. You can't see the video: the clip's transcript (and translation, when given) is your source of truth for what happens in it. Many clips come from TikTok, and the uploader's caption may be included as extra context; it can be helpful, but it is not always accurate or about the dialogue.

When no transcript is available, you can't check facts about the scene. Then judge relevance by whether the answer genuinely responds to the question and is consistent with the caption, if any; don't penalize details you have no way to verify, and say in the summary that the scene itself couldn't be checked.

Score the answer on four dimensions, each an integer from 0 to 10:
- grammar: particles, conjugation, tense, word order, sentence structure. 10 means no errors. Errors that change or obscure the meaning cost more than small slips.
- vocabulary: are the words correct and well chosen for the intended meaning? Credit range that fits the learner's level, but never penalize simple words that are correct.
- relevance: does the answer actually address the question, and is it consistent with what happens in the clip? A grammatically perfect answer that is wrong about the clip or off-topic scores low here. For open or personal questions, judge whether it responds to what was asked.
- naturalness: would a native speaker phrase it this way, and is the register (polite or casual) suitable for the question?

Calibrate to the learner's JLPT level: a short, correct, simple answer from an N5 learner can earn 9 or 10. When a reference answer is given, treat it as one acceptable answer, not the only one.

If the answer is written in English or romaji rather than Japanese, still judge relevance, but give grammar, vocabulary and naturalness at most 3 and show how to write it in Japanese. Treat kana/kanji mistakes (wrong character, missing small っ, long-vowel errors) as "spelling" issues. An empty or nonsensical answer scores low on everything.

Write all explanations in English, quoting Japanese where it helps. Be specific and kind: say what is right before what is wrong.
- summary: two or three sentences of overall feedback.
- strengths: up to three short points on what the learner did well (may be empty).
- issues: one entry per concrete problem, with the exact excerpt from the learner's answer, why it's a problem, and the fix. Empty if there are no problems.
- corrected_answer: the learner's answer with the smallest edits needed to make it correct and natural, keeping their wording and meaning. Identical to their answer if nothing needs fixing.
- corrected_reading: the corrected answer written fully in hiragana.
- model_answer: a natural answer a native speaker might give, using grammar suited to the learner's level.
- model_answer_en: its English translation.`;

const GRADE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "scores",
    "summary",
    "strengths",
    "issues",
    "corrected_answer",
    "corrected_reading",
    "model_answer",
    "model_answer_en",
  ],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: ["grammar", "vocabulary", "relevance", "naturalness"],
      properties: {
        grammar: { type: "integer", description: "0-10" },
        vocabulary: { type: "integer", description: "0-10" },
        relevance: { type: "integer", description: "0-10" },
        naturalness: { type: "integer", description: "0-10" },
      },
    },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "excerpt", "explanation", "suggestion"],
        properties: {
          category: {
            type: "string",
            enum: ["grammar", "vocabulary", "spelling", "relevance", "naturalness"],
          },
          excerpt: { type: "string" },
          explanation: { type: "string" },
          suggestion: { type: "string" },
        },
      },
    },
    corrected_answer: { type: "string" },
    corrected_reading: { type: "string" },
    model_answer: { type: "string" },
    model_answer_en: { type: "string" },
  },
};

const score = z.number().transform((n) => Math.max(0, Math.min(10, Math.round(n))));

const GradeResult = z.object({
  scores: z.object({ grammar: score, vocabulary: score, relevance: score, naturalness: score }),
  summary: z.string(),
  strengths: z.array(z.string()),
  issues: z.array(
    z.object({
      category: z.enum(["grammar", "vocabulary", "spelling", "relevance", "naturalness"]),
      excerpt: z.string(),
      explanation: z.string(),
      suggestion: z.string(),
    }),
  ),
  corrected_answer: z.string(),
  corrected_reading: z.string(),
  model_answer: z.string(),
  model_answer_en: z.string(),
});

export function overallScore(s: Feedback["scores"]): number {
  const weighted =
    s.relevance * WEIGHTS.relevance +
    s.grammar * WEIGHTS.grammar +
    s.vocabulary * WEIGHTS.vocabulary +
    s.naturalness * WEIGHTS.naturalness;
  return Math.round(weighted * 10);
}

export async function gradeAnswer(
  settings: Settings,
  clip: Clip,
  question: Question,
  answer: string,
): Promise<Feedback> {
  const userText = [
    clipContext(clip),
    `<question>${question.prompt}</question>`,
    question.promptEn ? `<question_english>${question.promptEn}</question_english>` : "",
    question.referenceAnswer
      ? `<reference_answer>${question.referenceAnswer}</reference_answer>`
      : "<reference_answer>(open question — no single correct answer)</reference_answer>",
    `<learner_answer>${answer}</learner_answer>`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const r = await callJson(settings, GRADE_SYSTEM, userText, GRADE_SCHEMA, GradeResult);
  return {
    scores: r.scores,
    overall: overallScore(r.scores),
    summary: r.summary,
    strengths: r.strengths,
    issues: r.issues,
    correctedAnswer: r.corrected_answer,
    correctedReading: r.corrected_reading,
    modelAnswer: r.model_answer,
    modelAnswerEn: r.model_answer_en,
  };
}

// ---------------------------------------------------------------------------
// Generating questions from a transcript
// ---------------------------------------------------------------------------

const GENERATE_SYSTEM = `You write listening-comprehension questions for Japanese learners who have just watched a short anime clip (about 30 seconds). You get the clip's transcript when available, sometimes the uploader's caption (often from TikTok), and the learner's JLPT level.

Write the requested number of questions in Japanese, using grammar and vocabulary suited to that level, so the learner answers in a full Japanese sentence. Mix the kinds:
- factual questions whose answer is stated in the dialogue (who, what, why, how long…);
- inference questions about feelings, intentions or relationships the dialogue implies;
- at most one open, personal question connected to the scene ("What would you do…?"), with an empty reference answer.

Each question must be answerable from the transcript. If there is no transcript, use only what the caption states, and favour questions about what the learner saw and heard (what happens, how characters feel, a phrase they caught) over facts you can't confirm. Give an English translation of each question, and a short natural reference answer in Japanese (empty string for the open question, and for any question whose answer the transcript or caption doesn't state).`;

const GENERATE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["prompt", "prompt_en", "reference_answer"],
        properties: {
          prompt: { type: "string" },
          prompt_en: { type: "string" },
          reference_answer: { type: "string" },
        },
      },
    },
  },
};

const GenerateResult = z.object({
  questions: z.array(
    z.object({ prompt: z.string(), prompt_en: z.string(), reference_answer: z.string() }),
  ),
});

export async function generateQuestions(
  settings: Settings,
  clip: Clip,
  count: number,
): Promise<Omit<Question, "id">[]> {
  if (!clip.transcript.trim() && !clip.caption?.trim())
    throw new GraderError("Add the clip's script first.");
  const userText = `${clipContext(clip)}\n\nWrite ${count} questions.`;
  const r = await callJson(settings, GENERATE_SYSTEM, userText, GENERATE_SCHEMA, GenerateResult);
  return r.questions.map((q) => ({
    prompt: q.prompt,
    promptEn: q.prompt_en || undefined,
    referenceAnswer: q.reference_answer || undefined,
  }));
}
