"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/store/icons";
import { useAltoBarraCompra, useAvisoAbierto } from "@/components/store/promo-aviso";
import { WhatsAppLink } from "@/components/store/whatsapp-link";

/**
 * WhatsApp flotante abajo a la derecha. En el celular es un círculo de 48 px solo con el ícono;
 * desde 768 px lleva también la palabra "WhatsApp".
 * - Se esconde mientras se ve un botón de compra o de WhatsApp de la página (marcados con
 *   data-hides-wa), para no taparlos ni repetirlos.
 * - En el celular sube por encima de la barra de compra fija cuando está a la vista, y se aparta
 *   mientras está abierto el aviso de la promoción.
 * - `desktopOnly` lo quita en el celular donde la barra de compra ya trae su propio WhatsApp.
 */
export function WhatsAppFloat({ number, text, desktopOnly }: { number: string | null; text: string; desktopOnly?: boolean }) {
  const [hidden, setHidden] = useState(true);
  const altoBarra = useAltoBarraCompra();
  const aviso = useAvisoAbierto();

  useEffect(() => {
    const targets = [...document.querySelectorAll("[data-hides-wa]")];
    if (!targets.length) {
      const id = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(id);
    }
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  if (!number) return null;

  // Con la barra a la vista queda 12 px por encima de ella (la barra ya incluye el área segura).
  const subir = altoBarra ? `translateY(calc(1rem + env(safe-area-inset-bottom) - ${altoBarra + 12}px))` : undefined;
  const estado = hidden
    ? "pointer-events-none translate-y-3 opacity-0"
    : aviso
      ? "max-md:pointer-events-none max-md:translate-y-3 max-md:opacity-0"
      : "";

  return (
    <div
      data-flotante
      inert={hidden}
      style={{ transform: subir }}
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 transition-[opacity,translate,transform] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-opacity md:bottom-6 ${
        desktopOnly ? "hidden md:block" : ""
      } ${estado}`}
    >
      <WhatsAppLink
        number={number}
        text={text}
        aria-label="Escribir por WhatsApp"
        className="inline-flex size-12 items-center justify-center rounded-full bg-[#25D366] text-[#062b16] shadow-[var(--shadow-soft)] transition-[scale] duration-300 hover:scale-[1.03] md:size-auto md:min-h-12 md:gap-2 md:py-2.5 md:pr-4 md:pl-3 md:text-[0.95rem] md:font-semibold"
      >
        <WhatsAppIcon className="size-7 md:size-6" />
        <span className="hidden md:inline">WhatsApp</span>
      </WhatsAppLink>
    </div>
  );
}
