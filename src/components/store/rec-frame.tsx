"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Lo que ves, grabado: la toma en primera persona con el punto REC y el contador
 * de tiempo, como en la pantalla de la cámara. Si hay video de portada, lo reproduce
 * sin sonido y en bucle; si no, muestra la imagen.
 */
export function RecFrame({
  videoUrl,
  posterUrl,
  alt,
  className = "",
}: {
  videoUrl?: string | null;
  posterUrl: string;
  alt: string;
  className?: string;
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setSeconds((s) => (s + 1) % 3600), 1000);
    return () => window.clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className={`relative aspect-video overflow-hidden rounded-[14px] bg-deep ${className}`}>
      {videoUrl ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      ) : (
        <Image src={posterUrl} alt={alt} fill preload sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
      )}

      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between" aria-hidden>
        <span className="type-label inline-flex items-center gap-2 rounded-full bg-deep/70 px-2.5 py-1 text-[0.68rem] text-cream">
          <span className="rec-dot size-2 rounded-full bg-amber" />
          REC
        </span>
        <span className="tabular rounded-full bg-deep/70 px-2.5 py-1 text-[0.72rem] font-semibold text-cream">
          00:{mm}:{ss}
        </span>
      </div>
    </div>
  );
}
