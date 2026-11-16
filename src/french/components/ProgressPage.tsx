import { useState } from "react";
import { LEVELS, LESSONS } from "../content";
import { BADGES, lastNDays, lessonCompletion, levelCompletion, streak, totalPoints, useStore } from "../store";
import { Button, Card, ProgressBar, cx } from "./ui";

function WeekChart() {
  const s = useStore((st) => st);
  const days = lastNDays(s, 14);
  const goal = s.settings.dailyGoal;
  const max = Math.max(goal, ...days.map((d) => d.points));
  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl font-semibold">Last 14 days</h2>
        <span className="text-xs text-ink-soft">dashed line = daily goal ({goal})</span>
      </div>
      <div className="relative mt-4 flex h-40 items-end gap-1.5">
        <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-or" style={{ bottom: `${(goal / max) * 100}%` }} />
        {days.map((d) => (
          <div key={d.key} className="group relative flex h-full flex-1 flex-col justify-end">
            <div
              className={cx("w-full rounded-t-md transition-[height]", d.points >= goal ? "bg-vert" : "bg-bleu")}
              style={{ height: `${(d.points / max) * 100}%`, minHeight: d.points ? 4 : 0 }}
              title={`${d.points} points`}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[10px] text-paper group-hover:block">{d.points}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1.5">
        {days.map((d, i) => (
          <span key={d.key} className="flex-1 text-center text-[10px] text-ink-soft">
            {i % 2 === 1 ? d.label.slice(0, 2) : ""}
          </span>
        ))}
      </div>
    </Card>
  );
}

function Certificate({ level, onClose }: { level: number; onClose: () => void }) {
  const meta = LEVELS.find((l) => l.level === level)!;
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="no-print flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name for the certificate" className="min-w-0 flex-1 rounded-xl border border-line bg-card px-3 py-2" />
          <Button onClick={() => window.print()}>Print</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="rounded-2xl border-8 border-double border-bleu bg-white p-10 text-center text-[#1c2238]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d0433b]">Certificat de réussite</p>
          <p className="mt-6 text-sm">This certifies that</p>
          <p className="mt-2 font-display text-4xl font-bold">{name || "—"}</p>
          <p className="mt-4 text-sm">has completed every lesson and activity in</p>
          <p className="mt-2 font-display text-2xl font-semibold">
            Allons-y French · Level {level} — {meta.title}
          </p>
          <p className="mt-6 text-sm text-[#5a6075]">{new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</p>
          <p className="mt-2 text-2xl">🇫🇷</p>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const s = useStore((st) => st);
  const [cert, setCert] = useState<number | null>(null);
  const finished = LESSONS.filter((l) => lessonCompletion(l, s.progress[l.id]) >= 0.999).length;
  const started = Object.keys(s.progress).length;
  const unlocked = BADGES.filter((b) => s.badges[b.id]).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Progress</h1>
        <p className="text-ink-soft">Your points, streaks and achievements.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total points", value: totalPoints(s).toLocaleString(), icon: "⭐" },
          { label: "Day streak", value: streak(s), icon: "🔥" },
          { label: "Lessons complete", value: `${finished}/${LESSONS.length}`, icon: "✅" },
          { label: "Words saved", value: Object.keys(s.vocab).length, icon: "🗂️" },
        ].map((x) => (
          <Card key={x.label} className="p-4">
            <p className="text-2xl">{x.icon}</p>
            <p className="mt-1 text-2xl font-bold">{x.value}</p>
            <p className="text-xs text-ink-soft">{x.label}</p>
          </Card>
        ))}
      </div>

      <WeekChart />

      <Card className="space-y-4 p-5">
        <h2 className="font-display text-xl font-semibold">Course completion</h2>
        <p className="-mt-2 text-sm text-ink-soft">{started} lesson{started === 1 ? "" : "s"} started</p>
        {LEVELS.map((l) => {
          const pct = levelCompletion(s, l.level);
          return (
            <div key={l.level}>
              <div className="flex items-center justify-between text-sm">
                <a href={`#/level/${l.level}`} className="font-semibold hover:text-bleu">
                  Level {l.level} · {l.title}
                </a>
                <span className="flex items-center gap-3">
                  {Math.round(pct * 100)}%
                  {pct >= 0.999 && (
                    <button onClick={() => setCert(l.level)} className="font-semibold text-bleu hover:underline">
                      Certificate
                    </button>
                  )}
                </span>
              </div>
              <ProgressBar value={pct} className="mt-1.5" color={pct >= 0.999 ? "bg-vert" : "bg-bleu"} />
            </div>
          );
        })}
      </Card>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">
          Badges <span className="text-sm font-normal text-ink-soft">{unlocked}/{BADGES.length}</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {BADGES.map((b) => {
            const at = s.badges[b.id];
            return (
              <Card key={b.id} className={cx("p-4 text-center", !at && "opacity-45 grayscale")}>
                <p className="text-3xl">{b.icon}</p>
                <p className="mt-1 font-semibold">{b.title}</p>
                <p className="text-xs text-ink-soft">{b.desc}</p>
                {at && <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-vert">{new Date(at).toLocaleDateString()}</p>}
              </Card>
            );
          })}
        </div>
      </section>

      {cert !== null && <Certificate level={cert} onClose={() => setCert(null)} />}
    </div>
  );
}
