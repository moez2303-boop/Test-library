import { useEffect, useRef, useState } from "react";
import { IS_ARTIFACT } from "../env";
import { GraderError } from "../grader";
import { useSettings } from "../settings";
import { LEVELS, type JlptLevel } from "../types";
import { loadLevel, saveLevel, speakJapanese } from "../util";
import { GameHeader } from "./shared";
import { TOPICS, partnerTurn, type ChatTurn, type CorrectionType } from "./conversation";

const SAVE_KEY = "kotoba.conversation";

interface Saved {
  level: JlptLevel;
  topic: string;
  turns: ChatTurn[];
}

function loadSaved(): Saved | null {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null") as Saved | null;
    return s && Array.isArray(s.turns) && s.turns.length ? s : null;
  } catch {
    return null;
  }
}

function save(s: Saved | null) {
  try {
    if (s) localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    else localStorage.removeItem(SAVE_KEY);
  } catch {
    /* storage unavailable: the chat lasts for this visit */
  }
}

const TYPE_STYLE: Record<CorrectionType, string> = {
  particle: "bg-ai/10 text-ai",
  grammar: "bg-shu/10 text-shu",
  naturalness: "bg-matcha/15 text-matcha",
  register: "bg-kin/15 text-kin",
};

// Browser speech recognition (not available inside claude.ai pages).
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
function makeRecognition(): Recognition | null {
  if (IS_ARTIFACT) return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function ConversationGame({ onBack }: { onBack: () => void }) {
  const [settings] = useSettings();
  const saved = useRef(loadSaved()).current;
  const [level, setLevel] = useState<JlptLevel>(saved?.level ?? loadLevel);
  const [topic, setTopic] = useState(saved?.topic ?? "");
  const [customTopic, setCustomTopic] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>(saved?.turns ?? []);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const [canListen] = useState(() => makeRecognition() !== null);
  const bottom = useRef<HTMLDivElement>(null);
  const started = turns.length > 0;

  useEffect(() => {
    if (started) save({ level, topic, turns });
  }, [started, level, topic, turns]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns.length, busy]);

  const needsKey = !IS_ARTIFACT && !settings.apiKey;

  const start = async (chosen: string) => {
    if (!chosen.trim() || busy) return;
    setTopic(chosen);
    saveLevel(level);
    setBusy(true);
    setError(null);
    try {
      const r = await partnerTurn(settings, level, chosen, [], null);
      setTurns([{ role: "partner", text: r.reply }]);
      speakJapanese(r.reply);
    } catch (err) {
      setError(err instanceof GraderError ? err.message : "Couldn't start the conversation. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    const history = turns;
    const withLearner: ChatTurn[] = [...history, { role: "learner", text: message }];
    setTurns(withLearner);
    setDraft("");
    setBusy(true);
    setError(null);
    try {
      const r = await partnerTurn(settings, level, topic, history, message);
      setTurns([
        ...history,
        { role: "learner", text: message, corrections: r.corrections, praise: r.praise },
        { role: "partner", text: r.reply },
      ]);
      speakJapanese(r.reply);
    } catch (err) {
      setError(err instanceof GraderError ? err.message : "Your message didn't get through. Try again.");
      setTurns(history);
      setDraft(message);
    } finally {
      setBusy(false);
    }
  };

  const toggleMic = () => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const rec = makeRecognition();
    if (!rec) return;
    rec.lang = "ja-JP";
    rec.interimResults = true;
    rec.continuous = false;
    const before = draft;
    rec.onresult = (e) => {
      const heard = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setDraft(before + heard);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognition.current = rec;
    setListening(true);
    rec.start();
  };

  const reset = () => {
    save(null);
    setTurns([]);
    setTopic("");
    setDraft("");
    setError(null);
  };

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm ${active ? "bg-sumi text-washi" : "border border-sumi/15 hover:bg-washi-dark"}`;

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl">
        <GameHeader
          jp="会話パートナー"
          en="Conversation partner"
          about="Chat in Japanese about a topic. You get a natural reply, up to two corrections, and praise when you earn it."
          onBack={onBack}
        />
        {needsKey && (
          <p className="mb-4 rounded-lg bg-kin/15 px-3 py-2 text-sm">
            This game needs Claude: add an API key in Settings, or use the claude.ai version.
          </p>
        )}
        <div className="rounded-2xl bg-card p-5 ring-1 ring-sumi/5">
          <div className="text-sm font-medium">Your level</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LEVELS.map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={chip(level === l)}>
                {l}
              </button>
            ))}
          </div>
          <div className="mt-5 text-sm font-medium">Pick a topic</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <button
                key={t.jp}
                disabled={busy || needsKey}
                onClick={() => void start(t.jp)}
                className="flex min-h-12 items-center justify-between gap-2 rounded-xl border-2 border-sumi/10 px-4 py-2 text-left hover:border-sumi/30 disabled:opacity-50"
              >
                <span className="jp font-medium">{t.jp}</span>
                <span className="text-xs text-sumi-soft">{t.en}</span>
              </button>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void start(customTopic);
            }}
          >
            <input
              id="custom-topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Or your own topic (日本語 or English)"
              className="min-w-0 flex-1 rounded-xl border border-sumi/20 bg-card px-3 py-2 text-sm focus:border-shu focus:outline-none"
            />
            <button
              disabled={busy || needsKey || !customTopic.trim()}
              className="rounded-xl bg-shu px-4 text-sm font-semibold text-white disabled:opacity-40"
            >
              Start
            </button>
          </form>
          {busy && <p className="mt-4 animate-pulse text-sm text-sumi-soft">Your partner is thinking of a way to start…</p>}
          {error && <p className="mt-4 rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <GameHeader
        jp="会話パートナー"
        en="Conversation partner"
        about={`Topic: ${topic} · ${level}`}
        onBack={onBack}
        right={
          <button onClick={reset} className="rounded-full border border-sumi/15 px-3 py-1.5 text-sm hover:bg-washi-dark">
            New topic
          </button>
        }
      />

      <div className="grid gap-3 pb-40">
        {turns.map((t, i) =>
          t.role === "partner" ? (
            <div key={i} className="flex items-end gap-2">
              <span className="jp grid h-8 w-8 shrink-0 place-items-center rounded-full bg-shu text-sm text-white">先</span>
              <div className="jp max-w-[85%] rounded-2xl rounded-bl-sm bg-card px-4 py-2.5 text-base leading-relaxed ring-1 ring-sumi/5">
                {t.text}
              </div>
              <button
                onClick={() => speakJapanese(t.text)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-washi-dark"
                aria-label="Listen"
              >
                🔊
              </button>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-end gap-1.5">
              <div className="jp max-w-[85%] rounded-2xl rounded-br-sm bg-sumi px-4 py-2.5 text-base leading-relaxed text-washi">
                {t.text}
              </div>
              {t.praise && (
                <div className="max-w-[85%] rounded-xl bg-matcha/10 px-3 py-1.5 text-sm text-matcha">
                  ✨ Nice: <span className="jp font-medium">{t.praise}</span>
                </div>
              )}
              {t.corrections?.map((c, j) => (
                <div key={j} className="max-w-[90%] rounded-xl bg-card px-3 py-2 text-sm ring-1 ring-sumi/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_STYLE[c.type]}`}>{c.type}</span>
                    <span className="jp text-shu line-through decoration-shu/50">{c.original}</span>
                    <span className="text-sumi-soft">→</span>
                    <span className="jp font-medium text-matcha">{c.better}</span>
                  </div>
                  <p className="mt-1 text-sumi-soft">{c.noteEn}</p>
                </div>
              ))}
            </div>
          ),
        )}
        {busy && (
          <div className="flex items-center gap-2">
            <span className="jp grid h-8 w-8 place-items-center rounded-full bg-shu text-sm text-white">先</span>
            <span className="animate-pulse rounded-2xl bg-card px-4 py-2.5 text-sumi-soft ring-1 ring-sumi/5">…</span>
          </div>
        )}
        {error && <p className="rounded-lg bg-shu/10 px-3 py-2 text-sm text-shu">{error}</p>}
        <div ref={bottom} />
      </div>

      {/* Composer, fixed to the bottom of the screen */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-washi-dark bg-washi/95 backdrop-blur" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <form
          className="mx-auto flex max-w-2xl items-end gap-2 px-[max(16px,env(safe-area-inset-left,0px))] py-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
        >
          <button
            type="button"
            onClick={() => void send("わからない")}
            disabled={busy}
            className="jp shrink-0 rounded-full border border-sumi/15 px-3 py-2 text-xs hover:bg-washi-dark disabled:opacity-40"
            title="Ask for a hint"
          >
            わからない
          </button>
          <textarea
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(draft);
              }
            }}
            rows={1}
            lang="ja"
            placeholder="日本語で話そう…"
            className="jp max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-sumi/20 bg-card px-3 py-2.5 text-base focus:border-shu focus:outline-none"
          />
          {canListen && (
            <button
              type="button"
              onClick={toggleMic}
              aria-pressed={listening}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${listening ? "animate-pulse bg-shu text-white" : "border border-sumi/15 hover:bg-washi-dark"}`}
              aria-label={listening ? "Stop listening" : "Speak"}
            >
              🎤
            </button>
          )}
          <button
            disabled={busy || !draft.trim()}
            className="h-11 shrink-0 rounded-full bg-shu px-4 text-sm font-semibold text-white disabled:opacity-40"
          >
            Send
          </button>
        </form>
        {!canListen && (
          <p className="pb-2 text-center text-[11px] text-sumi-soft">Tip: tap 🎤 on your keyboard to speak instead of typing.</p>
        )}
      </div>
    </div>
  );
}
