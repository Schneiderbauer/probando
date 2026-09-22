import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { FunnelStage, GenerateScriptsParams, GeneratedScript, VideoAnalysis } from "@/types";
import { AiGenerationError } from "./errors";

const MODEL = "claude-opus-5";

const FUNNEL_RULES: Record<FunnelStage, string> = {
  TOFU:
    "TOFU (atracción masiva): el objetivo es enganchar al público frío con el dolor o la curiosidad. NO se vende nada, NO se menciona el negocio ni se pide contacto directo. El CTA es de bajo compromiso (comentar, guardar, seguir, etiquetar).",
  MOFU:
    "MOFU (autoridad / educación): el objetivo es demostrar expertise y generar confianza mostrando conocimiento real. Puede nombrar al negocio/profesional como fuente del conocimiento. El CTA es de compromiso medio (DM por info, descargar guía, dejar comentario con su duda).",
  BOFU:
    "BOFU (venta directa): el objetivo es convertir a alguien que ya conoce el problema y está listo para actuar. Debe incluir oferta concreta, urgencia o prueba social, y mencionar al negocio/cliente explícitamente. El CTA es de alto compromiso y SIEMPRE debe dirigir a escribir por WhatsApp (nunca a un link genérico, DM de Instagram o formulario).",
};

const HOOK_MECHANISMS = [
  "pregunta directa que interpela al espectador",
  "dato o estadística shockeante",
  "confesión personal o vulnerabilidad",
  "contraste mito vs. realidad",
  "mini-historia o anécdota que arranca in medias res",
  "afirmación contraintuitiva que contradice el sentido común",
  "comparación inesperada",
  "urgencia o advertencia directa",
  "humor u observación irónica",
  "curiosidad abierta (loop sin resolver)",
];

const AnalysisSchema = z.object({
  concept: z.string().describe("El concepto central del video en una sola frase clara."),
  angle: z.string().describe("El ángulo, promesa o dolor específico que explota el video."),
  hookPattern: z
    .string()
    .describe(
      "El mecanismo psicológico exacto del gancho de los primeros segundos (ej: pregunta retórica, dato shockeante, confesión personal, contraste mito/realidad, urgencia, curiosidad abierta, etc.)."
    ),
  structureNotes: z
    .string()
    .describe(
      "Cómo está estructurado el desarrollo (pasos, storytelling, contraste, etc.) y qué lo hace efectivo para retener atención."
    ),
});

const ScriptVariantSchema = z.object({
  hookMechanism: z
    .string()
    .describe(
      "El mecanismo psicológico elegido para ESTA variante (debe ser distinto al de las otras variantes de la misma tanda)."
    ),
  hook: z.string().describe("El gancho literal, listo para decir a cámara en los primeros 3 segundos."),
  development: z
    .string()
    .describe(
      "El desarrollo completo, en 3-6 frases, tal como se diría hablando a cámara — texto real, no una descripción de qué decir."
    ),
  cta: z.string().describe("El llamado a la acción literal, listo para decir o mostrar en pantalla."),
});

const GenerateResponseSchema = z.object({
  variants: z.array(ScriptVariantSchema),
});

function wrapAnthropicError(error: unknown): never {
  if (error instanceof Anthropic.AuthenticationError) {
    throw new AiGenerationError(
      "La ANTHROPIC_API_KEY configurada no es válida. Revisá la clave en tu archivo .env."
    );
  }
  if (error instanceof Anthropic.RateLimitError) {
    throw new AiGenerationError("Se alcanzó el límite de la API de Claude. Probá de nuevo en unos segundos.");
  }
  if (error instanceof Anthropic.APIConnectionError) {
    throw new AiGenerationError(
      "No se pudo conectar con la API de Claude. Verificá tu conexión a internet e intentá de nuevo."
    );
  }
  if (error instanceof Anthropic.APIError) {
    throw new AiGenerationError(`Error de la API de Claude: ${error.message}`);
  }
  if (error instanceof AiGenerationError) {
    throw error;
  }
  throw new AiGenerationError(
    `No se pudo generar contenido con IA: ${error instanceof Error ? error.message : "error desconocido"}`
  );
}

export async function analyzeCompetitorVideo(
  video: { title: string; niche: string; painPoints: string; transcript: string; platform: string },
  apiKey: string
): Promise<VideoAnalysis> {
  const client = new Anthropic({ apiKey });

  const prompt = `Sos un estratega de contenido senior especializado en redes cortas (TikTok/Reels) para negocios de servicios y salud.

Analizá este video de la competencia y extraé su estructura psicológica, para que otro copywriter pueda replicar el PATRÓN (no el contenido literal) en guiones completamente originales.

VIDEO DE REFERENCIA (${video.platform}):
- Título: ${video.title}
- Nicho: ${video.niche}
- Puntos de dolor detectados: ${video.painPoints}
- Transcripción / guion: """${video.transcript || "(sin transcripción disponible: analizá solo a partir del título, el nicho y los puntos de dolor)"}"""

Extraé el concepto central, el ángulo específico, el mecanismo psicológico exacto del gancho, y cómo está estructurado el desarrollo para retener atención.`;

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium", format: zodOutputFormat(AnalysisSchema) },
      messages: [{ role: "user", content: prompt }],
    });

    if (!response.parsed_output) {
      throw new AiGenerationError("Claude no devolvió un análisis válido para este video.");
    }

    return response.parsed_output;
  } catch (error) {
    wrapAnthropicError(error);
  }
}

