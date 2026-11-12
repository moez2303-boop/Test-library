import { useState } from "react";

/** The furigana on/off switch shared by every game. */
export function useFurigana() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem("kotoba.gameFurigana") !== "off";
    } catch {
      return true;
    }
  });
  const toggle = () =>
    setOn((v) => {
      try {
        localStorage.setItem("kotoba.gameFurigana", v ? "off" : "on");
      } catch {
        /* storage unavailable */
      }
      return !v;
    });
  return [on, toggle] as const;
}

export function FuriganaButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap ${
        on ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi-dark"
      }`}
    >
      ふりがな {on ? "ON" : "OFF"}
    </button>
  );
}

export function loadNumber(key: string): number {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

export function saveNumber(key: string, n: number) {
  try {
    localStorage.setItem(key, String(n));
  } catch {
    /* storage unavailable */
  }
}

export function GameHeader({
  jp,
  en,
  about,
  onBack,
  right,
}: {
  jp: string;
  en: string;
  about: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <>
      <button onClick={onBack} className="mb-3 text-sm text-sumi-soft hover:text-sumi">
        ← All games
      </button>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold">
            <span className="jp">{jp}</span> <span className="font-sans text-base font-semibold text-sumi-soft">{en}</span>
          </h1>
          <p className="mt-1 text-sm text-sumi-soft">{about}</p>
        </div>
        {right}
      </div>
    </>
  );
}

export const SHAKE_CSS = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(220px) rotate(25deg);opacity:0}}
@keyframes drop{0%{transform:translateY(-40px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes hit{0%,100%{transform:scale(1)}30%{transform:scale(.88) rotate(-6deg)}60%{transform:scale(1.05) rotate(4deg)}}
@media (prefers-reduced-motion: reduce){[class*="animate-["]{animation:none!important}}`;
