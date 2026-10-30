// Promociones reales de la tienda (sin otros imports: este archivo va en el JS de todas las páginas).
// Combo de 2: un precio fijo por 2 pares del mismo modelo. Sale del envío que se ahorra (va un solo
// paquete). Cambiar aquí cambia la web, los pop-ups, el pedido en Shopify y lo que cobra Dropi.
// Hoy: 2 Biker por $259.900 (definido por Jeronimo el 30/10/2026). Las gafas con IA no tienen combo.

export type SlugOferta = "biker" | "ia";

/** Cantidad máxima por pedido en el formulario. */
export const MAX_CANTIDAD = 2;

/** Precio total de 2 pares por modelo; null = sin combo (2 pares cuestan el doble). */
export const COMBO_DOS: Record<SlugOferta, number | null> = {
  biker: 259900,
  ia: null,
};

/** Precio del combo de 2 si aplica y de verdad es más barato que 2 sueltas. */
export function precioCombo(slug: string, precio: number): number | null {
  const combo = COMBO_DOS[slug as SlugOferta] ?? null;
  return combo !== null && combo < precio * 2 ? combo : null;
}

/** Cuánto se ahorra llevando 2 (0 si no hay combo). */
export function ahorroCombo(slug: string, precio: number): number {
  const combo = precioCombo(slug, precio);
  return combo === null ? 0 : precio * 2 - combo;
}

/** Total del pedido con la promoción aplicada. */
export function totalPedido(slug: string, precio: number, cantidad: number): number {
  const combo = precioCombo(slug, precio);
  if (combo !== null && cantidad === 2) return combo;
  return precio * cantidad;
}

/** Modelo que tiene combo (para el aviso y la barra de anuncio). */
export const MODELO_CON_COMBO: SlugOferta | null =
  (Object.keys(COMBO_DOS) as SlugOferta[]).find((s) => COMBO_DOS[s] !== null) ?? null;
