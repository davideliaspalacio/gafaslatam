import { Download, Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { WhatsAppIcon } from "@/components/store/icons";
import { Loading, PageHeader, Panel, PaymentBadge } from "@/components/admin/ui";
import { StatusSelect } from "@/components/admin/status-select";
import { requireAdmin } from "@/lib/admin-auth";
import { formatCOP, formatDateTime, formatPhone } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderItem, type OrderStatus } from "@/lib/types";

export const metadata = { title: "Pedidos" };

const STATUSES = Object.keys(ORDER_STATUS_LABEL) as OrderStatus[];

export default function OrdersPage({ searchParams }: PageProps<"/admin/pedidos">) {
  return (
    <Suspense
      fallback={
        <>
          <PageHeader title="Pedidos" />
          <Loading />
        </>
      }
    >
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/admin/pedidos">["searchParams"] }) {
  const sp = await searchParams;
  const estado = typeof sp.estado === "string" && STATUSES.includes(sp.estado as OrderStatus) ? (sp.estado as OrderStatus) : null;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";

  const { supabase } = await requireAdmin();

  let query = supabase
    .from("orders")
    .select("id, number, created_at, customer_name, phone, city, department, total, items, status, payment_method, payment_status, utm_source")
    .order("created_at", { ascending: false })
    .limit(200);
  if (estado) query = query.eq("status", estado);
  if (q) {
    const digits = q.replace(/\D/g, "");
    const safe = q.replace(/[%,()]/g, " ");
    const filters = [`customer_name.ilike.%${safe}%`, `city.ilike.%${safe}%`];
    if (digits.length >= 3) filters.push(`phone.ilike.%${digits}%`);
    if (/^\d{1,9}$/.test(digits) && digits === q.replace(/^#/, "")) filters.push(`number.eq.${digits}`);
    query = query.or(filters.join(","));
  }

  const [{ data: orders }, ...counts] = await Promise.all([
    query,
    ...STATUSES.map((s) => supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", s)),
  ]);
  const countBy = Object.fromEntries(STATUSES.map((s, i) => [s, counts[i].count ?? 0])) as Record<OrderStatus, number>;
  const exportHref = `/admin/pedidos/exportar${estado ? `?estado=${estado}` : ""}`;

  return (
    <>
      <PageHeader title="Pedidos">
        <a
          href={exportHref}
          className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-ink/20 bg-paper px-4 text-sm font-semibold hover:border-ink/40"
        >
          <Download className="size-4" aria-hidden /> Exportar CSV
        </a>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Filtrar por estado">
          <FilterLink href="/admin/pedidos" active={!estado} label="Todos" />
          {STATUSES.map((s) => (
            <FilterLink
              key={s}
              href={`/admin/pedidos?estado=${s}`}
              active={estado === s}
              label={`${ORDER_STATUS_LABEL[s]} ${countBy[s] ? `(${countBy[s]})` : ""}`}
            />
          ))}
        </nav>
        <form className="relative lg:w-72" role="search">
          {estado ? <input type="hidden" name="estado" value={estado} /> : null}
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            name="q"
            defaultValue={q}
            placeholder="Nombre, celular, ciudad o #"
            aria-label="Buscar pedidos"
            className="w-full rounded-[3px] border border-ink/20 bg-paper py-2 pr-3 pl-9 text-sm focus:border-carton focus:outline-none focus:ring-2 focus:ring-carton/20"
          />
        </form>
      </div>

      <Panel>
        {orders?.length ? (
          <div className="overflow-x-auto">
            <table className="tabular w-full min-w-[760px] text-sm">
              <thead className="text-left text-xs text-ink-soft">
                <tr className="border-b border-ink/10">
                  <th className="px-4 py-2.5 font-semibold">Pedido</th>
                  <th className="px-3 py-2.5 font-semibold">Cliente</th>
                  <th className="px-3 py-2.5 font-semibold">Producto</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-3 py-2.5 font-semibold">Estado</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {orders.map((o) => {
                  const items = (o.items as OrderItem[]) ?? [];
                  return (
                    <tr key={o.id} className="align-top hover:bg-ink/[0.02]">
                      <td className="px-4 py-3">
                        <Link href={`/admin/pedidos/${o.id}`} className="type-carton text-lg text-carton hover:underline">
                          #{o.number}
                        </Link>
                        <span className="block text-xs text-ink-soft">{formatDateTime(o.created_at)}</span>
                        {o.utm_source ? <span className="block text-xs text-ink-soft">vía {o.utm_source}</span> : null}
                      </td>
                      <td className="px-3 py-3">
                        <span className="block font-medium">{o.customer_name}</span>
                        <span className="block text-xs text-ink-soft">
                          {formatPhone(o.phone)} · {o.city}, {o.department}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-ink-soft">
                        {items.map((i) => (
                          <span key={i.product_id + i.variant} className="block">
                            {i.qty} × {i.variant ?? i.name}
                          </span>
                        ))}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="block font-semibold">{formatCOP(o.total)}</span>
                        <PaymentBadge method={o.payment_method} status={o.payment_status} />
                      </td>
                      <td className="px-3 py-3">
                        <StatusSelect id={o.id} status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`https://wa.me/57${o.phone}?text=${encodeURIComponent(
                            `Hola ${o.customer_name.split(" ")[0]}, te escribimos para confirmar tu pedido #${o.number} por ${formatCOP(o.total)}.`,
                          )}`}
                          target="_blank"
                          rel="noopener"
                          className="inline-grid size-9 place-items-center rounded-full text-carton hover:bg-carton/10"
                          aria-label={`WhatsApp a ${o.customer_name}`}
                        >
                          <WhatsAppIcon className="size-5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-4 py-12 text-center text-sm text-ink-soft">
            {q || estado ? "Ningún pedido coincide con el filtro." : "Todavía no hay pedidos."}
          </p>
        )}
      </Panel>
      {(orders?.length ?? 0) >= 200 ? (
        <p className="mt-3 text-xs text-ink-soft">Mostrando los 200 más recientes. Exporta el CSV para ver todos.</p>
      ) : null}
    </>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-[3px] px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
        active ? "bg-carton text-paper" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

