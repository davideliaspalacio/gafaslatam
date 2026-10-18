import { NextResponse } from "next/server";
import { z } from "zod";
import { serviceClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";

const str = (max: number) => z.string().trim().max(max).nullish();

const Visit = z.object({
  session_id: z.string().min(8).max(64),
  utm_source: str(120),
  utm_medium: str(120),
  utm_campaign: str(160),
  utm_content: str(160),
  ttclid: str(300),
  landing_page: str(500),
  referrer: str(500),
});

// Una fila por sesión de navegador: sirve para medir conversión por campaña en el panel.
export async function POST(request: Request) {
  if (!hasSupabase()) return new NextResponse(null, { status: 204 });
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = Visit.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 400 });

  const ua = request.headers.get("user-agent") ?? "";
  if (/bot|crawler|spider|preview|facebookexternalhit|lighthouse/i.test(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  await serviceClient()
    .from("visits")
    .upsert({ ...parsed.data, user_agent: ua.slice(0, 400) }, { onConflict: "session_id", ignoreDuplicates: true });

  return new NextResponse(null, { status: 204 });
}
