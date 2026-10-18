import { NextResponse } from "next/server";
import { applyWompiTransaction } from "@/lib/payments";
import { hasSupabase } from "@/lib/supabase/env";
import { verifyEventSignature, type WompiTransaction } from "@/lib/wompi";

// Configura esta URL en el panel de Wompi → Desarrolladores → URL de eventos:
// https://TU-DOMINIO/api/webhooks/wompi
export async function POST(request: Request) {
  if (!hasSupabase()) return new NextResponse(null, { status: 503 });
  let event: {
    event?: string;
    data: { transaction?: WompiTransaction } & Record<string, unknown>;
    signature?: { properties?: string[]; checksum?: string };
    timestamp?: number;
  };
  try {
    event = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (!verifyEventSignature(event)) return new NextResponse(null, { status: 401 });

  if (event.event === "transaction.updated" && event.data.transaction) {
    await applyWompiTransaction(event.data.transaction);
  }
  return NextResponse.json({ ok: true });
}
