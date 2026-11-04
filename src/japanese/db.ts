import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Attempt, Clip } from "./types";
import type { MangaLesson } from "./manga/types";
import { STARTER_LESSON } from "./manga/starter";
import { DEMO_CLIP } from "./sample";

interface KotobaDB extends DBSchema {
  clips: { key: string; value: Clip };
  videos: { key: string; value: Blob };
  attempts: { key: string; value: Attempt; indexes: { byClip: string } };
  manga: { key: string; value: MangaLesson };
  /** Uploaded page images, keyed "<lessonId>:<pageIndex>". */
  mangaPages: { key: string; value: Blob };
}

let dbPromise: Promise<IDBPDatabase<KotobaDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<KotobaDB>("kotoba-clips", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("clips", { keyPath: "id" });
          db.createObjectStore("videos");
          const attempts = db.createObjectStore("attempts", { keyPath: "id" });
          attempts.createIndex("byClip", "clipId");
        }
        if (oldVersion < 2) {
          db.createObjectStore("manga", { keyPath: "id" });
          db.createObjectStore("mangaPages");
        }
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

// ---------------------------------------------------------------------------
// Manga lessons
// ---------------------------------------------------------------------------

const MANGA_SEEDED_KEY = "kotoba.mangaSeeded";

export async function getAllMangaLessons(): Promise<MangaLesson[]> {
  const db = await getDB();
  let seeded = false;
  try {
    seeded = localStorage.getItem(MANGA_SEEDED_KEY) === STARTER_LESSON.id;
  } catch {
    /* storage unavailable */
  }
  // Add the ready-made chapter once, unless it's already there (or was deleted after seeding).
  if (!seeded && !(await db.get("manga", STARTER_LESSON.id))) {
    await db.put("manga", { ...STARTER_LESSON, createdAt: Date.now() });
    try {
      localStorage.setItem(MANGA_SEEDED_KEY, STARTER_LESSON.id);
    } catch {
      /* storage unavailable */
    }
  }
  return (await db.getAll("manga")).sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveMangaLesson(lesson: MangaLesson, images?: Blob[]) {
  const db = await getDB();
  const tx = db.transaction(["manga", "mangaPages"], "readwrite");
  await tx.objectStore("manga").put(lesson);
  if (images) {
    for (const [i, blob] of images.entries()) await tx.objectStore("mangaPages").put(blob, `${lesson.id}:${i}`);
  }
  await tx.done;
}

export async function getMangaPageImages(lesson: MangaLesson): Promise<(Blob | undefined)[]> {
  const db = await getDB();
  return Promise.all(Array.from({ length: lesson.pageCount }, (_, i) => db.get("mangaPages", `${lesson.id}:${i}`)));
}

export async function deleteMangaLesson(lesson: MangaLesson) {
  const db = await getDB();
  const tx = db.transaction(["manga", "mangaPages"], "readwrite");
  await tx.objectStore("manga").delete(lesson.id);
  for (let i = 0; i < lesson.pageCount; i++) await tx.objectStore("mangaPages").delete(`${lesson.id}:${i}`);
  await tx.done;
}
