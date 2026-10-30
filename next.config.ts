import type { NextConfig } from "next";

const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:56321");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: supabaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: supabaseUrl.hostname,
        port: supabaseUrl.port,
        pathname: "/storage/v1/object/public/**",
      },
      // Fotos de los productos en Shopify
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
    ],
    // Supabase local corre en 127.0.0.1; en producción el host es público.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  async redirects() {
    return [
      // Dominio principal: www.gafaslatam.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "gafaslatam.vercel.app" }],
        destination: "https://www.gafaslatam.com/:path*",
        permanent: true,
      },
      // Rutas del diseño anterior
      { source: "/producto/:slug*", destination: "/tienda", permanent: true },
      { source: "/gafas/modelo-1", destination: "/tienda", permanent: true },
      { source: "/politicas/envios", destination: "/envios-y-garantia", permanent: true },
      { source: "/politicas/cambios-y-garantia", destination: "/envios-y-garantia", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
