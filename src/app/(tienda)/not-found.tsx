import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonOnLight } from "@/components/store/buttons";
import { WhatsAppIcon } from "@/components/store/icons";
import { Photo } from "@/components/store/photo";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { getModelos, getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { whatsappText } from "@/lib/site";

/** 404 de la tienda: lleva directo a los dos modelos o a WhatsApp, sin callejón sin salida. */
export default async function NotFound() {
  const [modelos, settings] = await Promise.all([getModelos(), getSettings()]);
  const wa = settings.whatsapp_number;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-12 pb-20 md:pt-20">
      <h1 className="type-display text-[2.25rem] sm:text-5xl">Esta página no existe</h1>
      <p className="mt-4 max-w-[36rem] text-ink-soft">
        Puede que el enlace esté mal escrito o que la página ya no esté. Las gafas sí están: escoge las tuyas.
      </p>

      <ul className="mt-8 border-t border-line">
        {modelos.map((m) => (
          <li key={m.slug} className="border-b border-line">
            <Link href={`/gafas/${m.slug}`} className="group flex items-center gap-4 py-4">
              <Photo src={m.imagenes[0]?.url} alt="" sizes="80px" fit="contain" compact className="w-20 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="type-label block text-[0.62rem] text-ink-soft">{m.coleccion.nombre}</span>
                <span className="mt-1 block leading-snug font-semibold group-hover:underline">{m.nombre}</span>
                <span className="tabular mt-0.5 block text-[0.95rem] text-ink-soft">
                  {formatCOP(m.precio)} · pagas al recibir
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-ink-soft" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        {wa ? (
          <WhatsAppLink number={wa} text={whatsappText()} className={buttonOnLight}>
            <WhatsAppIcon className="size-5" />
            Escribir por WhatsApp
          </WhatsAppLink>
        ) : null}
        <Link href="/" className="inline-flex min-h-11 items-center justify-center font-semibold underline underline-offset-4 sm:px-4">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
