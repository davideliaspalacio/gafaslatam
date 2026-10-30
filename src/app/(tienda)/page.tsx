import type { Metadata } from "next";
import { buttonOnDark, buttonPrimary } from "@/components/store/buttons";
import { WhatsAppIcon } from "@/components/store/icons";
import { OrganizationJsonLd } from "@/components/store/json-ld";
import { CualEsParaTi } from "@/components/store/cual-es-para-ti";
import { ModeloCard } from "@/components/store/product-card";
import { RecFrame } from "@/components/store/rec-frame";
import { Faq, HowToBuy, TrustStrip } from "@/components/store/sections";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { Reviews } from "@/components/store/reviews";
import { getModelos, getPublishedReviews, getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { DEFAULT_HERO_POSTER, whatsappText } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// Preguntas generales de la tienda (las de cada modelo están en su página).
const PREGUNTAS = [
  {
    q: "¿Cuál me sirve?",
    a: "Si las quieres para grabar mientras haces ejercicio (bici, moto o trote), las Biker. Si las quieres para el día a día y también te interesan la música, las llamadas y el asistente de voz con IA, las gafas con cámara e IA.",
  },
  {
    q: "¿Cómo funciona eso de pagar al recibir?",
    a: "Haces el pedido aquí sin pagar nada. Te escribimos por WhatsApp para confirmar tus datos y, cuando la transportadora te entrega, le pagas en efectivo.",
  },
  {
    q: "¿Cuánto se demoran en llegar?",
    a: "Entre 2 y 5 días hábiles después de confirmar el pedido, según tu ciudad. Te mandamos el número de guía para que sigas el paquete.",
  },
  {
    q: "¿Esto es confiable?",
    a: "No pagas nada hasta tenerlas en la mano: le pagas a la transportadora cuando te las entrega. Antes de despachar te escribimos por WhatsApp desde el 300 756 8489 para confirmar tus datos, y sin tu confirmación no sale nada.",
  },
  {
    q: "¿Y si llegan con un problema?",
    a: "Si tienen un defecto de fábrica, te las cambiamos. Escríbenos por WhatsApp con tu número de pedido.",
  },
  {
    q: "¿Y si me arrepiento?",
    a: "Tienes 5 días hábiles desde que las recibes para devolverlas (es el derecho de retracto de la Ley 1480). Tienen que volver como llegaron, con la caja y todo lo que traían, y el envío de la devolución lo pagas tú.",
  },
];

export default async function Home() {
  const [settings, modelos, reviews] = await Promise.all([getSettings(), getModelos(), getPublishedReviews()]);
  const wa = settings.whatsapp_number;
  const desde = modelos.length ? Math.min(...modelos.map((m) => m.precio)) : null;

  return (
    <main>
      <OrganizationJsonLd settings={settings} />

      {/* Lo que ves, grabado */}
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-7 px-5 pt-4 pb-14 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pt-10 lg:pb-20">
          <RecFrame
            preload
            videoUrl={settings.hero_video_url}
            posterUrl={settings.hero_poster_url || DEFAULT_HERO_POSTER}
            alt="Una calle de Medellín vista en primera persona"
          />
          <div>
            <h1 className="type-display text-[2.5rem] sm:text-5xl lg:text-[4rem]">
              Graba lo que <span className="underline-amber">vives.</span>
            </h1>
            <p className="mt-4 font-semibold text-cream">
              {desde ? (
                <>
                  <span className="tabular whitespace-nowrap text-amber">Desde {formatCOP(desde)}</span> ·{" "}
                </>
              ) : null}
              <span className="whitespace-nowrap">Pagas al recibir</span> ·{" "}
              <span className="whitespace-nowrap">Envío gratis</span>
            </p>
            <p className="mt-3 max-w-md text-[1.0625rem] text-mist">
              Gafas con cámara para grabar sin sacar el celular. Las Biker, para la bici, la moto o el trote; las de IA,
              para el día a día con música y llamadas.
            </p>
            <div className="mt-7 grid gap-3 sm:flex">
              <a href="#modelos" className={buttonPrimary}>
                Ver las gafas
              </a>
              {wa ? (
                <WhatsAppLink number={wa} text={whatsappText(null, "pedir")} className={buttonOnDark} data-hides-wa>
                  <WhatsAppIcon className="size-5" />
                  Pedir por WhatsApp
                </WhatsAppLink>
              ) : null}
            </div>
            <div className="mt-8">
              <TrustStrip settings={settings} />
            </div>
          </div>
        </div>
      </section>

      {/* Los dos modelos */}
      <section id="modelos" aria-labelledby="t-modelos" className="mx-auto max-w-6xl scroll-mt-4 px-5 py-16 md:py-24">
        <h2 id="t-modelos" className="type-display text-[1.75rem] sm:text-4xl">
          Escoge las tuyas
        </h2>
        <ul className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2">
          {modelos.map((m) => (
            <li key={m.slug}>
              <ModeloCard modelo={m} />
            </li>
          ))}
        </ul>
      </section>

      {/* ¿Cuál es para ti? */}
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
          <CualEsParaTi modelos={modelos} tone="dark" />
        </div>
      </section>

      {/* Así se compra */}
      <section className="border-y border-line bg-cream-2/60">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h2 className="type-display text-[1.75rem] sm:text-4xl">Así se compra</h2>
            <p className="type-hand -rotate-2 text-[1.6rem] text-night/80">sin pagar nada por adelantado</p>
          </div>
          <div className="mt-10">
            <HowToBuy settings={settings} />
          </div>
        </div>
      </section>

      {reviews.length ? <Reviews reviews={reviews} /> : null}

      <section className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <h2 className="type-display text-[1.75rem] sm:text-4xl">Lo que más nos preguntan</h2>
        <div className="mt-8">
          <Faq items={PREGUNTAS} />
        </div>
      </section>

      {/* Cierre */}
      {wa ? (
        <section className="on-dark bg-night text-cream">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="type-display text-[1.75rem] sm:text-4xl">¿Te quedó una duda?</h2>
              <p className="mt-2 text-mist">Escríbenos por WhatsApp y te respondemos ahí mismo.</p>
            </div>
            <WhatsAppLink number={wa} text={whatsappText()} className={buttonOnDark} data-hides-wa>
              <WhatsAppIcon className="size-5" />
              Escribir por WhatsApp
            </WhatsAppLink>
          </div>
        </section>
      ) : null}

      <WhatsAppFloat number={wa} text={whatsappText()} />
    </main>
  );
}
