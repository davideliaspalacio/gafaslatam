// Crea (o actualiza) el usuario del panel y lo marca como administrador.
// Uso: pnpm admin:create   (lee ADMIN_EMAIL y ADMIN_PASSWORD de .env.local)
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !secret || !email || !password) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL o ADMIN_PASSWORD.");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD debe tener al menos 12 caracteres.");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false } });

async function findUser(targetEmail) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (hit || data.users.length < 200) return hit ?? null;
  }
  return null;
}

let user = await findUser(email);
if (user) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (error) throw error;
  console.log(`Usuario existente actualizado: ${email}`);
} else {
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  user = data.user;
  console.log(`Usuario creado: ${email}`);
}

const { error: adminError } = await supabase.from("admins").upsert({ user_id: user.id });
if (adminError) throw adminError;
console.log("Listo: tiene acceso a /admin.");
