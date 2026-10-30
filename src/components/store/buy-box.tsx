"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonPrimary } from "@/components/store/buttons";
import type { Variant } from "@/lib/types";

/** Color y botón de compra. El pedido se completa en /pedido con el modelo y el color ya elegidos. */
export function BuyBox({ slug, variants, cod }: { slug: string; variants: Variant[]; cod: boolean }) {
  const [color, setColor] = useState(variants[0]?.id ?? "");
  const current = variants.find((v) => v.id === color);
  const href = `/pedido?modelo=${encodeURIComponent(slug)}${color ? `&color=${encodeURIComponent(color)}` : ""}`;

  return (
    <div>
      {variants.length > 1 ? (
        <fieldset className="mb-6">
          <legend className="text-[0.95rem]">
            Color: <span className="font-semibold">{current?.name}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {variants.map((v) => (
              <label key={v.id} className="cursor-pointer" title={v.name}>
                <input
                  type="radio"
                  name="color"
                  value={v.id}
                  checked={v.id === color}
                  onChange={() => setColor(v.id)}
                  className="peer sr-only"
                />
                <span
                  className="block size-11 rounded-full ring-2 ring-line ring-offset-2 ring-offset-cream transition-shadow peer-checked:ring-night peer-focus-visible:ring-amber-deep"
                  style={{ background: v.swatch }}
                />
                <span className="sr-only">{v.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <Link id="buy-cta" data-hides-wa href={href} className={`${buttonPrimary} w-full sm:w-auto`}>
        {cod ? "Pedir · pagas al recibir" : "Pedir"}
      </Link>
    </div>
  );
}
