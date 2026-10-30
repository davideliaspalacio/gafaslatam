"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/store/icons";
import { PedirButton } from "@/components/store/pedido-trigger";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { formatCOP } from "@/lib/format";
import type { Slug } from "@/lib/productos";

/**
 * Barra de compra fija en el celular: WhatsApp (solo ícono), precio y "Pedir ahora".
 * Sale visible desde el servidor: en el primer pantallazo del celular es el único botón de compra
 * (#buy-cta queda más abajo). Se esconde mientras #buy-cta está en pantalla, así nunca hay dos.
 */
export function StickyBuyBar({
  modelo,
  price,
  whatsapp,
  whatsappText,
}: {
  modelo: Slug;
  price: number;
  whatsapp: string | null;
  whatsappText: string;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const cta = document.getElementById("buy-cta");
    if (!cta) return;
    const observer = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-barra-compra
      inert={!show}
      className={`on-dark fixed inset-x-0 bottom-0 z-30 border-t border-mid bg-night px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-300 ease-[var(--ease-out-expo)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        {whatsapp ? (
          <WhatsAppLink
            number={whatsapp}
            text={whatsappText}
            aria-label="Escribir por WhatsApp"
            className="grid size-[52px] shrink-0 place-items-center rounded-full border border-mist/45 text-cream transition-colors duration-200 hover:border-cream hover:bg-cream/5"
          >
            <WhatsAppIcon className="size-6" />
          </WhatsAppLink>
        ) : null}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="tabular text-[1.125rem] font-semibold text-amber">{formatCOP(price)}</p>
          <p className="mt-0.5 text-[0.75rem] leading-snug text-mist">
            Pagas al recibir
            <br />
            Envío gratis
          </p>
        </div>
        <PedirButton
          modelo={modelo}
          origen="barra"
          data-pedir-barra
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-amber px-6 text-[1.0625rem] font-semibold text-night transition-colors duration-200 hover:bg-amber-deep active:translate-y-px"
        >
          Pedir ahora
        </PedirButton>
      </div>
    </div>
  );
}
