import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../content";
import { gradeWritten, wordDiff, type WriteVerdict } from "../speech";
import { recordWrite, useStore } from "../store";
const EMPTY: Record<number, boolean> = {};
import { AccentKeys, Button, Card, EmptyNote, ProgressBar, SpeakButton, cx, say } from "./ui";

export default function WriteIt({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const results = useStore((s) => s.progress[lesson.id]?.write ?? EMPTY);
  const firstTodo = lesson.phrases.findIndex((_, i) => !results[i]);
  const [i, setI] = useState(firstTodo === -1 ? 0 : firstTodo);
  const [typed, setTyped] = useState("");
  const [verdict, setVerdict] = useState<WriteVerdict | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const phrase = lesson.phrases[i];
  const correctCount = Object.values(results).filter(Boolean).length;

  useEffect(() => {
    setTyped("");
    setVerdict(null);
    setRevealed(false);
    setHint(false);
    void say(phrase.fr);
    input.current?.focus();
  }, [phrase.fr]);

  const go = (n: number) => setI((n + lesson.phrases.length) % lesson.phrases.length);

  const check = () => {
    if (!typed.trim()) return;
    const v = gradeWritten(phrase.fr, typed);
    setVerdict(v);
    // Missing accents still counts, but we point it out.
    recordWrite(lesson.id, i, v === "correct" || v === "accents");
  };

  const nextUnfinished = () => {
    const n = lesson.phrases.findIndex((_, j) => j > i && !results[j]);
    go(n !== -1 ? n : i + 1);
  };

  const insert = (ch: string) => {
    const el = input.current;
    if (!el) return setTyped((t) => t + ch);
    const start = el.selectionStart ?? typed.length;
    const end = el.selectionEnd ?? typed.length;
    const next = typed.slice(0, start) + ch + typed.slice(end);
    setTyped(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  const ok = verdict === "correct" || verdict === "accents";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">Listen and type what you hear in French. Punctuation and capitals don't matter.</p>
        <span className="shrink-0 text-sm font-semibold">
          {correctCount}/{lesson.phrases.length}
        </span>
      </div>
      <ProgressBar value={correctCount / lesson.phrases.length} />

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <button onClick={() => go(i - 1)} className="rounded-lg px-2 py-1 text-ink-soft hover:bg-paper-2" aria-label="Previous">←</button>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Phrase {i + 1} of {lesson.phrases.length}
            {results[i] && " · ✓"}
          </span>
          <button onClick={() => go(i + 1)} className="rounded-lg px-2 py-1 text-ink-soft hover:bg-paper-2" aria-label="Next">→</button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <SpeakButton text={phrase.fr} size="lg" />
          <SpeakButton text={phrase.fr} size="lg" slow />
        </div>
        <div className="mt-3 text-center text-sm">
          {hint || revealed ? (
            <span className="text-ink-soft">{phrase.en}</span>
          ) : (
            <button onClick={() => setHint(true)} className="text-ink-soft underline decoration-dotted">Show English hint</button>
          )}
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (ok) nextUnfinished();
            else check();
          }}
        >
          <input
            ref={input}
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              if (verdict && !ok) setVerdict(null);
            }}
            lang="fr"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Tapez ici…"
            className={cx(
              "w-full rounded-xl border-2 bg-paper px-4 py-3 text-lg outline-none transition focus:border-bleu",
              verdict === null ? "border-line" : ok ? "border-vert" : "border-rouge",
            )}
          />
          <AccentKeys onInsert={insert} />
          <div className="flex flex-wrap gap-2">
            {ok ? (
              <Button type="submit">Next →</Button>
            ) : (
              <Button type="submit" disabled={!typed.trim()}>Check</Button>
            )}
            {!ok && (
              <Button type="button" variant="secondary" onClick={() => setRevealed(true)}>Show answer</Button>
            )}
          </div>
        </form>

        {verdict && (
          <div
            className={cx(
              "mt-4 rounded-xl px-4 py-3 text-sm",
              ok ? "bg-vert-soft text-vert" : verdict === "close" ? "bg-or-soft text-or" : "bg-rouge-soft text-rouge",
            )}
            role="status"
          >
            {verdict === "correct" && "Parfait ! +2 points"}
            {verdict === "accents" && <>Correct, but watch the accents: <strong>{phrase.fr}</strong> (+2 points)</>}
            {verdict === "close" && "So close — check your spelling and try again."}
            {verdict === "wrong" && "Not quite. Listen again and have another go."}
            {!ok && (
              <p className="mt-2 flex flex-wrap gap-1 text-base">
                {wordDiff(phrase.fr, typed).map((w, k) => (
                  <span key={k} className={cx("rounded px-1", w.ok ? "bg-vert-soft text-vert" : "bg-card text-ink-soft")}>
                    {w.ok ? w.word : "•".repeat(Math.min(6, w.word.length))}
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
        {revealed && !ok && (
          <p className="mt-3 rounded-xl bg-paper-2 px-4 py-3">
            <span className="text-sm text-ink-soft">Answer: </span>
            <strong>{phrase.fr}</strong>
          </p>
        )}
      </Card>

      {correctCount >= lesson.phrases.length && (
        <EmptyNote>
          Bravo ! You've written every phrase correctly.{" "}
          <button onClick={onNext} className="font-semibold text-bleu underline">On to Know It</button>.
        </EmptyNote>
      )}
    </div>
  );
}
