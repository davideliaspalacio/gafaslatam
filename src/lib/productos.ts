// Los dos modelos de la tienda. Los textos viven aquí; el precio y las fotos se leen de
// Shopify (un solo lugar para cambiarlos). `precioRespaldo` solo se usa si Shopify no responde.
//
// Reglas del brief: a la Biker nunca se le dice "IA" ni "inteligentes"; de las gafas con IA
// no se publica ningún dato técnico hasta que esté confirmado con el proveedor.

export type Slug = "biker" | "ia";

export type Coleccion = { slug: string; nombre: string; descripcion: string };

export type Modelo = {
  slug: Slug;
  nombre: string;
  /** Nombre corto para botones y la tabla comparativa. */
  corto: string;
  titular: string;
  resumen: string;
  descripcion: string;
  coleccion: Coleccion;
  /** Referencia propia (también es el content_id de los píxeles). */
  sku: string;
  /** Producto en Shopify (vinculado en Dropify con el producto de Dropi). */
  shopifyProductId: string;
  dropiId: number;
  precioRespaldo: number;
  /** Bloque "¿Cuál es para ti?". */
  comparacion: { paraQue: string; ia: string; audio: string };
  caracteristicas: { titulo: string; texto: string }[];
  /** Solo datos confirmados. Vacío = se muestra el aviso de ficha por confirmar. */
  ficha: { etiqueta: string; valor: string }[];
  /** Aviso visible en la página (ej. lo que no viene en la caja). */
  aviso: string | null;
  preguntas: { q: string; a: string }[];
  seo: { titulo: string; descripcion: string };
};

export const COLECCIONES = {
  deporte: {
    slug: "deporte",
    nombre: "Deporte",
    descripcion: "Para grabar mientras te mueves: bici, moto y trote.",
  },
  diario: {
    slug: "diario-con-ia",
    nombre: "Diario · con IA",
    descripcion: "Para el día a día: la calle, los viajes y el trabajo.",
  },
} satisfies Record<string, Coleccion>;

const PAGO_AL_RECIBIR = {
  q: "¿Cómo funciona eso de pagar al recibir?",
  a: "Haces el pedido aquí sin pagar nada. Te escribimos por WhatsApp para confirmar tus datos y, cuando la transportadora te entrega, le pagas en efectivo.",
};
const DEMORA = {
  q: "¿Cuánto se demoran en llegar?",
  a: "Entre 2 y 5 días hábiles después de confirmar el pedido, según tu ciudad. Te mandamos el número de guía para que sigas el paquete.",
};
const GARANTIA = {
  q: "¿Y si llegan con un problema?",
  a: "Si tienen un defecto de fábrica, te las cambiamos. Escríbenos por WhatsApp con tu número de pedido.",
};

