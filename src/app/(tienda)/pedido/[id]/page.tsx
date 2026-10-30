import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { WhatsAppIcon } from "@/components/store/icons";
import { PurchasePixel } from "@/components/store/purchase-pixel";
import { WhatsAppLink } from "@/components/store/whatsapp-link";
import { getSettings } from "@/lib/catalog";
import { formatCOP, formatPhone } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";
import type { OrderItem, SettingsRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pedido recibido",
  robots: { index: false, follow: false },
};

export default function ThanksPage({ params }: PageProps<"/pedido/[id]">) {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-10 pb-24 md:pt-14">
      <Suspense fallback={<p className="py-24 text-center text-ink-soft">Cargando tu pedido…</p>}>
        <Thanks params={params} />
      </Suspense>
    </main>
  );
}

async function Thanks({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const settings = await getSettings();
  if (id === "demo" && !hasSupabase()) return <DemoThanks settings={settings} />;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data: order } = await serviceClient()
    .from("orders")
    .select("id, number, customer_name, phone, department, city, address, address_details, items, total, shipping, payment_method, payment_status, event_id")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const items = (order.items as OrderItem[]) ?? [];
  const firstName = order.customer_name.split(" ")[0];
  const online = order.payment_method === "online";
  const paid = order.payment_status === "pagado";
  const failed = order.payment_status === "fallido";
  const wa = settings.whatsapp_number;

  const heading = failed ? "El pago no pasó" : online && !paid ? "Estamos esperando el pago" : `¡Listo, ${firstName}!`;
  const lead = failed
    ? "Tu pedido quedó guardado pero Wompi no aprobó el pago. Escríbenos y lo pasamos a pago contraentrega."
    : online && !paid
      ? "Wompi todavía está procesando tu pago. Apenas se apruebe te escribimos."
      : online
        ? `Recibimos tu pago. Te escribimos al ${formatPhone(order.phone)} con el número de guía.`
        : `Te vamos a escribir al WhatsApp ${formatPhone(order.phone)} para confirmar la dirección. Pagas cuando te lleguen.`;

  return (
    <>
      {!failed && (!online || paid) ? (
        <PurchasePixel
          orderId={order.id}
          eventId={order.event_id ?? order.id}
          value={order.total}
          contents={items.map((i) => ({ content_id: i.product_id, content_name: i.name, quantity: i.qty, price: i.unit_price }))}
        />
      ) : null}

      <h1 className="type-display text-[2.5rem] sm:text-5xl">{heading}</h1>
      <p className="mt-4 text-[1.0625rem] text-ink-soft">{lead}</p>

      {wa ? (
        <WhatsAppLink
          number={wa}
          text={`Hola, soy ${order.customer_name}. Acabo de hacer el pedido #${order.number} y quiero confirmarlo.`}
          className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[1.0625rem] font-semibold text-[#062b16] transition-[filter] hover:brightness-95 sm:w-auto"
        >
          <WhatsAppIcon className="size-5" />
          {failed ? "Escribir por WhatsApp" : "Confirmar ya por WhatsApp"}
        </WhatsAppLink>
      ) : null}

      <section className="mt-10 rounded-[14px] border border-line bg-paper">
        <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="font-semibold">Pedido #{order.number}</h2>
          <p className="text-sm text-ink-soft">{online ? (paid ? "Pagado" : "Pago en línea") : "Pagas al recibir"}</p>
        </div>
        <dl className="tabular space-y-2 px-5 py-4 text-[0.95rem]">
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
          <div className="flex justify-between gap-4 border-t border-line pt-3 font-semibold">
            <dt>Total</dt>
            <dd>{formatCOP(order.total)}</dd>
          </div>
        </dl>
        <div className="border-t border-line px-5 py-4 text-[0.95rem]">
          <p className="font-semibold">Entrega</p>
          <p className="mt-1 text-ink-soft">
            {order.customer_name}
            <br />
            {order.address}
            {order.address_details ? `, ${order.address_details}` : ""}
            <br />
            {order.city}, {order.department}
          </p>
        </div>
      </section>

      <NextSteps settings={settings} online={online} />
    </>
  );
}

function NextSteps({ settings, online }: { settings: SettingsRow; online: boolean }) {
  const steps = [
    "Te escribimos para confirmar la dirección y el color.",
    "Despachamos y te mandamos el número de guía.",
    `Te llegan en ${settings.delivery_estimate.toLowerCase()}${online ? "." : " y ahí le pagas a la transportadora."}`,
  ];
  return (
    <section className="mt-10">
      <h2 className="text-[1.15rem] font-semibold">Lo que sigue</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-ink-soft">
            <span className="type-display tabular w-5 shrink-0 text-night">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <p className="type-hand mt-8 -rotate-1 text-[1.6rem] text-night/80">¡gracias por confiar en nosotros!</p>
      <Link href="/tienda" className="mt-6 inline-block font-semibold underline">
        Volver a la tienda
      </Link>
    </section>
  );
}

/** Modo demo: la tienda aún no tiene base de datos, así que el pedido no se guardó. */
function DemoThanks({ settings }: { settings: SettingsRow }) {
  return (
    <>
      <h1 className="type-display text-[2.5rem] sm:text-5xl">Pedido de prueba</h1>
      <p className="mt-4 text-ink-soft">
        La tienda está en modo demostración: todavía no está conectada a la base de datos, así que este pedido no se
        guardó. Al conectar Supabase, los pedidos llegan al panel.
      </p>
      <NextSteps settings={settings} online={false} />
    </>
  );
}
