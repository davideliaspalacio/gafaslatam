"use client";

import { readAttribution, trackContact } from "@/lib/pixel";
import { whatsappHref } from "@/lib/site";

/**
 * Enlace a WhatsApp que suma la campaña de origen al mensaje (para saber qué anuncio
 * trajo la conversación) y registra el evento Contact en los píxeles.
 */
export function WhatsAppLink({
  number,
  text,
  className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: {
  number: string;
  text: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
} & { [key: `data-${string}`]: string | boolean | undefined }) {
  const base = whatsappHref(number, text)!;
  return (
    <a
      href={base}
      target="_blank"
      rel="noopener"
      aria-label={ariaLabel}
      className={className}
      {...rest}
      onClick={(e) => {
        trackContact();
        const a = readAttribution();
        const ref = [a.utm_source, a.utm_campaign, a.utm_content].filter(Boolean).join(" · ");
        if (ref) e.currentTarget.href = whatsappHref(number, `${text}\n\n(Ref: ${ref})`)!;
      }}
    >
      {children}
    </a>
  );
}
