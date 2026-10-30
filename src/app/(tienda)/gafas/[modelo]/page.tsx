import { ArrowLeft, Check, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonOnLight, buttonPrimary } from "@/components/store/buttons";
import { CualEsParaTi } from "@/components/store/cual-es-para-ti";
import { Galeria } from "@/components/store/galeria";
import { WhatsAppIcon } from "@/components/store/icons";
import { ProductJsonLd } from "@/components/store/json-ld";
import { PedirButton } from "@/components/store/pedido-trigger";
import { RecFrame } from "@/components/store/rec-frame";
import { Faq } from "@/components/store/sections";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { ViewContent } from "@/components/store/view-content";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { getModelo, getModelos, getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { ahorroCombo, precioCombo } from "@/lib/oferta";
import { DUDAS_COMPRA, SLUGS, modeloPorSlug } from "@/lib/productos";
import { DEFAULT_HERO_POSTER, whatsappLocal, whatsappText } from "@/lib/site";

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
    <div className="mx-auto grid min-h-[100svh] max-w-6xl content-start gap-x-14 gap-y-6 px-5 pt-3 pb-20 md:grid-cols-[1.1fr_1fr] md:pt-16">
      <div className="aspect-square animate-pulse rounded-[14px] bg-cream-2" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-6 w-1/2 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-[52px] w-full animate-pulse rounded-full bg-cream-2" />
      </div>
    </div>
  );
}

