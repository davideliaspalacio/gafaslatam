import { after, type NextRequest } from "next/server";
import { z } from "zod";
import { ATTR_COOKIE, parseAttributionCookie } from "@/lib/atribucion";
import { getSettings } from "@/lib/catalog";
import { departamento } from "@/lib/ciudades";
import { formatCOP, normalizeColombianMobile } from "@/lib/format";
import { sendMetaPurchase } from "@/lib/meta";
import { MAX_CANTIDAD, OFERTA, SLUGS, modeloPorSlug, totalPedido } from "@/lib/productos";
import { crearPedido, hasShopify, productosShopify } from "@/lib/shopify";
import { PURCHASE_EVENT, sendTikTokEvent } from "@/lib/tiktok";

// Crea el pedido contraentrega en Shopify. El precio sale de Shopify, nunca del navegador.
// El pedido queda "por-confirmar": nadie lo manda a Dropi hasta que el cliente responda
// "SÍ CONFIRMO" por WhatsApp.

const texto = (min: number, max: number, mensaje: string) => z.string().trim().min(min, mensaje).max(max, mensaje);

const Pedido = z.object({
  modelo: z.enum(SLUGS, { error: "Escoge un modelo" }),
  cantidad: z.coerce.number().int().min(1).max(MAX_CANTIDAD),
  nombre: texto(3, 80, "Escribe tu nombre y apellido").refine((v) => v.split(/\s+/).length >= 2, "Escribe también tu apellido"),
  celular: z.string().trim().max(20),
  departamento: z.string().trim().min(1, "Escoge tu departamento").max(40),
  ciudad: z.string().trim().min(1, "Escoge tu ciudad o municipio").max(80),
  direccion: texto(5, 120, "Escribe la dirección de entrega"),
  barrio: texto(3, 120, "Escribe el barrio o una indicación para llegar"),
  eventId: z.string().trim().max(80).optional(),
  website: z.string().max(0).optional(), // trampa para bots: llega vacío
});

