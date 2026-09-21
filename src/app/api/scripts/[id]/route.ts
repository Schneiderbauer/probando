import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  favorite: z.boolean().optional(),
  hook: z.string().optional(),
  development: z.string().optional(),
  cta: z.string().optional(),
  fullText: z.string().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const script = await prisma.script.update({
    where: { id },
    data: parsed.data,
    include: { client: true, competitorVideo: true },
  });

  return NextResponse.json(script);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.script.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
