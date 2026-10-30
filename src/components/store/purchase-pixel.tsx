"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

type Contents = { content_id: string; content_name: string; quantity: number; price: number }[];

/** Envía la compra una sola vez por pedido (aunque recarguen la página). */
export function PurchasePixel({
  orderId,
  eventId,
  value,
  contents,
}: {
  orderId: string;
  eventId: string;
  value: number;
  contents: Contents;
}) {
  useEffect(() => {
    const key = `gl_purchase_${orderId}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {}
    const t = window.setTimeout(() => {
      track("PlaceAnOrder", { value, contents }, eventId);
      try {
        localStorage.setItem(key, "1");
      } catch {}
    }, 800);
    return () => window.clearTimeout(t);
  }, [orderId, eventId, value, contents]);
  return null;
}
