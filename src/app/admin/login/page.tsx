import { Suspense } from "react";
import { hasSupabase } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata = { title: "Entrar" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="grid min-h-dvh place-items-center bg-carton px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="type-carton mb-6 text-center text-4xl text-paper">Panel</p>
        <div className="on-paper bg-paper shadow-[var(--shadow-print)]">
          <div className="bg-flash px-5 py-3">
            <p className="type-spec text-[0.75rem] text-carton-deep">Solo para el equipo de la tienda</p>
          </div>
          <Suspense fallback={<div className="h-72" />}>
            <LoginNotice searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function LoginNotice({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { e } = await searchParams;
  if (!hasSupabase()) {
    return (
      <div className="space-y-3 px-5 py-6 text-[0.95rem] leading-relaxed text-ink-soft">
        <p className="font-semibold text-ink">La tienda está en modo demostración.</p>
        <p>
          El panel necesita la base de datos. Agrega en Vercel las variables NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY y SUPABASE_SECRET_KEY de tu proyecto de Supabase y vuelve a desplegar.
        </p>
      </div>
    );
  }
  return <LoginForm notice={e === "noadmin" ? "Esta cuenta no tiene acceso al panel." : null} />;
}
