"use client";

import { Heart, MessageCircle, Play, Sparkles } from "lucide-react";
import PlatformBadge from "./PlatformBadge";
import { formatCompactNumber, parseMetrics } from "@/lib/format";
import type { CompetitorVideoDTO } from "@/types";

export default function VideoCard({
  video,
  onGenerate,
}: {
  video: CompetitorVideoDTO;
  onGenerate: (video: CompetitorVideoDTO) => void;
}) {
  const metrics = parseMetrics(video.metrics);
  const painPoints = video.painPoints
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden border border-border bg-surface hover:border-accent-violet/50 transition-colors">
      <div className="relative aspect-[9/13] bg-surface-2 overflow-hidden">
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Play className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <PlatformBadge platform={video.platform} />
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/50 text-white border border-white/10">
          {video.niche}
        </div>

        <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-2">
          <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {video.title}
          </p>
          {video.authorHandle && (
            <p className="text-xs text-white/70">{video.authorHandle}</p>
          )}
          <div className="flex items-center gap-3 text-white/80 text-xs">
            {typeof metrics.views === "number" && (
              <span className="flex items-center gap-1">
                <Play className="w-3.5 h-3.5" /> {formatCompactNumber(metrics.views)}
              </span>
            )}
            {typeof metrics.likes === "number" && (
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {formatCompactNumber(metrics.likes)}
              </span>
            )}
            {typeof metrics.comments === "number" && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> {formatCompactNumber(metrics.comments)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {painPoints.slice(0, 3).map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 rounded-full text-[11px] bg-surface-2 text-muted border border-border"
            >
              {p}
            </span>
          ))}
        </div>

        <button
          onClick={() => onGenerate(video)}
          className="flex items-center justify-center gap-2 w-full rounded-xl gradient-brand text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          Generar guiones
        </button>
      </div>
    </article>
  );
}
