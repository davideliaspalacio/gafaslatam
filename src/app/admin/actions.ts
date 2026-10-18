"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { CATALOG_TAG, REVIEWS_TAG, SETTINGS_TAG } from "@/lib/catalog";
import { sessionClient } from "@/lib/supabase/clients";
import { hasSupabase } from "@/lib/supabase/env";
import type { Bundle, Faq, Feature, Moment, ProductImage, Spec, Variant } from "@/lib/types";

export type ActionState = { ok: boolean; message: string } | null;

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------
export async function signIn(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Escribe tu correo y contraseña." };
  if (!hasSupabase()) return { ok: false, message: "El panel se activa cuando conectes Supabase." };

  const supabase = await sessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "Correo o contraseña incorrectos." };
  redirect("/admin");
}

export async function signOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------
const OrderUpdate = z.object({
  id: z.uuid(),
  status: z.enum(["nuevo", "confirmado", "enviado", "entregado", "cancelado", "devuelto"]),
  payment_status: z.enum(["pendiente", "pagado", "fallido"]),
  carrier: z.string().trim().max(80),
  tracking_number: z.string().trim().max(80),
  admin_notes: z.string().trim().max(2000),
});

export async function updateOrder(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = OrderUpdate.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Datos inválidos." };
  const { id, ...rest } = parsed.data;
  const { error } = await supabase
    .from("orders")
    .update({
      ...rest,
      carrier: rest.carrier || null,
      tracking_number: rest.tracking_number || null,
      admin_notes: rest.admin_notes || null,
    })
    .eq("id", id);
  if (error) return { ok: false, message: "No se pudo guardar." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Pedido actualizado." };
}

export async function setOrderStatus(id: string, status: z.infer<typeof OrderUpdate>["status"]) {
  const { supabase } = await requireAdmin();
  const parsedId = z.uuid().safeParse(id);
  const parsedStatus = OrderUpdate.shape.status.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return;
  await supabase.from("orders").update({ status: parsedStatus.data }).eq("id", parsedId.data);
  revalidatePath("/admin", "layout");
}

// ---------------------------------------------------------------------------
// Producto
// ---------------------------------------------------------------------------
const json = <T>(schema: z.ZodType<T>) =>
  z.string().transform((value, ctx) => {
    try {
      return schema.parse(JSON.parse(value || "[]"));
    } catch {
      ctx.addIssue({ code: "custom", message: "Formato inválido" });
      return z.NEVER;
    }
  });

const money = z.coerce.number().int().min(0).max(100_000_000);

const ProductUpdate = z.object({
  id: z.uuid(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  headline: z.string().trim().max(160),
  short_description: z.string().trim().max(400),
  description: z.string().trim().max(4000),
  price: money,
  compare_at_price: z.union([z.literal(""), money]).transform((v) => (v === "" || v === 0 ? null : v)),
  stock: z.union([z.literal(""), z.coerce.number().int().min(0)]).transform((v) => (v === "" ? null : v)),
  active: z.string().optional().transform((v) => v === "on"),
  seo_title: z.string().trim().max(160),
  seo_description: z.string().trim().max(320),
  images: json<ProductImage[]>(z.array(z.object({ url: z.url(), alt: z.string().max(200) }))),
  moments: json<Moment[]>(
    z.array(
      z.object({
        url: z.url(),
        caption: z.string().max(120),
        stamp: z.string().max(16).nullable(),
        sample: z.boolean(),
      }),
    ),
  ),
  variants: json<Variant[]>(
    z.array(z.object({ id: z.string().min(1).max(60), name: z.string().min(1).max(60), swatch: z.string().max(20) })),
  ),
  bundles: json<Bundle[]>(
    z.array(
      z.object({
        qty: z.number().int().min(1).max(10),
        price: z.number().int().min(0),
        label: z.string().max(60),
        badge: z.string().max(60).nullable(),
      }),
    ),
  ),
  features: json<Feature[]>(z.array(z.object({ title: z.string().max(120), body: z.string().max(600) }))),
  specs: json<Spec[]>(
    z.array(z.object({ value: z.string().max(12), unit: z.string().max(8), label: z.string().max(60) })),
  ),
  faq: json<Faq[]>(z.array(z.object({ q: z.string().max(200), a: z.string().max(1200) }))),
  in_the_box: json<string[]>(z.array(z.string().max(80))),
});

export async function updateProduct(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = ProductUpdate.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: `Revisa "${String(issue?.path[0] ?? "")}": ${issue?.message ?? "dato inválido"}` };
  }
  const { id, ...rest } = parsed.data;
  const bundles = [...rest.bundles]
    .sort((a, b) => a.qty - b.qty)
    .map((b) => (b.qty === 1 ? { ...b, price: rest.price } : b));
  const { error } = await supabase
    .from("products")
    .update({
      ...rest,
      bundles,
      headline: rest.headline || null,
      short_description: rest.short_description || null,
      description: rest.description || null,
      seo_title: rest.seo_title || null,
      seo_description: rest.seo_description || null,
    })
    .eq("id", id);
  if (error) {
    return { ok: false, message: error.code === "23505" ? "Ese enlace (slug) ya existe." : "No se pudo guardar." };
  }
  updateTag(CATALOG_TAG);
  revalidatePath("/admin/productos");
  return { ok: true, message: "Producto guardado. La tienda ya muestra los cambios." };
}

