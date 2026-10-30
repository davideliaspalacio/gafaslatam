"use client";

import Link from "next/link";
import type { Slug } from "@/lib/productos";

// Abre el formulario de pedido (hoja inferior) desde cualquier parte de la tienda sin cambiar de página.
// La hoja (<PedidoSheet />, montada una vez en el layout de la tienda) escucha este evento.
// Si la hoja no está montada (o no hay JS), el enlace lleva a /pedido como respaldo.

export const PEDIDO_EVENT = "gl:pedido";

export type AbrirPedido = { modelo?: Slug; cantidad?: number; origen?: string };

export function abrirPedido(detalle: AbrirPedido = {}) {
  window.dispatchEvent(new CustomEvent<AbrirPedido>(PEDIDO_EVENT, { detail: detalle }));
}

/** Marca de que la hoja está lista para recibir el evento (la pone PedidoSheet al montarse). */
export const SHEET_READY_ATTR = "data-pedido-sheet";

export function PedirButton({
  modelo,
  cantidad,
  origen,
  className,
  children,
  id,
  ...rest
}: AbrirPedido & {
  className?: string;
  children: React.ReactNode;
  id?: string;
} & { [key: `data-${string}`]: string | boolean | undefined }) {
  const params = new URLSearchParams();
  if (modelo) params.set("modelo", modelo);
  if (cantidad && cantidad > 1) params.set("cantidad", String(cantidad));
  const href = `/pedido${params.size ? `?${params}` : ""}`;
  return (
    <Link
      id={id}
      href={href}
      className={className}
      {...rest}
      onClick={(e) => {
        if (!document.querySelector(`[${SHEET_READY_ATTR}]`)) return; // sin hoja: navega a /pedido
        e.preventDefault();
        abrirPedido({ modelo, cantidad, origen });
      }}
    >
      {children}
    </Link>
  );
}