function buildAnalysisBlock(analysis?: VideoAnalysis | null): string {
  if (!analysis) {
    return "No hay un análisis estratégico previo disponible: antes de escribir, analizá vos mismo el concepto central, el ángulo y el mecanismo psicológico del gancho del video de referencia a partir de su transcripción.";
  }
  return `- Concepto central: ${analysis.concept}
- Ángulo / promesa explotada: ${analysis.angle}
- Mecanismo psicológico del gancho: ${analysis.hookPattern}
- Por qué funciona la estructura del desarrollo: ${analysis.structureNotes}`;
}

function buildPrompt(params: GenerateScriptsParams): string {
  const { competitorVideo, clientName, clientIndustry, clientWhatsapp, variantCount, funnelStage, angle } = params;

  return `Sos un copywriter senior especializado en marca personal y contenido de salud/servicios para redes cortas (TikTok/Reels), con dominio profundo de los mecanismos psicológicos que retienen atención en los primeros segundos. No usás fórmulas ni plantillas: cada guion que escribís es una pieza original pensada para ESTE cliente y ESTE ángulo específico.

VIDEO DE REFERENCIA (competencia, ${competitorVideo.platform}):
- Título: ${competitorVideo.title}
- Nicho: ${competitorVideo.niche}
- Puntos de dolor detectados: ${competitorVideo.painPoints}
- Transcripción: """${competitorVideo.transcript || "(sin transcripción disponible)"}"""

ANÁLISIS ESTRATÉGICO DEL VIDEO DE REFERENCIA:
${buildAnalysisBlock(competitorVideo.analysis)}

CLIENTE PARA QUIEN SE ESCRIBE:
- Nombre: ${clientName}
- Rubro: ${clientIndustry || competitorVideo.niche}
${clientWhatsapp ? `- WhatsApp de contacto: ${clientWhatsapp}` : ""}

PARÁMETROS DE GENERACIÓN:
- Etapa de embudo: ${funnelStage} — ${FUNNEL_RULES[funnelStage]}
- Ángulo / dolor específico a tocar: ${angle}
- Cantidad de variantes a generar: ${variantCount}

MECANISMOS DE GANCHO DISPONIBLES (elegí uno distinto para cada variante, no repitas ninguno si hay suficientes para no repetir):
${HOOK_MECHANISMS.map((m) => `- ${m}`).join("\n")}

INSTRUCCIONES CRÍTICAS:
1. Generá ${variantCount} variantes 100% ORIGINALES. Usá el análisis estratégico de arriba como guía de la estructura psicológica que funciona en este nicho — el texto, las palabras y el enfoque tienen que ser tuyos, nunca una copia ni una paráfrasis cercana del video de referencia.
2. Cada variante debe ser RADICALMENTE distinta de las demás: mecanismo de gancho distinto, apertura de frase distinta, estructura de desarrollo distinta. Que dos variantes empiecen con la misma palabra o frase es un error.
3. El "hook" y el "development" tienen que sonar como algo que una persona real diría hablando a cámara — texto literal, listo para grabar, nunca una descripción de qué decir ni instrucciones entre paréntesis.
4. Adaptá el tono al rubro y la personalidad de ${clientName}, manteniendo estrictamente las reglas de la etapa ${funnelStage} indicadas arriba.
5. El "cta" también tiene que ser texto literal, listo para decir o mostrar en pantalla${funnelStage === "BOFU" ? `, y SIEMPRE debe invitar a escribir por WhatsApp${clientWhatsapp ? ` (podés usar el número ${clientWhatsapp})` : ""}` : ""}.`;
}

export async function generateWithAnthropic(
  params: GenerateScriptsParams,
  apiKey: string
): Promise<GeneratedScript[]> {
  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high", format: zodOutputFormat(GenerateResponseSchema) },
      messages: [{ role: "user", content: buildPrompt(params) }],
    });

    if (!response.parsed_output || response.parsed_output.variants.length === 0) {
      throw new AiGenerationError("Claude no devolvió guiones válidos. Probá de nuevo.");
    }

    return response.parsed_output.variants.map((v, i) => {
      const fullText = `HOOK (0-3s):\n${v.hook}\n\n${v.development}\n\nCTA:\n${v.cta}`;
      return {
        variantNo: i + 1,
        funnelStage: params.funnelStage,
        angle: params.angle,
        hook: v.hook,
        development: v.development,
        cta: v.cta,
        fullText,
        model: MODEL,
      };
    });
  } catch (error) {
    wrapAnthropicError(error);
  }
}
