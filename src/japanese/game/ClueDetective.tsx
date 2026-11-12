import { useMemo, useState } from "react";
import { Ruby } from "../manga/Ruby";
import { FuriganaButton, GameHeader, loadNumber, saveNumber, useFurigana } from "./shared";
import { DETECTIVE_CASES, type DetectiveCase } from "./detective";
import { shuffle } from "./words";

const CASES_PER_FILE = 8;

function rank(score: number, max: number) {
  const r = score / max;
  if (r >= 0.9) return { jp: "名探偵", en: "Master detective" };
  if (r >= 0.65) return { jp: "探偵", en: "Detective" };
  if (r >= 0.4) return { jp: "見習い探偵", en: "Apprentice detective" };
  return { jp: "新人", en: "Rookie" };
}

/** The passage with the blank filled (once solved) and the clue highlighted (on hint or after). */
function Passage({
  c,
  showClue,
  answer,
  furigana,
}: {
  c: DetectiveCase;
  showClue: boolean;
  answer: string | null;
  furigana: boolean;
}) {
  const parts = showClue && c.passage.includes(c.clue) ? c.passage.split(c.clue) : [c.passage];
  const renderBlank = (text: string, key: string) =>
    text.split("＿＿").map((seg, i, arr) => (
      <span key={`${key}-${i}`}>
        <Ruby text={seg} show={furigana} />
        {i < arr.length - 1 &&
          (answer ? (
            <span className="mx-0.5 rounded bg-matcha/15 px-1 font-semibold text-matcha">
              <Ruby text={answer} show={furigana} />
            </span>
          ) : (
            <span className="mx-1 inline-block w-14 border-b-2 border-sumi align-baseline">&nbsp;</span>
          ))}
      </span>
    ));
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {renderBlank(part, `p${i}`)}
          {i < parts.length - 1 && (
            <mark className="rounded bg-kin/25 px-0.5 text-inherit">{renderBlank(c.clue, `c${i}`)}</mark>
          )}
        </span>
      ))}
    </>
  );
}

export function ClueDetective({ onBack }: { onBack: () => void }) {
  const [furigana, toggleFurigana] = useFurigana();
  const [file, setFile] = useState(0);
  const cases = useMemo(() => shuffle(DETECTIVE_CASES).slice(0, CASES_PER_FILE), [file]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [best, setBest] = useState(() => loadNumber("kotoba.detectiveBest"));
  const c = cases[i];
  const options = useMemo(() => (c ? shuffle(c.options) : []), [c]);
  const maxScore = CASES_PER_FILE * 2;
  const done = i >= cases.length;

  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === c.options[0]) setScore((s) => s + (hint ? 1 : 2));
  };

  const next = () => {
    setPicked(null);
    setHint(false);
    const n = i + 1;
    setI(n);
    if (n >= cases.length && score > best) {
      setBest(score);
      saveNumber("kotoba.detectiveBest", score);
    }
  };

  const restart = () => {
    setFile((f) => f + 1);
    setI(0);
    setScore(0);
    setPicked(null);
    setHint(false);
  };

  const r = rank(score, maxScore);

  return (
    <div className="mx-auto max-w-3xl">
      <GameHeader
        jp="文脈探偵"
        en="Context Clue Detective"
        about="Each passage hides one N2 word. The wrong options are close, so read for the clue. 2 points per case, 1 if you use the hint."
        onBack={onBack}
        right={<FuriganaButton on={furigana} onToggle={toggleFurigana} />}
      />

      <div className="mb-3 flex items-center gap-3 text-sm">
        <span className="font-semibold">🔎 Case {Math.min(i + 1, cases.length)} / {cases.length}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-washi-dark">
          <div className="h-full rounded-full bg-ai transition-all" style={{ width: `${(i / cases.length) * 100}%` }} />
        </div>
        <span className="tabular-nums">⭐ {score}</span>
      </div>

      {done ? (
        <div className="rounded-2xl bg-card p-6 text-center ring-1 ring-sumi/5">
          <p className="text-sm text-sumi-soft">Case file closed</p>
          <p className="jp mt-1 font-display text-3xl font-bold">{r.jp}</p>
          <p className="text-sm text-sumi-soft">{r.en}</p>
          <p className="mt-3 text-lg tabular-nums">
            {score} / {maxScore} points <span className="text-sm text-sumi-soft">· best {Math.max(best, score)}</span>
          </p>
          <button onClick={restart} className="mt-4 rounded-full bg-shu px-6 py-2.5 text-sm font-semibold text-white" autoFocus>
            Open a new case file
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <p className="jp text-lg leading-loose">
            <Passage c={c} showClue={hint || picked !== null} answer={picked ? c.options[0] : null} furigana={furigana} />
          </p>
          <p className="mt-1 text-sm text-sumi-soft">{c.passageEn}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {options.map((o) => {
              const isAnswer = o === c.options[0];
              const style = !picked
                ? "border-sumi/15 hover:border-sumi/40"
                : isAnswer
                  ? "border-matcha bg-matcha/10"
                  : o === picked
                    ? "border-shu bg-shu/10"
                    : "border-sumi/10 opacity-50";
              return (
                <button
                  key={o}
                  disabled={!!picked}
                  onClick={() => choose(o)}
                  className={`jp min-h-14 rounded-xl border-2 px-3 py-2 text-lg ${style}`}
                >
                  <Ruby text={o} show={furigana} />
                </button>
              );
            })}
          </div>

          {!picked && (
            <button
              onClick={() => setHint(true)}
              disabled={hint}
              className="mt-3 text-sm text-ai hover:underline disabled:text-sumi-soft disabled:no-underline"
            >
              {hint ? "Clue highlighted in the passage (this case is worth 1 point)" : "🔍 Show the clue (−1 point)"}
            </button>
          )}

          {picked && (
            <div className={`mt-4 rounded-xl p-4 text-sm ${picked === c.options[0] ? "bg-matcha/10" : "bg-shu/10"}`}>
              <p className="font-semibold">{picked === c.options[0] ? "Case solved! 正解。" : "Wrong suspect."}</p>
              <p className="mt-1">{c.explanation}</p>
              <div className="mt-3 flex justify-end">
                <button onClick={next} className="rounded-full bg-sumi px-5 py-2 font-semibold text-washi" autoFocus>
                  {i + 1 >= cases.length ? "Close the file →" : "Next case →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
