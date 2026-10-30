"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

/** ViewContent con el ID de Dropi como content_id (así lo pide el brief de Meta). */
export function ViewContent({ contentId, name, price }: { contentId: string; name: string; price: number }) {
  useEffect(() => {
    // Espera a que el píxel cargue (afterInteractive) antes de enviar.
    const t = window.setTimeout(
      () => track("ViewContent", { value: price, contents: [{ content_id: contentId, content_name: name, quantity: 1, price }] }),
      600,
    );
    return () => window.clearTimeout(t);
  }, [contentId, name, price]);
  return null;
}
