"use client";

import { Glasses, Info, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { PedidoRespuesta } from "@/app/api/pedido/route";
import { buttonPrimary } from "@/components/store/buttons";
import { CiudadInput, llevarA, type CiudadValor, type OrigenCiudad } from "@/components/store/ciudad-input";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { formatCOP, formatPhone, normalizeColombianMobile } from "@/lib/format";
import { BORRADOR_KEY, PEDIDO_KEY, type PedidoGuardado } from "@/lib/pedido";
import { newEventId, track, type Contents } from "@/lib/pixel";
import { MAX_CANTIDAD, ahorroCombo, precioCombo, totalPedido } from "@/lib/oferta";

export type ModeloForm = {
  slug: string;
  nombre: string;
  corto: string;
  /** ID para los píxeles de Meta y TikTok (el ID del producto en Dropi). */
  contentId: string;
  precio: number;
  paraQue: string;
  imagen: { url: string; alt: string; ancho?: number; alto?: number } | null;
  disponible: boolean;
};

export type OrderFormProps = {
  modelos: ModeloForm[];
  /** WhatsApp de la tienda (solo dígitos, con 57), o null. */
  whatsapp: string | null;
  /** Modelo con el que llega. Sin modelo (o agotado) primero se escoge entre las tarjetas. */
  modelo?: string | null;
  cantidad?: number | null;
  /** "hoja": cuerpo con scroll y pie fijo, dentro de la hoja inferior. "pagina": en /pedido. */
  variante: "hoja" | "pagina";
};

type Campo = "celular" | "nombre" | "ciudad" | "direccion" | "barrio" | "complemento";
const ORDEN: Campo[] = ["celular", "nombre", "ciudad", "direccion", "barrio", "complemento"];

type Datos = {
  celular: string;
  nombre: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  barrio: string;
  complemento: string;
};
const VACIO: Datos = { celular: "", nombre: "", ciudad: "", departamento: "", direccion: "", barrio: "", complemento: "" };

type Errores = Partial<Record<Campo, string>>;
type Borrador = { modelo: string | null; cantidad: number; datos: Datos };

function validar(campo: Campo, d: Datos): string | undefined {
  switch (campo) {
    case "celular":
      if (!d.celular.trim()) return "Escribe tu celular con WhatsApp";
      return normalizeColombianMobile(d.celular) ? undefined : "Escribe un celular de 10 dígitos que empiece por 3";
    case "nombre": {
      const n = d.nombre.trim();
      if (n.length < 3) return "Escribe tu nombre y apellido";
      return n.split(/\s+/).length < 2 ? "Escribe también tu apellido" : undefined;
    }
    case "ciudad":
      return d.ciudad && d.departamento ? undefined : "Escoge tu ciudad o municipio de la lista";
    case "direccion":
      return d.direccion.trim().length < 5 ? "Escribe la dirección de entrega" : undefined;
    case "barrio":
      return d.barrio.trim().length < 3 ? "Escribe tu barrio" : undefined;
    case "complemento":
      return d.complemento.trim().length > 120 ? "Escribe máximo 120 letras" : undefined;
  }
}

function leerBorrador(): Borrador | null {
  try {
    const raw = sessionStorage.getItem(BORRADOR_KEY);
    const b = raw ? (JSON.parse(raw) as Partial<Borrador>) : null;
    if (!b || typeof b !== "object" || !b.datos) return null;
    const datos = { ...VACIO };
    for (const k of Object.keys(VACIO) as (keyof Datos)[]) {
      const v = (b.datos as Record<string, unknown>)[k];
      if (typeof v === "string") datos[k] = v.slice(0, 160);
    }
    return { modelo: typeof b.modelo === "string" ? b.modelo : null, cantidad: Number(b.cantidad) || 1, datos };
  } catch {
    return null;
  }
}

/** "300 756 8489" a partir del WhatsApp de la tienda ("573007568489"). */
function celularTienda(numero: string | null) {
  const d = numero?.replace(/\D/g, "");
  if (!d) return null;
  return formatPhone(d.length === 12 && d.startsWith("57") ? d.slice(2) : d);
}

const sinGafas = (nombre: string) => nombre.replace(/^gafas\s+/i, "");

// Píxeles: InitiateCheckout una sola vez por visita; AddToCart una vez por modelo al escoger 2 pares.
const checkoutEnviado = new Set<string>(); // "visita" cuando ya salió InitiateCheckout
const dosParesEnviado = new Set<string>();

export function OrderForm({ modelos, whatsapp, modelo: modeloInicial, cantidad: cantidadInicial, variante }: OrderFormProps) {
  const router = useRouter();
  const uid = useId();
  const idDe = (campo: Campo | "cambiar") => `${uid}-${campo}`;
  const hoja = variante === "hoja";

  const inicialValido = modelos.some((m) => m.slug === modeloInicial && m.disponible) ? (modeloInicial as string) : null;
  const [slug, setSlug] = useState<string | null>(inicialValido);
  const [cambiando, setCambiando] = useState(false);
  const [cantidad, setCantidad] = useState(() => Math.min(MAX_CANTIDAD, Math.max(1, Math.round(cantidadInicial ?? 1))));
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [avisoDireccion, setAvisoDireccion] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const enviando = useRef(false);
  const eventId = useRef<string | null>(null);
  const restaurado = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const modelo = modelos.find((m) => m.slug === slug) ?? null;
  const total = modelo ? totalPedido(modelo.slug, modelo.precio, cantidad) : 0;
  const combo = modelo ? precioCombo(modelo.slug, modelo.precio) : null;
  const ahorroDos = modelo ? ahorroCombo(modelo.slug, modelo.precio) : 0;
  const ahorro = cantidad === 2 ? ahorroDos : 0;
  const telTienda = celularTienda(whatsapp);

  // Borrador: se recupera al montar (después de hidratar, para no chocar con el HTML del servidor).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const b = leerBorrador();
      if (b) {
        setDatos(b.datos);
        // La cantidad del borrador solo vale para el mismo modelo (2 Biker no se pasan a las de IA).
        const mismoModelo = !inicialValido || b.modelo === inicialValido;
        if (cantidadInicial == null && mismoModelo) setCantidad(Math.min(MAX_CANTIDAD, Math.max(1, b.cantidad)));
        // Abrió sin modelo (p. ej. desde la portada) pero ya había escogido uno: se recupera, sin volver a las tarjetas.
        if (!inicialValido && b.modelo && modelos.some((m) => m.slug === b.modelo && m.disponible)) setSlug(b.modelo);
      }
      restaurado.current = true;
    });
    return () => cancelAnimationFrame(frame);
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restaurado.current) return;
    try {
      sessionStorage.setItem(BORRADOR_KEY, JSON.stringify({ modelo: slug, cantidad, datos } satisfies Borrador));
    } catch {}
  }, [slug, cantidad, datos]);

  // InitiateCheckout: cuando toca el primer campo del formulario, una sola vez por visita (brief de Meta).
  function empezarCompra(e: React.FocusEvent<HTMLFormElement>) {
    const t = e.target as HTMLElement;
    // Solo los campos de texto cuentan (no las tarjetas de 1 o 2 pares, que son radios).
    const escribe = t instanceof HTMLTextAreaElement || (t instanceof HTMLInputElement && t.type !== "radio" && t.type !== "checkbox");
    if (checkoutEnviado.has("visita") || !modelo || !escribe) return;
    checkoutEnviado.add("visita");
    track("InitiateCheckout", {
      value: total,
      contents: [{ content_id: modelo.contentId, content_name: modelo.nombre, quantity: cantidad, price: Math.round(total / cantidad) }],
    });
  }

  function enfocar(campo: Campo | "cambiar") {
    const el = document.getElementById(idDe(campo));
    if (!el) return;
    el.focus({ preventScroll: true });
    llevarA(el.closest("[data-campo]") ?? el, "centro");
  }

  function cambiarCantidad(n: number) {
    setCantidad(n);
    if (n === 2 && modelo && !dosParesEnviado.has(modelo.slug)) {
      dosParesEnviado.add(modelo.slug);
      const valor = totalPedido(modelo.slug, modelo.precio, n);
      track("AddToCart", {
        value: valor,
        contents: [{ content_id: modelo.contentId, content_name: modelo.nombre, quantity: n, price: Math.round(valor / n) }],
      });
    }
  }

  function escribir(campo: Exclude<Campo, "ciudad">, valor: string) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    if (errores[campo]) setErrores((e) => ({ ...e, [campo]: undefined }));
    if (campo === "direccion" && avisoDireccion && /\d/.test(valor)) setAvisoDireccion(false);
  }

  function salir(campo: Exclude<Campo, "ciudad">) {
    let d = datos;
    if (campo === "celular") {
      // "+57 300 123 4567" o "3001234567" → "300 123 4567"
      const limpio = normalizeColombianMobile(datos.celular);
      if (limpio) d = { ...datos, celular: formatPhone(limpio) };
      if (d !== datos) setDatos(d);
    }
    if (campo === "direccion") setAvisoDireccion(d.direccion.trim().length >= 5 && !/\d/.test(d.direccion));
    // Un campo vacío que nunca se llenó no se marca al pasar por encima: solo al pedir.
    if (!d[campo].trim() && !errores[campo]) return;
    setErrores((e) => ({ ...e, [campo]: validar(campo, d) }));
  }

  function elegirCiudad(o: { ciudad: string; departamento: string } | null, origen: OrigenCiudad) {
    setDatos((d) => ({ ...d, ciudad: o?.ciudad ?? "", departamento: o?.departamento ?? "" }));
    if (o) setErrores((e) => ({ ...e, ciudad: undefined }));
    if (o && (origen === "lista" || origen === "rapido")) requestAnimationFrame(() => document.getElementById(idDe("direccion"))?.focus());
  }

  function elegirModelo(nuevo: string) {
    const antes = slug;
    setSlug(nuevo);
    setCambiando(false);
    if (antes) requestAnimationFrame(() => document.getElementById(idDe("cambiar"))?.focus());
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current || !modelo) return;
    const form = new FormData(event.currentTarget);
    const locales: Errores = {};
    for (const c of ORDEN) {
      const e = validar(c, datos);
      if (e) locales[c] = e;
    }
    const primero = ORDEN.find((c) => locales[c]);
    if (primero) {
      setErrores(locales);
      setFormError("Revisa los datos marcados.");
      enfocar(primero);
      return;
    }

    enviando.current = true;
    setPending(true);
    setFormError(null);
    eventId.current ??= newEventId();
    const celular = normalizeColombianMobile(datos.celular)!;
    const cuerpo = {
      modelo: modelo.slug,
      cantidad,
      nombre: datos.nombre.trim().replace(/\s+/g, " "),
      celular,
      departamento: datos.departamento,
      ciudad: datos.ciudad,
      direccion: datos.direccion.trim(),
      barrio: datos.barrio.trim(),
      complemento: datos.complemento.trim(),
      eventId: eventId.current,
      website: String(form.get("website") ?? ""),
    };

    // Si la señal se cae o el servidor tarda, no sabemos si el pedido entró: reintentar es seguro
    // (el servidor reconoce el mismo eventId) y WhatsApp queda como salida.
    const DUDA = "La señal está lenta y no sabemos si tu pedido entró. Toca otra vez “Pedir” o escríbenos por WhatsApp.";
    let r: PedidoRespuesta;
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(25_000),
      });
      const json = (await res.json().catch(() => null)) as PedidoRespuesta | null;
      r = json ?? { ok: false, message: res.ok ? DUDA : "No pudimos registrar el pedido. Intenta de nuevo o escríbenos por WhatsApp." };
      if (!json && res.status >= 500) r = { ok: false, message: DUDA };
    } catch (error) {
      const tiempo = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
      r = { ok: false, message: tiempo ? DUDA : "Se cayó la conexión. Revisa tu internet e intenta de nuevo." };
    }

    if (!r.ok) {
      enviando.current = false;
      setPending(false);
      const fe = { ...(r.fieldErrors ?? {}) };
      if (fe.departamento && !fe.ciudad) fe.ciudad = fe.departamento;
      const servidor: Errores = {};
      for (const c of ORDEN) if (fe[c]) servidor[c] = fe[c];
      setErrores(servidor);
      setFormError(r.message);
      const p = ORDEN.find((c) => servidor[c]);
      if (p) enfocar(p);
      return;
    }

    const contents: Contents = [
      { content_id: modelo.contentId, content_name: modelo.nombre, quantity: cantidad, price: Math.round(r.total / cantidad) },
    ];
    const guardado: PedidoGuardado = {
      numero: r.numero,
      total: r.total,
      eventId: r.eventId,
      modelo: modelo.slug,
      nombreModelo: modelo.nombre,
      cantidad,
      precio: r.precio,
      ahorro: r.ahorro,
      contents,
      nombre: cuerpo.nombre,
      celular,
      direccion: cuerpo.direccion,
      complemento: cuerpo.complemento || undefined,
      barrio: cuerpo.barrio,
      ciudad: cuerpo.ciudad,
      departamento: cuerpo.departamento,
    };
    try {
      sessionStorage.setItem(PEDIDO_KEY, JSON.stringify(guardado));
      sessionStorage.removeItem(BORRADOR_KEY);
    } catch {}
    // replace: "atrás" desde gracias no vuelve al formulario ya enviado (ni a la hoja abierta).
    router.replace(`/pedido/gracias?n=${encodeURIComponent(r.numero)}`);
  }

  // Enter en un campo pasa al siguiente; en el último, envía.
  function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    const t = e.target as HTMLElement;
    if (e.key !== "Enter" || e.defaultPrevented || t.tagName !== "INPUT" || t.getAttribute("enterkeyhint") !== "next") return;
    e.preventDefault();
    const i = ORDEN.findIndex((c) => idDe(c) === t.id);
    const siguiente = ORDEN[i + 1];
    if (siguiente) document.getElementById(idDe(siguiente))?.focus();
  }

  const disponibles = modelos.filter((m) => m.disponible);
  const eligiendo = !modelo || cambiando;
  const textoWhatsApp = modelo
    ? `Hola, quiero pedir ${cantidad > 1 ? `${cantidad} pares de ` : ""}las gafas ${sinGafas(modelo.nombre)}`
    : "Hola, quiero pedir unas gafas. ¿Me ayudas?";

  const pidePorWhatsApp = whatsapp ? (
    <WhatsAppLink number={whatsapp} text={textoWhatsApp} className="font-semibold text-ink underline">
      ¿Prefieres pedir por WhatsApp?
    </WhatsAppLink>
  ) : null;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      onFocus={empezarCompra}
      aria-label="Pedido contraentrega"
      className={`group/form ${hoja ? "flex min-h-0 flex-1 flex-col" : ""}`}
    >
      {/* El contorno global de :focus-visible no tiene capa y le gana a focus:outline-none de Tailwind. */}
      <style href="gl-campo" precedence="default">
        {".gl-campo:focus-visible{outline:none}"}
      </style>
      <div data-hoja-cuerpo className={hoja ? "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-8" : ""}>
        {eligiendo ? (
          <fieldset>
            <legend className="text-[1.0625rem] font-semibold">
              {modelo ? "Escoge el modelo" : cantidad === 2 ? "¿Cuáles quieres? (2 pares)" : "¿Cuáles quieres?"}
            </legend>
            <div className="mt-3 grid gap-2.5">
              {modelos.map((m) => {
                const actual = m.slug === slug;
                return (
                  <button
                    key={m.slug}
                    type="button"
                    disabled={!m.disponible}
                    aria-pressed={actual}
                    onClick={() => elegirModelo(m.slug)}
                    className={`flex w-full items-center gap-3.5 rounded-[14px] border-2 bg-paper p-3 pr-4 text-left transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                      actual ? "border-night" : "border-line hover:border-ink-soft"
                    }`}
                  >
                    <Miniatura imagen={m.imagen} className="size-16" />
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug font-semibold">{m.nombre}</span>
                      <span className="mt-0.5 block text-[0.95rem] leading-snug text-ink-soft">
                        {m.disponible ? m.paraQue : "Agotadas por ahora"}
                      </span>
                    </span>
                    <span className="tabular shrink-0 self-start pt-0.5 font-semibold">
                      {formatCOP(cantidad === 2 ? totalPedido(m.slug, m.precio, 2) : m.precio)}
                    </span>
                  </button>
                );
              })}
            </div>
            {!disponibles.length ? (
              <p className="mt-3 text-[0.95rem] text-ink-soft">Por ahora no tenemos gafas disponibles. Escríbenos y te avisamos cuándo llegan.</p>
            ) : null}
            {!modelo && pidePorWhatsApp ? <p className="mt-4 text-[0.95rem]">{pidePorWhatsApp}</p> : null}
          </fieldset>
        ) : (
          <div className="flex items-center gap-3 rounded-[14px] border border-line bg-paper p-2.5 pr-2">
            <Miniatura imagen={modelo.imagen} className="size-14" />
            <div className="min-w-0 flex-1">
              <p className="leading-snug font-semibold">{modelo.nombre}</p>
              <p className="tabular text-[0.95rem] text-ink-soft">{formatCOP(modelo.precio)} el par</p>
            </div>
            <button
              id={idDe("cambiar")}
              type="button"
              onClick={() => {
                setCambiando(true);
                requestAnimationFrame(() => formRef.current?.querySelector<HTMLButtonElement>(`[aria-pressed="true"]`)?.focus());
              }}
              className="min-h-11 shrink-0 rounded-full px-3 text-[0.95rem] font-semibold text-ink underline"
            >
              Cambiar
            </button>
          </div>
        )}

        {modelo ? (
          <>
            {/* Cantidad: el combo real de 2 (oferta.ts) con la cuenta a la vista, sin precios tachados. */}
            <fieldset className="mt-6">
              <legend className="text-[1.0625rem] font-semibold">¿Cuántos pares?</legend>
              <div className="mt-3 grid gap-2.5">
                <OpcionCantidad nombre={`${uid}-cantidad`} checked={cantidad === 1} onChange={() => cambiarCantidad(1)}>
                  <span className="flex-1 font-semibold">1 par</span>
                  <span className="tabular font-semibold">{formatCOP(modelo.precio)}</span>
                </OpcionCantidad>
                <OpcionCantidad nombre={`${uid}-cantidad`} checked={cantidad === 2} onChange={() => cambiarCantidad(2)} arriba>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="font-semibold">2 pares</span>
                      {combo !== null ? (
                        <span className="type-label rounded-full bg-night px-2 py-1 text-[0.6rem] whitespace-nowrap text-cream">
                          Ahorras {formatCOP(ahorroDos)}
                        </span>
                      ) : null}
                    </span>
                    {combo !== null ? (
                      <span className="tabular mt-1 block text-[0.875rem] leading-snug text-ink-soft">
                        2 × {formatCOP(modelo.precio)} = {formatCOP(modelo.precio * 2)}; en combo te quedan en {formatCOP(combo)}
                      </span>
                    ) : null}
                  </span>
                  <span className="tabular shrink-0 self-start font-semibold">{formatCOP(totalPedido(modelo.slug, modelo.precio, 2))}</span>
                </OpcionCantidad>
              </div>
              {whatsapp ? (
                <p className="mt-2.5 text-[0.95rem] text-ink-soft">
                  ¿Más de 2?{" "}
                  <WhatsAppLink
                    number={whatsapp}
                    text={`Hola, quiero pedir más de 2 pares de las gafas ${sinGafas(modelo.nombre)}`}
                    className="font-semibold text-ink underline"
                  >
                    Escríbenos
                  </WhatsAppLink>
                </p>
              ) : null}
            </fieldset>

            {/* Datos de entrega */}
            <fieldset className="mt-7">
              <legend className="text-[1.0625rem] font-semibold">¿A dónde te las mandamos?</legend>
              <div className="mt-3 grid gap-4">
                <Campo id={idDe("celular")} label="Celular con WhatsApp" error={errores.celular} ayuda="Por aquí te confirmamos el pedido">
                  {(props) => (
                    <input
                      {...props}
                      name="celular"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      enterKeyHint="next"
                      value={datos.celular}
                      onChange={(e) => escribir("celular", e.target.value)}
                      onBlur={() => salir("celular")}
                    />
                  )}
                </Campo>
                <Campo id={idDe("nombre")} label="Nombre y apellido" error={errores.nombre}>
                  {(props) => (
                    <input
                      {...props}
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      value={datos.nombre}
                      onChange={(e) => escribir("nombre", e.target.value)}
                      onBlur={() => salir("nombre")}
                    />
                  )}
                </Campo>
                <Campo id={idDe("ciudad")} label="Ciudad o municipio" error={errores.ciudad}>
                  {(props) => (
                    <CiudadInput
                      id={props.id}
                      className={props.className}
                      describedBy={props["aria-describedby"]}
                      error={errores.ciudad}
                      valor={datos.ciudad ? ({ ciudad: datos.ciudad, departamento: datos.departamento } satisfies CiudadValor) : null}
                      onElegir={elegirCiudad}
                      onSalir={(v, escribio) => {
                        if (v) setErrores((e) => ({ ...e, ciudad: undefined }));
                        else if (escribio || errores.ciudad) setErrores((e) => ({ ...e, ciudad: validar("ciudad", VACIO) }));
                      }}
                    />
                  )}
                </Campo>
                <Campo
                  id={idDe("direccion")}
                  label="Dirección"
                  error={errores.direccion}
                  ayuda="Ej.: Cra 15 # 32-45"
                  aviso={
                    avisoDireccion && !errores.direccion
                      ? "No vemos el número de la casa. Si lo tiene, agrégalo; si no, cuéntanos cómo llegar en el punto de referencia."
                      : undefined
                  }
                >
                  {(props) => (
                    <input
                      {...props}
                      name="direccion"
                      type="text"
                      autoComplete="address-line1"
                      enterKeyHint="next"
                      value={datos.direccion}
                      onChange={(e) => escribir("direccion", e.target.value)}
                      onBlur={() => salir("direccion")}
                    />
                  )}
                </Campo>
                <Campo id={idDe("barrio")} label="Barrio" error={errores.barrio}>
                  {(props) => (
                    <input
                      {...props}
                      name="barrio"
                      type="text"
                      autoComplete="address-level3"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      value={datos.barrio}
                      onChange={(e) => escribir("barrio", e.target.value)}
                      onBlur={() => salir("barrio")}
                    />
                  )}
                </Campo>
                <Campo
                  id={idDe("complemento")}
                  label={
                    <>
                      Apto, torre o punto de referencia <span className="font-normal text-ink-soft">(opcional)</span>
                    </>
                  }
                  error={errores.complemento}
                  ayuda="Ej.: Torre 2 apto 501, o frente al parque"
                  opcional
                >
                  {(props) => (
                    <input
                      {...props}
                      name="complemento"
                      type="text"
                      autoComplete="address-line2"
                      enterKeyHint="send"
                      maxLength={140}
                      value={datos.complemento}
                      onChange={(e) => escribir("complemento", e.target.value)}
                      onBlur={() => salir("complemento")}
                    />
                  )}
                </Campo>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              </div>
            </fieldset>

            {/* Resumen */}
            <section aria-label="Resumen del pedido" className="mt-7 rounded-[14px] border border-line bg-paper p-4">
              <dl className="tabular space-y-1.5 text-[0.95rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">
                    {cantidad} × {modelo.nombre}
                  </dt>
                  <dd className="shrink-0">{formatCOP(modelo.precio * cantidad)}</dd>
                </div>
                {ahorro ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-soft">Descuento combo 2 pares</dt>
                    <dd className="shrink-0">−{formatCOP(ahorro)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Envío</dt>
                  <dd>Gratis</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5">
                  <dt className="font-semibold">Pagas al recibir</dt>
                  <dd className="type-display text-[1.6rem]">{formatCOP(total)}</dd>
                </div>
              </dl>
              {modelo.slug === "biker" ? (
                <p className="mt-3 flex items-start gap-2 border-t border-line pt-3 text-[0.95rem]">
                  <Info className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
                  Recuerda: no incluye tarjeta microSD.
                </p>
              ) : null}
            </section>

            {cantidad === 1 && combo !== null ? (
              <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-cream-2/70 py-3 pr-3 pl-4">
                <p className="flex-1 text-[0.95rem] leading-snug">
                  ¿Agregas otro par? Las 2 te quedan en {formatCOP(combo)} (ahorras {formatCOP(ahorroDos)}) y van en el mismo paquete.
                </p>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(2)}
                  className="min-h-11 shrink-0 rounded-full border border-night/25 bg-paper px-4 text-[0.95rem] font-semibold text-night transition-colors duration-200 hover:border-night"
                >
                  Sí, agregar
                </button>
              </div>
            ) : null}
            <p className="sr-only" aria-live="polite">
              Total: {formatCOP(total)}
            </p>

            <p className="mt-5 text-center text-xs leading-relaxed text-ink-soft">
              Al pedir aceptas los{" "}
              <Link href="/politicas/terminos" target="_blank" rel="noopener" className="underline">
                términos
              </Link>{" "}
              y la{" "}
              <Link href="/politicas/privacidad" target="_blank" rel="noopener" className="underline">
                política de datos
              </Link>
              .
            </p>
          </>
        ) : null}
      </div>

      {modelo ? (
        <div
          className={
            hoja
              ? "shrink-0 border-t border-line bg-cream px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              : "sticky bottom-0 z-10 -mx-5 mt-6 border-t border-line bg-cream px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mx-0 md:border-0 md:px-0"
          }
        >
          {formError ? (
            <p role="alert" className="mb-2.5 rounded-[10px] border border-alert/40 bg-alert/[0.05] px-3 py-2 text-[0.95rem] text-alert">
              {formError}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className={`${buttonPrimary} w-full px-4`}>
            {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
            {pending ? "Enviando tu pedido…" : `Pedir · pagas ${formatCOP(total)} al recibir`}
          </button>
          {/* Con el teclado abierto en el celular solo queda el botón, para dejar sitio al campo. */}
          <div className="max-md:group-has-[input:not([type=radio]):focus]/form:hidden">
            <p className="mt-2 text-center text-[0.8125rem] leading-snug text-ink-soft">
              No pagas nada hoy. Te escribimos por WhatsApp{telTienda ? ` desde el ${telTienda}` : ""} para confirmar; sin tu SÍ no
              despachamos.
            </p>
            {pidePorWhatsApp ? <p className="mt-1 text-center text-[0.8125rem]">{pidePorWhatsApp}</p> : null}
          </div>
        </div>
      ) : null}
    </form>
  );
}

function Miniatura({ imagen, className }: { imagen: ModeloForm["imagen"]; className: string }) {
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] border border-line/70 bg-white ${className}`}>
      {imagen ? (
        <Image src={imagen.url} alt="" fill sizes="64px" quality={75} className="object-contain" />
      ) : (
        <Glasses className="size-6 text-ink-soft" strokeWidth={1.25} aria-hidden />
      )}
    </span>
  );
}

function OpcionCantidad({
  nombre,
  checked,
  onChange,
  arriba,
  children,
}: {
  nombre: string;
  checked: boolean;
  onChange: () => void;
  /** Radio alineado con la primera línea (cuando la opción tiene dos líneas). */
  arriba?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex min-h-16 cursor-pointer gap-3.5 rounded-[14px] border-2 bg-paper px-4 py-3 transition-colors duration-200 ${
        arriba ? "items-start" : "items-center"
      } ${checked ? "border-night" : "border-line hover:border-ink-soft"}`}
    >
      <input type="radio" name={nombre} checked={checked} onChange={onChange} className={`size-5 shrink-0 ${arriba ? "mt-0.5" : ""}`} />
      {children}
    </label>
  );
}

