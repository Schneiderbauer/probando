import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateScripts, MissingApiKeyError, AiGenerationError } from "@/lib/ai";
import type { VideoAnalysis } from "@/types";

const bodySchema = z.object({
  competitorVideoId: z.string().min(1),
  clientId: z.string().optional(),
  newClientName: z.string().optional(),
  variantCount: z.coerce.number().int().min(1).max(6).default(3),
  funnelStage: z.enum(["TOFU", "MOFU", "BOFU"]),
  angle: z.string().min(1, "Definí un ángulo o dolor específico"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { competitorVideoId, clientId, newClientName, variantCount, funnelStage, angle } =
    parsed.data;

  const video = await prisma.competitorVideo.findUnique({ where: { id: competitorVideoId } });
  if (!video) {
    return NextResponse.json({ error: "Video de referencia no encontrado" }, { status: 404 });
  }

  let client = clientId ? await prisma.client.findUnique({ where: { id: clientId } }) : null;

  if (!client && newClientName?.trim()) {
    client = await prisma.client.create({ data: { name: newClientName.trim() } });
  }

  const clientName = client?.name ?? "Cliente sin especificar";

  const analysis: VideoAnalysis | null =
    video.aiConcept && video.aiAngle && video.aiHookPattern && video.aiStructureNotes
      ? {
          concept: video.aiConcept,
          angle: video.aiAngle,
          hookPattern: video.aiHookPattern,
          structureNotes: video.aiStructureNotes,
        }
      : null;

  try {
    const variants = await generateScripts({
      competitorVideo: {
        title: video.title,
        niche: video.niche,
        painPoints: video.painPoints,
        transcript: video.transcript,
        platform: video.platform,
        analysis,
      },
      clientName,
      clientIndustry: client?.industry,
      clientWhatsapp: client?.whatsapp,
      variantCount,
      funnelStage,
      angle,
    });

    return NextResponse.json({
      client,
      competitorVideo: video,
      variants,
    });
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return NextResponse.json({ error: err.message, code: "missing_api_key" }, { status: 503 });
    }
    if (err instanceof AiGenerationError) {
      return NextResponse.json({ error: err.message, code: "generation_failed" }, { status: 502 });
    }
    console.error("Unexpected error generating scripts:", err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado generando los guiones.", code: "unknown" },
      { status: 500 }
    );
  }
}
