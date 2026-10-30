import { SITE_URL, socialLinks } from "@/lib/site";
import type { Product, ReviewRow, SettingsRow } from "@/lib/types";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function OrganizationJsonLd({ settings }: { settings: SettingsRow }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: settings.store_name,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-lema-azul.png`,
        email: settings.support_email ?? undefined,
        telephone: settings.whatsapp_number ? `+${settings.whatsapp_number}` : undefined,
        sameAs: socialLinks(settings).map((s) => s.url),
      }}
    />
  );
}

/** Datos estructurados de producto para Google (precio, disponibilidad, envío). */
export function ProductJsonLd({ product, settings, reviews }: { product: Product; settings: SettingsRow; reviews: ReviewRow[] }) {
  const inStock = product.stock === null || product.stock > 0;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} · ${settings.store_name}`,
    description: product.seo_description ?? product.short_description ?? undefined,
    image: product.images.length ? product.images.map((i) => i.url) : [`${SITE_URL}/og.png`],
    sku: product.slug,
    brand: { "@type": "Brand", name: settings.store_name },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/gafas/${product.slug}`,
      priceCurrency: "COP",
      price: product.price,
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
  if (reviews.length) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((n, r) => n + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
    };
  }
  return <JsonLd data={data} />;
}
