import Link from "next/link";
import { buttonOnDark, buttonOnLight } from "@/components/store/buttons";
import { PedirButton } from "@/components/store/pedido-trigger";
import type { ModeloTienda } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";

/** "las Biker" / "las de IA", para botones y enlaces. */
function lasDe(m: ModeloTienda) {
  return m.slug === "ia" ? "las de IA" : `las ${m.corto}`;
}

/**
 * "¿Cuál es para ti?": las dos gafas lado a lado en lo que más pesa para escoger,
 * con el botón para pedir cada una. En la página de un modelo, `actual` marca su columna.
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
  // Botón secundario: la píldora ámbar queda para el botón principal de la pantalla.
  const boton = `${(dark ? buttonOnDark : buttonOnLight).replace("px-7", "px-3").replace("text-[1.0625rem]", "text-[1rem]")} w-full`;

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
          </tbody>
        </table>
      </div>

      {/* En el celular los botones usan todo el ancho; desde 640 px se alinean con las columnas de la tabla. */}
      <ul className={`grid grid-cols-2 gap-3 border-t pt-5 sm:grid-cols-[24%_1fr_1fr] sm:gap-0 ${line}`}>
        <li aria-hidden className="hidden sm:block" />
        {modelos.map((m) => (
          <li key={m.slug} className="flex flex-col items-center sm:px-4">
            {m.disponible ? (
              <PedirButton modelo={m.slug} origen="comparar" className={boton}>
                Pedir {lasDe(m)}
              </PedirButton>
            ) : (
              <p className={`flex min-h-[52px] items-center text-[0.95rem] ${soft}`}>Agotadas por ahora</p>
            )}
            {m.slug === actual ? null : (
              <Link
                href={`/gafas/${m.slug}`}
                className="mt-1 inline-flex min-h-11 items-center text-[0.95rem] font-semibold underline underline-offset-4"
              >
                Ver detalles
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
