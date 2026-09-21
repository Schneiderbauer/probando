import { prisma } from "@/lib/prisma";
import LibraryClient from "@/components/library/LibraryClient";
import type { ClientDTO, ScriptDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const [scripts, clients] = await Promise.all([
    prisma.script.findMany({
      include: { client: true, competitorVideo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serializedScripts: ScriptDTO[] = scripts.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    client: s.client ? { ...s.client, createdAt: s.client.createdAt.toISOString(), updatedAt: s.client.updatedAt.toISOString() } : null,
    competitorVideo: s.competitorVideo
      ? { ...s.competitorVideo, createdAt: s.competitorVideo.createdAt.toISOString() }
      : null,
  }));

  const serializedClients: ClientDTO[] = clients.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <LibraryClient initialScripts={serializedScripts} clients={serializedClients} />;
}
