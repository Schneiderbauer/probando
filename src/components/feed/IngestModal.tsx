"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import type { CompetitorVideoDTO } from "@/types";

const NICHE_SUGGESTIONS = ["salud", "odontologia", "psicologia", "construccion", "belleza", "legal", "fitness"];

export default function IngestModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (video: CompetitorVideoDTO) => void;
}) {
  const [platform, setPlatform] = useState<"TIKTOK" | "INSTAGRAM" | "OTHER">("TIKTOK");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [niche, setNiche] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [transcript, setTranscript] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          url: url || undefined,
          title,
          authorHandle: authorHandle || undefined,
          niche,
          painPoints,
          transcript,
          thumbnailUrl: thumbnailUrl || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.formErrors?.join(", ") || "No se pudo guardar la referencia");
      }

      const created = await res.json();
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent-violet/60";

  return (
    <Modal title="Agregar referencia de competencia" onClose={onClose} maxWidthClass="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-xs text-muted -mt-1">
          Pegá el link del video de TikTok/Instagram y su transcripción o metadatos. Esto simula la
          ingesta: no se descarga el video, se guarda como referencia analizable.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5">Plataforma</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as typeof platform)}
              className={inputClass}
            >
              <option value="TIKTOK">TikTok</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Handle del autor</label>
            <input
              value={authorHandle}
              onChange={(e) => setAuthorHandle(e.target.value)}
              placeholder="@competidor"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Link del video</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@usuario/video/..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Título / resumen del video *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: 3 señales de que necesitás un blanqueamiento"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nicho *</label>
            <input
              required
              list="niche-suggestions"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="odontologia"
              className={inputClass}
            />
            <datalist id="niche-suggestions">
              {NICHE_SUGGESTIONS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Thumbnail (URL, opcional)</label>
            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">
            Puntos de dolor detectados * (separados por coma)
          </label>
          <input
            required
            value={painPoints}
            onChange={(e) => setPainPoints(e.target.value)}
            placeholder="vergüenza al sonreír, dientes amarillos, inseguridad"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Transcripción o guion del video *</label>
          <textarea
            required
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            placeholder="Pegá acá la transcripción completa o los puntos clave del guion…"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs text-muted mb-1.5">Notas internas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Por qué te sirve esta referencia…"
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-pink-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-surface-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-brand text-white disabled:opacity-60"
          >
            {submitting ? "Guardando…" : "Guardar referencia"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
