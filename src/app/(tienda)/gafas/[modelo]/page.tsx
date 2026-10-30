import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BuyBox } from "@/components/store/buy-box";
import { ProductJsonLd } from "@/components/store/json-ld";
import { Photo } from "@/components/store/photo";
import { RecFrame } from "@/components/store/rec-frame";
import { Faq, TrustStrip } from "@/components/store/sections";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { ViewContent } from "@/components/store/view-content";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { getActiveProducts, getProductBySlug, getPublishedReviews, getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { DEFAULT_HERO_POSTER, TAGS, whatsappText, type Tag } from "@/lib/site";
import { bundlesOf, type Spec } from "@/lib/types";

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.length ? products.map((p) => ({ modelo: p.slug })) : [{ modelo: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/gafas/[modelo]">): Promise<Metadata> {
  const { modelo } = await params;
  const product = await getProductBySlug(modelo);
  if (!product) return {};
  const title = product.seo_title ?? `${product.name} · Gafas con cámara y audio`;
  const description = product.seo_description ?? product.short_description ?? undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/gafas/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/gafas/${product.slug}`,
      images: product.images[0] ? [{ url: product.images[0].url, alt: product.images[0].alt }] : undefined,
    },
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
      <div className="aspect-[4/3] animate-pulse rounded-[14px] bg-cream-2 md:aspect-square" />
      <div className="space-y-4">
        <div className="h-12 w-2/3 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-6 w-1/2 animate-pulse rounded-[10px] bg-cream-2" />
        <div className="h-[52px] w-full animate-pulse rounded-full bg-cream-2 sm:w-64" />
      </div>
    </div>
  );
}

async function Model({ params }: { params: PageProps<"/gafas/[modelo]">["params"] }) {
  const { modelo } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(modelo), getSettings()]);
  if (!product) notFound();
  const reviews = await getPublishedReviews(product.id);

  const [cover, ...rest] = product.images;
  const pair = bundlesOf(product).find((b) => b.qty === 2);
  const saving = pair ? product.price * 2 - pair.price : 0;
  const showSpecs = product.specs_confirmed && product.specs.length > 0;
  const wa = settings.whatsapp_number;
  const orderHref = `/pedido?modelo=${encodeURIComponent(product.slug)}`;
  const tags = product.tags.filter((t): t is Tag => t in TAGS);

  return (
    <main>
      <ProductJsonLd product={product} settings={settings} reviews={reviews} />
      <ViewContent product={product} />

      <div className="mx-auto max-w-6xl px-5 pt-5 md:pt-8">
        <Link href="/tienda" className="inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Tienda
        </Link>
      </div>

      <section className="mx-auto grid max-w-6xl gap-x-14 gap-y-8 px-5 pt-2 pb-14 md:grid-cols-[1.1fr_1fr] md:pb-20">
        {/* Galería */}
        <div className="md:sticky md:top-6 md:self-start">
          <Photo
            src={cover?.url}
            alt={cover?.alt ?? `Gafas ${product.name}`}
            ratio={cover ? "square" : "landscape"}
            preload
            sizes="(min-width: 768px) 52vw, 100vw"
          />
          {rest.length ? (
            <ul className="no-scrollbar -mx-5 mt-3 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {rest.map((img) => (
                <li key={img.url} className="w-[42%] shrink-0 snap-start md:w-auto">
                  <Photo src={img.url} alt={img.alt} sizes="(min-width: 768px) 17vw, 42vw" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Compra */}
        <div>
          <h1 className="type-display text-[2.5rem] sm:text-5xl">{product.name}</h1>
          {product.headline ? <p className="mt-3 text-[1.15rem] font-semibold">{product.headline}</p> : null}
          {tags.length ? <p className="mt-1 text-ink-soft">{tags.map((t) => TAGS[t]).join(" · ")}</p> : null}

          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="type-display tabular text-[2.25rem]">{formatCOP(product.price)}</p>
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <p className="text-lg text-ink-soft line-through decoration-1">{formatCOP(product.compare_at_price)}</p>
            ) : null}
          </div>
          <p className="mt-1 text-ink-soft">
            {settings.cod_enabled ? "Pagas cuando te llegan" : "Pago seguro"}
            {settings.free_shipping ? " · envío gratis" : ""}
          </p>
          {pair && saving > 0 ? (
            <p className="mt-1 text-ink-soft">
              Llevando 2 pares: <span className="font-semibold text-ink">{formatCOP(pair.price)}</span> (ahorras{" "}
              {formatCOP(saving)})
            </p>
          ) : null}

          <div className="mt-7">
            <BuyBox slug={product.slug} variants={product.variants} cod={settings.cod_enabled} />
          </div>
          {settings.cod_enabled ? (
            <p className="type-hand mt-4 -rotate-1 text-[1.45rem] text-night/80">pagas cuando las tengas en la mano</p>
          ) : null}

          {wa ? (
            <p className="mt-5 text-[0.95rem] text-ink-soft">
              ¿Dudas?{" "}
              <WhatsAppLink number={wa} text={whatsappText(product.name)} className="font-semibold text-ink underline">
                Pregúntanos por WhatsApp
              </WhatsAppLink>
            </p>
          ) : null}

          <div className="mt-8">
            <TrustStrip settings={settings} tone="light" />
          </div>

          {product.description ? <p className="mt-8 max-w-[36rem] leading-relaxed text-ink-soft">{product.description}</p> : null}
        </div>
      </section>

      {/* Lo que graba */}
      {product.video_url || product.moments.length ? (
        <section className="on-dark bg-night text-cream">
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
            <h2 className="type-display text-[1.75rem] sm:text-4xl">Lo que graban</h2>
            <p className="mt-3 max-w-lg text-mist">Grabado con las gafas puestas, a la altura de los ojos.</p>
            {product.video_url ? (
              <video
                className="mt-8 aspect-video w-full rounded-[14px] bg-deep object-cover"
                src={product.video_url}
                controls
                muted
                playsInline
                preload="metadata"
              />
            ) : null}
            {product.moments.length ? (
              <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                {product.moments.map((m) => (
                  <li key={m.url}>
                    <Photo src={m.url} alt={m.caption} ratio="portrait" sizes="(min-width: 768px) 30vw, 46vw" />
                    {m.caption ? <p className="mt-2 text-sm text-mist">{m.caption}</p> : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Mientras no haya video del modelo: la toma en primera persona de la tienda */}
      {!product.video_url && !product.moments.length ? (
        <section className="on-dark bg-night text-cream">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-14 md:py-20">
            <div>
              <h2 className="type-display text-[1.75rem] sm:text-4xl">
                Lo que ves, <span className="underline-amber">grabado</span>
              </h2>
              <p className="mt-3 max-w-md text-mist">
                Una toma en primera persona queda así: a la altura de tus ojos y con las manos libres.
              </p>
            </div>
            <RecFrame
              videoUrl={settings.hero_video_url}
              posterUrl={settings.hero_poster_url || DEFAULT_HERO_POSTER}
              alt="Una calle de Medellín vista en primera persona"
            />
          </div>
        </section>
      ) : null}

      {/* Qué hacen */}
      {product.features.length ? (
        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="type-display text-[1.75rem] sm:text-4xl">Qué hacen</h2>
          <dl className="mt-10 grid gap-x-14 md:grid-cols-2">
            {product.features.map((f) => (
              <div key={f.title} className="border-t border-line py-6">
                <dt className="text-[1.2rem] font-semibold">{f.title}</dt>
                <dd className="mt-1.5 max-w-prose text-ink-soft">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Caja y ficha */}
      {product.in_the_box.length || showSpecs ? (
        <section className="border-t border-line bg-cream-2/60">
          <div className={`mx-auto grid max-w-6xl gap-14 px-5 py-16 md:py-20 ${showSpecs ? "md:grid-cols-2" : ""}`}>
            {product.in_the_box.length ? (
              <div>
                <h2 className="type-display text-[1.5rem] sm:text-3xl">En la caja</h2>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {product.in_the_box.map((item) => (
                    <li key={item} className="flex items-center gap-3 py-3.5">
                      <Check className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {showSpecs ? (
              <div>
                <h2 className="type-display text-[1.5rem] sm:text-3xl">Ficha técnica</h2>
                <dl className="tabular mt-6 divide-y divide-line border-y border-line">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-4 py-3.5">
                      <dt className="text-ink-soft">{s.label}</dt>
                      <dd className="font-semibold whitespace-nowrap">{specValue(s)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {product.faq.length ? (
        <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
          <h2 className="type-display text-[1.75rem] sm:text-4xl">Preguntas</h2>
          <div className="mt-8">
            <Faq items={product.faq} />
          </div>
        </section>
      ) : null}

      <StickyBuyBar price={product.price} href={orderHref} cod={settings.cod_enabled} />
      <WhatsAppFloat number={wa} text={whatsappText(product.name)} desktopOnly />
    </main>
  );
}

function specValue(s: Spec) {
  if (s.unit === "IPX") return `IPX${s.value}`;
  if (s.unit === "BT") return `Bluetooth ${s.value}`;
  if (s.unit === "p") return `${s.value}p`;
  return `${s.value} ${s.unit}`;
}
