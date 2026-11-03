import { useEffect, useRef, useState } from "react";
import { getVideo } from "../db";
import { IS_ARTIFACT } from "../env";
import type { Clip } from "../types";
import { formatTime } from "../util";

export function ClipPlayer({ clip, onAttachVideo }: { clip: Clip; onAttachVideo?: () => void }) {
  if (clip.source.kind === "youtube") {
    if (IS_ARTIFACT) {
      const t = clip.start ? `&t=${Math.floor(clip.start)}s` : "";
      return (
        <WatchOutside
          site="YouTube"
          href={`https://www.youtube.com/watch?v=${clip.source.videoId}${t}`}
          range={rangeLabel(clip.start, clip.end)}
        />
      );
    }
    return <YouTubeClip videoId={clip.source.videoId} start={clip.start} end={clip.end} />;
  }
  if (clip.source.kind === "tiktok") {
    if (IS_ARTIFACT || !clip.source.videoId)
      return <WatchOutside site="TikTok" href={clip.source.url} author={clip.source.author} />;
    return <TikTokClip videoId={clip.source.videoId} url={clip.source.url} />;
  }
  if (clip.source.kind === "file") return <FileClip clip={clip} />;
  return (
    <div className="grid aspect-video place-items-center rounded-2xl bg-gradient-to-br from-ai to-night p-6 text-center text-white">
      <div>
        <p className="jp text-2xl">映像なし</p>
        <p className="mt-2 text-sm text-white/75">
          No video attached — practice from the transcript, or attach a clip.
        </p>
        {onAttachVideo && (
          <button
            onClick={onAttachVideo}
            className="mt-4 rounded-full bg-card px-4 py-2 text-sm font-semibold text-sumi"
          >
            Attach a video
          </button>
        )}
      </div>
    </div>
  );
}

/** For pages that can't embed other sites' players: watch there, answer here. */
function WatchOutside({
  site,
  href,
  author,
  range,
}: {
  site: string;
  href: string;
  author?: string;
  range?: string;
}) {
  return (
    <div className="grid aspect-video place-items-center rounded-2xl bg-gradient-to-br from-night to-ai p-6 text-center text-white">
      <div className="grid justify-items-center gap-3">
        <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          {site}
          {author ? ` · @${author}` : ""}
        </span>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1d232c] shadow-lg hover:bg-white/90"
        >
          ▶ Watch on {site} ↗
        </a>
        <p className="max-w-xs text-sm text-white/75">
          {range && range !== "Full video" ? `Watch ${range}, ` : "Watch the clip, "}then come back here
          to answer.
        </p>
      </div>
    </div>
  );
}

function rangeLabel(start: number, end: number) {
  if (!start && !end) return "Full video";
  return `${formatTime(start) || "0:00"} – ${end ? formatTime(end) : "end"}`;
}

function TikTokClip({ videoId, url }: { videoId: string; url: string }) {
  const [plays, setPlays] = useState(0);
  const params = new URLSearchParams({
    loop: "0",
    rel: "0",
    music_info: "0",
    description: "0",
    closed_caption: "0",
  });
  if (plays > 0) params.set("autoplay", "1");

  return (
    <div>
      <div className="mx-auto aspect-[9/16] max-h-[60vh] overflow-hidden rounded-2xl bg-night">
        <iframe
          key={plays}
          className="h-full w-full"
          src={`https://www.tiktok.com/player/v1/${videoId}?${params}`}
          title="TikTok clip"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <button
          onClick={() => setPlays((n) => n + 1)}
          className="rounded-full bg-sumi px-4 py-1.5 font-medium text-washi hover:bg-sumi/85"
        >
          ↺ Replay clip
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-sumi/15 px-4 py-1.5 hover:bg-washi-dark"
        >
          Open in TikTok ↗
        </a>
      </div>
    </div>
  );
}

function YouTubeClip({ videoId, start, end }: { videoId: string; start: number; end: number }) {
  const [plays, setPlays] = useState(0);
  const params = new URLSearchParams({ rel: "0", playsinline: "1", modestbranding: "1" });
  if (start) params.set("start", String(Math.floor(start)));
  if (end) params.set("end", String(Math.ceil(end)));
  if (plays > 0) params.set("autoplay", "1");

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-2xl bg-night">
        <iframe
          key={plays}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
          title="Clip"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <button
          onClick={() => setPlays((n) => n + 1)}
          className="rounded-full bg-sumi px-4 py-1.5 font-medium text-washi hover:bg-sumi/85"
        >
          ↺ Replay clip
        </button>
        <span className="text-sumi-soft">{rangeLabel(start, end)}</span>
      </div>
    </div>
  );
}

function FileClip({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    void getVideo(clip.id).then((blob) => {
      if (cancelled) return;
      if (!blob) return setMissing(true);
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [clip.id]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }, [rate, url]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = clip.start;
    void v.play();
  };

  if (missing)
    return (
      <div className="grid aspect-video place-items-center rounded-2xl bg-night p-6 text-center text-white/80">
        The video file for this clip wasn't found in this browser. Edit the clip to attach it again.
      </div>
    );

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-2xl bg-night">
        {url && (
          <video
            ref={videoRef}
            src={url}
            controls
            playsInline
            className="h-full w-full"
            onLoadedMetadata={(e) => {
              e.currentTarget.currentTime = clip.start;
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (clip.end && v.currentTime >= clip.end) {
                v.pause();
                v.currentTime = clip.end;
              }
            }}
            onPlay={(e) => {
              const v = e.currentTarget;
              if (clip.end && v.currentTime >= clip.end - 0.05) v.currentTime = clip.start;
            }}
          />
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <button
          onClick={replay}
          className="rounded-full bg-sumi px-4 py-1.5 font-medium text-washi hover:bg-sumi/85"
        >
          ↺ Replay clip
        </button>
        <div className="flex overflow-hidden rounded-full border border-sumi/15">
          {[0.75, 1].map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-3 py-1.5 ${rate === r ? "bg-sumi text-washi" : "hover:bg-washi-dark"}`}
            >
              {r}×
            </button>
          ))}
        </div>
        <span className="text-sumi-soft">{rangeLabel(clip.start, clip.end)}</span>
      </div>
    </div>
  );
}
