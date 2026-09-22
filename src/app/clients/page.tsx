import { prisma } from "@/lib/prisma";
import ClientsClient from "@/components/clients/ClientsClient";
import type { ClientDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });

  const serialized: ClientDTO[] = clients.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <ClientsClient initialClients={serialized} />;
}
