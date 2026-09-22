"use client";

import { Search, Plus } from "lucide-react";

export default function SearchBar({
  query,
  onQueryChange,
  niche,
  onNicheChange,
  niches,
  platform,
  onPlatformChange,
  onAddReference,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  niche: string;
  onNicheChange: (v: string) => void;
  niches: string[];
  platform: string;
  onPlatformChange: (v: string) => void;
  onAddReference: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por palabra clave, nicho o punto de dolor…"
          className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent-violet/60"
        />
      </div>

      <select
        value={niche}
        onChange={(e) => onNicheChange(e.target.value)}
        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-violet/60"
      >
        <option value="">Todos los nichos</option>
        {niches.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <select
        value={platform}
        onChange={(e) => onPlatformChange(e.target.value)}
        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-violet/60"
      >
        <option value="">Todas las plataformas</option>
        <option value="TIKTOK">TikTok</option>
        <option value="INSTAGRAM">Instagram</option>
        <option value="OTHER">Otro</option>
      </select>

      <button
        onClick={onAddReference}
        className="flex items-center justify-center gap-2 rounded-xl gradient-brand text-white text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        Agregar referencia
      </button>
    </div>
  );
}
