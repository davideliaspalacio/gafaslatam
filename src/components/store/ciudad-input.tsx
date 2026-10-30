"use client";

import { useId, useMemo, useState } from "react";
import { DEPARTAMENTOS, PRINCIPALES, buscarCiudades, ciudadExacta, etiquetaCiudad, type CiudadOpcion } from "@/lib/ciudades";

export type CiudadValor = { ciudad: string; departamento: string } | null;

/**
 * Lleva un campo a la vista moviendo solo el cuerpo de la hoja (o la página si no hay hoja).
 * scrollIntoView movería también la hoja entera y se esconderían el título y el pie.
 */
export function llevarA(el: Element, donde: "arriba" | "centro") {
  const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const cuerpo = el.closest<HTMLElement>("[data-hoja-cuerpo]");
  if (!cuerpo) return el.scrollIntoView({ block: donde === "arriba" ? "start" : "center", behavior });
  const r = el.getBoundingClientRect();
  const c = cuerpo.getBoundingClientRect();
  const delta = donde === "arriba" ? r.top - c.top - 12 : r.top - c.top - (c.height - r.height) / 2;
  cuerpo.scrollTo({ top: cuerpo.scrollTop + delta, behavior });
}

/** Cómo se escogió: de la lista, con un botón rápido, solo (al salir del campo o con el autocompletado) o se borró. */
export type OrigenCiudad = "lista" | "rapido" | "auto" | "borrar";

const RAPIDAS = PRINCIPALES.flatMap((p) => {
  const dep = DEPARTAMENTOS.find((d) => d.codigo === p.codigo);
  return p.corto && dep ? [{ corto: p.corto, opcion: { ciudad: p.ciudad, departamento: dep.nombre, codigo: dep.codigo } }] : [];
});

/**
 * Un solo campo para ciudad o municipio: busca sin tildes en todos los municipios, muestra
 * "Medellín · Antioquia" y llena el departamento. Combobox accesible (lista debajo, flechas, Enter, Esc)
 * con botones rápidos para las ciudades grandes mientras el campo está vacío.
 */
export function CiudadInput({
  id,
  valor,
  onElegir,
  onSalir,
  error,
  describedBy,
  className,
}: {
  id: string;
  valor: CiudadValor;
  onElegir: (opcion: CiudadOpcion | null, origen: OrigenCiudad) => void;
  /** Al salir del campo (para validar), con el valor que quedó y si había algo escrito sin escoger. */
  onSalir?: (valor: CiudadValor, escribio: boolean) => void;
  error?: string;
  describedBy?: string;
  className: string;
}) {
  const listId = useId();
  const [consulta, setConsulta] = useState<string | null>(null);
  const [abierta, setAbierta] = useState(false);
  const [activo, setActivo] = useState(0);

  const resultados = useMemo(() => (consulta?.trim() ? buscarCiudades(consulta, 8) : []), [consulta]);
  const texto = consulta ?? (valor ? etiquetaCiudad(valor) : "");
  const lista = abierta && Boolean(consulta?.trim());
  const rapidas = !valor && !consulta?.trim();

  function elegir(opcion: CiudadOpcion, origen: OrigenCiudad) {
    setConsulta(null);
    setAbierta(false);
    setActivo(0);
    onElegir(opcion, origen);
  }

  return (
    <div>
      <input
        id={id}
        name="ciudad"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={lista}
        aria-controls={listId}
        aria-activedescendant={lista && resultados[activo] ? `${listId}-${activo}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        autoComplete="address-level2"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        value={texto}
        className={className}
        onFocus={(e) => {
          if (valor) e.currentTarget.select();
          setAbierta(true);
          // En el celular el teclado tapa la mitad de abajo: sube el campo para que se vea la lista.
          const campo = e.currentTarget.closest("[data-campo]") ?? e.currentTarget;
          if (window.matchMedia("(max-width: 767px)").matches) window.setTimeout(() => llevarA(campo, "arriba"), 280);
        }}
        onChange={(e) => {
          const v = e.target.value;
          // Autocompletado del navegador (el campo no tiene el foco): si es una ciudad exacta, se escoge sola.
          if (document.activeElement !== e.target) {
            const exacta = ciudadExacta(v);
            if (exacta) return elegir(exacta, "auto");
          }
          setConsulta(v);
          setAbierta(true);
          setActivo(0);
          if (valor) onElegir(null, "borrar");
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            if (!resultados.length) return;
            e.preventDefault();
            setAbierta(true);
            const paso = e.key === "ArrowDown" ? 1 : -1;
            setActivo((i) => (i + paso + resultados.length) % resultados.length);
          } else if (e.key === "Enter" && lista && resultados[activo]) {
            e.preventDefault();
            elegir(resultados[activo], "lista");
          } else if (e.key === "Escape" && lista) {
            // Cierra solo la lista, no la hoja.
            e.preventDefault();
            e.stopPropagation();
            setAbierta(false);
          }
        }}
        onBlur={() => {
          setAbierta(false);
          if (!valor && consulta?.trim()) {
            const exacta = ciudadExacta(consulta);
            if (exacta) {
              elegir(exacta, "auto");
              onSalir?.(exacta, false);
              return;
            }
          }
          onSalir?.(valor, !valor && Boolean(consulta?.trim()));
        }}
      />

      {lista ? (
        resultados.length ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Ciudades y municipios"
            className="mt-1.5 overflow-hidden rounded-[12px] border border-line bg-paper py-1"
          >
            {resultados.map((o, i) => (
              <li
                key={`${o.ciudad}|${o.codigo}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === activo}
                // mousedown sin acción: así el campo no pierde el foco antes del toque.
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => i !== activo && setActivo(i)}
                onClick={() => elegir(o, "lista")}
                className={`flex min-h-12 cursor-pointer items-center gap-1.5 px-4 py-2 text-[1.0625rem] leading-snug ${
                  i === activo ? "bg-cream-2/70" : ""
                }`}
              >
                {o.departamento === "Bogotá D.C." ? (
                  <span className="font-semibold">Bogotá D.C.</span>
                ) : (
                  <>
                    <span className="font-semibold">{o.ciudad}</span>
                    <span className="text-ink-soft">· {o.departamento}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p id={listId} className="mt-1.5 rounded-[12px] border border-line bg-paper px-4 py-3 text-[0.95rem] text-ink-soft">
            No encontramos “{consulta?.trim()}”. Revisa cómo se escribe; si vives en una vereda, escribe el municipio.
          </p>
        )
      ) : null}
      <p className="sr-only" aria-live="polite">
        {lista ? (resultados.length === 1 ? "1 resultado" : `${resultados.length} resultados`) : ""}
      </p>

      {rapidas ? (
        <div role="group" aria-label="Ciudades principales" className="mt-2 grid grid-cols-3 gap-2">
          {RAPIDAS.map((r) => (
            <button
              key={r.corto}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => elegir(r.opcion, "rapido")}
              className="min-h-11 rounded-full border border-night/20 px-1 text-[0.9rem] font-semibold text-night max-[380px]:text-[0.84rem] transition-colors duration-200 hover:border-night/50 active:bg-night/[0.04]"
            >
              {r.corto}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
