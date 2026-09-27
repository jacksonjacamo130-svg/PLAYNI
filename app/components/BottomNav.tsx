"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ListChecks, WalletCards } from "lucide-react";

const items = [
  { href: "/", label: "Descubrir", icon: Compass },
  { href: "/tasks", label: "Mis tareas", icon: ListChecks },
  { href: "/wallet", label: "Billetera", icon: WalletCards },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} className={active ? "active" : ""} href={href}>
            <Icon size={22} strokeWidth={2.15} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}