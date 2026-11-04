import { z } from "zod";
import { callJson, GRADE_SCHEMA, GradeResult, toFeedback } from "../grader";
import type { CallOptions } from "../claudeAccount";
import type { Feedback, JlptLevel, Settings } from "../types";
import {
  CHOICE_TYPES,
  WRITING_TYPES,
  type Exercise,
  type ExerciseType,
  type MangaLesson,
  type StyleKey,
} from "./types";

export const STYLES: { key: StyleKey; jp: string; en: string; brief: string }[] = [
  {
    key: "overpowered",
    jp: "最強ヒーロー",
    en: "The hero who's too strong",
    brief:
      "an action comedy about a hero so strong that every fight ends in a single hit, who is far more worried about everyday things like supermarket sales, rent and being taken seriously",
  },
  {
    key: "hitman",
    jp: "元殺し屋",
    en: "The retired hitman",
    brief:
      "an action comedy about a legendary hitman who retired to run a small neighborhood shop with his family, but keeps getting dragged into fights with former rivals while trying to keep his promise not to kill",
  },
  {
    key: "teacher",
    jp: "型破り教師",
    en: "The rule-breaking teacher",
    brief:
      "a school comedy-drama about a former delinquent who became a high-school teacher and solves students' problems in outrageous, unorthodox ways that turn out to be kind",
  },
  {
    key: "spy",
    jp: "秘密の家族",
    en: "The family of secrets",
    brief:
      "a comedy about a pretend family where every member hides a secret identity from the others (for example a spy, an assassin and a child who can read minds) while trying to look like an ordinary family",
  },
  {
    key: "random",
    jp: "おまかせ",
    en: "Surprise me",
    brief: "any genre that fits a lively shōnen or seinen manga: action, comedy, school life or mystery",
  },
];

// ---------------------------------------------------------------------------
// Picking a random mix of exercises
// ---------------------------------------------------------------------------

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * A random set of 6 exercise types: 4 instantly-checked ones and 2 writing
 * ones. "What happens next?" shows up often, and always comes last.
 */
export function pickExerciseTypes(): ExerciseType[] {
  const choice = shuffle(CHOICE_TYPES).slice(0, 4);
  const writing = shuffle(WRITING_TYPES).slice(0, 2);
  const ordered = shuffle([...choice, ...writing.filter((t) => t !== "continue_story")]);
  return writing.includes("continue_story") ? [...ordered, "continue_story"] : ordered;
}

const TYPE_GUIDE = `Exercise kinds (write prompts in Japanese at the learner's level, with an English translation in prompt_en):
- open_question: a question about the story (why/how/what someone feels or intends) to answer in a full Japanese sentence. No options. reference_answer: a natural model answer.
- continue_story: ask the learner to write 2-4 sentences in Japanese about what might happen next. No options. reference_answer: one possible continuation.
- say_it_in_japanese: give an English sentence closely based on a line or event in the story and ask the learner to say it in Japanese. No options. reference_answer: the line from the story or a natural equivalent.
- vocabulary: ask the meaning of a word used in the story; 4 options in English or simple Japanese, one correct.
- grammar: a sentence using a grammar point from the story (at the learner's level) with the grammar part blanked as ＿＿; 4 options, one correct. The explanation names the grammar point and its meaning.
- kanji_reading: ask the reading of a kanji word from the story; 4 hiragana options, one correct.
- who_said_it: quote a line from the story; options are character names, one correct.
- true_false: a statement in Japanese about the story; options exactly ["○ 正しい", "× まちがい"].
- fill_blank: a line from the story with one word blanked as ＿＿; 4 options, one correct.
For choice kinds, answer_index is the 0-based index of the correct option, the wrong options are plausible, and explanation (in English) says why the answer is right. For writing kinds, options is [] and answer_index is -1.`;

