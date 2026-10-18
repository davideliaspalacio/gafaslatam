import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/catalog";
import { formatCOP } from "@/lib/format";
import type { SettingsRow } from "@/lib/types";

// Textos base. Revísalos con tu contador o abogado antes de vender:
// dependen de tu razón social, transportadora y garantía real.

type Policy = { title: string; body: (s: SettingsRow) => { h?: string; p: string[] }[] };

const responsible = (s: SettingsRow) =>
  [s.legal_name ?? s.store_name, s.tax_id ? `identificado con NIT/CC ${s.tax_id}` : null, s.legal_address]
    .filter(Boolean)
    .join(", ");

const contact = (s: SettingsRow) =>
  [s.whatsapp_number ? `WhatsApp +${s.whatsapp_number}` : null, s.support_email].filter(Boolean).join(" o ") ||
  "nuestros canales de contacto";

const POLICIES: Record<string, Policy> = {
  envios: {
    title: "Envíos y pago contraentrega",
    body: (s) => [
      {
        p: [
          `Enviamos a toda Colombia por transportadora. El tiempo estimado de entrega es de ${s.delivery_estimate.toLowerCase()} después de confirmar tu pedido; a municipios alejados puede tomar más.`,
          s.free_shipping
            ? "El envío no tiene costo para ti."
            : `El envío cuesta ${formatCOP(s.shipping_cost)} y se suma al total del pedido.`,
        ],
      },
      {
        h: "Cómo funciona el pago contraentrega",
        p: [
          "Haces el pedido en la página sin pagar nada. Te escribimos por WhatsApp para confirmar los datos de entrega. Cuando la transportadora te entrega el paquete, le pagas el total en efectivo.",
          "Si no logramos confirmar tu pedido por WhatsApp o llamada, no lo despachamos.",
        ],
      },
      {
        h: "Seguimiento",
        p: ["Al despachar te enviamos el número de guía para que sigas el paquete en la página de la transportadora."],
      },
    ],
  },
  "cambios-y-garantia": {
    title: "Cambios, retracto y garantía",
    body: (s) => [
      {
        h: "Derecho de retracto",
        p: [
          "Por ser una compra a distancia, tienes derecho a retractarte dentro de los cinco (5) días hábiles siguientes a la entrega, según el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor). El producto debe devolverse en el mismo estado en que lo recibiste. Los costos de transporte de la devolución corren por tu cuenta y te reintegramos el dinero pagado dentro de los treinta (30) días calendario siguientes.",
        ],
      },
      {
        h: "Garantía",
        p: [
          "Todos los productos tienen la garantía legal que establece la Ley 1480 de 2011. Si el producto llega con un defecto de fábrica o falla por causas de calidad, te lo reparamos o cambiamos; si no es posible, te devolvemos el dinero.",
          "La garantía no cubre daños por golpes, humedad por inmersión, mal uso o manipulación por terceros.",
        ],
      },
      { h: "Cómo solicitarlo", p: [`Escríbenos por ${contact(s)} con tu número de pedido y una foto o video del problema.`] },
    ],
  },
  privacidad: {
    title: "Tratamiento de datos personales",
    body: (s) => [
      {
        p: [
          `${responsible(s)} es responsable del tratamiento de los datos personales que entregas en esta tienda, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.`,
        ],
      },
      {
        h: "Qué datos recogemos y para qué",
        p: [
          "Nombre, celular, dirección, ciudad y, si lo entregas, correo electrónico. Los usamos para procesar y entregar tu pedido, confirmarlo por WhatsApp, atender garantías y cumplir obligaciones legales.",
          "Compartimos los datos de entrega con la transportadora y, si pagas en línea, con la pasarela de pagos. También usamos herramientas de medición de publicidad (como el píxel de TikTok) que pueden recibir datos de navegación y datos de contacto cifrados.",
        ],
      },
      {
        h: "Tus derechos",
        p: [
          `Puedes conocer, actualizar, rectificar y pedir la eliminación de tus datos, o revocar la autorización, escribiendo a ${contact(s)}. Responderemos consultas en máximo diez (10) días hábiles y reclamos en máximo quince (15) días hábiles. También puedes acudir a la Superintendencia de Industria y Comercio.`,
        ],
      },
      { h: "Autorización", p: ["Al enviar el formulario de pedido autorizas el tratamiento de tus datos para estas finalidades."] },
    ],
  },
  terminos: {
    title: "Términos y condiciones",
    body: (s) => [
      {
        p: [
          `Estos términos regulan las compras en la tienda ${s.store_name}, operada por ${responsible(s)}. Al hacer un pedido los aceptas.`,
        ],
      },
      {
        h: "Precios y disponibilidad",
        p: [
          "Los precios están en pesos colombianos e incluyen IVA cuando aplique. Pueden cambiar sin previo aviso, pero respetamos el precio que aparecía al momento de tu pedido. Si un producto se agota después de tu pedido, te avisamos y no se cobra nada.",
        ],
      },
      {
        h: "Pedidos",
        p: [
          "Un pedido queda en firme cuando lo confirmamos contigo por WhatsApp o cuando se aprueba el pago en línea. Podemos cancelar pedidos con datos incompletos, falsos o que no logremos confirmar.",
        ],
      },
      {
        h: "Envíos, retracto y garantía",
        p: ["Se rigen por nuestras políticas de envíos y de cambios, retracto y garantía, y por la Ley 1480 de 2011."],
      },
      { h: "Contacto", p: [`Para cualquier solicitud, escríbenos por ${contact(s)}.`] },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/politicas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return policy ? { title: policy.title, alternates: { canonical: `/politicas/${slug}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<"/politicas/[slug]">) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();
  const settings = await getSettings();

  return (
    <main className="on-paper bg-paper text-ink">
      <article className="mx-auto max-w-[68ch] px-4 py-14 sm:px-6 md:py-20">
        <h1 className="type-carton text-[2.2rem] text-carton sm:text-5xl">{policy.title}</h1>
        <div className="mt-8 space-y-8">
          {policy.body(settings).map((block, i) => (
            <section key={i}>
              {block.h ? <h2 className="mb-2 text-xl font-bold tracking-tight">{block.h}</h2> : null}
              {block.p.map((p) => (
                <p key={p} className="mt-3 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
