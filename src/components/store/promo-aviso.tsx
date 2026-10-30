"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { buttonPrimary } from "@/components/store/buttons";
import { PEDIDO_EVENT, PedirButton } from "@/components/store/pedido-trigger";
import { formatCOP } from "@/lib/format";
import { ahorroCombo, precioCombo } from "@/lib/oferta";
import type { Slug } from "@/lib/productos";

/**
 * Aviso del combo de 2 (hoy: 2 Biker por $259.900, en src/lib/oferta.ts). Solo sale en la portada y
 * en la página de un modelo que tenga combo. No es un modal: es una tarjeta abajo, encima de la
 * barra de compra, que no tapa la página ni roba el foco (regla de Google contra intersticiales).
 *
 * - En /gafas/[modelo]: al pasar el 45 % del scroll o a los 25 s, lo que pase primero.
 * - En la portada: al pasar el 50 % del scroll.
 * - En escritorio, también cuando el mouse sale por arriba (intención de salida).
 * - Nunca al entrar, nunca en /pedido, nunca si en esta sesión ya se abrió el pedido,
 *   nunca si lo cerró en los últimos 7 días. Una vez por sesión.
 */

export type PromoModelo = { slug: Slug; precio: number; corto: string };

const UMBRAL = { producto: 0.45, home: 0.5 } as const;
const A_LOS_MS = 25_000;
/** Nunca al entrar: ningún disparador cuenta antes de esto (cubre el scroll restaurado al volver). */
const ESPERA_MINIMA_MS = 3_000;
/** Con menos alto que esto (celular acostado) la tarjeta pasaría del 30 % de la pantalla. */
const ALTO_MINIMO = 520;
const SIETE_DIAS = 7 * 24 * 60 * 60 * 1000;
const SALIDA_MS = 200;

const K = { cerrado: "gl_aviso_cerrado", visto: "gl_aviso_visto", pedido: "gl_pedido_abierto" };

// Respaldo en memoria por si el navegador bloquea el almacenamiento (ventana privada, previsualizaciones).
const memoria = { visto: false, pedido: false };

function leer(tipo: "local" | "session", clave: string) {
  try {
    return (tipo === "local" ? window.localStorage : window.sessionStorage).getItem(clave);
  } catch {
    return null;
  }
}

function guardar(tipo: "local" | "session", clave: string, valor: string) {
  try {
    (tipo === "local" ? window.localStorage : window.sessionStorage).setItem(clave, valor);
  } catch {
    // sin almacenamiento: queda el respaldo en memoria
  }
}

function marcarPedido() {
  memoria.pedido = true;
  guardar("session", K.pedido, "1");
}

function bloqueado() {
  if (memoria.visto || memoria.pedido || leer("session", K.visto) || leer("session", K.pedido)) return true;
  const cerrado = Number(leer("local", K.cerrado));
  return cerrado > 0 && Date.now() - cerrado < SIETE_DIAS;
}

// ---------- Estado compartido con el WhatsApp flotante ----------

const AVISO_EVENT = "gl:aviso";
const AVISO_ATTR = "data-aviso-promo";

function suscribirAviso(cambio: () => void) {
  window.addEventListener(AVISO_EVENT, cambio);
  return () => window.removeEventListener(AVISO_EVENT, cambio);
}

/** true mientras el aviso de la promoción está en pantalla (el WhatsApp flotante se aparta). */
export function useAvisoAbierto() {
  return useSyncExternalStore(
    suscribirAviso,
    () => document.documentElement.hasAttribute(AVISO_ATTR),
    () => false,
  );
}

// ---------- Barra de compra fija del celular ----------

// La barra de compra del modelo. `data-barra-compra` es la marca explícita; mientras no exista,
// se reconoce por sus clases (fixed inset-x-0 bottom-0). Se descartan hojas y diálogos.
const BARRA_SELECTOR = "[data-barra-compra], .fixed.inset-x-0.bottom-0";

function altoBarraVisible() {
  const barra = [...document.querySelectorAll<HTMLElement>(BARRA_SELECTOR)].find(
    (el) => !el.closest("[data-flotante], dialog, [role='dialog'], [aria-modal]"),
  );
  if (!barra || barra.inert || barra.getAttribute("aria-hidden") === "true") return 0;
  return barra.offsetHeight; // 0 si está oculta con display: none (escritorio)
}