const EXERCISE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["type", "prompt", "prompt_en", "options", "answer_index", "explanation", "reference_answer"],
  properties: {
    type: { type: "string", enum: [...WRITING_TYPES, ...CHOICE_TYPES] },
    prompt: { type: "string" },
    prompt_en: { type: "string" },
    options: { type: "array", items: { type: "string" } },
    answer_index: { type: "integer" },
    explanation: { type: "string" },
    reference_answer: { type: "string" },
  },
};

const LINE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["speaker", "text", "en"],
  properties: { speaker: { type: "string" }, text: { type: "string" }, en: { type: "string" } },
};

const LESSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "title_en", "summary_en", "pages", "glossary", "exercises"],
  properties: {
    title: { type: "string" },
    title_en: { type: "string" },
    summary_en: { type: "string" },
    pages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["panels"],
        properties: {
          panels: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["scene", "scene_en", "lines"],
              properties: {
                scene: { type: "string" },
                scene_en: { type: "string" },
                lines: { type: "array", items: LINE_SCHEMA },
              },
            },
          },
        },
      },
    },
    glossary: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["word", "reading", "meaning"],
        properties: { word: { type: "string" }, reading: { type: "string" }, meaning: { type: "string" } },
      },
    },
    exercises: { type: "array", items: EXERCISE_SCHEMA },
  },
};

const LessonResult = z.object({
  title: z.string(),
  title_en: z.string(),
  summary_en: z.string(),
  pages: z.array(
    z.object({
      panels: z.array(
        z.object({
          scene: z.string(),
          scene_en: z.string(),
          lines: z.array(z.object({ speaker: z.string(), text: z.string(), en: z.string() })),
        }),
      ),
    }),
  ),
  glossary: z.array(z.object({ word: z.string(), reading: z.string(), meaning: z.string() })),
  exercises: z.array(
    z.object({
      // Checked per exercise in toLesson, so one odd exercise doesn't sink the lesson.
      type: z.string(),
      prompt: z.string(),
      prompt_en: z.string(),
      options: z.array(z.string()),
      answer_index: z.number(),
      explanation: z.string(),
      reference_answer: z.string(),
    }),
  ),
});

type LessonData = Omit<MangaLesson, "id" | "level" | "source" | "style" | "pageCount" | "results" | "createdAt">;

function toLesson(r: z.infer<typeof LessonResult>): LessonData {
  const exercises: Exercise[] = [];
  const known = new Set<string>([...WRITING_TYPES, ...CHOICE_TYPES]);
  for (const e of r.exercises) {
    if (!known.has(e.type)) continue;
    const type = e.type as ExerciseType;
    const isWriting = WRITING_TYPES.includes(type);
    const answerIndex = Math.round(e.answer_index);
    // Drop malformed choice exercises rather than show a broken one.
    if (!isWriting && (e.options.length < 2 || answerIndex < 0 || answerIndex >= e.options.length)) continue;
    exercises.push({
      type,
      prompt: e.prompt,
      promptEn: e.prompt_en,
      options: isWriting ? [] : e.options,
      answerIndex: isWriting ? -1 : answerIndex,
      explanation: e.explanation,
      referenceAnswer: e.reference_answer,
    });
  }
  return {
    title: r.title,
    titleEn: r.title_en,
    summaryEn: r.summary_en,
    pages: r.pages.map((p) => ({
      panels: p.panels.map((panel) => ({ scene: panel.scene, sceneEn: panel.scene_en, lines: panel.lines })),
    })),
    glossary: r.glossary,
    exercises,
  };
}

const FURIGANA_RULE = `Mark the reading of every kanji word that a learner at this level might not know as {漢字|かんじ} (for example {抹殺|まっさつ}); leave easy kanji unmarked. Use the same markup in exercise prompts and options when helpful, but never in kanji_reading prompts for the word being asked about.`;

// ---------------------------------------------------------------------------
// 1. An original story written by Claude
// ---------------------------------------------------------------------------

