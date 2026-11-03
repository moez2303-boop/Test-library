import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Attempt, Clip } from "./types";
import { DEMO_CLIP } from "./sample";

interface KotobaDB extends DBSchema {
  clips: { key: string; value: Clip };
  videos: { key: string; value: Blob };
  attempts: { key: string; value: Attempt; indexes: { byClip: string } };
}

let dbPromise: Promise<IDBPDatabase<KotobaDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KotobaDB>("kotoba-clips", 1, {
      upgrade(db) {
        db.createObjectStore("clips", { keyPath: "id" });
        db.createObjectStore("videos");
        const attempts = db.createObjectStore("attempts", { keyPath: "id" });
        attempts.createIndex("byClip", "clipId");
      },
    });
  }
  return dbPromise;
}

const SEEDED_KEY = "kotoba.seeded";

export async function getAllClips(): Promise<Clip[]> {
  const db = await getDB();
  let clips = await db.getAll("clips");
  let seeded = false;
  try {
    seeded = localStorage.getItem(SEEDED_KEY) === "1";
  } catch {
    /* storage unavailable */
  }
  if (clips.length === 0 && !seeded) {
    await db.put("clips", DEMO_CLIP);
    try {
      localStorage.setItem(SEEDED_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    clips = [DEMO_CLIP];
  }
  return clips.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveClip(clip: Clip, video?: Blob | null) {
  const db = await getDB();
  const tx = db.transaction(["clips", "videos"], "readwrite");
  await tx.objectStore("clips").put(clip);
  if (video) await tx.objectStore("videos").put(video, clip.id);
  if (clip.source.kind !== "file") await tx.objectStore("videos").delete(clip.id);
  await tx.done;
}

export async function deleteClip(id: string) {
  const db = await getDB();
  const attempts = await db.getAllKeysFromIndex("attempts", "byClip", id);
  const tx = db.transaction(["clips", "videos", "attempts"], "readwrite");
  await tx.objectStore("clips").delete(id);
  await tx.objectStore("videos").delete(id);
  for (const key of attempts) await tx.objectStore("attempts").delete(key);
  await tx.done;
}

export async function getVideo(clipId: string): Promise<Blob | undefined> {
  const db = await getDB();
  return db.get("videos", clipId);
}

export async function addAttempt(attempt: Attempt) {
  const db = await getDB();
  await db.put("attempts", attempt);
}

export async function getAttemptsForClip(clipId: string): Promise<Attempt[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("attempts", "byClip", clipId);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getAllAttempts(): Promise<Attempt[]> {
  const db = await getDB();
  return db.getAll("attempts");
}
