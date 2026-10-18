"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Producto" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

/** Versión sin estado activo para el primer render (antes de conocer la URL). */
export function AdminNavFallback() {
  return <NavLinks pathname="" />;
}

export function AdminNav() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav className="no-scrollbar -mb-px flex gap-1 overflow-x-auto" aria-label="Panel">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`border-b-[3px] px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              active ? "border-flash text-paper" : "border-transparent text-carton-soft hover:text-paper"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
