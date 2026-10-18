import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabase, supabaseEnv } from "@/lib/supabase/env";

// Refresca la sesión de Supabase en el panel y saca a quien no haya iniciado sesión.
// La autorización real (¿es admin?) se verifica en el servidor en cada página y acción.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Modo demo: sin base de datos el panel no funciona; todo va a la pantalla de login con el aviso.
  if (!hasSupabase()) {
    if (request.nextUrl.pathname === "/admin/login") return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { url, publishableKey } = supabaseEnv();
  const supabase = createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!data?.claims && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
