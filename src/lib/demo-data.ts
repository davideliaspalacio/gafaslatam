import type { SettingsRow } from "@/lib/types";

// Ajustes de ejemplo para el modo demo (sin Supabase). Es el mismo contenido de
// supabase/seed.sql: al conectar la base de datos, la tienda lee de allí.


export const DEMO_SETTINGS: SettingsRow = {
  id: 1,
  store_name: "Gafas Latam",
  whatsapp_number: "573007568489",
  support_email: "gafaslatam@gmail.com",
  announcement: "Envío gratis a toda Colombia · Pagas al recibir",
  shipping_cost: 0,
  free_shipping: true,
  delivery_estimate: "2 a 5 días hábiles",
  cod_enabled: true,
  online_payment_enabled: false,
  tiktok_pixel_id: null,
  meta_pixel_id: null,
  legal_name: null,
  tax_id: null,
  legal_address: null,
  instagram_handle: "gafaslatam",
  tiktok_handle: "gafaslatam",
  facebook_url: "https://facebook.com/gafaslatam",
  hero_video_url: null,
  hero_poster_url: null,
  updated_at: "2026-10-18T19:00:00.000Z",
};
