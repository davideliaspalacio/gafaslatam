"use client";

import { useActionState, useTransition } from "react";
import { createReview, deleteReview, toggleReview } from "@/app/admin/actions";
import { Button, Checkbox, FormMessage, Input, Label, Select, Textarea } from "@/components/admin/ui";

export function ReviewForm({ products }: { products: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createReview, null);
  return (
    <form action={action} className="space-y-4 px-4 py-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="author">Nombre</Label>
          <Input id="author" name="author" required placeholder="Laura M." />
        </div>
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" name="city" placeholder="Cali" />
        </div>
        <div>
          <Label htmlFor="rating">Calificación</Label>
          <Select id="rating" name="rating" defaultValue="5">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "estrella" : "estrellas"}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="product_id">Producto</Label>
          <Select id="product_id" name="product_id" defaultValue={products[0]?.id ?? ""}>
            <option value="">Todos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="body">Reseña</Label>
        <Textarea id="body" name="body" required />
      </div>
      <div>
        <Label htmlFor="photo_url">Foto (URL, opcional)</Label>
        <Input id="photo_url" name="photo_url" type="url" />
      </div>
      <Checkbox name="published" defaultChecked label="Publicar de una vez" />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar reseña"}
        </Button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function ReviewRowActions({ id, published }: { id: string; published: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex shrink-0 flex-col items-end gap-2">
      <Button variant={published ? "secondary" : "primary"} disabled={pending} onClick={() => start(() => toggleReview(id, !published))}>
        {published ? "Ocultar" : "Publicar"}
      </Button>
      <Button
        variant="ghost"
        disabled={pending}
        onClick={() => {
          if (confirm("¿Borrar esta reseña?")) start(() => deleteReview(id));
        }}
      >
        Borrar
      </Button>
    </div>
  );
}
