// Atribución de la visita (UTM y clics de anuncios). Se guarda en la cookie `gl_attr`
// desde el navegador y el servidor la lee al crear el pedido. Sin datos personales.

export const ATTR_COOKIE = "gl_attr";
export const ATTR_MAX_AGE = 30 * 24 * 60 * 60; // 30 días

const LIMITS = {
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 160,
  utm_content: 160,
  utm_term: 160,
  ttclid: 300,
  fbclid: 300,
  landing_page: 300,
  referrer: 200,
} as const;

export type AttrField = keyof typeof LIMITS;
export type Attribution = Partial<Record<AttrField, string>>;

export const CAMPAIGN_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ttclid", "fbclid"] as const;

/** Deja solo campos conocidos, como texto y recortados. Sirve para lo que llega del navegador. */
export function cleanAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const out: Attribution = {};
  for (const [key, max] of Object.entries(LIMITS) as [AttrField, number][]) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim().slice(0, max);
  }
  return out;
}

export function parseAttributionCookie(raw: string | undefined | null): Attribution {
  if (!raw) return {};
  try {
    return cleanAttribution(JSON.parse(decodeURIComponent(raw)));
  } catch {
    return {};
  }
}
