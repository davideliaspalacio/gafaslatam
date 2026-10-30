import type { MetadataRoute } from "next";
import { SLUGS } from "@/lib/productos";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tienda`, changeFrequency: "weekly", priority: 0.9 },
    ...SLUGS.map((slug) => ({ url: `${SITE_URL}/gafas/${slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: `${SITE_URL}/envios-y-garantia`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.4 },
    ...["terminos", "privacidad", "retracto"].map((slug) => ({
      url: `${SITE_URL}/politicas/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
