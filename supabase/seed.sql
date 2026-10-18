-- Datos iniciales de desarrollo.
-- Todo lo que está aquí es PROVISIONAL y se edita desde /admin:
-- nombre de la tienda, precio, especificaciones, envío y textos legales
-- deben confirmarse con el proveedor antes de publicar anuncios.

insert into public.store_settings (
  id, store_name, whatsapp_number, support_email, announcement,
  shipping_cost, free_shipping, delivery_estimate,
  cod_enabled, online_payment_enabled
) values (
  1, 'gafasLatam', null, null,
  'Envío gratis a toda Colombia · Pagas al recibir',
  0, true, '2 a 5 días hábiles',
  true, false
) on conflict (id) do nothing;

insert into public.products (
  slug, name, headline, short_description, description,
  price, compare_at_price, images, moments, variants, bundles,
  features, specs, faq, in_the_box,
  stock, active, featured, sort, seo_title, seo_description
) values (
  'gafas-inteligentes-con-camara',
  'gafasLatam Uno',
  'Graba lo que ves. Escucha sin audífonos.',
  'Gafas inteligentes con cámara, parlantes abiertos y micrófono. Foto y video en primera persona, música y llamadas, sin sacar el celular.',
  'Las gafasLatam Uno parecen unas gafas de sol normales, pero en la montura llevan una cámara, dos parlantes que apuntan al oído y micrófonos para hablar. Tocas la patilla y graban lo que tienes al frente; las fotos y videos pasan a tu celular por la app. Mientras tanto escuchas música o contestas llamadas sin nada en los oídos, así que sigues oyendo la calle.',
  189900, null,
  '[{"url": "https://images.unsplash.com/photo-1728405034490-0d55d9b59af1?w=1600&q=80&auto=format&fit=crop", "alt": "Gafas negras de montura gruesa sobre una sábana blanca", "sample": true}, {"url": "https://images.unsplash.com/photo-1624372462825-73d8bda469e1?w=1600&q=80&auto=format&fit=crop", "alt": "Hombre con gafas negras de montura gruesa bajo el cielo azul", "sample": true}, {"url": "https://images.unsplash.com/photo-1653038282411-7e9b41753018?w=1600&q=80&auto=format&fit=crop", "alt": "Gafas negras sobre un muro blanco con plantas detrás", "sample": true}, {"url": "https://images.unsplash.com/photo-1734416044304-37d2c57c5c9d?w=1600&q=80&auto=format&fit=crop", "alt": "Mujer con gafas oscuras en una calle con una casa amarilla", "sample": true}]'::jsonb,
  '[{"url": "https://images.unsplash.com/photo-1602699191434-4d6358b26afe?w=1600&q=80&auto=format&fit=crop", "caption": "En la moto, sin soltar el manubrio", "stamp": "''26 9 14", "sample": true}, {"url": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&q=80&auto=format&fit=crop", "caption": "El concierto, sin levantar el celular", "stamp": "''26 9 20", "sample": true}, {"url": "https://images.unsplash.com/photo-1511657304136-7d9f56e0d574?w=1600&q=80&auto=format&fit=crop", "caption": "Paseando al perro", "stamp": "''26 9 27", "sample": true}, {"url": "https://images.unsplash.com/photo-1771980589828-18f0a689be34?w=1600&q=80&auto=format&fit=crop", "caption": "El puesto de frutas de la esquina", "stamp": "''26 10 3", "sample": true}, {"url": "https://images.unsplash.com/photo-1475666675596-cca2035b3d79?w=1600&q=80&auto=format&fit=crop", "caption": "Bajando en cicla al atardecer", "stamp": "''26 10 5", "sample": true}, {"url": "https://images.unsplash.com/photo-1534035265253-afe22046ba98?w=1600&q=80&auto=format&fit=crop", "caption": "Caminando por Cartagena", "stamp": "''26 10 11", "sample": true}]'::jsonb,
  '[{"id":"negro-mate","name":"Negro mate","swatch":"#1b1b1b"},{"id":"carey","name":"Carey","swatch":"#6b3f1f"}]'::jsonb,
  '[{"qty":1,"price":189900,"label":"1 par","badge":null},{"qty":2,"price":339900,"label":"Doble copia · 2 pares","badge":"Para ti y alguien más"}]'::jsonb,
  '[
    {"title":"Foto y video en primera persona","body":"Un toque en la patilla y graba exactamente lo que estás viendo. Tus manos quedan libres: en la moto, en el concierto, con tu perro, en la cocina."},
    {"title":"Música y llamadas sin audífonos","body":"Dos parlantes abiertos dirigen el sonido a tu oído. Escuchas tu música y sigues oyendo lo que pasa alrededor."},
    {"title":"Contesta con la voz","body":"Micrófonos en la montura para hablar por teléfono o activar el asistente de tu celular."},
    {"title":"Protegen del sol","body":"Lentes oscuros para el día a día. Por fuera, son unas gafas de sol que te pondrías igual."}
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
    {"q":"¿Cómo funciona el pago contraentrega?","a":"Haces el pedido aquí sin pagar nada. Te escribimos por WhatsApp para confirmar la dirección y cuando la transportadora te entrega, pagas en efectivo."},
    {"q":"¿Cuánto se demora el envío?","a":"Entre 2 y 5 días hábiles según tu ciudad. Te enviamos el número de guía para que sigas el paquete."},
    {"q":"¿Funcionan con iPhone y Android?","a":"Sí. Se conectan por Bluetooth a cualquier celular y la app para pasar fotos y videos está para iPhone y Android."},
    {"q":"¿Se pueden mojar?","a":"Trátalas como unas gafas con electrónica adentro: no son para nadar ni para meterlas al agua."},
    {"q":"¿Cómo se cargan?","a":"Con el cable USB que viene en la caja, conectado a cualquier cargador de celular."},
    {"q":"¿Tienen garantía?","a":"Sí. Si llegan con un defecto de fábrica te las cambiamos. Escríbenos por WhatsApp con tu número de pedido."}
  ]'::jsonb,
  '["Gafas gafasLatam Uno","Estuche","Cable de carga USB","Paño de limpieza","Manual en español"]'::jsonb,
  null, true, true, 0,
  'gafasLatam Uno · Gafas inteligentes con cámara | Pago contraentrega en Colombia',
  'Gafas inteligentes con cámara, parlantes abiertos y micrófono. Graba en primera persona, escucha música y contesta llamadas. Envío a toda Colombia y pago contraentrega.'
) on conflict (slug) do nothing;
