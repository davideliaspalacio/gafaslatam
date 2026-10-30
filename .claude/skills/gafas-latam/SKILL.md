---
name: gafas-latam
description: Contexto completo de la tienda Gafas Latam (www.gafaslatam.com) y de su flujo de venta contraentrega — web Next.js → /api/pedido → Shopify → Dropify → Dropi, confirmación "SÍ CONFIRMO" por WhatsApp, píxeles de Meta y TikTok, UTM, promociones, fotos y reglas del negocio. Úsala SIEMPRE que se toque cualquier cosa de esta tienda: páginas, textos, precios, productos, el formulario de pedido, pop-ups, Shopify, Dropify, Dropi, pedidos de prueba, píxeles, variables de Vercel o el panel /admin, aunque el pedido no nombre la skill. También cuando pregunten "cómo funciona", "qué falta", "dónde se cambia" algo de Gafas Latam o cuando haya que explicarle el flujo a Jeronimo.
---

# Gafas Latam: cómo funciona la tienda

Tienda en español para Colombia que vende 2 modelos de gafas con cámara por **contraentrega** (pago al recibir, envío gratis). El tráfico llega casi todo desde **celular**, por anuncios de TikTok y Meta, directo a la página de cada modelo. Por eso cada cambio se piensa primero a 390 px de ancho y con la menor cantidad de toques posible.

El dueño habla español y no es técnico. Jeronimo es su socio y opera los pedidos. Responde siempre en español sencillo.

## El flujo de una venta

1. **El cliente entra** a `/gafas/biker` o `/gafas/ia` (desde el anuncio) o a la home `/`. La cookie `gl_attr` guarda las UTM, `ttclid` y `fbclid` (`src/lib/pixel.ts`, `src/lib/atribucion.ts`).
2. **Pide en la misma página**: formulario contraentrega (modelo, cantidad, nombre, celular de 10 dígitos que empieza por 3, ciudad/departamento, dirección, barrio). Ver `references/pedido.md`.
3. **`POST /api/pedido`** (`src/app/api/pedido/route.ts`) valida, toma el precio EN VIVO de Shopify y crea el pedido con `orderCreate` (`src/lib/shopify.ts`):
   - pago pendiente con pasarela "Contraentrega", envío gratis $0;
   - etiquetas `web` y `por-confirmar`;
   - UTM y `event_id` en atributos adicionales; la nota dice el barrio y el total a cobrar.
4. **Página de gracias** `/pedido/gracias?n=1001`: número de pedido + botón verde de WhatsApp con el mensaje ya escrito y "SÍ CONFIRMO" al final. Aquí se manda la compra a los píxeles UNA vez (Purchase en Meta, PlaceAnOrder en TikTok) con el mismo `event_id` que usa el servidor.
5. **Jeronimo confirma**: cuando el cliente responde "SÍ CONFIRMO", en Shopify cambia la etiqueta a `confirmado` y toca **Más acciones → Enviar a Dropi**. Si no confirma: etiqueta `cancelado` y cancelar el pedido.
6. **Dropi** recibe el pedido "Pendiente confirmación", con recaudo, y lo despacha la bodega del proveedor. Dropify le pone al pedido de Shopify la etiqueta `Order sent to dropi`.

**Regla de oro: ningún pedido va a Dropi sin el "SÍ CONFIRMO" del cliente.** Por eso la sincronización automática de Dropify está APAGADA (Dropify → Configuración General). No la prendas.

## Los dos modelos

| | Biker | Con cámara e IA |
|---|---|---|
| Ruta | `/gafas/biker` | `/gafas/ia` |
| Colección | Deporte | Diario · con IA |
| Precio (vive en Shopify) | $149.900 | $449.900 |
| Costo Dropi | $60.000 (ID 1875412) | $308.000 (ID 2172927) |
| Shopify | Product 15459905929367 | Product 15459906617495 |
| Qué es | Bici, moto, trote. Video 1080p 30 fps, pasa videos por Wi-Fi a la app. Sin audio ni Bluetooth. microSD NO incluida | Día a día. IA, música, llamadas y asistente de voz. Ficha técnica SIN confirmar |

Los textos de cada modelo están en `src/lib/productos.ts`. El precio NO se cambia en el código: se cambia en Shopify y la web lo toma en pocos minutos (`getModelos()` en `src/lib/catalog.ts`, `cacheLife("minutes")`). `precioRespaldo` solo se usa si Shopify no responde.

## Reglas del negocio (no negociables)

- Nunca decir "oculta", "espía" ni "secreta".
- Nada falso: sin contadores de tiempo inventados, stock falso, "X personas viendo", reseñas inventadas ni precios tachados que no existieron. Las promociones tienen que ser reales y estar en el pedido.
- A la Biker nunca se le dice "IA" ni "inteligentes".
- De las gafas con IA no se publica ningún dato técnico hasta que el dueño lo confirme con el proveedor.
- La microSD de la Biker no viene incluida, y la página lo dice. Las fotos del proveedor que mostraban una tarjeta se editaron para quitarla.

Si una idea de venta choca con estas reglas, propón la versión honesta en vez de saltarte la regla.

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Precio, stock, fotos en Shopify | Shopify → Productos |
| Textos, características, ficha, preguntas de cada modelo | `src/lib/productos.ts` |
| Fotos que se ven en la web | `public/productos/*.jpg` + campo `fotos` del modelo en `productos.ts` |
| WhatsApp, IDs de píxeles, textos legales, anuncio superior | `/admin/ajustes` (Supabase, tabla `store_settings`) |
| Lista de ciudades y códigos de departamento de Shopify | `src/lib/ciudades.ts` |
| Pedidos | Shopify → Pedidos (el `/admin/pedidos` viejo solo tiene los anteriores) |
| Vinculación producto ↔ Dropi | Dropify → Información sincronizada |

Para detalles técnicos (variables de entorno, API de Shopify, píxeles, pruebas) lee `references/tecnico.md`. Para la operación diaria y cómo hacer un pedido de prueba sin despachar nada, lee `references/operacion.md`.
