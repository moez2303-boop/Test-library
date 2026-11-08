import { isKanjiChar } from "../text";

/**
 * Puts the reading over the kanji only, leaving okurigana bare:
 * 食べる + たべる → 食(た)べる.
 */
export function Ruby({ text, reading }: { text: string; reading?: string }) {
  if (!reading || reading === text || ![...text].some(isKanjiChar)) return <>{text}</>;
  const parts = align(text, reading);
  if (!parts) {
    return (
      <ruby>
        {text}
        <rt>{reading}</rt>
      </ruby>
    );
  }
  return (
    <>
      {parts.map((p, i) =>
        p.r ? (
          <ruby key={i}>
            {p.t}
            <rt>{p.r}</rt>
          </ruby>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </>
  );
}

const hira = (s: string) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** Splits text into kanji runs and kana runs, then matches the kana runs inside the reading. */
function align(text: string, reading: string): { t: string; r?: string }[] | null {
  const runs: { t: string; kanji: boolean }[] = [];
  for (const ch of text) {
    const k = isKanjiChar(ch);
    const last = runs[runs.length - 1];
    if (last && last.kanji === k) last.t += ch;
    else runs.push({ t: ch, kanji: k });
  }
  const pattern = runs.map((r) => (r.kanji ? "(.+?)" : `(${escape(hira(r.t))})`)).join("");
  const m = hira(reading).match(new RegExp(`^${pattern}$`));
  if (!m) return null;
  return runs.map((r, i) => (r.kanji ? { t: r.t, r: m[i + 1] } : { t: r.t }));
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
