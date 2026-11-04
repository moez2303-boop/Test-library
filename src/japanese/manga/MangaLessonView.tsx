import { useEffect, useState } from "react";
import { IS_ARTIFACT } from "../env";
import { GraderError } from "../grader";
import { getMangaPageImages, saveMangaLesson } from "../db";
import { FeedbackPanel } from "../components/FeedbackPanel";
import type { Settings } from "../types";
import { scoreColor } from "../util";
import { gradeWriting } from "./prompts";
import { Ruby } from "./Ruby";
import { lessonProgress } from "./score";
import {
  EXERCISE_LABELS,
  WRITING_TYPES,
  type Exercise,
  type MangaLesson,
  type MangaPanel,
} from "./types";

export function MangaLessonView({
  lesson: initial,
  settings,
  onBack,
  onNeedSettings,
  onChanged,
}: {
  lesson: MangaLesson;
  settings: Settings;
  onBack: () => void;
  onNeedSettings: () => void;
  onChanged: (lesson: MangaLesson) => void;
}) {
  const [lesson, setLesson] = useState(initial);
  const [furigana, setFurigana] = useState(true);
  const [english, setEnglish] = useState(false);
  const [showText, setShowText] = useState(initial.source === "story");
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(() => {
    const first = initial.exercises.findIndex((_, i) => !initial.results[i]);
    return first === -1 ? 0 : first;
  });

  useEffect(() => {
    if (lesson.source !== "pages") return;
    let urls: string[] = [];
    let cancelled = false;
    void getMangaPageImages(lesson).then((blobs) => {
      if (cancelled) return;
      urls = blobs.map((b) => (b ? URL.createObjectURL(b) : ""));
      setImages(urls);
    });
    return () => {
      cancelled = true;
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    };
    // Images only depend on which lesson this is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const update = async (next: MangaLesson) => {
    setLesson(next);
    await saveMangaLesson(next);
    onChanged(next);
  };

  const progress = lessonProgress(lesson);
  const exercise = lesson.exercises[index];
  const toggle = (on: boolean, label: string, set: (v: boolean) => void) => (
    <button
      onClick={() => set(!on)}
      className={`rounded-full px-3 py-1 text-xs ${on ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={onBack} className="mb-4 text-sm text-sumi-soft hover:text-sumi">
        ← All lessons
      </button>

      <header>
        <div className="flex items-center gap-2 text-xs text-sumi-soft">
          <span className="rounded-full bg-washi-dark px-2 py-0.5 font-bold text-sumi">{lesson.level}</span>
          <span>{lesson.source === "pages" ? "Your pages" : "Original story"}</span>
          <span>· {lesson.pageCount} pages</span>
        </div>
        <h1 className="jp mt-2 font-display text-3xl leading-snug font-bold text-balance">
          <Ruby text={lesson.title} show={furigana} />
        </h1>
        <p className="text-sumi-soft">{lesson.titleEn}</p>
      </header>

      <div className="sticky top-[calc(env(safe-area-inset-top,0px)+64px)] z-10 -mx-4 mt-4 flex flex-wrap items-center gap-1.5 bg-washi/95 px-4 py-2 backdrop-blur">
        {toggle(furigana, "ふりがな", setFurigana)}
        {toggle(english, "English", setEnglish)}
        {lesson.source === "pages" && toggle(showText, "Text", setShowText)}
        <a href="#exercises" className="ml-auto text-xs font-medium text-ai hover:underline">
          Exercises ↓
        </a>
      </div>

      {/* Pages */}
      <div className="mt-4 grid gap-6">
        {lesson.pages.map((page, pi) => (
          <section key={pi} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-sumi/5 sm:p-5">
            <div className="mb-3 flex items-baseline gap-2">
              <span className="jp font-display text-lg font-bold">{pi + 1}ページ</span>
              <span className="text-xs text-sumi-soft">Page {pi + 1}</span>
            </div>
            {lesson.source === "pages" && images[pi] && (
              <img src={images[pi]} alt={`Page ${pi + 1}`} className="mb-4 w-full rounded-lg ring-1 ring-sumi/10" />
            )}
            {showText && (
              // Manga reads right to left: on wide screens the first panel sits top-right.
              <div className="grid gap-3 sm:grid-cols-2 sm:[direction:rtl]">
                {page.panels.map((panel, i) => (
                  <Panel key={i} panel={panel} n={i + 1} furigana={furigana} english={english} />
                ))}
                {page.panels.length === 0 && (
                  <p className="text-sm text-sumi-soft">No text was found on this page.</p>
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {lesson.summaryEn && english && (
        <p className="mt-4 text-sm text-sumi-soft">
          <span className="font-semibold">Summary:</span> {lesson.summaryEn}
        </p>
      )}

      {lesson.glossary.length > 0 && (
        <details className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-sumi/5">
          <summary className="cursor-pointer font-semibold">
            Word list <span className="jp text-sm font-normal text-sumi-soft">単語</span> ({lesson.glossary.length})
          </summary>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {lesson.glossary.map((g, i) => (
              <div key={i} className="flex gap-2">
                <dt className="jp shrink-0 font-medium">
                  {g.word}
                  <span className="ml-1 text-xs text-sumi-soft">{g.reading}</span>
                </dt>
                <dd className="text-sumi-soft">{g.meaning}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      {/* Exercises */}
      <section id="exercises" className="mt-10 scroll-mt-28">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-2xl font-bold">
            練習 <span className="font-sans text-base font-semibold">Exercises</span>
          </h2>
          <span className="text-sm text-sumi-soft">
            {progress.done}/{progress.total} done
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {lesson.exercises.map((ex, i) => {
            const r = lesson.results[i];
            const state = !r
              ? "ring-transparent"
              : r.feedback
                ? r.feedback.overall >= 80
                  ? "ring-matcha"
                  : r.feedback.overall >= 55
                    ? "ring-kin"
                    : "ring-shu"
                : r.correct
                  ? "ring-matcha"
                  : "ring-shu";
            return (
              <button
                key={i}
                onClick={() => setIndex(i)}
                title={EXERCISE_LABELS[ex.type].label}
                className={`h-9 w-9 rounded-full text-sm font-semibold ring-2 ring-offset-2 ring-offset-washi ${state} ${
                  i === index ? "bg-sumi text-washi" : "bg-card"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {exercise && (
          <ExerciseCard
            key={index}
            exercise={exercise}
            n={index + 1}
            total={lesson.exercises.length}
            lesson={lesson}
            furigana={furigana}
            settings={settings}
            onNeedSettings={onNeedSettings}
            onResult={(r) => void update({ ...lesson, results: { ...lesson.results, [index]: r } })}
            onNext={index < lesson.exercises.length - 1 ? () => setIndex(index + 1) : undefined}
          />
        )}

        {progress.done === progress.total && progress.total > 0 && (
          <div className="mt-6 rounded-2xl bg-card p-5 text-center ring-1 ring-sumi/5">
            <p className="jp font-display text-2xl font-bold">おつかれさま！</p>
            <p className="mt-2 text-sm text-sumi-soft">
              {progress.choiceTotal > 0 && (
                <>
                  Quick questions: {progress.choiceCorrect}/{progress.choiceTotal} correct.{" "}
                </>
              )}
              {progress.writingAvg !== null && (
                <>
                  Writing: <span className={`font-semibold ${scoreColor(progress.writingAvg)}`}>{progress.writingAvg}</span>{" "}
                  / 100 on average.
                </>
              )}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Panel({ panel, n, furigana, english }: { panel: MangaPanel; n: number; furigana: boolean; english: boolean }) {
  return (
    <div className="[direction:ltr] rounded-xl border-2 border-sumi/80 bg-card p-3">
      <div className="mb-2 flex gap-2 text-xs text-sumi-soft">
        <span className="font-semibold">{n}</span>
        <span className="jp">
          <Ruby text={panel.scene} show={furigana} />
          {english && panel.sceneEn && <span className="block font-sans italic">{panel.sceneEn}</span>}
        </span>
      </div>
      <div className="grid gap-2">
        {panel.lines.map((line, i) => {
          const narration = line.speaker === "ナレーション";
          const sfx = line.speaker === "SFX";
          return (
            <div key={i} className={sfx ? "text-center" : ""}>
              {!narration && !sfx && <div className="jp mb-0.5 text-xs font-semibold text-ai">{line.speaker}</div>}
              <div
                className={`jp leading-loose ${
                  sfx
                    ? "font-display text-2xl font-bold tracking-widest text-shu"
                    : narration
                      ? "border border-sumi/30 bg-washi px-3 py-1.5 text-sm"
                      : "rounded-2xl border border-sumi/25 bg-washi px-3 py-1.5 text-base"
                }`}
              >
                <Ruby text={line.text} show={furigana} />
              </div>
              {english && line.en && <div className="mt-0.5 px-1 text-xs text-sumi-soft italic">{line.en}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  n,
  total,
  lesson,
  furigana,
  settings,
  onNeedSettings,
  onResult,
  onNext,
}: {
  exercise: Exercise;
  n: number;
  total: number;
  lesson: MangaLesson;
  furigana: boolean;
  settings: Settings;
  onNeedSettings: () => void;
  onResult: (r: MangaLesson["results"][number]) => void;
  onNext?: () => void;
}) {
  const result = lesson.results[n - 1];
  const isWriting = WRITING_TYPES.includes(exercise.type);
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const label = EXERCISE_LABELS[exercise.type];

  const submitWriting = async () => {
    if (!answer.trim() || grading) return;
    if (!IS_ARTIFACT && !settings.apiKey) return onNeedSettings();
    setGrading(true);
    setError(null);
    try {
      const feedback = await gradeWriting(settings, lesson, exercise, answer.trim());
      onResult({ answer: answer.trim(), feedback, at: Date.now() });
      setRetrying(false);
    } catch (err) {
      setError(err instanceof GraderError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-sumi-soft uppercase">
        <span>
          {n} / {total}
        </span>
        <span className="rounded-full bg-ai/10 px-2 py-0.5 tracking-normal text-ai normal-case">
          {label.label} <span className="jp">{label.jp}</span>
        </span>
      </div>
      <p className="jp mt-3 text-xl leading-relaxed whitespace-pre-line">
        <Ruby text={exercise.prompt} show={furigana} />
      </p>
      {exercise.promptEn && (
        <button onClick={() => setShowEn((v) => !v)} className="mt-1 text-xs text-ai hover:underline">
          {showEn ? exercise.promptEn : "Show English"}
        </button>
      )}

      {!isWriting ? (
        <>
          <div className="mt-4 grid gap-2">
            {exercise.options.map((opt, i) => {
              const picked = result?.answer === String(i);
              const isAnswer = i === exercise.answerIndex;
              const style = !result
                ? "border-sumi/20 hover:border-sumi/50 hover:bg-washi"
                : isAnswer
                  ? "border-matcha bg-matcha/10"
                  : picked
                    ? "border-shu bg-shu/10"
                    : "border-sumi/10 opacity-60";
              return (
                <button
                  key={i}
                  disabled={!!result}
                  onClick={() => onResult({ answer: String(i), correct: isAnswer, at: Date.now() })}
                  className={`jp flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base ${style}`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-washi-dark text-xs font-bold">
                    {result && isAnswer ? "✓" : result && picked ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  <span>
                    <Ruby text={opt} show={furigana} />
                  </span>
                </button>
              );
            })}
          </div>
          {result && (
            <div className={`mt-4 rounded-xl p-4 text-sm ${result.correct ? "bg-matcha/10" : "bg-shu/10"}`}>
              <p className="font-semibold">{result.correct ? "正解！ Correct." : "Not quite."}</p>
              {exercise.explanation && <p className="mt-1">{exercise.explanation}</p>}
            </div>
          )}
        </>
      ) : result?.feedback && !retrying ? (
        <div className="mt-4">
          <p className="jp mb-3 rounded-xl bg-washi px-4 py-3">{result.answer}</p>
          <FeedbackPanel feedback={result.feedback} answer={result.answer} />
          <button
            onClick={() => {
              setAnswer(result.answer);
              setRetrying(true);
            }}
            className="mt-3 rounded-full border border-sumi/15 px-4 py-2 text-sm hover:bg-washi"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <textarea
            id={`exercise-${n}`}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void submitWriting();
              }
            }}
            rows={exercise.type === "continue_story" ? 5 : 3}
            lang="ja"
            placeholder={exercise.type === "continue_story" ? "続きを日本語で書いてください…" : "日本語で答えてください…"}
            className="jp mt-4 w-full resize-y rounded-xl border border-sumi/20 bg-card px-3 py-2 text-lg focus:border-shu focus:outline-none"
            disabled={grading}
          />
          <button
            onClick={() => void submitWriting()}
            disabled={!answer.trim() || grading}
            className="mt-3 rounded-full bg-shu px-5 py-2 text-sm font-semibold text-white hover:bg-shu-dark disabled:opacity-40"
          >
            {grading ? "Grading…" : "Check my answer"}
          </button>
          {error && <p className="mt-3 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}
        </>
      )}

      {result && onNext && (
        <div className="mt-4 flex justify-end">
          <button onClick={onNext} className="rounded-full bg-sumi px-5 py-2 text-sm font-semibold text-washi">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
