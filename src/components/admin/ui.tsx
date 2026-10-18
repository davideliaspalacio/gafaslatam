import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/types";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={cx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-[3px] px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-carton text-paper hover:bg-carton-deep",
        variant === "secondary" && "border border-ink/20 bg-paper text-ink hover:border-ink/40",
        variant === "ghost" && "text-ink-soft hover:bg-ink/5 hover:text-ink",
        variant === "danger" && "border border-alert/40 text-alert hover:bg-alert/5",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("mb-1.5 block text-[0.8rem] font-semibold text-ink-soft", className)} {...props} />;
}

const field =
  "block w-full rounded-[3px] border border-ink/20 bg-paper px-3 py-2 text-[0.95rem] text-ink placeholder:text-ink-soft/85 focus:border-carton focus:outline-none focus:ring-2 focus:ring-carton/20";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(field, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(field, "min-h-24 leading-relaxed", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(field, "pr-8", className)} {...props} />;
}

export function Checkbox({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" className="mt-0.5 size-4.5 shrink-0" {...props} />
      <span>
        <span className="block text-[0.95rem] font-medium">{label}</span>
        {hint ? <span className="block text-sm text-ink-soft">{hint}</span> : null}
      </span>
    </label>
  );
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  nuevo: "bg-flash text-ink",
  confirmado: "bg-carton/12 text-carton-deep",
  enviado: "bg-sky-100 text-sky-900",
  entregado: "bg-carton text-paper",
  cancelado: "bg-ink/8 text-ink-soft",
  devuelto: "bg-alert/10 text-alert",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cx("inline-flex rounded-[2px] px-2 py-0.5 text-xs font-semibold whitespace-nowrap", STATUS_STYLE[status])}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentBadge({ method, status }: { method: string; status: PaymentStatus }) {
  if (method === "contraentrega") {
    return <span className="text-xs whitespace-nowrap text-ink-soft">Contraentrega</span>;
  }
  return (
    <span
      className={cx(
        "text-xs font-semibold whitespace-nowrap",
        status === "pagado" ? "text-carton" : status === "fallido" ? "text-alert" : "text-ink-soft",
      )}
    >
      Online · {PAYMENT_STATUS_LABEL[status]}
    </span>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h1 className="type-carton text-3xl text-carton sm:text-4xl">{title}</h1>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("border border-ink/10 bg-paper", className)}>
      {title ? <h2 className="border-b border-ink/10 px-4 py-3 text-sm font-bold">{title}</h2> : null}
      {children}
    </section>
  );
}

export function FormMessage({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null;
  return (
    <p role="status" className={cx("text-sm", state.ok ? "text-carton" : "text-alert")}>
      {state.message}
    </p>
  );
}

export function Loading() {
  return <div className="h-64 animate-pulse bg-ink/[0.03]" aria-label="Cargando" />;
}
