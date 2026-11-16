import { useMemo, useState } from "react";
import { dueCards, removeFromVocab, reviewVocab, useStore, type VocabCard } from "../store";
import { normalize, stripAccents } from "../speech";
import { Button, Card, EmptyNote, ProgressBar, RatingButtons, SpeakButton, cx } from "./ui";
import { FlashCard } from "./KnowIt";

function when(due: number): string {
  const d = due - Date.now();
  if (d <= 0) return "due now";
  const h = d / 3_600_000;
  if (h < 1) return `in ${Math.max(1, Math.round(d / 60_000))} min`;
  if (h < 24) return `in ${Math.round(h)} h`;
  return `in ${Math.round(h / 24)} d`;
}

function Review({ cards, onDone }: { cards: VocabCard[]; onDone: () => void }) {
  // Snapshot the queue so cards don't jump around while rating.
  const [queue] = useState(cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dir, setDir] = useState<"en-fr" | "fr-en">("en-fr");
  const card = queue[i];

  if (!card) {
    return (
      <Card className="p-8 text-center">
        <p className="text-4xl">✨</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Review finished</h2>
        <p className="text-ink-soft">You reviewed {queue.length} card{queue.length === 1 ? "" : "s"}. They'll come back when it's time.</p>
        <Button className="mt-4" onClick={onDone}>Back to My Vocab</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onDone}>← Stop review</Button>
        <div className="inline-flex rounded-xl border border-line bg-card p-1 text-sm">
          {(["en-fr", "fr-en"] as const).map((d) => (
            <button key={d} onClick={() => { setDir(d); setFlipped(false); }} className={cx("rounded-lg px-3 py-1", dir === d ? "bg-bleu text-white dark:text-paper" : "text-ink-soft")}>
              {d === "en-fr" ? "EN → FR" : "FR → EN"}
            </button>
          ))}
        </div>
      </div>
      <ProgressBar value={i / queue.length} />
      <p className="text-center text-sm text-ink-soft">
        {i + 1} of {queue.length}
      </p>
      <FlashCard key={card.fr + dir} phrase={card} direction={dir} flipped={flipped} onFlip={() => setFlipped(!flipped)} />
      <fieldset disabled={!flipped} className={cx("transition", !flipped && "opacity-50")}>
        <RatingButtons
          onRate={(r) => {
            reviewVocab(card.fr, r);
            setFlipped(false);
            setI(i + 1);
          }}
        />
      </fieldset>
    </div>
  );
}

export default function Vocab() {
  const vocab = useStore((s) => s.vocab);
  const state = useStore((s) => s);
  const due = dueCards(state);
  const [reviewing, setReviewing] = useState<VocabCard[] | null>(null);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"recent" | "due" | "az">("recent");

  const list = useMemo(() => {
    const needle = stripAccents(normalize(q));
    const all = Object.values(vocab).filter((c) => !needle || stripAccents(normalize(`${c.fr} ${c.en}`)).includes(needle));
    if (sort === "recent") all.sort((a, b) => b.added - a.added);
    if (sort === "due") all.sort((a, b) => a.due - b.due);
    if (sort === "az") all.sort((a, b) => a.fr.localeCompare(b.fr, "fr"));
    return all;
  }, [vocab, q, sort]);

  if (reviewing) return <Review cards={reviewing} onDone={() => setReviewing(null)} />;

  const total = Object.keys(vocab).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">My Vocab</h1>
        <p className="text-ink-soft">Words and phrases you've saved. Review them with spaced repetition so they stick.</p>
      </div>

      <Card className="flex flex-wrap items-center gap-4 p-5">
        <div className="flex-1">
          <p className="text-3xl font-bold">{due.length}</p>
          <p className="text-sm text-ink-soft">card{due.length === 1 ? "" : "s"} due for review · {total} saved</p>
        </div>
        <Button disabled={!due.length} onClick={() => setReviewing(due)}>Review due cards</Button>
        <Button variant="secondary" disabled={!total} onClick={() => setReviewing(Object.values(vocab).sort(() => Math.random() - 0.5).slice(0, 20))}>
          Practise any 20
        </Button>
      </Card>

      {total === 0 ? (
        <EmptyNote>
          Nothing saved yet. Tap the bookmark icon next to any phrase in a lesson to add it here — and cards you mark “Hard” in Know It are added automatically.
        </EmptyNote>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search French or English…"
              className="min-w-0 flex-1 rounded-xl border border-line bg-card px-4 py-2.5 outline-none focus:border-bleu"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-xl border border-line bg-card px-3 py-2.5 text-sm">
              <option value="recent">Recently added</option>
              <option value="due">Next review</option>
              <option value="az">A → Z</option>
            </select>
          </div>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
            {list.map((c) => (
              <li key={c.fr} className="flex items-center gap-3 px-4 py-3">
                <SpeakButton text={c.fr} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.fr}</p>
                  <p className="text-sm text-ink-soft">{c.en}</p>
                </div>
                <div className="hidden text-right text-xs text-ink-soft sm:block">
                  {c.lessonId && <a href={`#/lesson/${c.lessonId}`} className="block hover:text-bleu">Lesson {c.lessonId}</a>}
                  <span className={cx(c.due <= Date.now() && "font-semibold text-rouge")}>{when(c.due)}</span>
                </div>
                <button onClick={() => removeFromVocab(c.fr)} className="rounded-lg p-1.5 text-ink-soft hover:bg-rouge-soft hover:text-rouge" aria-label={`Remove ${c.fr}`}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
