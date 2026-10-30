import type { Metadata } from "next";
import Link from "next/link";
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
    q: "¿Y si llegan con un problema?",
    a: "Si tienen un defecto de fábrica, te las cambiamos. Escríbenos por WhatsApp con tu número de pedido.",
  },
];

export default async function Home() {
  const [settings, modelos, reviews] = await Promise.all([getSettings(), getModelos(), getPublishedReviews()]);
  const wa = settings.whatsapp_number;

  return (
    <main>
      <OrganizationJsonLd settings={settings} />

      {/* Lo que ves, grabado */}
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto grid max-w-6xl gap-x-14 gap-y-7 px-5 pt-4 pb-14 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:pt-10 lg:pb-20">
          <RecFrame
            videoUrl={settings.hero_video_url}
            posterUrl={settings.hero_poster_url || DEFAULT_HERO_POSTER}
            alt="Una calle de Medellín vista en primera persona"
          />
          <div>
            <h1 className="type-display text-[2.5rem] sm:text-5xl lg:text-[4rem]">
              Graba lo que <span className="underline-amber">vives.</span>
            </h1>
            <p className="mt-4 max-w-md text-[1.0625rem] text-mist">
              Gafas con cámara para grabar sin sacar el celular. Unas para el deporte y otras, con IA, para el día a día.
            </p>
            <div className="mt-7 grid gap-3 sm:flex">
              <Link href="/tienda" className={buttonPrimary}>
                Ver las gafas
              </Link>
              {wa ? (
                <WhatsAppLink number={wa} text={whatsappText()} className={buttonOnDark} data-hides-wa>
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
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="type-display text-[1.75rem] sm:text-4xl">Escoge las tuyas</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2">
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
