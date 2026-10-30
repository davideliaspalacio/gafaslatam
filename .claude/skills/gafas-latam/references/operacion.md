# Operación diaria de Gafas Latam

## Procesar pedidos (Jeronimo)

1. Shopify → Pedidos → filtrar por etiqueta `por-confirmar`.
2. Escribirle al cliente por WhatsApp (+57 300 756 8489 es el número de la tienda) si no ha mandado el "SÍ CONFIRMO" desde la página de gracias.
3. Con "SÍ CONFIRMO": quitar `por-confirmar`, poner `confirmado`, y en el pedido **Más acciones → Enviar a Dropi**. Sale "Sincronizado: el registro ha sido creado con éxito" y la etiqueta `Order sent to dropi`.
4. En Dropi → Mis pedidos el pedido aparece "Pendiente confirmación" con recaudo. Revisar producto, ciudad, dirección, celular y valor, y confirmarlo (✓) para que la bodega lo despache.
5. Sin confirmación o con datos falsos: etiqueta `cancelado` y cancelar el pedido en Shopify (Más acciones → Cancelar pedido, sin avisar al cliente).

## Pedido de prueba sin despachar nada

1. En la web (o la preview), pedir con barrio "PEDIDO DE PRUEBA, NO DESPACHAR".
2. Revisar en Shopify que llegue con etiquetas, UTM, departamento y total correctos.
3. Si hay que probar Dropi: Enviar a Dropi y de inmediato, en Dropi → Mis pedidos, el ícono de caneca **Cancelar orden** (motivo "Otros", "Pedido de prueba") ANTES de que tenga guía. Ojo: en Dropi puede haber pedidos reales de Jeronimo; cancela solo el que tenga la dirección de prueba.
4. Cancelar en Shopify y ponerle etiquetas `cancelado` y `prueba`.

Pedidos de prueba ya hechos: #1001 (Dropi 95008373) y #1002, ambos cancelados.

## Cuentas y accesos

- Shopify: tienda `ewmtsc-cb`, cuenta gafaslatam@gmail.com, plan Basic (US$1/mes hasta el 31 de enero de 2027, luego US$25/mes).
- Dropi: cuenta de Gafas Latam (gafaslatam@gmail.com), integración "Gafas Latam" (ID 431059). NO usar la cuenta de la tienda Gismo.
- Dropify: app oficial "Dropify – Import products from Dropi and Sync Orders" (no la "Dropi" de App Makers LLC).
- Vercel: equipo `silisors-projects`, plan Hobby (para vender conviene Pro).
- Las contraseñas y claves las escribe el dueño en la pantalla o en la terminal; nunca se piden por chat.

## Pendientes conocidos (a octubre de 2026)

- IDs de los píxeles de Meta y TikTok y sus tokens de servidor.
- Ficha técnica confirmada de las gafas con IA y fotos propias de los dos modelos.
- Datos de facturación en Dropi.