// ---------------------------------------------------------------------------
// Ajustes
// ---------------------------------------------------------------------------
const SettingsUpdate = z.object({
  store_name: z.string().trim().min(1).max(60),
  whatsapp_number: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || /^57\d{10}$/.test(v), "Formato: 57 + 10 dígitos, ej. 573001234567"),
  support_email: z.union([z.literal(""), z.email()]),
  announcement: z.string().trim().max(140),
  shipping_cost: money,
  free_shipping: z.string().optional().transform((v) => v === "on"),
  delivery_estimate: z.string().trim().min(2).max(60),
  cod_enabled: z.string().optional().transform((v) => v === "on"),
  online_payment_enabled: z.string().optional().transform((v) => v === "on"),
  tiktok_pixel_id: z.string().trim().max(40).regex(/^[A-Z0-9]*$/i, "Solo letras y números"),
  meta_pixel_id: z.string().trim().max(30).regex(/^\d*$/, "Solo números"),
  legal_name: z.string().trim().max(120),
  tax_id: z.string().trim().max(30),
  legal_address: z.string().trim().max(200),
});

export async function updateSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = SettingsUpdate.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: `Revisa "${String(issue?.path[0] ?? "")}": ${issue?.message ?? "dato inválido"}` };
  }
  const s = parsed.data;
  if (!s.cod_enabled && !s.online_payment_enabled) {
    return { ok: false, message: "Deja activa al menos una forma de pago." };
  }
  const { error } = await supabase
    .from("store_settings")
    .update({
      ...s,
      whatsapp_number: s.whatsapp_number || null,
      support_email: s.support_email || null,
      announcement: s.announcement || null,
      tiktok_pixel_id: s.tiktok_pixel_id || null,
      meta_pixel_id: s.meta_pixel_id || null,
      legal_name: s.legal_name || null,
      tax_id: s.tax_id || null,
      legal_address: s.legal_address || null,
    })
    .eq("id", 1);
  if (error) return { ok: false, message: "No se pudo guardar." };
  updateTag(SETTINGS_TAG);
  revalidatePath("/admin/ajustes");
  return { ok: true, message: "Ajustes guardados." };
}

// ---------------------------------------------------------------------------
// Reseñas
// ---------------------------------------------------------------------------
const ReviewInput = z.object({
  product_id: z.union([z.literal(""), z.uuid()]).transform((v) => v || null),
  author: z.string().trim().min(2).max(60),
  city: z.string().trim().max(60),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(5).max(800),
  photo_url: z.union([z.literal(""), z.url()]),
  published: z.string().optional().transform((v) => v === "on"),
});

export async function createReview(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const parsed = ReviewInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Revisa nombre, calificación y texto." };
  const r = parsed.data;
  const { error } = await supabase
    .from("reviews")
    .insert({ ...r, city: r.city || null, photo_url: r.photo_url || null });
  if (error) return { ok: false, message: "No se pudo guardar." };
  updateTag(REVIEWS_TAG);
  revalidatePath("/admin/resenas");
  return { ok: true, message: "Reseña guardada." };
}

export async function toggleReview(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  await supabase.from("reviews").update({ published }).eq("id", id);
  updateTag(REVIEWS_TAG);
  revalidatePath("/admin/resenas");
}

export async function deleteReview(id: string) {
  const { supabase } = await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  await supabase.from("reviews").delete().eq("id", id);
  updateTag(REVIEWS_TAG);
  revalidatePath("/admin/resenas");
}
