import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderForm } from "@/components/store/order-form";
import { getModelos } from "@/lib/catalog";
import { MAX_CANTIDAD } from "@/lib/productos";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: true },
};

export default function OrderPage({ searchParams }: PageProps<"/pedido">) {
  return (
    <main className="mx-auto max-w-6xl px-5 pt-10 pb-20 md:pt-14">
      <h1 className="type-display text-[2.5rem] sm:text-5xl">Tu pedido</h1>
      <p className="type-hand mt-3 -rotate-1 text-[1.5rem] text-night/80">pagas cuando te llegue</p>
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
  const modelos = await getModelos();
  const inicial = typeof sp.modelo === "string" ? sp.modelo : modelos[0].slug;

  return (
    <OrderForm
      inicial={inicial}
      maxCantidad={MAX_CANTIDAD}
      modelos={modelos.map((m) => ({
        slug: m.slug,
        nombre: m.nombre,
        corto: m.corto,
        sku: m.sku,
        precio: m.precio,
        paraQue: m.comparacion.paraQue,
        imagen: m.imagenes[0] ?? null,
        disponible: m.disponible,
      }))}
    />
  );
}
