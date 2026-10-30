import type { Metadata } from "next";
import Link from "next/link";
import { LegalBlocks } from "@/components/store/legal";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { getSettings } from "@/lib/catalog";
import { shipping, warranty } from "@/lib/policies";
import { whatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Envíos y garantía",
  description: "Envío gratis a toda Colombia, pagas al recibir y garantía de fábrica. Así funciona.",
  alternates: { canonical: "/envios-y-garantia" },
};

export default async function ShippingPage() {
  const settings = await getSettings();
  return (
    <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 md:pt-14">
      <h1 className="type-display text-[2.5rem] sm:text-5xl">Envíos y garantía</h1>
      <p className="mt-4 max-w-xl text-[1.0625rem] text-ink-soft">
        Lo corto: te llegan en {settings.delivery_estimate.toLowerCase()}, {settings.free_shipping ? "el envío es gratis" : "a toda Colombia"} y
        {settings.cod_enabled ? " pagas cuando las tienes en la mano." : " pagas en línea de forma segura."}
      </p>
      <div className="mt-12">
        <LegalBlocks blocks={[...shipping(settings), ...warranty(settings)]} />
      </div>
      <p className="mt-10 text-ink-soft">
        ¿Quieres devolverlas? Mira el{" "}
        <Link href="/politicas/retracto" className="font-semibold text-ink underline">
          derecho de retracto
        </Link>
        .
      </p>
      <WhatsAppFloat number={settings.whatsapp_number} text={whatsappText()} />
    </main>
  );
}
