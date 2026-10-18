import "server-only";
import { getSettings } from "@/lib/catalog";
import { serviceClient } from "@/lib/supabase/clients";
import { PURCHASE_EVENT, sendTikTokEvent } from "@/lib/tiktok";
import type { OrderItem } from "@/lib/types";
import type { WompiTransaction } from "@/lib/wompi";

/**
 * Aplica el resultado de una transacción de Wompi al pedido.
 * Idempotente: lo llaman tanto la página de regreso como el webhook.
 */
export async function applyWompiTransaction(tx: WompiTransaction) {
  const db = serviceClient();
  const { data: order } = await db
    .from("orders")
    .select("id, total, payment_status, phone, email, items, event_id, ttclid, ip, user_agent, landing_page")
    .eq("payment_reference", tx.reference)
    .maybeSingle();
  if (!order) return null;

  const amountMatches = tx.amount_in_cents === order.total * 100 && tx.currency === "COP";
  const next =
    tx.status === "APPROVED" && amountMatches
      ? "pagado"
      : tx.status === "PENDING"
        ? "pendiente"
        : "fallido";

  if (order.payment_status !== next) {
    await db
      .from("orders")
      .update({
        payment_status: next,
        payment_provider_id: tx.id,
        ...(next === "pagado" ? { status: "confirmado" as const } : {}),
      })
      .eq("id", order.id);

    if (next === "pagado") {
      const settings = await getSettings();
      const items = (order.items as OrderItem[]) ?? [];
      await sendTikTokEvent({
        pixelId: settings.tiktok_pixel_id,
        event: PURCHASE_EVENT,
        eventId: order.event_id ?? order.id,
        url: order.landing_page,
        ip: order.ip as string | null,
        userAgent: order.user_agent,
        ttclid: order.ttclid,
        phone: order.phone,
        email: order.email,
        externalId: order.id,
        value: order.total,
        contents: items.map((i) => ({
          content_id: i.product_id,
          content_name: i.name,
          quantity: i.qty,
          price: i.unit_price,
        })),
      });
    }
  }
  return { orderId: order.id, status: next };
}
