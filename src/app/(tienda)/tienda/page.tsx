import type { Metadata } from "next";
import { CualEsParaTi } from "@/components/store/cual-es-para-ti";
import { ModeloCard } from "@/components/store/product-card";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { getModelos, getSettings } from "@/lib/catalog";
import { COLECCIONES } from "@/lib/productos";
import { whatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Gafas con cámara para el deporte y gafas con cámara e IA para el día a día. Envío gratis a toda Colombia y pagas al recibir.",
  alternates: { canonical: "/tienda" },
  openGraph: { url: "/tienda" },
};

export default async function StorePage() {
  const [modelos, settings] = await Promise.all([getModelos(), getSettings()]);
  const colecciones = Object.values(COLECCIONES)
    .map((c) => ({ ...c, modelos: modelos.filter((m) => m.coleccion.slug === c.slug) }))
    .filter((c) => c.modelos.length);

  return (
    <main className="pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14">
        <h1 className="type-display text-[2.5rem] sm:text-5xl">Tienda</h1>
        <p className="mt-3 max-w-lg text-ink-soft">
          Dos colecciones, un modelo en cada una. Las dos con envío gratis y pago en efectivo al recibir.
        </p>
      </div>

      {/* Una colección por columna desde 768 px; en el celular, una debajo de la otra. */}
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-16 px-5 pt-10 md:grid-cols-2">
        {colecciones.map((c, ci) => (
          <section key={c.slug} id={c.slug} aria-labelledby={`t-${c.slug}`} className="flex scroll-mt-6 flex-col">
            <div className="border-t-2 border-night pt-5">
              <h2 id={`t-${c.slug}`} className="type-display text-[1.6rem] sm:text-3xl">
                {c.nombre}
              </h2>
              <p className="mt-1 text-ink-soft">{c.descripcion}</p>
            </div>
            <ul className="mt-6 grid flex-1 gap-y-14">
              {c.modelos.map((m, i) => (
                <li key={m.slug}>
                  <ModeloCard modelo={m} preload={ci === 0 && i === 0} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-4xl px-5 pt-20">
        <CualEsParaTi modelos={modelos} />
      </section>

      <WhatsAppFloat number={settings.whatsapp_number} text={whatsappText()} />
    </main>
  );
}
