# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, Storage) corriendo en Docker local con la CLI de Supabase. Elegido porque renderiza en servidor (SEO y carga rápida en el navegador interno de TikTok), se despliega en Vercel sin cambios y Supabase cubre datos, login del panel e imágenes sin otro proveedor.

## Users

- **Comprador (principal):** persona en Colombia, típicamente 18–40 años, que ve un video en TikTok mientras hace scroll en el celular, toca el enlace y aterriza en el navegador interno de TikTok, a menudo con datos móviles. Llega con curiosidad y desconfianza a partes iguales: ha visto tiendas de dropshipping que no entregan. Su trabajo: entender en segundos qué hacen las gafas, cuánto cuestan, si es seguro pedirlas, y pedirlas sin crear cuenta.
- **Operador de la tienda (secundario):** el equipo que vende. Revisa pedidos nuevos, los confirma por WhatsApp, los despacha con la transportadora y marca su estado. Trabaja desde el celular o el portátil, varias veces al día.

## Product Purpose

Tienda de una sola línea de producto: gafas inteligentes con cámara, audio abierto y micrófono, del estilo de las gafas de las grandes marcas pero de otra marca importada desde China, a un precio mucho menor. El éxito es convertir el tráfico de TikTok en pedidos confirmados y entregados (no solo pedidos creados: en contraentrega, el pedido que no se confirma o se devuelve es pérdida).

## Positioning

Las mismas funciones que la gente ya vio en las gafas con cámara de las marcas grandes (foto/video en primera persona, música y llamadas sin audífonos) por una fracción del precio, con pago contraentrega en Colombia para quitar el riesgo de comprarle a una tienda nueva.

## Operating Context

- Tráfico casi 100% móvil desde anuncios y videos orgánicos de TikTok; se abre en el webview de TikTok.
- Dos formas de pago: **contraentrega** (por defecto) y **pago online** (pasarela colombiana: Wompi — tarjeta, PSE, Nequi, Bancolombia).
- Los pedidos contraentrega se confirman por WhatsApp antes de despachar.
- Envío nacional por transportadora (operador logístico tipo Dropi). Tiempos y costo de envío: **por confirmar**.
- Dirección colombiana: departamento, ciudad/municipio, dirección, barrio/indicaciones.
- Moneda COP, sin decimales.

## Capabilities and Constraints

- Panel de administración simple: pedidos (ver, cambiar estado, exportar), producto (precio, fotos, ofertas por cantidad, stock), ajustes de tienda (nombre, WhatsApp, píxeles).
- Seguimiento de campañas: Píxel de TikTok (y opcional Meta), UTMs y `ttclid` guardados en cada pedido.
- **No usar las marcas Meta ni Ray-Ban** en textos, nombres de producto ni SEO (riesgo legal y de rechazo de anuncios). Se puede describir la categoría ("gafas inteligentes con cámara").
- Especificaciones técnicas (cámara, batería, resistencia al agua, conectividad): **por confirmar con el proveedor**; las del contenido inicial son provisionales.
- Garantía, política de devoluciones y tiempos de entrega: **por confirmar**; el contenido inicial los marca como editables.

## Brand Commitments

- Nombre de la tienda: **gafasLatam** (así, con la L mayúscula). Confirmado por el equipo.
- Sin logo todavía; el nombre se compone en la rotulación de la tienda.
- El nombre del producto ("gafasLatam Uno") es provisional hasta conocer el modelo real.

## Evidence on Hand

Nada aún: sin logo, sin fotos ni videos propios, sin reseñas, sin cifras de ventas. Lo que no existe no se inventa: no hay reseñas falsas, contadores de ventas, "personas viendo esto", cuentas regresivas falsas ni stock inventado. Las imágenes iniciales son marcadores de posición para reemplazar desde el panel; las reseñas solo aparecen cuando el equipo carga reseñas reales.

## Product Principles

1. **Una decisión, no un catálogo.** Cada pantalla empuja hacia pedir este producto; nada distrae.
2. **Confianza antes que urgencia.** Contraentrega, contacto por WhatsApp y políticas claras convencen más que la presión falsa.
3. **La velocidad es conversión.** Se carga rápido en un celular con datos y dentro del navegador de TikTok.
4. **Pedir en menos de un minuto.** Sin cuenta, con los campos mínimos que la transportadora necesita.
5. **Todo editable sin programar.** Precios, fotos, textos y ofertas cambian desde el panel.

## Accessibility & Inclusion

Contraste legible a pleno sol en celular; objetivos táctiles grandes; formulario usable con teclado numérico para teléfono; textos en español de Colombia.
