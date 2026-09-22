"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, Users2 } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Compass },
  { href: "/library", label: "Biblioteca", icon: Bookmark },
  { href: "/clients", label: "Clientes", icon: Users2 },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-surface/95 backdrop-blur px-4 py-2 flex items-center justify-around">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium",
              active ? "text-foreground" : "text-muted"
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
