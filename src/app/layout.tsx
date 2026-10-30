import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, Yellowtail } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
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
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#101e40",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${archivo.variable} ${instrument.variable} ${yellowtail.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
