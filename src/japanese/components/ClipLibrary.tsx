import type { Attempt, Clip } from "../types";
import { bestByQuestion, scoreColor } from "../util";

export function ClipLibrary({
  clips,
  attempts,
  onPractice,
  onEdit,
  onNew,
  onAddTikTok,
  onDelete,
}: {
  clips: Clip[];
  attempts: Attempt[];
  onPractice: (id: string) => void;
  onEdit: (id: string) => void;
  onNew: () => void;
  onAddTikTok: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">Clip practice</h1>
          <p className="mt-1 max-w-2xl text-sm text-sumi-soft">
            Watch a short scene, then answer questions in Japanese. Each answer is scored for
            grammar, vocabulary, relevance to the scene, and naturalness.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddTikTok}
            className="rounded-full bg-shu px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-shu-dark"
          >
            + Add from TikTok
          </button>
          <button
            onClick={onNew}
            className="rounded-full border border-sumi/15 px-4 py-2.5 text-sm hover:bg-washi-dark"
          >
            Add manually
          </button>
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-sumi/15 p-12 text-center">
          <p className="jp text-3xl">はじめましょう</p>
          <p className="mt-2 text-sumi-soft">Add your first anime clip from TikTok to start practicing.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip) => {
            const clipAttempts = attempts.filter((a) => a.clipId === clip.id);
            const best = bestByQuestion(clipAttempts);
            const answered = clip.questions.filter((q) => best.has(q.id)).length;
            const avg = answered
              ? Math.round(
                  clip.questions.reduce((s, q) => s + (best.get(q.id) ?? 0), 0) / answered,
                )
              : null;
            return (
              <article
                key={clip.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sumi/5"
              >
                <button onClick={() => onPractice(clip.id)} className="relative block aspect-video bg-sumi">
                  {clip.source.kind === "youtube" ? (
                    <img
                      src={`https://img.youtube.com/vi/${clip.source.videoId}/hqdefault.jpg`}
                      alt=""
                      className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    />
                  ) : clip.source.kind === "tiktok" ? (
                    <div className="relative grid h-full place-items-center bg-gradient-to-br from-sumi to-ai">
                      <span className="text-sm font-semibold tracking-wide text-white/80">TikTok</span>
                      {clip.source.thumbnail && (
                        <img
                          src={clip.source.thumbnail}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-90"
                          onError={(e) => e.currentTarget.remove()}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="grid h-full place-items-center bg-gradient-to-br from-ai to-sumi">
                      <span className="jp text-4xl text-white/80">
                        {clip.source.kind === "file" ? "▶" : "台本"}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold">
                    {clip.level}
                  </span>
                  {clip.source.kind === "none" && (
                    <span className="absolute right-2 bottom-2 rounded-full bg-kin px-2 py-0.5 text-xs font-medium text-white">
                      No video yet
                    </span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="font-semibold">{clip.title}</h2>
                  {clip.anime && <p className="text-sm text-sumi-soft">{clip.anime}</p>}
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="text-sumi-soft">
                      {answered}/{clip.questions.length} answered
                    </span>
                    {avg !== null && (
                      <span className={`font-semibold ${scoreColor(avg)}`}>avg {avg}</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => onPractice(clip.id)}
                      className="flex-1 rounded-full bg-sumi px-3 py-2 text-sm font-semibold text-white hover:bg-sumi/85"
                    >
                      Practice
                    </button>
                    <button
                      onClick={() => onEdit(clip.id)}
                      className="rounded-full border border-sumi/15 px-3 py-2 text-sm hover:bg-washi"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${clip.title}" and its answer history?`)) onDelete(clip.id);
                      }}
                      className="rounded-full border border-sumi/15 px-3 py-2 text-sm text-shu hover:bg-shu/5"
                      aria-label={`Delete ${clip.title}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
