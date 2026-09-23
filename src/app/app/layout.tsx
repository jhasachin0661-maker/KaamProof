import type { Metadata } from "next";
import type { ReactNode } from "react";

// Private, authenticated dashboards must never be indexed.
export const metadata: Metadata = {
  title: "KaamProof — Dashboard",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
