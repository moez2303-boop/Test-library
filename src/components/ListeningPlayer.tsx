import { useState } from "react";
import type { ListeningClip } from "../types";

interface ListeningPlayerProps {
  clip: ListeningClip;
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

type Phase = "watch" | "quiz" | "done";

export function ListeningPlayer({ clip, onComplete, onExit }: ListeningPlayerProps) {
  const [phase, setPhase] = useState<Phase>("watch");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const embedSrc = `https://www.youtube-nocookie.com/embed/${clip.youtubeId}?start=${clip.start}&end=${clip.end}&rel=0&modestbranding=1`;
  const question = clip.questions[index];

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (index === clip.questions.length - 1) {
      setPhase("done");
      onComplete(score, clip.questions.length);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-medium text-navy/70 hover:text-navy">
          ← Exit
        </button>
        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">{clip.level}</span>
      </div>

      <h2 className="font-serif text-2xl font-semibold text-navy-dark">{clip.title}</h2>
      <p className="mt-1 text-sm text-ink/60">{clip.topic}</p>

      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-navy/10 bg-black shadow-sm">
        <iframe
          key={clip.id}
          className="h-full w-full"
          src={embedSrc}
          title={clip.title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="mt-2 text-xs text-ink/40">
        Source:{" "}
        <a href={clip.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-ink/60">
          {clip.source}
        </a>
      </p>

      {phase === "watch" && (
        <button
          onClick={() => setPhase("quiz")}
          className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
        >
          I've watched it — answer questions
        </button>
      )}

      {phase === "quiz" && (
        <div className="mt-5 animate-fade-in rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-ink/40">
            Question {index + 1} / {clip.questions.length}
          </p>
          <p className="mt-2 font-serif text-lg font-semibold text-navy-dark">{question.prompt}</p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {question.options.map((option, i) => {
              const showState = selected !== null;
              const isCorrect = i === question.correctIndex;
              const isSelected = i === selected;
              return (
                <button
                  key={option}
                  onClick={() => choose(i)}
                  disabled={showState}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    showState && isCorrect
                      ? "border-navy bg-navy/10 text-navy-dark"
                      : showState && isSelected
                        ? "border-red bg-red/10 text-red-dark"
                        : "border-navy/15 text-ink/80 hover:bg-navy/5"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <button
              onClick={next}
              className="mt-4 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
            >
              {index === clip.questions.length - 1 ? "See results" : "Next"}
            </button>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="mt-5 animate-fade-in rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
          <p className="text-5xl">{score === clip.questions.length ? "🏆" : score >= clip.questions.length / 2 ? "👍" : "💪"}</p>
          <p className="mt-4 font-serif text-2xl font-semibold text-navy-dark">
            {score} / {clip.questions.length} correct
          </p>
          <button
            onClick={onExit}
            className="mt-6 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-cream hover:bg-navy-dark"
          >
            Back to clips
          </button>
        </div>
      )}
    </div>
  );
}
