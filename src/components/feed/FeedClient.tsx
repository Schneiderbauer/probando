"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import VideoCard from "./VideoCard";
import IngestModal from "./IngestModal";
import GenerateModal from "./GenerateModal";
import { Loader2, VideoOff } from "lucide-react";
import type { CompetitorVideoDTO } from "@/types";

export default function FeedClient({ initialVideos }: { initialVideos: CompetitorVideoDTO[] }) {
  const [videos, setVideos] = useState<CompetitorVideoDTO[]>(initialVideos);
  const [query, setQuery] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [ingestOpen, setIngestOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<CompetitorVideoDTO | null>(null);

  const niches = useMemo(
    () => Array.from(new Set(initialVideos.map((v) => v.niche))).sort(),
    [initialVideos]
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (niche) params.set("niche", niche);
      if (platform) params.set("platform", platform);

      fetch(`/api/videos?${params.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then(setVideos)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, niche, platform]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feed de competencia</h1>
        <p className="text-sm text-muted mt-1">
          Explorá referencias indexadas y generá guiones para tus clientes en segundos.
        </p>
      </div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        niche={niche}
        onNicheChange={setNiche}
        niches={niches}
        platform={platform}
        onPlatformChange={setPlatform}
        onAddReference={() => setIngestOpen(true)}
      />

      {loading && (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Buscando…
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
          <VideoOff className="w-10 h-10" />
          <p className="text-sm">No hay referencias que coincidan con tu búsqueda.</p>
          <button
            onClick={() => setIngestOpen(true)}
            className="text-sm font-semibold text-accent-violet hover:underline"
          >
            Agregar la primera referencia
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onGenerate={setSelectedVideo} />
        ))}
      </div>

      {ingestOpen && (
        <IngestModal
          onClose={() => setIngestOpen(false)}
          onCreated={(video) => {
            setVideos((prev) => [video, ...prev]);
            setIngestOpen(false);
          }}
        />
      )}

      {selectedVideo && (
        <GenerateModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
