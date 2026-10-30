import "server-only";

// Conexión con la API de administración de Shopify. Shopify es solo el sistema de pedidos:
// la tienda sigue siendo esta web. Variables (solo en Vercel / .env.local, nunca en el repo):
//   SHOPIFY_STORE_DOMAIN   ewmtsc-cb.myshopify.com
//   SHOPIFY_CLIENT_ID      ID de cliente de la app "Pedidos web Gafas Latam" (Dev Dashboard)
//   SHOPIFY_CLIENT_SECRET  Secreto del cliente de esa app
//   SHOPIFY_ADMIN_TOKEN    (opcional) token fijo; si existe se usa en vez de pedir uno
// Con la app de Dev Dashboard el token se pide con client credentials y dura 24 horas.

const API_VERSION = "2026-10";

export class ShopifyError extends Error {}

function env() {
  return {
    domain: process.env.SHOPIFY_STORE_DOMAIN?.trim(),
    clientId: process.env.SHOPIFY_CLIENT_ID?.trim(),
    clientSecret: process.env.SHOPIFY_CLIENT_SECRET?.trim(),
    staticToken: process.env.SHOPIFY_ADMIN_TOKEN?.trim(),
  };
}

export function hasShopify() {
  const e = env();
  return Boolean(e.domain && (e.staticToken || (e.clientId && e.clientSecret)));
}

let token: { value: string; expiresAt: number } | null = null;
let pending: Promise<string> | null = null;

async function accessToken(): Promise<string> {
  const e = env();
  if (e.staticToken) return e.staticToken;
  if (token && token.expiresAt > Date.now()) return token.value;
  pending ??= (async () => {
    const res = await fetch(`https://${e.domain}/admin/oauth/access_token`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: e.clientId ?? "",
        client_secret: e.clientSecret ?? "",
      }),
    });
    if (!res.ok) throw new ShopifyError(`Token de Shopify: ${res.status} ${(await res.text()).slice(0, 200)}`);
    const data = (await res.json()) as { access_token: string; expires_in?: number };
    // Se renueva 10 minutos antes de que venza.
    token = { value: data.access_token, expiresAt: Date.now() + ((data.expires_in ?? 86399) - 600) * 1000 };
    return data.access_token;
  })().finally(() => {
    pending = null;
  });
  return pending;
}

export async function adminGraphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!hasShopify()) throw new ShopifyError("Faltan las variables de Shopify");
  const { domain } = env();
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await accessToken() },
      body: JSON.stringify({ query, variables }),
    });
    // Token vencido o revocado: se pide otro una vez.
    if (res.status === 401 && attempt === 0) {
      token = null;
      continue;
    }
    const body = (await res.json().catch(() => null)) as { data?: T; errors?: unknown } | null;
    if (!res.ok || !body || body.errors) {
      throw new ShopifyError(`Shopify ${res.status}: ${JSON.stringify(body?.errors ?? body).slice(0, 500)}`);
    }
    return body.data as T;
  }
}

// ---------- Catálogo: precio, variante y fotos de cada producto ----------

export type ShopifyProducto = {
  id: string;
  activo: boolean;
  varianteId: string;
  precio: number;
  imagenes: { url: string; alt: string; width: number | null; height: number | null }[];
};

type CatalogoQuery = {
  nodes: ({
    id: string;
    title: string;
    status: string;
    variants: { nodes: { id: string; price: string }[] };
    media: { nodes: { image?: { url: string; altText: string | null; width: number | null; height: number | null } | null }[] };
  } | null)[];
};

export async function productosShopify(ids: string[]): Promise<Map<string, ShopifyProducto>> {
  const data = await adminGraphql<CatalogoQuery>(
    `query Catalogo($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          status
          variants(first: 1) { nodes { id price } }
          media(first: 12) { nodes { ... on MediaImage { image { url altText width height } } } }
        }
      }
    }`,
    { ids },
  );
  const out = new Map<string, ShopifyProducto>();
  for (const p of data.nodes) {
    const variante = p?.variants.nodes[0];
    if (!p || !variante) continue;
    out.set(p.id, {
      id: p.id,
      activo: p.status === "ACTIVE",
      varianteId: variante.id,
      precio: Math.round(Number(variante.price)),
      imagenes: p.media.nodes
        .map((m) => m.image)
        .filter((i): i is NonNullable<typeof i> => Boolean(i?.url))
        .map((i) => ({ url: i.url, alt: i.altText || p.title, width: i.width, height: i.height })),
    });
  }
  return out;
}

// ---------- Pedidos ----------

export type LineaPedido = { varianteId: string; cantidad: number; precioUnitario: number };

export type NuevoPedido = {
  /** Con el combo de 2 el precio se reparte para que Dropi cobre el total exacto (ver /api/pedido). */
  lineas: LineaPedido[];
  nombre: string;
  apellido: string;
  /** 10 dígitos, empieza por 3. */
  celular: string;
  direccion: string;
  /** Apto, torre o punto de referencia (opcional). Va en address1 después de la dirección. */
  complemento?: string;
  barrio: string;
  ciudad: string;
  departamentoCodigo: string;
  nota: string;
  atributos: { key: string; value: string }[];
  /** Etiquetas extra (por ejemplo la fuente del anuncio). */
  etiquetas?: string[];
};

export type PedidoCreado = {
  id: string;
  nombre: string;
  numero: string;
  total: number;
  /** Ya había otro pedido (no cancelado) de este celular en las últimas 24 horas. */
  repetido: boolean;
};

type UserError = { field: string[] | null; message: string };

