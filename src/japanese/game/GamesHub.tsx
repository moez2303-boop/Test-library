import { useState } from "react";
import { GATE_APPS } from "./KanjiGate";
import { ClueDetective } from "./ClueDetective";
import { GrammarBattle } from "./GrammarBattle";
import { VocabTower } from "./VocabTower";
import { WordMatchGame } from "./WordMatchGame";
import { loadNumber } from "./shared";
import { DETECTIVE_CASES } from "./detective";
import { GRAMMAR_ITEMS } from "./grammar";
import { WORDS } from "./words";

type GameKey = "match" | "tower" | "battle" | "detective" | "gate";

const GATE_BASE = "https://moez2303-boop.github.io/Test-library/japanese/";
const gateUrl = (app: string) => `${GATE_BASE}?app=${app}#kanji-gate`;

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-0 flex-1 font-mono text-xs break-all select-all">{url}</span>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
        className="shrink-0 rounded-full bg-sumi px-3 py-1.5 text-xs font-semibold text-washi"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}

function GateSetup({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={onBack} className="mb-3 text-sm text-sumi-soft hover:text-sumi">
        ← All games
      </button>
      <h1 className="font-display text-2xl font-bold">
        <span className="jp">漢字ゲート</span> <span className="font-sans text-base font-semibold text-sumi-soft">Kanji gate</span>
      </h1>
      <p className="mt-1 text-sm text-sumi-soft">
        A home-screen icon that asks one kanji reading, then opens the app for you once you get it right.
      </p>

      <section className="mt-5 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">Set it up on iPhone (1 minute per app)</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
          <li>
            If you made a Shortcuts automation for Instagram or X earlier, <b>delete it</b> (Shortcuts → Automation →
            swipe left on it). It sends you back to the gate in a loop.
          </li>
          <li>Copy the link for the app below and open it in <b>Safari</b>.</li>
          <li>
            Tap <b>Share</b> → <b>Add to Home Screen</b>, name it e.g. “Instagram 🔒”, tap <b>Add</b>.
          </li>
          <li>Move the real app off your Home Screen (long-press → Remove App → Remove from Home Screen) and use the 🔒 icon instead.</li>
        </ol>
        <p className="mt-2 text-xs text-sumi-soft">
          After a right answer the app opens by itself. The first time, Safari asks “Open in Instagram?”: tap Open.
        </p>
        <div className="mt-4 grid gap-3">
          {Object.entries(GATE_APPS).map(([key, a]) => (
            <div key={key} className="rounded-xl bg-washi p-3">
              <div className="mb-1 flex items-center justify-between text-sm font-semibold">
                <span>{a.name}</span>
                <a href={gateUrl(key)} className="text-xs font-normal text-ai underline">
                  Try it
                </a>
              </div>
              <CopyLink url={gateUrl(key)} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">Android</h2>
        <p className="mt-2 text-sm">
          Open the link in Chrome → ⋮ → <b>Add to Home screen</b>. It works the same way.
        </p>
      </section>
    </div>
  );
}

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
  {
    key: "gate",
    badge: "門",
    jp: "漢字ゲート",
    en: "Kanji gate",
    about: "A home-screen icon that asks a kanji reading before opening Instagram or X.",
    stat: () => "Setup steps inside",
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
  if (game === "gate") return <GateSetup onBack={back} />;

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