/** Alto en px de la barra de compra fija cuando está a la vista; 0 si no hay o está escondida. */
export function useAltoBarraCompra() {
  const [alto, setAlto] = useState(0);
  useEffect(() => {
    let raf = 0;
    const medir = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setAlto(altoBarraVisible()));
    };
    medir();
    const observer = new MutationObserver(medir);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["inert", "aria-hidden", "class"],
    });
    window.addEventListener("resize", medir);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);
  return alto;
}

// ---------- Aviso ----------

function paginaDe(pathname: string, modelos: PromoModelo[]) {
  // Solo modelos con combo real; en la portada se ofrece el primero que lo tenga.
  const conCombo = modelos.filter((m) => precioCombo(m.slug, m.precio) !== null);
  if (pathname === "/") return conCombo[0] ? { tipo: "home" as const, modelo: conCombo[0] } : null;
  const slug = /^\/gafas\/([^/]+)\/?$/.exec(pathname)?.[1];
  const modelo = slug ? conCombo.find((m) => m.slug === slug) : undefined;
  return modelo ? { tipo: "producto" as const, modelo } : null;
}

/** true mientras se ve un botón de compra de la página (#buy-cta y los marcados data-hides-wa): el aviso se aparta. */
function useBotonCompraEnPantalla(activo: boolean, pathname: string) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!activo) return;
    const targets = [...document.querySelectorAll("[data-hides-wa]")];
    if (!targets.length) return;
    const enVista = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) enVista.add(e.target);
        else enVista.delete(e.target);
      }
      setVisible(enVista.size > 0);
    });
    targets.forEach((t) => observer.observe(t));
    return () => {
      observer.disconnect();
      setVisible(false);
    };
  }, [activo, pathname]);
  return visible;
}

