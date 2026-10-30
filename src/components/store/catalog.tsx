"use client";

import { useState } from "react";
import { ProductCard, ProductFeature, type CardProduct } from "@/components/store/product-card";
import { TAGS, type Tag } from "@/lib/site";

const FILTERS: { id: Tag | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "camara", label: TAGS.camara },
  { id: "audio", label: TAGS.audio },
  { id: "sol", label: TAGS.sol },
];

export function Catalog({ products }: { products: (CardProduct & { headline?: string | null })[] }) {
  const [filter, setFilter] = useState<Tag | "todas">("todas");
  const shown = filter === "todas" ? products : products.filter((p) => p.tags.includes(filter));

  if (products.length === 1) {
    return <ProductFeature product={products[0]} headline={products[0].headline} level={2} preload />;
  }

  // Los filtros solo ayudan cuando hay suficientes modelos para separar.
  const showFilters = products.length >= 3;

  return (
    <>
      {showFilters ? (
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filtrar modelos">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-[0.95rem] font-semibold transition-colors ${
                  active ? "border-night bg-night text-cream" : "border-night/20 text-night hover:border-night/50"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {shown.length ? (
        <ul className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} preload={i < 2} level={2} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 max-w-md text-ink-soft">
          Todavía no tenemos modelos {FILTERS.find((f) => f.id === filter)?.label.toLowerCase()}. Escríbenos por
          WhatsApp y te contamos qué viene.
        </p>
      )}
    </>
  );
}
