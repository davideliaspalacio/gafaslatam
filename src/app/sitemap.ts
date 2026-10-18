import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/catalog";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${site}/producto/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...["envios", "cambios-y-garantia", "privacidad", "terminos"].map((slug) => ({
      url: `${site}/politicas/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
