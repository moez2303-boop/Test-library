import { parseTikTokId } from "./util";

export interface TikTokInfo {
  videoId: string | null;
  caption: string;
  author: string;
  thumbnail: string;
}

/**
 * Looks up a TikTok link with TikTok's public oEmbed endpoint. This also
 * resolves short share links (vm.tiktok.com / tiktok.com/t/…) to a video id.
 * Best effort: returns null if TikTok can't be reached from this browser.
 */
export async function fetchTikTokInfo(url: string): Promise<TikTokInfo | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      author_unique_id?: string;
      thumbnail_url?: string;
      embed_product_id?: string;
      html?: string;
    };
    const fromHtml = data.html?.match(/data-video-id="(\d+)"/)?.[1] ?? null;
    return {
      videoId: data.embed_product_id ?? fromHtml ?? parseTikTokId(url),
      caption: (data.title ?? "").trim(),
      author: data.author_unique_id ?? data.author_name ?? "",
      thumbnail: data.thumbnail_url ?? "",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const TIKTOK_SEARCHES = [
  { label: "アニメ 名シーン", query: "アニメ 名シーン 日本語字幕" },
  { label: "Anime + JP subs", query: "anime japanese subtitles learn japanese" },
  { label: "アニメ 名言", query: "アニメ 名言" },
  { label: "Slice of life", query: "日常アニメ 会話" },
];

export function tiktokSearchUrl(query: string) {
  return `https://www.tiktok.com/search/video?q=${encodeURIComponent(query)}`;
}

/** Used when a clip has no script or caption to write questions from. */
export const GENERIC_QUESTIONS = [
  {
    prompt: "この場面では何が起きていますか。",
    promptEn: "What is happening in this scene?",
  },
  {
    prompt: "キャラクターはどんな気持ちだと思いますか。どうしてですか。",
    promptEn: "How do you think the character feels? Why?",
  },
  {
    prompt: "聞こえた日本語のフレーズを一つ書いて、意味を説明してください。",
    promptEn: "Write one Japanese phrase you heard and explain what it means.",
  },
];
