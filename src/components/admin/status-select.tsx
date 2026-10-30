"use client";

import { useOptimistic, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, string> = {
  nuevo: "bg-amber border-amber-deep",
  confirmado: "bg-night/10 border-night/30 text-deep",
  enviado: "bg-paper border-night/40 text-deep",
  entregado: "bg-night border-night text-paper",
  cancelado: "bg-ink/5 border-ink/15 text-ink-soft",
  devuelto: "bg-alert/10 border-alert/30 text-alert",
};

/** Cambio rápido de estado desde la tabla de pedidos. */
export function StatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, start] = useTransition();
  return (
    <select
      value={optimistic}
      disabled={pending}
      aria-label="Estado del pedido"
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        start(async () => {
          setOptimistic(next);
          await setOrderStatus(id, next);
        });
      }}
      className={`rounded-[3px] border px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-night/30 disabled:opacity-70 ${TONE[optimistic]}`}
    >
      {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
