import { ArrowRight, Glasses } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Loading, PageHeader, Panel, PaymentBadge, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatCOP, formatDateTime } from "@/lib/format";

export const metadata = { title: "Resumen" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Resumen" />
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [{ data: summary }, { data: campaigns }, { data: latest }] = await Promise.all([
    supabase.rpc("admin_summary", { p_days: 7 }).single(),
    supabase.rpc("admin_campaign_stats", { p_days: 7 }),
    supabase
      .from("orders")
      .select("id, number, created_at, customer_name, city, total, status, payment_method, payment_status")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const s = summary ?? {
    orders_today: 0,
    revenue_today: 0,
    orders_period: 0,
    revenue_period: 0,
    visits_period: 0,
    pending_confirmation: 0,
    delivered_period: 0,
    returned_period: 0,
  };

  return (
    <div className="space-y-8">
      {s.pending_confirmation > 0 ? (
        <Link
          href="/admin/pedidos?estado=nuevo"
          className="flex items-center justify-between gap-4 bg-amber px-4 py-3 font-semibold text-ink hover:bg-amber-deep"
        >
          <span>
            {s.pending_confirmation} {s.pending_confirmation === 1 ? "pedido espera" : "pedidos esperan"} confirmación por
            WhatsApp
          </span>
          <ArrowRight className="size-5 shrink-0" aria-hidden />
        </Link>
      ) : null}

      <Panel>
        <dl className="grid grid-cols-2 divide-ink/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          <Stat label="Pedidos hoy" value={String(s.orders_today)} />
          <Stat label="Ventas hoy" value={formatCOP(Number(s.revenue_today))} />
          <Stat label="Pedidos · 7 días" value={String(s.orders_period)} />
          <Stat label="Ventas · 7 días" value={formatCOP(Number(s.revenue_period))} />
          <Stat label="Visitas · 7 días" value={String(s.visits_period)} />
          <Stat label="Conversión · 7 días" value={pct(Number(s.orders_period), Number(s.visits_period))} />
        </dl>
      </Panel>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Panel title="Últimos pedidos">
          {latest?.length ? (
            <ul className="divide-y divide-ink/10">
              {latest.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/pedidos/${o.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-ink/[0.03]">
                    <span className="type-display tabular w-16 text-lg text-night">#{o.number}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{o.customer_name}</span>
                      <span className="block text-xs text-ink-soft">
                        {o.city} · {formatDateTime(o.created_at)}
                      </span>
                    </span>
                    <span className="hidden text-right sm:block">
                      <span className="tabular block text-sm font-semibold">{formatCOP(o.total)}</span>
                      <PaymentBadge method={o.payment_method} status={o.payment_status} />
                    </span>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyOrders />
          )}
        </Panel>

        <Panel title="Campañas · últimos 7 días">
          {campaigns?.length ? (
            <div className="overflow-x-auto">
              <table className="tabular w-full text-sm">
                <thead className="text-left text-xs text-ink-soft">
                  <tr className="border-b border-ink/10">
                    <th className="px-4 py-2 font-semibold">Fuente / campaña</th>
                    <th className="px-2 py-2 text-right font-semibold">Visitas</th>
                    <th className="px-2 py-2 text-right font-semibold">Pedidos</th>
                    <th className="px-4 py-2 text-right font-semibold">Conv.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {campaigns.map((c) => (
                    <tr key={`${c.source}-${c.campaign}`}>
                      <td className="px-4 py-2.5">
                        <span className="block font-medium">{c.source}</span>
                        <span className="block max-w-56 truncate text-xs text-ink-soft">{c.campaign}</span>
                      </td>
                      <td className="px-2 py-2.5 text-right">{c.visits}</td>
                      <td className="px-2 py-2.5 text-right">{c.orders}</td>
                      <td className="px-4 py-2.5 text-right">{pct(Number(c.orders), Number(c.visits))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-6 text-sm leading-relaxed text-ink-soft">
              Aún no hay visitas. Usa enlaces con <code className="text-ink">?utm_source=tiktok&amp;utm_campaign=nombre</code>{" "}
              en tus anuncios para ver aquí qué campaña vende más.
            </p>
          )}
        </Panel>
      </div>

      <p className="text-xs text-ink-soft">
        Entregados en 7 días: {s.delivered_period} · Devueltos: {s.returned_period}
        {Number(s.delivered_period) + Number(s.returned_period) > 0
          ? ` · Tasa de devolución ${pct(Number(s.returned_period), Number(s.delivered_period) + Number(s.returned_period))}`
          : ""}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ink/10 px-4 py-4 lg:border-b-0">
      <dt className="text-xs font-semibold text-ink-soft">{label}</dt>
      <dd className="tabular mt-1 text-xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Glasses className="size-8 text-ink-soft" strokeWidth={1.25} aria-hidden />
      <p className="font-semibold">Todavía no hay pedidos</p>
      <p className="max-w-xs text-sm text-ink-soft">Cuando alguien haga un pedido en la tienda, aparece aquí.</p>
    </div>
  );
}
