import { NextResponse } from "next/server";
import { applyWompiTransaction } from "@/lib/payments";
import { fetchTransaction } from "@/lib/wompi";

// Wompi devuelve al cliente aquí con ?id=<transacción>. Confirmamos el estado
// directamente con Wompi (no confiamos en la URL) y mandamos a la página del pedido.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.redirect(new URL("/", url));

  const tx = await fetchTransaction(id);
  const result = tx ? await applyWompiTransaction(tx) : null;
  if (!result) return NextResponse.redirect(new URL("/", url));

  return NextResponse.redirect(new URL(`/pedido/${result.orderId}`, url));
}
