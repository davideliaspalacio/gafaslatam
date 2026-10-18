"use client";

import { useActionState } from "react";
import { updateOrder } from "@/app/admin/actions";
import { Button, FormMessage, Input, Label, Select, Textarea } from "@/components/admin/ui";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, type OrderStatus, type PaymentStatus } from "@/lib/types";

type Props = {
  order: {
    id: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    carrier: string;
    tracking_number: string;
    admin_notes: string;
  };
};

export function OrderEditForm({ order }: Props) {
  const [state, action, pending] = useActionState(updateOrder, null);
  return (
    <form action={action} className="space-y-4 px-4 py-4">
      <input type="hidden" name="id" value={order.id} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select id="status" name="status" defaultValue={order.status}>
            {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_status">Pago</Label>
          <Select id="payment_status" name="payment_status" defaultValue={order.payment_status}>
            {(Object.keys(PAYMENT_STATUS_LABEL) as PaymentStatus[]).map((s) => (
              <option key={s} value={s}>
                {PAYMENT_STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="carrier">Transportadora</Label>
        <Input id="carrier" name="carrier" defaultValue={order.carrier} placeholder="Interrapidísimo, Servientrega…" />
      </div>
      <div>
        <Label htmlFor="tracking_number">Número de guía</Label>
        <Input id="tracking_number" name="tracking_number" defaultValue={order.tracking_number} />
      </div>
      <div>
        <Label htmlFor="admin_notes">Notas internas</Label>
        <Textarea
          id="admin_notes"
          name="admin_notes"
          defaultValue={order.admin_notes}
          placeholder="Confirmado por WhatsApp a las 3 p. m., prefiere entrega en la tarde…"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
