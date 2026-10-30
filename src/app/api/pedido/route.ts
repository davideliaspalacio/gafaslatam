import { after, type NextRequest } from "next/server";
import { z } from "zod";
import { ATTR_COOKIE, parseAttributionCookie } from "@/lib/atribucion";
import { getSettings } from "@/lib/catalog";
import { departamento } from "@/lib/ciudades";
import { formatCOP, normalizeColombianMobile } from "@/lib/format";
import { sendMetaPurchase } from "@/lib/meta";
import { MAX_CANTIDAD, ahorroCombo, totalPedido } from "@/lib/oferta";
import { SLUGS, modeloPorSlug } from "@/lib/productos";
import { crearPedido, hasShopify, productosShopify } from "@/lib/shopify";
import { PURCHASE_EVENT, sendTikTokEvent } from "@/lib/tiktok";

// Crea el pedido contraentrega en Shopify. El precio sale de Shopify, nunca del navegador.
// El pedido queda "por-confirmar": nadie lo manda a Dropi hasta que el cliente responda
// "SÍ CONFIRMO" por WhatsApp.

// Mensajes en español también cuando el campo falta o llega con otro tipo (zod los da en inglés).
const MENSAJES = {
  modelo: "Escoge cuáles gafas quieres",
  cantidad: `Escoge entre 1 y ${MAX_CANTIDAD} pares`,
  nombre: "Escribe tu nombre y apellido",
  apellido: "Escribe también tu apellido",
  celular: "Escribe un celular de 10 dígitos que empiece por 3",
  departamento: "Escoge tu ciudad o municipio de la lista",
  ciudad: "Escoge tu ciudad o municipio de la lista",
  direccion: "Escribe la dirección de entrega",
  barrio: "Escribe tu barrio",
  complemento: "El apto, torre o referencia es muy largo: déjalo en 120 letras o menos",
} as const;

const texto = (min: number, max: number, mensaje: string) =>
  z.string({ error: mensaje }).trim().min(min, mensaje).max(max, mensaje);

const Pedido = z.object(
  {
    modelo: z.enum(SLUGS, { error: MENSAJES.modelo }),
    cantidad: z.coerce.number({ error: MENSAJES.cantidad }).int(MENSAJES.cantidad).min(1, MENSAJES.cantidad).max(MAX_CANTIDAD, MENSAJES.cantidad),
    nombre: texto(3, 80, MENSAJES.nombre).refine((v) => v.split(/\s+/).length >= 2, MENSAJES.apellido),
    celular: texto(1, 20, MENSAJES.celular),
    departamento: texto(1, 40, MENSAJES.departamento),
    ciudad: texto(1, 80, MENSAJES.ciudad),
    direccion: texto(5, 120, MENSAJES.direccion),
    barrio: texto(3, 120, MENSAJES.barrio),
    /** Apto, torre o punto de referencia: opcional. */
    complemento: z.string({ error: MENSAJES.complemento }).trim().max(120, MENSAJES.complemento).optional(),
    eventId: z.string().trim().max(80).optional().catch(undefined),
    website: z.unknown().optional(), // trampa para bots: llega vacío
  },
  { error: "Revisa los datos marcados." },
);

export type PedidoRespuesta =
  | {
      ok: true;
      numero: string;
      /** Lo que cobra el mensajero (el total del pedido en Shopify). */
      total: number;
      eventId: string;
      /** Precio de un par en Shopify al momento del pedido. */
      precio: number;
      /** Descuento del combo de 2 ya aplicado al total (0 si no aplica). */
      ahorro: number;
    }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

