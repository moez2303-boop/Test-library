import type { Feedback, IssueCategory } from "../types";
import { scoreColor, speakJapanese } from "../util";

const DIMENSIONS: { key: keyof Feedback["scores"]; label: string; jp: string }[] = [
  { key: "relevance", label: "Relevance", jp: "内容" },
  { key: "grammar", label: "Grammar", jp: "文法" },
  { key: "vocabulary", label: "Vocabulary", jp: "語彙" },
  { key: "naturalness", label: "Naturalness", jp: "自然さ" },
];

const CATEGORY_STYLE: Record<IssueCategory, string> = {
  grammar: "bg-ai/10 text-ai",
  vocabulary: "bg-matcha/15 text-matcha",
  spelling: "bg-kin/15 text-kin",
  relevance: "bg-shu/10 text-shu",
  naturalness: "bg-sumi/10 text-sumi",
};

function barColor(score10: number) {
  if (score10 >= 8) return "bg-matcha";
  if (score10 >= 5.5) return "bg-kin";
  return "bg-shu";
}

export function FeedbackPanel({ feedback, answer }: { feedback: Feedback; answer: string }) {
  const unchanged = feedback.correctedAnswer.trim() === answer.trim();
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
      <div className="flex items-center gap-5">
        <div className="text-center">
          <div className={`font-display text-5xl font-bold ${scoreColor(feedback.overall)}`}>
            {feedback.overall}
          </div>
          <div className="text-xs text-sumi-soft">/ 100</div>
        </div>
        <div className="grid flex-1 gap-2">
          {DIMENSIONS.map((d) => {
            const v = feedback.scores[d.key];
            return (
              <div key={d.key} className="flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0 whitespace-nowrap">
                  {d.label} <span className="jp text-xs text-sumi-soft">{d.jp}</span>
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-washi-dark">
                  <div className={`h-full rounded-full ${barColor(v)}`} style={{ width: `${v * 10}%` }} />
                </div>
                <span className="w-9 text-right font-semibold tabular-nums">{v}/10</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed">{feedback.summary}</p>

      {feedback.strengths.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {feedback.strengths.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-matcha">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-xl bg-washi p-4">
        <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">
          {unchanged ? "Your answer — no corrections needed" : "Corrected answer"}
        </div>
        <p className="jp mt-1 text-lg">{feedback.correctedAnswer}</p>
        {feedback.correctedReading && (
          <p className="jp mt-0.5 text-sm text-sumi-soft">{feedback.correctedReading}</p>
        )}
      </div>

      {feedback.issues.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">What to fix</h3>
          <ul className="mt-2 space-y-3">
            {feedback.issues.map((issue, i) => (
              <li key={i} className="text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLE[issue.category]}`}>
                    {issue.category}
                  </span>
                  {issue.excerpt && (
                    <span className="jp rounded bg-shu/10 px-1.5 text-shu line-through decoration-shu/50">
                      {issue.excerpt}
                    </span>
                  )}
                  {issue.suggestion && (
                    <>
                      <span className="text-sumi-soft">→</span>
                      <span className="jp rounded bg-matcha/10 px-1.5 text-matcha">{issue.suggestion}</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-sumi-soft">{issue.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-washi-dark pt-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">A natural answer</h3>
          <button
            onClick={() => speakJapanese(feedback.modelAnswer)}
            className="rounded-full border border-sumi/15 px-2 py-0.5 text-xs hover:bg-washi"
            title="Listen"
          >
            🔊 Listen
          </button>
        </div>
        <p className="jp mt-1 text-lg">{feedback.modelAnswer}</p>
        <p className="text-sm text-sumi-soft">{feedback.modelAnswerEn}</p>
      </div>
    </section>
  );
}
