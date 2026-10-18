"use client";

import { useActionState } from "react";
import { updateSettings } from "@/app/admin/actions";
import { Button, Checkbox, FormMessage, Input, Label, Panel } from "@/components/admin/ui";
import type { SettingsRow } from "@/lib/types";

export function SettingsForm({ settings, wompiReady }: { settings: SettingsRow; wompiReady: boolean }) {
  const [state, action, pending] = useActionState(updateSettings, null);
  return (
    <form action={action} className="space-y-6">
      <Panel title="Tienda">
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="store_name">Nombre de la tienda</Label>
            <Input id="store_name" name="store_name" defaultValue={settings.store_name} required />
          </div>
          <div>
            <Label htmlFor="whatsapp_number">WhatsApp de la tienda</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              inputMode="tel"
              placeholder="573001234567"
              defaultValue={settings.whatsapp_number ?? ""}
            />
            <p className="mt-1 text-xs text-ink-soft">57 + el número de 10 dígitos, sin espacios ni +.</p>
          </div>
          <div>
            <Label htmlFor="support_email">Correo de soporte</Label>
            <Input id="support_email" name="support_email" type="email" defaultValue={settings.support_email ?? ""} />
          </div>
          <div>
            <Label htmlFor="announcement">Franja superior</Label>
            <Input
              id="announcement"
              name="announcement"
              maxLength={140}
              placeholder="Vacío para ocultarla"
              defaultValue={settings.announcement ?? ""}
            />
          </div>
        </div>
      </Panel>

      <Panel title="Envío y pagos">
        <div className="grid gap-5 px-4 py-4 sm:grid-cols-2">
          <div className="space-y-4">
            <Checkbox
              name="free_shipping"
              defaultChecked={settings.free_shipping}
              label="Envío gratis"
              hint="Si lo desmarcas se cobra el costo de envío."
            />
            <div>
              <Label htmlFor="shipping_cost">Costo de envío (COP)</Label>
              <Input id="shipping_cost" name="shipping_cost" type="number" min={0} defaultValue={settings.shipping_cost} />
            </div>
            <div>
              <Label htmlFor="delivery_estimate">Tiempo de entrega</Label>
              <Input id="delivery_estimate" name="delivery_estimate" defaultValue={settings.delivery_estimate} required />
            </div>
          </div>
          <div className="space-y-4">
            <Checkbox name="cod_enabled" defaultChecked={settings.cod_enabled} label="Pago contraentrega" />
            <Checkbox
              name="online_payment_enabled"
              defaultChecked={settings.online_payment_enabled}
              label="Pago online con Wompi"
              hint={
                wompiReady
                  ? "Llaves de Wompi configuradas."
                  : "Faltan las llaves de Wompi en las variables de entorno; mientras tanto no se muestra."
              }
            />
          </div>
        </div>
      </Panel>

      <Panel title="Píxeles de publicidad">
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="tiktok_pixel_id">ID del píxel de TikTok</Label>
            <Input id="tiktok_pixel_id" name="tiktok_pixel_id" placeholder="C1A2B3…" defaultValue={settings.tiktok_pixel_id ?? ""} />
            <p className="mt-1 text-xs text-ink-soft">
              TikTok Ads Manager → Herramientas → Eventos → Web. Para eventos desde el servidor agrega también el token en
              TIKTOK_EVENTS_ACCESS_TOKEN.
            </p>
          </div>
          <div>
            <Label htmlFor="meta_pixel_id">ID del píxel de Meta (opcional)</Label>
            <Input id="meta_pixel_id" name="meta_pixel_id" inputMode="numeric" defaultValue={settings.meta_pixel_id ?? ""} />
          </div>
        </div>
      </Panel>

      <Panel title="Datos legales (pie de página y políticas)">
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="legal_name">Razón social o responsable</Label>
            <Input id="legal_name" name="legal_name" defaultValue={settings.legal_name ?? ""} />
          </div>
          <div>
            <Label htmlFor="tax_id">NIT o cédula</Label>
            <Input id="tax_id" name="tax_id" defaultValue={settings.tax_id ?? ""} />
          </div>
          <div>
            <Label htmlFor="legal_address">Dirección de contacto</Label>
            <Input id="legal_address" name="legal_address" defaultValue={settings.legal_address ?? ""} />
          </div>
        </div>
        <p className="px-4 pb-4 text-xs text-ink-soft">
          El Estatuto del Consumidor (Ley 1480) pide mostrar quién vende y cómo contactarlo.
        </p>
      </Panel>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar ajustes"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
