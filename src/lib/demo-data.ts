import type { Product, SettingsRow } from "@/lib/types";

// Catálogo de ejemplo para el modo demo (sin Supabase). Es el mismo contenido de
// supabase/seed.sql: al conectar la base de datos, la tienda lee de allí.


export const DEMO_SETTINGS: SettingsRow = {
  id: 1,
  store_name: "Gafas Latam",
  whatsapp_number: "573007568489",
  support_email: "gafaslatam@gmail.com",
  announcement: "Envío gratis a toda Colombia · Pagas al recibir",
  shipping_cost: 0,
  free_shipping: true,
  delivery_estimate: "2 a 5 días hábiles",
  cod_enabled: true,
  online_payment_enabled: false,
  tiktok_pixel_id: null,
  meta_pixel_id: null,
  legal_name: null,
  tax_id: null,
  legal_address: null,
  instagram_handle: "gafaslatam",
  tiktok_handle: "gafaslatam",
  facebook_url: "https://facebook.com/gafaslatam",
  hero_video_url: null,
  hero_poster_url: null,
  updated_at: "2026-10-18T19:00:00.000Z",
};

export const DEMO_PRODUCT: Product = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "modelo-1",
  name: "Modelo 1",
  headline: "Graba lo que vives, sin sacar el celular.",
  short_description:
    "Gafas inteligentes con cámara, parlantes abiertos y micrófono. Foto y video en primera persona, música y llamadas, sin sacar el celular.",
  description:
    "Las gafasLatam Uno parecen unas gafas de sol normales, pero en la montura llevan una cámara, dos parlantes que apuntan al oído y micrófonos para hablar. Tocas la patilla y graban lo que tienes al frente; las fotos y videos pasan a tu celular por la app. Mientras tanto escuchas música o contestas llamadas sin nada en los oídos, así que sigues oyendo la calle.",
  price: 189900,
  compare_at_price: null,
  images: [],
  moments: [],
  variants: [
    { id: "negro-mate", name: "Negro mate", swatch: "#1b1b1b" },
    { id: "carey", name: "Carey", swatch: "#6b3f1f" },
  ],
  bundles: [
    { qty: 1, price: 189900, label: "1 par", badge: null },
    { qty: 2, price: 339900, label: "2 pares", badge: "Para ti y alguien más" },
  ],
  features: [
    {
      title: "Foto y video en primera persona",
      body: "Un toque en la patilla y graba exactamente lo que estás viendo. Tus manos quedan libres: en la moto, en el concierto, con tu perro, en la cocina.",
    },
    {
      title: "Música y llamadas sin audífonos",
      body: "Dos parlantes abiertos dirigen el sonido a tu oído. Escuchas tu música y sigues oyendo lo que pasa alrededor.",
    },
    { title: "Contesta con la voz", body: "Micrófonos en la montura para hablar por teléfono o activar el asistente de tu celular." },
    { title: "Protegen del sol", body: "Lentes oscuros para el día a día. Por fuera, son unas gafas de sol que te pondrías igual." },
  ],
  specs: [
    { value: "8", unit: "MP", label: "Cámara de fotos" },
    { value: "1080", unit: "p", label: "Video" },
    { value: "6", unit: "h", label: "Música por carga" },
    { value: "45", unit: "g", label: "Peso" },
    { value: "5.3", unit: "BT", label: "Bluetooth" },
    { value: "4", unit: "IPX", label: "Resiste salpicaduras y sudor" },
  ],
  faq: [
    {
      q: "¿Cómo funciona el pago contraentrega?",
      a: "Haces el pedido aquí sin pagar nada. Te escribimos por WhatsApp para confirmar la dirección y cuando la transportadora te entrega, pagas en efectivo.",
    },
    {
      q: "¿Cuánto se demora el envío?",
      a: "Entre 2 y 5 días hábiles según tu ciudad. Te enviamos el número de guía para que sigas el paquete.",
    },
    {
      q: "¿Funcionan con iPhone y Android?",
      a: "Sí. Se conectan por Bluetooth a cualquier celular y la app para pasar fotos y videos está para iPhone y Android.",
    },
    { q: "¿Se pueden mojar?", a: "Trátalas como unas gafas con electrónica adentro: no son para nadar ni para meterlas al agua." },
    { q: "¿Cómo se cargan?", a: "Con el cable USB que viene en la caja, conectado a cualquier cargador de celular." },
    {
      q: "¿Tienen garantía?",
      a: "Sí. Si llegan con un defecto de fábrica te las cambiamos. Escríbenos por WhatsApp con tu número de pedido.",
    },
  ],
  in_the_box: ["Gafas Modelo 1", "Estuche", "Cable de carga USB", "Paño de limpieza", "Manual en español"],
  specs_confirmed: false,
  tags: ["camara", "audio", "sol"],
  badge: null,
  video_url: null,
  stock: null,
  active: true,
  featured: true,
  sort: 0,
  seo_title: "Modelo 1 · Gafas con cámara y audio | Gafas Latam",
  seo_description:
    "Gafas inteligentes con cámara, parlantes abiertos y micrófono. Graba en primera persona, escucha música y contesta llamadas. Envío a toda Colombia y pago contraentrega.",
  created_at: "2026-10-18T19:00:00.000Z",
  updated_at: "2026-10-18T19:00:00.000Z",
};
