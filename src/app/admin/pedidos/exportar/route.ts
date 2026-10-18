import { NextResponse } from "next/server";
import { sessionClient } from "@/lib/supabase/clients";
import type { OrderItem } from "@/lib/types";

const COLUMNS = [
  "pedido",
  "fecha",
  "estado",
  "pago",
  "estado_pago",
  "nombre",
  "celular",
  "correo",
  "departamento",
  "ciudad",
  "direccion",
  "indicaciones",
  "producto",
  "color",
  "cantidad",
  "total",
  "transportadora",
  "guia",
  "notas_cliente",
  "utm_source",
  "utm_campaign",
  "utm_content",
] as const;

const cell = (value: unknown) => {
  const s = value === null || value === undefined ? "" : String(value);
  // Evita inyección de fórmulas al abrir en Excel/Sheets.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

// CSV para subir a la transportadora o al proveedor. Respeta filtros ?estado=
export async function GET(request: Request) {
  const supabase = await sessionClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return new NextResponse("No autorizado", { status: 401 });

  const status = new URL(request.url).searchParams.get("estado");
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5000);
  if (status) query = query.eq("status", status as never);
  const { data: orders, error } = await query;
  if (error) return new NextResponse("No autorizado", { status: 403 });

  const lines = [COLUMNS.join(",")];
  for (const o of orders ?? []) {
    const items = (o.items as OrderItem[]) ?? [];
    lines.push(
      [
        o.number,
        new Date(o.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota" }),
        o.status,
        o.payment_method,
        o.payment_status,
        o.customer_name,
        o.phone,
        o.email,
        o.department,
        o.city,
        o.address,
        o.address_details,
        items.map((i) => i.name).join(" + "),
        items.map((i) => i.variant ?? "").join(" + "),
        items.reduce((n, i) => n + i.qty, 0),
        o.total,
        o.carrier,
        o.tracking_number,
        o.notes,
        o.utm_source,
        o.utm_campaign,
        o.utm_content,
      ]
        .map(cell)
        .join(","),
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
