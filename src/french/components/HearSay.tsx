import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../content";
import { listen, pronunciationScore, recognitionSupported, type Listening } from "../speech";
import { rateHear, useStore, type Rating } from "../store";
const EMPTY: Record<number, Rating> = {};
import { Card, EmptyNote, MicIcon, ProgressBar, RatingButtons, SaveWordButton, SpeakButton, cx, say } from "./ui";

interface Attempt {
  heard: string[];
  score: number | null;
  audioUrl?: string;
}

/** Records the microphone alongside recognition so learners can hear themselves. */
async function startRecorder(): Promise<{ stop: () => Promise<string | undefined> } | null> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return null;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.start();
    return {
      stop: () =>
        new Promise((resolve) => {
          rec.onstop = () => {
            stream.getTracks().forEach((t) => t.stop());
            resolve(chunks.length ? URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })) : undefined);
          };
          if (rec.state !== "inactive") rec.stop();
          else resolve(undefined);
        }),
    };
  } catch {
    return null;
  }
}

export function useSpeechAttempt() {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listening = useRef<Listening | null>(null);
  const recorder = useRef<Awaited<ReturnType<typeof startRecorder>>>(null);
  const stopManual = useRef<(() => void) | null>(null);
  const supported = recognitionSupported();

  const start = async (target: string): Promise<Attempt | null> => {
    setError(null);
    setRecording(true);
    recorder.current = await startRecorder();
    if (!supported) {
      if (!recorder.current) {
        setRecording(false);
        setError("Microphone isn't available in this browser. Say the phrase aloud, then rate yourself.");
        return null;
      }
      // Without recognition, the learner stops the recording manually.
      return new Promise((resolve) => {
        stopManual.current = async () => {
          const audioUrl = await recorder.current?.stop();
          setRecording(false);
          resolve({ heard: [], score: null, audioUrl });
        };
      });
    }
    listening.current = listen();
    try {
      const heard = await listening.current.result;
      const audioUrl = await recorder.current?.stop();
      return { heard, score: pronunciationScore(target, heard), audioUrl };
    } catch (e) {
      await recorder.current?.stop();
      const msg = (e as Error).message;
      setError(
        msg === "not-allowed" || msg === "service-not-allowed"
          ? "Microphone permission was blocked. Allow it in your browser to get pronunciation scores."
          : `Speech recognition failed (${msg}). You can still say it aloud and rate yourself.`,
      );
      return null;
    } finally {
      setRecording(false);
    }
  };

  const stop = () => {
    if (listening.current) listening.current.stop();
    stopManual.current?.();
    stopManual.current = null;
  };

  return { recording, error, supported, start, stop };
}

export function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? "bg-vert" : score >= 60 ? "bg-or" : "bg-rouge";
  const label = score >= 85 ? "Excellent !" : score >= 60 ? "Pas mal — almost there" : "Try again";
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-bold">{score}%</span>
      </div>
      <ProgressBar value={score / 100} color={color} className="mt-1 h-3" />
    </div>
  );
}

export function suggestedRating(score: number | null): Rating | undefined {
  if (score === null) return undefined;
  return score >= 85 ? 3 : score >= 60 ? 2 : 1;
}

