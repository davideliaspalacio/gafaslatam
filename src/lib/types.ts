import type { Database } from "@/lib/database.types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type SettingsRow = Database["public"]["Tables"]["store_settings"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];

export type ProductImage = { url: string; alt: string };
export type Moment = { url: string; caption: string; stamp: string | null; sample: boolean };
export type Variant = { id: string; name: string; swatch: string };
export type Bundle = { qty: number; price: number; label: string; badge: string | null };
export type Feature = { title: string; body: string };
export type Spec = { value: string; unit: string; label: string };
export type Faq = { q: string; a: string };

export type Product = Omit<
  ProductRow,
  "images" | "moments" | "variants" | "bundles" | "features" | "specs" | "faq" | "in_the_box"
> & {
  images: ProductImage[];
  moments: Moment[];
  variants: Variant[];
  bundles: Bundle[];
  features: Feature[];
  specs: Spec[];
  faq: Faq[];
  in_the_box: string[];
};

export type OrderItem = {
  product_id: string;
  name: string;
  variant: string | null;
  qty: number;
  unit_price: number;
  line_total: number;
};

const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export function toProduct(row: ProductRow): Product {
  return {
    ...row,
    images: asArray<ProductImage>(row.images),
    moments: asArray<Moment>(row.moments),
    variants: asArray<Variant>(row.variants),
    bundles: asArray<Bundle>(row.bundles).sort((a, b) => a.qty - b.qty),
    features: asArray<Feature>(row.features),
    specs: asArray<Spec>(row.specs),
    faq: asArray<Faq>(row.faq),
    in_the_box: asArray<string>(row.in_the_box),
  };
}

/** Ofertas por cantidad. La unidad suelta siempre usa el precio principal del producto. */
export function bundlesOf(product: Pick<Product, "bundles" | "price">): Bundle[] {
  const rest = product.bundles.filter((b) => b.qty > 1);
  const single = product.bundles.find((b) => b.qty === 1);
  return [{ qty: 1, label: single?.label || "1 unidad", badge: single?.badge ?? null, price: product.price }, ...rest];
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  nuevo: "Nuevo",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  devuelto: "Devuelto",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  fallido: "Fallido",
};
