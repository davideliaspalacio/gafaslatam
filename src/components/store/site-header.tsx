import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/store/logo";

const NAV = [
  { href: "/tienda", label: "Tienda" },
  { href: "/envios-y-garantia", label: "Envíos y garantía" },
  { href: "/nosotros", label: "Nosotros" },
];

export function SiteHeader({ announcement }: { announcement: string | null }) {
  return (
    <header className="on-dark bg-night text-cream">
      {announcement ? (
        <p className="border-b border-mid px-5 py-2 text-center text-[0.8rem] font-semibold text-mist">{announcement}</p>
      ) : null}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="Gafas Latam, inicio" className="-ml-1 rounded p-1">
          <Logo variant="horizontal-crema" height={30} priority />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-mist hover:text-cream">
              {n.label}
            </Link>
          ))}
        </nav>

        <details className="group relative md:hidden">
          <summary
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-[0.95rem] font-semibold text-mist hover:text-cream"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden />
            Menú
          </summary>
          <nav
            aria-label="Principal"
            className="absolute right-0 z-50 mt-2 w-60 rounded-[14px] border border-mid bg-deep p-2 shadow-[var(--shadow-soft)]"
          >
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-[10px] px-4 py-3 font-semibold text-cream hover:bg-mid">
                {n.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
