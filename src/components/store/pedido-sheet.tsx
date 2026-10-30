"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, lazy, useCallback, useEffect, useId, useRef, useState } from "react";
import type { ModeloForm, OrderFormProps } from "@/components/store/order-form";
import { PEDIDO_EVENT, SHEET_READY_ATTR, type AbrirPedido } from "@/components/store/pedido-trigger";

// Hoja de pedido: se monta una vez en el layout de la tienda y la abre cualquier botón "Pedir"
// (PedirButton / abrirPedido) sin cambiar de página. En el celular es una hoja desde abajo;
// desde 768 px, un diálogo centrado. El formulario y la lista de municipios NO van en el JS
// inicial: se bajan aparte, en un rato muerto después de cargar la página o al abrir la hoja.

export type PedidoSheetProps = {
  modelos: ModeloForm[];
  /** Número de WhatsApp de la tienda (solo dígitos, con 57), o null. */
  whatsapp: string | null;
};

let carga: Promise<typeof import("@/components/store/order-form")> | null = null;
function cargarFormulario() {
  carga ??= import("@/components/store/order-form").catch((error) => {
    carga = null;
    throw error;
  });
  return carga;
}

const OrderForm = lazy(() =>
  cargarFormulario()
    .then((m) => ({ default: m.OrderForm }))
    .catch(() => ({ default: SinConexion })),
);

/** Marca de la entrada de historial que se agrega al abrir: "atrás" en el celular cierra la hoja. */
const HISTORIAL = "glPedido";
const CERRAR_MS = 240;

type Solicitud = AbrirPedido & { id: number; ruta: string };

const CSS = `
.gl-hoja{overscroll-behavior:contain}
.gl-hoja-titulo:focus{outline:none}
.gl-hoja::backdrop{background:transparent}
.gl-hoja-fondo{opacity:0;transition:opacity 300ms ease}
.gl-hoja[data-state=open] .gl-hoja-fondo{opacity:1}
.gl-hoja-panel{transform:translateY(100%);transition:transform 360ms var(--ease-out-expo),opacity 200ms ease}
.gl-hoja[data-state=open] .gl-hoja-panel{transform:none}
.gl-hoja[data-state=closed] .gl-hoja-panel{transition-duration:${CERRAR_MS}ms;transition-timing-function:cubic-bezier(.5,0,.75,0)}
@media (min-width:768px){
  .gl-hoja-panel{transform:translateY(16px) scale(.98);opacity:0}
  .gl-hoja[data-state=open] .gl-hoja-panel{transform:none;opacity:1}
}
@media (prefers-reduced-motion:reduce){
  .gl-hoja-panel,.gl-hoja[data-state=open] .gl-hoja-panel{transform:none!important;transition:opacity 150ms linear}
  .gl-hoja-panel{opacity:0}
  .gl-hoja[data-state=open] .gl-hoja-panel{opacity:1}
}`;

