import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";

/** Capa de acceso del panel: devuelve el cliente con sesión o redirige al login. */
export async function requireAdmin() {
  if (!hasSupabase()) redirect("/admin/login");
  const supabase = await sessionClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!admin) redirect("/admin/login?e=noadmin");

  return { supabase, user: auth.user };
}
