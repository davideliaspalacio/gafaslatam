import type { Metadata } from "next";
import { Catalog } from "@/components/store/catalog";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { getActiveProducts, getSettings } from "@/lib/catalog";
import { whatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Todos los modelos de gafas con cámara, con audio y de sol. Envío gratis a toda Colombia y pagas al recibir.",
  alternates: { canonical: "/tienda" },
  openGraph: { url: "/tienda" },
};

export default async function StorePage() {
  const [products, settings] = await Promise.all([getActiveProducts(), getSettings()]);
  return (
    <main className="mx-auto max-w-6xl px-5 pt-10 pb-20 md:pt-14">
      <h1 className="type-display text-[2.5rem] sm:text-5xl">Tienda</h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        {products.length === 1
          ? "Por ahora tenemos un modelo. Vienen más pronto."
          : `${products.length} modelos. Todos con envío gratis y pago al recibir.`}
      </p>
      <div className="mt-8">
        <Catalog
          products={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: p.price,
            images: p.images.slice(0, 1),
            tags: p.tags,
            badge: p.badge,
            headline: p.headline,
          }))}
        />
      </div>
      <WhatsAppFloat number={settings.whatsapp_number} text={whatsappText()} />
    </main>
  );
}
