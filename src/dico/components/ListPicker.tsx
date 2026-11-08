import { useEffect, useState } from "react";
import { allLists, createList, listsOfWord, setInList } from "../db";
import type { WordList } from "../types";

/** A bottom sheet to put a word in one or more lists. */
export function ListPicker({ wordId, onClose }: { wordId: number; onClose: () => void }) {
  const [lists, setLists] = useState<WordList[]>([]);
  const [member, setMember] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");

  useEffect(() => {
    void (async () => {
      setLists(await allLists());
      setMember(await listsOfWord(wordId));
    })();
  }, [wordId]);

  async function toggle(id: string) {
    const next = new Set(member);
    const on = !next.has(id);
    if (on) next.add(id);
    else next.delete(id);
    setMember(next);
    await setInList(id, wordId, on);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-ink/30" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-2xl rounded-t-3xl bg-card p-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Ajouter à une liste"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ajouter à une liste</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-ai hover:bg-ai-soft">
            OK
          </button>
        </div>
        <div className="max-h-[50vh] divide-y divide-line overflow-y-auto">
          {lists.map((l) => (
            <label key={l.id} className="flex cursor-pointer items-center gap-3 py-3">
              <input type="checkbox" checked={member.has(l.id)} onChange={() => toggle(l.id)} className="h-5 w-5 accent-ai" />
              <span className="flex-1">{l.name}</span>
            </label>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const l = await createList(name.trim());
            setLists([...lists, l]);
            setName("");
            await toggle(l.id);
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nouvelle liste…"
            className="min-w-0 flex-1 rounded-xl bg-paper px-3 py-2 ring-1 ring-line outline-none focus:ring-2 focus:ring-ai"
          />
          <button className="rounded-xl bg-ai px-4 py-2 font-medium text-card">Créer</button>
        </form>
      </div>
    </div>
  );
}
