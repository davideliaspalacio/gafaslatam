"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { supabaseEnv } from "@/lib/supabase/env";

/** Cliente del navegador para el panel (subida de imágenes con la sesión del admin). */
export function browserClient() {
  const { url, publishableKey } = supabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
