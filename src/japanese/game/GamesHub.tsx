import { useState } from "react";
import { ClueDetective } from "./ClueDetective";
import { GrammarBattle } from "./GrammarBattle";
import { VocabTower } from "./VocabTower";
import { WordMatchGame } from "./WordMatchGame";
import { loadNumber } from "./shared";
import { DETECTIVE_CASES } from "./detective";
import { GRAMMAR_ITEMS } from "./grammar";
import { WORDS } from "./words";

type GameKey = "match" | "tower" | "battle" | "detective" | "gate";

const GATE_URL = "https://moez2303-boop.github.io/Test-library/japanese/#kanji-gate";

function GateSetup({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(GATE_URL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={onBack} className="mb-3 text-sm text-sumi-soft hover:text-sumi">
        ← All games
      </button>
      <h1 className="font-display text-2xl font-bold">
        <span className="jp">漢字ゲート</span> <span className="font-sans text-base font-semibold text-sumi-soft">Kanji gate</span>
      </h1>
      <p className="mt-1 text-sm text-sumi-soft">
        Answer one kanji reading question every time you open an app like Instagram. Your phone opens
        this page automatically; get one right, then go back to the app.
      </p>

      <div className="mt-5 rounded-2xl bg-card p-4 ring-1 ring-sumi/5">
        <div className="text-xs font-semibold tracking-wide text-sumi-soft uppercase">Gate link</div>
        <p className="mt-1 font-mono text-sm break-all select-all">{GATE_URL}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => void copy()} className="rounded-full bg-sumi px-4 py-2 text-sm font-semibold text-washi">
            {copied ? "Copied ✓" : "Copy link"}
          </button>
          <button
            onClick={() => {
              window.location.hash = "kanji-gate";
            }}
            className="rounded-full border border-sumi/15 px-4 py-2 text-sm hover:bg-washi"
          >
            Try the gate
          </button>
        </div>
      </div>

      <section className="mt-5 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">iPhone (Shortcuts app)</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
          <li>Open <b>Shortcuts</b> → <b>Automation</b> tab → <b>+</b> (New Automation).</li>
          <li>Choose <b>App</b>, pick <b>Instagram</b> (or any apps), keep <b>Is Opened</b> ticked.</li>
          <li>Choose <b>Run Immediately</b>, then <b>Next</b>.</li>
          <li>Tap <b>New Blank Automation</b>, add the action <b>Open URLs</b>, and paste the gate link.</li>
          <li>Tap <b>Done</b>. Next time you open Instagram, the kanji question appears first.</li>
        </ol>
        <p className="mt-2 text-xs text-sumi-soft">
          After answering, tap ◀ Instagram at the top-left of the screen to go back.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
        <h2 className="font-semibold">Android</h2>
        <p className="mt-2 text-sm">
          Android has no built-in "when an app opens" automation. Use an automation app such as MacroDroid or
          Tasker: trigger <b>Application launched → Instagram</b>, action <b>Open website</b> with the gate link.
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
    about: "Answer a kanji reading every time you open Instagram. Setup steps inside.",
    stat: () => "Works with iPhone Shortcuts",
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
