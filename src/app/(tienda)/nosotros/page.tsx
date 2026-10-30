import type { Metadata } from "next";
import Link from "next/link";
import { buttonPrimary } from "@/components/store/buttons";
import { RecFrame } from "@/components/store/rec-frame";
import { WhatsAppFloat } from "@/components/store/whatsapp-float";
import { getSettings } from "@/lib/catalog";
import { DEFAULT_HERO_POSTER, socialLinks, whatsappText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Gafas Latam: gafas con cámara para grabar lo que vives. Vendemos en toda Colombia con pago al recibir.",
  alternates: { canonical: "/nosotros" },
};

// Textos de la página: cámbialos aquí cuando tengan fotos del equipo o de las gafas en uso.
export default async function AboutPage() {
  const settings = await getSettings();
  const socials = socialLinks(settings);

  return (
    <main>
      <section className="on-dark bg-night text-cream">
        <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
          <RecFrame
            preload
            videoUrl={settings.hero_video_url}
            posterUrl={settings.hero_poster_url || DEFAULT_HERO_POSTER}
            alt="Una calle de Medellín vista en primera persona"
          />
          <h1 className="type-display mt-10 text-[2.25rem] sm:text-5xl">Para no perderte el momento buscando el celular.</h1>
          {/* Aquí va la historia del equipo cuando la quieran contar, con fotos reales. */}
          <p className="mt-5 max-w-xl text-[1.0625rem] text-mist">
            Somos Gafas Latam. Traemos gafas con cámara para que grabes el paseo, el concierto o la rodada con
            las manos libres.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 md:py-20">
        <h2 className="type-display text-[1.75rem] sm:text-4xl">Cómo trabajamos</h2>
        <div className="mt-8 space-y-6 text-[1.0625rem] leading-relaxed text-ink-soft">
          <p>
            Vendemos en toda Colombia y casi todo pasa por WhatsApp: ahí confirmamos cada pedido antes de despacharlo y
            ahí respondemos cuando algo falla.
          </p>
          <p>
            {settings.cod_enabled
              ? "Pagas cuando las gafas te llegan. Así no tienes que confiar en nosotros antes de verlas."
              : "Te mostramos todo antes de que pagues y te acompañamos hasta que te llegan."}
          </p>
          {socials.length ? (
            <p>
              Nos encuentras en{" "}
              {socials.map((s, i) => (
                <span key={s.name}>
                  {i > 0 ? (i === socials.length - 1 ? " y " : ", ") : null}
                  <a href={s.url} target="_blank" rel="noopener" className="font-semibold text-ink underline">
                    {s.name}
                  </a>
                </span>
              ))}{" "}
              como {settings.instagram_handle ? `@${settings.instagram_handle}` : settings.store_name}.
            </p>
          ) : null}
        </div>
        <p className="type-hand mt-10 -rotate-1 text-[1.7rem] text-night/80">nos vemos en la calle</p>
        <Link href="/tienda" className={`${buttonPrimary} mt-10`}>
          Ver las gafas
        </Link>
      </section>
      <WhatsAppFloat number={settings.whatsapp_number} text={whatsappText()} />
    </main>
  );
}
