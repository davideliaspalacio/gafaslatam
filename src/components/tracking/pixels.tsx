"use client";

import Script from "next/script";
import { useEffect } from "react";
import { captureAttribution, newEventId } from "@/lib/pixel";

/** Carga los píxeles configurados en /admin/ajustes y registra la visita una vez por sesión. */
export function Pixels({ tiktokPixelId, metaPixelId }: { tiktokPixelId: string | null; metaPixelId: string | null }) {
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

  const tiktok = tiktokPixelId && /^[A-Z0-9]+$/i.test(tiktokPixelId) ? tiktokPixelId : null;
  const meta = metaPixelId && /^\d+$/.test(metaPixelId) ? metaPixelId : null;

  return (
    <>
      {tiktok ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load("${tiktok}");ttq.page();}(window,document,"ttq");`}
        </Script>
      ) : null}
      {meta ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${meta}");fbq("track","PageView");`}
        </Script>
      ) : null}
    </>
  );
}
