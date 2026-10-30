"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { placeOrder } from "@/app/actions/order";
import { buttonPrimary } from "@/components/store/buttons";
import { Photo } from "@/components/store/photo";
import { DEPARTMENTS } from "@/lib/colombia";
import { formatCOP } from "@/lib/format";
import { newEventId, readAttribution, track } from "@/lib/pixel";
import type { Bundle, Variant } from "@/lib/types";

type Props = {
  product: { id: string; slug: string; name: string; image: { url: string; alt: string } | null; variants: Variant[]; bundles: Bundle[] };
  initialColor: string | null;
  shipping: number;
  codEnabled: boolean;
  onlineEnabled: boolean;
  deliveryEstimate: string;
};

type Errors = Record<string, string>;

export function OrderForm({ product, initialColor, shipping, codEnabled, onlineEnabled, deliveryEstimate }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(product.bundles[0]?.qty ?? 1);
  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.id === initialColor)?.id ?? product.variants[0]?.id ?? "",
  );
  const [payment, setPayment] = useState<"contraentrega" | "online">(codEnabled ? "contraentrega" : "online");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const eventIdRef = useRef<string | null>(null);

  const bundle = product.bundles.find((b) => b.qty === qty) ?? product.bundles[0];
  const unit = product.bundles[0];
  const total = bundle.price + shipping;
  const variant = product.variants.find((v) => v.id === variantId);
  const contents = [
    { content_id: product.id, content_name: product.name, quantity: bundle.qty, price: Math.round(bundle.price / bundle.qty) },
  ];

  // Llegar aquí es haber tocado "Pedir".
  useEffect(() => {
    const t = window.setTimeout(() => track("InitiateCheckout", { value: product.bundles[0].price + shipping, contents }), 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFormError(null);
    eventIdRef.current ??= newEventId();
    const eventId = eventIdRef.current;

    startTransition(async () => {
      const result = await placeOrder({
        productId: product.id,
        variantId: variantId || undefined,
        qty: bundle.qty,
        paymentMethod: payment,
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        department: String(form.get("department") ?? "") as (typeof DEPARTMENTS)[number],
        city: String(form.get("city") ?? ""),
        address: String(form.get("address") ?? ""),
        addressDetails: String(form.get("addressDetails") ?? ""),
        notes: String(form.get("notes") ?? ""),
        website: String(form.get("website") ?? ""),
        eventId,
        attribution: readAttribution(),
      });

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.message);
        const first = Object.keys(result.fieldErrors ?? {})[0];
        if (first) document.getElementById(`f-${first}`)?.focus();
        return;
      }

      setErrors({});
      if (result.redirectUrl) {
        track("AddPaymentInfo", { value: result.total, contents }, eventId);
        window.location.assign(result.redirectUrl);
      } else {
        router.push(`/pedido/${result.orderId}`);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 md:grid-cols-[1fr_22rem] md:items-start md:gap-14">
      <div className="space-y-10">
        {/* Modelo y cantidad */}
        <fieldset>
          <legend className="text-[1.25rem] font-semibold">¿Cuántos pares?</legend>
          <div className="mt-4 grid gap-3">
            {product.bundles.map((b) => {
              const saving = unit.price * b.qty - b.price;
              const checked = b.qty === bundle.qty;
              return (
                <label
                  key={b.qty}
                  className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-[14px] border-2 bg-paper px-4 py-3.5 transition-colors ${
                    checked ? "border-night" : "border-line hover:border-ink-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="qty"
                    value={b.qty}
                    checked={checked}
                    onChange={() => {
                      setQty(b.qty);
                      track("AddToCart", { value: b.price + shipping, contents: [{ ...contents[0], quantity: b.qty }] });
                    }}
                    className="size-5 shrink-0"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">{b.label}</span>
                    {b.badge || saving > 0 ? (
                      <span className="block text-[0.95rem] text-ink-soft">
                        {b.badge}
                        {b.badge && saving > 0 ? " · " : ""}
                        {saving > 0 ? <span className="font-semibold whitespace-nowrap text-ink">ahorras {formatCOP(saving)}</span> : null}
                      </span>
                    ) : null}
                  </span>
                  <span className="tabular font-semibold">{formatCOP(b.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {product.variants.length > 1 ? (
          <fieldset>
            <legend className="text-[1.25rem] font-semibold">
              Color: <span className="font-normal">{variant?.name}</span>
            </legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.variants.map((v) => (
                <label key={v.id} className="cursor-pointer" title={v.name}>
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={v.id === variantId}
                    onChange={() => setVariantId(v.id)}
                    className="peer sr-only"
                  />
                  <span
                    className="block size-11 rounded-full ring-2 ring-line ring-offset-2 ring-offset-cream transition-shadow peer-checked:ring-night peer-focus-visible:ring-amber-deep"
                    style={{ background: v.swatch }}
                  />
                  <span className="sr-only">{v.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* Datos de entrega */}
        <fieldset>
          <legend className="text-[1.25rem] font-semibold">¿A dónde te las mandamos?</legend>
          <p className="mt-1 text-[0.95rem] text-ink-soft">Con estos datos te escribimos y se los pasamos a la transportadora.</p>
          <div className="mt-5 grid gap-4">
            <Field id="name" label="Nombre y apellido" error={errors.name} autoComplete="name" />
            <Field
              id="phone"
              label="Celular con WhatsApp"
              error={errors.phone}
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="300 123 4567"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField id="department" label="Departamento" error={errors.department} />
              <Field id="city" label="Ciudad o municipio" error={errors.city} autoComplete="address-level2" />
            </div>
            <Field id="address" label="Dirección" error={errors.address} autoComplete="street-address" placeholder="Calle 10 # 43-25" />
            <Field
              id="addressDetails"
              label="Barrio, apto o cómo llegar"
              optional
              error={errors.addressDetails}
              placeholder="Barrio Laureles, torre 2 apto 501"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>
        </fieldset>

        {codEnabled && onlineEnabled ? (
          <fieldset>
            <legend className="text-[1.25rem] font-semibold">¿Cómo pagas?</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <PayOption
                checked={payment === "contraentrega"}
                onChange={() => setPayment("contraentrega")}
                title="Al recibir"
                detail="En efectivo a la transportadora"
              />
              <PayOption
                checked={payment === "online"}
                onChange={() => setPayment("online")}
                title="Ahora, en línea"
                detail="Nequi, PSE o tarjeta (Wompi)"
              />
            </div>
          </fieldset>
        ) : null}
      </div>

      {/* Resumen */}
      <aside className="rounded-[14px] border border-line bg-paper p-5 md:sticky md:top-6">
        <div className="flex items-center gap-4">
          <Photo src={product.image?.url} alt={product.image?.alt ?? product.name} sizes="80px" compact className="w-20 shrink-0" />
          <div>
            <p className="font-semibold">{product.name}</p>
            <Link href={`/gafas/${product.slug}`} className="text-sm text-ink-soft underline">
              Ver el modelo
            </Link>
          </div>
        </div>
        <dl className="tabular mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">
              {bundle.label}
              {variant ? ` · ${variant.name}` : ""}
            </dt>
            <dd>{formatCOP(bundle.price)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Envío</dt>
            <dd>{shipping ? formatCOP(shipping) : "Gratis"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="font-semibold">Total</dt>
            <dd className="type-display text-[1.6rem]">{formatCOP(total)}</dd>
          </div>
        </dl>

        {formError ? (
          <p role="alert" className="mt-4 rounded-[10px] border border-alert/40 bg-alert/[0.05] px-3 py-2.5 text-[0.95rem] text-alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className={`${buttonPrimary} mt-5 w-full`}>
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
          {pending ? "Enviando tu pedido…" : payment === "online" ? `Ir a pagar · ${formatCOP(total)}` : "Pedir · pagas al recibir"}
        </button>
        <p className="mt-3 text-center text-sm text-ink-soft">
          {payment === "contraentrega"
            ? `No pagas nada ahora. Te llega en ${deliveryEstimate.toLowerCase()}.`
            : "Te llevamos a Wompi para pagar."}
        </p>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
          Al pedir aceptas los{" "}
          <Link href="/politicas/terminos" className="underline">
            términos
          </Link>{" "}
          y la{" "}
          <Link href="/politicas/privacidad" className="underline">
            política de datos
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  ...input
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = useId();
  return (
    <div>
      <label htmlFor={`f-${id}`} className="block text-[0.95rem] font-semibold">
        {label}
        {optional ? <span className="ml-1 font-normal text-ink-soft">(opcional)</span> : null}
      </label>
      <input
        id={`f-${id}`}
        name={id}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={`mt-1.5 block min-h-[52px] w-full rounded-[12px] border bg-paper px-4 text-[1.0625rem] text-ink placeholder:text-ink-soft focus:border-night focus:ring-2 focus:ring-night/15 focus:outline-none ${
          error ? "border-alert" : "border-line"
        }`}
        {...input}
      />
      {error ? (
        <p id={hintId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({ id, label, error }: { id: string; label: string; error?: string }) {
  const hintId = useId();
  return (
    <div>
      <label htmlFor={`f-${id}`} className="block text-[0.95rem] font-semibold">
        {label}
      </label>
      <select
        id={`f-${id}`}
        name={id}
        required
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={`mt-1.5 block min-h-[52px] w-full appearance-none rounded-[12px] border bg-paper bg-[length:12px] bg-[right_16px_center] bg-no-repeat px-4 pr-10 text-[1.0625rem] text-ink focus:border-night focus:ring-2 focus:ring-night/15 focus:outline-none ${
          error ? "border-alert" : "border-line"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%234a5470' stroke-width='1.6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled>
          Escoge…
        </option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      {error ? (
        <p id={hintId} className="mt-1.5 text-sm text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PayOption({ checked, onChange, title, detail }: { checked: boolean; onChange: () => void; title: string; detail: string }) {
  return (
    <label
      className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-[14px] border-2 bg-paper px-4 py-3.5 transition-colors ${
        checked ? "border-night" : "border-line hover:border-ink-soft"
      }`}
    >
      <input type="radio" name="payment" checked={checked} onChange={onChange} className="mt-0.5 size-5 shrink-0" />
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-[0.95rem] text-ink-soft">{detail}</span>
      </span>
    </label>
  );
}
