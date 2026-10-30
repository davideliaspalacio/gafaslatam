import Link from "next/link";
import { Photo } from "@/components/store/photo";
import { formatCOP } from "@/lib/format";
import { TAGS, type Tag } from "@/lib/site";
import type { Product } from "@/lib/types";

export type CardProduct = Pick<Product, "id" | "slug" | "name" | "price" | "images" | "tags" | "badge">;

export function ProductCard({ product, preload, level = 3 }: { product: CardProduct; preload?: boolean; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  const cover = product.images[0];
  return (
    <Link href={`/gafas/${product.slug}`} className="group block">
      <div className="relative">
        <Photo
          src={cover?.url}
          alt={cover?.alt ?? `Gafas ${product.name}`}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          preload={preload}
          className="transition-[filter] duration-300 group-hover:brightness-[0.97]"
        />
        {product.badge ? (
          <span className="type-label absolute top-3 left-3 rounded-full bg-night px-3 py-1.5 text-[0.68rem] text-cream">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <Heading className="text-[1.0625rem] font-semibold group-hover:underline">{product.name}</Heading>
        <p className="tabular shrink-0 font-semibold">{formatCOP(product.price)}</p>
      </div>
      {product.tags.length ? (
        <p className="mt-0.5 text-sm text-ink-soft">
          {product.tags
            .filter((t): t is Tag => t in TAGS)
            .map((t) => TAGS[t].toLowerCase())
            .join(" · ")
            .replace(/^./, (c) => c.toUpperCase())}
        </p>
      ) : null}
    </Link>
  );
}

/** Con un solo modelo: tarjeta horizontal en vez de una grilla con huecos. */
export function ProductFeature({
  product,
  headline,
  level = 3,
  preload,
}: {
  product: CardProduct;
  headline?: string | null;
  level?: 2 | 3;
  preload?: boolean;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  const cover = product.images[0];
  const tags = product.tags.filter((t): t is Tag => t in TAGS);
  return (
    <Link href={`/gafas/${product.slug}`} className="group grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-12">
      <Photo
        src={cover?.url}
        alt={cover?.alt ?? `Gafas ${product.name}`}
        ratio="landscape"
        sizes="(min-width: 768px) 55vw, 90vw"
        preload={preload}
      />
      <div>
        <Heading className="type-display text-[1.75rem] group-hover:underline sm:text-4xl">{product.name}</Heading>
        {headline ? <p className="mt-2 text-[1.0625rem] font-semibold">{headline}</p> : null}
        {tags.length ? <p className="mt-1 text-ink-soft">{tags.map((t) => TAGS[t]).join(" · ")}</p> : null}
        <p className="type-display tabular mt-5 text-[1.75rem]">{formatCOP(product.price)}</p>
        <span className="mt-5 inline-flex min-h-[52px] items-center rounded-full border border-night/25 px-7 font-semibold transition-colors group-hover:border-night">
          Ver el modelo
        </span>
      </div>
    </Link>
  );
}
