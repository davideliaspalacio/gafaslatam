import "server-only";
import { createHash } from "node:crypto";

// Meta Conversions API (CAPI). Manda la compra desde el servidor con el mismo event_id que el
// píxel del navegador, así Meta la cuenta una sola vez. No hace nada si falta el token o el píxel.
// Variables: META_CAPI_TOKEN (Administrador de eventos → el píxel → Configuración → Generar token de acceso)
// y NEXT_PUBLIC_META_PIXEL_ID (si no está, usa el ID guardado en /admin/ajustes).

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v23.0";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const norm = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export type MetaPurchase = {
  pixelId: string | null;
  eventId: string;
  url?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  fbclid?: string | null;
  /** 10 dígitos colombianos. */
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  /** Código del departamento (ANT, DC...). */
  state?: string | null;
  externalId?: string | null;
  value: number;
  contents: { id: string; quantity: number; item_price: number }[];
};

export async function sendMetaPurchase(e: MetaPurchase) {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || e.pixelId;
  if (!token || !pixelId || !/^\d+$/.test(pixelId)) return;

  const now = Math.floor(Date.now() / 1000);
  const fbc = e.fbc || (e.fbclid ? `fb.1.${now * 1000}.${e.fbclid}` : null);
  const user_data: Record<string, unknown> = {
    ph: [sha256(`57${e.phone}`)],
    country: [sha256("co")],
  };
  if (e.firstName) user_data.fn = [sha256(norm(e.firstName))];
  if (e.lastName) user_data.ln = [sha256(norm(e.lastName))];
  if (e.city) user_data.ct = [sha256(norm(e.city))];
  if (e.state) user_data.st = [sha256(norm(e.state))];
  if (e.externalId) user_data.external_id = [sha256(e.externalId)];
  if (e.ip) user_data.client_ip_address = e.ip;
  if (e.userAgent) user_data.client_user_agent = e.userAgent;
  if (e.fbp) user_data.fbp = e.fbp;
  if (fbc) user_data.fbc = fbc;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Purchase",
            event_time: now,
            event_id: e.eventId,
            action_source: "website",
            event_source_url: e.url ?? undefined,
            user_data,
            custom_data: {
              currency: "COP",
              value: e.value,
              content_type: "product",
              content_ids: e.contents.map((c) => c.id),
              contents: e.contents,
              num_items: e.contents.reduce((n, c) => n + c.quantity, 0),
            },
          },
        ],
      }),
    });
    if (!res.ok) console.error("Meta CAPI", res.status, (await res.text()).slice(0, 300));
  } catch (error) {
    console.error("Meta CAPI", error);
  }
}