export type PedidoRespuesta =
  | { ok: true; numero: string; total: number; eventId: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

// Freno básico de abuso por IP (en memoria de cada instancia).
const recientes = new Map<string, number[]>();
function demasiados(ip: string | null) {
  if (!ip) return false;
  const ahora = Date.now();
  const lista = (recientes.get(ip) ?? []).filter((t) => ahora - t < 10 * 60_000);
  lista.push(ahora);
  recientes.set(ip, lista);
  if (recientes.size > 5000) recientes.clear();
  return lista.length > 5;
}

const json = (body: PedidoRespuesta, status = 200) => Response.json(body, { status });
const FALLA = "No pudimos registrar el pedido. Intenta de nuevo o escríbenos por WhatsApp.";

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = Pedido.safeParse(raw);
  const fieldErrors: Record<string, string> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
  }
  // Celular, departamento y ciudad se revisan siempre, para devolver todos los errores de una vez.
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const celular = normalizeColombianMobile(String(body.celular ?? ""));
  const dep = departamento(String(body.departamento ?? "").trim());
  if (!celular) fieldErrors.celular ??= "Escribe un celular de 10 dígitos que empiece por 3";
  if (!dep) fieldErrors.departamento ??= "Escoge tu departamento";
  else if (!dep.ciudades.includes(String(body.ciudad ?? "").trim())) fieldErrors.ciudad ??= "Escoge tu ciudad o municipio de la lista";
  if (!parsed.success || Object.keys(fieldErrors).length || !celular || !dep) {
    return json({ ok: false, message: "Revisa los datos marcados.", fieldErrors }, 400);
  }
  const d = parsed.data;
  if (d.website) return json({ ok: false, message: FALLA }, 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
  if (demasiados(ip)) return json({ ok: false, message: "Recibimos varios pedidos seguidos. Escríbenos por WhatsApp y te ayudamos." }, 429);

  if (!hasShopify()) {
    console.error("/api/pedido: faltan las variables de Shopify");
    return json({ ok: false, message: FALLA }, 503);
  }

  const modelo = modeloPorSlug(d.modelo)!;
  const attr = parseAttributionCookie(request.cookies.get(ATTR_COOKIE)?.value);
  const eventId = d.eventId || crypto.randomUUID();
  const [nombre, ...resto] = d.nombre.split(/\s+/);
  const apellido = resto.join(" ");

  try {
    // Precio y variante en vivo desde Shopify.
    const producto = (await productosShopify([modelo.shopifyProductId])).get(modelo.shopifyProductId);
    if (!producto || !producto.activo) {
      return json({ ok: false, message: "Este modelo no está disponible ahora. Escríbenos por WhatsApp." }, 409);
    }

    const atributos = [
      ["event_id", eventId],
      ["utm_source", attr.utm_source],
      ["utm_medium", attr.utm_medium],
      ["utm_campaign", attr.utm_campaign],
      ["utm_content", attr.utm_content],
      ["utm_term", attr.utm_term],
      ["ttclid", attr.ttclid],
      ["fbclid", attr.fbclid],
      ["landing_page", attr.landing_page],
      ["referrer", attr.referrer],
    ]
      .filter((a): a is [string, string] => Boolean(a[1]))
      .map(([key, value]) => ({ key, value }));

    // "Lleva 2 y ahorra": la última unidad va aparte con el descuento, así el total que cobra Dropi es exacto.
    const conOferta = d.cantidad >= OFERTA.desde;
    const total = totalPedido(producto.precio, d.cantidad);
    const lineas = conOferta
      ? [
          { varianteId: producto.varianteId, cantidad: d.cantidad - 1, precioUnitario: producto.precio },
          { varianteId: producto.varianteId, cantidad: 1, precioUnitario: producto.precio - OFERTA.ahorro },
        ]
      : [{ varianteId: producto.varianteId, cantidad: d.cantidad, precioUnitario: producto.precio }];

    const pedido = await crearPedido({
      lineas,
      nombre,
      apellido,
      celular,
      direccion: d.direccion,
      barrio: d.barrio,
      ciudad: d.ciudad,
      departamentoCodigo: dep.codigo,
      nota: [
        `Pedido web contraentrega. Confirmar por WhatsApp (+57 ${celular}) antes de enviarlo a Dropi.`,
        `Barrio / indicaciones: ${d.barrio}`,
        conOferta ? `Promoción: lleva ${OFERTA.desde} y ahorra ${formatCOP(OFERTA.ahorro)}` : null,
        `Total a cobrar: ${formatCOP(total)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      atributos,
    });

    // Eventos del servidor (si hay tokens), después de responder.
    after(async () => {
      const settings = await getSettings();
      const contents = [{ id: modelo.sku, quantity: d.cantidad, item_price: Math.round(total / d.cantidad) }];
      const userAgent = request.headers.get("user-agent");
      await Promise.all([
        sendMetaPurchase({
          pixelId: settings.meta_pixel_id,
          eventId,
          url: attr.landing_page,
          ip,
          userAgent,
          fbp: request.cookies.get("_fbp")?.value,
          fbc: request.cookies.get("_fbc")?.value,
          fbclid: attr.fbclid,
          phone: celular,
          firstName: nombre,
          lastName: apellido,
          city: d.ciudad,
          state: dep.codigo,
          externalId: pedido.id,
          value: pedido.total,
          contents,
        }),
        sendTikTokEvent({
          pixelId: settings.tiktok_pixel_id,
          event: PURCHASE_EVENT,
          eventId,
          url: attr.landing_page,
          referrer: attr.referrer,
          ip,
          userAgent,
          ttclid: attr.ttclid,
          ttp: request.cookies.get("_ttp")?.value,
          phone: celular,
          externalId: pedido.id,
          value: pedido.total,
          contents: contents.map((c) => ({ content_id: c.id, content_name: modelo.nombre, quantity: c.quantity, price: c.item_price })),
        }),
      ]);
    });

    return json({ ok: true, numero: pedido.numero, total: pedido.total, eventId });
  } catch (error) {
    console.error("/api/pedido", error);
    return json({ ok: false, message: FALLA }, 502);
  }
}
