"use client";

import type { LucideIcon } from "lucide-react";

export type MobileNavItem = { id: string; label: string; icon: LucideIcon };

type BottomNavigationProps = { items: MobileNavItem[]; activeId: string; onChange: (id: string) => void };

export function BottomNavigation({ items, activeId, onChange }: BottomNavigationProps) {
  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Primary navigation">
      {items.map(({ id, label, icon: Icon }) => {
        const active = activeId === id;
        return (
          <button key={id} type="button" onClick={() => onChange(id)} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
