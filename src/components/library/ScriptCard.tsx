"use client";

import { useState } from "react";
import { Check, Copy, Download, Star, Trash2 } from "lucide-react";
import clsx from "clsx";
import FunnelBadge from "@/components/FunnelBadge";
import type { ScriptDTO } from "@/types";

export default function ScriptCard({
  script,
  onToggleFavorite,
  onDelete,
}: {
  script: ScriptDTO;
  onToggleFavorite: (script: ScriptDTO) => void;
  onDelete: (script: ScriptDTO) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(script.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleExport() {
    const blob = new Blob([script.fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guion-${script.funnelStage.toLowerCase()}-${script.id.slice(0, 6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelBadge stage={script.funnelStage} />
          {script.client && (
            <span className="text-xs text-muted px-2 py-0.5 rounded-full bg-surface-2 border border-border">
              {script.client.name}
            </span>
          )}
          <span className="text-xs text-muted">{script.angle}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(script)}
            title="Favorito"
            className={clsx(
              "p-1.5 rounded-lg hover:bg-surface-2",
              script.favorite ? "text-amber-400" : "text-muted"
            )}
          >
            <Star className="w-4 h-4" fill={script.favorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleCopy}
            title="Copiar"
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExport}
            title="Exportar .txt"
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(script)}
            title="Eliminar"
            className="p-1.5 rounded-lg text-muted hover:text-pink-400 hover:bg-surface-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted mb-1">Gancho</p>
          <p className="font-medium">{script.hook}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted mb-1">Desarrollo</p>
          <p className="text-foreground/90 line-clamp-4">{script.development}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted mb-1">CTA</p>
          <p className="font-medium text-accent-cyan">{script.cta}</p>
        </div>
      </div>

      {script.competitorVideo && (
        <p className="text-[11px] text-muted border-t border-border pt-2">
          Inspirado en: {script.competitorVideo.title}
        </p>
      )}
    </div>
  );
}
