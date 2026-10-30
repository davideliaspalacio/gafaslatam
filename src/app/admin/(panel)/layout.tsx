import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminNav, AdminNavFallback } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin-auth";

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="bg-night text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-3 sm:px-6">
          <Link href="/admin" className="type-display text-2xl">
            Panel
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Suspense fallback={null}>
              <CurrentUser />
            </Suspense>
            <Link href="/" target="_blank" className="text-mist hover:text-paper">
              Ver tienda
            </Link>
            <form action={signOut}>
              <button className="text-mist hover:text-paper">Salir</button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-2 sm:px-4">
          <Suspense fallback={<AdminNavFallback />}>
            <AdminNav />
          </Suspense>
        </div>
      </header>
      <div className="border-b border-amber-deep/30 bg-amber/15">
        <p className="mx-auto max-w-6xl px-4 py-3 text-sm sm:px-6">
          Los pedidos nuevos, los precios y las fotos de los modelos ahora se manejan en{" "}
          <a href="https://admin.shopify.com/store/ewmtsc-cb/orders" target="_blank" rel="noopener" className="font-semibold underline">
            Shopify
          </a>
          . Aquí quedan los pedidos anteriores, las reseñas y los ajustes de la tienda (WhatsApp, píxeles, textos legales).
        </p>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}

async function CurrentUser() {
  const { user } = await requireAdmin();
  return <span className="hidden text-mist sm:inline">{user.email}</span>;
}
