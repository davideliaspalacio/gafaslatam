import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/store/icons";
import { Pixels } from "@/components/tracking/pixels";
import { getSettings } from "@/lib/catalog";
import { whatsappLink } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: settings.store_name, template: `%s · ${settings.store_name}` },
    openGraph: { siteName: settings.store_name, locale: "es_CO", type: "website" },
  };
}

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const wa = whatsappLink(settings.whatsapp_number, `Hola ${settings.store_name}, tengo una pregunta sobre las gafas.`);

  return (
    <>
      {settings.announcement ? (
        <p className="type-spec bg-flash px-4 py-2 text-center text-[0.8rem] leading-tight text-ink">
          {settings.announcement}
        </p>
      ) : null}

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-4 pb-2 sm:px-6">
        <Link href="/" className="type-carton text-[1.9rem] text-paper" aria-label={`${settings.store_name}, inicio`}>
          {settings.store_name}
        </Link>
        <nav className="flex items-center gap-1">
          <a
            href="#pedido"
            className="type-spec hidden rounded-sm px-3 py-2 text-sm text-carton-soft hover:text-paper sm:block"
          >
            Hacer pedido
          </a>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="grid size-11 place-items-center rounded-full text-paper hover:bg-carton-deep"
              aria-label="Escribir por WhatsApp"
            >
              <WhatsAppIcon className="size-6" />
            </a>
          ) : null}
        </nav>
      </header>

      {children}

      <footer className="bg-carton-night text-carton-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
          <div className="space-y-3">
            <p className="type-carton text-3xl text-paper">{settings.store_name}</p>
            <p className="max-w-xs text-sm leading-relaxed">
              Envíos a toda Colombia con pago contraentrega. Te confirmamos cada pedido por WhatsApp antes de
              despacharlo.
            </p>
            {settings.legal_name || settings.tax_id || settings.legal_address ? (
              <p className="text-xs leading-relaxed text-carton-soft/80">
                {[settings.legal_name, settings.tax_id ? `NIT/CC ${settings.tax_id}` : null, settings.legal_address]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </div>
          <div>
            <p className="type-spec mb-3 text-xs text-paper">Ayuda</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/politicas/envios" className="hover:text-paper hover:underline">
                  Envíos y pago contraentrega
                </Link>
              </li>
              <li>
                <Link href="/politicas/cambios-y-garantia" className="hover:text-paper hover:underline">
                  Cambios, retracto y garantía
                </Link>
              </li>
              {wa ? (
                <li>
                  <a href={wa} target="_blank" rel="noopener" className="hover:text-paper hover:underline">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings.support_email ? (
                <li>
                  <a href={`mailto:${settings.support_email}`} className="hover:text-paper hover:underline">
                    {settings.support_email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <p className="type-spec mb-3 text-xs text-paper">Legal</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/politicas/terminos" className="hover:text-paper hover:underline">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politicas/privacidad" className="hover:text-paper hover:underline">
                  Tratamiento de datos personales
                </Link>
              </li>
              <li>
                <a href="https://www.sic.gov.co" target="_blank" rel="noopener" className="hover:text-paper hover:underline">
                  Superintendencia de Industria y Comercio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <Pixels tiktokPixelId={settings.tiktok_pixel_id} metaPixelId={settings.meta_pixel_id} />
    </>
  );
}
