"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { captureAttribution, newEventId } from "@/lib/pixel";

// Píxeles de Meta y TikTok. El ID sale de las variables de Vercel (NEXT_PUBLIC_META_PIXEL_ID,
// NEXT_PUBLIC_TIKTOK_PIXEL_ID); si no están, del que esté guardado en /admin/ajustes.
const META_ENV = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const TIKTOK_ENV = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim();

/** Carga los píxeles, registra la visita una vez por sesión y manda PageView en cada cambio de página. */
export function Pixels({ tiktokPixelId, metaPixelId }: { tiktokPixelId: string | null; metaPixelId: string | null }) {
  const metaRaw = META_ENV || metaPixelId;
  const tiktokRaw = TIKTOK_ENV || tiktokPixelId;
  const meta = metaRaw && /^\d+$/.test(metaRaw) ? metaRaw : null;
  const tiktok = tiktokRaw && /^[A-Z0-9]+$/i.test(tiktokRaw) ? tiktokRaw : null;

  useEffect(() => {
    const attr = captureAttribution();
    try {
      if (sessionStorage.getItem("gl_visit")) return;
      const sessionId = newEventId();
      sessionStorage.setItem("gl_visit", sessionId);
      const body = JSON.stringify({
        session_id: sessionId,
        utm_source: attr.utm_source,
        utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign,
        utm_content: attr.utm_content,
        ttclid: attr.ttclid,
        landing_page: attr.landing_page,
        referrer: attr.referrer,
      });
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <>
      {tiktok ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load("${tiktok}");ttq.page();}(window,document,"ttq");`}
        </Script>
      ) : null}
      {meta ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${meta}");fbq("track","PageView");`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- píxel de 1x1 sin JavaScript, como lo pide Meta */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${meta}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      ) : null}
      {meta || tiktok ? (
        <Suspense fallback={null}>
          <PageViews />
        </Suspense>
      ) : null}
    </>
  );
}

/** En el App Router cambiar de página no recarga: se manda PageView a mano (la primera la manda el código base). */
function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      window.fbq?.("track", "PageView");
    } catch {}
    try {
      window.ttq?.page?.();
    } catch {}
  }, [pathname, search]);
  return null;
}
