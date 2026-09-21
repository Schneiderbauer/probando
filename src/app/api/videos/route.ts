import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Platform, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const niche = searchParams.get("niche")?.trim();
  const platform = searchParams.get("platform")?.trim();

  const where: Prisma.CompetitorVideoWhereInput = {};

  if (niche) {
    where.niche = { equals: niche };
  }

  if (platform && (platform === "TIKTOK" || platform === "INSTAGRAM" || platform === "OTHER")) {
    where.platform = platform as Platform;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { painPoints: { contains: q } },
      { transcript: { contains: q } },
      { niche: { contains: q } },
      { authorHandle: { contains: q } },
    ];
  }

  const videos = await prisma.competitorVideo.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(videos);
}

const createSchema = z.object({
  platform: z.enum(["TIKTOK", "INSTAGRAM", "OTHER"]).default("OTHER"),
  url: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  authorHandle: z.string().optional(),
  niche: z.string().min(1, "El nicho es obligatorio"),
  painPoints: z.string().min(1, "Agregá al menos un punto de dolor"),
  transcript: z.string().optional().default(""),
  thumbnailUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const video = await prisma.competitorVideo.create({ data: parsed.data });
  return NextResponse.json(video, { status: 201 });
}
