import type { ReactNode } from "react";

export function MobileCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mobile-card ${className}`}>{children}</section>;
}
