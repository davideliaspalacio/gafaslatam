# gafasLatam — tienda de gafas inteligentes

Tienda de un solo producto pensada para tráfico de TikTok en Colombia: pago contraentrega por defecto, pago online opcional con Wompi y un panel simple para gestionar pedidos.

- **Next.js 16** (App Router, Cache Components) + Tailwind 4
- **Supabase** local en Docker: Postgres, Auth (login del panel) y Storage (fotos)
- Diseño hecho con la skill **Impeccable** (dirección "Rollo de revelado": cartón de cámara desechable, copias fotográficas, fecha estampada naranja). Contexto en `PRODUCT.md` y `.impeccable/`.

## Arrancar en local

Requisitos: Node 22+, pnpm, Docker Desktop y la CLI de Supabase.

```bash
pnpm install
supabase start          # levanta Postgres/Auth/Storage en Docker (puertos 5632x)
pnpm db:reset           # crea tablas, seguridad (RLS) y el producto de ejemplo
cp .env.example .env.local   # y pega las llaves que imprime `supabase status`
pnpm admin:create       # crea el usuario del panel con ADMIN_EMAIL / ADMIN_PASSWORD de .env.local
pnpm dev
```

- Tienda: http://localhost:3000
- Panel: http://localhost:3000/admin (usuario y contraseña en `.env.local`)
- Supabase Studio: http://127.0.0.1:56323

> Los puertos de Supabase están en 5632x (no los 5432x por defecto) para no chocar con otros proyectos locales.

## Qué hay

| Ruta | Para qué |
| --- | --- |
| `/` | Landing del producto destacado con el "sobre de pedido" (formulario de compra) |
| `/producto/[slug]` | Misma página para cada producto activo |
| `/pedido/[id]` | Confirmación del pedido + botón para confirmar por WhatsApp |
| `/pago/resultado` | Regreso desde Wompi (verifica la transacción con Wompi) |
| `/api/webhooks/wompi` | Webhook de Wompi (firma verificada) |
| `/politicas/*` | Envíos, cambios/retracto/garantía, datos personales, términos |
| `/admin` | Resumen: pedidos, ventas, visitas y conversión por campaña |
| `/admin/pedidos` | Lista, filtros, cambio rápido de estado, WhatsApp, exportar CSV |
| `/admin/productos` | Precio, ofertas por cantidad, colores, fotos (sube a Storage), textos, SEO |
| `/admin/resenas` | Reseñas reales (solo aparecen en la tienda cuando publicas alguna) |
| `/admin/ajustes` | Nombre, WhatsApp, envío, formas de pago, píxeles, datos legales |

### Cómo se vende

1. El cliente llega de TikTok; guardamos `utm_*` y `ttclid` de la visita.
2. Llena el sobre: cantidad (1 o 2 pares), color, nombre, celular, departamento, ciudad, dirección.
3. El servidor recalcula el precio desde la base de datos (nunca confía en el navegador), frena abusos por celular/IP y guarda el pedido con su campaña.
4. Contraentrega: va a la página de gracias. Online: va a Wompi y vuelve.
5. En el panel confirmas por WhatsApp con un clic (mensaje ya escrito), pones la guía y cambias el estado.

## Seguimiento de TikTok

- Pon el **ID del píxel** en `/admin/ajustes`. Eventos: `ViewContent`, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo`, `CompletePayment`.
- Para la **API de eventos** (servidor, más precisa con iOS y bloqueadores) agrega `TIKTOK_EVENTS_ACCESS_TOKEN` en `.env.local`. Navegador y servidor comparten `event_id`, así TikTok no cuenta doble.
- En los anuncios usa enlaces con UTM, por ejemplo:
  `https://tudominio.com/?utm_source=tiktok&utm_campaign=lanzamiento&utm_content=video-moto`
  El panel muestra visitas, pedidos y conversión por campaña.

## Pago online (Wompi)

1. Crea la cuenta en https://comercios.wompi.co y copia las llaves de **Sandbox**.
2. En `.env.local`: `NEXT_PUBLIC_WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET`.
3. En el panel de Wompi, URL de eventos: `https://TU-DOMINIO/api/webhooks/wompi`.
4. Activa "Pago online con Wompi" en `/admin/ajustes`. Para producción cambia a las llaves de producción y `WOMPI_ENV=production`.

## Antes de pautar (lista de pendientes)

- [ ] **Nombre de marca y logo** reales (ajustes + producto).
- [ ] **Fotos reales** del producto y **capturas reales grabadas con las gafas** (reemplazan las de Unsplash; desmarca "imagen de referencia").
- [ ] **Precio, especificaciones y contenido de la caja** confirmados con el proveedor (las de ejemplo son provisionales).
- [ ] **WhatsApp** de la tienda, **tiempo de envío** y **costo de envío** reales.
- [ ] **Datos legales** (razón social, NIT, dirección) y revisión de `/politicas/*` con tu contador o abogado.
- [ ] No usar las marcas Meta ni Ray-Ban en textos, anuncios ni SEO.
- [ ] Píxel de TikTok + token de la API de eventos.

## Modo demo (sin Supabase)

Si el despliegue no tiene las variables de Supabase, la tienda corre en **modo demo**: muestra el producto de ejemplo (`src/lib/demo-data.ts`), el formulario funciona pero **el pedido no se guarda** (la página de gracias lo avisa) y el panel muestra cómo activarlo. Sirve para ver la web publicada; **no pautes en este modo**. Al agregar las variables y volver a desplegar, todo pasa a real.

## Publicar

- **Base de datos:** crea un proyecto en supabase.com y corre `supabase link` + `supabase db push`. Crea el admin con `pnpm admin:create` apuntando a las llaves de producción. Desactiva el registro público en Auth (ya viene así en `supabase/config.toml` para local).
- **Web:** despliega en Vercel con las variables de `.env.example` (URL y llaves de Supabase producción, `NEXT_PUBLIC_SITE_URL` con tu dominio). Agrega el host de Storage de Supabase a `images.remotePatterns` si cambia.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm db:reset` | Recrea la base local con migraciones y datos de ejemplo (borra pedidos locales) |
| `pnpm db:types` | Regenera `src/lib/database.types.ts` |
| `pnpm admin:create` | Crea o actualiza el usuario del panel |
| `pnpm typecheck` | Revisión de tipos |
