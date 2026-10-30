import Link from "next/link";
import { Logo } from "@/components/store/logo";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { formatPhone } from "@/lib/format";
import { socialLinks, whatsappText } from "@/lib/site";
import type { SettingsRow } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SettingsRow }) {
  const socials = socialLinks(settings);
  const wa = settings.whatsapp_number;
  const legal = [settings.legal_name, settings.tax_id ? `NIT/RUT ${settings.tax_id}` : null, settings.legal_address].filter(Boolean);

  return (
    <footer data-pie className="on-dark bg-deep text-mist">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-28 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:pb-16">
        <div>
          <Logo variant="lema-crema" height={110} />
          <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed">
            Gafas con cámara para Colombia. Pagas cuando te llegan y te escribimos antes de despachar.
          </p>
        </div>

        <div>
          <p className="type-label text-cream">Escríbenos</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {wa ? (
              <li>
                <WhatsAppLink number={wa} text={whatsappText()} className="hover:text-cream hover:underline">
                  WhatsApp {formatPhone(wa.replace(/^57/, ""))}
                </WhatsAppLink>
              </li>
            ) : null}
            {settings.support_email ? (
              <li>
                <a href={`mailto:${settings.support_email}`} className="hover:text-cream hover:underline">
                  {settings.support_email}
                </a>
              </li>
            ) : null}
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener" className="hover:text-cream hover:underline">
                  {s.name} · {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-label text-cream">Tienda</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li>
              <Link href="/tienda" className="hover:text-cream hover:underline">
                Todos los modelos
              </Link>
            </li>
            <li>
              <Link href="/envios-y-garantia" className="hover:text-cream hover:underline">
                Envíos y garantía
              </Link>
            </li>
            <li>
              <Link href="/nosotros" className="hover:text-cream hover:underline">
                Nosotros
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="type-label text-cream">Legal</p>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li>
              <Link href="/politicas/terminos" className="hover:text-cream hover:underline">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/politicas/privacidad" className="hover:text-cream hover:underline">
                Privacidad y datos
              </Link>
            </li>
            <li>
              <Link href="/politicas/retracto" className="hover:text-cream hover:underline">
                Derecho de retracto
              </Link>
            </li>
            <li>
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener" className="hover:text-cream hover:underline">
                Superintendencia de Industria y Comercio
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mid">
        <p className="mx-auto max-w-6xl px-5 py-6 text-sm">
          © {settings.store_name}
          {legal.length ? ` · ${legal.join(" · ")}` : ""}
        </p>
      </div>
    </footer>
  );
}