export default function HearSay({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const ratings = useStore((s) => s.progress[lesson.id]?.hear ?? EMPTY);
  const firstTodo = lesson.phrases.findIndex((_, i) => !ratings[i]);
  const [i, setI] = useState(firstTodo === -1 ? 0 : firstTodo);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const speech = useSpeechAttempt();
  const phrase = lesson.phrases[i];
  const doneCount = Object.keys(ratings).length;
  const allDone = doneCount >= lesson.phrases.length;

  useEffect(() => {
    setAttempt(null);
    void say(phrase.fr);
  }, [phrase.fr]);

  const go = (n: number) => setI((n + lesson.phrases.length) % lesson.phrases.length);

  const rate = (r: Rating) => {
    rateHear(lesson.id, i, r);
    const next = lesson.phrases.findIndex((_, j) => j > i && !ratings[j]);
    if (next !== -1) go(next);
    else if (i < lesson.phrases.length - 1) go(i + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          Listen, then say the phrase aloud. {speech.supported ? "We'll score your pronunciation." : "Your browser can't score speech, so rate yourself after comparing your recording."}
        </p>
        <span className="shrink-0 text-sm font-semibold">
          {doneCount}/{lesson.phrases.length}
        </span>
      </div>
      <ProgressBar value={doneCount / lesson.phrases.length} />

      <Card className="p-6 text-center">
        <div className="flex items-center justify-between">
          <button onClick={() => go(i - 1)} className="rounded-lg px-2 py-1 text-ink-soft hover:bg-paper-2" aria-label="Previous phrase">←</button>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Phrase {i + 1} of {lesson.phrases.length}
            {ratings[i] && " · ✓"}
          </span>
          <button onClick={() => go(i + 1)} className="rounded-lg px-2 py-1 text-ink-soft hover:bg-paper-2" aria-label="Next phrase">→</button>
        </div>
        <p className="mt-5 font-display text-3xl font-semibold leading-tight">{phrase.fr}</p>
        <p className="mt-2 text-ink-soft">{phrase.en}</p>
        {phrase.note && <p className="mt-1 text-sm italic text-ink-soft">{phrase.note}</p>}

        <div className="mt-6 flex items-center justify-center gap-4">
          <SpeakButton text={phrase.fr} size="lg" />
          <button
            type="button"
            onClick={async () => {
              if (speech.recording) return speech.stop();
              const a = await speech.start(phrase.fr);
              if (a) setAttempt(a);
            }}
            className={cx(
              "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition",
              speech.recording ? "recording bg-rouge" : "bg-rouge hover:brightness-110",
            )}
            aria-label={speech.recording ? "Stop recording" : "Record yourself"}
          >
            {speech.recording ? <span className="h-6 w-6 rounded bg-white" /> : <MicIcon className="h-9 w-9" />}
          </button>
          <SpeakButton text={phrase.fr} size="lg" slow />
        </div>
        <p className="mt-2 text-xs text-ink-soft">{speech.recording ? (speech.supported ? "Listening… speak now" : "Recording… tap to stop") : "Tap the microphone and speak"}</p>

        {speech.error && <p className="mt-4 rounded-xl bg-or-soft px-4 py-2 text-sm text-or">{speech.error}</p>}

        {attempt && (
          <div className="mx-auto mt-5 max-w-md space-y-3 text-left">
            {attempt.score !== null && <ScoreBar score={attempt.score} />}
            {attempt.score !== null && (
              <p className="text-sm text-ink-soft">
                We heard: <span className="font-medium text-ink">{attempt.heard[0] ? `« ${attempt.heard[0]} »` : "nothing — try speaking a little louder"}</span>
              </p>
            )}
            {attempt.audioUrl && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-ink-soft">Your recording:</span>
                <audio src={attempt.audioUrl} controls className="h-8 flex-1" />
              </div>
            )}
          </div>
        )}

        <div className="mx-auto mt-6 max-w-md">
          <p className="mb-2 text-sm font-medium">How did that feel?</p>
          <RatingButtons onRate={rate} current={ratings[i] ?? suggestedRating(attempt?.score ?? null)} />
        </div>
        <div className="mt-3 flex justify-center">
          <SaveWordButton phrase={phrase} lessonId={lesson.id} />
        </div>
      </Card>

      {allDone && (
        <EmptyNote>
          Ça y est ! You've rated every phrase. Go back over the hard ones any time, or{" "}
          <button onClick={onNext} className="font-semibold text-bleu underline">move on to Write It</button>.
        </EmptyNote>
      )}
    </div>
  );
}
