"use client";

import { useState } from "react";
import { PlayCircle, Video as VideoIcon } from "lucide-react";
import { getEmbedUrl } from "@/lib/embed";
import type { Platform } from "@/types";

export default function VideoEmbed({
  platform,
  url,
  thumbnailUrl,
  title,
  eager = false,
  aspectClass = "aspect-[9/13]",
}: {
  platform: Platform;
  url: string | null;
  thumbnailUrl?: string | null;
  title: string;
  eager?: boolean;
  aspectClass?: string;
}) {
  const [playing, setPlaying] = useState(eager);
  const embedUrl = getEmbedUrl(platform, url);

  if (playing && embedUrl) {
    return (
      <div className={`relative w-full ${aspectClass} bg-black overflow-hidden`}>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          frameBorder={0}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        if (!embedUrl) return;
        e.stopPropagation();
        setPlaying(true);
      }}
      className={`relative w-full ${aspectClass} bg-surface-2 overflow-hidden block text-left`}
    >
      {thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted">
          <VideoIcon className="w-10 h-10" />
        </div>
      )}
      {embedUrl ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
          <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
        </div>
      ) : url ? (
        <div className="absolute bottom-2 inset-x-2 px-2 py-1 rounded-lg bg-black/60 text-white text-[11px] text-center">
          Vista previa no disponible para este link
        </div>
      ) : null}
    </button>
  );
}
