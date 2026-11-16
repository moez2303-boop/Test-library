import { useEffect } from "react";
import { getLesson, nextLesson } from "../languages";
import { activitiesFor, activityCompletion, lessonCompletion, setLastLesson, useStore, type ActivityId } from "../store";
import { ProgressBar, ProgressRing, cx, navigate } from "./ui";
import LessonContent from "./LessonContent";
import HearSay from "./HearSay";
import WriteIt from "./WriteIt";
import KnowIt from "./KnowIt";
import Quiz from "./Quiz";
import RolePlay from "./RolePlay";

export const ACTIVITY_META: Record<ActivityId, { label: string; icon: string; desc: string }> = {
  lesson: { label: "Lesson", icon: "📘", desc: "Dialogue and notes" },
  hear: { label: "Hear It Say It", icon: "🎙️", desc: "Pronunciation" },
  write: { label: "Write It", icon: "✍️", desc: "Dictation" },
  know: { label: "Know It", icon: "🃏", desc: "Flashcards" },
  quiz: { label: "Quiz", icon: "❓", desc: "Test yourself" },
  play: { label: "Play It", icon: "🎭", desc: "Role-play" },
};

export default function LessonPage({ id, activity }: { id: string; activity: ActivityId }) {
  const lesson = getLesson(id)!;
  const progress = useStore((s) => s.progress[id]);
  const acts = activitiesFor(lesson);
  const current = acts.includes(activity) ? activity : "lesson";
  const idx = acts.indexOf(current);
  const nextAct = acts[idx + 1];
  const next = nextLesson(id);

  useEffect(() => setLastLesson(id), [id]);

  const goNext = () => {
    if (nextAct) navigate(`/lesson/${id}/${nextAct}`);
    else if (next) navigate(`/lesson/${next.id}`);
    else navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <a href={`#/level/${lesson.level}`} className="mt-1 rounded-lg p-1.5 text-ink-soft hover:bg-paper-2 hover:text-ink" aria-label="Back to course">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </a>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-rouge">
            Level {lesson.level} · Lesson {lesson.id} · {lesson.kind === "audio" ? "Interactive audio" : "Language & culture"}
          </p>
          <h1 className="font-display text-3xl font-bold">{lesson.title}</h1>
          <p className="text-ink-soft">{lesson.subtitle}</p>
        </div>
        <ProgressRing value={lessonCompletion(lesson, progress)} size={56} stroke={6} />
      </div>

      <nav className="no-print -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0" aria-label="Activities">
        {acts.map((a) => {
          const pct = activityCompletion(lesson, progress, a);
          return (
            <a
              key={a}
              href={`#/lesson/${id}/${a}`}
              aria-current={a === current ? "page" : undefined}
              className={cx(
                "min-w-32 shrink-0 rounded-xl border px-3 py-2 transition",
                a === current ? "border-bleu bg-bleu-soft" : "border-line bg-card hover:bg-paper-2",
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <span aria-hidden>{ACTIVITY_META[a].icon}</span>
                {ACTIVITY_META[a].label}
              </span>
              <ProgressBar value={pct} className="mt-1.5 h-1.5" color={pct >= 0.999 ? "bg-vert" : "bg-bleu"} />
            </a>
          );
        })}
      </nav>

      <div key={current}>
        {current === "lesson" && <LessonContent lesson={lesson} onNext={goNext} />}
        {current === "hear" && <HearSay lesson={lesson} onNext={goNext} />}
        {current === "write" && <WriteIt lesson={lesson} onNext={goNext} />}
        {current === "know" && <KnowIt lesson={lesson} onNext={goNext} />}
        {current === "quiz" && <Quiz lesson={lesson} onNext={goNext} />}
        {current === "play" && <RolePlay lesson={lesson} onNext={goNext} />}
      </div>

      <div className="no-print flex items-center justify-between border-t border-line pt-4 text-sm">
        {idx > 0 ? (
          <a href={`#/lesson/${id}/${acts[idx - 1]}`} className="text-ink-soft hover:text-ink">
            ← {ACTIVITY_META[acts[idx - 1]].label}
          </a>
        ) : (
          <span />
        )}
        <button onClick={goNext} className="font-semibold text-bleu hover:underline">
          {nextAct ? `${ACTIVITY_META[nextAct].label} →` : next ? `Next lesson: ${next.title} →` : "Back to course →"}
        </button>
      </div>
    </div>
  );
}
