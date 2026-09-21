import { prisma } from "@/lib/prisma";
import FeedClient from "@/components/feed/FeedClient";
import type { CompetitorVideoDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const videos = await prisma.competitorVideo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized: CompetitorVideoDTO[] = videos.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
  }));

  return <FeedClient initialVideos={serialized} />;
}
