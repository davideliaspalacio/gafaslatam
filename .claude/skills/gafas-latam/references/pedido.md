# La compra en la web (hoja de pedido, combo, pop-ups y píxeles)

## Cómo pide el cliente (celular primero)

- **Botón "Pedir"** en cualquier parte (`PedirButton` de `src/components/store/pedido-trigger.tsx`): dispara el evento `gl:pedido` y abre la **hoja inferior** (`src/components/store/pedido-sheet.tsx`, montada una vez en `src/app/(tienda)/layout.tsx`) sin cambiar de página. Sin JS, el mismo enlace lleva a `/pedido?modelo=…&cantidad=…`, que muestra el mismo formulario.
- **Hoja**: 92dvh en celular, diálogo en escritorio. Se cierra con X, fondo, deslizar, Esc y el botón atrás (pushState). El formulario y la lista de municipios se cargan aparte (import dinámico) para no pesar en cada página.
- **Formulario** (`src/components/store/order-form.tsx`): modelo (fijo con "Cambiar"), cantidad 1 o 2 en tarjetas, y campos en este orden: celular (tel, acepta +57), nombre y apellido, ciudad (`ciudad-input.tsx`: un campo con búsqueda sin tildes sobre los 1.103 municipios, llena el departamento; botones rápidos de 6 ciudades; alias "bogota dc", "bta", "cartagena"), dirección, barrio, y "apto, torre o referencia" (opcional, `complemento`). Borrador en sessionStorage (`gl_pedido_borrador`). Desde que llega del anuncio hasta "Pedir": unos 7 toques.
- **Envío**: `POST /api/pedido` con un `eventId` del navegador que sirve de llave de reintento: si la señal se cae y el cliente vuelve a tocar "Pedir", el servidor devuelve el mismo pedido en vez de crear otro (memoria de la instancia, 30 min). Tiempo límite de 25 s en el navegador y 15 s en cada llamada a Shopify.
- **Gracias** (`/pedido/gracias?n=1001`): "Falta un paso: confírmalo por WhatsApp", botón verde con el mensaje ya escrito y "SÍ CONFIRMO", botón "Copiar mensaje" de respaldo (el navegador de TikTok a veces no abre WhatsApp).

## Combo de 2 (la única promoción)

Vive en `src/lib/oferta.ts` (archivo liviano: va en el JS de todas las páginas). `COMBO_DOS = { biker: 259900, ia: null }`: 2 Biker por $259.900 (ahorra $39.900 con el precio actual); las gafas con IA no tienen combo. `totalPedido(slug, precio, cantidad)` es la única cuenta que usan la página, la hoja, la API, gracias, WhatsApp y los píxeles. Si se cambia el combo o el precio en Shopify, todo se recalcula.

En Shopify el combo va como una sola línea de 2 unidades a $129.950 (si el total no se reparte parejo, la última unidad lleva la diferencia), así Dropi cobra exacto el total. La nota del pedido dice "Promoción: combo de 2 por $259.900".

Dónde se ve: barra superior ("2 Biker por $259.900 · Envío gratis · Pagas al recibir"), tarjeta del combo en la página de la Biker, botón "Pedir el combo de 2", tarjeta "2 pares" en la hoja, sugerencia "¿Agregas otro par?" y el pop-up.

## Pop-up (aviso de promoción)

`src/components/store/promo-aviso.tsx`: tarjeta NO modal abajo (regla de Google contra intersticiales), solo en la portada y en páginas de modelos con combo. Sale al pasar ~45 % del scroll (producto) o ~50 % (portada), o a los 25 s en producto, o con intención de salida en escritorio. Nunca al entrar, nunca en /pedido, nunca si ya abrió la hoja en la sesión, nunca si lo cerró en los últimos 7 días; una vez por sesión. Se aparta (sin cerrarse) mientras se ve un botón de compra de la página. "Quiero el combo" abre la hoja con 2 pares.

## Píxeles (brief de Meta del 30/10/2026)

- ID de Meta: `NEXT_PUBLIC_META_PIXEL_ID=2398545494014405` (Vercel). TikTok: `NEXT_PUBLIC_TIKTOK_PIXEL_ID` cuando exista la cuenta. Si no están, se usa el de `/admin/ajustes`.
- `src/components/tracking/pixels.tsx`: código base + `<noscript>`, PageView en cada cambio de ruta (App Router).
- `content_ids` = ID de Dropi (`1875412` Biker, `2172927` IA), `currency: "COP"`, `value` numérico.
- ViewContent al ver un modelo · InitiateCheckout al tocar el primer campo (una vez por visita) · AddToCart al escoger 2 pares · Purchase (TikTok: PlaceAnOrder) en gracias, una vez por pedido, con `eventID` = número de pedido de Shopify · Contact en cualquier botón de WhatsApp.
- Conversions API (`src/lib/meta.ts`) manda el mismo Purchase desde `/api/pedido` con el mismo event_id, `_fbp`/`_fbc` y datos con hash. Token en `META_CAPI_TOKEN` (Vercel: producción, preview de `shopify-dropi` y desarrollo). El token se probó y Meta lo acepta.
- Verificación del dominio: poner el código de la etiqueta meta en `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` (lo lee `src/app/layout.tsx`).
- UTM: cookie `gl_attr` → atributos del pedido, línea "Anuncio: fuente · campaña · contenido" en la nota y etiqueta `utm-<fuente>`.
- No se manda Purchase por pedidos que llegan por WhatsApp (los maneja Jeronimo aparte).

## Fotos

`public/productos/` con las del proveedor ya editadas (sin microSD, sin textos en chino). Biker: `biker-1.jpg` (portada) y `biker-2.jpg` (en uso). La de IA es apaisada (`ia-1.jpg`) y la galería la muestra entera sobre blanco. Se listan en el campo `fotos` de cada modelo en `productos.ts`.
