import type { Metadata } from "next";
import { Suspense } from "react";
import { PedidoSheet } from "@/components/store/pedido-sheet";
import { PromoAviso } from "@/components/store/promo-aviso";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { Pixels } from "@/components/tracking/pixels";
import { getModelos, getSettings } from "@/lib/catalog";
import { aModeloForm } from "@/lib/pedido";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: `${settings.store_name} · Graba lo que vives`, template: `%s · ${settings.store_name}` },
    description: "Gafas con cámara para el deporte y para el día a día. Graba lo que vives sin sacar el celular. Envío gratis a toda Colombia y pagas al recibir.",
    openGraph: {
      siteName: settings.store_name,
      locale: "es_CO",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Gafas Latam · Graba lo que vives" }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter settings={settings} />
      {/* La hoja de pedido y el aviso de la promoción, una sola vez para toda la tienda. */}
      <Suspense fallback={null}>
        <Pedido whatsapp={settings.whatsapp_number} />
      </Suspense>
      <Pixels tiktokPixelId={settings.tiktok_pixel_id} metaPixelId={settings.meta_pixel_id} />
    </>
  );
}

/** Lee los modelos (precio en vivo de Shopify, en caché) aparte, para no frenar el resto de la página. */
async function Pedido({ whatsapp }: { whatsapp: string | null }) {
  const modelos = await getModelos();
  return (
    <>
      <PedidoSheet whatsapp={whatsapp} modelos={modelos.map(aModeloForm)} />
      <PromoAviso modelos={modelos.filter((m) => m.disponible).map((m) => ({ slug: m.slug, precio: m.precio, corto: m.corto }))} />
    </>
  );
}
