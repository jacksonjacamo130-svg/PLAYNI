"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, ListChecks, WalletCards } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/games", label: "Ganar", icon: Gamepad2 },
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
            <Icon size={21} strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}