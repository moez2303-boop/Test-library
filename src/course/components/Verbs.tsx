import { useEffect, useMemo, useRef, useState } from "react";
import { useLang, type ConjRow, type VerbSet } from "../languages";
import { gradeWritten, normalize, stripAccents } from "../speech";
import { romaji } from "../kana";
import { addPoints } from "../store";
import { AccentKeys, Button, Card, SpeakButton, TargetText, cx, say } from "./ui";

function Table({ rows }: { rows: ConjRow[] }) {
  return (
    <ul className="divide-y divide-line rounded-xl border border-line">
      {rows.map((r) => (
        <li key={r.label + r.text} className="flex items-center gap-3 px-3 py-2">
          <SpeakButton text={r.speak} size="sm" />
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4">
            <TargetText phrase={r} className="font-medium" />
            {r.label && <span className="text-xs text-ink-soft">{r.label}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Drill({ set, forms }: { set: VerbSet; forms: string[] }) {
  const pick = () => {
    const verb = set.verbs[Math.floor(Math.random() * set.verbs.length)];
    const form = forms[Math.floor(Math.random() * forms.length)];
    const rows = set.rows(verb.id, form);
    const row = rows[Math.floor(Math.random() * rows.length)];
    return { verb, form, row };
  };
  const [q, setQ] = useState(pick);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<"right" | "wrong" | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const input = useRef<HTMLInputElement>(null);
  const L = useLang();
  const formLabel = set.forms.find((f) => f.id === q.form)?.label ?? q.form;

  useEffect(() => {
    input.current?.focus();
  }, [q]);

  const check = () => {
    // Japanese answers carry a kana reading, so kana, romaji or kanji all count.
    const ok = q.row.answers.some((a) => {
      const v = q.row.reading ? gradeWritten(a, typed, q.row.reading) : gradeWritten(a, typed);
      return v === "correct" || v === "accents";
    });
    setResult(ok ? "right" : "wrong");
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) addPoints(1);
    void say(q.row.speak);
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
      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-bleu-soft px-2.5 py-1 font-semibold text-bleu">{q.row.label ? `${formLabel} · ${q.row.label}` : formLabel}</span>
        <span className="text-ink-soft">
          <span lang={L.shortCode} className="font-medium text-ink">
            {q.verb.head}
          </span>
          {q.verb.reading && ` (${q.verb.reading}, ${romaji(q.verb.reading)})`} — {q.verb.en}
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
          {q.row.prompt && <span className="shrink-0 text-lg font-semibold">{q.row.prompt}</span>}
          <input
            ref={input}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            lang={L.shortCode}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            readOnly={!!result}
            placeholder={L.id === "ja" ? "kana or romaji" : undefined}
            className={cx(
              "min-w-0 flex-1 rounded-xl border-2 bg-paper px-4 py-2.5 text-lg outline-none focus:border-bleu",
              result === "right" ? "border-vert" : result === "wrong" ? "border-rouge" : "border-line",
            )}
          />
        </div>
        <AccentKeys onInsert={(c) => setTyped((t) => t + c)} />
        <Button type="submit" disabled={!result && !typed.trim()}>
          {result ? "Next →" : "Check"}
        </Button>
      </form>
      {result && (
        <div className={cx("mt-4 rounded-xl px-4 py-3", result === "right" ? "bg-vert-soft text-vert" : "bg-rouge-soft text-rouge")} role="status">
          {result === "right" ? L.cheers.correct : "The answer is:"} <TargetText phrase={q.row} as="strong" />
        </div>
      )}
    </Card>
  );
}

export default function Verbs() {
  const L = useLang();
  const set = L.verbs;
  const [verbId, setVerbId] = useState(set.verbs[0].id);
  const [form, setForm] = useState(set.forms[0].id);
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<"tables" | "drill">("tables");
  const [drillForms, setDrillForms] = useState<string[]>([set.forms[0].id]);
  const verb = set.verbs.find((v) => v.id === verbId) ?? set.verbs[0];
  const formMeta = set.forms.find((f) => f.id === form);

  const shown = useMemo(() => {
    const n = stripAccents(normalize(filter));
    return set.verbs.filter((v) => !n || stripAccents(normalize(`${v.head} ${v.reading ?? ""} ${v.reading ? romaji(v.reading) : ""} ${v.en}`)).includes(n));
  }, [filter, set]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Verbs</h1>
        <p className="text-ink-soft">
          {L.id === "ja"
            ? `Conjugation tables for ${set.verbs.length} essential verbs: polite, plain and 8 more forms, plus a drill to test yourself.`
            : `Conjugation tables for ${set.verbs.length} essential verbs across ${set.forms.length} tenses, plus a drill to test yourself.`}
        </p>
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
          <div className="min-w-0 space-y-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Find a verb…"
              className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus:border-bleu"
            />
            <ul className="flex gap-1 overflow-x-auto md:max-h-[60vh] md:flex-col md:overflow-y-auto">
              {shown.map((v) => (
                <li key={v.id} className="shrink-0">
                  <button
                    onClick={() => setVerbId(v.id)}
                    className={cx("w-full rounded-lg px-3 py-2 text-left text-sm", v.id === verb.id ? "bg-bleu-soft font-semibold text-bleu" : "hover:bg-paper-2")}
                  >
                    <span lang={L.shortCode}>{v.head}</span> <span className="hidden text-xs text-ink-soft md:inline">· {v.en}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <Card className="min-w-0 p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl font-bold" lang={L.shortCode}>
                {verb.head}
              </h2>
              {verb.reading && (
                <span className="text-ink-soft" lang="ja">
                  {verb.reading} · <i>{romaji(verb.reading)}</i>
                </span>
              )}
              <span className="text-ink-soft">{verb.en}</span>
              <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold">{verb.group}</span>
            </div>
            {verb.info && <p className="mt-1 text-xs text-ink-soft">{verb.info}</p>}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {set.forms.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setForm(f.id)}
                  className={cx("rounded-full border px-3 py-1 text-sm", form === f.id ? "border-bleu bg-bleu text-white dark:text-paper" : "border-line hover:bg-paper-2")}
                  title={f.en}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-soft">{formMeta?.en}</p>
            <div className="mt-3">
              <Table rows={set.rows(verb.id, form)} />
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {set.forms.map((f) => {
              const on = drillForms.includes(f.id);
              return (
                <label key={f.id} className={cx("inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm", on ? "border-bleu bg-bleu-soft text-bleu" : "border-line")}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => {
                      const next = on ? drillForms.filter((x) => x !== f.id) : [...drillForms, f.id];
                      if (next.length) setDrillForms(next);
                    }}
                  />
                  {on ? "✓ " : ""}
                  {f.label}
                </label>
              );
            })}
          </div>
          <Drill key={drillForms.join()} set={set} forms={drillForms} />
        </div>
      )}
    </div>
  );
}
