import { useEffect, useState } from "react";
import { speakJapanese } from "../util";
import { FuriganaButton, GameHeader, SHAKE_CSS, loadNumber, saveNumber, useFurigana } from "./shared";
import { WORDS, loadStats, pickRound, saveStats, shuffle, type GameWord } from "./words";

const BLOCK_COLORS = ["bg-shu", "bg-ai", "bg-matcha", "bg-kin", "bg-[#7a5ea8]", "bg-[#2e8b84]"];
const hasKanji = (s: string) => /[一-鿿]/.test(s);

interface Question {
  word: GameWord;
  options: string[];
}

/** Four English options: the answer plus decoys of the same kind (verbs with verbs). */
function makeQuestion(recent: Set<string>): Question {
  const [word] = pickRound(WORDS, loadStats(), 1, recent);
  const isVerb = word.en.startsWith("to ");
  const sameKind = WORDS.filter((w) => w.word !== word.word && w.en.startsWith("to ") === isVerb);
  const sameLevel = sameKind.filter((w) => w.level === word.level);
  const decoys = shuffle(sameLevel.length >= 3 ? sameLevel : sameKind).slice(0, 3);
  return { word, options: shuffle([word.en, ...decoys.map((d) => d.en)]) };
}

export function VocabTower({ onBack }: { onBack: () => void }) {
  const [furigana, toggleFurigana] = useFurigana();
  const [recent] = useState(() => new Set<string>());
  const [q, setQ] = useState<Question>(() => makeQuestion(recent));
  const [tower, setTower] = useState<GameWord[]>([]);
  const [falling, setFalling] = useState<GameWord | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [best, setBest] = useState(() => loadNumber("kotoba.towerBest"));
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (milestone === null) return;
    const t = window.setTimeout(() => setMilestone(null), 1600);
    return () => window.clearTimeout(t);
  }, [milestone]);

  const record = (word: string, right: boolean) => {
    const stats = loadStats();
    const s = stats[word] ?? { right: 0, wrong: 0, last: 0 };
    stats[word] = { right: s.right + (right ? 1 : 0), wrong: s.wrong + (right ? 0 : 1), last: Date.now() };
    saveStats(stats);
  };

  const answer = (option: string) => {
    if (picked) return;
    setPicked(option);
    const right = option === q.word.en;
    record(q.word.word, right);
    if (right) {
      speakJapanese(q.word.reading);
      const next = [...tower, q.word];
      setTower(next);
      if (next.length > best) {
        setBest(next.length);
        saveNumber("kotoba.towerBest", next.length);
      }
      if (next.length % 10 === 0) setMilestone(next.length);
      window.setTimeout(nextQuestion, 650);
    } else if (tower.length) {
      setFalling(tower[tower.length - 1]);
      setTower(tower.slice(0, -1));
      window.setTimeout(() => setFalling(null), 650);
    }
  };

  const nextQuestion = () => {
    recent.add(q.word.word);
    if (recent.size > 30) recent.delete(recent.values().next().value!);
    setQ(makeQuestion(recent));
    setPicked(null);
  };

  const wrong = picked !== null && picked !== q.word.en;
  const visible = tower.slice(-9);

  return (
    <div className="mx-auto max-w-3xl">
      <style>{SHAKE_CSS}</style>
      <GameHeader
        jp="単語タワー"
        en="Vocabulary Tower"
        about="Every right answer adds a block. One wrong answer and the top block falls."
        onBack={onBack}
        right={<FuriganaButton on={furigana} onToggle={toggleFurigana} />}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
        {/* Tower */}
        <div className="relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl bg-card px-6 pt-4 ring-1 ring-sumi/5 sm:h-auto sm:min-h-80">
          <div className="absolute top-3 left-4 text-sm">
            <span className="font-display text-3xl font-bold tabular-nums">{tower.length}</span>
            <span className="jp ml-1 text-sumi-soft">段</span>
          </div>
          <div className="absolute top-4 right-4 text-xs text-sumi-soft">Best {best}</div>
          {milestone !== null && (
            <div className="jp absolute inset-x-0 top-1/3 text-center font-display text-2xl font-bold text-kin">
              {milestone}段 達成！
            </div>
          )}
          {falling && (
            <div className="pointer-events-none absolute inset-x-6 bottom-[calc(var(--h)*2.25rem+1rem)]" style={{ ["--h" as string]: Math.min(tower.length, 9) }}>
              <div className={`jp mx-auto flex h-8 w-4/5 animate-[fall_0.65s_ease-in_forwards] items-center justify-center rounded-md text-sm text-white ${BLOCK_COLORS[tower.length % BLOCK_COLORS.length]}`}>
                {falling.word}
              </div>
            </div>
          )}
          <div className="flex flex-col-reverse gap-1">
            {visible.map((w, i) => {
              const n = tower.length - visible.length + i;
              return (
                <div
                  key={`${w.word}-${n}`}
                  className={`jp mx-auto flex h-8 items-center justify-center rounded-md text-sm text-white shadow-sm ${BLOCK_COLORS[n % BLOCK_COLORS.length]} ${
                    n === tower.length - 1 ? "animate-[drop_0.3s_ease-out]" : ""
                  }`}
                  style={{ width: `${80 - (n % 3) * 6}%` }}
                >
                  {w.word}
                </div>
              );
            })}
          </div>
          <div className="mt-1 -mx-6 h-4 bg-washi-dark" aria-hidden="true" />
          {tower.length === 0 && !falling && (
            <p className="absolute inset-x-0 top-1/2 text-center text-sm text-sumi-soft">Answer to lay the first block.</p>
          )}
        </div>

        {/* Question */}
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <div className="flex items-center justify-between text-xs text-sumi-soft">
            <span>What does this mean?</span>
            <span>{q.word.level}</span>
          </div>
          <p className="jp mt-3 text-center text-4xl">
            {furigana && hasKanji(q.word.word) ? (
              <ruby>
                {q.word.word}
                <rt className="text-[0.4em] text-sumi-soft">{q.word.reading}</rt>
              </ruby>
            ) : (
              q.word.word
            )}
          </p>
          <div className="mt-5 grid gap-2">
            {q.options.map((o) => {
              const isAnswer = o === q.word.en;
              const style = !picked
                ? "border-sumi/15 hover:border-sumi/40"
                : isAnswer
                  ? "border-matcha bg-matcha/10"
                  : o === picked
                    ? "animate-[shake_0.45s] border-shu bg-shu/10"
                    : "border-sumi/10 opacity-50";
              return (
                <button
                  key={o}
                  disabled={!!picked}
                  onClick={() => answer(o)}
                  className={`min-h-12 rounded-xl border-2 px-4 py-2 text-left ${style}`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          {wrong && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-shu/10 p-3 text-sm">
              <span className="flex-1">
                {tower.length || falling ? "A block fell! " : ""}
                <span className="jp font-semibold">{q.word.word}</span>（{q.word.reading}） = {q.word.en}
              </span>
              <button onClick={nextQuestion} className="rounded-full bg-sumi px-4 py-2 font-semibold text-washi" autoFocus>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
