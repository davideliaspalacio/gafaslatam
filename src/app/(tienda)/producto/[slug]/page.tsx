import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/store/product-page";
import { getActiveProducts, getProductBySlug, getPublishedReviews, getSettings } from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = product.seo_title ?? `${product.name} · Gafas inteligentes con cámara`;
  const description = product.seo_description ?? product.short_description ?? undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductRoute({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSettings()]);
  if (!product) notFound();
  const reviews = await getPublishedReviews(product.id);
  return <ProductPage product={product} settings={settings} reviews={reviews} />;
}
