import type { ModeloForm } from "@/components/store/order-form";
import type { ModeloTienda } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import type { Contents } from "@/lib/pixel";

/** Lo que el formulario deja en sessionStorage para la página de gracias (píxel y mensaje de WhatsApp). */
export type PedidoGuardado = {
  numero: string;
  /** Lo que cobra el mensajero: el total del pedido en Shopify. */
  total: number;
  eventId: string;
  modelo: string;
  nombreModelo: string;
  cantidad: number;
  /** Precio de un par en Shopify al momento del pedido. */
  precio: number;
  /** Descuento del combo de 2 ya aplicado al total (0 si no aplica). */
  ahorro: number;
  contents: Contents;
  nombre: string;
  /** 10 dígitos. */
  celular: string;
  direccion: string;
  /** Apto, torre o punto de referencia (opcional). */
  complemento?: string;
  barrio: string;
  ciudad: string;
  departamento: string;
};

export const PEDIDO_KEY = "gl_pedido";

/** Borrador del formulario en sessionStorage: si el navegador de TikTok recarga, no se pierde lo escrito. */
export const BORRADOR_KEY = "gl_pedido_borrador";

/** Lo que necesita el formulario de cada modelo (sale de getModelos()). */
export function aModeloForm(m: ModeloTienda): ModeloForm {
  const foto = m.imagenes[0];
  return {
    slug: m.slug,
    nombre: m.nombre,
    corto: m.corto,
    contentId: String(m.dropiId),
    precio: m.precio,
    paraQue: m.comparacion.paraQue,
    imagen: foto ? { url: foto.url, alt: foto.alt, ancho: foto.ancho, alto: foto.alto } : null,
    disponible: m.disponible,
  };
}

/** "Medellín (Antioquia)"; Bogotá va sola. */
export function lugar(p: Pick<PedidoGuardado, "ciudad" | "departamento">) {
  return p.departamento === "Bogotá D.C." ? p.departamento : `${p.ciudad} (${p.departamento})`;
}

/** Dirección completa en una línea: "Cra 15 # 32-45, apto 501, Laureles". */
export function direccionCompleta(p: Pick<PedidoGuardado, "direccion" | "complemento" | "barrio">) {
  return [p.direccion, p.complemento, p.barrio].filter(Boolean).join(", ");
}

/**
 * Mensaje de WhatsApp ya escrito para confirmar el pedido, con "SÍ CONFIRMO" al final.
 * Las cuentas cuadran con lo que cobra el mensajero: subtotal − descuento = total.
 */
export function mensajeConfirmacion(numero: string, p: PedidoGuardado | null) {
  if (!p) return `Hola, hice el pedido #${numero} en gafaslatam.com.\n\nSÍ CONFIRMO`;
  const subtotal = p.total + p.ahorro;
  return [
    `Hola, hice el pedido #${numero} en gafaslatam.com:`,
    p.cantidad > 1 ? `- ${p.nombreModelo} x${p.cantidad}: ${formatCOP(subtotal)}` : `- ${p.nombreModelo} x1`,
    p.ahorro ? `- Descuento combo 2 pares: −${formatCOP(p.ahorro)}` : null,
    `- Pago al recibir: ${formatCOP(p.total)}`,
    `- Entrega: ${direccionCompleta(p)}, ${lugar(p)}`,
    "",
    "SÍ CONFIRMO",
  ]
    .filter((l) => l !== null)
    .join("\n");
}
