import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const metadata: Metadata = {
  title: "PLAYNI — Juega y gana",
  description: "Juega, completa desafíos y gana monedas con PLAYNI."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
      <Script src="https://accounts.google.com/gsi/client?hl=es-419" strategy="beforeInteractive" />
    </html>
  );
}