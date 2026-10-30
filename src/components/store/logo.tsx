import Image from "next/image";

// Archivos aprobados del brief: no se redibujan, estiran ni recolorean.
const FILES = {
  "horizontal-crema": { src: "/brand/logo-horizontal-crema.png", w: 900, h: 140 },
  "horizontal-azul": { src: "/brand/logo-horizontal-azul.png", w: 900, h: 140 },
  "lema-crema": { src: "/brand/logo-lema-crema.png", w: 640, h: 458 },
  "lema-azul": { src: "/brand/logo-lema-azul.png", w: 640, h: 458 },
} as const;

export function Logo({
  variant,
  height,
  priority,
  className = "",
}: {
  variant: keyof typeof FILES;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const f = FILES[variant];
  const width = Math.round((f.w / f.h) * height);
  return (
    <Image
      src={f.src}
      alt={variant.startsWith("lema") ? "Gafas Latam · Graba lo que vives" : "Gafas Latam"}
      width={width}
      height={height}
      preload={priority}
      className={className}
      style={{ width, height }}
    />
  );
}
