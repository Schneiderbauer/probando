import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.competitorVideo.findUnique({ where: { id } });
  if (!video) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(video);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.competitorVideo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
