import { useEffect, useState } from "react";
import { addAttempt, getAttemptsForClip } from "../db";
import { IS_ARTIFACT } from "../env";
import { GraderError, gradeAnswer } from "../grader";
import type { Attempt, Clip, Settings } from "../types";
import { bestByQuestion, uid } from "../util";
import { ClipPlayer } from "./ClipPlayer";
import { FeedbackPanel } from "./FeedbackPanel";

export function Practice({
  clip,
  settings,
  onBack,
  onEdit,
  onNeedSettings,
}: {
  clip: Clip;
  settings: Settings;
  onBack: () => void;
  onEdit: () => void;
  onNeedSettings: () => void;
}) {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Attempt | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(clip.source.kind === "none");
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    void getAttemptsForClip(clip.id).then(setAttempts);
  }, [clip.id]);

  const question = clip.questions[index];
  const best = bestByQuestion(attempts);
  const history = question ? attempts.filter((a) => a.questionId === question.id).reverse() : [];

  const goTo = (i: number) => {
    setIndex(i);
    setAnswer("");
    setResult(null);
    setError(null);
    setShowHint(false);
  };

  const submit = async () => {
    if (!question || !answer.trim() || grading) return;
    if (!IS_ARTIFACT && !settings.apiKey) return onNeedSettings();
    setGrading(true);
    setError(null);
    try {
      const feedback = await gradeAnswer(settings, clip, question, answer.trim());
      const attempt: Attempt = {
        id: uid(),
        clipId: clip.id,
        questionId: question.id,
        answer: answer.trim(),
        feedback,
        createdAt: Date.now(),
      };
      await addAttempt(attempt);
      setAttempts((prev) => [...prev, attempt]);
      setResult(attempt);
    } catch (err) {
      setError(err instanceof GraderError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button onClick={onBack} className="text-sm text-sumi-soft hover:text-sumi">
          ← All clips
        </button>
        <div className="flex-1" />
        <button onClick={onEdit} className="rounded-full border border-sumi/15 px-4 py-1.5 text-sm hover:bg-washi-dark">
          Edit clip
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Left: video + transcript */}
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold">{clip.title}</h1>
          <p className="mb-3 text-sm text-sumi-soft">
            {clip.anime && <>{clip.anime} · </>}JLPT {clip.level}
          </p>
          <ClipPlayer clip={clip} onAttachVideo={onEdit} />

          {clip.caption && !clip.transcript.trim() && (
            <p className="jp mt-3 rounded-xl bg-card px-4 py-3 text-sm text-sumi-soft ring-1 ring-sumi/5">
              {clip.caption}
            </p>
          )}
          {clip.transcript.trim() && (
          <div className="mt-4 rounded-2xl bg-card p-4 ring-1 ring-sumi/5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Script</h2>
              <div className="flex-1" />
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="rounded-full border border-sumi/15 px-3 py-1 text-xs hover:bg-washi"
              >
                {showTranscript ? "Hide" : "Show"} Japanese
              </button>
              {clip.translation.trim() && (
                <button
                  onClick={() => setShowTranslation((v) => !v)}
                  className="rounded-full border border-sumi/15 px-3 py-1 text-xs hover:bg-washi"
                >
                  {showTranslation ? "Hide" : "Show"} English
                </button>
              )}
            </div>
            {!showTranscript && !showTranslation && (
              <p className="mt-2 text-sm text-sumi-soft">
                Hidden — try answering by listening first. Reveal it if you get stuck.
              </p>
            )}
            {showTranscript && (
              <p className="jp mt-3 text-base leading-loose whitespace-pre-line">{clip.transcript}</p>
            )}
            {showTranslation && (
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-sumi-soft">
                {clip.translation}
              </p>
            )}
          </div>
          )}
        </div>

        {/* Right: questions */}
        <div className="min-w-0">
          {clip.questions.length === 0 ? (
            <div className="rounded-2xl bg-card p-6 text-center ring-1 ring-sumi/5">
              <p className="text-sumi-soft">This clip has no questions yet.</p>
              <button onClick={onEdit} className="mt-3 rounded-full bg-shu px-4 py-2 text-sm font-semibold text-white">
                Add questions
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap gap-2">
                {clip.questions.map((q, i) => {
                  const b = best.get(q.id);
                  const ring =
                    b === undefined ? "" : b >= 80 ? "ring-matcha" : b >= 55 ? "ring-kin" : "ring-shu";
                  return (
                    <button
                      key={q.id}
                      onClick={() => goTo(i)}
                      className={`h-9 w-9 rounded-full text-sm font-semibold ring-2 ring-offset-2 ring-offset-washi ${
                        i === index ? "bg-sumi text-washi" : "bg-card"
                      } ${ring || "ring-transparent"}`}
                      title={b === undefined ? "Not answered yet" : `Best score: ${b}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {question && (
                <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
                  <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">
                    Question {index + 1} of {clip.questions.length}
                  </div>
                  <p className="jp mt-2 text-xl leading-relaxed">{question.prompt}</p>
                  {question.promptEn && (
                    <button
                      onClick={() => setShowHint((v) => !v)}
                      className="mt-1 text-xs text-ai underline-offset-2 hover:underline"
                    >
                      {showHint ? question.promptEn : "Show English"}
                    </button>
                  )}

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        void submit();
                      }
                    }}
                    rows={3}
                    lang="ja"
                    placeholder="日本語で答えてください…"
                    className="jp mt-4 w-full resize-y rounded-xl border border-sumi/20 px-3 py-2 text-lg focus:border-shu focus:outline-none"
                    disabled={grading}
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => void submit()}
                      disabled={!answer.trim() || grading}
                      className="rounded-full bg-shu px-5 py-2 text-sm font-semibold text-white hover:bg-shu-dark disabled:opacity-40"
                    >
                      {grading ? "Grading…" : "Check my answer"}
                    </button>
                    <span className="hidden text-xs text-sumi-soft sm:inline">Ctrl/⌘ + Enter</span>
                    <div className="flex-1" />
                    {index < clip.questions.length - 1 && (
                      <button onClick={() => goTo(index + 1)} className="text-sm text-sumi-soft hover:text-sumi">
                        Next →
                      </button>
                    )}
                  </div>
                  {error && <p className="mt-3 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}
                </div>
              )}

              {grading && (
                <div className="mt-4 animate-pulse rounded-2xl bg-card p-5 text-sm text-sumi-soft ring-1 ring-sumi/5">
                  先生が確認しています… reading your answer.
                </div>
              )}

              {result && !grading && (
                <div className="mt-4">
                  <FeedbackPanel feedback={result.feedback} answer={result.answer} />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setAnswer(result.answer);
                        setResult(null);
                      }}
                      className="rounded-full border border-sumi/15 px-4 py-2 text-sm hover:bg-card"
                    >
                      Try again
                    </button>
                    {index < clip.questions.length - 1 && (
                      <button
                        onClick={() => goTo(index + 1)}
                        className="rounded-full bg-sumi px-4 py-2 text-sm font-semibold text-washi"
                      >
                        Next question →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {history.length > 0 && !result && (
                <details className="mt-4 rounded-2xl bg-card p-4 text-sm ring-1 ring-sumi/5">
                  <summary className="cursor-pointer font-semibold">
                    Previous answers ({history.length})
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {history.map((a) => (
                      <li key={a.id}>
                        <button
                          onClick={() => setResult(a)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-washi"
                        >
                          <span className="w-8 font-semibold tabular-nums">{a.feedback.overall}</span>
                          <span className="jp flex-1 truncate">{a.answer}</span>
                          <span className="text-xs text-sumi-soft">
                            {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
