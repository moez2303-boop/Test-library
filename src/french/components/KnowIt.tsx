import { useEffect, useState } from "react";
import type { Lesson, Phrase } from "../content";
import { rateKnow, useStore, type Rating } from "../store";
const EMPTY: Record<number, Rating> = {};
import { Card, EmptyNote, ProgressBar, RatingButtons, SaveWordButton, SpeakButton, cx, say } from "./ui";

type Direction = "en-fr" | "fr-en";

/** A flip card. Front shows the prompt; back shows the answer with audio. */
export function FlashCard({
  phrase,
  direction,
  flipped,
  onFlip,
  lessonId,
}: {
  phrase: Phrase;
  direction: Direction;
  flipped: boolean;
  onFlip: () => void;
  lessonId?: string;
}) {
  const front = direction === "en-fr" ? phrase.en : phrase.fr;
  return (
    <div className="flip">
      <div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onFlip();
          }
        }}
        className={cx("flip-inner relative grid min-h-64 cursor-pointer", flipped && "flipped")}
        aria-label={flipped ? "Card back" : "Card front — tap to flip"}
      >
        <div className="flip-face col-start-1 row-start-1 flex flex-col items-center justify-center rounded-2xl border border-line bg-card p-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{direction === "en-fr" ? "Say it in French" : "What does this mean?"}</span>
          <p className="mt-4 font-display text-3xl font-semibold">{front}</p>
          {direction === "fr-en" && (
            <div className="mt-4">
              <SpeakButton text={phrase.fr} />
            </div>
          )}
          <span className="mt-6 text-xs text-ink-soft">Tap to flip</span>
        </div>
        <div className="flip-face flip-back col-start-1 row-start-1 flex flex-col items-center justify-center rounded-2xl border-2 border-bleu bg-bleu-soft p-6 text-center">
          <p className="font-display text-3xl font-semibold">{phrase.fr}</p>
          <p className="mt-2 text-ink-soft">{phrase.en}</p>
          {phrase.note && <p className="mt-1 text-sm italic text-ink-soft">{phrase.note}</p>}
          <div className="mt-4 flex gap-2">
            <SpeakButton text={phrase.fr} />
            <SpeakButton text={phrase.fr} slow />
            <SaveWordButton phrase={phrase} lessonId={lessonId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KnowIt({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const ratings = useStore((s) => s.progress[lesson.id]?.know ?? EMPTY);
  const [direction, setDirection] = useState<Direction>("en-fr");
  const firstTodo = lesson.phrases.findIndex((_, i) => !ratings[i]);
  const [i, setI] = useState(firstTodo === -1 ? 0 : firstTodo);
  const [flipped, setFlipped] = useState(false);
  const phrase = lesson.phrases[i];
  const doneCount = Object.keys(ratings).length;

  useEffect(() => setFlipped(false), [i, direction]);
  useEffect(() => {
    if (flipped && direction === "en-fr") void say(phrase.fr);
  }, [flipped, direction, phrase.fr]);

  const go = (n: number) => setI((n + lesson.phrases.length) % lesson.phrases.length);

  const rate = (r: Rating) => {
    rateKnow(lesson.id, i, r, phrase);
    const n = lesson.phrases.findIndex((_, j) => j > i && !ratings[j]);
    go(n !== -1 ? n : i + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-line bg-card p-1 text-sm">
          {(["en-fr", "fr-en"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={cx("rounded-lg px-3 py-1.5 font-medium", direction === d ? "bg-bleu text-white dark:text-paper" : "text-ink-soft")}
            >
              {d === "en-fr" ? "English → French" : "French → English"}
            </button>
          ))}
        </div>
        <span className="text-sm font-semibold">
          {doneCount}/{lesson.phrases.length}
        </span>
      </div>
      <ProgressBar value={doneCount / lesson.phrases.length} />

      <div className="flex items-center justify-between text-sm text-ink-soft">
        <button onClick={() => go(i - 1)} className="rounded-lg px-2 py-1 hover:bg-paper-2" aria-label="Previous card">← Prev</button>
        <span>
          Card {i + 1} of {lesson.phrases.length}
          {ratings[i] && " · ✓"}
        </span>
        <button onClick={() => go(i + 1)} className="rounded-lg px-2 py-1 hover:bg-paper-2" aria-label="Next card">Next →</button>
      </div>

      <FlashCard phrase={phrase} direction={direction} flipped={flipped} onFlip={() => setFlipped((f) => !f)} lessonId={lesson.id} />

      <Card className={cx("p-4 transition", !flipped && "opacity-50")}>
        <p className="mb-2 text-center text-sm font-medium">{flipped ? "How well did you know it?" : "Flip the card first"}</p>
        <fieldset disabled={!flipped}>
          <RatingButtons onRate={rate} current={ratings[i]} />
        </fieldset>
        <p className="mt-2 text-center text-xs text-ink-soft">Cards you mark Hard are added to My Vocab for spaced review.</p>
      </Card>

      {doneCount >= lesson.phrases.length && (
        <EmptyNote>
          Très bien ! Every card is rated.{" "}
          <button onClick={onNext} className="font-semibold text-bleu underline">Take the quiz</button>.
        </EmptyNote>
      )}
    </div>
  );
}
