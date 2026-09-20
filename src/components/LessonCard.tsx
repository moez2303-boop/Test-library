import type { Lesson } from "../types";
import { ProgressBar } from "./ProgressBar";

interface LessonCardProps {
  lesson: Lesson;
  masteredCount: number;
  onPractice: () => void;
  onQuiz: () => void;
}

export function LessonCard({ lesson, masteredCount, onPractice, onQuiz }: LessonCardProps) {
  const total = lesson.words.length;
  const complete = masteredCount === total;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white/70 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-3xl">{lesson.emoji}</div>
          <h3 className="mt-1 font-serif text-lg font-semibold text-navy-dark">{lesson.title}</h3>
          <p className="mt-0.5 text-sm text-ink/60">{lesson.description}</p>
        </div>
        {complete && <span className="text-xl" aria-label="Mastered" title="Mastered">⭐</span>}
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-medium text-ink/50">
          <span>{masteredCount} / {total} mastered</span>
        </div>
        <ProgressBar value={total === 0 ? 0 : masteredCount / total} />
      </div>

      <div className="mt-1 flex gap-2">
        <button
          onClick={onPractice}
          className="flex-1 rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-cream transition-colors hover:bg-navy-dark"
        >
          Practice
        </button>
        <button
          onClick={onQuiz}
          className="flex-1 rounded-lg border border-navy/20 px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
        >
          Quiz
        </button>
      </div>
    </div>
  );
}
