import { whatsappLocal } from "@/lib/site";
import type { Faq as FaqItem, SettingsRow } from "@/lib/types";

/** Franja de confianza: tres datos, sin íconos de plantilla. */
export function TrustStrip({ settings, tone = "dark" }: { settings: SettingsRow; tone?: "dark" | "light" }) {
  const dias = settings.delivery_estimate.toLowerCase();
  const items = [
    { k: "Envío", v: settings.free_shipping ? `Gratis, en ${dias}` : `En ${dias}` },
    { k: "Pago", v: settings.cod_enabled ? "En efectivo al recibir" : "Seguro en línea" },
    { k: "Garantía", v: "Si llegan con falla, te las cambiamos" },
  ];
  const dark = tone === "dark";
  return (
    <dl
      className={`grid grid-cols-3 divide-x border-y ${
        dark ? "divide-mid border-mid text-cream" : "divide-line border-line text-ink"
      }`}
    >
      {items.map((i, idx) => (
        <div key={i.k} className={`py-3.5 ${idx === 0 ? "pr-3" : idx === 2 ? "pl-3" : "px-3"}`}>
          <dt className={`type-label text-[0.68rem] ${dark ? "text-mist" : "text-ink-soft"}`}>{i.k}</dt>
          <dd className="mt-1 text-[0.9rem] leading-snug font-semibold">{i.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HowToBuy({ settings }: { settings: SettingsRow }) {
  const entrega = settings.delivery_estimate.toLowerCase();
  const numero = whatsappLocal(settings.whatsapp_number);
  const steps = [
    { t: "Pides aquí, sin pagar", d: "Escoges el modelo y llenas tus datos. Hoy no pagas nada y no tienes que crear cuenta." },
    {
      t: "Confirmas por WhatsApp",
      d: `Nos mandas por WhatsApp el mensaje que te dejamos listo, con "SÍ CONFIRMO". Si no lo mandas, te escribimos${numero ? ` desde el ${numero}` : ""}. Sin tu confirmación no despachamos nada.`,
    },
    {
      t: settings.cod_enabled ? "Pagas cuando te llegan" : "Te llegan a la puerta",
      d: settings.cod_enabled
        ? `La transportadora te las lleva${settings.free_shipping ? " gratis" : ""} en ${entrega} y ahí le pagas en efectivo.`
        : `Te llegan${settings.free_shipping ? " gratis" : ""} en ${entrega}.`,
    },
  ];
  return (
    <ol className="grid gap-8 md:grid-cols-3 md:gap-10">
      {steps.map((s, i) => (
        <li key={s.t} className="border-t-2 border-night pt-5">
          <p className="type-display tabular text-[2rem] text-night">{i + 1}</p>
          <p className="mt-3 text-[1.15rem] font-semibold">{s.t}</p>
          <p className="mt-1.5 max-w-sm text-ink-soft">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-t border-line">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-4 text-[1.0625rem] font-semibold">
            {f.q}
            <span
              aria-hidden
              className="relative size-3.5 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-[1.5px] before:-translate-y-1/2 before:bg-night after:absolute after:inset-y-0 after:left-1/2 after:w-[1.5px] after:-translate-x-1/2 after:bg-night after:transition-transform group-open:after:scale-y-0"
            />
          </summary>
          <p className="max-w-[36rem] pb-6 text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
