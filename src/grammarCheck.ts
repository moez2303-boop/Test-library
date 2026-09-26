export interface GrammarMatch {
  offset: number;
  length: number;
  message: string;
  shortMessage: string;
  replacements: string[];
  ruleId: string;
  categoryId: string;
  categoryName: string;
}

interface LanguageToolResponse {
  matches: Array<{
    message: string;
    shortMessage: string;
    replacements: Array<{ value: string }>;
    offset: number;
    length: number;
    rule: {
      id: string;
      category: { id: string; name: string };
    };
  }>;
}

export type GrammarCategory = "spelling" | "grammar" | "other";

const GRAMMAR_CATEGORY_IDS = new Set([
  "GRAMMAR",
  "CONFUSED_WORDS",
  "COMPOUNDING",
  "SEMANTICS",
  "COLLOCATIONS",
  "REDUNDANCY",
]);

export function categoryBucket(categoryId: string): GrammarCategory {
  if (categoryId === "TYPOS") return "spelling";
  if (GRAMMAR_CATEGORY_IDS.has(categoryId)) return "grammar";
  return "other";
}

export async function checkGrammar(text: string, language = "fr"): Promise<GrammarMatch[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response;
  try {
    response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text, language }),
      signal: controller.signal,
    });
  } catch {
    throw new Error("Couldn't reach the grammar checker. Check your connection and try again.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "Too many requests to the grammar checker — please wait a moment and try again."
        : "The grammar checker is unavailable right now.",
    );
  }

  const data: LanguageToolResponse = await response.json();
  return data.matches.map((m) => ({
    offset: m.offset,
    length: m.length,
    message: m.message,
    shortMessage: m.shortMessage,
    replacements: m.replacements.slice(0, 3).map((r) => r.value),
    ruleId: m.rule.id,
    categoryId: m.rule.category.id,
    categoryName: m.rule.category.name,
  }));
}
