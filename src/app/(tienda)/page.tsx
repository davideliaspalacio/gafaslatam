import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/store/product-page";
import { getFeaturedProduct, getPublishedReviews, getSettings } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const [product, settings] = await Promise.all([getFeaturedProduct(), getSettings()]);
  if (!product) return { title: settings.store_name };
  const title = product.seo_title ?? `${product.name} · Gafas inteligentes con cámara`;
  const description = product.seo_description ?? product.short_description ?? undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const [product, settings] = await Promise.all([getFeaturedProduct(), getSettings()]);
  if (!product) notFound();
  const reviews = await getPublishedReviews(product.id);
  return <ProductPage product={product} settings={settings} reviews={reviews} />;
}
