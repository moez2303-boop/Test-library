/**
 * claude.ai Artifact integration. In the Artifact build the page cannot open the
 * microphone, download files or route on `#/paths`, so it uses the viewer's
 * capabilities instead: Claude's voice (tts), dictation, downloads, and a
 * private per-user db document that keeps progress across devices.
 * In the normal web build every capability stays undefined and nothing here runs.
 */
import { useEffect, useState } from "react";
import { getState, replaceState, subscribe } from "./store";

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

/** Keep progress in the viewer's private db document, newest copy wins. */
async function syncProgress(claude: { use(name: string): Promise<unknown> }) {
  try {
    const [db, user] = (await Promise.all([claude.use("db"), claude.use("user")])) as [DbApi | null, UserApi | null];
    const id = await user?.id();
    if (!db || !id) return;
    const ref = db.collection(`data/users/${id}`).doc("progress");

    let lastWritten = "";
    const snap = await ref.get();
    const remote = snap.exists ? snap.data() : undefined;
    if (typeof remote?.json === "string") {
      try {
        const parsed = JSON.parse(remote.json);
        if ((parsed.savedAt ?? 0) > (getState().savedAt ?? 0)) replaceState(parsed);
        lastWritten = remote.json;
      } catch {
        /* ignore a corrupt copy; the next save replaces it */
      }
    }

    let timer: number | undefined;
    let writing = false;
    let again = false;
    const write = async () => {
      if (writing) {
        again = true;
        return;
      }
      const json = JSON.stringify(getState());
      if (json === lastWritten) return;
      writing = true;
      try {
        await ref.set({ json });
        lastWritten = json;
      } catch {
        /* offline or not allowed: progress stays in this browser */
      } finally {
        writing = false;
        if (again) {
          again = false;
          void write();
        }
      }
    };
    subscribe(() => {
      clearTimeout(timer);
      timer = window.setTimeout(() => void write(), 2000);
    });
    // Upload local progress made before signing in or on first open.
    void write();
  } catch {
    /* db unavailable: progress stays in this browser */
  }
}

/** Re-render when a capability finishes loading. */
export function useCaps(): void {
  const [, setN] = useState(0);
  useEffect(() => onCapsChange(() => setN((n) => n + 1)), []);
}
