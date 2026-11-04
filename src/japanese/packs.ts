import atashinchi from "./packs/atashinchi.json";

export interface PackVideo {
  id: string;
  title: string;
  /** Seconds (0 = not known). */
  duration: number;
  short: boolean;
  /** Where the script came from: uploaded Japanese subtitles, auto captions, or none. */
  subtitles: "manual" | "auto" | null;
  script: string;
}

export interface VideoPack {
  key: "atashinchi";
  name: string;
  channel: string;
  channelUrl: string;
  fetchedAt: string;
  videos: PackVideo[];
}

export const ATASHINCHI: VideoPack = {
  key: "atashinchi",
  name: "あたしンち",
  channel: atashinchi.channel,
  channelUrl: atashinchi.channelUrl,
  fetchedAt: atashinchi.fetchedAt,
  videos: atashinchi.videos as PackVideo[],
};

/**
 * Picks a random video, preferring ones not practiced yet and never repeating
 * the one just shown. Videos with a script come first, since they give
 * better questions and grading.
 */
export function pickRandomVideo(
  pack: VideoPack,
  practiced: Set<string>,
  avoidId?: string,
): PackVideo | null {
  const candidates = pack.videos.filter((v) => v.id !== avoidId);
  const tiers = [
    candidates.filter((v) => !practiced.has(v.id) && v.script),
    candidates.filter((v) => !practiced.has(v.id)),
    candidates,
  ];
  const pool = tiers.find((t) => t.length > 0) ?? [];
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
