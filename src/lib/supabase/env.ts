// Variables de Supabase. Acepta los nombres nuevos (publishable/secret) y los que
// crea la integración de Supabase en Vercel (anon/service_role).

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Sin variables de Supabase la tienda corre en modo demo: catálogo de ejemplo
 * desde el código y pedidos que no se guardan. Sirve para publicar la web antes
 * de tener la base de datos en la nube.
 */
export function hasSupabase() {
  return Boolean(url && publishableKey);
}

export function supabaseEnv() {
  if (!url || !publishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "En local cópialas de `supabase status`; en Vercel agrégalas en Settings → Environment Variables.",
    );
  }
  return { url, publishableKey };
}
