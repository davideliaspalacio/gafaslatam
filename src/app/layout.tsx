import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Yellowtail } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Archivo solo se usa expandida (ancho 125) en títulos y etiquetas, con pesos 700 y 800. Este archivo es el
// que entrega Google Fonts para css2?family=Archivo:wdth,wght@125,700;125,800 (subset latin): el ancho ya
// viene fijo en 125 y conserva el eje de peso. Pesa 35 KB en vez de los 90 KB de la variable completa y se
// ve igual (comparado píxel a píxel). Licencia SIL Open Font License.
const archivo = localFont({
  src: [{ path: "./fonts/archivo-expandida-latin.woff2", weight: "100 900", style: "normal" }],
  declarations: [{ prop: "font-stretch", value: "125%" }],
  display: "swap",
  variable: "--font-archivo",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-yellowtail",
  // Solo la usan unas pocas notas a mano (portada, nosotros, gracias): se baja cuando hace falta, sin precargarla.
  preload: false,
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Verificación del dominio en Meta (Business → Seguridad de la marca → Dominios): el contenido de la etiqueta
// facebook-domain-verification va en la variable NEXT_PUBLIC_META_DOMAIN_VERIFICATION de Vercel.
const metaDomain = process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(site),
  formatDetection: { telephone: false },
  ...(metaDomain ? { other: { "facebook-domain-verification": metaDomain } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#101e40",
  width: "device-width",
  initialScale: 1,
  // En Android el teclado achica la pantalla (y los dvh): el botón "Pedir" del pie de la hoja queda encima del teclado.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${archivo.variable} ${instrument.variable} ${yellowtail.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
