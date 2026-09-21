"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import FunnelBadge from "@/components/FunnelBadge";
import VideoEmbed from "./VideoEmbed";
import { Check, Copy, Loader2, Save, Sparkles } from "lucide-react";
import clsx from "clsx";
import {
  FUNNEL_STAGE_DESCRIPTIONS,
  type ClientDTO,
  type CompetitorVideoDTO,
  type FunnelStage,
  type GeneratedScript,
} from "@/types";

const FUNNEL_STAGES: FunnelStage[] = ["TOFU", "MOFU", "BOFU"];

export default function GenerateModal({
  video,
  onClose,
}: {
  video: CompetitorVideoDTO;
  onClose: () => void;
}) {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [clientId, setClientId] = useState<string>("");
  const [newClientName, setNewClientName] = useState("");
  const [variantCount, setVariantCount] = useState(3);
  const [funnelStage, setFunnelStage] = useState<FunnelStage>("TOFU");
  const initialAngle = video.painPoints.split(",")[0]?.trim() || "";
  const [angle, setAngle] = useState(initialAngle);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<GeneratedScript[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const painPointOptions = video.painPoints
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(() => setClients([]));
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setVariants([]);
    setSavedIds(new Set());

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorVideoId: video.id,
          clientId: clientId || undefined,
          newClientName: !clientId ? newClientName || undefined : undefined,
          variantCount,
          funnelStage,
          angle,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.formErrors?.join(", ") || "No se pudieron generar los guiones");
      }

      const data = await res.json();
      setVariants(data.variants);
      if (data.client && !clientId) {
        setClients((prev) => [...prev, data.client]);
        setClientId(data.client.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave(script: GeneratedScript) {
    const res = await fetch("/api/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...script,
        competitorVideoId: video.id,
        clientId: clientId || undefined,
      }),
    });
    if (res.ok) {
      setSavedIds((prev) => new Set(prev).add(script.variantNo));
    }
  }

  async function handleCopy(script: GeneratedScript) {
    await navigator.clipboard.writeText(script.fullText);
    setCopiedId(script.variantNo);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const inputClass =
    "w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent-violet/60";

  return (
    <Modal title="Generar guiones desde esta referencia" onClose={onClose} maxWidthClass="max-w-3xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl bg-surface-2 border border-border">
          <div className="w-full sm:w-[220px] shrink-0 rounded-lg overflow-hidden mx-auto sm:mx-0">
            <VideoEmbed
              platform={video.platform}
              url={video.url}
              thumbnailUrl={video.thumbnailUrl}
              title={video.title}
              eager
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{video.title}</p>
            <p className="text-xs text-muted mt-1">
              {video.niche} · {video.authorHandle || "referencia manual"}
            </p>
            {video.notes && <p className="text-xs text-muted mt-2 leading-relaxed">{video.notes}</p>}
            {video.url && (
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent-violet hover:underline mt-2 inline-block"
              >
                Ver publicación original ↗
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">
                ¿Para qué cliente o negocio es?
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className={inputClass}
              >
                <option value="">+ Crear cliente nuevo…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {!clientId && (
                <input
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Nombre del nuevo cliente (ej: Néstor Construcciones)"
                  className={clsx(inputClass, "mt-2")}
                />
              )}
              {funnelStage === "BOFU" &&
                !clients.find((c) => c.id === clientId)?.whatsapp && (
                  <p className="text-[11px] text-amber-400 mt-1.5">
                    Este cliente no tiene WhatsApp cargado — el CTA va a quedar genérico. Agregalo en{" "}
                    <a href="/clients" className="underline">
                      Clientes
                    </a>
                    .
                  </p>
                )}
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">¿Cuántas variantes?</label>
              <select
                value={variantCount}
                onChange={(e) => setVariantCount(Number(e.target.value))}
                className={inputClass}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} variante{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-2">¿Qué etapa del embudo?</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {FUNNEL_STAGES.map((stage) => (
                <button
                  type="button"
                  key={stage}
                  onClick={() => setFunnelStage(stage)}
                  className={clsx(
                    "text-left p-3 rounded-xl border transition-colors",
                    funnelStage === stage
                      ? "border-accent-violet bg-accent-violet/10"
                      : "border-border bg-surface-2 hover:border-accent-violet/40"
                  )}
                >
                  <FunnelBadge stage={stage} />
                  <p className="text-xs text-muted mt-2 leading-snug">
                    {FUNNEL_STAGE_DESCRIPTIONS[stage]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">
              ¿Qué ángulo o punto de dolor querés tocar?
            </label>
            <input
              list="angle-suggestions"
              required
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="Ej: vergüenza al sonreír"
              className={inputClass}
            />
            <datalist id="angle-suggestions">
              {painPointOptions.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          {error && <p className="text-sm text-pink-400">{error}</p>}

          <button
            type="submit"
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl gradient-brand text-white text-sm font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generando guiones…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generar {variantCount} variante
                {variantCount > 1 ? "s" : ""}
              </>
            )}
          </button>
        </form>

        {variants.length > 0 && (
          <div className="flex flex-col gap-4 pt-2 border-t border-border">
            <p className="text-sm font-semibold pt-4">Guiones generados</p>
            {variants.map((script) => (
              <div
                key={script.variantNo}
                className="rounded-xl border border-border bg-surface-2 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted">
                      Variante {script.variantNo}
                    </span>
                    <FunnelBadge stage={script.funnelStage} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(script)}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-surface"
                    >
                      {copiedId === script.variantNo ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      Copiar
                    </button>
                    <button
                      onClick={() => handleSave(script)}
                      disabled={savedIds.has(script.variantNo)}
                      className={clsx(
                        "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg",
                        savedIds.has(script.variantNo)
                          ? "text-emerald-400 bg-emerald-400/10"
                          : "text-white gradient-brand hover:opacity-90"
                      )}
                    >
                      {savedIds.has(script.variantNo) ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Guardado
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">
                    Gancho (0-3s)
                  </p>
                  <p className="text-sm font-medium">{script.hook}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">
                    Desarrollo
                  </p>
                  <p className="text-sm text-foreground/90 whitespace-pre-line">
                    {script.development}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">CTA</p>
                  <p className="text-sm font-medium text-accent-cyan">{script.cta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
