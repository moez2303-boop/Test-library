import { Fragment } from "react";

const RUBY = /\{([^|{}]+)\|([^{}]+)\}/g;

/** Renders "{漢字|かんじ}" markup as furigana (or as plain kanji when hidden). */
export function Ruby({ text, show }: { text: string; show: boolean }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(RUBY)) {
    if (m.index! > last) parts.push(text.slice(last, m.index));
    parts.push(
      show ? (
        <ruby key={m.index}>
          {m[1]}
          <rt className="text-[0.55em] font-normal text-sumi-soft">{m[2]}</rt>
        </ruby>
      ) : (
        <Fragment key={m.index}>{m[1]}</Fragment>
      ),
    );
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function stripRuby(text: string) {
  return text.replace(RUBY, "$1");
}