export function PedidoSheet({ modelos, whatsapp }: PedidoSheetProps) {
  const pathname = usePathname();
  const tituloId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [visible, setVisible] = useState<number | null>(null);
  // Si se cambia de página (p. ej. al ir a /pedido/gracias o por un enlace), la hoja se cierra y la
  // solicitud se descarta: así no se vuelve a abrir sola (ni bloquea el scroll) al regresar a esa ruta.
  const [rutaVista, setRutaVista] = useState(pathname);
  if (rutaVista !== pathname) {
    setRutaVista(pathname);
    if (solicitud !== null && solicitud.ruta !== pathname) setSolicitud(null);
  }
  const abierta = solicitud !== null && solicitud.ruta === pathname;
  const idAbierta = abierta ? solicitud.id : null;

  const abiertaRef = useRef(false);
  const cerrando = useRef<number | null>(null);
  const quienAbrio = useRef<HTMLElement | null>(null);

  useEffect(() => {
    abiertaRef.current = abierta;
  }, [abierta]);

  const cerrar = useCallback((desdeHistorial = false) => {
    if (!abiertaRef.current || cerrando.current !== null) return;
    setVisible(null);
    if (!desdeHistorial && window.history.state?.[HISTORIAL]) window.history.back();
    const quieta = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cerrando.current = window.setTimeout(() => {
      cerrando.current = null;
      setSolicitud(null);
    }, quieta ? 150 : CERRAR_MS);
  }, []);

  // Lista para recibir el evento + precarga del formulario cuando la página ya cargó y el navegador está libre.
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.setAttribute(SHEET_READY_ATTR, "");
    let idle: number | undefined;
    let timer: number | undefined;
    const precargar = () => {
      const bajar = () => void cargarFormulario().catch(() => {});
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(bajar, { timeout: 5000 });
      else timer = window.setTimeout(bajar, 1500);
    };
    if (document.readyState === "complete") precargar();
    else window.addEventListener("load", precargar, { once: true });
    return () => {
      dialog?.removeAttribute(SHEET_READY_ATTR);
      window.removeEventListener("load", precargar);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  // Abrir: desde PedirButton o abrirPedido({ modelo, cantidad, origen }).
  useEffect(() => {
    const onAbrir = (e: Event) => {
      const d = (e as CustomEvent<AbrirPedido | undefined>).detail ?? {};
      if (cerrando.current !== null) {
        window.clearTimeout(cerrando.current);
        cerrando.current = null;
      }
      quienAbrio.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!window.history.state?.[HISTORIAL]) window.history.pushState({ [HISTORIAL]: true }, "");
      void cargarFormulario().catch(() => {});
      setSolicitud({ modelo: d.modelo, cantidad: d.cantidad, origen: d.origen, id: Date.now(), ruta: window.location.pathname });
    };
    window.addEventListener(PEDIDO_EVENT, onAbrir);
    return () => window.removeEventListener(PEDIDO_EVENT, onAbrir);
  }, []);

  // Botón atrás del celular (o del navegador): cierra la hoja en vez de salir de la página.
  useEffect(() => {
    const onPop = () => {
      if (abiertaRef.current && !window.history.state?.[HISTORIAL]) cerrar(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [cerrar]);

  // Mostrar / esconder el diálogo, bloquear el scroll de la página y devolver el foco al cerrar.
  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (idAbierta === null || !dialog || !panel) return;
    if (!dialog.open) dialog.showModal();
    tituloRef.current?.focus({ preventScroll: true });
    const ruta = window.location.pathname;

    const html = document.documentElement;
    const antes = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    const barra = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (barra > 0) html.style.paddingRight = `${barra}px`;

    let f2 = 0;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => setVisible(idAbierta));
    });
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      if (dialog.open) dialog.close();
      panel.style.transform = "";
      panel.style.transition = "";
      html.style.overflow = antes.overflow;
      html.style.paddingRight = antes.paddingRight;
      // Si se cerró porque cambió la página, el foco lo maneja la navegación.
      if (window.location.pathname !== ruta) return;
      const q = quienAbrio.current;
      if (q?.isConnected) q.focus({ preventScroll: true });
      else enfocarCompra();
    };
  }, [idAbierta]);

  // iPhone: Safari ignora interactive-widget=resizes-content y el teclado tapa el pie de la hoja (total y
  // "Pedir"). Con la hoja abierta, el contenedor ocupa solo lo que se ve encima del teclado (visualViewport)
  // y el panel no pasa de ese alto (max-h-full). En Android (resizes-content) y en escritorio lo visible
  // coincide con la pantalla, así que no se toca nada; tampoco con zoom de pellizco.
  useEffect(() => {
    const dialog = dialogRef.current;
    const vv = window.visualViewport;
    if (idAbierta === null || !dialog || !vv) return;
    const ajustar = () => {
      const pantalla = Math.max(window.innerHeight, document.documentElement.clientHeight);
      const tapada = vv.scale < 1.01 && (vv.offsetTop > 0.5 || pantalla - vv.height > 1);
      dialog.style.top = tapada ? `${vv.offsetTop}px` : "";
      dialog.style.height = tapada ? `${vv.height}px` : "";
    };
    ajustar();
    vv.addEventListener("resize", ajustar);
    vv.addEventListener("scroll", ajustar);
    return () => {
      vv.removeEventListener("resize", ajustar);
      vv.removeEventListener("scroll", ajustar);
      dialog.style.top = "";
      dialog.style.height = "";
    };
  }, [idAbierta]);

  // Deslizar hacia abajo para cerrar: desde la manija y el título, o desde el cuerpo si ya está arriba del todo.
  useEffect(() => {
    const panel = panelRef.current;
    if (idAbierta === null || !panel) return;
    let inicio = 0;
    let ultimo = 0;
    let ultimoT = 0;
    let velocidad = 0;
    let posible = false;
    let arrastrando = false;

    const onStart = (e: TouchEvent) => {
      posible = false;
      arrastrando = false;
      if (e.touches.length !== 1 || window.innerWidth >= 768) return;
      const t = e.target as HTMLElement;
      const cuerpo = panel.querySelector<HTMLElement>("[data-hoja-cuerpo]");
      posible = Boolean(t.closest("[data-hoja-cabeza]")) || Boolean(cuerpo?.contains(t) && cuerpo.scrollTop <= 0);
      inicio = ultimo = e.touches[0].clientY;
      ultimoT = e.timeStamp;
      velocidad = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (!posible) return;
      const y = e.touches[0].clientY;
      const dy = y - inicio;
      if (!arrastrando) {
        if (dy < -6) posible = false; // sube: es scroll normal
        if (dy <= 6) return;
        arrastrando = true;
        panel.style.transition = "none";
      }
      e.preventDefault();
      if (e.timeStamp > ultimoT) velocidad = (y - ultimo) / (e.timeStamp - ultimoT);
      ultimo = y;
      ultimoT = e.timeStamp;
      panel.style.transform = `translateY(${Math.max(0, dy)}px)`;
    };
    const onEnd = () => {
      if (!arrastrando) return;
      arrastrando = posible = false;
      const dy = ultimo - inicio;
      if (dy > Math.min(140, panel.offsetHeight * 0.22) || (velocidad > 0.5 && dy > 24)) {
        panel.style.transition = `transform ${CERRAR_MS}ms cubic-bezier(.3,0,.8,.15)`;
        panel.style.transform = "translateY(100%)";
        cerrar();
      } else {
        panel.style.transition = "";
        panel.style.transform = "";
      }
    };
    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove", onMove, { passive: false });
    panel.addEventListener("touchend", onEnd);
    panel.addEventListener("touchcancel", onEnd);
    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
      panel.removeEventListener("touchcancel", onEnd);
    };
  }, [idAbierta, cerrar]);

  const formProps: OrderFormProps | null =
    abierta && solicitud ? { modelos, whatsapp, modelo: solicitud.modelo ?? null, cantidad: solicitud.cantidad ?? null, variante: "hoja" } : null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={tituloId}
      data-state={idAbierta !== null && visible === idAbierta ? "open" : "closed"}
      onCancel={(e) => {
        // Esc (o "atrás" en Android con el diálogo abierto): cierre animado.
        e.preventDefault();
        cerrar();
      }}
      onClose={() => {
        // El navegador lo cerró sin pasar por cerrar() (pasa en Android si se insiste con "atrás").
        if (!abiertaRef.current || cerrando.current !== null) return;
        if (window.history.state?.[HISTORIAL]) window.history.back();
        setVisible(null);
        setSolicitud(null);
      }}
      className="gl-hoja fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-end justify-center overflow-hidden border-0 bg-transparent p-0 text-ink open:flex supports-[overflow:clip]:overflow-clip md:items-center"
    >
      <style href="gl-hoja" precedence="default">
        {CSS}
      </style>
      <div aria-hidden className="gl-hoja-fondo absolute inset-0 touch-none bg-deep/55" onClick={() => cerrar()} />
      <div
        ref={panelRef}
        className="gl-hoja-panel relative flex h-[92dvh] max-h-full w-full flex-col overflow-hidden rounded-t-[14px] supports-[overflow:clip]:overflow-clip bg-cream shadow-[var(--shadow-soft)] md:h-auto md:max-h-[min(88dvh,56rem)] md:w-[30rem] md:rounded-[14px]"
      >
        <div data-hoja-cabeza className="shrink-0 border-b border-line">
          <div aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-line md:hidden" />
          <div className="flex items-center justify-between gap-3 py-1.5 pr-2 pl-5 md:py-2.5">
            <h2 ref={tituloRef} id={tituloId} tabIndex={-1} className="gl-hoja-titulo type-display text-[1.375rem]">
              Tu pedido
            </h2>
            <button
              type="button"
              onClick={() => cerrar()}
              aria-label="Cerrar"
              className="grid size-11 place-items-center rounded-full text-night transition-colors duration-200 hover:bg-night/[0.05]"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
        {formProps && solicitud ? (
          <Suspense fallback={<Esqueleto />}>
            <OrderForm key={solicitud.id} {...formProps} />
          </Suspense>
        ) : null}
      </div>
    </dialog>
  );
}

