import { Glasses } from "lucide-react";
import Image from "next/image";

const RATIO = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  wide: "aspect-video",
} as const;

/**
 * Foto recta con esquinas de 14 px. Sin foto real todavía, un espacio sobrio
 * (el brief prohíbe fotos de banco e imágenes generadas).
 */
export function Photo({
  src,
  alt,
  ratio = "square",
  sizes,
  preload,
  compact,
  className = "",
}: {
  src?: string | null;
  alt: string;
  ratio?: keyof typeof RATIO;
  sizes: string;
  preload?: boolean;
  /** Miniatura: solo el ícono, sin rótulo. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[14px] bg-cream-2 ${RATIO[ratio]} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} quality={75} preload={preload} className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div className="flex flex-col items-center gap-3 text-ink-soft">
            <Glasses className={compact ? "size-6" : "size-9"} strokeWidth={1.25} aria-hidden />
            {compact ? null : <span className="type-label text-[0.68rem]">Foto real muy pronto</span>}
          </div>
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
}
