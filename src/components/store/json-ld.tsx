import type { Product, ReviewRow, SettingsRow } from "@/lib/types";
import { bundlesOf } from "@/lib/types";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Datos estructurados de producto para Google (precio, disponibilidad, envío). */
export function ProductJsonLd({
  product,
  settings,
  reviews,
}: {
  product: Product;
  settings: SettingsRow;
  reviews: ReviewRow[];
}) {
  const price = bundlesOf(product)[0].price;
  const inStock = product.stock === null || product.stock > 0;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.seo_description ?? product.short_description ?? undefined,
    image: product.images.map((i) => i.url),
    sku: product.slug,
    brand: { "@type": "Brand", name: settings.store_name },
    offers: {
      "@type": "Offer",
      url: `${site}/producto/${product.slug}`,
      priceCurrency: "COP",
      price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: settings.free_shipping ? 0 : settings.shipping_cost, currency: "COP" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "CO" },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CO",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 5,
      },
    },
  };

  // Solo con reseñas reales publicadas.
  if (reviews.length) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
