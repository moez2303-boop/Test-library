import type { Attempt } from "./types";

export function uid() {
  return crypto.randomUUID();
}

/** Accepts "83", "1:23" or "0:01:23" and returns seconds (NaN if invalid). */
export function parseTime(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const parts = trimmed.split(":").map((p) => Number(p));
  if (parts.some((p) => Number.isNaN(p) || p < 0)) return NaN;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}

export function formatTime(seconds: number): string {
  if (!seconds) return "";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname.endsWith("youtu.be")) return url.pathname.slice(1, 12) || null;
    if (url.hostname.includes("youtube")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const match = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/);
      if (match) return match[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** Reads a start time from a YouTube link (?t=90 or ?t=1m30s), if present. */
export function parseYouTubeStart(input: string): number | null {
  try {
    const t = new URL(input.trim()).searchParams.get("t");
    if (!t) return null;
    if (/^\d+$/.test(t)) return Number(t);
    const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
    if (!m) return null;
    return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  } catch {
    return null;
  }
}

export function bestByQuestion(attempts: Attempt[]): Map<string, number> {
  const best = new Map<string, number>();
  for (const a of attempts) {
    best.set(a.questionId, Math.max(best.get(a.questionId) ?? 0, a.feedback.overall));
  }
  return best;
}

export function scoreColor(score100: number): string {
  if (score100 >= 80) return "text-matcha";
  if (score100 >= 55) return "text-kin";
  return "text-shu";
}

export function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.9;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("ja"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
