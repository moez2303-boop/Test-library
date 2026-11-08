import { back } from "../router";
import { useEffect, useState } from "react";
import { conjugate } from "../conjugate";
import { addCard, addHistory, getCard, getKanjiMany, getWord, removeCard } from "../db";
import { commonLabel, FIELD_FR, POS_FR, THEME_FR } from "../labels";
import { href } from "../router";
import { useSettings } from "../settings";
import { canSpeak, speak } from "../speech";
import { kanjiIn, toRomaji } from "../text";
import type { Kanji, Sense, StoredWord } from "../types";
import { headword, mainReading } from "../wordUtil";
import { ListPicker } from "./ListPicker";
import { Ruby } from "./Ruby";
import { Badge, Card, IconButton, Section, TopBar } from "./ui";

export function WordView({ id }: { id: number }) {
  const [word, setWord] = useState<StoredWord | null | undefined>(undefined);
  const [kanji, setKanji] = useState<Kanji[]>([]);
  const [hasCard, setHasCard] = useState(false);
  const [picker, setPicker] = useState(false);
  const [showConj, setShowConj] = useState(false);
  const { showEnglish, showRomaji } = useSettings();

  useEffect(() => {
    void (async () => {
      const w = await getWord(id);
      setWord(w ?? null);
      if (!w) return;
      void addHistory(id);
      setKanji(await getKanjiMany(kanjiIn((w.k ?? []).join(""))));
      setHasCard(!!(await getCard(id)));
    })();
  }, [id]);

  if (word === undefined) return <TopBar onBack={back} />;
  if (word === null)
    return (
      <>
        <TopBar onBack={back} />
        <p className="mt-10 text-center text-ink-soft">Ce mot n’existe pas.</p>
      </>
    );

  const head = headword(word);
  const reading = mainReading(word);
  const forms = [...(word.k ?? []), ...word.r].filter((f) => f !== head && f !== reading);
  const pos = word.s.flatMap((s) => s.p);
  const conj = conjugate(head, pos) ?? conjugate(reading, pos);
  const common = commonLabel(word.c);
  const frSenses = word.s.filter((s) => s.f?.length);
  const enOnly = word.s.filter((s) => !s.f?.length);
  const hasFrench = frSenses.length > 0;

  return (
    <div>
      <TopBar
        onBack={back}
        right={
          <button onClick={() => setPicker(true)} className="rounded-full px-2 py-1 text-ai hover:bg-ai-soft">
            ☆ Ajouter
          </button>
        }
      />
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="jp text-4xl leading-[1.6] font-bold">
              <Ruby text={head} reading={head !== reading ? reading : undefined} />
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {showRomaji && <span className="text-sm text-ink-soft">{toRomaji(reading)}</span>}
              {common && <Badge tone="matcha">{common}</Badge>}
              {word.t && THEME_FR[word.t] && <Badge>{THEME_FR[word.t]}</Badge>}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {canSpeak() && (
              <IconButton label="Écouter" onClick={() => speak(reading)}>
                🔊
              </IconButton>
            )}
            <IconButton
              label={hasCard ? "Retirer des révisions" : "Ajouter aux révisions"}
              active={hasCard}
              onClick={async () => {
                if (hasCard) await removeCard(word.i);
                else await addCard(word.i);
                setHasCard(!hasCard);
              }}
            >
              ⟳
            </IconButton>
          </div>
        </div>
        {forms.length > 0 && (
          <p className="jp mt-3 text-sm text-ink-soft">
            Autres formes : <span className="text-ink">{forms.join("、")}</span>
          </p>
        )}
      </Card>

      <Section title="Sens">
        <Card className="divide-y divide-line">
          {(hasFrench ? frSenses : enOnly).map((s, i, arr) => (
            <SenseRow key={i} sense={s} n={arr.length > 1 ? i + 1 : undefined} prev={arr[i - 1]} showEnglish={showEnglish} />
          ))}
        </Card>
        {hasFrench && enOnly.length > 0 && (
          <details className="mt-2 px-1 text-sm text-ink-soft">
            <summary className="cursor-pointer">Sens en anglais seulement ({enOnly.length})</summary>
            <ul className="mt-1 list-disc pl-5">
              {enOnly.map((s, i) => (
                <li key={i}>{s.e?.join("; ")}</li>
              ))}
            </ul>
          </details>
        )}
        {!hasFrench && <p className="mt-2 px-1 text-xs text-ink-soft">Pas encore de sens en français : voici l’anglais de JMdict.</p>}
      </Section>

      {kanji.length > 0 && (
        <Section title="Kanji">
          <Card className="divide-y divide-line overflow-hidden">
            {kanji.map((k) => (
              <a key={k.c} href={href({ name: "kanji", c: k.c })} className="flex items-center gap-4 px-4 py-3 hover:bg-ai-soft/50">
                <span className="jp text-3xl">{k.c}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px]">{(k.fr ?? k.en ?? []).slice(0, 4).join(", ")}</p>
                  <p className="jp truncate text-xs text-ink-soft">
                    {[...(k.on ?? []), ...(k.kun ?? [])].slice(0, 6).join("、")}
                  </p>
                </div>
                <span className="text-ink-soft">›</span>
              </a>
            ))}
          </Card>
        </Section>
      )}

      {conj && (
        <Section title="Conjugaison">
          {showConj ? (
            <Card className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-ai-soft/60 text-xs text-ink-soft">
                  <tr>
                    <th className="px-3 py-2 font-medium">Forme</th>
                    <th className="px-3 py-2 font-medium">Neutre</th>
                    <th className="px-3 py-2 font-medium">Poli</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {conj.map((c) => (
                    <tr key={c.label}>
                      <td className="px-3 py-2 text-ink-soft">{c.label}</td>
                      <td className="jp px-3 py-2">{c.plain}</td>
                      <td className="jp px-3 py-2">{c.polite ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <button onClick={() => setShowConj(true)} className="w-full rounded-2xl bg-card py-3 text-ai ring-1 ring-line">
              Afficher la conjugaison
            </button>
          )}
        </Section>
      )}

      <p className="mt-6 px-1 text-xs text-ink-soft">
        Entrée JMdict nº {word.i}. Les sens marqués « traduit » ont été traduits automatiquement depuis le japonais par
        Jiyomi ; « vérifié » signale un sens écrit par un contributeur de JMdict.
      </p>
      {picker && <ListPicker wordId={word.i} onClose={() => setPicker(false)} />}
    </div>
  );
}

function SenseRow({ sense, n, prev, showEnglish }: { sense: Sense; n?: number; prev?: Sense; showEnglish: boolean }) {
  const samePos = prev && prev.p.join() === sense.p.join();
  const glosses = sense.f?.length ? sense.f : sense.e ?? [];
  return (
    <div className="px-4 py-3">
      {!samePos && sense.p.length > 0 && (
        <p className="mb-1 text-xs font-medium text-ai">{sense.p.map((p) => POS_FR[p] ?? p).join(" · ")}</p>
      )}
      <div className="flex gap-2">
        {n && <span className="w-5 shrink-0 text-ink-soft">{n}.</span>}
        <div className="min-w-0 flex-1">
          <p className="text-[16px]">{glosses.join(" ; ")}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {sense.d?.map((d) => <Badge key={d}>{FIELD_FR[d] ?? d}</Badge>)}
            {sense.u && <Badge>souvent en kana</Badge>}
            {sense.f?.length ? (
              sense.h ? <Badge tone="matcha">vérifié</Badge> : <Badge tone="kin">traduit</Badge>
            ) : null}
          </div>
          {showEnglish && sense.f?.length && sense.e?.length ? (
            <p className="mt-1 text-sm text-ink-soft italic">🇬🇧 {sense.e.join("; ")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
