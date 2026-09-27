import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PLAYNI — Juega y gana",
  description: "Juega, completa desafíos y gana monedas con PLAYNI."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}