import { LEVELS, getLesson, lessonsForLevel, nextLesson, LESSONS } from "../content";
import {
  dueCards,
  lessonCompletion,
  levelCompletion,
  streak,
  todayPoints,
  totalPoints,
  useStore,
} from "../store";
import { Card, ProgressBar, ProgressRing, cx, navigate } from "./ui";

export default function Dashboard({ level: levelProp }: { level?: number }) {
  const s = useStore((st) => st);
  const lastId = s.lastLesson;
  // Pick the level of the last lesson studied unless one is chosen in the URL.
  const level = levelProp ?? (lastId ? getLesson(lastId)?.level : undefined) ?? 1;
  const meta = LEVELS.find((l) => l.level === level) ?? LEVELS[0];
  const lessons = lessonsForLevel(meta.level);

  // "Continue" points to the last lesson if unfinished, otherwise the next unfinished one.
  let cont = lastId ? getLesson(lastId) : undefined;
  if (cont && lessonCompletion(cont, s.progress[cont.id]) >= 0.999) {
    let n = nextLesson(cont.id);
    while (n && lessonCompletion(n, s.progress[n.id]) >= 0.999) n = nextLesson(n.id);
    cont = n;
  }
  if (!cont) cont = LESSONS.find((l) => lessonCompletion(l, s.progress[l.id]) < 0.999);

  const today = todayPoints(s);
  const goal = s.settings.dailyGoal;
  const due = dueCards(s).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Card className="relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-bleu-soft" />
          <div className="pointer-events-none absolute -right-2 top-16 h-24 w-24 rounded-full bg-rouge-soft" />
          <div className="relative">
            <p className="text-sm font-medium text-ink-soft">{s.lastLesson ? "Bon retour !" : "Bienvenue !"}</p>
            <h1 className="mt-1 font-display text-3xl font-bold">{cont ? "Pick up where you left off" : "Félicitations !"}</h1>
            {cont ? (
              <>
                <p className="mt-3 text-sm text-ink-soft">
                  Lesson {cont.id} · {cont.kind === "audio" ? "Interactive audio" : "Language & culture"}
                </p>
                <p className="font-display text-xl font-semibold">{cont.title}</p>
                <p className="text-sm text-ink-soft">{cont.subtitle}</p>
                <button onClick={() => navigate(`/lesson/${cont.id}`)} className="mt-4 rounded-xl bg-rouge px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110">
                  {s.progress[cont.id] ? "Continue lesson" : "Start lesson"} →
                </button>
              </>
            ) : (
              <p className="mt-3 text-ink-soft">You've completed every lesson in the course. Keep your vocab fresh with daily reviews.</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ProgressRing value={today / goal} size={72} stroke={7} label={<span className="text-sm">{today}</span>} />
            <div>
              <p className="text-sm text-ink-soft">Today's goal</p>
              <p className="text-lg font-semibold">
                {today >= goal ? "Goal reached 🎉" : `${goal - today} points to go`}
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-paper-2 p-2">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft">Streak</dt>
              <dd className="text-lg font-bold">🔥 {streak(s)}</dd>
            </div>
            <div className="rounded-xl bg-paper-2 p-2">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft">Points</dt>
              <dd className="text-lg font-bold">{totalPoints(s).toLocaleString()}</dd>
            </div>
            <a href="#/vocab" className="rounded-xl bg-paper-2 p-2 hover:bg-or-soft">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft">To review</dt>
              <dd className="text-lg font-bold">{due}</dd>
            </a>
          </dl>
        </Card>
      </section>

      <section>
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
          {LEVELS.map((l) => {
            const pct = levelCompletion(s, l.level);
            return (
              <button
                key={l.level}
                role="tab"
                aria-selected={l.level === meta.level}
                onClick={() => navigate(`/level/${l.level}`)}
                className={cx(
                  "min-w-36 flex-1 rounded-2xl border px-4 py-3 text-left transition",
                  l.level === meta.level ? "border-bleu bg-bleu-soft" : "border-line bg-card hover:bg-paper-2",
                )}
              >
                <span className="block text-xs font-semibold uppercase tracking-wide text-ink-soft">Level {l.level}</span>
                <span className="block font-display text-lg font-semibold">{l.title}</span>
                <ProgressBar value={pct} className="mt-2" />
                <span className="mt-1 block text-xs text-ink-soft">{Math.round(pct * 100)}% complete</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-ink-soft">{meta.blurb}</p>
      </section>

      {meta.modules.map((m) => {
        const ls = lessons.filter((l) => l.module === m.module);
        return (
          <section key={m.module}>
            <h2 className="mb-3 flex items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rouge">Module {m.module}</span>
              <span className="font-display text-xl font-semibold">{m.title}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {ls.map((l) => {
                const pct = lessonCompletion(l, s.progress[l.id]);
                return (
                  <a key={l.id} href={`#/lesson/${l.id}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition hover:border-bleu hover:shadow-sm">
                    <span
                      className={cx(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg",
                        l.kind === "audio" ? "bg-bleu-soft" : "bg-rouge-soft",
                      )}
                      aria-hidden
                    >
                      {l.kind === "audio" ? "🎧" : "📖"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-ink-soft">
                        {l.id} · {l.kind === "audio" ? "Interactive audio" : "Language & culture"}
                      </span>
                      <span className="block truncate font-semibold group-hover:text-bleu">{l.title}</span>
                      <span className="block truncate text-sm text-ink-soft">{l.subtitle}</span>
                    </span>
                    <ProgressRing value={pct} />
                  </a>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
