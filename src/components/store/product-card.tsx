import Link from "next/link";
import { Photo } from "@/components/store/photo";
import type { ModeloTienda } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";

/** Tarjeta de un modelo: foto, colección, nombre, precio y para qué sirve. */
export function ModeloCard({ modelo, preload, level = 3 }: { modelo: ModeloTienda; preload?: boolean; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  const cover = modelo.imagenes[0];
  return (
    <Link href={`/gafas/${modelo.slug}`} className="group block">
      <Photo
        src={cover?.url}
        alt={cover?.alt ?? modelo.nombre}
        sizes="(min-width: 768px) 45vw, 90vw"
        preload={preload}
        className="transition-[filter] duration-300 group-hover:brightness-[0.97]"
      />
      <p className="type-label mt-4 text-[0.68rem] text-ink-soft">{modelo.coleccion.nombre}</p>
      <div className="mt-1 flex items-baseline justify-between gap-4">
        <Heading className="text-[1.25rem] leading-snug font-semibold group-hover:underline">{modelo.nombre}</Heading>
        <p className="tabular shrink-0 text-[1.125rem] font-semibold">{formatCOP(modelo.precio)}</p>
      </div>
      <p className="mt-1.5 max-w-md text-ink-soft">{modelo.resumen}</p>
    </Link>
  );
}
