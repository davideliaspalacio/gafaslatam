-- Datos iniciales de desarrollo.
-- Precio, especificaciones, envío y textos legales son PROVISIONALES:
-- se confirman con el proveedor y se editan desde /admin antes de pautar.

insert into public.store_settings (
  id, store_name, whatsapp_number, support_email, announcement,
  shipping_cost, free_shipping, delivery_estimate,
  cod_enabled, online_payment_enabled,
  instagram_handle, tiktok_handle, facebook_url
) values (
  1, 'Gafas Latam', '573007568489', 'gafaslatam@gmail.com',
  'Envío gratis a toda Colombia · Pagas al recibir',
  0, true, '2 a 5 días hábiles',
  true, false,
  'gafaslatam', 'gafaslatam', 'https://facebook.com/gafaslatam'
) on conflict (id) do nothing;

insert into public.products (
  slug, name, headline, short_description, description,
  price, compare_at_price, images, moments, variants, bundles,
  features, specs, faq, in_the_box, tags, badge,
  stock, active, featured, sort, seo_title, seo_description
) values (
  'modelo-1',
  'Modelo 1',
  'Graba lo que vives, sin sacar el celular.',
  'Gafas con cámara, parlantes y micrófono. Grabas lo que tienes al frente, escuchas música y contestas llamadas con las manos libres.',
  'Por fuera son unas gafas de sol. En la montura llevan una cámara, dos parlantes que suenan cerquita del oído y micrófonos para hablar. Tocas la patilla y queda grabado lo que estás viendo; después pasas las fotos y los videos al celular con la app.',
  189900, null,
  '[]'::jsonb,
  '[]'::jsonb,
  '[{"id":"negro-mate","name":"Negro mate","swatch":"#1b1b1b"},{"id":"carey","name":"Carey","swatch":"#6b3f1f"}]'::jsonb,
  '[{"qty":1,"price":189900,"label":"1 par","badge":null},{"qty":2,"price":339900,"label":"2 pares","badge":"Para ti y alguien más"}]'::jsonb,
  '[
    {"title":"Grabas sin sacar el celular","body":"Un toque en la patilla y queda grabado lo que tienes al frente. Las manos siguen en el manubrio, en la baranda del concierto o en la correa del perro."},
    {"title":"Música y llamadas, sin audífonos","body":"El sonido sale cerquita del oído. Escuchas tu música y sigues oyendo la calle."},
    {"title":"Contestas con la voz","body":"Micrófonos en la montura para hablar por teléfono o pedirle algo al asistente de tu celular."},
    {"title":"Y siguen siendo gafas de sol","body":"Lentes oscuros para el día a día. Por fuera son unas gafas que te pondrías igual."}
  ]'::jsonb,
  '[
    {"value":"8","unit":"MP","label":"Cámara de fotos"},
    {"value":"1080","unit":"p","label":"Video"},
    {"value":"6","unit":"h","label":"Música por carga"},
    {"value":"45","unit":"g","label":"Peso"},
    {"value":"5.3","unit":"BT","label":"Bluetooth"},
    {"value":"4","unit":"IPX","label":"Resiste salpicaduras y sudor"}
  ]'::jsonb,
  '[
    {"q":"¿Cómo funciona eso de pagar al recibir?","a":"Haces el pedido aquí sin pagar nada. Te escribimos por WhatsApp para confirmar la dirección y, cuando la transportadora te entrega, le pagas en efectivo."},
    {"q":"¿Cuánto se demoran en llegar?","a":"Entre 2 y 5 días hábiles, según tu ciudad. Te mandamos el número de guía para que sigas el paquete."},
    {"q":"¿Sirven con iPhone y con Android?","a":"Sí. Se conectan por Bluetooth a cualquier celular y la app para pasar fotos y videos está para los dos."},
    {"q":"¿Se pueden mojar?","a":"Trátalas como unas gafas con electrónica adentro: no son para nadar ni para meterlas al agua."},
    {"q":"¿Cómo se cargan?","a":"Con el cable USB que viene en la caja, conectado a cualquier cargador de celular."},
    {"q":"¿Y si llegan con un problema?","a":"Si tienen un defecto de fábrica, te las cambiamos. Escríbenos por WhatsApp con tu número de pedido."}
  ]'::jsonb,
  '["Gafas Modelo 1","Estuche","Cable de carga USB","Paño de limpieza","Manual en español"]'::jsonb,
  array['camara', 'audio', 'sol'],
  null,
  null, true, true, 0,
  'Modelo 1 · Gafas con cámara y audio | Gafas Latam',
  'Gafas con cámara, parlantes y micrófono. Graba lo que vives sin sacar el celular. Envío gratis a toda Colombia y pagas al recibir.'
) on conflict (slug) do nothing;
