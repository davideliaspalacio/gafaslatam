"use client";

// STUB temporal: el agente del formulario reemplaza este archivo con la hoja inferior real.
// La interfaz (props) es fija: el layout de la tienda la monta una vez con estos datos.

import type { ModeloForm } from "@/components/store/order-form";

export type PedidoSheetProps = {
  modelos: ModeloForm[];
  /** Número de WhatsApp de la tienda (solo dígitos, con 57), o null. */
  whatsapp: string | null;
};

export function PedidoSheet(_props: PedidoSheetProps) {
  return null;
}
