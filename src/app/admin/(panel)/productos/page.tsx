import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatCOP } from "@/lib/format";

export const metadata = { title: "Producto" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Producto" />
      <Suspense fallback={<Loading />}>
        <Products />
      </Suspense>
    </>
  );
}

async function Products() {
  const { supabase } = await requireAdmin();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, active, stock")
    .order("featured", { ascending: false })
    .order("sort");

  // Tienda de un solo producto: entrar directo a editarlo.
  if (products?.length === 1) redirect(`/admin/productos/${products[0].id}`);

  return (
    <Panel>
      <ul className="divide-y divide-ink/10">
        {(products ?? []).map((p) => (
          <li key={p.id}>
            <Link href={`/admin/productos/${p.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-ink/[0.03]">
              <span>
                <span className="block font-semibold">{p.name}</span>
                <span className="block text-xs text-ink-soft">/{p.slug}</span>
              </span>
              <span className="tabular text-sm">
                {formatCOP(p.price)} {p.active ? "" : "· oculto"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
