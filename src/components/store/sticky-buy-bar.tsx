"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/format";

/** Barra de compra fija en el celular: visible siempre que el botón principal no esté en pantalla. */
export function StickyBuyBar({ price, href, cod }: { price: number; href: string; cod: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cta = document.getElementById("buy-cta");
    if (!cta) return;
    const observer = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`on-dark fixed inset-x-0 bottom-0 z-30 border-t border-mid bg-night px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[translate,opacity] duration-300 ease-[var(--ease-out-expo)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-4">
        <div className="leading-tight">
          <p className="tabular text-lg font-semibold text-amber">{formatCOP(price)}</p>
          <p className="text-xs text-mist">{cod ? "Pagas al recibir" : "Envío a toda Colombia"}</p>
        </div>
        <Link
          href={href}
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-amber px-5 font-semibold text-night hover:bg-amber-deep"
        >
          Pedir
        </Link>
      </div>
    </div>
  );
}
