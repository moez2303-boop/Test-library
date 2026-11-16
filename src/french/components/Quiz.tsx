import { useMemo, useState } from "react";
import { LESSONS, type Lesson, type Phrase } from "../content";
import { normalize } from "../speech";
import { recordQuiz, useStore } from "../store";
import { Button, Card, ProgressBar, SpeakButton, cx, say, shuffle } from "./ui";

type Question =
  | { kind: "fr-en" | "en-fr" | "listen"; phrase: Phrase; options: string[]; answer: string }
  | { kind: "gap"; phrase: Phrase; before: string; after: string; options: string[]; answer: string }
  | { kind: "order"; phrase: Phrase; tiles: string[]; answer: string };

const words = (s: string) => s.split(/\s+/).filter(Boolean);

function distractors(lesson: Lesson, phrase: Phrase, field: "fr" | "en", n = 3): string[] {
  const own = lesson.phrases.filter((p) => p !== phrase).map((p) => p[field]);
  const others = shuffle(LESSONS.filter((l) => l.level === lesson.level && l.id !== lesson.id).flatMap((l) => l.phrases.map((p) => p[field])));
  const pool = [...shuffle(own), ...others];
  const out: string[] = [];
  for (const c of pool) {
    if (c !== phrase[field] && !out.includes(c)) out.push(c);
    if (out.length >= n) break;
  }
  return out;
}

function buildQuiz(lesson: Lesson): Question[] {
  const phrases = shuffle(lesson.phrases).slice(0, 10);
  const kinds = ["fr-en", "en-fr", "listen", "gap", "order"] as const;
  const allWords = [...new Set(lesson.phrases.flatMap((p) => words(p.fr)).filter((w) => w.length > 2))];
  return phrases.map((phrase, idx) => {
    const ws = words(phrase.fr);
    let kind: (typeof kinds)[number] = kinds[idx % kinds.length];
    if ((kind === "gap" || kind === "order") && ws.length < 3) kind = "listen";
    if (kind === "order" && ws.length > 8) kind = "gap";
    if (kind === "gap") {
      const candidates = ws.map((w, k) => ({ w, k })).filter(({ w }) => w.replace(/[^\p{L}]/gu, "").length > 2);
      const pick = candidates[Math.floor(Math.random() * candidates.length)] ?? { w: ws[0], k: 0 };
      const clean = pick.w.replace(/[.,!?…]+$/, "");
      const trail = pick.w.slice(clean.length);
      const wrong = shuffle([...new Set(allWords.map((w) => w.replace(/[.,!?…]+$/, "")))].filter((w) => normalize(w) !== normalize(clean))).slice(0, 3);
      return {
        kind,
        phrase,
        before: ws.slice(0, pick.k).join(" "),
        after: trail + (pick.k < ws.length - 1 ? " " + ws.slice(pick.k + 1).join(" ") : ""),
        options: shuffle([clean, ...wrong]),
        answer: clean,
      };
    }
    if (kind === "order") {
      return { kind, phrase, tiles: shuffle(ws), answer: phrase.fr };
    }
    const field = kind === "fr-en" ? "en" : "fr";
    return { kind, phrase, options: shuffle([phrase[field], ...distractors(lesson, phrase, field)]), answer: phrase[field] };
  });
}

function Prompt({ q }: { q: Question }) {
  switch (q.kind) {
    case "fr-en":
      return (
        <>
          <p className="text-sm text-ink-soft">What does this mean?</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="font-display text-2xl font-semibold">{q.phrase.fr}</p>
            <SpeakButton text={q.phrase.fr} size="sm" />
          </div>
        </>
      );
    case "en-fr":
      return (
        <>
          <p className="text-sm text-ink-soft">How do you say this in French?</p>
          <p className="mt-2 font-display text-2xl font-semibold">{q.phrase.en}</p>
        </>
      );
    case "listen":
      return (
        <>
          <p className="text-sm text-ink-soft">Listen and choose what you hear.</p>
          <div className="mt-3 flex gap-3">
            <SpeakButton text={q.phrase.fr} size="lg" />
            <SpeakButton text={q.phrase.fr} size="lg" slow />
          </div>
        </>
      );
    case "gap":
      return (
        <>
          <p className="text-sm text-ink-soft">Fill in the missing word. ({q.phrase.en})</p>
          <p className="mt-2 font-display text-2xl font-semibold">
            {q.before} <span className="inline-block min-w-16 border-b-2 border-bleu text-center text-bleu">?</span>
            {q.after}
          </p>
        </>
      );
    case "order":
      return (
        <>
          <p className="text-sm text-ink-soft">Put the words in order.</p>
          <p className="mt-2 font-display text-2xl font-semibold">{q.phrase.en}</p>
        </>
      );
  }
}

