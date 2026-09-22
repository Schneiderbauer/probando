"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, Users2, Sparkles } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Compass },
  { href: "/library", label: "Biblioteca", icon: Bookmark },
  { href: "/clients", label: "Clientes", icon: Users2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 border-r border-border bg-surface/60 px-4 py-6 h-screen sticky top-0">
      <Link href="/" className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight">ReelScout</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted hover:text-foreground hover:bg-surface-2/60"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 py-4 rounded-xl bg-surface-2/60 text-xs text-muted leading-relaxed">
        Centro de inteligencia de contenido para tu agencia: analizá a la competencia y generá
        guiones listos para grabar.
      </div>
    </aside>
  );
}