// Reintentos seguros: si la misma solicitud (mismo eventId del navegador) vuelve a llegar porque se cayó
// la señal, se responde el pedido ya creado en vez de crear otro. En memoria de cada instancia, 30 minutos.
const yaCreados = new Map<string, { at: number; respuesta: Extract<PedidoRespuesta, { ok: true }> }>();
function pedidoYaCreado(id: string) {
  const ahora = Date.now();
  for (const [k, v] of yaCreados) if (ahora - v.at > 30 * 60_000) yaCreados.delete(k);
  return yaCreados.get(id)?.respuesta ?? null;
}

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
  if (!celular) fieldErrors.celular = MENSAJES.celular;
  if (!dep) fieldErrors.departamento ??= MENSAJES.departamento;
  else if (!dep.ciudades.includes(String(body.ciudad ?? "").trim())) fieldErrors.ciudad ??= MENSAJES.ciudad;
  if (!parsed.success || Object.keys(fieldErrors).length || !celular || !dep) {
    return json({ ok: false, message: "Revisa los datos marcados.", fieldErrors }, 400);
  }
  const d = parsed.data;
  if (d.website) return json({ ok: false, message: FALLA }, 400);
  const complemento = d.complemento || undefined;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;

  if (!hasShopify()) {
    console.error("/api/pedido: faltan las variables de Shopify");
    return json({ ok: false, message: FALLA }, 503);
  }

  const modelo = modeloPorSlug(d.modelo)!;
  const attr = parseAttributionCookie(request.cookies.get(ATTR_COOKIE)?.value);
  // Identificador de esta solicitud (lo genera el navegador y lo repite si reintenta).
  const solicitudId = d.eventId || crypto.randomUUID();
  const repetida = pedidoYaCreado(solicitudId);
  if (repetida) return json(repetida);
  if (demasiados(ip)) return json({ ok: false, message: "Recibimos varios pedidos seguidos. Escríbenos por WhatsApp y te ayudamos." }, 429);
  const [nombre, ...resto] = d.nombre.split(/\s+/);
  const apellido = resto.join(" ");

  try {
    // Precio y variante en vivo desde Shopify.
    const producto = (await productosShopify([modelo.shopifyProductId])).get(modelo.shopifyProductId);
    if (!producto || !producto.activo) {
      return json({ ok: false, message: "Este modelo no está disponible ahora. Escríbenos por WhatsApp." }, 409);
    }

    const atributos = [
      ["solicitud_id", solicitudId],
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

    // Combo de 2 (oferta.ts): el total que cobra Dropi tiene que ser exacto. Si se reparte parejo entre
    // las unidades va en una sola línea; si no, la última unidad lleva la diferencia.
    const total = totalPedido(modelo.slug, producto.precio, d.cantidad);
    const ahorro = d.cantidad === 2 ? ahorroCombo(modelo.slug, producto.precio) : 0;
    const lineas =
      total % d.cantidad === 0
        ? [{ varianteId: producto.varianteId, cantidad: d.cantidad, precioUnitario: total / d.cantidad }]
        : [
            { varianteId: producto.varianteId, cantidad: d.cantidad - 1, precioUnitario: producto.precio },
            { varianteId: producto.varianteId, cantidad: 1, precioUnitario: total - producto.precio * (d.cantidad - 1) },
          ];

    // De qué anuncio vino: en la nota y como etiqueta para filtrar en Shopify.
    const anuncio = [attr.utm_source, attr.utm_campaign, attr.utm_content].filter(Boolean).join(" · ");
    const etiquetaFuente = attr.utm_source
      ? `utm-${attr.utm_source.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30)}`
      : null;

    const pedido = await crearPedido({
      lineas,
      nombre,
      apellido,
      celular,
      direccion: d.direccion,
      complemento,
      barrio: d.barrio,
      ciudad: d.ciudad,
      departamentoCodigo: dep.codigo,
      nota: [
        `Pedido web contraentrega. Confirmar por WhatsApp (+57 ${celular}) antes de enviarlo a Dropi.`,
        `Barrio: ${d.barrio}`,
        complemento ? `Apto, torre o referencia: ${complemento}` : null,
        ahorro ? `Promoción: combo de 2 por ${formatCOP(total)} (ahorra ${formatCOP(ahorro)})` : null,
        anuncio ? `Anuncio: ${anuncio}` : null,
        `Total a cobrar: ${formatCOP(total)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      atributos,
      etiquetas: etiquetaFuente ? [etiquetaFuente] : [],
    });
    // La compra se reporta a Meta y TikTok con el número de pedido como event_id (navegador y servidor).
    const eventId = pedido.numero;

    // Eventos del servidor (si hay tokens), después de responder.
    after(async () => {
      const settings = await getSettings();
      const contents = [{ id: String(modelo.dropiId), quantity: d.cantidad, item_price: Math.round(total / d.cantidad) }];
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

    if (pedido.repetido) console.info(`/api/pedido: #${pedido.numero} marcado como repetido`);
    const respuesta = { ok: true as const, numero: pedido.numero, total: pedido.total, eventId, precio: producto.precio, ahorro };
    yaCreados.set(solicitudId, { at: Date.now(), respuesta });
    return json(respuesta);
  } catch (error) {
    console.error("/api/pedido", error);
    return json({ ok: false, message: FALLA }, 502);
  }
}