/**
 * Si el botón que abrió la hoja ya no existe (p. ej. el aviso de la promo, que se va al abrirla),
 * el foco no se queda en <body>: va al botón de compra de la página si se ve o, si no, al
 * "Pedir ahora" de la barra fija del celular.
 */
function enfocarCompra() {
  const enPantalla = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  };
  const cta = document.getElementById("buy-cta");
  const barra = document.querySelector<HTMLElement>("[data-barra-compra]:not([inert]) [data-pedir-barra]");
  const candidatos = [cta && enPantalla(cta) ? cta : null, barra && enPantalla(barra) ? barra : null, cta];
  for (const el of candidatos) {
    if (!el) continue;
    el.focus({ preventScroll: true });
    if (document.activeElement === el) return;
  }
}

function Esqueleto() {
  return (
    <div className="flex-1 space-y-4 overflow-hidden px-5 pt-4" aria-busy="true" aria-label="Cargando el formulario">
      <div className="h-[78px] animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-16 animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-[84px] animate-pulse rounded-[14px] bg-cream-2/70" />
      <div className="h-[52px] animate-pulse rounded-[12px] bg-cream-2/70" />
      <div className="h-[52px] animate-pulse rounded-[12px] bg-cream-2/70" />
    </div>
  );
}

/** Si el formulario no baja (sin señal), la página /pedido sigue sirviendo. */
function SinConexion({ modelo, cantidad }: OrderFormProps) {
  const params = new URLSearchParams();
  if (modelo) params.set("modelo", modelo);
  if (cantidad && cantidad > 1) params.set("cantidad", String(cantidad));
  return (
    <div className="flex-1 px-5 pt-6">
      <p className="text-[1.0625rem]">No pudimos cargar el formulario. Revisa tu señal e intenta otra vez.</p>
      <Link href={`/pedido${params.size ? `?${params}` : ""}`} className="mt-3 inline-block font-semibold text-ink underline">
        Abrir el formulario en una página
      </Link>
    </div>
  );
}
