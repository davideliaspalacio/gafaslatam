const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** $189.900 */
export function formatCOP(value: number) {
  return cop.format(value).replace(/\s/g, "");
}

/** 189.900 (sin símbolo) */
export function formatThousands(value: number) {
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(value);
}

/** Normaliza un celular colombiano a 10 dígitos (3XXXXXXXXX) o devuelve null. */
export function normalizeColombianMobile(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length === 12) digits = digits.slice(2);
  return /^3\d{9}$/.test(digits) ? digits : null;
}

/** 300 123 4567 */
export function formatPhone(digits: string) {
  return digits.length === 10 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : digits;
}

export function whatsappLink(number: string | null | undefined, text: string) {
  if (!number) return null;
  const clean = number.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

const dateTime = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso));
}
