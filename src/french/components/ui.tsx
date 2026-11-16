import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { speak, stopSpeaking } from "../speech";
import { addToVocab, getState, removeFromVocab, useStore, type Rating } from "../store";
import type { Phrase } from "../content";
import { go } from "../router";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function navigate(path: string) {
  go(path);
}

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "primary",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-bleu text-white hover:brightness-110 dark:text-paper",
    secondary: "bg-card border border-line text-ink hover:bg-paper-2",
    ghost: "text-ink-soft hover:bg-paper-2 hover:text-ink",
    danger: "bg-rouge text-white hover:brightness-110",
  };
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("rounded-2xl border border-line bg-card", className)}>{children}</div>;
}

/** Shared "now speaking" id so only one speaker icon animates at a time. */
let playingId: string | null = null;
const playListeners = new Set<() => void>();
function setPlaying(id: string | null) {
  playingId = id;
  playListeners.forEach((l) => l());
}
export function usePlaying(id: string) {
  const [on, setOn] = useState(playingId === id);
  useEffect(() => {
    const l = () => setOn(playingId === id);
    playListeners.add(l);
    return () => {
      playListeners.delete(l);
    };
  }, [id]);
  return on;
}

/** Speak using the learner's speed and voice settings. */
export async function say(text: string, opts: { slow?: boolean; id?: string; voiceIndex?: number } = {}) {
  const { rate, voiceURI } = getState().settings;
  const id = opts.id ?? text;
  setPlaying(id);
  await speak(text, { rate: opts.slow ? Math.max(0.5, rate * 0.6) : rate, voiceURI, voiceIndex: opts.voiceIndex });
  if (playingId === id) setPlaying(null);
}

export function stopSay() {
  stopSpeaking();
  setPlaying(null);
}

export function SpeakerIcon({ className = "h-5 w-5", on = false }: { className?: string; on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" className={on ? "opacity-100" : "opacity-60"} />
      {on && <path d="M18.5 5.5a9 9 0 0 1 0 13" />}
    </svg>
  );
}

export function TurtleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M4 15c0-4 3.5-7 8-7s8 3 8 7H4z" />
      <path d="M20 13h1.5a1.5 1.5 0 0 0 0-3H20" />
      <path d="M6 15l-1 3M18 15l1 3M10 15v2M14 15v2" />
    </svg>
  );
}

export function MicIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

export function SpeakButton({
  text,
  slow,
  label,
  size = "md",
  className,
  voiceIndex,
}: {
  text: string;
  slow?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  voiceIndex?: number;
}) {
  const id = `${slow ? "slow:" : ""}${text}`;
  const on = usePlaying(id);
  const dims = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" }[size];
  const icon = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" }[size];
  return (
    <button
      type="button"
      aria-label={label ?? (slow ? `Play slowly: ${text}` : `Play: ${text}`)}
      title={slow ? "Play slowly" : "Play"}
      onClick={(e) => {
        e.stopPropagation();
        if (on) stopSay();
        else void say(text, { slow, id, voiceIndex });
      }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full transition",
        on ? "bg-bleu text-white dark:text-paper" : "bg-bleu-soft text-bleu hover:brightness-95",
        dims,
        className,
      )}
    >
      {slow ? <TurtleIcon className={icon} /> : <SpeakerIcon className={icon} on={on} />}
    </button>
  );
}

export function SaveWordButton({ phrase, lessonId }: { phrase: Phrase; lessonId?: string }) {
  const saved = useStore((s) => !!s.vocab[phrase.fr]);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (saved) removeFromVocab(phrase.fr);
        else addToVocab(phrase, lessonId);
      }}
      aria-label={saved ? "Remove from My Vocab" : "Save to My Vocab"}
      title={saved ? "Saved in My Vocab" : "Save to My Vocab"}
      className={cx(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
        saved ? "text-or" : "text-ink-soft hover:text-or",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" aria-hidden>
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  );
}

export function ProgressRing({ value, size = 44, stroke = 5, label }: { value: number; size?: number; stroke?: number; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-paper-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={pct >= 0.999 ? "var(--color-vert)" : "var(--color-bleu)"}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-ink">{label ?? `${Math.round(pct * 100)}%`}</span>
    </div>
  );
}

export function ProgressBar({ value, className, color = "bg-bleu" }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cx("h-2 overflow-hidden rounded-full bg-paper-2", className)}>
      <div className={cx("h-full rounded-full transition-[width] duration-500", color)} style={{ width: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` }} />
    </div>
  );
}

export function RatingButtons({ onRate, current }: { onRate: (r: Rating) => void; current?: Rating }) {
  const opts: { r: Rating; label: string; cls: string }[] = [
    { r: 1, label: "Hard", cls: "border-rouge text-rouge hover:bg-rouge-soft" },
    { r: 2, label: "Good", cls: "border-or text-or hover:bg-or-soft" },
    { r: 3, label: "Easy", cls: "border-vert text-vert hover:bg-vert-soft" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {opts.map((o) => (
        <button
          key={o.r}
          type="button"
          onClick={() => onRate(o.r)}
          className={cx(
            "rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition",
            o.cls,
            current === o.r && "ring-2 ring-offset-2 ring-offset-card ring-current",
          )}
        >
          {o.label}
          <span className="ml-1 text-xs opacity-70">+{o.r}</span>
        </button>
      ))}
    </div>
  );
}

const ACCENTS = ["à", "â", "ç", "é", "è", "ê", "ë", "î", "ï", "ô", "ù", "û", "œ", "«", "»"];

export function AccentKeys({ onInsert }: { onInsert: (ch: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ACCENTS.map((a) => (
        <button
          key={a}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(a)}
          className="h-9 min-w-9 rounded-lg border border-line bg-card px-2 text-base hover:bg-paper-2"
        >
          {a}
        </button>
      ))}
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-paper-2 px-4 py-3 text-sm text-ink-soft">{children}</p>;
}

/** Fisher–Yates shuffle, returning a new array. */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
