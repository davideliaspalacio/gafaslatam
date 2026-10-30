import type { SettingsRow } from "@/lib/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Imagen de portada por defecto: la toma real en primera persona del brief. */
export const DEFAULT_HERO_POSTER = "/media/pov.jpg";

export const TAGS = {
  camara: "Con cámara",
  audio: "Con audio",
  sol: "De sol",
} as const;

export type Tag = keyof typeof TAGS;

export function socialLinks(s: SettingsRow) {
  return [
    s.instagram_handle ? { name: "Instagram", handle: `@${s.instagram_handle}`, url: `https://instagram.com/${s.instagram_handle}` } : null,
    s.tiktok_handle ? { name: "TikTok", handle: `@${s.tiktok_handle}`, url: `https://www.tiktok.com/@${s.tiktok_handle}` } : null,
    s.facebook_url ? { name: "Facebook", handle: s.facebook_url.replace(/^https?:\/\/(www\.)?/, ""), url: s.facebook_url } : null,
  ].filter((x): x is { name: string; handle: string; url: string } => Boolean(x));
}

/**
 * Mensaje de WhatsApp ya escrito, con el modelo cuando lo hay. La referencia de campaña se agrega en el navegador.
 * - "dudas" (por defecto): "Hola, quiero info de las gafas Biker con cámara"
 * - "pedir": "Hola, quiero pedir las gafas Biker con cámara" / sin modelo: "Hola, quiero pedir unas gafas. ¿Me ayudas?"
 * Acepta el nombre completo del modelo ("Gafas Biker con cámara") y no repite "gafas".
 */
export function whatsappText(model?: string | null, intencion: "dudas" | "pedir" = "dudas") {
  const nombre = model?.trim().replace(/^gafas\s+/i, "");
  if (intencion === "pedir") {
    return nombre ? `Hola, quiero pedir las gafas ${nombre}` : "Hola, quiero pedir unas gafas. ¿Me ayudas?";
  }
  return nombre ? `Hola, quiero info de las gafas ${nombre}` : "Hola, quiero info de las gafas";
}

/** Número de WhatsApp como se lee en Colombia: "573007568489" → "300 756 8489". */
export function whatsappLocal(number: string | null | undefined) {
  const digits = number?.replace(/\D/g, "").replace(/^57(?=3\d{9}$)/, "");
  if (!digits) return null;
  return digits.length === 10 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : digits;
}

export function whatsappHref(number: string | null | undefined, text: string) {
  if (!number) return null;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
