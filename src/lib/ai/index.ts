import type { GenerateScriptsParams, GeneratedScript } from "@/types";
import { generateWithTemplateEngine } from "./templateEngine";
import { generateWithAnthropic } from "./anthropicEngine";

export async function generateScripts(params: GenerateScriptsParams): Promise<GeneratedScript[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      return await generateWithAnthropic(params, apiKey);
    } catch (err) {
      console.error("Anthropic generation failed, falling back to template engine:", err);
    }
  }

  return generateWithTemplateEngine(params);
}
