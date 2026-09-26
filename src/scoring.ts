const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux", "et", "ou", "est", "sont",
  "a", "à", "avec", "pour", "sur", "dans", "que", "qui", "se", "sa", "son", "ses", "ce",
  "cette", "ces", "il", "elle", "ils", "elles", "je", "tu", "nous", "vous", "on", "pas",
  "ne", "plus", "très", "bien", "mais", "donc", "car", "être", "avoir", "comme", "ça",
  "cela", "leur", "leurs", "été", "était", "avait", "aussi", "tout", "toute", "après",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function keywordsOf(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOPWORDS.has(word));
}

export interface CoveragePoint {
  point: string;
  matched: boolean;
}

export interface CoverageResult {
  percentage: number;
  covered: CoveragePoint[];
}

/**
 * Rough keyword-overlap heuristic: not a grammar or pronunciation grade,
 * just how many of the key ideas' distinctive words show up in the answer.
 */
export function estimateCoverage(answer: string, keyPoints: string[]): CoverageResult {
  const answerWords = new Set(keywordsOf(answer));

  const covered = keyPoints.map((point) => {
    const pointWords = keywordsOf(point);
    if (pointWords.length === 0) return { point, matched: false };
    const hits = pointWords.filter((w) => answerWords.has(w)).length;
    return { point, matched: hits / pointWords.length >= 0.4 };
  });

  const matchedCount = covered.filter((c) => c.matched).length;
  const percentage = keyPoints.length === 0 ? 0 : Math.round((matchedCount / keyPoints.length) * 100);

  return { percentage, covered };
}
