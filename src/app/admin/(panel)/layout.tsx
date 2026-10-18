import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { AdminNav, AdminNavFallback } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin-auth";

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="bg-carton text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-3 sm:px-6">
          <Link href="/admin" className="type-carton text-2xl">
            Panel
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Suspense fallback={null}>
              <CurrentUser />
            </Suspense>
            <Link href="/" target="_blank" className="text-carton-soft hover:text-paper">
              Ver tienda
            </Link>
            <form action={signOut}>
              <button className="text-carton-soft hover:text-paper">Salir</button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-2 sm:px-4">
          <Suspense fallback={<AdminNavFallback />}>
            <AdminNav />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}

async function CurrentUser() {
  const { user } = await requireAdmin();
  return <span className="hidden text-carton-soft sm:inline">{user.email}</span>;
}
