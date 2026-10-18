import Image from "next/image";
import { DateStamp } from "@/components/store/date-stamp";

type PrintProps = {
  src: string;
  alt: string;
  stamp?: string | null;
  ratio?: "portrait" | "landscape" | "square";
  tilt?: number;
  sizes: string;
  preload?: boolean;
  objectPosition?: string;
  /** Imagen de muestra (no del producto real): se rotula en el margen de la copia. */
  reference?: boolean;
  className?: string;
};

const RATIO = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[5/4]",
  square: "aspect-square",
} as const;

/** Copia fotográfica: papel blanco con borde y, si la hay, la fecha estampada. */
export function Print({
  src,
  alt,
  stamp,
  ratio = "portrait",
  tilt = 0,
  sizes,
  preload,
  objectPosition,
  reference,
  className = "",
}: PrintProps) {
  return (
    <figure className={`print develop ${className}`} style={tilt ? { rotate: `${tilt}deg` } : undefined}>
      <div className={`relative overflow-hidden bg-carton-night ${RATIO[ratio]}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={75}
          preload={preload}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
        {stamp ? <DateStamp value={stamp} className="absolute bottom-[6%] right-[6%] h-[7%] min-h-3" /> : null}
      </div>
      {reference ? (
        <figcaption className="type-spec -mb-1 pt-1.5 text-[0.62rem] leading-none text-ink-soft">
          Foto de referencia
        </figcaption>
      ) : null}
    </figure>
  );
}