const STORY_SYSTEM = `You write short original manga chapters, as scripts, for Japanese learners, and the exercises that go with them.

Write a complete mini-chapter of the requested number of pages. Each page has 3-5 panels; each panel has a short stage direction in Japanese (scene) with its English (scene_en) and 1-4 lines of dialogue or narration (speaker "ナレーション" for narration, sound effects as speaker "SFX"). Make it read like a real manga: punchy dialogue, clear characters, a hook at the start, a funny or dramatic turn, and an ending that leaves the reader wanting the next chapter. Characters speak naturally for who they are (casual speech, a polite teacher, a rough delinquent), and the story has a natural use of grammar and vocabulary at the learner's JLPT level, slightly stretching it.

Invent original characters, names and plots. Never use characters, names, places or plot lines from existing manga, anime or other works.

${FURIGANA_RULE}

Also give a glossary of 8-12 useful words from the chapter (word, reading in hiragana, English meaning), a title in Japanese and English, and a one-sentence English summary.

${TYPE_GUIDE}`;

export async function generateStoryLesson(
  settings: Settings,
  level: JlptLevel,
  style: StyleKey,
  pageCount: number,
  types: ExerciseType[],
  opts: CallOptions = {},
): Promise<LessonData> {
  const brief = (STYLES.find((s) => s.key === style) ?? STYLES[STYLES.length - 1]).brief;
  const userText = `Learner level: JLPT ${level}
Pages: ${pageCount}
Story: ${brief}
Exercises, in this order: ${types.join(", ")}
(Random seed for variety: ${Math.random().toString(36).slice(2, 8)})`;
  const r = await callJson(settings, STORY_SYSTEM, userText, LESSON_SCHEMA, LessonResult, {
    ...opts,
    fresh: true,
  });
  return toLesson(r);
}

// ---------------------------------------------------------------------------
// 2. The learner's own manga pages (images)
// ---------------------------------------------------------------------------

const PAGES_SYSTEM = `You help a Japanese learner study manga pages they are reading. You get photos or screenshots of consecutive manga pages, in order.

First transcribe the pages. Japanese manga is read right to left: panels from the top-right, and within a panel the speech bubbles from right to left and top to bottom. For each page, list its panels in reading order; for each panel write a short Japanese stage direction of what is shown (scene) with English (scene_en), and every speech bubble, caption and sound effect as a line, in reading order, copying the Japanese exactly as printed (speaker: the character's name if it is clear from the pages, otherwise a short description such as "少年" or "?"; narration as "ナレーション", sound effects as "SFX"; en: an English translation). Skip text you truly cannot read rather than guessing. If an image is not a manga page, return no panels for it.

${FURIGANA_RULE} Add these readings even where the page itself prints none.

Then give a glossary of 8-12 useful words from the pages, a short Japanese title for the excerpt with English, and a one-sentence English summary. Then write the exercises, based only on what is in these pages.

${TYPE_GUIDE}`;

export async function lessonFromPages(
  settings: Settings,
  level: JlptLevel,
  images: Blob[],
  types: ExerciseType[],
  opts: CallOptions & { textLayer?: string } = {},
): Promise<LessonData> {
  const userText = `Learner level: JLPT ${level}
The ${images.length} attached images are pages 1-${images.length}, in order.
Exercises, in this order: ${types.join(", ")}${
    opts.textLayer
      ? `\n\nThe PDF these pages come from also has this text layer; use it to read small or unclear text, but follow the images for order and content:\n<pdf_text>\n${opts.textLayer.slice(0, 6000)}\n</pdf_text>`
      : ""
  }`;
  const r = await callJson(settings, PAGES_SYSTEM, userText, LESSON_SCHEMA, LessonResult, {
    ...opts,
    images,
  });
  return toLesson(r);
}

// ---------------------------------------------------------------------------
// 3. Manga text the learner supplies (a .txt file)
// ---------------------------------------------------------------------------

