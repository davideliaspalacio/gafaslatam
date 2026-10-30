"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Input } from "@/components/admin/ui";
import { browserClient } from "@/lib/supabase/browser";

/** Un archivo (imagen o video corto) subido a Storage; el formulario recibe su URL. */
export function MediaField({
  name,
  label,
  defaultValue,
  kind,
  folder,
  hint,
}: {
  name: string;
  label: string;
  defaultValue: string | null;
  kind: "image" | "video";
  folder: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const accept = kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/avif";
  const maxMb = kind === "video" ? 15 : 8;

  async function upload(file: File | undefined) {
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) {
      setError(`El archivo pesa más de ${maxMb} MB.`);
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = browserClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "video" ? "mp4" : "jpg");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "31536000", contentType: file.type });
    if (upErr) setError("No se pudo subir. ¿Sigues con la sesión abierta?");
    else setUrl(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.8rem] font-semibold text-ink-soft">
        {label}
      </label>
      <div className="flex gap-3">
        {url ? (
          kind === "video" ? (
            <video src={url} muted playsInline className="h-20 w-32 shrink-0 rounded-[6px] bg-ink/5 object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-20 w-32 shrink-0 rounded-[6px] bg-ink/5 object-cover" />
          )
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input id={id} name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap items-center gap-3">
            <input ref={fileRef} type="file" accept={accept} className="sr-only" id={`${id}-file`} onChange={(e) => upload(e.target.files?.[0])} />
            <label
              htmlFor={`${id}-file`}
              className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-[3px] border border-ink/20 bg-paper px-3 text-sm font-semibold hover:border-ink/40"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {busy ? "Subiendo…" : kind === "video" ? "Subir video" : "Subir imagen"}
            </label>
            {url ? (
              <button type="button" onClick={() => setUrl("")} className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
                <X className="size-4" /> Quitar
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
      {error ? <p className="mt-1 text-sm text-alert">{error}</p> : null}
    </div>
  );
}
