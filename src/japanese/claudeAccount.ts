import { GraderError } from "./errors";

/** The claude.ai Artifact `sample` capability (only the parts this app uses). */
interface SampleFn {
  json(
    input: string,
    options?: {
      effort?: "low" | "medium" | "high";
      images?: Blob[];
      modelTier?: "quick" | "default" | "complex";
      onText?: (u: { text: string; delta: string }) => void;
      cache?: boolean;
    },
  ): Promise<unknown>;
  limits(): Promise<{ images?: { maxCount: number; maxInputBytes: number; mediaTypes: string[] } }>;
}

export interface CallOptions {
  images?: Blob[];
  /** Called with how many characters Claude has written so far. */
  onProgress?: (chars: number) => void;
  /** Ask for a fresh answer instead of a cached one (e.g. "write me a new story"). */
  fresh?: boolean;
  /** A short, routine request (a word lookup): use the fastest model tier. */
  quick?: boolean;
}

/** How many images one call can carry in this view (0 = none). */
export async function imageLimit(): Promise<number> {
  const sample = await getSample();
  if (!sample) return 0;
  try {
    return (await sample.limits()).images?.maxCount ?? 0;
  } catch {
    return 0;
  }
}

interface SampleError {
  code: string;
  message: string;
}

let samplePromise: Promise<SampleFn | null> | null = null;

/** Resolves the viewer's Claude access, or null when the page isn't open on claude.ai. */
export function getSample(): Promise<SampleFn | null> {
  if (!samplePromise) {
    const claude = (window as unknown as { claude?: { use(name: string): Promise<unknown> } }).claude;
    samplePromise = claude?.use
      ? claude.use("sample").then((s) => (s as SampleFn | null) ?? null, () => null)
      : Promise.resolve(null);
  }
  return samplePromise;
}

function messageFor(code: string): string {
  switch (code) {
    case "not_granted":
      return "This page isn't allowed to use Claude. Reload the page and choose Allow when asked.";
    case "sampling_disabled":
    case "capability_disabled":
    case "capability_removed":
    case "not_declared":
      return "Claude isn't available to this page for your account.";
    case "rate_limited":
      return "You've reached a Claude usage limit. Try again in a little while.";
    case "session_expired":
      return "Your Claude session expired. Sign in again, then retry.";
    case "refused":
      return "Claude declined to grade this. Try rephrasing your answer.";
    case "prompt_too_large":
      return "That's too much text at once. Use fewer or smaller pages and try again.";
    case "image_rejected":
    case "images_unavailable":
      return "Claude couldn't take those images. Try JPEG or PNG screenshots, a few at a time.";
    default:
      return "Grading didn't come back properly. Please try again.";
  }
}

/** Asks Claude on the viewer's own account; returns the parsed JSON reply. */
export async function callViaClaudeAccount(
  system: string,
  userText: string,
  schema: Record<string, unknown>,
  opts: CallOptions = {},
): Promise<unknown> {
  const sample = await getSample();
  if (!sample)
    throw new GraderError("Grading works when this page is opened on claude.ai or in the Claude app.");
  const prompt = `${system}

${userText}

Reply with only one JSON object that matches this JSON Schema, with no other text:
${JSON.stringify(schema)}`;
  try {
    return await sample.json(prompt, {
      effort: opts.quick ? "low" : "medium",
      ...(opts.images?.length ? { images: opts.images } : {}),
      ...(opts.onProgress ? { onText: ({ text }) => opts.onProgress!(text.length) } : {}),
      ...(opts.fresh ? { cache: false } : {}),
      ...(opts.quick ? { modelTier: "quick" as const } : {}),
    });
  } catch (err) {
    const code = (err as SampleError)?.code ?? "upstream_error";
    throw new GraderError(messageFor(code));
  }
}
