import { useMemo, useState } from "react";
import type { Grade, Word } from "../types";

interface QuizProps {
  words: Word[];
  title: string;
  onGrade: (wordId: string, grade: Grade) => void;
  onExit: () => void;
}

interface Question {
  word: Word;
  options: Word[];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(words: Word[]): Question[] {
  return shuffle(words).map((word) => {
    const distractors = shuffle(words.filter((w) => w.id !== word.id)).slice(0, 3);
    return { word, options: shuffle([word, ...distractors]) };
  });
}

export function Quiz({ words, title, onGrade, onExit }: QuizProps) {
  const questions = useMemo(() => buildQuestions(words), [words]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length < 2) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-serif text-xl text-navy-dark">Not enough words for a quiz yet.</p>
        <button onClick={onExit} className="mt-4 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream">
          Back
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-5xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</p>
        <p className="mt-4 font-serif text-2xl font-semibold text-navy-dark">
          {score} / {questions.length} correct
        </p>
        <p className="mt-1 text-sm text-ink/60">{title}</p>
        <button
          onClick={onExit}
          className="mt-6 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-cream hover:bg-navy-dark"
        >
          Back to lessons
        </button>
      </div>
    );
  }

  const question = questions[index];

  function choose(optionId: string) {
    if (selected) return;
    setSelected(optionId);
    const correct = optionId === question.word.id;
    onGrade(question.word.id, correct ? "good" : ("again" as Grade));
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    if (index === questions.length - 1) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-medium text-navy/70 hover:text-navy">
          ← Exit
        </button>
        <span className="text-sm font-medium text-ink/50">
          {title} · {index + 1} / {questions.length}
        </span>
      </div>

      <div className="animate-fade-in rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-wide text-ink/40">What does this mean?</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-navy-dark">{question.word.french}</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((option) => {
          const isCorrect = option.id === question.word.id;
          const isSelected = option.id === selected;
          const showState = selected !== null;
          return (
            <button
              key={option.id}
              onClick={() => choose(option.id)}
              disabled={showState}
              className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                showState && isCorrect
                  ? "border-navy bg-navy/10 text-navy-dark"
                  : showState && isSelected
                    ? "border-red bg-red/10 text-red-dark"
                    : "border-navy/15 text-ink/80 hover:bg-navy/5"
              }`}
            >
              {option.english}
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={next}
          className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
        >
          {index === questions.length - 1 ? "See results" : "Next"}
        </button>
      )}
    </div>
  );
}
