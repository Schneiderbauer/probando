import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma, FunnelStage } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const funnelStage = searchParams.get("funnelStage");
  const clientId = searchParams.get("clientId");
  const favoriteOnly = searchParams.get("favorite") === "true";

  const where: Prisma.ScriptWhereInput = {};
  if (funnelStage && ["TOFU", "MOFU", "BOFU"].includes(funnelStage)) {
    where.funnelStage = funnelStage as FunnelStage;
  }
  if (clientId) where.clientId = clientId;
  if (favoriteOnly) where.favorite = true;

  const scripts = await prisma.script.findMany({
    where,
    include: { client: true, competitorVideo: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(scripts);
}

const createSchema = z.object({
  funnelStage: z.enum(["TOFU", "MOFU", "BOFU"]),
  angle: z.string().min(1),
  hook: z.string().min(1),
  development: z.string().min(1),
  cta: z.string().min(1),
  fullText: z.string().min(1),
  variantNo: z.number().int().default(1),
  model: z.string().default("template-engine"),
  favorite: z.boolean().default(true),
  competitorVideoId: z.string().optional(),
  clientId: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const script = await prisma.script.create({
    data: parsed.data,
    include: { client: true, competitorVideo: true },
  });

  return NextResponse.json(script, { status: 201 });
}
