import { useState } from "react";
import { lessons } from "../data/lessons";
import type { Level, WordProgress } from "../types";
import { isMastered } from "../srs";
import { LessonCard } from "./LessonCard";

const LEVELS: (Level | "All")[] = ["All", "A1", "A2", "B1", "B2"];

interface HomeProps {
  progress: Record<string, WordProgress>;
  dueCount: number;
  totalMastered: number;
  totalWords: number;
  onPractice: (lessonId: string) => void;
  onQuiz: (lessonId: string) => void;
  onReview: () => void;
  onListening: () => void;
}

export function Home({
  progress,
  dueCount,
  totalMastered,
  totalWords,
  onPractice,
  onQuiz,
  onReview,
  onListening,
}: HomeProps) {
  const [levelFilter, setLevelFilter] = useState<Level | "All">("All");
  const visibleLessons = levelFilter === "All" ? lessons : lessons.filter((l) => l.level === levelFilter);

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

      <button
        onClick={onListening}
        className="animate-fade-in mb-8 flex w-full flex-col gap-3 rounded-2xl border border-navy/10 bg-white/70 p-5 text-left shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎧</span>
          <div>
            <h2 className="font-serif text-lg font-semibold text-navy-dark">Oral Comprehension</h2>
            <p className="text-sm text-ink/60">
              Watch short real French clips (≤ 60s) and answer questions about them.
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream">Start listening</span>
      </button>

      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-serif text-lg font-semibold text-navy-dark">Lessons</h2>
        <div className="flex gap-1.5">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                levelFilter === level ? "bg-navy text-cream" : "bg-navy/10 text-navy hover:bg-navy/20"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <div className="grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleLessons.map((lesson) => {
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
