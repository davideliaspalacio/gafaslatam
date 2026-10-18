"use client";

import { useActionState, useState } from "react";
import { updateProduct } from "@/app/admin/actions";
import { ImageListEditor } from "@/components/admin/image-list-editor";
import { ListEditor } from "@/components/admin/list-editor";
import { Button, Checkbox, FormMessage, Input, Label, Panel, Textarea } from "@/components/admin/ui";
import { formatCOP } from "@/lib/format";
import type { Bundle, Faq, Feature, Moment, Product, ProductImage, Spec, Variant } from "@/lib/types";

export function ProductForm({ product }: { product: Product }) {
  const [state, action, pending] = useActionState(updateProduct, null);
  const [images, setImages] = useState<ProductImage[]>(product.images);
  const [moments, setMoments] = useState<Moment[]>(product.moments);
  const [variants, setVariants] = useState<Variant[]>(product.variants);
  const [bundles, setBundles] = useState<(Bundle & { badge: string | null })[]>(product.bundles);
  const [features, setFeatures] = useState<Feature[]>(product.features);
  const [specs, setSpecs] = useState<Spec[]>(product.specs);
  const [faq, setFaq] = useState<Faq[]>(product.faq);
  const [box, setBox] = useState<{ item: string }[]>(product.in_the_box.map((item) => ({ item })));

  const cleanBundles = bundles.map((b) => ({ ...b, badge: b.badge ? b.badge : null }));

  return (
    <form action={action} className="space-y-6 pb-24">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="moments" value={JSON.stringify(moments)} />
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="bundles" value={JSON.stringify(cleanBundles)} />
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />
      <input type="hidden" name="faq" value={JSON.stringify(faq)} />
      <input type="hidden" name="in_the_box" value={JSON.stringify(box.map((b) => b.item).filter(Boolean))} />

      <Panel title="Lo básico">
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
          </div>
          <div>
            <Label htmlFor="slug">Enlace (slug)</Label>
            <Input id="slug" name="slug" defaultValue={product.slug} required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="headline">Titular de la primera pantalla</Label>
            <Input id="headline" name="headline" defaultValue={product.headline ?? ""} />
            <p className="mt-1 text-xs text-ink-soft">Si tiene dos frases, la segunda sale en amarillo.</p>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="short_description">Descripción corta</Label>
            <Textarea id="short_description" name="short_description" defaultValue={product.short_description ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Descripción larga</Label>
            <Textarea id="description" name="description" defaultValue={product.description ?? ""} className="min-h-32" />
          </div>
          <div className="sm:col-span-2">
            <Checkbox name="active" defaultChecked={product.active} label="Visible en la tienda" />
          </div>
        </div>
      </Panel>

      <Panel title="Precio y stock">
        <div className="grid gap-4 px-4 py-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="price">Precio (COP)</Label>
            <Input id="price" name="price" type="number" inputMode="numeric" min={0} defaultValue={product.price} required />
          </div>
          <div>
            <Label htmlFor="compare_at_price">Precio anterior (opcional)</Label>
            <Input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              inputMode="numeric"
              min={0}
              defaultValue={product.compare_at_price ?? ""}
            />
            <p className="mt-1 text-xs text-ink-soft">Solo si de verdad lo vendiste a ese precio.</p>
          </div>
          <div>
            <Label htmlFor="stock">Stock (vacío = sin control)</Label>
            <Input id="stock" name="stock" type="number" inputMode="numeric" min={0} defaultValue={product.stock ?? ""} />
          </div>
        </div>
        <div className="border-t border-ink/10 px-4 py-4">
          <p className="mb-1 text-sm font-semibold">Ofertas por cantidad</p>
          <p className="mb-3 text-xs text-ink-soft">
            El precio es el total por esa cantidad. La de 1 unidad siempre usa el precio de arriba.{" "}
            {bundles[0] ? `Hoy: ${bundles.map((b) => `${b.qty} × ${formatCOP(b.price)}`).join(" · ")}` : null}
          </p>
          <ListEditor
            items={bundles}
            onChange={setBundles}
            max={4}
            addLabel="Agregar oferta"
            newItem={() => ({ qty: (bundles.at(-1)?.qty ?? 0) + 1, price: 0, label: "", badge: null })}
            fields={[
              { key: "qty", label: "Cantidad", type: "number", width: "w-24" },
              { key: "price", label: "Precio total", type: "number", width: "w-36" },
              { key: "label", label: "Texto", placeholder: "2 pares" },
              { key: "badge", label: "Etiqueta (opcional)", placeholder: "Para ti y alguien más" },
            ]}
          />
        </div>
        <div className="border-t border-ink/10 px-4 py-4">
          <p className="mb-3 text-sm font-semibold">Colores</p>
          <ListEditor
            items={variants}
            onChange={setVariants}
            max={8}
            addLabel="Agregar color"
            newItem={() => ({ id: `color-${variants.length + 1}`, name: "", swatch: "#1b1b1b" })}
            fields={[
              { key: "name", label: "Nombre", placeholder: "Negro mate" },
              { key: "id", label: "Código", placeholder: "negro-mate", width: "w-40" },
              { key: "swatch", label: "Color", type: "color", width: "w-48" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Fotos del producto">
        <div className="px-4 py-4">
          <ImageListEditor
            items={images}
            onChange={setImages}
            folder="producto"
            newItem={(url) => ({ url, alt: product.name })}
            extras={[{ key: "alt", label: "Descripción de la foto (para Google y lectores de pantalla)" }]}
          />
        </div>
      </Panel>

      <Panel title="Tomas en primera persona (lo que graban las gafas)">
        <div className="px-4 py-4">
          <p className="mb-3 text-xs text-ink-soft">
            Sube capturas reales hechas con las gafas y desmarca &quot;de referencia&quot;. Fecha en formato &apos;26 10 18.
          </p>
          <ImageListEditor
            items={moments}
            onChange={setMoments}
            folder="tomas"
            newItem={(url) => ({ url, caption: "", stamp: null, sample: false })}
            extras={[
              { key: "caption", label: "Pie de foto", placeholder: "En la moto, sin soltar el manubrio" },
              { key: "stamp", label: "Fecha estampada", placeholder: "'26 10 18" },
              { key: "sample", label: "Es imagen de referencia (no tomada con las gafas)", type: "checkbox" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Funciones">
        <div className="px-4 py-4">
          <ListEditor
            items={features}
            onChange={setFeatures}
            max={8}
            addLabel="Agregar función"
            newItem={() => ({ title: "", body: "" })}
            fields={[
              { key: "title", label: "Título", width: "w-full" },
              { key: "body", label: "Texto", type: "textarea", width: "w-full" },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Especificaciones (franja amarilla)">
        <div className="px-4 py-4">
          <p className="mb-3 text-xs text-ink-soft">Confírmalas con el proveedor antes de anunciar.</p>
          <ListEditor
            items={specs}
            onChange={setSpecs}
            max={6}
            addLabel="Agregar especificación"
            newItem={() => ({ value: "", unit: "", label: "" })}
            fields={[
              { key: "value", label: "Valor", placeholder: "8", width: "w-24" },
              { key: "unit", label: "Unidad", placeholder: "MP", width: "w-24" },
              { key: "label", label: "Qué es", placeholder: "Cámara de fotos" },
            ]}
          />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="En la caja">
          <div className="px-4 py-4">
            <ListEditor
              items={box}
              onChange={setBox}
              addLabel="Agregar"
              newItem={() => ({ item: "" })}
              fields={[{ key: "item", label: "Artículo", width: "w-full" }]}
            />
          </div>
        </Panel>
        <Panel title="SEO (Google)">
          <div className="space-y-4 px-4 py-4">
            <div>
              <Label htmlFor="seo_title">Título</Label>
              <Input id="seo_title" name="seo_title" defaultValue={product.seo_title ?? ""} maxLength={160} />
            </div>
            <div>
              <Label htmlFor="seo_description">Descripción</Label>
              <Textarea id="seo_description" name="seo_description" defaultValue={product.seo_description ?? ""} maxLength={320} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Preguntas frecuentes">
        <div className="px-4 py-4">
          <ListEditor
            items={faq}
            onChange={setFaq}
            addLabel="Agregar pregunta"
            newItem={() => ({ q: "", a: "" })}
            fields={[
              { key: "q", label: "Pregunta", width: "w-full" },
              { key: "a", label: "Respuesta", type: "textarea", width: "w-full" },
            ]}
          />
        </div>
      </Panel>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Button type="submit" disabled={pending}>
            {pending ? "Guardando…" : "Guardar producto"}
          </Button>
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
