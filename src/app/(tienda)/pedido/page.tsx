import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderForm } from "@/components/store/order-form";
import { getFeaturedProduct, getProductBySlug, getSettings } from "@/lib/catalog";
import { bundlesOf } from "@/lib/types";
import { wompiConfigured } from "@/lib/wompi";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: true },
};

export default function OrderPage({ searchParams }: PageProps<"/pedido">) {
  return (
    <main className="mx-auto max-w-6xl px-5 pt-10 pb-20 md:pt-14">
      <h1 className="type-display text-[2.5rem] sm:text-5xl">Tu pedido</h1>
      <p className="type-hand mt-3 -rotate-1 text-[1.5rem] text-night/80">te escribimos antes de despachar</p>
      <div className="mt-10">
        <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-[14px] bg-cream-2/60" />}>
          <OrderContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function OrderContent({ searchParams }: { searchParams: PageProps<"/pedido">["searchParams"] }) {
  const sp = await searchParams;
  const slug = typeof sp.modelo === "string" ? sp.modelo : null;
  const color = typeof sp.color === "string" ? sp.color : null;
  const [product, settings] = await Promise.all([slug ? getProductBySlug(slug) : getFeaturedProduct(), getSettings()]);
  if (!product) notFound();

  return (
    <OrderForm
      product={{
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? null,
        variants: product.variants,
        bundles: bundlesOf(product),
      }}
      initialColor={color}
      shipping={settings.free_shipping ? 0 : settings.shipping_cost}
      codEnabled={settings.cod_enabled}
      onlineEnabled={settings.online_payment_enabled && wompiConfigured()}
      deliveryEstimate={settings.delivery_estimate}
    />
  );
}
