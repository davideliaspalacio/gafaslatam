import { Check, MessageCircle, Star } from "lucide-react";
import { OrderEnvelope } from "@/components/store/order-envelope";
import { Print } from "@/components/store/print";
import { ProductJsonLd } from "@/components/store/json-ld";
import { StickyBuyBar } from "@/components/store/sticky-buy-bar";
import { ViewContent } from "@/components/store/view-content";
import { formatCOP } from "@/lib/format";
import { bundlesOf, type Product, type ReviewRow, type SettingsRow } from "@/lib/types";
import { wompiConfigured } from "@/lib/wompi";

export function ProductPage({
  product,
  settings,
  reviews,
}: {
  product: Product;
  settings: SettingsRow;
  reviews: ReviewRow[];
}) {
  const [cover, second, third, fourth] = product.images;
  const bundles = bundlesOf(product);
  const single = bundles[0];
  const shippingLabel = settings.free_shipping ? "Envío gratis" : `Envío ${formatCOP(settings.shipping_cost)}`;
  const onlineAvailable = settings.online_payment_enabled && wompiConfigured();
  const sampleMoments = product.moments.some((m) => m.sample);
  // La ficha técnica solo sale cuando el equipo la confirmó con el proveedor (panel → producto).
  const showSpecs = product.specs_confirmed && product.specs.length > 0;
  const [headlineA, headlineB] = splitHeadline(product.headline ?? product.name);

  return (
    <main>
      <ProductJsonLd product={product} settings={settings} reviews={reviews} />
      <ViewContent product={product} />

      {/* Primera pantalla: la copia del producto sobre el cartón */}
      <section className="mx-auto grid max-w-6xl gap-x-12 gap-y-5 px-4 pt-1 pb-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:items-center md:pt-10 md:pb-24">
        <div className="relative mx-auto mt-4 w-[80%] max-w-[34rem] md:mt-0 md:w-full">
          {second ? (
            <Print
              src={second.url}
              alt={second.alt}
              ratio="landscape"
              tilt={6}
              objectPosition="center 58%"
              reference={second.sample}
              sizes="(min-width: 768px) 40vw, 70vw"
              className="absolute -top-3 left-[16%] w-[84%] md:-top-10"
            />
          ) : null}
          {cover ? (
            <Print
              src={cover.url}
              alt={cover.alt}
              stamp={stampFor(product.updated_at)}
              ratio="landscape"
              tilt={-3}
              preload
              reference={cover.sample}
              sizes="(min-width: 768px) 45vw, 86vw"
              className="relative mt-12 w-[94%] md:mt-20"
            />
          ) : (
            <MissingPhoto />
          )}
        </div>

        <div>
          <h1 className="type-carton text-[2.15rem] text-paper sm:text-6xl md:text-[4.1rem]">
            <span className="block text-balance">{headlineA}</span>
            {headlineB ? <span className="mt-1 block text-balance text-flash">{headlineB}</span> : null}
          </h1>
          <p className="type-spec mt-4 text-[0.82rem] text-carton-soft">
            {product.name} · Gafas inteligentes con cámara
          </p>
          {product.short_description ? (
            <p className="mt-3 hidden max-w-[34rem] text-[1.02rem] leading-relaxed text-carton-soft md:block">
              {product.short_description}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1 md:mt-6">
            <p className="type-carton tabular text-[2.4rem] text-paper" style={{ fontStyle: "normal" }}>
              {formatCOP(single.price)}
            </p>
            {product.compare_at_price && product.compare_at_price > single.price ? (
              <p className="pb-1.5 text-lg text-carton-soft line-through decoration-1">
                {formatCOP(product.compare_at_price)}
              </p>
            ) : null}
            <p className="pb-2 text-sm text-carton-soft">
              {settings.cod_enabled ? "Pagas al recibir" : "Pago seguro"} · {shippingLabel.toLowerCase()}
            </p>
          </div>

          <a
            id="hero-cta"
            href="#pedido"
            className="type-spec mt-4 flex min-h-14 items-center justify-center gap-3 rounded-[3px] bg-flash px-6 text-[1.05rem] text-ink shadow-[var(--shadow-lift)] transition-[background-color,translate] duration-200 hover:bg-flash-deep active:translate-y-px md:max-w-md"
          >
            Pedir ahora · {settings.cod_enabled ? "pagas al recibir" : "pago seguro"}
          </a>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-carton-soft/25 border-y border-carton-soft/25 text-carton-soft md:max-w-md">
            <div className="py-2.5 pr-3">
              <dt className="type-spec text-[0.66rem] text-flash">Entrega</dt>
              <dd className="mt-0.5 text-[0.8rem] leading-snug">{settings.delivery_estimate}</dd>
            </div>
            <div className="px-3 py-2.5">
              <dt className="type-spec text-[0.66rem] text-flash">Pago</dt>
              <dd className="mt-0.5 text-[0.8rem] leading-snug">
                {settings.cod_enabled ? "En efectivo al recibir" : "Pago protegido"}
              </dd>
            </div>
            <div className="py-2.5 pl-3">
              <dt className="type-spec text-[0.66rem] text-flash">Garantía</dt>
              <dd className="mt-0.5 text-[0.8rem] leading-snug">Por defectos de fábrica</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Copias en primera persona */}
      {product.moments.length ? (
        <section className="bg-carton-deep py-14 md:py-20" aria-labelledby="momentos">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="momentos" className="type-carton max-w-3xl text-[2rem] text-paper sm:text-5xl">
              Así se ve lo que grabas
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-carton-soft">
              La cámara va en la montura, a la altura de tus ojos. Lo que queda grabado es exactamente lo que estabas
              mirando, con las manos libres.
            </p>
            {sampleMoments ? (
              <p className="type-spec mt-3 text-[0.7rem] text-flash">Fotos de referencia · pronto, tomas hechas con las gafas</p>
            ) : null}
          </div>
          <ul className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-6 md:mx-auto md:grid md:max-w-6xl md:grid-cols-3 md:gap-8 md:overflow-visible">
            {product.moments.map((m, i) => (
              <li key={m.url} className="w-[72%] shrink-0 snap-center sm:w-[44%] md:w-auto">
                <Print
                  src={m.url}
                  alt={m.caption}
                  stamp={m.stamp}
                  tilt={TILTS[i % TILTS.length]}
                  sizes="(min-width: 768px) 30vw, 72vw"
                  reference={m.sample}
                />
                <p className="mt-4 px-1 text-[0.95rem] text-carton-soft">{m.caption}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Lo que hace, en el panel blanco del cartón */}
      {product.features.length ? (
        <section className="on-paper bg-paper text-ink" aria-labelledby="funciones">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <h2 id="funciones" className="type-carton max-w-3xl text-[2rem] text-carton sm:text-5xl">
              Parecen gafas de sol. Hacen mucho más.
            </h2>
            {product.description ? (
              <p className="mt-5 max-w-[65ch] text-[1.05rem] leading-relaxed text-ink-soft">{product.description}</p>
            ) : null}
            <div className="mt-12 grid gap-12 md:grid-cols-[1fr_0.8fr] md:gap-16">
              <dl>
                {product.features.map((f) => (
                  <div key={f.title} className="border-t border-rule py-7">
                    <dt className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{f.title}</dt>
                    <dd className="mt-2 max-w-prose leading-relaxed text-ink-soft">{f.body}</dd>
                  </div>
                ))}
              </dl>
              {third || fourth ? (
                <div className="relative mx-auto w-[82%] md:sticky md:top-10 md:w-full md:self-start">
                  {fourth ? (
                    <Print
                      src={fourth.url}
                      alt={fourth.alt}
                      tilt={3}
                      sizes="(min-width: 768px) 32vw, 80vw"
                      reference={fourth.sample}
                    />
                  ) : null}
                  {third ? (
                    <Print
                      src={third.url}
                      alt={third.alt}
                      ratio="landscape"
                      tilt={-4}
                      objectPosition="center 25%"
                      sizes="(min-width: 768px) 26vw, 64vw"
                      reference={third.sample}
                      className={fourth ? "absolute -bottom-10 -left-[4%] w-[72%] md:-left-[14%]" : ""}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Ficha técnica, caja y compra: el costado impreso de la caja */}
      <section className="on-paper border-t border-rule bg-paper text-ink">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:grid-cols-3">
          {showSpecs ? (
            <div>
              <h2 className="type-carton text-[1.8rem] text-carton sm:text-4xl">Ficha técnica</h2>
              <dl className="tabular mt-6 border-y-2 border-ink">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 last:border-b-0">
                    <dt className="type-spec text-[0.78rem] text-ink-soft">{s.label}</dt>
                    <dd className="text-[1.05rem] font-bold whitespace-nowrap">{specValue(s)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {product.in_the_box.length ? (
            <div>
              <h2 className="type-carton text-[1.8rem] text-carton sm:text-4xl">En la caja</h2>
              <ul className="mt-6 divide-y divide-rule border-y border-rule">
                {product.in_the_box.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3">
                    <Check className="size-5 shrink-0 text-carton" strokeWidth={2.25} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <h2 className="type-carton text-[1.8rem] text-carton sm:text-4xl">Cómo compras</h2>
            <ol className="mt-6 space-y-5">
              <Step title="Haces el pedido aquí">Sin crear cuenta y sin pagar nada todavía. Toma menos de un minuto.</Step>
              <Step title="Te confirmamos por WhatsApp">Revisamos contigo la dirección y el color antes de despachar.</Step>
              <Step title={settings.cod_enabled ? "Pagas cuando te llega" : "Te llega a la puerta"}>
                {settings.cod_enabled
                  ? `La transportadora te entrega en ${settings.delivery_estimate.toLowerCase()} y le pagas en efectivo.`
                  : `Te entregamos en ${settings.delivery_estimate.toLowerCase()}.`}
                {onlineAvailable ? " Si prefieres, puedes pagar en línea con Nequi, PSE o tarjeta." : ""}
              </Step>
            </ol>
          </div>
        </div>
      </section>

      {reviews.length ? <Reviews reviews={reviews} /> : null}

      <OrderEnvelope
        product={{
          id: product.id,
          name: product.name,
          image: cover?.url ?? null,
          variants: product.variants,
          bundles,
        }}
        shipping={settings.free_shipping ? 0 : settings.shipping_cost}
        codEnabled={settings.cod_enabled}
        onlineEnabled={onlineAvailable}
        deliveryEstimate={settings.delivery_estimate}
        storeName={settings.store_name}
      />

      {product.faq.length ? (
        <section className="bg-carton-deep" aria-labelledby="preguntas">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
            <h2 id="preguntas" className="type-carton text-[2rem] text-paper sm:text-5xl">
              Preguntas en el mostrador
            </h2>
            <div className="mt-8 border-t border-carton-soft/25">
              {product.faq.map((f) => (
                <details key={f.q} className="group border-b border-carton-soft/25">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[1.05rem] font-semibold text-paper">
                    {f.q}
                    <span
                      aria-hidden
                      className="relative size-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-flash after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-flash after:transition-transform group-open:after:scale-y-0"
                    />
                  </summary>
                  <p className="max-w-prose pb-6 leading-relaxed text-carton-soft">{f.a}</p>
                </details>
              ))}
            </div>
            {settings.whatsapp_number ? (
              <p className="mt-8 flex items-center gap-2 text-carton-soft">
                <MessageCircle className="size-5 text-flash" strokeWidth={1.75} aria-hidden />
                ¿Otra pregunta?{" "}
                <a
                  className="font-semibold text-paper underline"
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener"
                >
                  Escríbenos por WhatsApp
                </a>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <StickyBuyBar price={single.price} cod={settings.cod_enabled} />
    </main>
  );
}

const TILTS = [-2, 1.5, -1, 2, -1.5, 1];

function specValue(s: { value: string; unit: string }) {
  if (s.unit === "IPX") return `IPX${s.value}`;
  if (s.unit === "BT") return `Bluetooth ${s.value}`;
  if (s.unit === "p") return `${s.value}p`;
  return `${s.value} ${s.unit}`;
}

function splitHeadline(text: string): [string, string | null] {
  const parts = text.split(/(?<=\.)\s+/);
  return parts.length > 1 ? [parts[0], parts.slice(1).join(" ")] : [text, null];
}

/** Fecha de la copia: el día de la última edición, en formato de cámara ('26 10 18). */
function stampFor(iso: string) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `'${get("year")} ${get("month")} ${get("day")}`;
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="border-t border-rule pt-4">
      <p className="text-lg font-bold tracking-tight">{title}</p>
      <p className="mt-1 leading-relaxed text-ink-soft">{children}</p>
    </li>
  );
}

function MissingPhoto() {
  return (
    <div className="print relative mt-5 w-[94%] -rotate-3">
      <div className="grid aspect-[5/4] place-items-center bg-carton-night p-6 text-center">
        <p className="type-spec text-sm text-carton-soft">Sube la foto del producto en /admin/productos</p>
      </div>
    </div>
  );
}

function Reviews({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <section className="bg-carton py-16 md:py-24" aria-labelledby="resenas">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="resenas" className="type-carton text-[2rem] text-paper sm:text-5xl">
          Lo que dicen quienes ya las tienen
        </h2>
        <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-carton-soft/30 pt-5">
              <p role="img" aria-label={`${r.rating} de 5 estrellas`} className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`size-4 ${n <= r.rating ? "fill-flash text-flash" : "text-carton-soft/40"}`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ))}
              </p>
              <p className="mt-3 leading-relaxed text-paper">“{r.body}”</p>
              <p className="type-spec mt-4 text-xs text-carton-soft">
                {r.author}
                {r.city ? ` · ${r.city}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
