"use client";

import { Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PedidoRespuesta } from "@/app/api/pedido/route";
import { buttonPrimary } from "@/components/store/buttons";
import { Photo } from "@/components/store/photo";
import { DEPARTAMENTOS } from "@/lib/ciudades";
import { formatCOP } from "@/lib/format";
import { PEDIDO_KEY, type PedidoGuardado } from "@/lib/pedido";
import { newEventId, track, type Contents } from "@/lib/pixel";

export type ModeloForm = {
  slug: string;
  nombre: string;
  corto: string;
  sku: string;
  precio: number;
  paraQue: string;
  imagen: { url: string; alt: string } | null;
  disponible: boolean;
};

type Errors = Record<string, string>;

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function OrderForm({ modelos, inicial, maxCantidad }: { modelos: ModeloForm[]; inicial: string; maxCantidad: number }) {
  const router = useRouter();
  const disponibles = modelos.filter((m) => m.disponible);
  const [slug, setSlug] = useState(disponibles.find((m) => m.slug === inicial)?.slug ?? disponibles[0]?.slug ?? "");
  const [cantidad, setCantidad] = useState(1);
  const [departamento, setDepartamento] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const eventIdRef = useRef<string | null>(null);

  const modelo = modelos.find((m) => m.slug === slug) ?? modelos[0];
  const total = modelo.precio * cantidad;
  const ciudades = useMemo(() => DEPARTAMENTOS.find((d) => d.nombre === departamento)?.ciudades ?? [], [departamento]);
  const contents: Contents = [{ content_id: modelo.sku, content_name: modelo.nombre, quantity: cantidad, price: modelo.precio }];

  // Llegar aquí es haber tocado "Pedir".
  useEffect(() => {
    const t = window.setTimeout(
      () => track("InitiateCheckout", { value: modelo.precio, contents: [{ ...contents[0], quantity: 1 }] }),
      600,
    );
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validar(form: FormData): Errors {
    const e: Errors = {};
    const nombre = String(form.get("nombre") ?? "").trim();
    if (nombre.length < 3) e.nombre = "Escribe tu nombre y apellido";
    else if (nombre.split(/\s+/).length < 2) e.nombre = "Escribe también tu apellido";
    let cel = onlyDigits(String(form.get("celular") ?? ""));
    if (cel.length === 12 && cel.startsWith("57")) cel = cel.slice(2);
    if (!/^3\d{9}$/.test(cel)) e.celular = "Escribe un celular de 10 dígitos que empiece por 3";
    if (!departamento) e.departamento = "Escoge tu departamento";
    if (!ciudad) e.ciudad = "Escoge tu ciudad o municipio";
    if (String(form.get("direccion") ?? "").trim().length < 5) e.direccion = "Escribe la dirección de entrega";
    if (String(form.get("barrio") ?? "").trim().length < 3) e.barrio = "Escribe el barrio o una indicación para llegar";
    return e;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setFormError(null);
    const local = validar(form);
    if (Object.keys(local).length) {
      setErrors(local);
      setFormError("Revisa los datos marcados.");
      document.getElementById(`f-${Object.keys(local)[0]}`)?.focus();
      return;
    }

    eventIdRef.current ??= newEventId();
    const datos = {
      modelo: slug,
      cantidad,
      nombre: String(form.get("nombre") ?? "").trim(),
      celular: String(form.get("celular") ?? ""),
      departamento,
      ciudad,
      direccion: String(form.get("direccion") ?? "").trim(),
      barrio: String(form.get("barrio") ?? "").trim(),
      eventId: eventIdRef.current,
      website: String(form.get("website") ?? ""),
    };

    setPending(true);
    let result: PedidoRespuesta;
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      result = (await res.json()) as PedidoRespuesta;
    } catch {
      result = { ok: false, message: "Se cayó la conexión. Revisa tu internet e intenta de nuevo." };
    }

    if (!result.ok) {
      setPending(false);
      setErrors(result.fieldErrors ?? {});
      setFormError(result.message);
      const first = Object.keys(result.fieldErrors ?? {})[0];
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }

    const guardado: PedidoGuardado = {
      numero: result.numero,
      total: result.total,
      eventId: result.eventId,
      modelo: slug,
      nombreModelo: modelo.nombre,
      cantidad,
      contents,
      nombre: datos.nombre,
      direccion: datos.direccion,
      barrio: datos.barrio,
      ciudad,
      departamento,
    };
    try {
      sessionStorage.setItem(PEDIDO_KEY, JSON.stringify(guardado));
    } catch {}
    router.push(`/pedido/gracias?n=${encodeURIComponent(result.numero)}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 md:grid-cols-[1fr_22rem] md:items-start md:gap-14">
      <div className="space-y-10">
        {/* Modelo */}
        <fieldset>
          <legend className="text-[1.25rem] font-semibold">¿Cuáles quieres?</legend>
          <div className="mt-4 grid gap-3">
            {modelos.map((m) => {
              const checked = m.slug === slug;
              return (
                <label
                  key={m.slug}
                  className={`flex min-h-16 items-center gap-4 rounded-[14px] border-2 bg-paper px-4 py-3.5 transition-colors ${
                    !m.disponible ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  } ${checked ? "border-night" : "border-line hover:border-ink-soft"}`}
                >
                  <input
                    type="radio"
                    name="modelo"
                    value={m.slug}
                    checked={checked}
                    disabled={!m.disponible}
                    onChange={() => {
                      setSlug(m.slug);
                      track("AddToCart", {
                        value: m.precio * cantidad,
                        contents: [{ content_id: m.sku, content_name: m.nombre, quantity: cantidad, price: m.precio }],
                      });
                    }}
                    className="size-5 shrink-0"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">{m.nombre}</span>
                    <span className="block text-[0.95rem] text-ink-soft">{m.disponible ? m.paraQue : "Agotadas por ahora"}</span>
                  </span>
                  <span className="tabular font-semibold">{formatCOP(m.precio)}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 sm:justify-start">
            <span id="cantidad-label" className="font-semibold">
              Cantidad
            </span>
            <div role="group" aria-labelledby="cantidad-label" className="flex items-center rounded-full border border-line bg-paper">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                aria-label="Quitar una"
                className="grid size-12 place-items-center rounded-full disabled:opacity-35"
              >
                <Minus className="size-4" aria-hidden />
              </button>
              <output aria-live="polite" className="tabular w-8 text-center text-lg font-semibold">
                {cantidad}
              </output>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                disabled={cantidad >= maxCantidad}
                aria-label="Agregar una"
                className="grid size-12 place-items-center rounded-full disabled:opacity-35"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </fieldset>

        {/* Datos de entrega */}
        <fieldset>
          <legend className="text-[1.25rem] font-semibold">¿A dónde te las mandamos?</legend>
          <p className="mt-1 text-[0.95rem] text-ink-soft">Con estos datos te escribimos y se los pasamos a la transportadora.</p>
          <div className="mt-5 grid gap-4">
            <Field id="nombre" label="Nombre y apellido" error={errors.nombre} autoComplete="name" />
            <Field
              id="celular"
              label="Celular con WhatsApp"
              error={errors.celular}
              autoComplete="tel-national"
              inputMode="numeric"
              placeholder="300 123 4567"
              maxLength={14}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                id="departamento"
                label="Departamento"
                error={errors.departamento}
                value={departamento}
                onChange={(v) => {
                  setDepartamento(v);
                  setCiudad("");
                }}
                options={DEPARTAMENTOS.map((d) => d.nombre)}
              />
              <Select
                id="ciudad"
                label="Ciudad o municipio"
                error={errors.ciudad}
                value={ciudad}
                onChange={setCiudad}
                options={ciudades}
                disabled={!departamento}
                placeholder={departamento ? "Escoge…" : "Primero el departamento"}
              />
            </div>
            <Field id="direccion" label="Dirección" error={errors.direccion} autoComplete="street-address" placeholder="Calle 10 # 43-25, apto 501" />
            <Field
              id="barrio"
              label="Barrio e indicaciones"
              error={errors.barrio}
              placeholder="Barrio Laureles, edificio azul junto a la panadería"
            />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>
        </fieldset>
      </div>

      {/* Resumen */}
      <aside className="rounded-[14px] border border-line bg-paper p-5 md:sticky md:top-6">
        <div className="flex items-center gap-4">
          <Photo src={modelo.imagen?.url} alt={modelo.imagen?.alt ?? modelo.nombre} sizes="80px" compact className="w-20 shrink-0" />
          <div>
            <p className="font-semibold">{modelo.nombre}</p>
            <Link href={`/gafas/${modelo.slug}`} className="text-sm text-ink-soft underline">
              Ver el modelo
            </Link>
          </div>
        </div>
        <dl className="tabular mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">
              {cantidad} × {formatCOP(modelo.precio)}
            </dt>
            <dd>{formatCOP(total)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Envío</dt>
            <dd>Gratis</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="font-semibold">Pagas al recibir</dt>
            <dd className="type-display text-[1.6rem]">{formatCOP(total)}</dd>
          </div>
        </dl>

        {formError ? (
          <p role="alert" className="mt-4 rounded-[10px] border border-alert/40 bg-alert/[0.05] px-3 py-2.5 text-[0.95rem] text-alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" disabled={pending || !disponibles.length} className={`${buttonPrimary} mt-5 w-full`}>
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
          {pending ? "Enviando tu pedido…" : "Hacer el pedido"}
        </button>
        <p className="mt-3 text-center text-sm text-ink-soft">No pagas nada ahora. Pagas en efectivo cuando te llegue.</p>
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

const inputClass = (error?: string) =>
  `mt-1.5 block min-h-[52px] w-full rounded-[12px] border bg-paper px-4 text-[1.0625rem] text-ink placeholder:text-ink-soft focus:border-night focus:ring-2 focus:ring-night/15 focus:outline-none ${
    error ? "border-alert" : "border-line"
  }`;

function Field({ id, label, error, ...input }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = useId();
  return (
    <div>
      <label htmlFor={`f-${id}`} className="block text-[0.95rem] font-semibold">
        {label}
      </label>
      <input
        id={`f-${id}`}
        name={id}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={inputClass(error)}
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

function Select({
  id,
  label,
  error,
  value,
  onChange,
  options,
  disabled,
  placeholder = "Escoge…",
}: {
  id: string;
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
}) {
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
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? hintId : undefined}
        className={`${inputClass(error)} appearance-none bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10 disabled:opacity-60`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%234a5470' stroke-width='1.6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
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
