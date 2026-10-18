import "server-only";
import { createHash } from "node:crypto";

// Wompi (Bancolombia): tarjeta, PSE, Nequi y botón Bancolombia.
// Docs: https://docs.wompi.co/docs/colombia/widget-checkout-web/

const env = process.env.WOMPI_ENV === "production" ? "production" : "sandbox";
const API = env === "production" ? "https://production.wompi.co/v1" : "https://sandbox.wompi.co/v1";

export function wompiConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function checkoutUrl(input: {
  reference: string;
  amountCOP: number;
  redirectUrl: string;
  email?: string | null;
  fullName: string;
  phone: string;
}) {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!;
  const amountInCents = String(input.amountCOP * 100);
  const signature = sha256(`${input.reference}${amountInCents}COP${process.env.WOMPI_INTEGRITY_SECRET}`);
  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": amountInCents,
    reference: input.reference,
    "signature:integrity": signature,
    "redirect-url": input.redirectUrl,
    "customer-data:full-name": input.fullName,
    "customer-data:phone-number": input.phone,
    "customer-data:phone-number-prefix": "+57",
  });
  if (input.email) params.set("customer-data:email", input.email);
  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

export type WompiTransaction = {
  id: string;
  status: "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING";
  reference: string;
  amount_in_cents: number;
  currency: string;
};

/** Consulta pública de una transacción (no requiere llave privada). */
export async function fetchTransaction(id: string): Promise<WompiTransaction | null> {
  const res = await fetch(`${API}/transactions/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: WompiTransaction };
  return json.data ?? null;
}

/** Verifica la firma de un evento de webhook de Wompi. */
export function verifyEventSignature(event: {
  data: Record<string, unknown>;
  signature?: { properties?: string[]; checksum?: string };
  timestamp?: number;
}) {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret || !event.signature?.properties || !event.signature.checksum) return false;
  const values = event.signature.properties.map((path) =>
    String(path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], event.data)),
  );
  const expected = sha256(values.join("") + String(event.timestamp) + secret);
  return expected === event.signature.checksum.toLowerCase();
}
