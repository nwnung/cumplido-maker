import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cumplido Maker",
  description: "Crea cumplidos divertidos para tus amigos y familiares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
