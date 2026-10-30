"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { IconButton } from "@/components/admin/list-editor";
import { Input } from "@/components/admin/ui";
import { browserClient } from "@/lib/supabase/browser";

type Img = { url: string } & Record<string, unknown>;

type Extra<T> = { key: keyof T & string; label: string; type?: "text" | "checkbox"; placeholder?: string };

/** Fotos con subida a Supabase Storage (bucket product-images). */
export function ImageListEditor<T extends Img>({
  items,
  onChange,
  extras,
  newItem,
  folder,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  extras: Extra<T>[];
  newItem: (url: string) => T;
  folder: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const supabase = browserClient();
    const added: T[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 8 * 1024 * 1024) {
        setError(`${file.name} pesa más de 8 MB.`);
        continue;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (upErr) {
        setError("No se pudo subir la imagen. ¿Sigues con la sesión abierta?");
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      added.push(newItem(data.publicUrl));
    }
    onChange([...items, ...added]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

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
        <div key={item.url + i} className="flex gap-3 border border-ink/10 bg-cream/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt="" className="size-20 shrink-0 bg-ink/5 object-cover" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {extras.map((x) =>
              x.type === "checkbox" ? (
                <label key={x.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={Boolean(item[x.key])} onChange={(e) => update(i, x.key, e.target.checked)} />
                  {x.label}
                </label>
              ) : (
                <Input
                  key={x.key}
                  aria-label={x.label}
                  placeholder={x.placeholder ?? x.label}
                  value={String(item[x.key] ?? "")}
                  onChange={(e) => update(i, x.key, e.target.value)}
                />
              ),
            )}
            <p className="truncate text-xs text-ink-soft">{i === 0 ? "Principal · " : ""}{item.url}</p>
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
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="sr-only"
          id={`upload-${folder}`}
          onChange={(e) => upload(e.target.files)}
        />
        <label
          htmlFor={`upload-${folder}`}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-[3px] border border-ink/20 bg-paper px-4 text-sm font-semibold hover:border-ink/40"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {uploading ? "Subiendo…" : "Subir fotos"}
        </label>
        <span className="text-xs text-ink-soft">JPG, PNG o WebP hasta 8 MB. La primera es la principal.</span>
      </div>
      {error ? <p className="text-sm text-alert">{error}</p> : null}
    </div>
  );
}
