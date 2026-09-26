import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ListeningProgress, Stats, WordProgress, WritingResponse } from "./types";

interface AppDB extends DBSchema {
  progress: {
    key: string;
    value: WordProgress;
  };
  meta: {
    key: string;
    value: Stats;
  };
  listening: {
    key: string;
    value: ListeningProgress;
  };
  writing: {
    key: string;
    value: WritingResponse;
  };
}

const DB_NAME = "french-learning";
const DB_VERSION = 3;
const STATS_KEY = "stats";

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

function getDb() {
  dbPromise ??= openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("progress")) {
        db.createObjectStore("progress", { keyPath: "wordId" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
      if (!db.objectStoreNames.contains("listening")) {
        db.createObjectStore("listening", { keyPath: "clipId" });
      }
      if (!db.objectStoreNames.contains("writing")) {
        db.createObjectStore("writing", { keyPath: "promptId" });
      }
    },
  });
  return dbPromise;
}

export async function getAllProgress(): Promise<WordProgress[]> {
  const db = await getDb();
  return db.getAll("progress");
}

export async function saveProgress(progress: WordProgress): Promise<void> {
  const db = await getDb();
  await db.put("progress", progress);
}

export async function getStats(): Promise<Stats> {
  const db = await getDb();
  const stats = await db.get("meta", STATS_KEY);
  return stats ?? { streak: 0, lastActiveDay: null, totalReviews: 0 };
}

export async function saveStats(stats: Stats): Promise<void> {
  const db = await getDb();
  await db.put("meta", stats, STATS_KEY);
}

export async function getAllListeningProgress(): Promise<ListeningProgress[]> {
  const db = await getDb();
  return db.getAll("listening");
}

export async function saveListeningProgress(progress: ListeningProgress): Promise<void> {
  const db = await getDb();
  await db.put("listening", progress);
}

export async function getAllWritingResponses(): Promise<WritingResponse[]> {
  const db = await getDb();
  return db.getAll("writing");
}

export async function saveWritingResponse(response: WritingResponse): Promise<void> {
  const db = await getDb();
  await db.put("writing", response);
}

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function recordActivity(): Promise<Stats> {
  const stats = await getStats();
  const today = todayKey();
  if (stats.lastActiveDay === today) {
    const updated = { ...stats, totalReviews: stats.totalReviews + 1 };
    await saveStats(updated);
    return updated;
  }

  const yesterday = todayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const streak = stats.lastActiveDay === yesterday ? stats.streak + 1 : 1;
  const updated: Stats = { streak, lastActiveDay: today, totalReviews: stats.totalReviews + 1 };
  await saveStats(updated);
  return updated;
}
