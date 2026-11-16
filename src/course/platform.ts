/**
 * claude.ai Artifact integration. In the Artifact build the page cannot open the
 * microphone, download files or route on `#/paths`, so it uses the viewer's
 * capabilities instead: Claude's voice (tts), dictation, downloads, and a
 * private per-user db document that keeps progress across devices.
 * In the normal web build every capability stays undefined and nothing here runs.
 */
import { useEffect, useState } from "react";
import { getLangState, getSettings, replaceLangState, replaceSettings, subscribe } from "./store";
import { LANG_IDS } from "./languages";

/** Replaced at build time: true in the claude.ai Artifact build. */
export const IS_ARTIFACT: boolean = __ARTIFACT__;

type Unsub = () => void;

export interface TtsApi {
  speak(text: string, opts?: { voice?: string; rate?: number; language?: string }): Promise<unknown>;
  stop(): Promise<void>;
}

export interface DictationApi {
  start(opts?: { language?: string }): Promise<void>;
  stop(): Promise<void>;
  onPartial(h: (e: { text: string }) => void): Unsub;
  onFinal(h: (e: { text: string }) => void): Unsub;
  onState(h: (e: { state: string; reason?: string }) => void): Unsub;
}

export interface DownloadsApi {
  save(req: { filename: string; data: string }): Promise<{ status: string }>;
}

interface DocRef {
  get(): Promise<{ exists: boolean; data(): Record<string, unknown> | undefined }>;
  set(data: Record<string, unknown>): Promise<void>;
}
interface DbApi {
  collection(path: string): { doc(id: string): DocRef };
}
interface UserApi {
  id(): Promise<string | null>;
}

export const caps: { tts?: TtsApi | null; dictation?: DictationApi | null; downloads?: DownloadsApi | null } = {};

type Listener = () => void;
const listeners = new Set<Listener>();
export function onCapsChange(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

let started = false;

export function initPlatform() {
  if (!IS_ARTIFACT || started) return;
  started = true;
  const claude = (window as unknown as { claude?: { use(name: string): Promise<unknown> } }).claude;
  if (!claude?.use) return;
  const load = <T,>(name: string, key: keyof typeof caps) =>
    claude
      .use(name)
      .then((ns) => {
        (caps as Record<string, unknown>)[key] = (ns as T) ?? null;
        listeners.forEach((l) => l());
      })
      .catch(() => {});
  void load<TtsApi>("tts", "tts");
  void load<DictationApi>("dictation", "dictation");
  void load<DownloadsApi>("downloads", "downloads");
  void syncProgress(claude);
}

/**
 * Keep progress in the viewer's private db documents, newest copy wins:
 * one document per course ("progress" is French, kept from before Japanese existed)
 * and one for settings.
 */
async function syncProgress(claude: { use(name: string): Promise<unknown> }) {
  try {
    const [db, user] = (await Promise.all([claude.use("db"), claude.use("user")])) as [DbApi | null, UserApi | null];
    const id = await user?.id();
    if (!db || !id) return;
    const col = db.collection(`data/users/${id}`);

    const docs: { ref: DocRef; get: () => { savedAt?: number }; put: (v: unknown) => void; last: string }[] = [
      ...LANG_IDS.map((lid) => ({
        ref: col.doc(lid === "fr" ? "progress" : `progress-${lid}`),
        get: () => getLangState(lid),
        put: (v: unknown) => replaceLangState(lid, v),
        last: "",
      })),
      { ref: col.doc("settings"), get: getSettings, put: replaceSettings, last: "" },
    ];

    await Promise.all(
      docs.map(async (d) => {
        const snap = await d.ref.get();
        const remote = snap.exists ? snap.data() : undefined;
        if (typeof remote?.json !== "string") return;
        try {
          const parsed = JSON.parse(remote.json);
          if ((parsed.savedAt ?? 0) > (d.get().savedAt ?? 0)) d.put(parsed);
          d.last = remote.json;
        } catch {
          /* ignore a corrupt copy; the next save replaces it */
        }
      }),
    );

    let timer: number | undefined;
    let writing = false;
    let again = false;
    const writeAll = async () => {
      if (writing) {
        again = true;
        return;
      }
      writing = true;
      try {
        // One write at a time, and only for documents that changed.
        for (const d of docs) {
          const json = JSON.stringify(d.get());
          if (json === d.last) continue;
          try {
            await d.ref.set({ json });
            d.last = json;
          } catch {
            /* offline or not allowed: progress stays in this browser */
          }
        }
      } finally {
        writing = false;
        if (again) {
          again = false;
          void writeAll();
        }
      }
    };
    subscribe(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => void writeAll(), 2000);
    });
    // Upload progress made before signing in or on first open.
    void writeAll();
  } catch {
    /* db unavailable: progress stays in this browser */
  }
}

/** Re-render when a capability finishes loading. */
export function useCaps(): void {
  const [, setN] = useState(0);
  useEffect(() => onCapsChange(() => setN((n) => n + 1)), []);
}
