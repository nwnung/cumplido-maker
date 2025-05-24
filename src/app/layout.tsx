import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const plain = localFont({
  src: "/fonts/Plain-Regular.otf",
});

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
    <html lang="en">
      <body className={`${plain.className} antialiased`}>{children}</body>
    </html>
  );
}
