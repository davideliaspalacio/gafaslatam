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

Tienda de gafas inteligentes (con cámara, con audio y de sol), importadas desde China, del estilo de las gafas de las grandes marcas a un precio mucho menor. Empieza con un modelo y crece a un catálogo de varios modelos. El éxito es convertir el tráfico de TikTok en pedidos confirmados y entregados (no solo pedidos creados: en contraentrega, el pedido que no se confirma o se devuelve es pérdida).

## Positioning

Las mismas funciones que la gente ya vio en las gafas con cámara de las marcas grandes (foto/video en primera persona, música y llamadas sin audífonos) por una fracción del precio, con pago contraentrega en Colombia para quitar el riesgo de comprarle a una tienda nueva.

## Operating Context

- Tráfico casi 100% móvil desde anuncios y videos orgánicos de Instagram, Facebook y TikTok; se abre en el navegador interno de cada app.
- Dominio: www.gafaslatam.com (gafaslatam.com y gafaslatam.vercel.app redirigen allí).
- Contacto: WhatsApp +57 300 756 8489, gafaslatam@gmail.com, @gafaslatam en Instagram y TikTok, facebook.com/gafaslatam.
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

Fuente: brief de marca del equipo (artifact de Claude, octubre 2026), confirmado por el usuario.

- Nombre: **Gafas Latam**, escrito como en el logo. Lema: "Graba lo que vives".
- Logo: solo los archivos aprobados (`public/brand/`: horizontal crema/azul y con lema crema/azul). No se redibuja, estira ni recolorea. Favicon con las gafas del logo.
- Paleta "Océano": azul noche `#101E40`, azul hondo `#0A1430`, azul medio `#23365F`, crema `#F5F1E8`, crema 2 `#EAE3D4`, ámbar `#FFB547` (hover `#E89A2B`), texto suave `#4A5470`, línea `#DCD4C3`. Ámbar solo para botones de compra, precio sobre fondo oscuro y el punto REC; nunca como texto sobre crema. Proporción guía: crema 60 %, azul 30 %, acento 10 %.
- Tipografía: Archivo expandida (wdth 125) 800 para títulos; Archivo expandida 700 en mayúsculas con 0,16em para etiquetas; Instrument Sans 400/600 para texto y botones (17 px en celular); Yellowtail para notas a mano, máximo una o dos por página. Sin itálicas gruesas.
- Tono: cercano y colombiano, de tú, frases cortas. Vende momentos (la moto, el concierto, el paseo) más que especificaciones. Nada de lenguaje exagerado, degradados, contadores de urgencia falsos ni fotos de banco.
- Fotos rectas con esquinas de 14 px; sin Unsplash ni imágenes generadas. Mientras llegan las reales, espacios sobrios.
- Botón de compra: píldora ámbar con texto azul, 52 px de alto; uno principal por pantalla. WhatsApp flotante abajo a la derecha con el ícono oficial y la palabra "WhatsApp".

## Evidence on Hand

- Logo aprobado en cuatro versiones (`public/brand/`).
- Una toma real en primera persona de una calle de Medellín (`public/media/pov.jpg`, 540×304), del brief.
- Sin fotos de estudio de los modelos, sin videos, sin reseñas y sin cifras de ventas todavía.

 Lo que no existe no se inventa: no hay reseñas falsas, contadores de ventas, "personas viendo esto", cuentas regresivas falsas ni stock inventado. Las imágenes iniciales son marcadores de posición para reemplazar desde el panel; las reseñas solo aparecen cuando el equipo carga reseñas reales.

## Product Principles

1. **Cada pantalla, una acción.** Un solo botón principal por pantalla; el catálogo lleva siempre al modelo y el modelo al pedido.
2. **Confianza antes que urgencia.** Contraentrega, contacto por WhatsApp y políticas claras convencen más que la presión falsa.
3. **La velocidad es conversión.** Se carga rápido en un celular con datos y dentro del navegador de TikTok.
4. **Pedir en menos de un minuto.** Sin cuenta, con los campos mínimos que la transportadora necesita.
5. **Todo editable sin programar.** Precios, fotos, textos y ofertas cambian desde el panel.

## Accessibility & Inclusion

Contraste legible a pleno sol en celular; objetivos táctiles grandes; formulario usable con teclado numérico para teléfono; textos en español de Colombia.
