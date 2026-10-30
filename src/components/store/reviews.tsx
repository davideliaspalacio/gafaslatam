import { Star } from "lucide-react";
import type { ReviewRow } from "@/lib/types";

/** Historias reales: solo aparece cuando el equipo publica reseñas de clientes. */
export function Reviews({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <section className="on-dark bg-night text-cream" aria-labelledby="historias">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 id="historias" className="type-display max-w-2xl text-[1.75rem] sm:text-5xl">
          Lo que cuentan los que ya las <span className="underline-amber">tienen</span>
        </h2>
        <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-mid pt-6">
              <p role="img" aria-label={`${r.rating} de 5 estrellas`} className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`size-4 ${n <= r.rating ? "fill-amber text-amber" : "text-mid"}`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ))}
              </p>
              <blockquote className="mt-4 text-[1.0625rem] leading-relaxed">“{r.body}”</blockquote>
              <p className="mt-4 text-sm font-semibold text-mist">
                {r.author}
                {r.city ? ` · ${r.city}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
