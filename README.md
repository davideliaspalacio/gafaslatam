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
| `/` | Portada: toma en primera persona con REC, modelos, cómo comprar, preguntas |
| `/tienda` | Catálogo con filtros (con cámara, con audio, de sol) |
| `/gafas/[modelo]` | Página de cada modelo: fotos, video de lo que graba, color y botón "Pedir" |
| `/pedido` | Formulario contraentrega (llega con el modelo y el color elegidos) |
| `/pedido/[id]` | Confirmación + botón para confirmar por WhatsApp |
| `/envios-y-garantia`, `/nosotros` | Información de la tienda |
| `/politicas/terminos`, `/privacidad`, `/retracto` | Textos legales (revisarlos con un abogado) |
| `/pago/resultado`, `/api/webhooks/wompi` | Regreso y webhook de Wompi |
| `/admin` | Resumen: pedidos, ventas, visitas y conversión por campaña |
| `/admin/pedidos` | Lista, filtros, cambio rápido de estado, WhatsApp, exportar CSV |
| `/admin/productos` | Modelos: crear, precio, ofertas, colores, fotos, video, filtros, textos, SEO |
| `/admin/resenas` | Reseñas reales (solo aparecen en la tienda cuando publicas alguna) |
| `/admin/ajustes` | Nombre, WhatsApp, redes, video de portada, envío, pagos, píxeles, datos legales |

Marca: logos aprobados en `public/brand/`, toma de portada en `public/media/pov.jpg`, reglas de diseño en `DESIGN.md` y `PRODUCT.md`.

### Cómo se vende

1. El cliente llega de TikTok; guardamos `utm_*` y `ttclid` de la visita.
2. Abre el modelo, escoge color y toca "Pedir"; en `/pedido` pone cantidad (1 o 2 pares), nombre, celular, departamento, ciudad y dirección.
3. El servidor recalcula el precio desde la base de datos (nunca confía en el navegador), frena abusos por celular/IP y guarda el pedido con su campaña.
4. Contraentrega: va a la página de gracias. Online: va a Wompi y vuelve.
5. En el panel confirmas por WhatsApp con un clic (mensaje ya escrito), pones la guía y cambias el estado.

## Seguimiento de TikTok

- Pon los **IDs de los píxeles** de TikTok y Meta en `/admin/ajustes`. Eventos: ver producto (`ViewContent`), tocar "Pedir" (`InitiateCheckout`), enviar pedido (`PlaceAnOrder` en TikTok, `Purchase` en Meta) y tocar WhatsApp (`Contact`). Los mensajes de WhatsApp llevan la campaña de origen al final.
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

- [ ] **Fotos de estudio** de cada modelo y **videos reales** grabados con las gafas (portada y cada modelo; se suben desde el panel).
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
