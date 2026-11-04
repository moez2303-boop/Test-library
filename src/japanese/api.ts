import Anthropic from "@anthropic-ai/sdk";
import type { Settings } from "./types";
import { GraderError } from "./errors";
import type { CallOptions } from "./claudeAccount";

async function toImageBlock(blob: Blob): Promise<Anthropic.Beta.BetaImageBlockParam> {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  const type = ["image/png", "image/gif", "image/webp"].includes(blob.type) ? blob.type : "image/jpeg";
  return {
    type: "image",
    source: { type: "base64", media_type: type as "image/jpeg", data },
  };
}

/** Calls the Claude API with the user's own key; returns the parsed JSON reply. */
export async function callViaApi(
  settings: Settings,
  system: string,
  userText: string,
  schema: Record<string, unknown>,
  opts: CallOptions = {},
): Promise<unknown> {
  if (!settings.apiKey) throw new GraderError("Add your Anthropic API key in Settings first.");

  // The key stays in this browser and requests go straight to api.anthropic.com.
  const client = new Anthropic({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });
  // Server-side refusal fallback is available for Opus/Sonnet, not Haiku.
  const fallback =
    settings.model === "claude-haiku-5-5"
      ? {}
      : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

  const images = await Promise.all((opts.images ?? []).map(toImageBlock));
  const content: Anthropic.Beta.BetaContentBlockParam[] = [...images, { type: "text", text: userText }];

  let response: Anthropic.Beta.BetaMessage;
  try {
    // Streamed so long outputs (a whole story plus exercises) don't hit request timeouts.
    const stream = client.beta.messages.stream({
      model: settings.model,
      max_tokens: 32000,
      system,
      messages: [{ role: "user", content }],
      output_config: { effort: "medium", format: { type: "json_schema", schema } },
      ...fallback,
    });
    if (opts.onProgress) {
      let chars = 0;
      stream.on("text", (delta) => {
        chars += delta.length;
        opts.onProgress!(chars);
      });
    }
    response = await stream.finalMessage();
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError)
      throw new GraderError("Your API key was rejected. Check it in Settings.");
    if (err instanceof Anthropic.PermissionDeniedError)
      throw new GraderError("This API key doesn't have access to that model.");
    if (err instanceof Anthropic.RateLimitError)
      throw new GraderError("Rate limited — wait a moment and try again.");
    if (err instanceof Anthropic.APIConnectionError)
      throw new GraderError("Couldn't reach the Claude API. Check your connection.");
    if (err instanceof Anthropic.APIError)
      throw new GraderError(`Claude API error ${err.status ?? ""}: ${err.message}`);
    throw err;
  }

  if (response.stop_reason === "refusal")
    throw new GraderError("The model declined to grade this answer. Try rephrasing it.");
  if (response.stop_reason === "max_tokens")
    throw new GraderError("The response was cut off. Please try again.");

  const text = response.content.map((block) => (block.type === "text" ? block.text : "")).join("");
  try {
    return JSON.parse(text);
  } catch {
    throw new GraderError("Got an unreadable response from the model. Please try again.");
  }
}
