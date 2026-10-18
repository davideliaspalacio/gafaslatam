"use client";

import { Loader2, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { placeOrder } from "@/app/actions/order";
import { DEPARTMENTS } from "@/lib/colombia";
import { formatCOP } from "@/lib/format";
import { newEventId, readAttribution, track } from "@/lib/pixel";
import type { Bundle, Variant } from "@/lib/types";

type Props = {
  product: { id: string; name: string; image: string | null; variants: Variant[]; bundles: Bundle[] };
  shipping: number;
  codEnabled: boolean;
  onlineEnabled: boolean;
  deliveryEstimate: string;
  storeName: string;
};

type Errors = Record<string, string>;

/** El sobre de pedido del laboratorio, como formulario real de compra. */
export function OrderEnvelope({ product, shipping, codEnabled, onlineEnabled, deliveryEstimate, storeName }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(product.bundles[0]?.qty ?? 1);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [payment, setPayment] = useState<"contraentrega" | "online">(codEnabled ? "contraentrega" : "online");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);
  const [pending, startTransition] = useTransition();
  const startedRef = useRef(false);
  const eventIdRef = useRef<string | null>(null);

  const bundle = product.bundles.find((b) => b.qty === qty) ?? product.bundles[0];
  const unit = product.bundles[0];
  const total = bundle.price + shipping;
  const variant = product.variants.find((v) => v.id === variantId);
  const contents = [
    { content_id: product.id, content_name: product.name, quantity: bundle.qty, price: Math.round(bundle.price / bundle.qty) },
  ];

  function onFirstInteraction() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("InitiateCheckout", { value: total, contents });
  }

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
      setFlash(true);
      if (result.redirectUrl) {
        track("AddPaymentInfo", { value: result.total, contents }, eventId);
        window.setTimeout(() => window.location.assign(result.redirectUrl!), 350);
      } else {
        window.setTimeout(() => router.push(`/pedido/${result.orderId}`), 350);
      }
    });
  }

  return (
    <section id="pedido" className="bg-carton px-3 py-16 sm:px-6 md:py-24" aria-labelledby="pedido-titulo">
      {flash ? <div className="flash-burst" aria-hidden /> : null}

      <div className="mx-auto max-w-xl">
        <h2 id="pedido-titulo" className="type-carton px-1 text-[2rem] text-paper sm:text-5xl">
          Llena el sobre
        </h2>
        <p className="mt-3 px-1 leading-relaxed text-carton-soft">
          {codEnabled
            ? `No pagas nada ahora. Te escribimos por WhatsApp para confirmar y pagas cuando te llega (${deliveryEstimate.toLowerCase()}).`
            : `Te escribimos por WhatsApp para confirmar y te llega en ${deliveryEstimate.toLowerCase()}.`}
        </p>

        {/* El sobre */}
        <form
          onSubmit={onSubmit}
          onFocus={onFirstInteraction}
          noValidate
          className="on-paper relative mt-8 bg-paper text-ink shadow-[var(--shadow-print)]"
        >
          <div className="flex items-baseline justify-between gap-4 bg-flash px-5 py-3">
            <p className="type-carton text-xl">{storeName}</p>
            <p className="type-spec text-[0.72rem] text-carton-deep">Sobre de pedido</p>
          </div>

          <div className="space-y-7 px-5 pt-6 pb-7 sm:px-7">
            <fieldset>
              <legend className="type-spec mb-3 text-[0.75rem] text-ink-soft">¿Cuántos pares?</legend>
              <div className="grid gap-2.5">
                {product.bundles.map((b) => {
                  const saving = unit.price * b.qty - b.price;
                  const checked = b.qty === bundle.qty;
                  return (
                    <label
                      key={b.qty}
                      className={`flex cursor-pointer items-center gap-3 border-2 px-4 py-3.5 transition-colors ${
                        checked ? "border-carton bg-carton/[0.06]" : "border-rule hover:border-ink-soft"
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
                        <span className="block font-bold">{b.label}</span>
                        {b.badge || saving > 0 ? (
                          <span className="block text-sm text-ink-soft">
                            {[b.badge, saving > 0 ? `ahorras ${formatCOP(saving)}` : null].filter(Boolean).join(" · ")}
                          </span>
                        ) : null}
                      </span>
                      <span className="tabular text-lg font-bold">{formatCOP(b.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {product.variants.length > 1 ? (
              <fieldset>
                <legend className="type-spec mb-3 text-[0.75rem] text-ink-soft">
                  Color: <span className="text-ink">{variant?.name}</span>
                </legend>
                <div className="flex flex-wrap gap-3">
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
                        className="block size-11 rounded-full ring-2 ring-rule ring-offset-2 ring-offset-paper transition-shadow peer-checked:ring-carton peer-focus-visible:ring-flash"
                        style={{ background: v.swatch }}
                      />
                      <span className="sr-only">{v.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="grid gap-5">
              <Field id="name" label="Nombre y apellido" error={errors.name} autoComplete="name" />
              <Field
                id="phone"
                label="Celular (WhatsApp)"
                error={errors.phone}
                autoComplete="tel-national"
                inputMode="tel"
                placeholder="300 123 4567"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField id="department" label="Departamento" error={errors.department} />
                <Field id="city" label="Ciudad o municipio" error={errors.city} autoComplete="address-level2" />
              </div>
              <Field
                id="address"
                label="Dirección de entrega"
                error={errors.address}
                autoComplete="street-address"
                placeholder="Calle 10 # 43-25"
              />
              <Field
                id="addressDetails"
                label="Barrio, apto o indicaciones"
                optional
                error={errors.addressDetails}
                placeholder="Barrio El Poblado, torre 2 apto 501"
              />
              {/* Trampa para bots: invisible para personas */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            </div>

            {codEnabled && onlineEnabled ? (
              <fieldset>
                <legend className="type-spec mb-3 text-[0.75rem] text-ink-soft">Forma de pago</legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <PayOption
                    checked={payment === "contraentrega"}
                    onChange={() => setPayment("contraentrega")}
                    title="Pagar al recibir"
                    detail="Efectivo a la transportadora"
                  />
                  <PayOption
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                    title="Pagar ahora"
                    detail="Nequi, PSE o tarjeta (Wompi)"
                  />
                </div>
              </fieldset>
            ) : null}
          </div>

          {/* Desprendible: el resumen que te quedas */}
          <div className="relative border-t-2 border-dashed border-rule px-5 pt-6 pb-6 sm:px-7">
            <Scissors className="absolute -top-[11px] left-4 size-5 bg-paper px-0.5 text-ink-soft" aria-hidden />
            <dl className="tabular space-y-2 text-[0.95rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  {product.name}
                  {variant ? ` · ${variant.name}` : ""} × {bundle.qty}
                </dt>
                <dd>{formatCOP(bundle.price)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Envío</dt>
                <dd>{shipping ? formatCOP(shipping) : "Gratis"}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                <dt className="font-bold">Total</dt>
                <dd className="type-carton text-2xl" style={{ fontStyle: "normal" }}>
                  {formatCOP(total)}
                </dd>
              </div>
              <p className="text-right text-sm text-ink-soft">
                {payment === "contraentrega" ? "Pagas al recibir, en efectivo" : "Pagas ahora en Wompi"}
              </p>
            </dl>

            {formError ? (
              <p role="alert" className="mt-5 border border-alert/40 bg-alert/[0.06] px-3 py-2.5 text-sm text-alert">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="type-spec mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-[3px] bg-flash px-6 text-[1.05rem] text-ink shadow-[var(--shadow-lift)] transition-[background-color,translate] duration-200 hover:bg-flash-deep active:translate-y-px disabled:cursor-progress disabled:opacity-80"
            >
              {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
              {pending
                ? "Registrando pedido…"
                : payment === "online"
                  ? `Ir a pagar · ${formatCOP(total)}`
                  : `Confirmar pedido · ${formatCOP(total)}`}
            </button>
            <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
              Al confirmar aceptas los{" "}
              <a href="/politicas/terminos" className="underline">
                términos
              </a>{" "}
              y la{" "}
              <a href="/politicas/privacidad" className="underline">
                política de datos
              </a>
              . Solo usamos tu número para coordinar la entrega.
            </p>
          </div>
        </form>
      </div>
    </section>
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
      <label htmlFor={`f-${id}`} className="type-spec block text-[0.75rem] text-ink-soft">
        {label}
        {optional ? <span className="ml-1 normal-case tracking-normal text-ink-soft/80">(opcional)</span> : null}
      </label>
      <input
        id={`f-${id}`}
        name={id}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={`mt-1 block w-full border-0 border-b-2 bg-transparent px-0 py-2.5 text-[1.06rem] text-ink placeholder:text-ink-soft/55 focus:border-carton focus:ring-0 focus:outline-none ${
          error ? "border-alert" : "border-ink/25"
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
      <label htmlFor={`f-${id}`} className="type-spec block text-[0.75rem] text-ink-soft">
        {label}
      </label>
      <select
        id={`f-${id}`}
        name={id}
        required
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={`mt-1 block w-full appearance-none border-0 border-b-2 bg-transparent bg-[length:12px] bg-[right_2px_center] bg-no-repeat px-0 py-2.5 text-[1.06rem] text-ink focus:border-carton focus:outline-none ${
          error ? "border-alert" : "border-ink/25"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%234a5a4f' stroke-width='1.8'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled>
          Elige…
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

function PayOption({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  detail: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border-2 px-4 py-3.5 transition-colors ${
        checked ? "border-carton bg-carton/[0.06]" : "border-rule hover:border-ink-soft"
      }`}
    >
      <input type="radio" name="payment" checked={checked} onChange={onChange} className="mt-0.5 size-5 shrink-0" />
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-ink-soft">{detail}</span>
      </span>
    </label>
  );
}
