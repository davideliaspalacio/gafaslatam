import { SITE_URL, socialLinks } from "@/lib/site";
import type { ModeloTienda } from "@/lib/catalog";
import type { SettingsRow } from "@/lib/types";

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
export function ProductJsonLd({ modelo, settings }: { modelo: ModeloTienda; settings: SettingsRow }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: modelo.nombre,
        description: modelo.seo.descripcion,
        image: modelo.imagenes.length ? modelo.imagenes.map((i) => i.url) : [`${SITE_URL}/og.png`],
        sku: modelo.sku,
        brand: { "@type": "Brand", name: settings.store_name },
        offers: {
          "@type": "Offer",
          url: `${SITE_URL}/gafas/${modelo.slug}`,
          priceCurrency: "COP",
          price: modelo.precio,
          availability: modelo.disponible ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
      }}
    />
  );
}
