export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

export function parseMetrics(metrics: string | null): { likes?: number; comments?: number; views?: number } {
  if (!metrics) return {};
  try {
    return JSON.parse(metrics);
  } catch {
    return {};
  }
}
