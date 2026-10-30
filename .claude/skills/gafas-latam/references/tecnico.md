# Detalles técnicos de Gafas Latam

## Stack

- Next.js 16 (App Router, `cacheComponents`, `"use cache"`). Antes de escribir código lee la guía que corresponda en `node_modules/next/dist/docs/` (lo pide AGENTS.md): params/searchParams/cookies van dentro de `<Suspense>`, `connection()` antes de usar fechas o la sesión.
- Tailwind 4, pnpm. Diseño en `DESIGN.md` y `PRODUCT.md`; para trabajo visual usa la skill `impeccable`.
- Vercel: proyecto `silisors-projects/gafaslatam`, dominio `www.gafaslatam.com`. Push a `main` = producción; push a otra rama = preview (protegido: usa `vercel curl <ruta> --deployment <url> -- <opciones de curl>`).
- Supabase (proyecto `awcyonxktrnkvbxrlkej`): solo ajustes de la tienda, reseñas y login del panel. Los productos y pedidos ya NO viven ahí. La migración `20261030022130_catalog_brand` no está aplicada en la nube (el CLI está logueado en otra cuenta); el código tolera que falte.

## Variables de entorno (solo Vercel y `.env.local`, nunca en el repo ni en el chat)

| Variable | Para qué |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `ewmtsc-cb.myshopify.com` |
| `SHOPIFY_CLIENT_ID` / `SHOPIFY_CLIENT_SECRET` | App "Pedidos web Gafas Latam" del Dev Dashboard. La web pide un token de 24 h con *client credentials* y lo renueva solo |
| `SHOPIFY_ADMIN_TOKEN` | Opcional. Si existe se usa en vez de pedir token |
| `META_CAPI_TOKEN` | Conversions API de Meta (apagada si falta) |
| `TIKTOK_EVENTS_ACCESS_TOKEN` | Events API de TikTok (apagada si falta) |
| `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SECRET_KEY` | Ajustes y panel |

La preview de Vercel tiene las variables de Shopify solo para la rama `shopify-dropi`. El CLI no deja crearlas "para todas las ramas" sin modo interactivo; usa `vercel env add NOMBRE preview <rama> --value ... --yes`. Una clave secreta la pega el dueño en una terminal (hay un script de ejemplo en el historial: lee con `read -rs` y llama `vercel env add`), nunca tú.

## Shopify (API 2026-10)

- Alcances de la app: `write_orders`, `read_products`, `write_customers`.
- `orderCreate` NO crea el cliente sin email: `clienteId()` lo busca por celular (`phone:+57...`) o lo crea con `customerCreate` y luego lo asocia con `toAssociate`.
- Departamentos: `provinceCode` con los códigos de Shopify (ANT, DC, VAC…) que están en `src/lib/ciudades.ts` (fuente: repo Shopify/worldwide `data/regions/CO.yml`).
- Teléfono en E.164 (`+573001234567`). Barrio en `address2`.
- Tienda de prueba o en trial: máximo 5 pedidos por minuto.
- Dropify cambió los SKU de los productos en Shopify al vincularlos (Biker "GAFAS BIKER CON CAMARA", IA "2172927"). No los cambies: Dropify los usa. En los píxeles se usan `GL-BIKER` y `GL-PRO` (campo `sku` de `productos.ts`).
- Para leer o cambiar pedidos desde un script: pide el token igual que `src/lib/shopify.ts` y usa `node --env-file=.env.local script.mjs`. Nunca imprimas el token.

## Píxeles

- Navegador: `src/components/tracking/pixels.tsx` carga TikTok y Meta si hay ID en `/admin/ajustes`. Eventos en `src/lib/pixel.ts`: ViewContent (página de modelo), InitiateCheckout (abrir el formulario), AddToCart (cambiar modelo/cantidad), PlaceAnOrder→Purchase (página de gracias, una vez por pedido: `localStorage gl_purchase_<n>`), Contact (cualquier botón de WhatsApp).
- Servidor: `/api/pedido` manda Purchase a Meta CAPI (`src/lib/meta.ts`) y PlaceAnOrder a TikTok (`src/lib/tiktok.ts`) con el mismo `event_id`, dentro de `after()`. Usan las cookies `_fbp`, `_fbc`, `_ttp` y los datos del cliente con hash.

## Verificar cambios

- `pnpm exec next typegen && pnpm exec tsc --noEmit -p . && pnpm exec eslint src`.
- Servidor local: preview "tienda" (`.claude/launch.json`, puerto 3000). Revisa a 390×844.
- No envíes el formulario ni llames `POST /api/pedido` sin necesidad: crea pedidos reales en Shopify. Si lo haces para probar, márcalo "PEDIDO DE PRUEBA, NO DESPACHAR" en el barrio y cancélalo (ver `operacion.md`).
