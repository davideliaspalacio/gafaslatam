import type { Product, SettingsRow } from "@/lib/types";

// Catálogo de ejemplo para el modo demo (sin Supabase). Es el mismo contenido de
// supabase/seed.sql: al conectar la base de datos, la tienda lee de allí.

const U = "https://images.unsplash.com/photo-";
const Q = "?w=1600&q=80&auto=format&fit=crop";

export const DEMO_SETTINGS: SettingsRow = {
  id: 1,
  store_name: "gafasLatam",
  whatsapp_number: null,
  support_email: null,
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
  updated_at: "2026-10-18T19:00:00.000Z",
};

export const DEMO_PRODUCT: Product = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "gafas-inteligentes-con-camara",
  name: "gafasLatam Uno",
  headline: "Graba lo que ves. Escucha sin audífonos.",
  short_description:
    "Gafas inteligentes con cámara, parlantes abiertos y micrófono. Foto y video en primera persona, música y llamadas, sin sacar el celular.",
  description:
    "Las gafasLatam Uno parecen unas gafas de sol normales, pero en la montura llevan una cámara, dos parlantes que apuntan al oído y micrófonos para hablar. Tocas la patilla y graban lo que tienes al frente; las fotos y videos pasan a tu celular por la app. Mientras tanto escuchas música o contestas llamadas sin nada en los oídos, así que sigues oyendo la calle.",
  price: 189900,
  compare_at_price: null,
  images: [
    { url: `${U}1728405034490-0d55d9b59af1${Q}`, alt: "Gafas negras de montura gruesa sobre una sábana blanca", sample: true },
    { url: `${U}1624372462825-73d8bda469e1${Q}`, alt: "Hombre con gafas negras de montura gruesa bajo el cielo azul", sample: true },
    { url: `${U}1653038282411-7e9b41753018${Q}`, alt: "Gafas negras sobre un muro blanco con plantas detrás", sample: true },
    { url: `${U}1734416044304-37d2c57c5c9d${Q}`, alt: "Mujer con gafas oscuras en una calle con una casa amarilla", sample: true },
  ],
  moments: [
    { url: `${U}1602699191434-4d6358b26afe${Q}`, caption: "En la moto, sin soltar el manubrio", stamp: "'26 9 14", sample: true },
    { url: `${U}1540039155733-5bb30b53aa14${Q}`, caption: "El concierto, sin levantar el celular", stamp: "'26 9 20", sample: true },
    { url: `${U}1511657304136-7d9f56e0d574${Q}`, caption: "Paseando al perro", stamp: "'26 9 27", sample: true },
    { url: `${U}1771980589828-18f0a689be34${Q}`, caption: "El puesto de frutas de la esquina", stamp: "'26 10 3", sample: true },
    { url: `${U}1475666675596-cca2035b3d79${Q}`, caption: "Bajando en cicla al atardecer", stamp: "'26 10 5", sample: true },
    { url: `${U}1534035265253-afe22046ba98${Q}`, caption: "Caminando por Cartagena", stamp: "'26 10 11", sample: true },
  ],
  variants: [
    { id: "negro-mate", name: "Negro mate", swatch: "#1b1b1b" },
    { id: "carey", name: "Carey", swatch: "#6b3f1f" },
  ],
  bundles: [
    { qty: 1, price: 189900, label: "1 par", badge: null },
    { qty: 2, price: 339900, label: "Doble copia · 2 pares", badge: "Para ti y alguien más" },
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
  in_the_box: ["Gafas gafasLatam Uno", "Estuche", "Cable de carga USB", "Paño de limpieza", "Manual en español"],
  specs_confirmed: false,
  stock: null,
  active: true,
  featured: true,
  sort: 0,
  seo_title: "gafasLatam Uno · Gafas inteligentes con cámara | Pago contraentrega en Colombia",
  seo_description:
    "Gafas inteligentes con cámara, parlantes abiertos y micrófono. Graba en primera persona, escucha música y contesta llamadas. Envío a toda Colombia y pago contraentrega.",
  created_at: "2026-10-18T19:00:00.000Z",
  updated_at: "2026-10-18T19:00:00.000Z",
};
