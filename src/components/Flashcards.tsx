import { useState } from "react";
import type { Grade, Word } from "../types";
import { speakFrench } from "../speech";

interface FlashcardsProps {
  words: Word[];
  title: string;
  onGrade: (wordId: string, grade: Grade) => void;
  onFinish: () => void;
  onExit: () => void;
}

export function Flashcards({ words, title, onGrade, onFinish, onExit }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (words.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="font-serif text-xl text-navy-dark">Nothing to review here.</p>
        <button onClick={onExit} className="mt-4 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream">
          Back
        </button>
      </div>
    );
  }

  const word = words[index];
  const isLast = index === words.length - 1;

  function grade(g: Grade) {
    onGrade(word.id, g);
    if (isLast) {
      onFinish();
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-medium text-navy/70 hover:text-navy">
          ← Exit
        </button>
        <span className="text-sm font-medium text-ink/50">
          {title} · {index + 1} / {words.length}
        </span>
      </div>

      <div
        key={word.id}
        onClick={() => setFlipped((f) => !f)}
        className="animate-flip flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-sm"
      >
        {!flipped ? (
          <>
            <p className="font-serif text-3xl font-semibold text-navy-dark">{word.french}</p>
            <p className="text-sm text-ink/40">{word.pronunciation}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakFrench(word.french);
              }}
              className="rounded-full bg-navy/5 px-3 py-1.5 text-sm text-navy hover:bg-navy/10"
              aria-label="Play pronunciation"
            >
              🔊 Listen
            </button>
            <p className="text-xs text-ink/40">Tap the card to reveal</p>
          </>
        ) : (
          <>
            <p className="font-serif text-2xl font-semibold text-navy-dark">{word.english}</p>
            <p className="text-lg text-ink/70">{word.french}</p>
            <div className="mt-2 border-t border-navy/10 pt-3 text-sm text-ink/60">
              <p className="italic">{word.example}</p>
              <p className="mt-1">{word.exampleTranslation}</p>
            </div>
          </>
        )}
      </div>

      {flipped ? (
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            onClick={() => grade("again")}
            className="rounded-lg bg-red/10 px-3 py-3 text-sm font-semibold text-red-dark hover:bg-red/20"
          >
            Again
          </button>
          <button
            onClick={() => grade("good")}
            className="rounded-lg bg-gold/20 px-3 py-3 text-sm font-semibold text-navy-dark hover:bg-gold/30"
          >
            Good
          </button>
          <button
            onClick={() => grade("easy")}
            className="rounded-lg bg-navy/10 px-3 py-3 text-sm font-semibold text-navy hover:bg-navy/20"
          >
            Easy
          </button>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="mt-5 w-full rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-cream hover:bg-navy-dark"
        >
          Show answer
        </button>
      )}
    </div>
  );
}
