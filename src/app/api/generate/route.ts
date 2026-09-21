import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateScripts } from "@/lib/ai";

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

  const variants = await generateScripts({
    competitorVideo: {
      title: video.title,
      niche: video.niche,
      painPoints: video.painPoints,
      transcript: video.transcript,
      platform: video.platform,
    },
    clientName,
    clientIndustry: client?.industry,
    variantCount,
    funnelStage,
    angle,
  });

  return NextResponse.json({
    client,
    competitorVideo: video,
    variants,
  });
}