const inputClass = (error?: string) =>
  `gl-campo mt-1.5 block min-h-[52px] w-full rounded-[12px] border bg-paper px-4 text-[1.0625rem] text-ink placeholder:text-ink-soft focus:border-night focus:ring-2 focus:ring-night/15 focus:outline-none ${
    error ? "border-alert" : "border-line"
  }`;

type CampoProps = {
  id: string;
  className: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

function Campo({
  id,
  label,
  error,
  ayuda,
  aviso,
  opcional,
  children,
}: {
  id: string;
  label: React.ReactNode;
  error?: string;
  ayuda?: string;
  aviso?: string;
  opcional?: boolean;
  children: (props: CampoProps) => React.ReactNode;
}) {
  const nota = error ?? ayuda;
  const notaId = `${id}-nota`;
  const avisoId = `${id}-aviso`;
  const describedBy = [nota ? notaId : null, aviso ? avisoId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div data-campo className="scroll-mt-4">
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
      </label>
      {children({
        id,
        className: inputClass(error),
        required: opcional ? undefined : true,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {nota ? (
        <p id={notaId} className={`mt-1.5 text-[0.875rem] leading-snug ${error ? "text-alert" : "text-ink-soft"}`}>
          {nota}
        </p>
      ) : null}
      {aviso ? (
        <p id={avisoId} className="mt-1.5 flex items-start gap-1.5 text-[0.875rem] leading-snug text-ink">
          <Info className="mt-0.5 size-3.5 shrink-0 text-ink-soft" aria-hidden />
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
