"use client";

import { useEffect, useState } from "react";
import ScriptCard from "./ScriptCard";
import { BookmarkX, Loader2 } from "lucide-react";
import type { ClientDTO, FunnelStage, ScriptDTO } from "@/types";

export default function LibraryClient({
  initialScripts,
  clients,
}: {
  initialScripts: ScriptDTO[];
  clients: ClientDTO[];
}) {
  const [scripts, setScripts] = useState<ScriptDTO[]>(initialScripts);
  const [funnelStage, setFunnelStage] = useState<FunnelStage | "">("");
  const [clientId, setClientId] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadScripts() {
      if (cancelled) return;
      setLoading(true);

      const params = new URLSearchParams();
      if (funnelStage) params.set("funnelStage", funnelStage);
      if (clientId) params.set("clientId", clientId);
      if (favoriteOnly) params.set("favorite", "true");

      try {
        const res = await fetch(`/api/scripts?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) setScripts(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadScripts();
    return () => {
      cancelled = true;
    };
  }, [funnelStage, clientId, favoriteOnly]);

  async function toggleFavorite(script: ScriptDTO) {
    const res = await fetch(`/api/scripts/${script.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !script.favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setScripts((prev) => prev.map((s) => (s.id === script.id ? updated : s)));
    }
  }

  async function deleteScript(script: ScriptDTO) {
    const res = await fetch(`/api/scripts/${script.id}`, { method: "DELETE" });
    if (res.ok) {
      setScripts((prev) => prev.filter((s) => s.id !== script.id));
    }
  }

  const selectClass =
    "bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent-violet/60";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Biblioteca de guiones</h1>
        <p className="text-sm text-muted mt-1">
          Guiones guardados, listos para copiar o exportar y pasarle a tus editores o clientes.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={funnelStage}
          onChange={(e) => setFunnelStage(e.target.value as FunnelStage | "")}
          className={selectClass}
        >
          <option value="">Todas las etapas</option>
          <option value="TOFU">TOFU</option>
          <option value="MOFU">MOFU</option>
          <option value="BOFU">BOFU</option>
        </select>

        <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={selectClass}>
          <option value="">Todos los clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-muted px-3 py-2.5 rounded-xl border border-border bg-surface cursor-pointer">
          <input
            type="checkbox"
            checked={favoriteOnly}
            onChange={(e) => setFavoriteOnly(e.target.checked)}
            className="accent-[var(--accent-violet)]"
          />
          Solo favoritos
        </label>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
        </div>
      )}

      {!loading && scripts.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
          <BookmarkX className="w-10 h-10" />
          <p className="text-sm">Todavía no guardaste guiones con estos filtros.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {scripts.map((script) => (
          <ScriptCard
            key={script.id}
            script={script}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteScript}
          />
        ))}
      </div>
    </div>
  );
}
