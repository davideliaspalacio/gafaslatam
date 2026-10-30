"use client";

// Eventos de píxel en el navegador (TikTok y Meta, si están configurados).
// Brief: ver producto, tocar "Pedir", enviar pedido y tocar WhatsApp.
// Los pedidos usan el mismo event_id que el servidor para no contar doble.

type Contents = { content_id: string; content_name: string; quantity: number; price: number }[];

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

const ATTR_KEY = "gl_attr";
const ATTR_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ttclid", "fbclid"] as const;

export type Attribution = Partial<Record<(typeof ATTR_FIELDS)[number] | "landing_page" | "referrer", string>>;

/** Guarda la atribución de la visita: la última campaña con parámetros gana. */
export function captureAttribution(): Attribution {
  let stored: Attribution = {};
  try {
    stored = JSON.parse(localStorage.getItem(ATTR_KEY) || "{}");
  } catch {}
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const f of ATTR_FIELDS) {
    const value = params.get(f);
    if (value) fresh[f] = value.slice(0, 300);
  }
  if (Object.keys(fresh).length || !stored.landing_page) {
    const next: Attribution = {
      ...(Object.keys(fresh).length ? fresh : stored),
      landing_page: window.location.href.slice(0, 500),
      referrer: document.referrer.slice(0, 500) || undefined,
    };
    try {
      localStorage.setItem(ATTR_KEY, JSON.stringify(next));
    } catch {}
    return next;
  }
  return stored;
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(localStorage.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
}

export function newEventId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
