import { ArrowLeft, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonPrimary } from "@/components/store/buttons";
import { CualEsParaTi } from "@/components/store/cual-es-para-ti";
import { ProductJsonLd } from "@/components/store/json-ld";
import { Photo } from "@/components/store/photo";
import { RecFrame } from "@/components/store/rec-frame";
import { Faq, TrustStrip } from "@/components/store/sections";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { ViewContent } from "@/components/store/view-content";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { getModelo, getModelos, getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { SLUGS, modeloPorSlug } from "@/lib/productos";
import { DEFAULT_HERO_POSTER, whatsappText } from "@/lib/site";

export function generateStaticParams() {
  return SLUGS.map((modelo) => ({ modelo }));
}

export async function generateMetadata({ params }: PageProps<"/gafas/[modelo]">): Promise<Metadata> {
  const { modelo: slug } = await params;
  const modelo = modeloPorSlug(slug);
  if (!modelo) return {};
  return {
    title: { absolute: `${modelo.seo.titulo} | Gafas Latam` },
    description: modelo.seo.descripcion,
    alternates: { canonical: `/gafas/${modelo.slug}` },
    openGraph: { title: modelo.seo.titulo, description: modelo.seo.descripcion, url: `/gafas/${modelo.slug}` },
  };
}

export default function ModelPage({ params }: PageProps<"/gafas/[modelo]">) {
  return (
    <Suspense fallback={<ModelSkeleton />}>
      <Model params={params} />
    </Suspense>
  );
}

function ModelSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-16 pb-20 md:grid-cols-[1.1fr_1fr]">
      <div className="aspect-square animate-pulse rounded-[14px] bg-cream-2" />
      <div className="space-y-4">
        <div className="h-12 w-2/3 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-6 w-1/2 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-[52px] w-full animate-pulse rounded-full bg-cream-2 sm:w-64" />
      </div>
    </div>
  );
}