/**
 * Busca el cliente por celular o lo crea. Shopify no deja crearlo dentro del pedido sin correo,
 * por eso va aparte. Si algo falla, el pedido igual se crea sin cliente.
 */
async function cliente(e164: string, nombre: string, apellido: string): Promise<{ id: string; nuevo: boolean } | null> {
  // Búsqueda directa (no depende del índice de búsqueda, que tarda unos segundos en actualizarse).
  const buscar = async () =>
    (
      await adminGraphql<{ customerByIdentifier: { id: string } | null }>(
        `query Cliente($tel: String!) { customerByIdentifier(identifier: { phoneNumber: $tel }) { id } }`,
        { tel: e164 },
      )
    ).customerByIdentifier?.id ?? null;
  try {
    const existente = await buscar();
    if (existente) return { id: existente, nuevo: false };
    const created = await adminGraphql<{ customerCreate: { customer: { id: string } | null; userErrors: UserError[] } }>(
      `mutation NuevoCliente($input: CustomerInput!) {
        customerCreate(input: $input) { customer { id } userErrors { field message } }
      }`,
      { input: { phone: e164, firstName: nombre, lastName: apellido, tags: ["web"] } },
    );
    if (created.customerCreate.customer) return { id: created.customerCreate.customer.id, nuevo: true };
    // Si otro pedido lo acaba de crear (celular ya usado), se busca otra vez.
    console.warn("customerCreate", created.customerCreate.userErrors);
    const otraVez = await buscar();
    return otraVez ? { id: otraVez, nuevo: false } : null;
  } catch (error) {
    console.warn("Cliente de Shopify", error);
    return null;
  }
}

/**
 * ¿Este cliente (buscado por celular) ya tiene un pedido sin cancelar en las últimas `horas`?
 * La búsqueda de pedidos no acepta `phone:`, por eso se filtra por el cliente. Si falla, responde que no.
 */
async function pedidoReciente(clienteGid: string, horas = 24): Promise<boolean> {
  const id = clienteGid.split("/").pop();
  if (!id) return false;
  const desde = new Date(Date.now() - horas * 3_600_000).toISOString().replace(/\.\d+Z$/, "Z");
  try {
    const data = await adminGraphql<{ orders: { nodes: { id: string; cancelledAt: string | null }[] } }>(
      `query Recientes($q: String!) { orders(first: 5, query: $q, sortKey: CREATED_AT, reverse: true) { nodes { id cancelledAt } } }`,
      { q: `customer_id:${id} AND created_at:>='${desde}'` },
    );
    return data.orders.nodes.some((o) => !o.cancelledAt);
  } catch (error) {
    console.warn("Pedidos recientes de Shopify", error);
    return false;
  }
}

/**
 * Crea el pedido contraentrega: pago pendiente "Contraentrega", envío gratis y etiquetas
 * web + por-confirmar (+ repetido si el mismo celular pidió en las últimas 24 horas).
 * No se envía a Dropi: eso se hace a mano después del "SÍ CONFIRMO".
 */
export async function crearPedido(p: NuevoPedido): Promise<PedidoCreado> {
  const e164 = `+57${p.celular}`;
  const total = p.lineas.reduce((n, l) => n + l.precioUnitario * l.cantidad, 0);
  const money = (amount: number) => ({ shopMoney: { amount: amount.toFixed(2), currencyCode: "COP" } });

  const direccion = {
    firstName: p.nombre,
    lastName: p.apellido,
    address1: p.complemento ? `${p.direccion}, ${p.complemento}` : p.direccion,
    address2: p.barrio,
    city: p.ciudad,
    provinceCode: p.departamentoCodigo,
    countryCode: "CO",
    phone: e164,
  };

  const c = await cliente(e164, p.nombre, p.apellido);
  const repetido = c && !c.nuevo ? await pedidoReciente(c.id) : false;
  const order = {
    currency: "COP",
    lineItems: p.lineas.map((l) => ({
      variantId: l.varianteId,
      quantity: l.cantidad,
      priceSet: money(l.precioUnitario),
      requiresShipping: true,
    })),
    financialStatus: "PENDING",
    transactions: [{ kind: "SALE", status: "PENDING", gateway: "Contraentrega", amountSet: money(total) }],
    shippingAddress: direccion,
    billingAddress: direccion,
    shippingLines: [{ title: "Envío gratis", code: "envio-gratis", priceSet: money(0) }],
    tags: ["web", "por-confirmar", ...(repetido ? ["repetido"] : []), ...(p.etiquetas ?? [])],
    note: repetido ? `${p.nota}\nOjo: este celular ya tiene otro pedido de las últimas 24 horas.` : p.nota,
    customAttributes: p.atributos,
    ...(c ? { customer: { toAssociate: { id: c.id } } } : {}),
  };

  const mutation = `mutation Pedido($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
    orderCreate(order: $order, options: $options) {
      userErrors { field message }
      order { id name totalPriceSet { shopMoney { amount } } }
    }
  }`;
  const options = { inventoryBehaviour: "BYPASS", sendReceipt: false, sendFulfillmentReceipt: false };

  type Res = { orderCreate: { userErrors: UserError[]; order: { id: string; name: string; totalPriceSet: { shopMoney: { amount: string } } } | null } };
  const res = await adminGraphql<Res>(mutation, { order, options });
  const creado = res.orderCreate.order;
  if (!creado) throw new ShopifyError(`orderCreate: ${JSON.stringify(res.orderCreate.userErrors).slice(0, 500)}`);
  return {
    id: creado.id,
    nombre: creado.name,
    numero: creado.name.replace(/^#/, ""),
    total: Math.round(Number(creado.totalPriceSet.shopMoney.amount)),
    repetido,
  };
}
