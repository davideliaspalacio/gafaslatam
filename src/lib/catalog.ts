import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { DEMO_SETTINGS } from "@/lib/demo-data";
import { MODELOS, type Modelo } from "@/lib/productos";
import { hasShopify, productosShopify, type ShopifyProducto } from "@/lib/shopify";
import { publicClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";
import type { ReviewRow, SettingsRow } from "@/lib/types";

export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";
export const REVIEWS_TAG = "reviews";
export const SHOPIFY_TAG = "shopify";

const FALLBACK_SETTINGS: SettingsRow = {
  id: 1,
  store_name: "Tienda",
  whatsapp_number: null,
  support_email: null,
  announcement: null,
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
  instagram_handle: null,
  tiktok_handle: null,
  facebook_url: null,
  hero_video_url: null,
  hero_poster_url: null,
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<SettingsRow> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);
  if (!hasSupabase()) return DEMO_SETTINGS;
  const { data } = await publicClient().from("store_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? FALLBACK_SETTINGS;
}

/** Reseñas publicadas desde /admin (de la tienda en general). */
export async function getPublishedReviews(): Promise<ReviewRow[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(REVIEWS_TAG);
  if (!hasSupabase()) return [];
  const { data } = await publicClient()
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(12);
  return data ?? [];
}

// ---------- Modelos: textos de src/lib/productos.ts + precio y fotos de Shopify ----------

export type ModeloTienda = Modelo & {
  precio: number;
  imagenes: { url: string; alt: string; ancho?: number; alto?: number }[];
  varianteId: string | null;
  disponible: boolean;
};

/** Precio y fotos salen de Shopify (se refrescan cada pocos minutos). Si Shopify falla, se usa el precio de respaldo. */
export async function getModelos(): Promise<ModeloTienda[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SHOPIFY_TAG);
  let shop = new Map<string, ShopifyProducto>();
  if (hasShopify()) {
    try {
      shop = await productosShopify(MODELOS.map((m) => m.shopifyProductId));
    } catch (error) {
      console.error("Catálogo de Shopify", error);
    }
  }
  return MODELOS.map((m) => {
    const s = shop.get(m.shopifyProductId);
    return {
      ...m,
      precio: s?.precio ?? m.precioRespaldo,
      // Primero las fotos propias revisadas; las de Shopify solo si el modelo lo permite.
      imagenes: [
        ...m.fotos.map((f) => ({ url: f.src, alt: f.alt, ancho: f.ancho, alto: f.alto })),
        ...(m.fotosDeShopify ? (s?.imagenes ?? []).map((i) => ({ url: i.url, alt: i.alt })) : []),
      ],
      varianteId: s?.varianteId ?? null,
      disponible: s ? s.activo : true,
    };
  });
}

export async function getModelo(slug: string): Promise<ModeloTienda | null> {
  return (await getModelos()).find((m) => m.slug === slug) ?? null;
}
