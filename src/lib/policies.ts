import { formatCOP } from "@/lib/format";
import type { SettingsRow } from "@/lib/types";

// Textos base. Revísalos con tu contador o abogado antes de vender:
// dependen de tu razón social, transportadora y garantía real.

export type Block = { h?: string; p: string[] };

const responsible = (s: SettingsRow) =>
  [s.legal_name ?? s.store_name, s.tax_id ? `identificado con NIT/RUT ${s.tax_id}` : null, s.legal_address]
    .filter(Boolean)
    .join(", ");

const contact = (s: SettingsRow) =>
  [s.whatsapp_number ? `WhatsApp +${s.whatsapp_number}` : null, s.support_email].filter(Boolean).join(" o ") ||
  "nuestros canales de contacto";

export const shipping = (s: SettingsRow): Block[] => [
  {
    h: "Envíos",
    p: [
      `Enviamos a toda Colombia por transportadora. Las gafas te llegan en ${s.delivery_estimate.toLowerCase()} después de confirmar el pedido; a municipios lejanos puede tomar un poco más.`,
      s.free_shipping ? "El envío no te cuesta nada." : `El envío cuesta ${formatCOP(s.shipping_cost)} y se suma al total.`,
      "Cuando despachamos te mandamos el número de guía por WhatsApp para que sigas el paquete.",
    ],
  },
  {
    h: "Pagas al recibir",
    p: [
      "Haces el pedido sin pagar nada. Te escribimos por WhatsApp para confirmar la dirección y, cuando la transportadora te entrega, le pagas en efectivo.",
      "Si no logramos confirmar el pedido por WhatsApp o por llamada, no lo despachamos.",
    ],
  },
];

export const warranty = (s: SettingsRow): Block[] => [
  {
    h: "Garantía",
    p: [
      "Todos los productos tienen la garantía legal de la Ley 1480 de 2011 (Estatuto del Consumidor). Si llegan con un defecto de fábrica o fallan por calidad, te los reparamos o cambiamos; si no se puede, te devolvemos la plata.",
      "La garantía no cubre golpes, daños por agua, mal uso o arreglos hechos por otras personas.",
      `Para pedirla, escríbenos por ${contact(s)} con tu número de pedido y una foto o video del problema.`,
    ],
  },
];

export const withdrawal = (s: SettingsRow): Block[] => [
  {
    h: "Derecho de retracto",
    p: [
      "Como es una compra a distancia, puedes arrepentirte dentro de los cinco (5) días hábiles siguientes a la entrega (artículo 47 de la Ley 1480 de 2011).",
      "Las gafas deben volver en el mismo estado en que las recibiste, con su caja y accesorios. El envío de la devolución corre por tu cuenta y te devolvemos lo que pagaste dentro de los treinta (30) días calendario siguientes.",
      `Para ejercerlo, escríbenos por ${contact(s)} con tu número de pedido.`,
    ],
  },
];

export const privacy = (s: SettingsRow): Block[] => [
  {
    p: [
      `${responsible(s)} es responsable del tratamiento de los datos personales que entregas en esta tienda, según la Ley 1581 de 2012 y el Decreto 1377 de 2013.`,
    ],
  },
  {
    h: "Qué datos recogemos y para qué",
    p: [
      "Nombre, celular, dirección, ciudad y, si nos lo das, correo. Los usamos para procesar y entregar tu pedido, confirmarlo por WhatsApp, atender garantías y cumplir obligaciones legales.",
      "Compartimos los datos de entrega con la transportadora y, si pagas en línea, con la pasarela de pagos. Usamos herramientas de medición de publicidad (como los píxeles de Meta y TikTok) que pueden recibir datos de navegación y datos de contacto cifrados.",
    ],
  },
  {
    h: "Tus derechos",
    p: [
      `Puedes conocer, actualizar, corregir o pedir que borremos tus datos, o revocar la autorización, escribiendo a ${contact(s)}. Respondemos consultas en máximo diez (10) días hábiles y reclamos en máximo quince (15). También puedes acudir a la Superintendencia de Industria y Comercio.`,
    ],
  },
  { h: "Autorización", p: ["Al enviar el formulario de pedido autorizas el tratamiento de tus datos para estas finalidades."] },
];

export const terms = (s: SettingsRow): Block[] => [
  { p: [`Estos términos regulan las compras en ${s.store_name}, operada por ${responsible(s)}. Al hacer un pedido los aceptas.`] },
  {
    h: "Precios y disponibilidad",
    p: [
      "Los precios están en pesos colombianos e incluyen IVA cuando aplique. Pueden cambiar sin aviso, pero respetamos el precio que viste al hacer tu pedido. Si un modelo se agota después de tu pedido, te avisamos y no se cobra nada.",
    ],
  },
  {
    h: "Pedidos",
    p: [
      "Un pedido queda en firme cuando lo confirmamos contigo por WhatsApp o cuando se aprueba el pago en línea. Podemos cancelar pedidos con datos incompletos, falsos o que no logremos confirmar.",
    ],
  },
  { h: "Envíos, garantía y retracto", p: ["Se rigen por nuestra página de envíos y garantía, la de derecho de retracto y la Ley 1480 de 2011."] },
  { h: "Contacto", p: [`Para cualquier solicitud, escríbenos por ${contact(s)}.`] },
];
