"use client";

// Eventos de píxel en el navegador (TikTok y Meta, si están configurados).
// Brief: ver producto, tocar "Pedir", enviar pedido y tocar WhatsApp.
// Los pedidos usan el mismo event_id que el servidor para no contar doble.

import {
  ATTR_COOKIE,
  ATTR_MAX_AGE,
  CAMPAIGN_FIELDS,
  cleanAttribution,
  parseAttributionCookie,
  type Attribution,
} from "@/lib/atribucion";

export type Contents = { content_id: string; content_name: string; quantity: number; price: number }[];

type Ttq = { track: (event: string, props?: Record<string, unknown>, opts?: { event_id?: string }) => void };
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    ttq?: Ttq;
    fbq?: Fbq;
  }
}

type StoreEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "AddPaymentInfo" | "PlaceAnOrder";

// TikTok usa PlaceAnOrder para el pedido; Meta lo llama Purchase.
const META_EVENT: Record<StoreEvent, string> = {
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  AddPaymentInfo: "AddPaymentInfo",
  PlaceAnOrder: "Purchase",
};

export function track(event: StoreEvent, data: { value: number; contents: Contents }, eventId?: string) {
  const props = { currency: "COP", value: data.value, content_type: "product", contents: data.contents };
  try {
    window.ttq?.track(event, props, eventId ? { event_id: eventId } : undefined);
  } catch {}
  try {
    window.fbq?.(
      "track",
      META_EVENT[event],
      {
        currency: "COP",
        value: data.value,
        content_type: "product",
        content_ids: data.contents.map((c) => c.content_id),
        num_items: data.contents.reduce((n, c) => n + c.quantity, 0),
      },
      eventId ? { eventID: eventId } : undefined,
    );
  } catch {}
}

/** Tocar WhatsApp. */
export function trackContact() {
  try {
    window.ttq?.track("Contact");
  } catch {}
  try {
    window.fbq?.("track", "Contact");
  } catch {}
}

export type { Attribution };

function readCookie(): Attribution {
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${ATTR_COOKIE}=`))
      ?.slice(ATTR_COOKIE.length + 1);
    return parseAttributionCookie(raw);
  } catch {
    return {};
  }
}

function writeCookie(a: Attribution) {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(a))}; Max-Age=${ATTR_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {}
}

/** Guarda la atribución de la visita en una cookie: la última campaña con parámetros gana. */
export function captureAttribution(): Attribution {
  const stored = readCookie();
  const params = new URLSearchParams(window.location.search);
  const fresh: Record<string, string> = {};
  for (const f of CAMPAIGN_FIELDS) {
    const value = params.get(f);
    if (value) fresh[f] = value;
  }
  const hasFresh = Object.keys(fresh).length > 0;
  if (hasFresh || !stored.landing_page) {
    const next = cleanAttribution({
      ...(hasFresh ? fresh : stored),
      landing_page: window.location.origin + window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    });
    writeCookie(next);
    return next;
  }
  return stored;
}

export function readAttribution(): Attribution {
  return readCookie();
}

export function newEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
