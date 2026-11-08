import { useEffect, useState } from "react";
import { cardCount, dueCards, getWord, putCard } from "../db";
import { POS_FR } from "../labels";
import { canSpeak, speak } from "../speech";
import { nextLabel, schedule, type Grade } from "../srs";
import type { Card as SrsCard, StoredWord } from "../types";
import { headword, mainReading } from "../wordUtil";
import { Ruby } from "./Ruby";
import { Card, TopBar } from "./ui";

export function ReviewView() {
  const [queue, setQueue] = useState<SrsCard[] | null>(null);
  const [total, setTotal] = useState(0);
  const [word, setWord] = useState<StoredWord | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    void (async () => {
      setTotal(await cardCount());
      const due = await dueCards();
      setQueue(due.sort(() => Math.random() - 0.5));
    })();
  }, []);

  const card = queue?.[0];
  useEffect(() => {
    if (card) void getWord(card.wordId).then((w) => setWord(w ?? null));
  }, [card]);

  async function grade(g: Grade) {
    if (!card || !queue) return;
    const next = schedule(card, g);
    await putCard(next);
    setRevealed(false);
    setDone(done + 1);
    // A card graded "à revoir" comes back in this session.
    setQueue(g === 0 ? [...queue.slice(1), next] : queue.slice(1));
  }

  if (!queue) return <TopBar title="Réviser" />;

  if (!card) {
    return (
      <div>
        <TopBar title="Réviser" />
        <Card className="mt-6 p-6 text-center">
          <p className="text-4xl">{done ? "🎉" : "📚"}</p>
          <p className="mt-2 text-lg font-semibold">
            {done ? `Séance terminée : ${done} carte${done > 1 ? "s" : ""}.` : "Rien à réviser pour l’instant."}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {total
              ? `${total} mot${total > 1 ? "s" : ""} dans vos révisions.`
              : "Ajoutez des mots avec le bouton ⟳ sur leur fiche, ou « Réviser cette liste » dans une liste."}
          </p>
        </Card>
      </div>
    );
  }

  const head = word ? headword(word) : "";
  const reading = word ? mainReading(word) : "";
  const senses = word?.s.filter((s) => s.f?.length).slice(0, 4) ?? word?.s.slice(0, 4) ?? [];

  return (
    <div>
      <TopBar title={`Réviser · ${queue.length} restante${queue.length > 1 ? "s" : ""}`} />
      <Card className="mt-2 flex min-h-[320px] flex-col items-center justify-center p-6 text-center">
        {word && (
          <>
            <p className="jp text-5xl leading-[1.7] font-bold">
              {revealed ? <Ruby text={head} reading={head !== reading ? reading : undefined} /> : head}
            </p>
            {revealed && (
              <div className="mt-4 w-full space-y-2 text-left">
                {senses.map((s, i) => (
                  <p key={i} className="text-[16px]">
                    <span className="mr-2 text-xs text-ai">{s.p.slice(0, 1).map((p) => POS_FR[p] ?? p)}</span>
                    {(s.f?.length ? s.f : s.e ?? []).join(" ; ")}
                  </p>
                ))}
                <div className="flex justify-center gap-3 pt-2 text-sm">
                  {canSpeak() && (
                    <button className="text-ai" onClick={() => speak(reading)}>
                      🔊 Écouter
                    </button>
                  )}
                  <a className="text-ai" href={`#/mot/${word.i}`}>
                    Voir la fiche ›
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
      {revealed ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {(
            [
              [0, "À revoir", "bg-beni"],
              [1, "Difficile", "bg-kin"],
              [2, "Bien", "bg-matcha"],
              [3, "Facile", "bg-ai"],
            ] as const
          ).map(([g, label, bg]) => (
            <button key={g} onClick={() => grade(g)} className={`rounded-xl ${bg} px-1 py-2.5 text-card`}>
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-[11px] opacity-90">{nextLabel(card, g)}</span>
            </button>
          ))}
        </div>
      ) : (
        <button onClick={() => setRevealed(true)} className="mt-4 w-full rounded-xl bg-ai py-3.5 font-semibold text-card">
          Afficher la réponse
        </button>
      )}
    </div>
  );
}
