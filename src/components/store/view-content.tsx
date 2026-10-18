"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";
import type { Product } from "@/lib/types";

export function ViewContent({ product }: { product: Pick<Product, "id" | "name" | "price"> }) {
  useEffect(() => {
    // Espera a que el píxel cargue (afterInteractive) antes de enviar.
    const t = window.setTimeout(
      () =>
        track("ViewContent", {
          value: product.price,
          contents: [{ content_id: product.id, content_name: product.name, quantity: 1, price: product.price }],
        }),
      600,
    );
    return () => window.clearTimeout(t);
  }, [product.id, product.name, product.price]);
  return null;
}
