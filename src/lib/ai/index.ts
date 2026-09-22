import type { GenerateScriptsParams, GeneratedScript } from "@/types";
import { generateWithAnthropic } from "./anthropicEngine";
import { MissingApiKeyError } from "./errors";

export { analyzeCompetitorVideo } from "./anthropicEngine";
export { MissingApiKeyError, AiGenerationError } from "./errors";

export function hasAiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function generateScripts(params: GenerateScriptsParams): Promise<GeneratedScript[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  return generateWithAnthropic(params, apiKey);
}
