import { useEffect, useMemo, useRef, useState } from "react";
import { PRONOUNS, TENSES, VERBS, answerFor, conjugate, type Tense, type Verb } from "../content/verbs";
import { gradeWritten, normalize, stripAccents } from "../speech";
import { addPoints } from "../store";
import { AccentKeys, Button, Card, SpeakButton, cx, say } from "./ui";

function Table({ verb, tense }: { verb: Verb; tense: Tense }) {
  const lines = conjugate(verb, tense);
  return (
    <ul className="divide-y divide-line rounded-xl border border-line">
      {lines.map((l) => (
        <li key={l} className="flex items-center gap-3 px-3 py-2">
          <SpeakButton text={l.replace(/\(e\)|\(s\)|\/elle\/on|\/elles/g, "")} size="sm" />
          <span className="font-medium">{l}</span>
        </li>
      ))}
    </ul>
  );
}

function Drill({ tenses }: { tenses: Tense[] }) {
  const pick = () => {
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const person = Math.floor(Math.random() * 6);
    return { verb, tense, person };
  };
  const [q, setQ] = useState(pick);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const input = useRef<HTMLInputElement>(null);
  const answer = answerFor(q.verb, q.tense, q.person);

  useEffect(() => {
    input.current?.focus();
  }, [q]);

  const check = () => {
    // Past participles with être agree with the subject, so allé, allée, allés and allées are all fine.
    const variants = q.tense === "passé composé" && q.verb.aux === "être" ? ["", "e", "s", "es"].map((x) => answer + x) : [answer];
    const ok = variants.some((a) => {
      const v = gradeWritten(a, typed);
      return v === "correct" || v === "accents";
    });
    setResult(ok ? "right" : "wrong");
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) addPoints(1);
    void say(conjugate(q.verb, q.tense)[q.person].replace(/\(e\)|\(s\)|\/elle\/on|\/elles/g, ""));
  };

  const next = () => {
    setQ(pick());
    setTyped("");
    setResult(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>Type the correct form · +1 point each</span>
        <span className="font-semibold text-ink">
          {score.right}/{score.total}
        </span>
      </div>
      <p className="mt-4 text-sm">
        <span className="rounded-full bg-bleu-soft px-2.5 py-1 font-semibold text-bleu">{q.tense}</span>{" "}
        <span className="text-ink-soft">
          {q.verb.inf} ({q.verb.en})
        </span>
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (result) next();
          else if (typed.trim()) check();
        }}
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-lg font-semibold">
            {q.tense === "subjonctif" ? (q.person === 2 || q.person === 5 ? "qu'" : "que ") : ""}
            {PRONOUNS[q.person]}
          </span>
          <input
            ref={input}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            lang="fr"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            readOnly={!!result}
            className={cx(
              "min-w-0 flex-1 rounded-xl border-2 bg-paper px-4 py-2.5 text-lg outline-none focus:border-bleu",
              result === "right" ? "border-vert" : result === "wrong" ? "border-rouge" : "border-line",
            )}
          />
        </div>
        <AccentKeys onInsert={(c) => setTyped((t) => t + c)} />
        <Button type="submit" disabled={!result && !typed.trim()}>{result ? "Next →" : "Check"}</Button>
      </form>
      {result && (
        <p className={cx("mt-4 rounded-xl px-4 py-3", result === "right" ? "bg-vert-soft text-vert" : "bg-rouge-soft text-rouge")} role="status">
          {result === "right" ? "Correct ! " : "The answer is: "}
          <strong>{conjugate(q.verb, q.tense)[q.person]}</strong>
        </p>
      )}
    </Card>
  );
}

export default function Verbs() {
  const [verbInf, setVerbInf] = useState("être");
  const [tense, setTense] = useState<Tense>("présent");
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<"tables" | "drill">("tables");
  const [drillTenses, setDrillTenses] = useState<Tense[]>(["présent"]);
  const verb = VERBS.find((v) => v.inf === verbInf)!;

  const shown = useMemo(() => {
    const n = stripAccents(normalize(filter));
    return VERBS.filter((v) => !n || stripAccents(normalize(`${v.inf} ${v.en}`)).includes(n));
  }, [filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Verbs</h1>
        <p className="text-ink-soft">Conjugation tables for {VERBS.length} essential verbs across six tenses, plus a drill to test yourself.</p>
      </div>

      <div className="inline-flex rounded-xl border border-line bg-card p-1 text-sm">
        {(["tables", "drill"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={cx("rounded-lg px-4 py-1.5 font-medium", mode === m ? "bg-bleu text-white dark:text-paper" : "text-ink-soft")}>
            {m === "tables" ? "Conjugation tables" : "Verb drill"}
          </button>
        ))}
      </div>

      {mode === "tables" ? (
        <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <div className="space-y-2">
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Find a verb…" className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus:border-bleu" />
            <ul className="flex gap-1 overflow-x-auto md:max-h-[60vh] md:flex-col md:overflow-y-auto">
              {shown.map((v) => (
                <li key={v.inf} className="shrink-0">
                  <button
                    onClick={() => setVerbInf(v.inf)}
                    className={cx("w-full rounded-lg px-3 py-2 text-left text-sm", v.inf === verbInf ? "bg-bleu-soft font-semibold text-bleu" : "hover:bg-paper-2")}
                  >
                    {v.inf} <span className="hidden text-xs text-ink-soft md:inline">· {v.en}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl font-bold">{verb.inf}</h2>
              <span className="text-ink-soft">{verb.en}</span>
              <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold">{verb.group}</span>
              <span className="text-xs text-ink-soft">
                past participle: <strong>{verb.participle}</strong> · auxiliary: <strong>{verb.aux}</strong>
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {TENSES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTense(t.id)}
                  className={cx("rounded-full border px-3 py-1 text-sm", tense === t.id ? "border-bleu bg-bleu text-white dark:text-paper" : "border-line hover:bg-paper-2")}
                  title={t.en}
                >
                  {t.id}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft">{TENSES.find((t) => t.id === tense)?.en}</p>
            <div className="mt-3">
              <Table verb={verb} tense={tense} />
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {TENSES.map((t) => {
              const on = drillTenses.includes(t.id);
              return (
                <label key={t.id} className={cx("inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm", on ? "border-bleu bg-bleu-soft text-bleu" : "border-line")}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      const next = on ? drillTenses.filter((x) => x !== t.id) : [...drillTenses, t.id];
                      if (next.length) setDrillTenses(next);
                    }}
                  />
                  {on ? "✓ " : ""}
                  {t.id}
                </label>
              );
            })}
          </div>
          <Drill key={drillTenses.join()} tenses={drillTenses} />
        </div>
      )}
    </div>
  );
}
