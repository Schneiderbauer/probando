"use client";

import { useState } from "react";
import { MessageCircle, Plus, Trash2, Users2 } from "lucide-react";
import type { ClientDTO } from "@/types";

export default function ClientsClient({ initialClients }: { initialClients: ClientDTO[] }) {
  const [clients, setClients] = useState<ClientDTO[]>(initialClients);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          industry: industry || undefined,
          whatsapp: whatsapp || undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear el cliente");
      const created = await res.json();
      setClients((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setIndustry("");
      setWhatsapp("");
      setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) setClients((prev) => prev.filter((c) => c.id !== id));
  }

  const inputClass =
    "w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-accent-violet/60";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted mt-1">
          Los negocios para los que generás guiones. Aparecen al configurar cada generación.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-border bg-surface"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (ej: Néstor Construcciones)"
          className={inputClass}
        />
        <input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Rubro (ej: Construcción)"
          className={inputClass}
        />
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp (ej: +54 9 11 1234-5678)"
          className={inputClass}
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas (opcional)"
          className={inputClass}
        />
        {error && <p className="text-sm text-pink-400 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl gradient-brand text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> Agregar cliente
        </button>
      </form>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
          <Users2 className="w-10 h-10" />
          <p className="text-sm">Todavía no cargaste clientes.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 p-4 rounded-xl border border-border bg-surface"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{c.name}</p>
                {c.industry && <p className="text-xs text-muted mt-0.5">{c.industry}</p>}
                {c.whatsapp && (
                  <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1">
                    <MessageCircle className="w-3.5 h-3.5" /> {c.whatsapp}
                  </p>
                )}
                {c.notes && <p className="text-xs text-muted mt-1.5 line-clamp-2">{c.notes}</p>}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-lg text-muted hover:text-pink-400 hover:bg-surface-2 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
