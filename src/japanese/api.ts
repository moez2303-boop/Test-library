import Anthropic from "@anthropic-ai/sdk";
import type { Settings } from "./types";
import { GraderError } from "./errors";

/** Calls the Claude API with the user's own key; returns the parsed JSON reply. */
export async function callViaApi(
  settings: Settings,
  system: string,
  userText: string,
  schema: Record<string, unknown>,
): Promise<unknown> {
  if (!settings.apiKey) throw new GraderError("Add your Anthropic API key in Settings first.");

  // The key stays in this browser and requests go straight to api.anthropic.com.
  const client = new Anthropic({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });
  // Server-side refusal fallback is available for Opus/Sonnet, not Haiku.
  const fallback =
    settings.model === "claude-haiku-5-5"
      ? {}
      : { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

  let response: Anthropic.Beta.BetaMessage;
  try {
    response = await client.beta.messages.create({
      model: settings.model,
      max_tokens: 16000,
      system,
      messages: [{ role: "user", content: userText }],
      output_config: { effort: "medium", format: { type: "json_schema", schema } },
      ...fallback,
    });
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
