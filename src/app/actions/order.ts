"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { getFeaturedProduct, getSettings } from "@/lib/catalog";
import { DEPARTMENTS } from "@/lib/colombia";
import { normalizeColombianMobile } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";
import { PURCHASE_EVENT, sendTikTokEvent } from "@/lib/tiktok";
import { bundlesOf, toProduct, type OrderItem } from "@/lib/types";
import { checkoutUrl, wompiConfigured } from "@/lib/wompi";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

const OrderInput = z.object({
  productId: z.uuid(),
  variantId: optional(60),
  qty: z.coerce.number().int().min(1).max(10),
  paymentMethod: z.enum(["contraentrega", "online"]),
  name: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  phone: z.string().trim().min(7, "Escribe tu celular").max(20),
  email: z
    .union([z.literal(""), z.email("Correo no válido").max(160)])
    .optional()
    .transform((v) => (v ? v : null)),
  department: z.enum(DEPARTMENTS, { error: "Elige tu departamento" }),
  city: z.string().trim().min(2, "Escribe tu ciudad o municipio").max(80),
  address: z.string().trim().min(5, "Escribe la dirección de entrega").max(200),
  addressDetails: optional(200),
  notes: optional(300),
  eventId: z.string().trim().max(80).optional(),
  website: z.string().max(0).optional(), // trampa para bots: debe llegar vacío
  attribution: z
    .object({
      utm_source: optional(120),
      utm_medium: optional(120),
      utm_campaign: optional(160),
      utm_content: optional(160),
      utm_term: optional(160),
      ttclid: optional(300),
      fbclid: optional(300),
      landing_page: optional(500),
      referrer: optional(500),
    })
    .partial()
    .optional(),
});

export type OrderFormInput = z.input<typeof OrderInput>;

