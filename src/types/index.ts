export type FunnelStage = "TOFU" | "MOFU" | "BOFU";
export type Platform = "TIKTOK" | "INSTAGRAM" | "OTHER";

export const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  TOFU: "TOFU · Atracción",
  MOFU: "MOFU · Autoridad",
  BOFU: "BOFU · Venta",
};

export const FUNNEL_STAGE_DESCRIPTIONS: Record<FunnelStage, string> = {
  TOFU: "Atracción masiva: dolor + curiosidad, sin pedir nada a cambio.",
  MOFU: "Autoridad y educación: demuestra expertise y genera confianza.",
  BOFU: "Venta directa: llamado a la acción claro hacia la conversión.",
};

export interface GeneratedScript {
  variantNo: number;
  funnelStage: FunnelStage;
  angle: string;
  hook: string;
  development: string;
  cta: string;
  fullText: string;
  model: string;
}

export interface CompetitorVideoDTO {
  id: string;
  platform: Platform;
  url: string | null;
  title: string;
  authorHandle: string | null;
  niche: string;
  painPoints: string;
  transcript: string;
  thumbnailUrl: string | null;
  notes: string | null;
  metrics: string | null;
  createdAt: string;
}

export interface ClientDTO {
  id: string;
  name: string;
  industry: string | null;
  whatsapp: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptDTO {
  id: string;
  funnelStage: FunnelStage;
  angle: string;
  hook: string;
  development: string;
  cta: string;
  fullText: string;
  favorite: boolean;
  variantNo: number;
  model: string;
  createdAt: string;
  client: ClientDTO | null;
  competitorVideo: CompetitorVideoDTO | null;
}

export interface GenerateScriptsParams {
  competitorVideo: {
    title: string;
    niche: string;
    painPoints: string;
    transcript: string;
    platform: Platform;
  };
  clientName: string;
  clientIndustry?: string | null;
  clientWhatsapp?: string | null;
  variantCount: number;
  funnelStage: FunnelStage;
  angle: string;
}
