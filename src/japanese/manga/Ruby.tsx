import { Fragment, type ReactNode } from "react";

const RUBY = /\{([^|{}]+)\|([^{}]+)\}/g;

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const tapClass =
  "cursor-pointer rounded-sm underline decoration-ai/40 decoration-dotted decoration-2 underline-offset-4 hover:bg-ai/10 focus-visible:bg-ai/10 focus-visible:outline-none";

/**
 * Renders "{漢字|かんじ}" markup as furigana (or as plain kanji when hidden).
 * With `onWord`, every marked word, and any of `extraWords` found in the
 * plain text, becomes tappable.
 */
export function Ruby({
  text,
  show,
  onWord,
  extraWords = [],
}: {
  text: string;
  show: boolean;
  onWord?: (word: string, reading: string) => void;
  extraWords?: string[];
}) {
  const extra = onWord
    ? extraWords.filter((w) => w.length >= 2).sort((a, b) => b.length - a.length).map(escapeRegExp)
    : [];
  const extraRe = extra.length ? new RegExp(`(${extra.join("|")})`, "g") : null;

  /** Plain text, with list words made tappable. */
  const plain = (s: string, key: number): ReactNode => {
    if (!extraRe || !onWord) return <Fragment key={key}>{s}</Fragment>;
    return (
      <Fragment key={key}>
        {s.split(extraRe).map((part, i) =>
          i % 2 === 1 ? (
            <span
              key={i}
              role="button"
              tabIndex={0}
              className={tapClass}
              onClick={() => onWord(part, "")}
              onKeyDown={(e) => e.key === "Enter" && onWord(part, "")}
            >
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </Fragment>
    );
  };

  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(RUBY)) {
    const at = m.index!;
    if (at > last) parts.push(plain(text.slice(last, at), last));
    const [, kanji, reading] = m;
    const inner = show ? (
      <ruby>
        {kanji}
        <rt className="text-[0.55em] font-normal text-sumi-soft">{reading}</rt>
      </ruby>
    ) : (
      kanji
    );
    parts.push(
      onWord ? (
        <span
          key={at}
          role="button"
          tabIndex={0}
          className={tapClass}
          onClick={() => onWord(kanji, reading)}
          onKeyDown={(e) => e.key === "Enter" && onWord(kanji, reading)}
        >
          {inner}
        </span>
      ) : (
        <Fragment key={at}>{inner}</Fragment>
      ),
    );
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(plain(text.slice(last), last));
  return <>{parts}</>;
}

export function stripRuby(text: string) {
  return text.replace(RUBY, "$1");
}
