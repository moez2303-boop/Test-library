import { useMemo, useState } from "react";
import { Ruby } from "../manga/Ruby";
import { FuriganaButton, GameHeader, SHAKE_CSS, loadNumber, saveNumber, useFurigana } from "./shared";
import { GRAMMAR_ITEMS, type GrammarItem } from "./grammar";
import { shuffle } from "./words";

const PLAYER_HP = 4; // wrong answers you can survive minus one
const ENEMY_HP = 8; // right answers needed to win

function HpBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums text-sumi-soft">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-washi-dark">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export function GrammarBattle({ onBack }: { onBack: () => void }) {
  const [furigana, toggleFurigana] = useFurigana();
  const [battle, setBattle] = useState(0);
  const deck = useMemo(() => shuffle(GRAMMAR_ITEMS), [battle]);
  const [i, setI] = useState(0);
  const [hp, setHp] = useState(PLAYER_HP);
  const [enemy, setEnemy] = useState(ENEMY_HP);
  const [picked, setPicked] = useState<number | null>(null);
  const [hitWho, setHitWho] = useState<"you" | "enemy" | null>(null);
  const [wins, setWins] = useState(() => loadNumber("kotoba.battleWins"));

  const item: GrammarItem = deck[i % deck.length];
  const order = useMemo(() => (Math.random() < 0.5 ? [0, 1] : [1, 0]), [i, battle]);
  const sentences = [item.right, item.wrong];
  // Show the result only after the last explanation has been read.
  const over = (hp === 0 || enemy === 0) && picked === null;

  const choose = (idx: number) => {
    if (picked !== null || hp === 0 || enemy === 0) return;
    setPicked(idx);
    if (idx === 0) {
      setEnemy((e) => {
        const n = Math.max(0, e - 1);
        if (n === 0) {
          setWins((w) => {
            saveNumber("kotoba.battleWins", w + 1);
            return w + 1;
          });
        }
        return n;
      });
      setHitWho("enemy");
    } else {
      setHp((h) => Math.max(0, h - 1));
      setHitWho("you");
    }
    window.setTimeout(() => setHitWho(null), 500);
  };

  const next = () => {
    setPicked(null);
    setI((n) => n + 1);
  };

  const restart = () => {
    setBattle((b) => b + 1);
    setI(0);
    setHp(PLAYER_HP);
    setEnemy(ENEMY_HP);
    setPicked(null);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <style>{SHAKE_CSS}</style>
      <GameHeader
        jp="文法バトル"
        en="Grammar Battle"
        about="Pick the sentence that fits the situation. Right answers hit the grammar oni; wrong ones cost you health."
        onBack={onBack}
        right={<FuriganaButton on={furigana} onToggle={toggleFurigana} />}
      />

      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 rounded-2xl bg-card p-4 ring-1 ring-sumi/5">
        <span className={`text-4xl ${hitWho === "enemy" ? "animate-[hit_0.5s]" : ""}`} aria-hidden="true">
          {enemy === 0 ? "😵" : "👹"}
        </span>
        <HpBar value={enemy} max={ENEMY_HP} color="bg-shu" label="文法オニ · Grammar oni" />
        <span className={`text-4xl ${hitWho === "you" ? "animate-[shake_0.45s]" : ""}`} aria-hidden="true">
          {hp === 0 ? "😣" : "🛡️"}
        </span>
        <HpBar value={hp} max={PLAYER_HP} color="bg-matcha" label="You" />
      </div>

      {over ? (
        <div className="mt-5 rounded-2xl bg-card p-6 text-center ring-1 ring-sumi/5">
          <p className="jp font-display text-3xl font-bold">{enemy === 0 ? "勝利！" : "敗北…"}</p>
          <p className="mt-2 text-sm text-sumi-soft">
            {enemy === 0
              ? `You defeated the grammar oni with ${hp} health left.`
              : "The oni won this time. Read the explanations and try again."}{" "}
            Battles won: {wins}
          </p>
          <button onClick={restart} className="mt-4 rounded-full bg-shu px-6 py-2.5 text-sm font-semibold text-white" autoFocus>
            New battle
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-sumi/5">
          <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">Situation</div>
          <p className="jp mt-2 text-lg leading-loose">
            <Ruby text={item.context} show={furigana} />
          </p>
          <p className="text-sm text-sumi-soft">{item.contextEn}</p>

          <div className="mt-4 text-xs font-semibold tracking-wide text-sumi-soft uppercase">Which one fits?</div>
          <div className="mt-2 grid gap-2">
            {order.map((idx) => {
              const style =
                picked === null
                  ? "border-sumi/15 hover:border-sumi/40"
                  : idx === 0
                    ? "border-matcha bg-matcha/10"
                    : idx === picked
                      ? "animate-[shake_0.45s] border-shu bg-shu/10"
                      : "border-sumi/10 opacity-50";
              return (
                <button
                  key={idx}
                  disabled={picked !== null}
                  onClick={() => choose(idx)}
                  className={`jp min-h-14 rounded-xl border-2 px-4 py-3 text-left text-lg leading-loose ${style}`}
                >
                  <Ruby text={sentences[idx]} show={furigana} />
                  {picked !== null && (
                    <span className="ml-2 font-sans text-xs font-semibold whitespace-nowrap opacity-70">
                      {item.points[idx]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className={`mt-4 rounded-xl p-4 text-sm ${picked === 0 ? "bg-matcha/10" : "bg-shu/10"}`}>
              <p className="font-semibold">{picked === 0 ? "Hit! 正解。" : "Ouch! That one doesn't fit."}</p>
              <p className="mt-1">{item.explanation}</p>
              <div className="mt-3 flex justify-end">
                <button onClick={next} className="rounded-full bg-sumi px-5 py-2 font-semibold text-washi" autoFocus>
                  {hp === 0 || enemy === 0 ? "See result →" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
