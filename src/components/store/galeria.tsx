"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/store/photo";

type Imagen = { url: string; alt: string; ancho?: number; alto?: number };

const SIZES = "(min-width: 1152px) 560px, (min-width: 768px) 52vw, 100vw";

/**
 * Galería del modelo: en el celular se desliza con el dedo (scroll-snap) y muestra "1/3" y puntos;
 * en escritorio suma miniaturas. Marco cuadrado fijo (sin saltos al cargar) y fotos enteras sobre
 * blanco: las apaisadas no se recortan. La primera foto se precarga.
 */
export function Galeria({ imagenes, nombre }: { imagenes: Imagen[]; nombre: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [activa, setActiva] = useState(0);
  const total = imagenes.length;

  useEffect(() => {
    const el = track.current;
    if (!el || total < 2) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setActiva(Math.min(total - 1, Math.max(0, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [total]);

  function ir(i: number) {
    const el = track.current;
    if (!el) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: quieto ? "auto" : "smooth" });
  }

  if (!total) return <Photo alt={nombre} sizes={SIZES} />;

  return (
    <div>
      <div className="relative">
        <ul
          ref={track}
          tabIndex={total > 1 ? 0 : undefined}
          aria-label={`Fotos de ${nombre}`}
          // El radio va en línea para que el contorno de foco global no lo cambie.
          style={{ borderRadius: 14 }}
          className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-white"
        >
          {imagenes.map((img, i) => (
            <li key={img.url} className="relative h-full w-full shrink-0 snap-center snap-always">
              <Image
                src={img.url}
                alt={img.alt || nombre}
                fill
                sizes={SIZES}
                quality={75}
                preload={i === 0}
                draggable={false}
                className="object-contain select-none"
              />
            </li>
          ))}
        </ul>

        {total > 1 ? (
          <p
            aria-live="polite"
            className="tabular pointer-events-none absolute right-3 bottom-3 rounded-full bg-deep/70 px-2.5 py-1 text-[0.75rem] font-semibold text-cream"
          >
            <span className="sr-only">Foto </span>
            {activa + 1}
            <span aria-hidden>/</span>
            <span className="sr-only"> de </span>
            {total}
          </p>
        ) : null}
      </div>

      {total > 1 ? (
        <>
          {/* Puntos: solo indican; en el celular se pasa con el dedo */}
          <div aria-hidden className="mt-3 flex justify-center gap-1.5 md:hidden">
            {imagenes.map((img, i) => (
              <span
                key={img.url}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  i === activa ? "w-4 bg-night" : "w-1.5 bg-night/25"
                }`}
              />
            ))}
          </div>

          {/* Miniaturas en escritorio */}
          <ul className="mt-3 hidden grid-cols-4 gap-3 md:grid">
            {imagenes.map((img, i) => (
              <li key={img.url}>
                <button
                  type="button"
                  onClick={() => ir(i)}
                  aria-label={`Ver foto ${i + 1} de ${total}`}
                  aria-current={i === activa ? "true" : undefined}
                  className={`block w-full cursor-pointer rounded-[14px] ring-offset-2 ring-offset-cream transition-shadow duration-200 ${
                    i === activa ? "ring-2 ring-night" : "ring-1 ring-line hover:ring-ink-soft"
                  }`}
                >
                  <Photo src={img.url} alt="" sizes="120px" fit="contain" compact />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
