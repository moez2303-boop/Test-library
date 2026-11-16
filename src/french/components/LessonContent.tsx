import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../content";
import { markLessonRead, updateSettings, useStore } from "../store";
import { Button, Card, SaveWordButton, SpeakButton, cx, say, stopSay } from "./ui";

/** Colour per speaker so the dialogue is easy to follow. */
const SPEAKER_COLORS = ["bg-bleu-soft text-bleu", "bg-rouge-soft text-rouge", "bg-vert-soft text-vert", "bg-or-soft text-or"];

export function speakerIndex(lesson: Lesson, speaker: string): number {
  const names = [...new Set(lesson.dialogue?.map((d) => d.speaker))];
  return Math.max(0, names.indexOf(speaker));
}

export function speakerColor(lesson: Lesson, speaker: string) {
  return SPEAKER_COLORS[speakerIndex(lesson, speaker) % SPEAKER_COLORS.length];
}

function DialoguePlayer({ lesson }: { lesson: Lesson }) {
  const lines = lesson.dialogue!;
  const showEnglish = useStore((s) => s.settings.showEnglish);
  const [current, setCurrent] = useState<number | null>(null);
  const [slow, setSlow] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const playing = useRef(false);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => () => {
    playing.current = false;
    stopSay();
  }, []);

  const playFrom = async (start: number) => {
    playing.current = true;
    for (let i = start; i < lines.length && playing.current; i++) {
      setCurrent(i);
      lineRefs.current[i]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      await say(lines[i].fr, { slow, id: `dlg:${i}`, voiceIndex: speakerIndex(lesson, lines[i].speaker) });
      if (playing.current) await new Promise((r) => setTimeout(r, 450));
    }
    playing.current = false;
    setCurrent(null);
  };

  const stop = () => {
    playing.current = false;
    stopSay();
    setCurrent(null);
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {current === null ? (
          <Button onClick={() => void playFrom(0)}>▶ Play conversation</Button>
        ) : (
          <Button variant="danger" onClick={stop}>■ Stop</Button>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} className="accent-[var(--color-bleu)]" />
          🐢 Slow
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm">
          <input type="checkbox" checked={showEnglish} onChange={(e) => updateSettings({ showEnglish: e.target.checked })} className="accent-[var(--color-bleu)]" />
          Show English
        </label>
      </div>
      <ol className="space-y-2">
        {lines.map((l, i) => {
          const showEn = showEnglish || revealed.has(i);
          return (
            <li
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={cx("flex gap-3 rounded-xl p-2.5 transition", current === i && "bg-bleu-soft")}
            >
              <span className={cx("mt-0.5 hidden h-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:block", speakerColor(lesson, l.speaker))}>{l.speaker}</span>
              <div className="min-w-0 flex-1">
                <span className={cx("mb-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold sm:hidden", speakerColor(lesson, l.speaker))}>{l.speaker}</span>
                <p className="text-lg font-medium leading-snug">{l.fr}</p>
                {showEn ? (
                  <p className="text-sm text-ink-soft">{l.en}</p>
                ) : (
                  <button onClick={() => setRevealed(new Set(revealed).add(i))} className="text-xs text-ink-soft underline decoration-dotted">
                    Show translation
                  </button>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1 sm:flex-row sm:items-start">
                <SpeakButton text={l.fr} size="sm" voiceIndex={speakerIndex(lesson, l.speaker)} />
                <SpeakButton text={l.fr} size="sm" slow />
                <SaveWordButton phrase={l} lessonId={lesson.id} />
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export default function LessonContent({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const done = useStore((s) => !!s.progress[lesson.id]?.lesson);
  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-ink-soft">{lesson.intro}</p>

      {lesson.dialogue && <DialoguePlayer lesson={lesson} />}

      <div className="space-y-4">
        {lesson.notes.map((n) => (
          <Card key={n.heading} className="p-5">
            <h3 className="font-display text-lg font-semibold">{n.heading}</h3>
            <p className="mt-1.5 leading-relaxed">{n.body}</p>
            {n.examples && (
              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {n.examples.map((e) => (
                  <li key={e.fr} className="flex items-center gap-3 px-3 py-2">
                    <SpeakButton text={e.fr} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{e.fr}</p>
                      <p className="text-sm text-ink-soft">{e.en}</p>
                    </div>
                    <SaveWordButton phrase={e} lessonId={lesson.id} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-display text-lg font-semibold">Key phrases</h3>
        <p className="text-sm text-ink-soft">These are what you'll practise in the next activities. Tap the bookmark to save any to My Vocab.</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {lesson.phrases.map((p) => (
            <li key={p.fr} className="flex items-center gap-2 rounded-xl bg-paper-2 px-3 py-2">
              <SpeakButton text={p.fr} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{p.fr}</p>
                <p className="text-xs text-ink-soft">
                  {p.en}
                  {p.note && <span className="italic"> — {p.note}</span>}
                </p>
              </div>
              <SaveWordButton phrase={p} lessonId={lesson.id} />
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex justify-center">
        {done ? (
          <Button onClick={onNext}>Lesson complete ✓ — Practise now →</Button>
        ) : (
          <Button
            onClick={() => {
              markLessonRead(lesson.id);
              onNext();
            }}
          >
            Mark as complete (+10) and practise →
          </Button>
        )}
      </div>
    </div>
  );
}
