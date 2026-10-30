"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/store/icons";
import { WhatsAppLink } from "@/components/store/whatsapp-link";

/**
 * WhatsApp flotante abajo a la derecha. Se esconde mientras se ve un botón de compra
 * o de WhatsApp de la página (marcados con data-hides-wa), para no taparlos ni repetirlos.
 * `desktopOnly` lo quita en el celular donde ya hay barra de compra y enlace de WhatsApp.
 */
export function WhatsAppFloat({ number, text, desktopOnly }: { number: string | null; text: string; desktopOnly?: boolean }) {
  const [hidden, setHidden] = useState(true);

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
  return (
    <WhatsAppLink
      number={number}
      text={text}
      aria-label="Escribir por WhatsApp"
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 min-h-12 items-center gap-2 rounded-full bg-[#25D366] py-2.5 pr-4 pl-3 text-[0.95rem] font-semibold text-[#062b16] shadow-[var(--shadow-soft)] transition-[opacity,translate,scale] duration-300 hover:scale-[1.03] md:bottom-6 ${
        desktopOnly ? "hidden md:inline-flex" : "inline-flex"
      } ${hidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`}
    >
      <WhatsAppIcon className="size-6" />
      WhatsApp
    </WhatsAppLink>
  );
}
