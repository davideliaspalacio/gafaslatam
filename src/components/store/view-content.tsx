"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

export function ViewContent({ sku, name, price }: { sku: string; name: string; price: number }) {
  useEffect(() => {
    // Espera a que el píxel cargue (afterInteractive) antes de enviar.
    const t = window.setTimeout(
      () => track("ViewContent", { value: price, contents: [{ content_id: sku, content_name: name, quantity: 1, price }] }),
      600,
    );
    return () => window.clearTimeout(t);
  }, [sku, name, price]);
  return null;
}
