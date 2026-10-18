import { Suspense } from "react";
import { ReviewForm, ReviewRowActions } from "@/components/admin/review-form";
import { Loading, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Reseñas" };

export default function ReviewsPage() {
  return (
    <>
      <PageHeader title="Reseñas" />
      <Suspense fallback={<Loading />}>
        <Reviews />
      </Suspense>
    </>
  );
}

async function Reviews() {
  const { supabase } = await requireAdmin();
  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("id, name").order("sort"),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Panel title="Agregar reseña">
        <p className="px-4 pt-4 text-sm leading-relaxed text-ink-soft">
          Solo reseñas reales de clientes (por ejemplo, mensajes de WhatsApp o comentarios de TikTok, con su permiso). En la
          tienda aparecen apenas publiques la primera.
        </p>
        <ReviewForm products={products ?? []} />
      </Panel>
      <Panel title={`Reseñas (${reviews?.length ?? 0})`}>
        {reviews?.length ? (
          <ul className="divide-y divide-ink/10">
            {reviews.map((r) => (
              <li key={r.id} className="flex gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="text-flash-deep">{"★".repeat(r.rating)}</span>
                    <span className="text-ink/20">{"★".repeat(5 - r.rating)}</span>{" "}
                    <span className="font-semibold">{r.author}</span>
                    {r.city ? <span className="text-ink-soft"> · {r.city}</span> : null}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  <p className="mt-1 text-xs text-ink-soft/80">{formatDateTime(r.created_at)}</p>
                </div>
                <ReviewRowActions id={r.id} published={r.published} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-ink-soft">Aún no hay reseñas.</p>
        )}
      </Panel>
    </div>
  );
}
