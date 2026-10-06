"use client";

import { User } from "lucide-react";

type MobileHeaderProps = { appName: string; onProfile: () => void };

export function MobileHeader({ appName, onProfile }: MobileHeaderProps) {
  return (
    <header className="mobile-app-bar md:hidden">
      <div className="mobile-brand-mark" aria-hidden="true">क</div>
      <span className="mobile-brand-name">{appName}</span>
      <button type="button" aria-label="Open profile" onClick={onProfile} className="mobile-profile-button">
        <User className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  );
}
