import { WRITING_TYPES, type MangaLesson } from "./types";

export function lessonProgress(lesson: MangaLesson) {
  let choiceTotal = 0;
  let choiceCorrect = 0;
  const writingScores: number[] = [];
  lesson.exercises.forEach((ex, i) => {
    const r = lesson.results[i];
    if (WRITING_TYPES.includes(ex.type)) {
      if (r?.feedback) writingScores.push(r.feedback.overall);
    } else {
      choiceTotal++;
      if (r?.correct) choiceCorrect++;
    }
  });
  const done = Object.keys(lesson.results).length;
  const writingAvg = writingScores.length
    ? Math.round(writingScores.reduce((a, b) => a + b, 0) / writingScores.length)
    : null;
  const choiceAnswered = lesson.exercises.filter((ex, i) => !WRITING_TYPES.includes(ex.type) && lesson.results[i]).length;
  return { done, total: lesson.exercises.length, choiceTotal, choiceCorrect, choiceAnswered, writingAvg };
}
