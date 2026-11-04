import { LEVELS, type JlptLevel } from "../types";
import type { VideoPack } from "../packs";

export function RandomLessonCard({
  pack,
  level,
  onLevel,
  onStart,
  busy,
}: {
  pack: VideoPack;
  level: JlptLevel;
  onLevel: (l: JlptLevel) => void;
  onStart: () => void;
  busy: string | null;
}) {
  const count = pack.videos.length;
  return (
    <section className="mb-8 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">
            Random lesson
          </div>
          <h2 className="jp mt-1 font-display text-2xl font-bold">{pack.name}</h2>
          <p className="mt-1 text-sm text-sumi-soft">
            {count > 0 ? (
              <>
                A random episode under 4 minutes from the official channel, {count} to choose
                from. Everyday family Japanese, great for listening.
              </>
            ) : (
              <>The episode list hasn't been loaded yet.</>
            )}
          </p>
        </div>
        <button
          onClick={onStart}
          disabled={count === 0 || busy !== null}
          className="rounded-full bg-shu px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-shu-dark disabled:opacity-40"
        >
          {busy ?? "🎲 Start a random lesson"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-sm">
        <span className="mr-1 text-sumi-soft">Your level</span>
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => onLevel(l)}
            className={`rounded-full px-3 py-1 ${
              level === l ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi"
            }`}
          >
            {l}
          </button>
        ))}
        {pack.fetchedAt && (
          <span className="ml-auto text-xs text-sumi-soft">List updated {pack.fetchedAt}</span>
        )}
      </div>
    </section>
  );
}
