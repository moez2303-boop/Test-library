import { useState } from "react";

/** Draws a kanji stroke by stroke (KanjiVG paths, 109×109 grid). */
export function StrokeOrder({ strokes, size = 180 }: { strokes: string[]; size?: number }) {
  const [run, setRun] = useState(0);
  const [step, setStep] = useState<number | null>(null); // null = animate all
  const per = 0.55;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        key={run}
        viewBox="0 0 109 109"
        width={size}
        height={size}
        className="rounded-2xl bg-paper ring-1 ring-line"
        role="img"
        aria-label={`Ordre des traits, ${strokes.length} traits`}
      >
        <line x1="54.5" y1="0" x2="54.5" y2="109" className="stroke-line" strokeDasharray="3 3" strokeWidth="0.6" />
        <line x1="0" y1="54.5" x2="109" y2="54.5" className="stroke-line" strokeDasharray="3 3" strokeWidth="0.6" />
        {strokes.map((d, i) => (
          <path key={`g${i}`} d={d} fill="none" className="stroke-line" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {strokes.map((d, i) => {
          if (step !== null && i > step) return null;
          const anim = step === null || i === step;
          const delay = step === null ? i * per : 0;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              className={`${i === (step ?? -1) ? "stroke-beni" : "stroke-ink"} ${anim ? "stroke-anim" : ""}`}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={anim ? 1 : 0}
              style={anim ? { animationDelay: `${delay}s`, ["--dur" as string]: `${per}s` } : undefined}
            />
          );
        })}
        {strokes.map((d, i) => {
          const m = d.match(/^M\s*([\d.]+)[ ,]([\d.]+)/);
          if (!m) return null;
          return (
            <text key={`n${i}`} x={Number(m[1]) - 4} y={Number(m[2]) - 1} fontSize="6.5" className="fill-ai" fontFamily="sans-serif">
              {i + 1}
            </text>
          );
        })}
      </svg>
      <div className="flex gap-2 text-sm">
        <button
          className="rounded-full bg-card px-3 py-1.5 ring-1 ring-line"
          onClick={() => setStep((s) => (s === null ? 0 : Math.max(0, s - 1)))}
          aria-label="Trait précédent"
        >
          ‹
        </button>
        <button
          className="rounded-full bg-ai px-4 py-1.5 font-medium text-card"
          onClick={() => {
            setStep(null);
            setRun((r) => r + 1);
          }}
        >
          ▶ Rejouer
        </button>
        <button
          className="rounded-full bg-card px-3 py-1.5 ring-1 ring-line"
          onClick={() => setStep((s) => (s === null ? 0 : Math.min(strokes.length - 1, s + 1)))}
          aria-label="Trait suivant"
        >
          ›
        </button>
      </div>
      {step !== null && <p className="text-xs text-ink-soft">Trait {step + 1} / {strokes.length}</p>}
    </div>
  );
}
