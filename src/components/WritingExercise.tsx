import { useState } from "react";
import type { WritingPrompt } from "../types";
import { useSpeechRecognition } from "../speechRecognition";
import { estimateCoverage, type CoverageResult } from "../scoring";
import { checkGrammar, type GrammarMatch } from "../grammarCheck";
import { GrammarFeedback } from "./GrammarFeedback";

type GrammarStatus = "idle" | "loading" | "done" | "error";

interface WritingExerciseProps {
  prompt: WritingPrompt;
  previousResponse?: string;
  onComplete: (text: string, checkedPoints: number, totalPoints: number) => void;
  onExit: () => void;
}

type Phase = "read" | "write" | "review";

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches ? matches.filter((s) => s.trim().length > 0).length : 0;
}

export function WritingExercise({ prompt, previousResponse, onComplete, onExit }: WritingExerciseProps) {
  const [phase, setPhase] = useState<Phase>("read");
  const [showTranslations, setShowTranslations] = useState(false);
  const [text, setText] = useState(previousResponse ?? "");
  const [checked, setChecked] = useState<boolean[]>(() => prompt.keyPoints.map(() => false));
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [grammarStatus, setGrammarStatus] = useState<GrammarStatus>("idle");
  const [grammarMatches, setGrammarMatches] = useState<GrammarMatch[]>([]);
  const [grammarError, setGrammarError] = useState<string | null>(null);

  const {
    listening,
    error: speechError,
    start: startListening,
    stop: stopListening,
    supported: speechSupported,
  } = useSpeechRecognition((chunk) => {
    setText((prev) => (prev ? `${prev} ${chunk}` : chunk));
  });

  const sentenceCount = countSentences(text);
  const canSubmit = text.trim().length >= 10;

  function toggleCheck(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  async function runGrammarCheck(answer: string) {
    setGrammarStatus("loading");
    setGrammarError(null);
    try {
      const matches = await checkGrammar(answer);
      setGrammarMatches(matches);
      setGrammarStatus("done");
    } catch (err) {
      setGrammarError(err instanceof Error ? err.message : "The grammar checker is unavailable right now.");
      setGrammarStatus("error");
    }
  }

  function submit() {
    stopListening();
    const result = estimateCoverage(text, prompt.keyPoints);
    setCoverage(result);
    setChecked(result.covered.map((c) => c.matched));
    setPhase("review");
    runGrammarCheck(text.trim());
  }

  function finish() {
    const checkedCount = checked.filter(Boolean).length;
    onComplete(text.trim(), checkedCount, prompt.keyPoints.length);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-medium text-navy/70 hover:text-navy">
          ← Exit
        </button>
        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold text-navy">{prompt.level}</span>
      </div>

      <h2 className="font-serif text-2xl font-semibold text-navy-dark">{prompt.title}</h2>

      {phase === "read" && (
        <div className="mt-4 animate-fade-in">
          <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
            {prompt.dialogue.map((line, i) => {
              const isFirstSpeaker = line.speaker === prompt.characters[0];
              return (
                <div key={i} className={`flex flex-col ${isFirstSpeaker ? "items-start" : "items-end"}`}>
                  <span className="mb-1 text-xs font-semibold text-ink/40">{line.speaker}</span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      isFirstSpeaker ? "bg-navy/10 text-navy-dark" : "bg-gold/25 text-navy-dark"
                    }`}
                  >
                    <p>{line.french}</p>
                    {showTranslations && <p className="mt-1 text-xs italic text-ink/50">{line.english}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowTranslations((v) => !v)}
            className="mt-3 text-sm font-medium text-navy/70 hover:text-navy"
          >
            {showTranslations ? "Hide translations" : "Show translations"}
          </button>

          <button
            onClick={() => setPhase("write")}
            className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
          >
            Continue to the question
          </button>
        </div>
      )}

      {phase === "write" && (
        <div className="mt-4 animate-fade-in">
          <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
            <p className="font-serif text-lg font-semibold text-navy-dark">{prompt.question}</p>
            <p className="mt-1 text-sm text-ink/50 italic">{prompt.questionTranslation}</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écris ta réponse en français..."
            rows={6}
            className="mt-4 w-full rounded-2xl border border-navy/15 bg-white p-4 text-sm text-ink focus:border-navy focus:outline-none"
          />
          <div className="mt-1 flex justify-between text-xs text-ink/40">
            <span>Suggested: at least {prompt.minSentences} sentences</span>
            <span>{sentenceCount} sentence{sentenceCount === 1 ? "" : "s"}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {speechSupported ? (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  listening ? "bg-red text-cream" : "bg-navy/10 text-navy hover:bg-navy/20"
                }`}
              >
                {listening ? "⏹ Stop listening" : "🎤 Speak your answer"}
              </button>
            ) : (
              <p className="text-xs text-ink/40">
                Voice input isn't supported in this browser — try Chrome on desktop or Android.
              </p>
            )}
            {listening && <span className="text-xs font-medium text-red-dark">🔴 Listening... speak in French</span>}
          </div>
          {speechError && <p className="mt-1 text-xs text-red-dark">{speechError}</p>}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setPhase("read")}
              className="rounded-lg border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-navy/5"
            >
              Back to conversation
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="flex-1 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-cream hover:bg-navy-dark disabled:cursor-not-allowed disabled:bg-navy/30"
            >
              Submit answer
            </button>
          </div>
        </div>
      )}

      {phase === "review" && (
        <div className="mt-4 animate-fade-in flex flex-col gap-4">
          {coverage && (
            <div className="rounded-2xl bg-navy px-5 py-4 text-cream">
              <p className="text-xs font-semibold uppercase tracking-wide text-cream/60">Estimated accuracy</p>
              <p className="mt-1 font-serif text-3xl font-semibold">{coverage.percentage}%</p>
              <p className="mt-1 text-xs text-cream/60">
                Automatic estimate of how many key ideas your answer mentions, based on keyword matching — not a
                grammar or pronunciation grade. Use the self-check below to look closer.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Your answer</p>
              {grammarStatus === "loading" && <span className="text-xs text-ink/40">Checking your French...</span>}
              {grammarStatus === "done" && (
                <span className="text-xs font-medium text-ink/50">
                  {grammarMatches.length === 0
                    ? "No issues found 🎉"
                    : `${grammarMatches.length} issue${grammarMatches.length === 1 ? "" : "s"} found — tap a highlight`}
                </span>
              )}
              {grammarStatus === "error" && (
                <button
                  onClick={() => runGrammarCheck(text.trim())}
                  className="text-xs font-semibold text-navy hover:underline"
                >
                  Retry grammar check
                </button>
              )}
            </div>

            {grammarStatus === "done" && grammarMatches.length > 0 ? (
              <div className="mt-2">
                <GrammarFeedback text={text} matches={grammarMatches} />
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{text}</p>
            )}
            {grammarStatus === "error" && <p className="mt-1 text-xs text-red-dark">{grammarError}</p>}
          </div>

          <div className="rounded-2xl border border-navy/10 bg-navy/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Model answer</p>
            <p className="mt-2 text-sm text-navy-dark">{prompt.modelAnswer}</p>
            <p className="mt-1 text-xs italic text-ink/50">{prompt.modelAnswerTranslation}</p>
          </div>

          <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              Self-check — did your answer cover these points?
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {prompt.keyPoints.map((point, i) => (
                <label key={i} className="flex cursor-pointer items-start gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggleCheck(i)}
                    className="mt-0.5 h-4 w-4 accent-navy"
                  />
                  <span>{point}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={finish}
            className="w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
          >
            Save & finish
          </button>
        </div>
      )}
    </div>
  );
}
