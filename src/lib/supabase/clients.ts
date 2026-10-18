import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "@/lib/database.types";

import { supabaseEnv } from "@/lib/supabase/env";

/** Lecturas públicas sin cookies: se puede usar dentro de "use cache". */
export function publicClient() {
  const { url, publishableKey } = supabaseEnv();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Clave secreta: salta RLS. Solo para pedidos, visitas y webhooks en el servidor. */
export function serviceClient() {
  const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Falta SUPABASE_SECRET_KEY (o SUPABASE_SERVICE_ROLE_KEY) en las variables de entorno.");
  return createClient<Database>(supabaseEnv().url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Sesión del panel (cookies). Respeta RLS como el usuario conectado. */
export async function sessionClient() {
  // El cliente de auth lee la hora al crearse: marcamos la ruta como dinámica antes.
  await connection();
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseEnv();
  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el proxy refresca la sesión.
        }
      },
    },
  });
}
