import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSM Atlas",
  description: "Materiais de Desenvolvimento de Software Multiplataforma",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
