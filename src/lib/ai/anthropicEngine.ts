import Anthropic from "@anthropic-ai/sdk";
import type { GenerateScriptsParams, GeneratedScript } from "@/types";

const MODEL = "claude-sonnet-5";

const FUNNEL_RULES: Record<GenerateScriptsParams["funnelStage"], string> = {
  TOFU:
    "TOFU (atracción masiva): el objetivo es enganchar al público frío con el dolor o la curiosidad. NO se vende nada, NO se menciona el negocio ni se pide contacto directo. El CTA es de bajo compromiso (comentar, guardar, seguir, etiquetar).",
  MOFU:
    "MOFU (autoridad / educación): el objetivo es demostrar expertise y generar confianza mostrando conocimiento real. Puede nombrar al negocio/profesional como fuente del conocimiento. El CTA es de compromiso medio (DM por info, descargar guía, dejar comentario con su duda).",
  BOFU:
    "BOFU (venta directa): el objetivo es convertir a alguien que ya conoce el problema y está listo para actuar. Debe incluir oferta concreta, urgencia o prueba social, y mencionar al negocio/cliente explícitamente. El CTA es de alto compromiso y SIEMPRE debe dirigir a escribir por WhatsApp (nunca a un link genérico, DM de Instagram o formulario).",
};

function buildPrompt(params: GenerateScriptsParams): string {
  const { competitorVideo, clientName, clientIndustry, clientWhatsapp, variantCount, funnelStage, angle } = params;

  return `Sos un guionista senior de una agencia de marketing digital, experto en contenido corto para TikTok e Instagram Reels.

CONTEXTO DEL VIDEO DE REFERENCIA (competencia, ${competitorVideo.platform}):
- Título: ${competitorVideo.title}
- Nicho: ${competitorVideo.niche}
- Puntos de dolor detectados: ${competitorVideo.painPoints}
- Transcripción: """${competitorVideo.transcript}"""

CLIENTE PARA QUIEN SE ESCRIBE:
- Nombre: ${clientName}
- Rubro: ${clientIndustry || competitorVideo.niche}
${clientWhatsapp ? `- WhatsApp de contacto: ${clientWhatsapp}` : ""}

PARÁMETROS DE GENERACIÓN:
- Etapa de embudo: ${funnelStage} — ${FUNNEL_RULES[funnelStage]}
- Ángulo / dolor específico a tocar: ${angle}
- Cantidad de variantes a generar: ${variantCount}

INSTRUCCIONES:
Generá ${variantCount} variantes de guion ORIGINALES (no copies el video de referencia, usalo solo como inspiración de formato y ángulo). Cada variante debe tener EXACTAMENTE estas 3 partes, respetando estrictamente las reglas de la etapa ${funnelStage}:
1. "hook": gancho ultra potente para los primeros 3 segundos, que detenga el scroll.
2. "development": desarrollo del problema y la solución, en 3-5 frases, alineado a la etapa del embudo.
3. "cta": llamado a la acción específico y coherente con la etapa del embudo${
    funnelStage === "BOFU"
      ? ` (siempre invitando a escribir por WhatsApp${clientWhatsapp ? ` al ${clientWhatsapp}` : ""})`
      : ""
  }.

Respondé ÚNICAMENTE con un JSON válido (sin texto adicional, sin markdown, sin backticks) con esta forma exacta:
{"variants": [{"hook": "...", "development": "...", "cta": "..."}]}`;
}

export async function generateWithAnthropic(
  params: GenerateScriptsParams,
  apiKey: string
): Promise<GeneratedScript[]> {
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: buildPrompt(params) }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Respuesta vacía del modelo de IA.");
  }

  let jsonText = textBlock.text.trim();
  const fencedMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fencedMatch) jsonText = fencedMatch[1].trim();

  const parsed = JSON.parse(jsonText) as {
    variants: { hook: string; development: string; cta: string }[];
  };

  return parsed.variants.map((v, i) => {
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
}
