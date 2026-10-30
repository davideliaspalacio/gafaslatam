import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { ProductForm } from "@/components/admin/product-form";
import { Loading, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { toProduct } from "@/lib/types";

export const metadata = { title: "Editar producto" };

export default function EditProductPage({ params }: PageProps<"/admin/productos/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: { params: PageProps<"/admin/productos/[id]">["params"] }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const product = toProduct(data);
  return (
    <>
      <PageHeader title={product.name}>
        <a href={`/gafas/${product.slug}`} target="_blank" className="text-sm font-semibold text-night hover:underline">
          Ver en la tienda
        </a>
      </PageHeader>
      <ProductForm product={product} />
    </>
  );
}
