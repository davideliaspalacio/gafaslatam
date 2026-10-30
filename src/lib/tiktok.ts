import "server-only";
import { createHash } from "node:crypto";

// Evento de pedido para TikTok (en Meta equivale a Purchase).
// Se envía al crear un pedido contraentrega y al aprobarse un pago online.
export const PURCHASE_EVENT = "PlaceAnOrder";

const sha256 = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

type ServerEvent = {
  pixelId: string | null;
  event: string;
  eventId: string;
  url?: string | null;
  referrer?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  ttclid?: string | null;
  phone?: string | null; // 10 dígitos colombianos
  email?: string | null;
  externalId?: string | null;
  value: number;
  contents: { content_id: string; content_name: string; quantity: number; price: number }[];
};

/** TikTok Events API v1.3. No hace nada si falta el token o el píxel. */
export async function sendTikTokEvent(e: ServerEvent) {
  const token = process.env.TIKTOK_EVENTS_ACCESS_TOKEN;
  if (!token || !e.pixelId) return;

  const user: Record<string, string> = {};
  if (e.ttclid) user.ttclid = e.ttclid;
  if (e.phone) user.phone = sha256(`+57${e.phone}`);
  if (e.email) user.email = sha256(e.email);
  if (e.externalId) user.external_id = sha256(e.externalId);
  if (e.ip) user.ip = e.ip;
  if (e.userAgent) user.user_agent = e.userAgent;

  try {
    const res = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: { "Access-Token": token, "Content-Type": "application/json" },
      body: JSON.stringify({
        event_source: "web",
        event_source_id: e.pixelId,
        data: [
          {
            event: e.event,
            event_time: Math.floor(Date.now() / 1000),
            event_id: e.eventId,
            user,
            page: { url: e.url ?? undefined, referrer: e.referrer ?? undefined },
            properties: {
              currency: "COP",
              value: e.value,
              content_type: "product",
              contents: e.contents,
            },
          },
        ],
      }),
    });
    if (!res.ok) console.error("TikTok Events API", res.status, await res.text());
  } catch (error) {
    console.error("TikTok Events API", error);
  }
}