async function Model({ params }: { params: PageProps<"/gafas/[modelo]">["params"] }) {
  const { modelo: slug } = await params;
  const [modelo, modelos, settings] = await Promise.all([getModelo(slug), getModelos(), getSettings()]);
  if (!modelo) notFound();

  const wa = settings.whatsapp_number;
  const waLocal = whatsappLocal(wa);
  // Combo de 2 (oferta.ts): hoy solo la Biker. Si el modelo no tiene combo, no se muestra la tarjeta.
  const combo = precioCombo(modelo.slug, modelo.precio);
  const ahorro = formatCOP(ahorroCombo(modelo.slug, modelo.precio));
  // Solo la Biker graba en una tarjeta que no viene en la caja.
  const sinMicroSD = modelo.slug === "biker";

  return (
    <main>
      <ProductJsonLd modelo={modelo} settings={settings} />
      <ViewContent contentId={String(modelo.dropiId)} name={modelo.nombre} price={modelo.precio} />

      <div className="mx-auto hidden max-w-6xl px-5 pt-8 md:block">
        <Link href="/tienda" className="inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Tienda
        </Link>
      </div>

      <section className="mx-auto grid max-w-6xl gap-x-14 gap-y-6 px-5 pt-3 pb-14 md:grid-cols-[1.1fr_1fr] md:pt-2 md:pb-20">
        {/* Fotos */}
        <div className="md:sticky md:top-6 md:self-start">
          <Galeria imagenes={modelo.imagenes} nombre={modelo.nombre} />
        </div>

        {/* Compra */}
        <div>
          <p className="type-label text-[0.68rem] text-ink-soft">{modelo.coleccion.nombre}</p>
          <h1 className="type-display mt-1.5 text-[2rem] md:text-[2.5rem] lg:text-5xl">{modelo.nombre}</h1>
          <p className="mt-2.5 text-[1.125rem] leading-snug font-semibold">{modelo.titular}</p>

          <ul className="mt-4 space-y-2">
            {modelo.puntos.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span aria-hidden className="mt-[3px] grid size-5 shrink-0 place-items-center rounded-full bg-night text-cream">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <p className="type-display tabular mt-6 text-[2.25rem]">{formatCOP(modelo.precio)}</p>
          <p className="mt-1.5 text-[0.95rem] text-ink-soft">
            Envío gratis · Pagas en efectivo al recibir · Llega en {settings.delivery_estimate.toLowerCase()}
          </p>

          {modelo.disponible ? (
            <>
              {/* Combo real: lo aplica el pedido (precioCombo y totalPedido en src/lib/oferta.ts) */}
              {combo !== null ? (
                <div className="mt-5 flex gap-3.5 rounded-[14px] border border-line bg-paper p-4">
                  <span
                    aria-hidden
                    className="type-display grid size-11 shrink-0 place-items-center rounded-full bg-night text-[1rem] text-cream"
                  >
                    2×
                  </span>
                  <div>
                    <p className="leading-snug font-semibold">
                      Combo: 2 {modelo.corto} por <span className="tabular whitespace-nowrap">{formatCOP(combo)}</span>
                      {" "}(ahorras {ahorro})
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-snug text-ink-soft">
                      Una para ti y otra para regalar. Van en un solo paquete, por eso te sale más barato.
                    </p>
                  </div>
                </div>
              ) : null}

              <PedirButton
                id="buy-cta"
                data-hides-wa
                modelo={modelo.slug}
                origen="modelo"
                className={`${buttonPrimary} mt-5 w-full`}
              >
                Pedir · pagas al recibir
              </PedirButton>
              {combo !== null ? (
                <PedirButton
                  modelo={modelo.slug}
                  cantidad={2}
                  origen="modelo-promo"
                  className="mt-1 flex min-h-12 w-full items-center justify-center font-semibold underline decoration-night/40 underline-offset-4 hover:decoration-night"
                >
                  Pedir el combo de 2 por {formatCOP(combo)}
                </PedirButton>
              ) : null}
              <p className="mt-1 text-center text-[0.95rem] leading-snug text-ink-soft">
                No pagas nada hoy. Te escribimos por WhatsApp{waLocal ? ` desde el ${waLocal}` : ""} para confirmar antes
                de despachar.
              </p>
            </>
          ) : (
            <>
              <p className="mt-6 font-semibold">Agotadas por ahora. Escríbenos por WhatsApp y te avisamos cuando lleguen.</p>
              {wa ? (
                <WhatsAppLink
                  number={wa}
                  text={`${whatsappText(modelo.nombre)}. ¿Me avisan cuando lleguen?`}
                  className={`${buttonOnLight} mt-4 w-full`}
                  data-hides-wa
                >
                  <WhatsAppIcon className="size-5" />
                  Avísenme por WhatsApp
                </WhatsAppLink>
              ) : null}
            </>
          )}

          {sinMicroSD ? (
            <p className="mt-4 flex gap-2.5 border-t border-line pt-4 text-[0.95rem] leading-snug text-ink-soft">
              <Info className="mt-px size-[18px] shrink-0 text-night" strokeWidth={1.75} aria-hidden />
              <span>
                No incluye tarjeta microSD: la compras aparte. ¿Cuál sirve?{" "}
                {wa ? (
                  <WhatsAppLink
                    number={wa}
                    text={`Hola, ¿qué tarjeta microSD les sirve a las gafas ${modelo.corto}?`}
                    className="font-semibold text-ink underline underline-offset-4"
                  >
                    Pregúntanos
                  </WhatsAppLink>
                ) : (
                  "Pregúntanos"
                )}
              </span>
            </p>
          ) : null}

          <div className="mt-6">
            <Faq items={DUDAS_COMPRA} />
          </div>
        </div>
      </section>

      {/* Toma en primera persona: es de referencia, no se grabó con estas gafas */}
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-14 md:py-20">
          <div>
            <h2 className="type-display text-[1.75rem] sm:text-4xl">Así se ve en primera persona</h2>
            <p className="mt-3 max-w-md text-mist">
              La cámara va en la montura, así que lo que grabas queda a la altura de tus ojos y con las manos libres. Esta
              toma es de referencia, en una calle de Medellín: no se grabó con estas gafas.
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
        <p className="mt-4 max-w-[36rem] leading-relaxed text-ink-soft">{modelo.descripcion}</p>
        <dl className="mt-8 grid gap-x-14 md:grid-cols-2">
          {modelo.caracteristicas.map((f) => (
            <div key={f.titulo} className="border-t border-line py-6">
              <dt className="text-[1.2rem] font-semibold">{f.titulo}</dt>
              <dd className="mt-1.5 max-w-prose text-ink-soft">{f.texto}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Ficha técnica: solo datos confirmados. Sin datos, se pregunta por WhatsApp. */}
      <section className="border-t border-line bg-cream-2/60">
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
          {modelo.ficha.length ? (
            <>
              <h2 className="type-display text-[1.5rem] sm:text-3xl">Ficha técnica</h2>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {modelo.ficha.map((s) => (
                  <div key={s.etiqueta} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                    <dt className="text-ink-soft">{s.etiqueta}</dt>
                    <dd className="font-semibold">{s.valor}</dd>
                  </div>
                ))}
              </dl>
              {modelo.aviso ? <p className="mt-5 max-w-[36rem] text-[0.95rem] text-ink-soft">{modelo.aviso}</p> : null}
            </>
          ) : (
            <>
              <h2 className="type-display max-w-[34rem] text-[1.35rem] leading-[1.12] sm:text-[1.75rem]">
                ¿Quieres saber cuánto dura la batería o si funcionan con tu celular?
              </h2>
              <p className="mt-3 max-w-[36rem] text-ink-soft">Escríbenos y te contamos lo que ya tenemos confirmado con el proveedor antes de que pidas.</p>
              {wa ? (
                <WhatsAppLink
                  number={wa}
                  text={`Hola, quiero saber cuánto dura la batería de las gafas ${modelo.nombre.replace(/^gafas\s+/i, "")} y si funcionan con mi celular.`}
                  className={`${buttonOnLight} mt-6 w-full sm:w-auto`}
                  data-hides-wa
                >
                  <WhatsAppIcon className="size-5" />
                  Preguntar por WhatsApp
                </WhatsAppLink>
              ) : null}
            </>
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

      {modelo.disponible ? (
        <StickyBuyBar
          modelo={modelo.slug}
          price={modelo.precio}
          whatsapp={wa}
          whatsappText={whatsappText(modelo.nombre, "pedir")}
        />
      ) : null}
      <WhatsAppFloat number={wa} text={whatsappText(modelo.nombre)} desktopOnly />
    </main>
  );
}
