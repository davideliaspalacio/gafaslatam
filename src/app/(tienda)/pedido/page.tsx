import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderForm } from "@/components/store/order-form";
import { getModelos, getSettings } from "@/lib/catalog";
import { aModeloForm } from "@/lib/pedido";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: true },
};

// Respaldo de la hoja de pedido: enlaces directos (/pedido?modelo=biker&cantidad=2) y botones
// tocados antes de que cargue la hoja. El mismo formulario, con los campos lo más arriba posible.
export default function OrderPage({ searchParams }: PageProps<"/pedido">) {
  return (
    <main className="mx-auto max-w-[32rem] px-5 pt-6 pb-10 md:pt-12 md:pb-20">
      <h1 className="type-display text-[1.75rem] sm:text-[2.25rem]">Tu pedido</h1>
      <div className="mt-5">
        <Suspense fallback={<Esqueleto />}>
          <OrderContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function OrderContent({ searchParams }: { searchParams: PageProps<"/pedido">["searchParams"] }) {
  const [sp, modelos, settings] = await Promise.all([searchParams, getModelos(), getSettings()]);
  const modelo = typeof sp.modelo === "string" ? sp.modelo : null;
  const cantidad = typeof sp.cantidad === "string" && /^\d$/.test(sp.cantidad) ? Number(sp.cantidad) : null;

  return (
    <OrderForm variante="pagina" modelo={modelo} cantidad={cantidad} whatsapp={settings.whatsapp_number} modelos={modelos.map(aModeloForm)} />
  );
}

function Esqueleto() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando el formulario">
      <div className="h-[78px] animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-16 animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-[84px] animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-[52px] animate-pulse rounded-[12px] bg-cream-2/70" />
      <div className="h-[52px] animate-pulse rounded-[12px] bg-cream-2/70" />
    </div>
  );
}
