import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FaiNance",
  description: "AI-powered personal finance app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}