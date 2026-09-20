import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { lessons, allWords } from "./data/lessons";
import { getAllProgress, getStats, recordActivity, saveProgress } from "./db";
import { applyGrade, freshProgress, isDue } from "./srs";
import type { Grade, Stats, WordProgress } from "./types";

type View =
  | { type: "home" }
  | { type: "practice"; lessonId: string }
  | { type: "quiz"; lessonId: string }
  | { type: "review" };

export default function App() {
  const [progress, setProgress] = useState<Record<string, WordProgress>>({});
  const [stats, setStats] = useState<Stats>({ streak: 0, lastActiveDay: null, totalReviews: 0 });
  const [view, setView] = useState<View>({ type: "home" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getAllProgress(), getStats()]).then(([entries, savedStats]) => {
      const map: Record<string, WordProgress> = {};
      for (const entry of entries) map[entry.wordId] = entry;
      setProgress(map);
      setStats(savedStats);
      setLoaded(true);
    });
  }, []);

  const dueWords = useMemo(
    () => allWords.filter((word) => isDue(progress[word.id])).sort((a, b) => {
      const da = progress[a.id]?.dueAt ?? 0;
      const db = progress[b.id]?.dueAt ?? 0;
      return da - db;
    }),
    [progress],
  );

  const totalMastered = useMemo(
    () => allWords.filter((word) => progress[word.id]?.box === 5).length,
    [progress],
  );

  function handleGrade(wordId: string, grade: Grade) {
    setProgress((prev) => {
      const current = prev[wordId] ?? freshProgress(wordId);
      const updated = applyGrade(current, grade);
      saveProgress(updated);
      return { ...prev, [wordId]: updated };
    });
    recordActivity().then(setStats);
  }

  function goHome() {
    setView({ type: "home" });
  }

  if (!loaded) {
    return (
      <div className="flex h-full items-center justify-center text-ink/50">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Header streak={stats.streak} dueCount={dueWords.length} showBack={view.type !== "home"} onHome={goHome} />

      {view.type === "home" && (
        <Home
          progress={progress}
          dueCount={dueWords.length}
          totalMastered={totalMastered}
          totalWords={allWords.length}
          onPractice={(lessonId) => setView({ type: "practice", lessonId })}
          onQuiz={(lessonId) => setView({ type: "quiz", lessonId })}
          onReview={() => setView({ type: "review" })}
        />
      )}

      {view.type === "practice" &&
        (() => {
          const lesson = lessons.find((l) => l.id === view.lessonId);
          if (!lesson) return null;
          return (
            <Flashcards
              key={lesson.id}
              words={lesson.words}
              title={lesson.title}
              onGrade={handleGrade}
              onFinish={goHome}
              onExit={goHome}
            />
          );
        })()}

      {view.type === "quiz" &&
        (() => {
          const lesson = lessons.find((l) => l.id === view.lessonId);
          if (!lesson) return null;
          return (
            <Quiz key={lesson.id} words={lesson.words} title={lesson.title} onGrade={handleGrade} onExit={goHome} />
          );
        })()}

      {view.type === "review" && (
        <Flashcards
          key="review"
          words={dueWords}
          title="Review"
          onGrade={handleGrade}
          onFinish={goHome}
          onExit={goHome}
        />
      )}
    </div>
  );
}
