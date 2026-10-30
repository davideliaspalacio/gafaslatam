"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Input, Textarea } from "@/components/admin/ui";

export type FieldDef<T> = {
  key: keyof T & string;
  label: string;
  type?: "text" | "number" | "textarea" | "color" | "checkbox";
  placeholder?: string;
  width?: string; // clase de ancho en la fila
};

/** Editor de listas para los campos JSON del producto (ofertas, colores, preguntas…). */
export function ListEditor<T extends Record<string, unknown>>({
  items,
  onChange,
  fields,
  newItem,
  addLabel,
  max = 20,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef<T>[];
  newItem: () => T;
  addLabel: string;
  max?: number;
}) {
  const update = (i: number, key: string, value: unknown) =>
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 border border-ink/10 bg-cream/50 p-3">
          <div className="flex flex-1 flex-wrap gap-3">
            {fields.map((f) => {
              const value = item[f.key];
              const id = `${f.key}-${i}`;
              return (
                <div key={f.key} className={f.width ?? "min-w-40 flex-1"}>
                  {f.type === "checkbox" ? (
                    <label htmlFor={id} className="flex h-full items-center gap-2 pt-5 text-sm">
                      <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => update(i, f.key, e.target.checked)} />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink-soft">
                        {f.label}
                      </label>
                      {f.type === "textarea" ? (
                        <Textarea
                          id={id}
                          value={String(value ?? "")}
                          placeholder={f.placeholder}
                          onChange={(e) => update(i, f.key, e.target.value)}
                          className="min-h-20"
                        />
                      ) : f.type === "color" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            aria-label={f.label}
                            value={String(value || "#000000")}
                            onChange={(e) => update(i, f.key, e.target.value)}
                            className="size-10 shrink-0 cursor-pointer rounded-[3px] border border-ink/20"
                          />
                          <Input id={id} value={String(value ?? "")} onChange={(e) => update(i, f.key, e.target.value)} />
                        </div>
                      ) : (
                        <Input
                          id={id}
                          type={f.type === "number" ? "number" : "text"}
                          inputMode={f.type === "number" ? "numeric" : undefined}
                          value={value === null || value === undefined ? "" : String(value)}
                          placeholder={f.placeholder}
                          onChange={(e) =>
                            update(i, f.key, f.type === "number" ? (e.target.value === "" ? 0 : Number(e.target.value)) : e.target.value)
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <IconButton label="Subir" onClick={() => move(i, -1)} disabled={i === 0}>
              <ArrowUp className="size-4" />
            </IconButton>
            <IconButton label="Bajar" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
              <ArrowDown className="size-4" />
            </IconButton>
            <IconButton label="Quitar" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="size-4 text-alert" />
            </IconButton>
          </div>
        </div>
      ))}
      {items.length < max ? (
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-night hover:underline"
        >
          <Plus className="size-4" /> {addLabel}
        </button>
      ) : null}
    </div>
  );
}

export function IconButton({
  label,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-[3px] text-ink-soft hover:bg-ink/5 disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  );
}
