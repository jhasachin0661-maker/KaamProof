import type { ReactNode } from "react";

export function MobileAppShell({ children }: { children: ReactNode }) {
  return <div className="mobile-shell">{children}</div>;
}
