import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tienda`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${SITE_URL}/gafas/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    { url: `${SITE_URL}/envios-y-garantia`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.4 },
    ...["terminos", "privacidad", "retracto"].map((slug) => ({
      url: `${SITE_URL}/politicas/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
