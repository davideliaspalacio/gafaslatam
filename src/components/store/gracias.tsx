"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/store/icons";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { formatCOP } from "@/lib/format";
import { PEDIDO_KEY, type PedidoGuardado } from "@/lib/pedido";
import { track } from "@/lib/pixel";

/**
 * Parte de la página de gracias que vive en el navegador: el resumen del pedido recién hecho,
 * el botón para confirmar por WhatsApp (con "SÍ CONFIRMO" ya escrito) y la compra en los píxeles,
 * que se manda una sola vez por pedido aunque recarguen la página.
 */
export function Gracias({ numero, whatsapp }: { numero: string; whatsapp: string | null }) {
  const [pedido, setPedido] = useState<PedidoGuardado | null>(null);

  useEffect(() => {
    let guardado: PedidoGuardado | null = null;
    try {
      const raw = sessionStorage.getItem(PEDIDO_KEY);
      const parsed = raw ? (JSON.parse(raw) as PedidoGuardado) : null;
      if (parsed?.numero === numero) guardado = parsed;
    } catch {}
    if (!guardado) return;
    const frame = requestAnimationFrame(() => setPedido(guardado));

    // Compra en Meta (Purchase) y TikTok (PlaceAnOrder): una vez, con el valor que confirmó la API.
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

  const mensaje = pedido
    ? [
        `Hola, hice el pedido #${numero} en gafaslatam.com:`,
        `- ${pedido.nombreModelo} x${pedido.cantidad}`,
        `- Pago al recibir: ${formatCOP(pedido.total)}`,
        `- Entrega: ${pedido.direccion}, ${pedido.barrio}, ${pedido.ciudad} (${pedido.departamento})`,
        "",
        "SÍ CONFIRMO",
      ].join("\n")
    : `Hola, hice el pedido #${numero} en gafaslatam.com. SÍ CONFIRMO`;

  const pasos = [
    {
      t: "Confirma por WhatsApp",
      d: "Toca el botón y envía el mensaje que ya va escrito. Si no lo envías, te escribimos nosotros: sin tu confirmación no despachamos.",
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
        <WhatsAppLink
          number={whatsapp}
          text={mensaje}
          data-hides-wa
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[1.0625rem] font-semibold text-[#062b16] transition-[filter] hover:brightness-95 sm:w-auto"
        >
          <WhatsAppIcon className="size-5" />
          Confirmar mi pedido por WhatsApp
        </WhatsAppLink>
      ) : null}

      {pedido ? (
        <dl className="tabular mt-10 max-w-md divide-y divide-line border-y border-line text-[0.95rem]">
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Gafas</dt>
            <dd className="text-right font-semibold">
              {pedido.nombreModelo} × {pedido.cantidad}
            </dd>
          </div>
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Entrega</dt>
            <dd className="text-right">
              {pedido.direccion}, {pedido.barrio}
              <br />
              {pedido.ciudad}, {pedido.departamento}
            </dd>
          </div>
          <div className="flex justify-between gap-6 py-3">
            <dt className="text-ink-soft">Pagas al recibir</dt>
            <dd className="font-semibold">{formatCOP(pedido.total)}</dd>
          </div>
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
