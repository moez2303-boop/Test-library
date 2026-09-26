import { useMemo, useState } from "react";
import { categoryBucket, type GrammarCategory, type GrammarMatch } from "../grammarCheck";

interface GrammarFeedbackProps {
  text: string;
  matches: GrammarMatch[];
}

interface Segment {
  text: string;
  match?: GrammarMatch;
}

function buildSegments(text: string, matches: GrammarMatch[]): Segment[] {
  const sorted = [...matches].sort((a, b) => a.offset - b.offset);
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of sorted) {
    if (match.offset < cursor) continue;
    if (match.offset > cursor) segments.push({ text: text.slice(cursor, match.offset) });
    segments.push({ text: text.slice(match.offset, match.offset + match.length), match });
    cursor = match.offset + match.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });

  return segments;
}

const HIGHLIGHT_STYLES: Record<GrammarCategory, string> = {
  spelling: "bg-red/20 decoration-red-dark",
  grammar: "bg-gold/35 decoration-navy-dark",
  other: "bg-navy/10 decoration-navy",
};

const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  spelling: "Spelling",
  grammar: "Grammar",
  other: "Style / punctuation",
};

const BADGE_STYLES: Record<GrammarCategory, string> = {
  spelling: "bg-red/10 text-red-dark",
  grammar: "bg-gold/25 text-navy-dark",
  other: "bg-navy/10 text-navy",
};

export function GrammarFeedback({ text, matches }: GrammarFeedbackProps) {
  const [selected, setSelected] = useState<GrammarMatch | null>(null);
  const segments = useMemo(() => buildSegments(text, matches), [text, matches]);

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-3 text-xs text-ink/50">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red/40" /> Spelling
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold/60" /> Grammar
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-navy/30" /> Style / punctuation
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
        {segments.map((seg, i) =>
          seg.match ? (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(seg.match === selected ? null : seg.match!)}
              className={`rounded px-0.5 underline decoration-2 underline-offset-2 ${
                HIGHLIGHT_STYLES[categoryBucket(seg.match.categoryId)]
              } ${selected === seg.match ? "ring-2 ring-navy" : ""}`}
            >
              {seg.text}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      {selected && (
        <div className="mt-3 rounded-xl border border-navy/10 bg-cream-dark/40 p-4">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
              BADGE_STYLES[categoryBucket(selected.categoryId)]
            }`}
          >
            {CATEGORY_LABELS[categoryBucket(selected.categoryId)]}
          </span>
          <p className="mt-2 text-sm text-ink/80">{selected.message}</p>
          {selected.replacements.length > 0 && (
            <p className="mt-2 text-sm">
              <span className="font-semibold text-navy-dark">Suggestion: </span>
              {selected.replacements.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
