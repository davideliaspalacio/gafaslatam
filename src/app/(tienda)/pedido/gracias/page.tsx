import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Gracias } from "@/components/store/gracias";
import { getSettings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Pedido recibido",
  robots: { index: false, follow: false },
};

export default function ThanksPage({ searchParams }: PageProps<"/pedido/gracias">) {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 md:pt-16">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-[14px] bg-cream-2/60" />}>
        <ThanksContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function ThanksContent({ searchParams }: { searchParams: PageProps<"/pedido/gracias">["searchParams"] }) {
  const sp = await searchParams;
  const numero = typeof sp.n === "string" && /^\d{1,10}$/.test(sp.n) ? sp.n : null;
  const settings = await getSettings();

  if (!numero) {
    return (
      <>
        <h1 className="type-display text-[2.5rem] sm:text-5xl">No encontramos ese pedido</h1>
        <p className="mt-4 text-ink-soft">
          Si acabas de pedir, escríbenos por WhatsApp y lo revisamos.{" "}
          <Link href="/tienda" className="font-semibold text-ink underline">
            Volver a la tienda
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="type-label text-[0.7rem] text-ink-soft">Pedido #{numero}</p>
      <h1 className="type-display mt-2 text-[2.5rem] sm:text-5xl">¡Recibimos tu pedido!</h1>
      <p className="mt-4 max-w-xl text-[1.125rem] leading-snug font-semibold text-ink">
        Falta un paso: confírmalo por WhatsApp para que lo despachemos.
      </p>
      <div className="mt-6">
        <Gracias numero={numero} whatsapp={settings.whatsapp_number} />
      </div>
      <p className="type-hand mt-10 -rotate-1 text-[1.6rem] text-night/80">gracias por confiar en nosotros</p>
    </>
  );
}