function OrderAnswer({ q, onAnswer, locked }: { q: Extract<Question, { kind: "order" }>; onAnswer: (a: string) => void; locked: boolean }) {
  const [picked, setPicked] = useState<number[]>([]);
  const built = picked.map((k) => q.tiles[k]).join(" ");
  return (
    <div className="space-y-3">
      <div className="flex min-h-14 flex-wrap gap-2 rounded-xl border-2 border-dashed border-line p-2">
        {picked.map((k, pos) => (
          <button key={k} disabled={locked} onClick={() => setPicked(picked.filter((_, p) => p !== pos))} className="rounded-lg bg-bleu px-3 py-1.5 font-medium text-white dark:text-paper">
            {q.tiles[k]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {q.tiles.map((t, k) =>
          picked.includes(k) ? (
            <span key={k} className="rounded-lg border border-line px-3 py-1.5 opacity-0">{t}</span>
          ) : (
            <button key={k} disabled={locked} onClick={() => setPicked([...picked, k])} className="rounded-lg border border-line bg-card px-3 py-1.5 font-medium hover:bg-paper-2">
              {t}
            </button>
          ),
        )}
      </div>
      {!locked && (
        <Button disabled={picked.length !== q.tiles.length} onClick={() => onAnswer(built)}>
          Check
        </Button>
      )}
    </div>
  );
}

export default function Quiz({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const best = useStore((s) => s.progress[lesson.id]?.quiz);
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuiz(lesson), [lesson, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const [n, setN] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const q = questions[n];
  const finished = n >= questions.length;

  const isRight = (a: string) => normalize(a) === normalize(q.answer);

  const answer = (a: string) => {
    if (chosen !== null) return;
    setChosen(a);
    const ok = isRight(a);
    setAnswers([...answers, ok]);
    if (q.kind !== "fr-en") void say(q.phrase.fr);
  };

  const next = () => {
    setChosen(null);
    if (n + 1 >= questions.length) {
      const correct = answers.filter(Boolean).length;
      recordQuiz(lesson.id, correct / questions.length, correct);
    }
    setN(n + 1);
  };

  const restart = () => {
    setSeed(seed + 1);
    setN(0);
    setChosen(null);
    setAnswers([]);
  };

  if (finished) {
    const correct = answers.filter(Boolean).length;
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <Card className="p-8 text-center">
        <p className="text-5xl">{pct === 100 ? "🏆" : pct >= 70 ? "🎉" : "💪"}</p>
        <h2 className="mt-3 font-display text-3xl font-bold">
          {correct} / {questions.length}
        </h2>
        <p className="text-ink-soft">
          {pct === 100 ? "Sans faute ! Perfect score." : pct >= 70 ? "Très bien !" : "Keep practising — you'll get there."} +{correct * 2} points
        </p>
        <p className="mt-1 text-sm text-ink-soft">Best score: {Math.round(Math.max(best ?? 0, correct / questions.length) * 100)}%</p>
        <ul className="mx-auto mt-6 max-w-md space-y-1 text-left text-sm">
          {questions.map((qq, k) => (
            <li key={k} className="flex items-start gap-2">
              <span>{answers[k] ? "✅" : "❌"}</span>
              <span>
                <strong>{qq.phrase.fr}</strong> — <span className="text-ink-soft">{qq.phrase.en}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="secondary" onClick={restart}>Retake quiz</Button>
          <Button onClick={onNext}>Continue →</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-soft">
          Question {n + 1} of {questions.length}
        </span>
        {best !== undefined && <span className="text-ink-soft">Best: {Math.round(best * 100)}%</span>}
      </div>
      <ProgressBar value={n / questions.length} />
      <Card className="p-6">
        <Prompt q={q} />
        <div className="mt-6">
          {q.kind === "order" ? (
            <OrderAnswer key={n} q={q} onAnswer={answer} locked={chosen !== null} />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o) => {
                const state = chosen === null ? "idle" : isRight(o) ? "right" : chosen === o ? "wrong" : "dim";
                return (
                  <button
                    key={o}
                    onClick={() => answer(o)}
                    disabled={chosen !== null}
                    className={cx(
                      "rounded-xl border-2 px-4 py-3 text-left font-medium transition",
                      state === "idle" && "border-line bg-card hover:border-bleu",
                      state === "right" && "border-vert bg-vert-soft text-vert",
                      state === "wrong" && "border-rouge bg-rouge-soft text-rouge",
                      state === "dim" && "border-line opacity-50",
                    )}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {chosen !== null && (
          <div className={cx("mt-5 rounded-xl px-4 py-3", isRight(chosen) ? "bg-vert-soft text-vert" : "bg-rouge-soft text-rouge")} role="status">
            <p className="font-semibold">{isRight(chosen) ? "Correct !" : "Pas tout à fait…"}</p>
            <p className="text-sm">
              {q.phrase.fr} — {q.phrase.en}
            </p>
          </div>
        )}
        {chosen !== null && (
          <div className="mt-4 flex justify-end">
            <Button onClick={next}>{n + 1 >= questions.length ? "See results" : "Next question →"}</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
