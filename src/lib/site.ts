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

/** Mensaje de WhatsApp: con el modelo cuando lo hay. La referencia de campaña se agrega en el navegador. */
export function whatsappText(model?: string | null) {
  return model ? `Hola, quiero info de las gafas ${model}` : "Hola, quiero info de las gafas";
}

export function whatsappHref(number: string | null | undefined, text: string) {
  if (!number) return null;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