export function PromoAviso({ modelos }: { modelos: PromoModelo[] }) {
  const pathname = usePathname();
  const pagina = paginaDe(pathname, modelos);
  const tipo = pagina?.tipo ?? null;

  const [abiertoEn, setAbiertoEn] = useState<string | null>(null);
  const [saliendo, setSaliendo] = useState(false);
  const visible = abiertoEn !== null && abiertoEn === pathname;
  const enPantalla = visible && !saliendo;

  const cardRef = useRef<HTMLDivElement>(null);
  const previoRef = useRef<HTMLElement | null>(null);
  const salidaRef = useRef(0);
  const tituloId = useId();
  const textoId = useId();
  const altoBarra = useAltoBarraCompra();

  const cerrar = useCallback((opciones: { recordar: boolean; devolverFoco: boolean }) => {
    if (opciones.recordar) guardar("local", K.cerrado, String(Date.now()));
    const card = cardRef.current;
    if (card && card.contains(document.activeElement)) {
      const previo = previoRef.current;
      if (opciones.devolverFoco && previo?.isConnected) previo.focus({ preventScroll: true });
      else (document.activeElement as HTMLElement | null)?.blur();
    }
    setSaliendo(true);
    window.clearTimeout(salidaRef.current);
    salidaRef.current = window.setTimeout(() => {
      setAbiertoEn(null);
      setSaliendo(false);
    }, SALIDA_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(salidaRef.current), []);

  // Si se abre la hoja de pedido (desde cualquier botón), el aviso se va y no vuelve en la sesión.
  useEffect(() => {
    const onPedido = () => {
      marcarPedido();
      if (cardRef.current) cerrar({ recordar: false, devolverFoco: false });
    };
    window.addEventListener(PEDIDO_EVENT, onPedido);
    return () => window.removeEventListener(PEDIDO_EVENT, onPedido);
  }, [cerrar]);

  // Disparadores de la página actual.
  useEffect(() => {
    if (pathname.startsWith("/pedido")) marcarPedido();
    if (!tipo || bloqueado()) return;

    const inicio = performance.now();
    const listo = () => performance.now() - inicio >= ESPERA_MINIMA_MS;
    let hecho = false;
    let raf = 0;

    const mostrar = () => {
      if (hecho || !listo() || bloqueado() || window.innerHeight < ALTO_MINIMO) return;
      hecho = true;
      memoria.visto = true;
      guardar("session", K.visto, "1");
      limpiar();
      setAbiertoEn(pathname);
    };
    const revisarScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= UMBRAL[tipo]) mostrar();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(revisarScroll);
    };
    const onSalida = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) mostrar();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const tEspera = window.setTimeout(revisarScroll, ESPERA_MINIMA_MS);
    const tTiempo = tipo === "producto" ? window.setTimeout(mostrar, A_LOS_MS) : 0;
    const escritorio = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (escritorio) document.addEventListener("mouseout", onSalida);

    function limpiar() {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(tEspera);
      window.clearTimeout(tTiempo);
      document.removeEventListener("mouseout", onSalida);
    }
    return limpiar;
  }, [pathname, tipo]);

  // Avisa al WhatsApp flotante para que se aparte.
  useEffect(() => {
    document.documentElement.toggleAttribute(AVISO_ATTR, enPantalla);
    window.dispatchEvent(new Event(AVISO_EVENT));
  }, [enPantalla]);

  // Esc cierra.
  useEffect(() => {
    if (!enPantalla) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) cerrar({ recordar: true, devolverFoco: true });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [enPantalla, cerrar]);

  const modelo = pagina?.modelo ?? null;
  const combo = modelo ? precioCombo(modelo.slug, modelo.precio) : null;
  const ahorro = modelo ? ahorroCombo(modelo.slug, modelo.precio) : 0;
  const titulo = modelo && combo !== null ? `Combo: 2 ${modelo.corto} por ${formatCOP(combo)}` : "";
  // Si el botón de compra de la página está a la vista, el aviso se aparta (sin cerrarse) para no taparlo.
  const tapando = useBotonCompraEnPantalla(enPantalla, pathname);

  // Encima de la barra de compra cuando está a la vista (se mueve con ella); si no, a 12 px del borde.
  const subir = altoBarra ? `translateY(calc(0.75rem + env(safe-area-inset-bottom) - ${altoBarra + 8}px))` : undefined;

  return (
    <>
      <p role="status" className="sr-only">
        {enPantalla ? `${titulo}. Ahorras ${formatCOP(ahorro)}, van en un solo paquete y pagas al recibir.` : ""}
      </p>
      {visible && pagina ? (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={tituloId}
          aria-describedby={textoId}
          data-flotante
          onFocus={(e) => {
            const desde = e.relatedTarget as HTMLElement | null;
            if (!desde || !e.currentTarget.contains(desde)) previoRef.current = desde;
          }}
          style={{ transform: subir }}
          className={`on-dark fixed right-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 z-40 max-h-[30dvh] overflow-y-auto rounded-[14px] border border-mid bg-night px-4 pt-3.5 pb-4 text-cream shadow-[var(--shadow-soft)] ease-[var(--ease-out-expo)] motion-safe:transition-[opacity,translate,transform] motion-safe:duration-300 motion-safe:starting:translate-y-4 motion-reduce:transition-opacity motion-reduce:duration-200 starting:opacity-0 md:right-auto md:bottom-6 md:left-6 md:w-[25rem] md:px-5 md:pt-4 md:pb-5 ${
            saliendo || tapando ? "pointer-events-none opacity-0 motion-safe:translate-y-3" : "opacity-100"
          }`}
          inert={tapando || undefined}
        >
          <button
            type="button"
            onClick={() => cerrar({ recordar: true, devolverFoco: true })}
            aria-label="Cerrar la promoción"
            className="absolute top-1 right-1 grid size-11 place-items-center rounded-full text-mist transition-colors duration-200 hover:text-cream"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </button>

          <h2 id={tituloId} className="type-display pr-10 text-[1.25rem] md:text-[1.5rem]">
            {titulo}
          </h2>
          <p id={textoId} className="mt-1.5 text-[0.95rem] leading-snug text-mist">
            Ahorras <span className="tabular font-semibold text-amber">{formatCOP(ahorro)}</span>: una para ti y otra para
            regalar. Van en un solo paquete y pagas al recibir.
          </p>

          <div className="mt-3.5 flex items-center gap-1">
            <PedirButton
              modelo={modelo?.slug}
              cantidad={2}
              origen="aviso"
              className={`${buttonPrimary} flex-1 px-5`}
            >
              Quiero el combo
            </PedirButton>
            <button
              type="button"
              onClick={() => cerrar({ recordar: true, devolverFoco: true })}
              className="min-h-[52px] shrink-0 rounded-full px-4 text-[1.0625rem] font-semibold text-mist transition-colors duration-200 hover:text-cream"
            >
              Ahora no
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