export const MODELOS: Modelo[] = [
  {
    slug: "biker",
    nombre: "Gafas Biker con cámara",
    corto: "Biker",
    titular: "Graba tu ruta sin soltar el manubrio.",
    resumen: "Gafas deportivas con cámara para bici, moto y trote. Video en 1080p que pasas al celular por Wi-Fi.",
    descripcion:
      "Son unas gafas deportivas con una cámara en la montura. Empiezas a grabar desde las mismas gafas y queda lo que tienes al frente mientras pedaleas, manejas o trotas. Después pasas los videos al celular por Wi-Fi con la app. No tienen audio: son para grabar.",
    coleccion: COLECCIONES.deporte,
    sku: "GL-BIKER",
    shopifyProductId: "gid://shopify/Product/15459905929367",
    dropiId: 1875412,
    precioRespaldo: 149900,
    comparacion: { paraQue: "Ejercicio: bici, moto y trote", ia: "No", audio: "No" },
    caracteristicas: [
      {
        titulo: "Grabas con las manos ocupadas",
        texto: "Arrancas y paras el video desde las gafas. Las manos siguen en el manubrio, el timón o el ritmo del trote.",
      },
      {
        titulo: "Video en 1080p a 30 fps",
        texto: "La toma queda a la altura de tus ojos: la ruta, la subida, el paisaje, tal como lo viste.",
      },
      {
        titulo: "Pasas los videos por Wi-Fi",
        texto: "Conectas el celular a las gafas con la app y bajas los videos para guardarlos o subirlos.",
      },
      {
        titulo: "Solo para grabar",
        texto: "No tienen música, llamadas ni Bluetooth para audio. Si quieres eso, mira las gafas con cámara e IA.",
      },
    ],
    ficha: [
      { etiqueta: "Video", valor: "1080p a 30 fps" },
      { etiqueta: "Pasar videos al celular", valor: "Wi-Fi, con la app" },
      { etiqueta: "Música y llamadas", valor: "No tiene" },
      { etiqueta: "Memoria", valor: "Tarjeta microSD (no viene incluida)" },
      { etiqueta: "Para", valor: "Bici, moto y trote" },
    ],
    aviso:
      "Graban en una tarjeta microSD que no viene incluida: la consigues en cualquier tienda de tecnología. Si tienes dudas sobre cuál comprar, pregúntanos por WhatsApp.",
    preguntas: [
      {
        q: "¿Traen la tarjeta de memoria?",
        a: "No. Graban en una tarjeta microSD que se compra aparte. Si no sabes cuál comprar, escríbenos por WhatsApp y te decimos.",
      },
      {
        q: "¿Puedo escuchar música o contestar llamadas?",
        a: "No. Las Biker son para grabar y no tienen audio. Si quieres música, llamadas y asistente de voz, las que te sirven son las gafas con cámara e IA.",
      },
      {
        q: "¿Cómo paso los videos al celular?",
        a: "Por Wi-Fi: conectas el celular a las gafas desde la app y bajas los videos.",
      },
      PAGO_AL_RECIBIR,
      DEMORA,
      GARANTIA,
    ],
    seo: {
      titulo: "Gafas Biker con cámara · Para bici, moto y trote",
      descripcion:
        "Gafas deportivas con cámara: graban video en 1080p mientras pedaleas, manejas o trotas. Envío gratis a toda Colombia y pagas al recibir.",
    },
  },
  {
    slug: "ia",
    nombre: "Gafas con cámara e IA",
    corto: "Con IA",
    titular: "Tu música, tus llamadas y un asistente, sin sacar el celular.",
    resumen:
      "Gafas con cámara e IA para el día a día: la calle, los viajes y el trabajo. Música, llamadas y asistente de voz con las manos libres.",
    descripcion:
      "Son para usarlas todos los días. Graban lo que tienes al frente, suenan cerca del oído para tu música y tus llamadas, y le hablas al asistente de voz sin sacar el celular. Sirven para caminar la ciudad, viajar o trabajar con las manos libres.",
    coleccion: COLECCIONES.diario,
    sku: "GL-PRO",
    shopifyProductId: "gid://shopify/Product/15459906617495",
    dropiId: 2172927,
    precioRespaldo: 449900,
    comparacion: { paraQue: "El día a día: calle, viajes y trabajo", ia: "Sí", audio: "Sí" },
    caracteristicas: [
      {
        titulo: "Le hablas al asistente",
        texto: "Le preguntas o le pides algo con la voz, con el celular en el bolsillo.",
      },
      {
        titulo: "Música y llamadas",
        texto: "Escuchas tu música y contestas llamadas con las gafas puestas, sin audífonos.",
      },
      {
        titulo: "Cámara a la altura de tus ojos",
        texto: "Graban lo que tienes al frente: la calle, el viaje o lo que pasa en el trabajo.",
      },
      {
        titulo: "Para todos los días",
        texto: "Unas gafas que te pones para salir, viajar o trabajar, no solo para ocasiones especiales.",
      },
    ],
    ficha: [],
    aviso: null,
    preguntas: [
      {
        q: "¿En qué se diferencian de las Biker?",
        a: "Las Biker son para grabar mientras haces ejercicio y no tienen audio. Estas son para el día a día: además de la cámara traen IA, música, llamadas y asistente de voz.",
      },
      {
        q: "¿Dónde veo la ficha técnica?",
        a: "La estamos confirmando con el proveedor para no publicar datos que no hayamos comprobado. Si necesitas un dato puntual antes de pedir, pregúntanos por WhatsApp.",
      },
      PAGO_AL_RECIBIR,
      DEMORA,
      GARANTIA,
    ],
    seo: {
      titulo: "Gafas con cámara e IA · Música, llamadas y asistente",
      descripcion:
        "Gafas con cámara e IA para el día a día: música, llamadas y asistente de voz sin sacar el celular. Envío gratis a toda Colombia y pagas al recibir.",
    },
  },
];

export const SLUGS = MODELOS.map((m) => m.slug) as [Slug, ...Slug[]];

export function modeloPorSlug(slug: string): Modelo | null {
  return MODELOS.find((m) => m.slug === slug) ?? null;
}

/** Cantidad máxima por pedido en el formulario. */
export const MAX_CANTIDAD = 3;