export type OrderResult =
  | { ok: true; orderId: string; orderNumber: number; total: number; redirectUrl: string | null; demo?: boolean }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function placeOrder(input: OrderFormInput): Promise<OrderResult> {
  const parsed = OrderInput.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Revisa los datos marcados.", fieldErrors };
  }
  const data = parsed.data;
  if (data.website) return { ok: false, message: "No pudimos registrar el pedido." };

  const phone = normalizeColombianMobile(data.phone);
  if (!phone) {
    return {
      ok: false,
      message: "Revisa los datos marcados.",
      fieldErrors: { phone: "Escribe un celular colombiano de 10 dígitos (empieza por 3)" },
    };
  }

  // Modo demo (sin Supabase): se valida todo igual pero el pedido no se guarda.
  if (!hasSupabase()) {
    const [demoProduct, demoSettings] = await Promise.all([getFeaturedProduct(), getSettings()]);
    const demoBundle = demoProduct ? bundlesOf(demoProduct).find((b) => b.qty === data.qty) : null;
    if (!demoBundle) return { ok: false, message: "Esa cantidad no está disponible. Recarga la página." };
    const shipping = demoSettings.free_shipping ? 0 : demoSettings.shipping_cost;
    return { ok: true, orderId: "demo", orderNumber: 0, total: demoBundle.price + shipping, redirectUrl: null, demo: true };
  }

  const db = serviceClient();
  const settings = await getSettings();
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const userAgent = h.get("user-agent");

  // Freno básico de abuso: mismo celular o misma IP con demasiados pedidos seguidos.
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count: recentByPhone } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", tenMinutesAgo);
  if ((recentByPhone ?? 0) >= 3) {
    return { ok: false, message: "Ya recibimos varios pedidos con este celular. Escríbenos por WhatsApp si necesitas cambiar algo." };
  }
  if (ip) {
    const { count: recentByIp } = await db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", tenMinutesAgo);
    if ((recentByIp ?? 0) >= 8) return { ok: false, message: "Demasiados pedidos seguidos. Intenta de nuevo en unos minutos." };
  }

  // El precio siempre sale de la base de datos, nunca del navegador.
  const { data: row } = await db.from("products").select("*").eq("id", data.productId).eq("active", true).maybeSingle();
  if (!row) return { ok: false, message: "Este producto ya no está disponible." };
  const product = toProduct(row);

  const bundle = bundlesOf(product).find((b) => b.qty === data.qty);
  if (!bundle) return { ok: false, message: "Esa cantidad no está disponible. Recarga la página." };

  let variantName: string | null = null;
  if (product.variants.length) {
    const variant = product.variants.find((v) => v.id === data.variantId);
    if (!variant) return { ok: false, message: "Elige un color.", fieldErrors: { variantId: "Elige un color" } };
    variantName = variant.name;
  }

  const online = data.paymentMethod === "online";
  if (online && !(settings.online_payment_enabled && wompiConfigured())) {
    return { ok: false, message: "El pago online no está disponible ahora. Puedes pagar al recibir." };
  }
  if (!online && !settings.cod_enabled) {
    return { ok: false, message: "El pago contraentrega no está disponible ahora." };
  }

  const subtotal = bundle.price;
  const shipping = settings.free_shipping ? 0 : settings.shipping_cost;
  const total = subtotal + shipping;
  const items: OrderItem[] = [
    {
      product_id: product.id,
      name: product.name,
      variant: variantName,
      qty: bundle.qty,
      unit_price: Math.round(bundle.price / bundle.qty),
      line_total: bundle.price,
    },
  ];

  const { data: inStock, error: stockError } = await db.rpc("decrement_stock", {
    p_product_id: product.id,
    p_qty: bundle.qty,
  });
  if (stockError) {
    console.error("decrement_stock", stockError);
    return { ok: false, message: "No pudimos registrar el pedido. Intenta de nuevo." };
  }
  if (!inStock) return { ok: false, message: "Se agotaron las unidades disponibles. Escríbenos por WhatsApp." };

  const a = data.attribution ?? {};
  const eventId = data.eventId || crypto.randomUUID();

  const { data: order, error } = await db
    .from("orders")
    .insert({
      payment_method: data.paymentMethod,
      customer_name: data.name,
      phone,
      email: data.email,
      department: data.department,
      city: data.city,
      address: data.address,
      address_details: data.addressDetails,
      notes: data.notes,
      items,
      subtotal,
      shipping,
      total,
      utm_source: a.utm_source ?? null,
      utm_medium: a.utm_medium ?? null,
      utm_campaign: a.utm_campaign ?? null,
      utm_content: a.utm_content ?? null,
      utm_term: a.utm_term ?? null,
      ttclid: a.ttclid ?? null,
      fbclid: a.fbclid ?? null,
      landing_page: a.landing_page ?? null,
      referrer: a.referrer ?? null,
      user_agent: userAgent,
      ip,
      event_id: eventId,
    })
    .select("id, number")
    .single();

  if (error || !order) {
    console.error("insert order", error);
    if (product.stock !== null) {
      await db.from("products").update({ stock: (product.stock ?? 0) }).eq("id", product.id);
    }
    return { ok: false, message: "No pudimos registrar el pedido. Intenta de nuevo." };
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (online) {
    const reference = `P${order.number}-${crypto.randomUUID().slice(0, 8)}`;
    await db.from("orders").update({ payment_reference: reference }).eq("id", order.id);
    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.number,
      total,
      redirectUrl: checkoutUrl({
        reference,
        amountCOP: total,
        redirectUrl: `${site}/pago/resultado`,
        email: data.email,
        fullName: data.name,
        phone,
      }),
    };
  }

  after(() =>
    sendTikTokEvent({
      pixelId: settings.tiktok_pixel_id,
      event: PURCHASE_EVENT,
      eventId,
      url: a.landing_page ?? site,
      referrer: a.referrer,
      ip,
      userAgent,
      ttclid: a.ttclid,
      phone,
      email: data.email,
      externalId: order.id,
      value: total,
      contents: items.map((i) => ({
        content_id: i.product_id,
        content_name: i.name,
        quantity: i.qty,
        price: i.unit_price,
      })),
    }),
  );

  return { ok: true, orderId: order.id, orderNumber: order.number, total, redirectUrl: null };
}