async function Model({ params }: { params: PageProps<"/gafas/[modelo]">["params"] }) {
  const { modelo: slug } = await params;
  const [modelo, modelos, settings] = await Promise.all([getModelo(slug), getModelos(), getSettings()]);
  if (!modelo) notFound();

  const [cover, ...rest] = modelo.imagenes;
  const wa = settings.whatsapp_number;
  const orderHref = `/pedido?modelo=${modelo.slug}`;

  return (
    <main>
      <ProductJsonLd modelo={modelo} settings={settings} />
      <ViewContent sku={modelo.sku} name={modelo.nombre} price={modelo.precio} />

      <div className="mx-auto max-w-6xl px-5 pt-5 md:pt-8">
        <Link href="/tienda" className="inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Tienda
        </Link>
      </div>

      <section className="mx-auto grid max-w-6xl gap-x-14 gap-y-8 px-5 pt-2 pb-14 md:grid-cols-[1.1fr_1fr] md:pb-20">
        {/* Fotos */}
        <div className="md:sticky md:top-6 md:self-start">
          <Photo src={cover?.url} alt={cover?.alt ?? modelo.nombre} preload sizes="(min-width: 768px) 52vw, 100vw" />
          {rest.length ? (
            <ul className="no-scrollbar -mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:px-0">
              {rest.map((img) => (
                <li key={img.url} className="w-[38%] shrink-0 snap-start md:w-auto">
                  <Photo src={img.url} alt={img.alt} sizes="(min-width: 768px) 12vw, 38vw" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Compra */}
        <div>
          <p className="type-label text-[0.7rem] text-ink-soft">{modelo.coleccion.nombre}</p>
          <h1 className="type-display mt-2 text-[2.25rem] sm:text-5xl">{modelo.nombre}</h1>
          <p className="mt-3 text-[1.15rem] font-semibold">{modelo.titular}</p>

          <p className="type-display tabular mt-6 text-[2.25rem]">{formatCOP(modelo.precio)}</p>
          <p className="mt-1 text-ink-soft">Pagas cuando te llegan · envío gratis a toda Colombia</p>

          {modelo.aviso ? (
            <p className="mt-5 flex gap-3 rounded-[12px] border border-amber-deep/40 bg-amber/10 px-4 py-3 text-[0.95rem]">
              <Info className="mt-0.5 size-5 shrink-0 text-amber-deep" aria-hidden />
              <span>{modelo.aviso}</span>
            </p>
          ) : null}

          <div className="mt-7">
            {modelo.disponible ? (
              <Link id="buy-cta" data-hides-wa href={orderHref} className={`${buttonPrimary} w-full sm:w-auto`}>
                Pedir · pagas al recibir
              </Link>
            ) : (
              <p className="font-semibold">Agotadas por ahora. Escríbenos por WhatsApp y te avisamos cuando lleguen.</p>
            )}
          </div>
          <p className="type-hand mt-4 -rotate-1 text-[1.45rem] text-night/80">pagas cuando las tengas en la mano</p>

          {wa ? (
            <p className="mt-5 text-[0.95rem] text-ink-soft">
              ¿Dudas?{" "}
              <WhatsAppLink number={wa} text={whatsappText(modelo.nombre)} className="font-semibold text-ink underline">
                Pregúntanos por WhatsApp
              </WhatsAppLink>
            </p>
          ) : null}

          <div className="mt-8">
            <TrustStrip settings={settings} tone="light" />
          </div>

          <p className="mt-8 max-w-[36rem] leading-relaxed text-ink-soft">{modelo.descripcion}</p>
        </div>
      </section>

      {/* Toma en primera persona */}
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-14 md:py-20">
          <div>
            <h2 className="type-display text-[1.75rem] sm:text-4xl">
              Lo que ves, <span className="underline-amber">grabado</span>
            </h2>
            <p className="mt-3 max-w-md text-mist">
              La cámara va en la montura: la toma queda a la altura de tus ojos y con las manos libres.
            </p>
          </div>
          <RecFrame
            videoUrl={settings.hero_video_url}
            posterUrl={settings.hero_poster_url || DEFAULT_HERO_POSTER}
            alt="Una calle de Medellín vista en primera persona"
          />
        </div>
      </section>

      {/* Qué hacen */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="type-display text-[1.75rem] sm:text-4xl">Qué hacen</h2>
        <dl className="mt-10 grid gap-x-14 md:grid-cols-2">
          {modelo.caracteristicas.map((f) => (
            <div key={f.titulo} className="border-t border-line py-6">
              <dt className="text-[1.2rem] font-semibold">{f.titulo}</dt>
              <dd className="mt-1.5 max-w-prose text-ink-soft">{f.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Ficha técnica: solo datos confirmados */}
      <section className="border-t border-line bg-cream-2/60">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="type-display text-[1.5rem] sm:text-3xl">Ficha técnica</h2>
          {modelo.ficha.length ? (
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {modelo.ficha.map((s) => (
                <div key={s.etiqueta} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                  <dt className="text-ink-soft">{s.etiqueta}</dt>
                  <dd className="font-semibold">{s.valor}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 max-w-prose text-ink-soft">
              La estamos confirmando con el proveedor y no publicamos datos que no hayamos comprobado. Si necesitas saber algo
              puntual (batería, compatibilidad, peso), pregúntanos por WhatsApp antes de pedir.
            </p>
          )}
        </div>
      </section>

      {/* ¿Cuál es para ti? */}
      <section className="mx-auto max-w-4xl px-5 py-16 md:py-24">
        <CualEsParaTi modelos={modelos} actual={modelo.slug} />
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <h2 className="type-display text-[1.75rem] sm:text-4xl">Preguntas</h2>
          <div className="mt-8">
            <Faq items={modelo.preguntas} />
          </div>
        </div>
      </section>

      {modelo.disponible ? <StickyBuyBar price={modelo.precio} href={orderHref} cod /> : null}
      <WhatsAppFloat number={wa} text={whatsappText(modelo.nombre)} desktopOnly />
    </main>
  );
}
