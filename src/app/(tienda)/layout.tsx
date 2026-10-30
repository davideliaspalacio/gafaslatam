import type { Metadata } from "next";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { Pixels } from "@/components/tracking/pixels";
import { getSettings } from "@/lib/catalog";

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
      <SiteHeader announcement={settings.announcement} />
      {children}
      <SiteFooter settings={settings} />
      <Pixels tiktokPixelId={settings.tiktok_pixel_id} metaPixelId={settings.meta_pixel_id} />
    </>
  );
}
