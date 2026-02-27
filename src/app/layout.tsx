import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projeção Brutal — Enfrente sua realidade financeira",
  description:
    "Descubra o custo real das suas escolhas hoje e o que você pode alcançar com disciplina em 5 anos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
