import { commonLabel } from "../labels";
import { href } from "../router";
import type { Hit } from "../search";
import { useSettings } from "../settings";
import { toRomaji } from "../text";
import type { Word } from "../types";
import { headword, mainReading, shortMeaning } from "../wordUtil";
import { Badge } from "./ui";

export function ResultRow({ word, hit }: { word: Word; hit?: Hit }) {
  const { showRomaji } = useSettings();
  const head = headword(word);
  const reading = mainReading(word);
  const meaning = shortMeaning(word);
  const common = commonLabel(word.c);
  return (
    <a href={href({ name: "word", id: word.i })} className="block px-4 py-3 hover:bg-ai-soft/50 active:bg-ai-soft">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="jp text-xl font-semibold">{head}</span>
        {reading !== head && <span className="jp text-sm text-ink-soft">{reading}</span>}
        {showRomaji && <span className="text-xs text-ink-soft">{toRomaji(reading)}</span>}
        {common && <Badge tone="matcha">{common}</Badge>}
      </div>
      {hit?.how === "conjugated" && hit.reasons?.length ? (
        <p className="mt-0.5 text-xs text-ai">{hit.reasons.join(" › ")}</p>
      ) : null}
      <p className={`mt-0.5 line-clamp-2 text-[15px] ${meaning.english ? "text-ink-soft italic" : ""}`}>
        {meaning.english && <span className="not-italic">🇬🇧 </span>}
        {meaning.text}
      </p>
    </a>
  );
}
