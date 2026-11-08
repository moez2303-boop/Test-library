import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Card, HistoryItem, Kanji, ListItem, StoredWord, WordList } from "./types";

interface DicoDB extends DBSchema {
  words: { key: number; value: StoredWord; indexes: { jp: string; fr: string; kj: string } };
  kanji: { key: string; value: Kanji };
  meta: { key: string; value: unknown };
  lists: { key: string; value: WordList };
  items: { key: [string, number]; value: ListItem; indexes: { byList: string; byWord: number } };
  cards: { key: number; value: Card; indexes: { due: number } };
  history: { key: number; value: HistoryItem; indexes: { at: number } };
}

let dbPromise: Promise<IDBPDatabase<DicoDB>> | null = null;

export function db() {
  dbPromise ??= openDB<DicoDB>("kotoba-dico", 1, {
    upgrade(d) {
      const words = d.createObjectStore("words", { keyPath: "i" });
      words.createIndex("jp", "jp", { multiEntry: true });
      words.createIndex("fr", "fr", { multiEntry: true });
      words.createIndex("kj", "kj", { multiEntry: true });
      d.createObjectStore("kanji", { keyPath: "c" });
      d.createObjectStore("meta");
      d.createObjectStore("lists", { keyPath: "id" });
      const items = d.createObjectStore("items", { keyPath: ["listId", "wordId"] });
      items.createIndex("byList", "listId");
      items.createIndex("byWord", "wordId");
      const cards = d.createObjectStore("cards", { keyPath: "wordId" });
      cards.createIndex("due", "due");
      const history = d.createObjectStore("history", { keyPath: "wordId" });
      history.createIndex("at", "at");
    },
  });
  return dbPromise;
}

export const FAVORITES = "favoris";

export async function getWord(id: number) {
  return (await db()).get("words", id);
}

export async function getWords(ids: number[]) {
  const d = await db();
  const tx = d.transaction("words");
  const out = await Promise.all(ids.map((id) => tx.store.get(id)));
  return out.filter((w): w is StoredWord => !!w);
}

export async function getKanji(c: string) {
  return (await db()).get("kanji", c);
}

export async function getKanjiMany(cs: string[]) {
  const d = await db();
  const tx = d.transaction("kanji");
  const out = await Promise.all(cs.map((c) => tx.store.get(c)));
  return out.filter((k): k is Kanji => !!k);
}

// ---- Lists ----

export async function ensureFavorites() {
  const d = await db();
  if (!(await d.get("lists", FAVORITES))) {
    await d.put("lists", { id: FAVORITES, name: "Favoris", createdAt: 0 });
  }
}

export async function allLists() {
  await ensureFavorites();
  const lists = await (await db()).getAll("lists");
  return lists.sort((a, b) => a.createdAt - b.createdAt);
}

export async function createList(name: string) {
  const list = { id: crypto.randomUUID(), name, createdAt: Date.now() };
  await (await db()).put("lists", list);
  return list;
}

export async function renameList(id: string, name: string) {
  const d = await db();
  const list = await d.get("lists", id);
  if (list) await d.put("lists", { ...list, name });
}

export async function deleteList(id: string) {
  const d = await db();
  const tx = d.transaction(["lists", "items"], "readwrite");
  const keys = await tx.objectStore("items").index("byList").getAllKeys(id);
  await Promise.all([...keys.map((k) => tx.objectStore("items").delete(k)), tx.objectStore("lists").delete(id)]);
  await tx.done;
}

export async function listItems(listId: string) {
  const items = await (await db()).getAllFromIndex("items", "byList", listId);
  return items.sort((a, b) => b.addedAt - a.addedAt);
}

export async function listsOfWord(wordId: number) {
  const items = await (await db()).getAllFromIndex("items", "byWord", wordId);
  return new Set(items.map((i) => i.listId));
}

export async function setInList(listId: string, wordId: number, inList: boolean) {
  const d = await db();
  if (inList) await d.put("items", { listId, wordId, addedAt: Date.now() });
  else await d.delete("items", [listId, wordId]);
}

// ---- Flashcards ----

export async function getCard(wordId: number) {
  return (await db()).get("cards", wordId);
}

export async function addCard(wordId: number) {
  const d = await db();
  if (await d.get("cards", wordId)) return;
  await d.put("cards", { wordId, due: Date.now(), interval: 0, ease: 2.5, reps: 0, lapses: 0 });
}

export async function removeCard(wordId: number) {
  await (await db()).delete("cards", wordId);
}

export async function putCard(card: Card) {
  await (await db()).put("cards", card);
}

export async function dueCards(now = Date.now()) {
  return (await db()).getAllFromIndex("cards", "due", IDBKeyRange.upperBound(now));
}

export async function cardCount() {
  return (await db()).count("cards");
}

// ---- History ----

export async function addHistory(wordId: number) {
  const d = await db();
  await d.put("history", { wordId, at: Date.now() });
  const count = await d.count("history");
  if (count > 200) {
    const oldest = await d.getAllKeysFromIndex("history", "at", null, count - 200);
    await Promise.all(oldest.map((k) => d.delete("history", k)));
  }
}

export async function recentHistory(limit = 50) {
  const d = await db();
  const out: HistoryItem[] = [];
  let cursor = await d.transaction("history").store.index("at").openCursor(null, "prev");
  while (cursor && out.length < limit) {
    out.push(cursor.value);
    cursor = await cursor.continue();
  }
  return out;
}

export async function clearHistory() {
  await (await db()).clear("history");
}
