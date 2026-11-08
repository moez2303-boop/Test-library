import { back } from "../router";
import { useEffect, useState } from "react";
import { getKanji } from "../db";
import { gradeLabel } from "../labels";
import { wordsWithKanji } from "../search";
import type { Kanji, StoredWord } from "../types";
import { ResultRow } from "./ResultRow";
import { StrokeOrder } from "./StrokeOrder";
import { Badge, Card, Section, TopBar } from "./ui";

export function KanjiView({ c }: { c: string }) {
  const [k, setK] = useState<Kanji | null | undefined>(undefined);
  const [words, setWords] = useState<StoredWord[] | null>(null);
  const [shown, setShown] = useState(20);

  useEffect(() => {
    void (async () => {
      setK((await getKanji(c)) ?? null);
      setWords(await wordsWithKanji(c));
    })();
  }, [c]);

  if (k === undefined) return <TopBar onBack={back} />;

  return (
    <div>
      <TopBar onBack={back} title={<span className="jp">{c}</span>} />
      {k === null ? (
        <p className="mt-6 text-center text-ink-soft">Pas de fiche pour ce caractère.</p>
      ) : (
        <>
          <Card className="p-5">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              {k.t?.length ? (
                <StrokeOrder strokes={k.t} />
              ) : (
                <div className="jp grid h-[180px] w-[180px] place-items-center rounded-2xl bg-paper text-8xl ring-1 ring-line">
                  {k.c}
                </div>
              )}
              <div className="w-full min-w-0 flex-1 space-y-3">
                <p className="text-xl font-semibold">{(k.fr ?? k.en ?? []).join(", ") || "—"}</p>
                {!k.fr?.length && k.en?.length ? <p className="text-xs text-ink-soft">Sens en anglais (KANJIDIC2)</p> : null}
                <Readings label="On’yomi" values={k.on} />
                <Readings label="Kun’yomi" values={k.kun} />
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="ai">{k.n} traits</Badge>
                  {gradeLabel(k.g) && <Badge>{gradeLabel(k.g)}</Badge>}
                  {k.f && <Badge>fréquence nº {k.f}</Badge>}
                  {k.m && <Badge>clé nº {k.m}</Badge>}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
      <Section title={`Mots avec ${c}`}>
        {words === null ? (
          <p className="px-1 text-sm text-ink-soft">Recherche…</p>
        ) : words.length === 0 ? (
          <p className="px-1 text-sm text-ink-soft">Aucun mot.</p>
        ) : (
          <>
            <Card className="divide-y divide-line overflow-hidden">
              {words.slice(0, shown).map((w) => (
                <ResultRow key={w.i} word={w} />
              ))}
            </Card>
            {words.length > shown && (
              <button onClick={() => setShown(shown + 30)} className="mt-3 w-full rounded-xl bg-card py-3 text-ai ring-1 ring-line">
                Afficher plus
              </button>
            )}
          </>
        )}
      </Section>
    </div>
  );
}

function Readings({ label, values }: { label: string; values?: string[] }) {
  if (!values?.length) return null;
  return (
    <div>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="jp text-lg">
        {values.map((v, i) => (
          <a key={i} href={`#/?q=${encodeURIComponent(v.replace(/[.-]/g, ""))}`} className="mr-3 hover:text-ai">
            {v.replace(".", "·")}
          </a>
        ))}
      </p>
    </div>
  );
}
