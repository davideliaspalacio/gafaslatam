import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { publicClient } from "@/lib/supabase/clients";
import { toProduct, type Product, type ReviewRow, type SettingsRow } from "@/lib/types";

export const CATALOG_TAG = "catalog";
export const SETTINGS_TAG = "settings";
export const REVIEWS_TAG = "reviews";

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
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<SettingsRow> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);
  const { data } = await publicClient().from("store_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? FALLBACK_SETTINGS;
}

export async function getFeaturedProduct(): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const { data } = await publicClient()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("sort")
    .limit(1)
    .maybeSingle();
  return data ? toProduct(data) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const { data } = await publicClient().from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
  return data ? toProduct(data) : null;
}

export async function getActiveProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const { data } = await publicClient().from("products").select("*").eq("active", true).order("sort");
  return (data ?? []).map(toProduct);
}

export async function getPublishedReviews(productId: string): Promise<ReviewRow[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(REVIEWS_TAG);
  const { data } = await publicClient()
    .from("reviews")
    .select("*")
    .eq("published", true)
    .or(`product_id.eq.${productId},product_id.is.null`)
    .order("created_at", { ascending: false })
    .limit(12);
  return data ?? [];
}
