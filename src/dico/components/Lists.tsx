import { back } from "../router";
import { useEffect, useState } from "react";
import { addCard, allLists, createList, deleteList, FAVORITES, getWords, listItems, renameList } from "../db";
import { go, href } from "../router";
import type { StoredWord, WordList } from "../types";
import { headword, mainReading, shortMeaning } from "../wordUtil";
import { ResultRow } from "./ResultRow";
import { Card, TopBar } from "./ui";

export function ListsView() {
  const [lists, setLists] = useState<(WordList & { count: number })[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const ls = await allLists();
    setLists(await Promise.all(ls.map(async (l) => ({ ...l, count: (await listItems(l.id)).length }))));
  }
  useEffect(() => void load(), []);

  return (
    <div>
      <TopBar title="Listes" />
      <Card className="divide-y divide-line overflow-hidden">
        {lists.map((l) => (
          <a key={l.id} href={href({ name: "list", id: l.id })} className="flex items-center gap-3 px-4 py-3.5 hover:bg-ai-soft/50">
            <span className="text-lg">{l.id === FAVORITES ? "★" : "☰"}</span>
            <span className="flex-1 font-medium">{l.name}</span>
            <span className="text-sm text-ink-soft">{l.count}</span>
            <span className="text-ink-soft">›</span>
          </a>
        ))}
      </Card>
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          await createList(name.trim());
          setName("");
          await load();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la nouvelle liste"
          className="min-w-0 flex-1 rounded-xl bg-card px-3 py-2.5 ring-1 ring-line outline-none focus:ring-2 focus:ring-ai"
        />
        <button className="rounded-xl bg-ai px-4 font-medium text-card">Créer</button>
      </form>
      <p className="mt-4 px-1 text-sm text-ink-soft">
        Ajoutez un mot depuis sa fiche avec « ☆ Ajouter ». Une liste peut être envoyée en révision ou exportée pour Anki.
      </p>
    </div>
  );
}

export function ListView({ id }: { id: string }) {
  const [list, setList] = useState<WordList | null>(null);
  const [words, setWords] = useState<StoredWord[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    void (async () => {
      const l = (await allLists()).find((x) => x.id === id) ?? null;
      setList(l);
      if (l) setWords(await getWords((await listItems(id)).map((i) => i.wordId)));
    })();
  }, [id]);

  if (!list) return <TopBar onBack={back} title="Liste" />;

  function exportCsv() {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = words.map((w) => [headword(w), mainReading(w), shortMeaning(w, 6).text].map(esc).join(","));
    const blob = new Blob([`﻿mot,lecture,sens\n${rows.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${list!.name}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <div>
      <TopBar onBack={back} title={list.name} />
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          disabled={!words.length}
          onClick={async () => {
            for (const w of words) await addCard(w.i);
            setNote(`${words.length} mots ajoutés aux révisions.`);
          }}
          className="rounded-full bg-ai px-3 py-1.5 text-sm font-medium text-card disabled:opacity-50"
        >
          ⟳ Réviser cette liste
        </button>
        <button disabled={!words.length} onClick={exportCsv} className="rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-line disabled:opacity-50">
          Exporter (CSV)
        </button>
        {id !== FAVORITES && (
          <>
            <button
              onClick={async () => {
                const n = prompt("Nouveau nom", list.name)?.trim();
                if (n) {
                  await renameList(id, n);
                  setList({ ...list, name: n });
                }
              }}
              className="rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-line"
            >
              Renommer
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Supprimer la liste « ${list.name} » ?`)) return;
                await deleteList(id);
                go({ name: "lists" }, true);
              }}
              className="rounded-full bg-card px-3 py-1.5 text-sm text-beni ring-1 ring-line"
            >
              Supprimer
            </button>
          </>
        )}
      </div>
      {note && <p className="mb-3 text-sm text-matcha">{note}</p>}
      {words.length ? (
        <Card className="divide-y divide-line overflow-hidden">
          {words.map((w) => (
            <ResultRow key={w.i} word={w} />
          ))}
        </Card>
      ) : (
        <p className="mt-8 text-center text-ink-soft">Liste vide.</p>
      )}
    </div>
  );
}
