"use client";

import { Check, Copy, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonOnLight } from "@/components/store/buttons";
import { WhatsAppIcon } from "@/components/store/icons";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { formatCOP, formatPhone } from "@/lib/format";
import { PEDIDO_KEY, direccionCompleta, lugar, mensajeConfirmacion, type PedidoGuardado } from "@/lib/pedido";
import { track } from "@/lib/pixel";

/**
 * Parte de la página de gracias que vive en el navegador: el resumen del pedido recién hecho,
 * el botón para confirmar por WhatsApp (con "SÍ CONFIRMO" ya escrito), "Copiar mensaje" por si
 * el navegador de TikTok no abre WhatsApp, y la compra en los píxeles, una sola vez por pedido
 * aunque recarguen la página.
 */
export function Gracias({ numero, whatsapp }: { numero: string; whatsapp: string | null }) {
  const [pedido, setPedido] = useState<PedidoGuardado | null>(null);
  const [copia, setCopia] = useState<"lista" | "copiado" | "fallo">("lista");

  useEffect(() => {
    let guardado: PedidoGuardado | null = null;
    try {
      const raw = sessionStorage.getItem(PEDIDO_KEY);
      const parsed = raw ? (JSON.parse(raw) as PedidoGuardado) : null;
      if (parsed?.numero === numero) guardado = { ...parsed, ahorro: Number(parsed.ahorro) || 0 };
    } catch {}
    if (!guardado) return;
    const frame = requestAnimationFrame(() => setPedido(guardado));

    // Compra en Meta (Purchase) y TikTok (PlaceAnOrder): una vez, con el total real que confirmó Shopify.
    const key = `gl_purchase_${numero}`;
    let yaEnviado = false;
    try {
      yaEnviado = Boolean(localStorage.getItem(key));
    } catch {}
    if (yaEnviado) return () => cancelAnimationFrame(frame);
    const t = window.setTimeout(() => {
      track("PlaceAnOrder", { value: guardado.total, contents: guardado.contents }, guardado.eventId);
      try {
        localStorage.setItem(key, "1");
      } catch {}
    }, 800);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(t);
    };
  }, [numero]);

  const mensaje = mensajeConfirmacion(numero, pedido);
  const digitos = whatsapp?.replace(/\D/g, "") ?? "";
  const telTienda = digitos.length === 12 && digitos.startsWith("57") ? formatPhone(digitos.slice(2)) : digitos || null;

  async function copiar() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(mensaje);
      ok = true;
    } catch {
      // Navegadores dentro de apps sin permiso de portapapeles: el truco viejo.
      try {
        const ta = document.createElement("textarea");
        ta.value = mensaje;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {}
    }
    setCopia(ok ? "copiado" : "fallo");
  }

  const pasos = [
    {
      t: "Confirma por WhatsApp",
      d: `Toca el botón y envía el mensaje que ya va escrito. Si no lo envías, te escribimos nosotros${
        pedido?.celular ? ` al ${formatPhone(pedido.celular)}` : ""
      }: sin tu confirmación no despachamos.`,
    },
    { t: "Lo despachamos", d: "Apenas confirmes, sale el pedido y te mandamos el número de guía." },
    {
      t: "Pagas al recibir",
      d: pedido
        ? `La transportadora te lo entrega en 2 a 5 días hábiles y ahí le pagas ${formatCOP(pedido.total)} en efectivo.`
        : "La transportadora te lo entrega en 2 a 5 días hábiles y ahí le pagas en efectivo.",
    },
  ];

  return (
    <div>
      {whatsapp ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <WhatsAppLink
            number={whatsapp}
            text={mensaje}
            data-hides-wa
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[1.0625rem] font-semibold text-[#062b16] transition-[filter] hover:brightness-95 sm:w-auto"
          >
            <WhatsAppIcon className="size-5" />
            Confirmar por WhatsApp
          </WhatsAppLink>
          <button type="button" onClick={copiar} className={`${buttonOnLight} w-full sm:w-auto`}>
            {copia === "copiado" ? <Check className="size-5" aria-hidden /> : <Copy className="size-5" aria-hidden />}
            {copia === "copiado" ? "Mensaje copiado" : "Copiar mensaje"}
          </button>
        </div>
      ) : null}
      <p className="mt-3 text-[0.95rem] text-ink-soft" aria-live="polite">
        {copia === "copiado"
          ? `Ahora abre WhatsApp, pégalo en el chat${telTienda ? ` con el ${telTienda}` : ""} y envíalo.`
          : `¿No se abre WhatsApp? Copia el mensaje y envíalo${telTienda ? ` al ${telTienda}` : ""}.`}
      </p>
      {copia === "fallo" ? (
        <label className="mt-3 block max-w-md">
          <span className="block text-[0.95rem] font-semibold">No pudimos copiarlo solo. Mantén presionado el texto para copiarlo:</span>
          <textarea
            readOnly
            value={mensaje}
            rows={7}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-1.5 block w-full rounded-[12px] border border-line bg-paper p-3 text-[0.95rem] text-ink focus:border-night focus:ring-2 focus:ring-night/15 focus:outline-none"
          />
        </label>
      ) : null}

      {pedido ? (
        <dl className="tabular mt-10 max-w-md divide-y divide-line border-y border-line text-[0.95rem]">
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Gafas</dt>
            <dd className="text-right font-semibold">
              {pedido.nombreModelo} × {pedido.cantidad}
            </dd>
          </div>
          {pedido.ahorro ? (
            <div className="py-3">
              <dt className="sr-only">Descuento</dt>
              <dd>
                Ahorraste {formatCOP(pedido.ahorro)} con el combo de {pedido.cantidad}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Entrega</dt>
            <dd className="text-right">
              {direccionCompleta(pedido)}
              <br />
              {lugar(pedido)}
            </dd>
          </div>
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Pagas al recibir</dt>
            <dd className="font-semibold">{formatCOP(pedido.total)}</dd>
          </div>
          {pedido.modelo === "biker" ? (
            <div className="py-3">
              <dt className="sr-only">Ojo</dt>
              <dd className="flex items-start gap-2">
                <Info className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden />
                Recuerda: no incluye tarjeta microSD.
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      <h2 className="mt-12 text-[1.25rem] font-semibold">Lo que sigue</h2>
      <ol className="mt-4 max-w-xl space-y-4">
        {pasos.map((p, i) => (
          <li key={p.t} className="flex gap-4">
            <span className="type-display tabular w-5 shrink-0 text-[1.4rem] text-night">{i + 1}</span>
            <span>
              <span className="block font-semibold">{p.t}</span>
              <span className="block text-ink-soft">{p.d}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
