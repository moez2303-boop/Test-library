import { useState } from "react";
import { ClueDetective } from "./ClueDetective";
import { GrammarBattle } from "./GrammarBattle";
import { VocabTower } from "./VocabTower";
import { WordMatchGame } from "./WordMatchGame";
import { loadNumber } from "./shared";
import { DETECTIVE_CASES } from "./detective";
import { GRAMMAR_ITEMS } from "./grammar";
import { WORDS } from "./words";

type GameKey = "match" | "tower" | "battle" | "detective";

const GAMES: { key: GameKey; badge: string; jp: string; en: string; about: string; stat: () => string }[] = [
  {
    key: "match",
    badge: "繋",
    jp: "言葉つなぎ",
    en: "Word match",
    about: "Link English meanings to Japanese words, six at a time.",
    stat: () => `${WORDS.length} words`,
  },
  {
    key: "tower",
    badge: "塔",
    jp: "単語タワー",
    en: "Vocabulary Tower",
    about: "Stack a block for every right answer. Miss one and a block falls.",
    stat: () => `Best: ${loadNumber("kotoba.towerBest")} blocks`,
  },
  {
    key: "battle",
    badge: "戦",
    jp: "文法バトル",
    en: "Grammar Battle",
    about: "Two near-identical sentences. Pick the one that fits, or lose health.",
    stat: () => `${GRAMMAR_ITEMS.length} grammar pairs · ${loadNumber("kotoba.battleWins")} wins`,
  },
  {
    key: "detective",
    badge: "探",
    jp: "文脈探偵",
    en: "Context Clue Detective",
    about: "Find the hidden N2 word. The decoys are close, so read for the clue.",
    stat: () => `${DETECTIVE_CASES.length} cases · best ${loadNumber("kotoba.detectiveBest")} pts`,
  },
];

export function GamesHub() {
  const [game, setGame] = useState<GameKey | null>(null);
  const back = () => {
    setGame(null);
    window.scrollTo(0, 0);
  };

  if (game === "match") return <WordMatchGame onBack={back} />;
  if (game === "tower") return <VocabTower onBack={back} />;
  if (game === "battle") return <GrammarBattle onBack={back} />;
  if (game === "detective") return <ClueDetective onBack={back} />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold">
        ゲーム <span className="font-sans text-base font-semibold text-sumi-soft">Games</span>
      </h1>
      <p className="mt-1 text-sm text-sumi-soft">Short games for N3–N2 vocabulary and grammar.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {GAMES.map((g) => (
          <button
            key={g.key}
            onClick={() => {
              setGame(g.key);
              window.scrollTo(0, 0);
            }}
            className="flex items-start gap-4 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-sumi/5 hover:ring-sumi/25"
          >
            <span className="jp grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sumi font-display text-2xl text-washi">
              {g.badge}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">
                <span className="jp">{g.jp}</span> <span className="font-normal text-sumi-soft">· {g.en}</span>
              </span>
              <span className="mt-0.5 block text-sm text-sumi-soft">{g.about}</span>
              <span className="mt-2 block text-xs font-medium text-ai">{g.stat()}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