const TEXT_SYSTEM = `You help a Japanese learner study a manga excerpt they supplied as text: usually the dialogue of a chapter, possibly with character names, page or panel markers, translator notes or stray formatting.

First lay the excerpt out as manga pages so it reads like the original: 3-4 pages (fewer if the excerpt is short), each with 3-5 panels in story order. Keep every line of Japanese dialogue and narration exactly as written, in order; don't add dialogue that isn't there, and drop only non-story noise (page numbers, credits, notes). Use the speaker names given in the text; where none is given, use a short description such as "少年" or "?". Narration is speaker "ナレーション", sound effects "SFX". For each panel add a short Japanese stage direction inferred from the dialogue (scene) with English (scene_en), and give every line an English translation (en).

${FURIGANA_RULE}

Then give a glossary of 8-12 useful words, a short Japanese title for the excerpt with English, and a one-sentence English summary. Then write the exercises, based only on this excerpt.

${TYPE_GUIDE}`;

export async function lessonFromText(
  settings: Settings,
  level: JlptLevel,
  text: string,
  types: ExerciseType[],
  opts: CallOptions = {},
): Promise<LessonData> {
  const userText = `Learner level: JLPT ${level}
Exercises, in this order: ${types.join(", ")}

<manga_text>
${text}
</manga_text>`;
  const r = await callJson(settings, TEXT_SYSTEM, userText, LESSON_SCHEMA, LessonResult, opts);
  return toLesson(r);
}

// ---------------------------------------------------------------------------
// Grading writing exercises
// ---------------------------------------------------------------------------

const WRITING_SYSTEM = `You are an experienced, encouraging Japanese teacher. A learner read a few manga pages (given below as a script) and wrote a free-text answer in Japanese to an exercise about them.

Score the answer on four dimensions, each an integer from 0 to 10:
- grammar: particles, conjugation, tense, word order, sentence structure. 10 means no errors; errors that change the meaning cost more than small slips.
- vocabulary: correct, well-chosen words; credit range that fits the learner's level, never penalize simple correct words.
- relevance: depends on the exercise kind.
  - open_question: does it answer the question, consistently with the story?
  - continue_story: is it a plausible, coherent continuation that fits the characters and what just happened? Reward creativity; there is no single right answer.
  - say_it_in_japanese: does it convey the same meaning as the English sentence?
- naturalness: would a native speaker say it this way, in a register that suits the speaker and situation?

Calibrate to the learner's JLPT level. If the answer is in English or romaji, still judge relevance but give grammar, vocabulary and naturalness at most 3 and show the Japanese. Treat kana/kanji mistakes as "spelling" issues.

Write explanations in English, quoting Japanese where it helps; be specific and kind, saying what is right before what is wrong.
- summary: two or three sentences.
- strengths: up to three points (may be empty).
- issues: one per concrete problem: exact excerpt, why, and the fix. Empty if none.
- corrected_answer: the learner's answer with the smallest edits to make it correct and natural; identical if nothing needs fixing.
- corrected_reading: the corrected answer fully in hiragana.
- model_answer: a natural answer at the learner's level.
- model_answer_en: its English translation.`;

/** Plain-text script of a lesson, readings stripped, for grading context. */
export function lessonScript(lesson: Pick<MangaLesson, "pages">): string {
  const strip = (t: string) => t.replace(/\{([^|{}]+)\|[^{}]+\}/g, "$1");
  return lesson.pages
    .map(
      (page, i) =>
        `[Page ${i + 1}]\n` +
        page.panels
          .map((p) => [`(${strip(p.scene)})`, ...p.lines.map((l) => `${l.speaker}「${strip(l.text)}」`)].join("\n"))
          .join("\n"),
    )
    .join("\n\n");
}

export async function gradeWriting(
  settings: Settings,
  lesson: MangaLesson,
  exercise: Exercise,
  answer: string,
): Promise<Feedback> {
  const userText = `Learner level: JLPT ${lesson.level}

<manga_script>
${lessonScript(lesson)}
</manga_script>

<exercise kind="${exercise.type}">
${exercise.prompt}
English: ${exercise.promptEn}
</exercise>
${exercise.referenceAnswer ? `<reference_answer>${exercise.referenceAnswer}</reference_answer>` : ""}

<learner_answer>${answer}</learner_answer>`;
  const r = await callJson(settings, WRITING_SYSTEM, userText, GRADE_SCHEMA, GradeResult);
  return toFeedback(r);
}
