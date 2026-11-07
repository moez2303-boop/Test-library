import { z } from "zod";
import { callJson } from "../grader";
import type { JlptLevel, Settings } from "../types";
import type { GlossaryItem, WordInfo } from "./types";

/** A word-list entry that matches a tapped word (e.g. tapped 慣 → 慣れる). */
export function fromWordList(glossary: GlossaryItem[], word: string, reading: string): WordInfo | null {
  const hit =
    glossary.find((g) => g.word === word) ??
    glossary.find(
      (g) => g.word.startsWith(word) && (word.length >= 2 || (reading !== "" && g.reading.startsWith(reading))),
    );
  return hit
    ? { dictionaryForm: hit.word, reading: hit.reading, meaning: hit.meaning, note: "", source: "list" }
    : null;
}

const SYSTEM = `You are a concise Japanese dictionary for learners. A learner reading a manga tapped one word in a line of dialogue. Explain that word as it is used in that line.

- dictionary_form: the whole word the tapped text belongs to, in dictionary form (tapped 慣 in 慣れてます → 慣れる; tapped 試験 in 試験勉強 → 試験).
- reading: the reading of dictionary_form in hiragana.
- meaning: a short English gloss that fits this context (a few words).
- note: one short English sentence on how it is used in this line (conjugation, nuance, or a set phrase it is part of). Empty if there is nothing useful to add.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["dictionary_form", "reading", "meaning", "note"],
  properties: {
    dictionary_form: { type: "string" },
    reading: { type: "string" },
    meaning: { type: "string" },
    note: { type: "string" },
  },
};

const Result = z.object({
  dictionary_form: z.string(),
  reading: z.string(),
  meaning: z.string(),
  note: z.string(),
});

export async function lookupWithClaude(
  settings: Settings,
  level: JlptLevel,
  word: string,
  reading: string,
  line: string,
): Promise<WordInfo> {
  const userText = `Learner level: JLPT ${level}
Tapped word: ${word}${reading ? ` (read ${reading})` : ""}
Line: ${line}`;
  const r = await callJson(settings, SYSTEM, userText, SCHEMA, Result, { quick: true });
  return {
    dictionaryForm: r.dictionary_form || word,
    reading: r.reading || reading,
    meaning: r.meaning,
    note: r.note,
    source: "claude",
  };
}
