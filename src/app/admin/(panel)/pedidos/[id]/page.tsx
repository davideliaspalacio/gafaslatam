import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { WhatsAppIcon } from "@/components/store/icons";
import { Loading, Panel, PaymentBadge, StatusBadge } from "@/components/admin/ui";
import { OrderEditForm } from "@/components/admin/order-edit-form";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/catalog";
import { formatCOP, formatDateTime, formatPhone } from "@/lib/format";
import type { OrderItem } from "@/lib/types";

export const metadata = { title: "Pedido" };

export default function OrderDetailPage({ params }: PageProps<"/admin/pedidos/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: { params: PageProps<"/admin/pedidos/[id]">["params"] }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { supabase } = await requireAdmin();
  const [{ data: o }, settings] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    getSettings(),
  ]);
  if (!o) notFound();

  const items = (o.items as OrderItem[]) ?? [];
  const first = o.customer_name.split(" ")[0];
  const summary = items.map((i) => `${i.qty} × ${i.name}${i.variant ? ` (${i.variant})` : ""}`).join(", ");
  const address = `${o.address}${o.address_details ? `, ${o.address_details}` : ""}, ${o.city}, ${o.department}`;
  const messages = [
    {
      label: "Confirmar pedido",
      text: `Hola ${first}, te escribimos de ${settings.store_name} para confirmar tu pedido #${o.number}: ${summary}. Total ${formatCOP(o.total)}${o.payment_method === "contraentrega" ? ", pagas al recibir" : ""}. ¿La dirección de entrega es ${address}?`,
    },
    {
      label: "Enviar guía",
      text: `Hola ${first}, tu pedido #${o.number} ya va en camino${o.carrier ? ` con ${o.carrier}` : ""}.${o.tracking_number ? ` Número de guía: ${o.tracking_number}.` : ""} Llega en ${settings.delivery_estimate.toLowerCase()}.`,
    },
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/pedidos" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> Pedidos
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-carton text-4xl text-carton">Pedido #{o.number}</h1>
          <p className="mt-1 text-sm text-ink-soft">{formatDateTime(o.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <PaymentBadge method={o.payment_method} status={o.payment_status} />
          <StatusBadge status={o.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Panel title="Cliente y entrega">
            <dl className="grid gap-4 px-4 py-4 text-[0.95rem] sm:grid-cols-2">
              <Info label="Nombre" value={o.customer_name} />
              <Info label="Celular" value={formatPhone(o.phone)} />
              <Info label="Dirección" value={o.address} />
              <Info label="Barrio / indicaciones" value={o.address_details} />
              <Info label="Ciudad" value={`${o.city}, ${o.department}`} />
              <Info label="Correo" value={o.email} />
              {o.notes ? <Info label="Nota del cliente" value={o.notes} /> : null}
            </dl>
            <div className="flex flex-wrap gap-2 border-t border-ink/10 px-4 py-3">
              {messages.map((m) => (
                <a
                  key={m.label}
                  href={`https://wa.me/57${o.phone}?text=${encodeURIComponent(m.text)}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-carton px-4 text-sm font-semibold text-paper hover:bg-carton-deep"
                >
                  <WhatsAppIcon className="size-4" /> {m.label}
                </a>
              ))}
            </div>
          </Panel>

          <Panel title="Productos">
            <table className="tabular w-full text-sm">
              <tbody className="divide-y divide-ink/10">
                {items.map((i) => (
                  <tr key={i.product_id + i.variant}>
                    <td className="px-4 py-3">
                      {i.name}
                      {i.variant ? <span className="text-ink-soft"> · {i.variant}</span> : null}
                    </td>
                    <td className="px-3 py-3 text-right text-ink-soft">× {i.qty}</td>
                    <td className="px-4 py-3 text-right">{formatCOP(i.line_total)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 text-ink-soft" colSpan={2}>
                    Envío
                  </td>
                  <td className="px-4 py-3 text-right">{o.shipping ? formatCOP(o.shipping) : "Gratis"}</td>
                </tr>
                <tr className="font-bold">
                  <td className="px-4 py-3" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-3 text-right">{formatCOP(o.total)}</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="Origen del pedido">
            <dl className="grid gap-4 px-4 py-4 text-sm sm:grid-cols-2">
              <Info label="Fuente" value={o.utm_source} />
              <Info label="Campaña" value={o.utm_campaign} />
              <Info label="Anuncio / contenido" value={o.utm_content} />
              <Info label="Clic de TikTok (ttclid)" value={o.ttclid ? "Sí" : null} />
              <Info label="Página de entrada" value={o.landing_page} />
              <Info label="Pago" value={o.payment_reference ? `Wompi · ref ${o.payment_reference}` : "Contraentrega"} />
            </dl>
          </Panel>
        </div>

        <Panel title="Gestión">
          <OrderEditForm
            order={{
              id: o.id,
              status: o.status,
              payment_status: o.payment_status,
              carrier: o.carrier ?? "",
              tracking_number: o.tracking_number ?? "",
              admin_notes: o.admin_notes ?? "",
            }}
          />
        </Panel>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold text-ink-soft">{label}</dt>
      <dd className="mt-0.5 break-words">{value || <span className="text-ink-soft/60">—</span>}</dd>
    </div>
  );
}
