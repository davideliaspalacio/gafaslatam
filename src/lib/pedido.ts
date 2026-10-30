import type { Contents } from "@/lib/pixel";

/** Lo que el formulario deja en sessionStorage para la página de gracias (píxel y mensaje de WhatsApp). */
export type PedidoGuardado = {
  numero: string;
  total: number;
  eventId: string;
  modelo: string;
  nombreModelo: string;
  cantidad: number;
  contents: Contents;
  nombre: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  departamento: string;
};

export const PEDIDO_KEY = "gl_pedido";
