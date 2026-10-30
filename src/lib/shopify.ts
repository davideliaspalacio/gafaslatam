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

export type NuevoPedido = {
  varianteId: string;
  titulo: string;
  cantidad: number;
  precioUnitario: number;
  nombre: string;
  apellido: string;
  /** 10 dígitos, empieza por 3. */
  celular: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  departamentoCodigo: string;
  nota: string;
  atributos: { key: string; value: string }[];
};

export type PedidoCreado = { id: string; nombre: string; numero: string; total: number };

type UserError = { field: string[] | null; message: string };

async function clientePorCelular(e164: string): Promise<string | null> {
  try {
    const data = await adminGraphql<{ customers: { nodes: { id: string }[] } }>(
      `query Cliente($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`,
      { q: `phone:${e164}` },
    );
    return data.customers.nodes[0]?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Crea el pedido contraentrega: pago pendiente "Contraentrega", envío gratis y etiquetas
 * web + por-confirmar. No se envía a Dropi: eso se hace a mano después del "SÍ CONFIRMO".
 */
export async function crearPedido(p: NuevoPedido): Promise<PedidoCreado> {
  const e164 = `+57${p.celular}`;
  const total = p.precioUnitario * p.cantidad;
  const money = (amount: number) => ({ shopMoney: { amount: amount.toFixed(2), currencyCode: "COP" } });

  const direccion = {
    firstName: p.nombre,
    lastName: p.apellido,
    address1: p.direccion,
    address2: p.barrio,
    city: p.ciudad,
    provinceCode: p.departamentoCodigo,
    countryCode: "CO",
    phone: e164,
  };

  const existente = await clientePorCelular(e164);
  const base = {
    currency: "COP",
    lineItems: [{ variantId: p.varianteId, quantity: p.cantidad, priceSet: money(p.precioUnitario), requiresShipping: true }],
    financialStatus: "PENDING",
    transactions: [{ kind: "SALE", status: "PENDING", gateway: "Contraentrega", amountSet: money(total) }],
    shippingAddress: direccion,
    billingAddress: direccion,
    shippingLines: [{ title: "Envío gratis", code: "envio-gratis", priceSet: money(0) }],
    tags: ["web", "por-confirmar"],
    note: p.nota,
    customAttributes: p.atributos,
  };
  const conCliente = {
    ...base,
    customer: existente
      ? { toAssociate: { id: existente } }
      : { toUpsert: { phone: e164, firstName: p.nombre, lastName: p.apellido, tags: ["web"] } },
  };

  const mutation = `mutation Pedido($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
    orderCreate(order: $order, options: $options) {
      userErrors { field message }
      order { id name totalPriceSet { shopMoney { amount } } }
    }
  }`;
  const options = { inventoryBehaviour: "BYPASS", sendReceipt: false, sendFulfillmentReceipt: false };

  type Res = { orderCreate: { userErrors: UserError[]; order: { id: string; name: string; totalPriceSet: { shopMoney: { amount: string } } } | null } };
  let res = await adminGraphql<Res>(mutation, { order: conCliente, options });

  // Si el cliente choca (ej. celular repetido en otro cliente), el pedido igual se crea sin él.
  if (!res.orderCreate.order && res.orderCreate.userErrors.some((u) => u.field?.some((f) => /customer|phone/i.test(f)))) {
    console.warn("orderCreate cliente", res.orderCreate.userErrors);
    res = await adminGraphql<Res>(mutation, { order: base, options });
  }

  const order = res.orderCreate.order;
  if (!order) throw new ShopifyError(`orderCreate: ${JSON.stringify(res.orderCreate.userErrors).slice(0, 500)}`);
  return {
    id: order.id,
    nombre: order.name,
    numero: order.name.replace(/^#/, ""),
    total: Math.round(Number(order.totalPriceSet.shopMoney.amount)),
  };
}
