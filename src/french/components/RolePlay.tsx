import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../content";
import { markPlayed } from "../store";
import { Button, Card, MicIcon, cx, say, stopSay } from "./ui";
import { speakerColor, speakerIndex } from "./LessonContent";
import { ScoreBar, useSpeechAttempt } from "./HearSay";

export default function RolePlay({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const lines = lesson.dialogue ?? [];
  const speakers = [...new Set(lines.map((l) => l.speaker))];
  const [role, setRole] = useState<string | null>(null);
  const [pos, setPos] = useState(0);
  const [scores, setScores] = useState<Record<number, number | null>>({});
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const speech = useSpeechAttempt();
  const alive = useRef(true);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stopSay();
    };
  }, []);

  // Play the other characters' lines automatically until it's the learner's turn.
  useEffect(() => {
    if (!role || finished) return;
    bottom.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (pos >= lines.length) {
      setFinished(true);
      markPlayed(lesson.id);
      return;
    }
    const line = lines[pos];
    if (line.speaker === role) return;
    let cancelled = false;
    void (async () => {
      await say(line.fr, { voiceIndex: speakerIndex(lesson, line.speaker), id: `rp:${pos}` });
      await new Promise((r) => setTimeout(r, 400));
      if (!cancelled && alive.current) setPos((p) => p + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [role, pos, finished, lines, lesson]);

  if (!lines.length) return null;

  const start = (r: string) => {
    setRole(r);
    setPos(0);
    setScores({});
    setFinished(false);
  };

  if (!role) {
    return (
      <Card className="p-6 text-center">
        <p className="text-4xl">🎭</p>
        <h2 className="mt-2 font-display text-2xl font-bold">Play a part in the conversation</h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Choose a character. The app speaks everyone else's lines, and when it's your turn you say yours in French.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {speakers.map((s) => (
            <button key={s} onClick={() => start(s)} className={cx("rounded-2xl px-6 py-4 text-lg font-semibold transition hover:scale-105", speakerColor(lesson, s))}>
              Be {s}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  const myTurn = !finished && lines[pos]?.speaker === role;
  const current = lines[pos];

  const advance = () => {
    setShowHint(false);
    setPos(pos + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          You are <strong className="text-ink">{role}</strong>
        </p>
        <Button variant="ghost" onClick={() => setRole(null)}>Change role</Button>
      </div>
      <Card className="space-y-3 p-4">
        {lines.slice(0, Math.min(pos + 1, lines.length)).map((l, k) => {
          const mine = l.speaker === role;
          const hidden = mine && k === pos && !finished;
          return (
            <div key={k} className={cx("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cx("max-w-[85%] rounded-2xl px-4 py-2.5", mine ? "bg-bleu text-white dark:text-paper" : "bg-paper-2")}>
                <p className={cx("text-xs font-semibold", mine ? "opacity-80" : "text-ink-soft")}>{l.speaker}</p>
                {hidden ? (
                  <p className="italic opacity-90">Your turn: “{l.en}”</p>
                ) : (
                  <>
                    <p className="font-medium">{l.fr}</p>
                    <p className={cx("text-xs", mine ? "opacity-80" : "text-ink-soft")}>{l.en}</p>
                    {mine && scores[k] != null && <p className="mt-1 text-xs font-semibold">Pronunciation {scores[k]}%</p>}
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </Card>

      {myTurn && current && (
        <Card className="p-5">
          <p className="text-sm text-ink-soft">Say in French:</p>
          <p className="font-display text-xl font-semibold">{current.en}</p>
          {showHint ? (
            <p className="mt-2 rounded-xl bg-paper-2 px-3 py-2 font-medium">{current.fr}</p>
          ) : (
            <button onClick={() => setShowHint(true)} className="mt-1 text-sm text-ink-soft underline decoration-dotted">Show the French</button>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={async () => {
                if (speech.recording) return speech.stop();
                const a = await speech.start(current.fr);
                if (a) {
                  setScores((s) => ({ ...s, [pos]: a.score }));
                  if (a.score === null || a.score >= 60) advance();
                }
              }}
              className={cx("flex h-14 w-14 items-center justify-center rounded-full bg-rouge text-white", speech.recording && "recording")}
              aria-label={speech.recording ? "Stop recording" : "Say your line"}
            >
              {speech.recording ? <span className="h-5 w-5 rounded bg-white" /> : <MicIcon className="h-7 w-7" />}
            </button>
            <Button variant="secondary" onClick={() => void say(current.fr)}>🔊 Hear it</Button>
            <Button variant="ghost" onClick={advance}>I said it →</Button>
          </div>
          {scores[pos] != null && (
            <div className="mt-4 max-w-sm">
              <ScoreBar score={scores[pos]!} />
            </div>
          )}
          {speech.error && <p className="mt-3 rounded-xl bg-or-soft px-3 py-2 text-sm text-or">{speech.error}</p>}
        </Card>
      )}

      {finished && (
        <Card className="p-6 text-center">
          <p className="text-4xl">👏</p>
          <h3 className="mt-2 font-display text-2xl font-bold">Bravo, {role} !</h3>
          <p className="text-ink-soft">You played your part in the whole conversation.</p>
          <div className="mt-4 flex justify-center gap-2">
            {speakers
              .filter((s) => s !== role)
              .slice(0, 1)
              .map((s) => (
                <Button key={s} variant="secondary" onClick={() => start(s)}>Now be {s}</Button>
              ))}
            <Button onClick={onNext}>Next lesson →</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
