import { lessons } from "../data/lessons";
import type { WordProgress } from "../types";
import { isMastered } from "../srs";
import { LessonCard } from "./LessonCard";

interface HomeProps {
  progress: Record<string, WordProgress>;
  dueCount: number;
  totalMastered: number;
  totalWords: number;
  onPractice: (lessonId: string) => void;
  onQuiz: (lessonId: string) => void;
  onReview: () => void;
}

export function Home({
  progress,
  dueCount,
  totalMastered,
  totalWords,
  onPractice,
  onQuiz,
  onReview,
}: HomeProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="animate-fade-in mb-8 flex flex-col gap-4 rounded-2xl bg-navy px-6 py-6 text-cream sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Apprends le français</h1>
          <p className="mt-1 text-sm text-cream/70">
            {totalMastered} of {totalWords} words mastered
          </p>
        </div>
        <button
          onClick={onReview}
          disabled={dueCount === 0}
          className="rounded-lg bg-red px-5 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:bg-cream/20 disabled:text-cream/60"
        >
          {dueCount > 0 ? `Review ${dueCount} due word${dueCount === 1 ? "" : "s"}` : "All caught up 🎉"}
        </button>
      </div>

      <h2 className="mb-4 font-serif text-lg font-semibold text-navy-dark">Lessons</h2>
      <div className="grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const masteredCount = lesson.words.filter((word) => isMastered(progress[word.id])).length;
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              masteredCount={masteredCount}
              onPractice={() => onPractice(lesson.id)}
              onQuiz={() => onQuiz(lesson.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
