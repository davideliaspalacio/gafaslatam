import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";
import { DateStamp } from "@/components/store/date-stamp";
import { WhatsAppIcon } from "@/components/store/icons";
import { PurchasePixel } from "@/components/store/purchase-pixel";
import { getSettings } from "@/lib/catalog";
import { formatCOP, formatPhone, whatsappLink } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";
import type { OrderItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

export default function OrderPage({ params }: PageProps<"/pedido/[id]">) {
  return (
    <main className="mx-auto max-w-xl px-4 pt-6 pb-20">
      <Suspense fallback={<p className="py-24 text-center text-carton-soft">Revelando tu pedido…</p>}>
        <OrderPrint params={params} />
      </Suspense>
    </main>
  );
}

async function OrderPrint({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "demo" && !hasSupabase()) {
    await connection(); // la fecha de la copia es la de hoy
    return <DemoConfirmation />;
  }
  if (!z.uuid().safeParse(id).success) notFound();

  const [{ data: order }, settings] = await Promise.all([
    serviceClient()
      .from("orders")
      .select("id, number, created_at, customer_name, phone, department, city, address, address_details, items, total, shipping, payment_method, payment_status, event_id")
      .eq("id", id)
      .maybeSingle(),
    getSettings(),
  ]);
  if (!order) notFound();

  const items = (order.items as OrderItem[]) ?? [];
  const firstName = order.customer_name.split(" ")[0];
  const online = order.payment_method === "online";
  const paid = order.payment_status === "pagado";
  const failed = order.payment_status === "fallido";
  const wa = whatsappLink(
    settings.whatsapp_number,
    `Hola, soy ${order.customer_name}. Acabo de hacer el pedido #${order.number} y quiero confirmarlo.`,
  );

  const heading = failed ? "El pago no se completó" : online && !paid ? "Estamos esperando el pago" : `¡Listo, ${firstName}!`;
  const lead = failed
    ? "Tu pedido quedó guardado pero Wompi no aprobó el pago. Escríbenos por WhatsApp y lo cambiamos a pago contraentrega."
    : online && !paid
      ? "Wompi todavía está procesando tu pago. Apenas se apruebe te escribimos por WhatsApp."
      : online
        ? `Recibimos tu pago. Te escribimos por WhatsApp al ${formatPhone(order.phone)} con el número de guía.`
        : `Te vamos a escribir por WhatsApp al ${formatPhone(order.phone)} para confirmar la dirección. Pagas cuando te llegue.`;

  return (
    <>
      {!failed && (!online || paid) ? (
        <PurchasePixel
          orderId={order.id}
          eventId={order.event_id ?? order.id}
          value={order.total}
          contents={items.map((i) => ({
            content_id: i.product_id,
            content_name: i.name,
            quantity: i.qty,
            price: i.unit_price,
          }))}
        />
      ) : null}

      <h1 className="type-carton text-[2.4rem] text-paper sm:text-5xl">{heading}</h1>
      <p className="mt-4 leading-relaxed text-carton-soft">{lead}</p>

      {/* La copia del pedido, fechada hoy */}
      <article className="print on-paper mt-9 -rotate-1 text-ink">
        <div className="relative bg-carton-night px-5 pt-6 pb-10 text-paper">
          <p className="type-carton tabular text-5xl">
            <span className="text-carton-soft">Pedido</span> #{order.number}
          </p>
          <DateStamp value={stampOf(order.created_at)} className="absolute right-5 bottom-4 h-5" />
        </div>
        <div className="space-y-5 px-4 pt-5 pb-4">
          <dl className="tabular space-y-2 text-[0.95rem]">
            {items.map((i) => (
              <div key={i.product_id + (i.variant ?? "")} className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  {i.name}
                  {i.variant ? ` · ${i.variant}` : ""} × {i.qty}
                </dt>
                <dd>{formatCOP(i.line_total)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Envío</dt>
              <dd>{order.shipping ? formatCOP(order.shipping) : "Gratis"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-rule pt-3 font-bold">
              <dt>{online ? (paid ? "Pagado" : "Total") : "Pagas al recibir"}</dt>
              <dd>{formatCOP(order.total)}</dd>
            </div>
          </dl>
          <div className="border-t border-rule pt-4 text-[0.95rem] leading-relaxed">
            <p className="type-spec mb-1 text-[0.7rem] text-ink-soft">Entrega</p>
            <p>{order.customer_name}</p>
            <p className="text-ink-soft">
              {order.address}
              {order.address_details ? `, ${order.address_details}` : ""}
              <br />
              {order.city}, {order.department}
            </p>
          </div>
        </div>
      </article>

      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          className="type-spec mt-10 flex min-h-14 items-center justify-center gap-3 rounded-[3px] bg-flash px-6 text-[1.02rem] text-ink shadow-[var(--shadow-lift)] hover:bg-flash-deep"
        >
          <WhatsAppIcon className="size-5" />
          {failed ? "Escribir por WhatsApp" : "Confirmar ya por WhatsApp"}
        </a>
      ) : null}

      <ol className="mt-10 space-y-4 text-carton-soft">
        <li className="border-t border-carton-soft/25 pt-4">
          <span className="font-semibold text-paper">Confirmamos.</span> Revisamos tu dirección y color contigo.
        </li>
        <li className="border-t border-carton-soft/25 pt-4">
          <span className="font-semibold text-paper">Despachamos.</span> Te enviamos el número de guía para seguir el
          paquete.
        </li>
        <li className="border-t border-carton-soft/25 pt-4">
          <span className="font-semibold text-paper">Te llega.</span> En {settings.delivery_estimate.toLowerCase()}
          {online ? "." : ", y le pagas a la transportadora."}
        </li>
      </ol>
    </>
  );
}

/** Modo demo: la tienda aún no tiene base de datos, así que el pedido no se guardó. */
function DemoConfirmation() {
  return (
    <>
      <h1 className="type-carton text-[2.4rem] text-paper sm:text-5xl">Pedido de prueba</h1>
      <p className="mt-4 leading-relaxed text-carton-soft">
        La tienda está en modo demostración: todavía no está conectada a la base de datos, así que este pedido no se
        guardó. Al conectar Supabase, los pedidos llegan al panel.
      </p>
      <article className="print on-paper mt-9 -rotate-1 text-ink">
        <div className="relative bg-carton-night px-5 pt-6 pb-10 text-paper">
          <p className="type-carton tabular text-5xl">
            <span className="text-carton-soft">Pedido</span> #DEMO
          </p>
          <DateStamp value={stampOf(new Date().toISOString())} className="absolute right-5 bottom-4 h-5" />
        </div>
        <p className="px-4 py-5 text-[0.95rem] leading-relaxed text-ink-soft">
          Así verá el cliente su confirmación: número de pedido, productos, total, dirección de entrega y el botón para
          confirmar por WhatsApp.
        </p>
      </article>
    </>
  );
}

function stampOf(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `'${get("year")} ${get("month")} ${get("day")}`;
}
