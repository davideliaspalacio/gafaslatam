import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { createProduct } from "@/app/admin/actions";
import { Button, Loading, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatCOP } from "@/lib/format";

export const metadata = { title: "Modelos" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Modelos">
        <form action={createProduct}>
          <Button type="submit">
            <Plus className="size-4" aria-hidden /> Nuevo modelo
          </Button>
        </form>
      </PageHeader>
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
    .select("id, name, slug, price, active, stock, images")
    .order("featured", { ascending: false })
    .order("sort");

  return (
    <Panel>
      <ul className="divide-y divide-ink/10">
        {(products ?? []).map((p) => {
          const cover = Array.isArray(p.images) ? (p.images[0] as { url?: string } | undefined)?.url : undefined;
          return (
            <li key={p.id}>
              <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-ink/[0.03]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt="" className="size-12 shrink-0 rounded-[6px] object-cover" />
                ) : (
                  <span className="size-12 shrink-0 rounded-[6px] bg-cream-2" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="block truncate text-xs text-ink-soft">/gafas/{p.slug}</span>
                </span>
                <span className="tabular text-right text-sm">
                  <span className="block font-semibold">{formatCOP(p.price)}</span>
                  <span className={`block text-xs ${p.active ? "text-ink-soft" : "text-alert"}`}>{p.active ? "Visible" : "Oculto"}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
