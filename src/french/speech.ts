import { useEffect, useState } from "react";

/* ───────── Text to speech ───────── */

const synth: SpeechSynthesis | undefined =
  typeof window !== "undefined" ? window.speechSynthesis : undefined;

export function ttsSupported(): boolean {
  return !!synth;
}

export function frenchVoices(): SpeechSynthesisVoice[] {
  if (!synth) return [];
  return synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("fr"));
}

/** French voices available on this device; updates when the browser finishes loading them. */
export function useFrenchVoices(): SpeechSynthesisVoice[] {
  const [voices, setVoices] = useState(frenchVoices);
  useEffect(() => {
    if (!synth) return;
    const update = () => setVoices(frenchVoices());
    synth.addEventListener("voiceschanged", update);
    update();
    return () => synth.removeEventListener("voiceschanged", update);
  }, []);
  return voices;
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string;
  /** Prefer a different voice than the default (used to give dialogue speakers distinct voices). */
  voiceIndex?: number;
}

let speakToken = 0;

/** Speak French text. Resolves when finished, or when interrupted by another call or stopSpeaking(). */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!synth) return Promise.resolve();
  synth.cancel();
  const token = ++speakToken;
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ""));
    u.lang = "fr-FR";
    u.rate = opts.rate ?? 0.95;
    const voices = frenchVoices();
    let voice = voices.find((v) => v.voiceURI === opts.voiceURI);
    // Speaker 0 keeps the chosen voice; other speakers rotate through the remaining French voices.
    if (opts.voiceIndex && voices.length > 1) {
      const base = voice ?? voices[0];
      const others = voices.filter((v) => v !== base);
      voice = others[(opts.voiceIndex - 1) % others.length] ?? base;
    }
    if (!voice) voice = voices.find((v) => v.lang === "fr-FR") ?? voices[0];
    if (voice) u.voice = voice;
    const done = () => resolve();
    u.onend = done;
    u.onerror = done;
    // Some browsers never fire onend; give up after a generous estimate.
    const timeout = window.setTimeout(done, 1500 + text.length * 160 / (u.rate || 1));
    u.addEventListener("end", () => clearTimeout(timeout));
    if (token === speakToken) synth.speak(u);
  });
}

export function stopSpeaking(): void {
  speakToken++;
  synth?.cancel();
}

/* ───────── Speech recognition ───────── */

interface RecognitionResultLike {
  0: { transcript: string };
  length: number;
  [i: number]: { transcript: string };
}
interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<RecognitionResultLike> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => RecognitionLike;

function recognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function recognitionSupported(): boolean {
  return typeof window !== "undefined" && !!recognitionCtor();
}

export interface Listening {
  /** Resolves with the candidate transcripts (best first). Empty if nothing was heard. */
  result: Promise<string[]>;
  stop(): void;
}

export class RecognitionError extends Error {}

/** Listen for one French utterance. */
export function listen(): Listening {
  const Ctor = recognitionCtor();
  if (!Ctor) {
    return { result: Promise.reject(new RecognitionError("unsupported")), stop() {} };
  }
  const rec = new Ctor();
  rec.lang = "fr-FR";
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  const result = new Promise<string[]>((resolve, reject) => {
    let heard: string[] = [];
    rec.onresult = (e) => {
      const r = e.results[0];
      heard = [];
      for (let i = 0; i < r.length; i++) heard.push(r[i].transcript);
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") resolve([]);
      else reject(new RecognitionError(e.error));
    };
    rec.onend = () => resolve(heard);
  });
  try {
    rec.start();
  } catch {
    /* already started */
  }
  return { result, stop: () => rec.stop() };
}

/* ───────── Comparing answers ───────── */

export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Lower-case, unify apostrophes and drop punctuation; accents are kept. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[«»"“”.,!?;:…()\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein<T>(a: T[], b: T[]): number {
  const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** Character-level similarity from 0 to 1, ignoring accents and punctuation. */
export function similarity(a: string, b: string): number {
  const x = [...stripAccents(normalize(a)).replace(/[' ]/g, "")];
  const y = [...stripAccents(normalize(b)).replace(/[' ]/g, "")];
  if (!x.length && !y.length) return 1;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

/** Best pronunciation score (0–100) across recognition alternatives. */
export function pronunciationScore(target: string, heard: string[]): number {
  if (!heard.length) return 0;
  return Math.round(Math.max(...heard.map((h) => similarity(target, h))) * 100);
}

export type WriteVerdict = "correct" | "accents" | "close" | "wrong";

/** Grade a typed answer: exact, right apart from accents, a small typo, or wrong. */
export function gradeWritten(target: string, typed: string): WriteVerdict {
  const t = normalize(target);
  const u = normalize(typed);
  if (t === u) return "correct";
  if (stripAccents(t) === stripAccents(u)) return "accents";
  if (similarity(t, u) >= 0.9) return "close";
  return "wrong";
}

/** Per-word diff of a typed answer, for highlighting. */
export function wordDiff(target: string, typed: string): { word: string; ok: boolean }[] {
  const typedWords = new Set(normalize(typed).split(" "));
  return target.split(/\s+/).map((word) => ({ word, ok: typedWords.has(normalize(word)) }));
}
