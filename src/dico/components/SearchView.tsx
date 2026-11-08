import { useEffect, useRef, useState } from "react";
import { getWords, recentHistory, clearHistory } from "../db";
import { go } from "../router";
import { analyse, search, type SearchResult, type Token } from "../search";
import { hasJapanese } from "../text";
import type { StoredWord } from "../types";
import { headword, mainReading, shortMeaning } from "../wordUtil";
import { ResultRow } from "./ResultRow";
import { Card, Section } from "./ui";

const PAGE = 50;

export function SearchView({ q }: { q: string }) {
  const [text, setText] = useState(q);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (!q) input.current?.focus();
  }, [q]);

  useEffect(() => {
    const query = text.trim();
    const n = ++seq.current;
    setTokens(null);
    if (!query) {
      setResult(null);
      return;
    }
    setBusy(true);
    const t = setTimeout(async () => {
      const r = await search(query);
      if (n !== seq.current) return;
      setResult(r);
      setShown(PAGE);
      setBusy(false);
      go({ name: "search", q: query }, true);
      // A sentence rarely matches one entry: split it into words straight away.
      if (hasJapanese(query) && [...query].length >= 4 && !r.hits.some((h) => h.how !== "prefix")) {
        void runAnalysis(query, n);
      }
    }, 140);
    return () => clearTimeout(t);
  }, [text]);

  async function runAnalysis(query: string, n = seq.current) {
    setAnalysing(true);
    const tk = await analyse(query);
    if (n === seq.current) setTokens(tk);
    setAnalysing(false);
  }

  const query = text.trim();
  const canAnalyse = hasJapanese(query) && [...query].length >= 2;

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 bg-paper/95 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-2xl bg-card px-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-ai">
          <span className="text-ink-soft" aria-hidden>
            🔍
          </span>
          <input
            ref={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="猫, neko, ねこ ou chat"
            aria-label="Rechercher un mot"
            className="jp min-w-0 flex-1 bg-transparent py-3 text-lg outline-none placeholder:text-ink-soft/70"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          {text && (
            <button
              onClick={() => {
                setText("");
                input.current?.focus();
              }}
              className="grid h-7 w-7 place-items-center rounded-full bg-line/70 text-sm text-ink-soft"
              aria-label="Effacer"
            >
              ✕
            </button>
          )}
        </div>
        {result?.kana && <p className="mt-2 px-1 text-xs text-ink-soft">Romaji lu comme <span className="jp">{result.kana}</span></p>}
      </div>

      {!query && <Home />}

      {query && canAnalyse && (
        <div className="mt-1">
          {tokens ? (
            <Analysis tokens={tokens} />
          ) : (
            <button
              onClick={() => runAnalysis(query)}
              disabled={analysing}
              className="rounded-full bg-ai-soft px-3 py-1.5 text-sm font-medium text-ai"
            >
              {analysing ? "Découpage…" : "✂︎ Découper en mots"}
            </button>
          )}
        </div>
      )}

      {result && result.hits.length > 0 && (
        <Card className="mt-3 divide-y divide-line overflow-hidden">
          {result.hits.slice(0, shown).map((h) => (
            <ResultRow key={h.word.i} word={h.word} hit={h} />
          ))}
        </Card>
      )}
      {result && result.hits.length > shown && (
        <button onClick={() => setShown(shown + PAGE)} className="mt-3 w-full rounded-xl bg-card py-3 text-ai ring-1 ring-line">
          Afficher plus ({result.hits.length - shown})
        </button>
      )}
      {result && !busy && result.hits.length === 0 && !tokens?.some((t) => t.hits.length) && (
        <p className="mt-10 text-center text-ink-soft">Aucun résultat pour « {query} ».</p>
      )}
    </div>
  );
}

function Analysis({ tokens }: { tokens: Token[] }) {
  return (
    <Card className="p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">Mots de la phrase</p>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((t, i) => {
          const w = t.hits[0]?.word;
          if (!w) {
            return (
              <span key={i} className="jp rounded-lg px-2 py-1 text-lg text-ink-soft">
                {t.surface}
              </span>
            );
          }
          return (
            <a
              key={i}
              href={`#/mot/${w.i}`}
              className="rounded-lg bg-ai-soft px-2 py-1 text-left hover:ring-2 hover:ring-ai"
              title={shortMeaning(w).text}
            >
              <span className="jp block text-lg leading-tight">{t.surface}</span>
              <span className="block max-w-[9rem] truncate text-[11px] text-ink-soft">
                {headword(w) !== t.surface ? `${headword(w)} · ` : ""}
                {shortMeaning(w, 1).text}
              </span>
            </a>
          );
        })}
      </div>
    </Card>
  );
}

function Home() {
  const [recent, setRecent] = useState<StoredWord[] | null>(null);
  useEffect(() => {
    void (async () => {
      const h = await recentHistory(30);
      setRecent(await getWords(h.map((x) => x.wordId)));
    })();
  }, []);

  return (
    <div>
      <Card className="mt-2 p-4 text-[15px]">
        <p className="font-semibold">Comment chercher</p>
        <ul className="mt-2 space-y-1 text-ink-soft">
          <li>
            <span className="jp text-ink">食べる</span>, <span className="jp text-ink">たべる</span> ou{" "}
            <span className="text-ink">taberu</span> — le mot japonais
          </li>
          <li>
            <span className="text-ink">manger</span> — le sens en français
          </li>
          <li>
            <span className="jp text-ink">食べなかった</span> — une forme conjuguée
          </li>
          <li>
            <span className="jp text-ink">猫が好きです</span> — une phrase, découpée en mots
          </li>
        </ul>
      </Card>
      {recent && recent.length > 0 && (
        <Section
          title="Historique"
          right={
            <button
              className="text-xs text-ai"
              onClick={async () => {
                await clearHistory();
                setRecent([]);
              }}
            >
              Effacer
            </button>
          }
        >
          <Card className="divide-y divide-line overflow-hidden">
            {recent.map((w) => (
              <a key={w.i} href={`#/mot/${w.i}`} className="flex items-baseline gap-2 px-4 py-2.5 hover:bg-ai-soft/50">
                <span className="jp font-semibold">{headword(w)}</span>
                <span className="jp text-xs text-ink-soft">{mainReading(w)}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">{shortMeaning(w, 2).text}</span>
              </a>
            ))}
          </Card>
        </Section>
      )}
    </div>
  );
}
