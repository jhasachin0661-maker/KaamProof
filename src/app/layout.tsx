import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "KaamProof — Work is Real. Now It's Proven.", template: "%s | KaamProof" },
  description: "KaamProof helps workers maintain verifiable records of their work, wages and achievements — a worker-owned digital work record with mutual confirmation and QR verification.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "KaamProof",
    title: "KaamProof — Work is Real. Now It's Proven.",
    description: "A worker-owned digital work record: sessions, wages, payments and certificates, confirmed by both sides.",
  },
  twitter: { card: "summary", title: "KaamProof", description: "Worker-owned digital work records." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#14352a" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 antialiased">{children}</body>
    </html>
  );
}
