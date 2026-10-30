import Link from "next/link";
import type { ModeloTienda } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";

/**
 * "¿Cuál es para ti?": las dos gafas lado a lado en lo que más pesa para escoger.
 * En la página de un modelo, `actual` marca su columna.
 */
export function CualEsParaTi({ modelos, actual, tone = "light" }: { modelos: ModeloTienda[]; actual?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const filas: { label: string; valor: (m: ModeloTienda) => string }[] = [
    { label: "Para qué", valor: (m) => m.comparacion.paraQue },
    { label: "IA", valor: (m) => m.comparacion.ia },
    { label: "Música y llamadas", valor: (m) => m.comparacion.audio },
    { label: "Precio", valor: (m) => formatCOP(m.precio) },
  ];
  const line = dark ? "border-mid" : "border-line";
  const soft = dark ? "text-mist" : "text-ink-soft";

  return (
    <div>
      <h2 className="type-display text-[1.75rem] sm:text-4xl">¿Cuál es para ti?</h2>
      <div className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[20rem] table-fixed border-collapse text-left">
          <caption className="sr-only">Comparación de los dos modelos</caption>
          <colgroup>
            <col className="w-[28%] sm:w-[24%]" />
            {modelos.map((m) => (
              <col key={m.slug} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <td />
              {modelos.map((m) => (
                <th key={m.slug} scope="col" className="px-2 pb-4 align-bottom sm:px-4">
                  <span className={`type-label block text-[0.62rem] sm:text-[0.68rem] ${soft}`}>{m.coleccion.nombre}</span>
                  <span className="mt-1 block text-[1rem] leading-snug font-semibold sm:text-[1.15rem]">
                    {m.nombre}
                    {m.slug === actual ? <span className={`ml-1.5 font-normal ${soft}`}>(estas)</span> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.label} className={`border-t ${line}`}>
                <th scope="row" className={`py-3.5 pr-2 align-top text-[0.9rem] font-normal sm:text-[0.95rem] ${soft}`}>
                  {f.label}
                </th>
                {modelos.map((m) => (
                  <td key={m.slug} className="tabular px-2 py-3.5 align-top text-[0.95rem] font-semibold sm:px-4 sm:text-[1rem]">
                    {f.valor(m)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className={`border-t ${line}`}>
              <td />
              {modelos.map((m) => (
                <td key={m.slug} className="px-2 pt-4 sm:px-4">
                  {m.slug === actual ? null : (
                    <Link href={`/gafas/${m.slug}`} className="font-semibold underline underline-offset-4">
                      Ver {m.corto === "Con IA" ? "las de IA" : `las ${m.corto}`}
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
