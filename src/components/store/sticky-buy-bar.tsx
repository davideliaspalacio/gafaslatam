"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/format";

/** Barra fija en el celular: aparece al pasar el botón principal y se oculta en el sobre de pedido. */
export function StickyBuyBar({ price, cod }: { price: number; cod: boolean }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const form = document.getElementById("pedido");
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setHeroVisible(e.isIntersecting || e.boundingClientRect.top > 0);
        if (e.target === form) setFormVisible(e.isIntersecting);
      }
    });
    if (hero) observer.observe(hero);
    if (form) observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const show = !heroVisible && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-carton-soft/15 bg-carton-night/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-[translate,opacity] duration-300 ease-[var(--ease-out-expo)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-4">
        <div className="leading-tight">
          <p className="tabular text-lg font-bold text-paper">{formatCOP(price)}</p>
          <p className="text-xs text-carton-soft">{cod ? "Pagas al recibir" : "Pago seguro"}</p>
        </div>
        <a
          href="#pedido"
          tabIndex={show ? 0 : -1}
          className="type-spec flex min-h-12 flex-1 items-center justify-center rounded-[3px] bg-flash px-4 text-[0.95rem] text-ink"
        >
          Pedir ahora
        </a>
      </div>
    </div>
  );
}
