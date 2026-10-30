import Link from "next/link";
import { buttonPrimary } from "@/components/store/buttons";
import { PedirButton } from "@/components/store/pedido-trigger";
import { Photo } from "@/components/store/photo";
import type { ModeloTienda } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import { precioCombo } from "@/lib/oferta";

/**
 * Tarjeta de un modelo: foto, colección, nombre, precio, para qué sirve, cómo se paga y la promo,
 * con "Pedir" (abre la hoja de pedido con ese modelo) y "Ver detalles".
 */
export function ModeloCard({ modelo, preload, level = 3 }: { modelo: ModeloTienda; preload?: boolean; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  const cover = modelo.imagenes[0];
  const href = `/gafas/${modelo.slug}`;
  const combo = precioCombo(modelo.slug, modelo.precio);
  return (
    <article className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <Photo
          src={cover?.url}
          alt={cover?.alt ?? modelo.nombre}
          fit="contain"
          sizes="(min-width: 1152px) 540px, (min-width: 640px) 45vw, 90vw"
          preload={preload}
          className="transition-[filter] duration-300 group-hover:brightness-[0.97]"
        />
      </Link>
      <p className="type-label mt-4 text-[0.68rem] text-ink-soft">{modelo.coleccion.nombre}</p>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <Heading className="text-[1.25rem] leading-snug font-semibold">
          <Link href={href} className="hover:underline">
            {modelo.nombre}
          </Link>
        </Heading>
        <p className="tabular shrink-0 text-[1.125rem] font-semibold">{formatCOP(modelo.precio)}</p>
      </div>
      <p className="mt-1.5 max-w-md text-ink-soft">{modelo.resumen}</p>
      <p className="mt-2.5 text-[0.95rem] leading-snug text-ink-soft">
        <span className="whitespace-nowrap">Pagas al recibir</span> · <span className="whitespace-nowrap">Envío gratis</span>
        {combo !== null ? (
          <>
            {" "}·{" "}
            <span className="font-semibold whitespace-nowrap text-ink">2 por {formatCOP(combo)}</span>
          </>
        ) : null}
      </p>
      <div className="mt-auto pt-5">
        {modelo.disponible ? (
          <PedirButton modelo={modelo.slug} origen="tarjeta" className={`${buttonPrimary} w-full`}>
            Pedir
          </PedirButton>
        ) : (
          <p className="flex min-h-[52px] items-center justify-center font-semibold text-ink-soft">Agotadas por ahora</p>
        )}
        <Link
          href={href}
          className="mt-1 flex min-h-11 items-center justify-center text-[0.95rem] font-semibold underline decoration-night/40 underline-offset-4 hover:decoration-night"
        >
          Ver detalles
        </Link>
      </div>
    </article>
  );
}
