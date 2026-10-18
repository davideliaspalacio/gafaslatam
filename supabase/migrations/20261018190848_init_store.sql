-- Tienda de gafas: esquema inicial
-- Pedidos y visitas se escriben solo desde el servidor (clave secreta).
-- El panel lee y edita a través de RLS con usuarios listados en public.admins.

create type public.order_status as enum (
  'nuevo', 'confirmado', 'enviado', 'entregado', 'cancelado', 'devuelto'
);
create type public.payment_method as enum ('contraentrega', 'online');
create type public.payment_status as enum ('pendiente', 'pagado', 'fallido');

-- ---------------------------------------------------------------------------
-- Administradores
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Ajustes de la tienda (una sola fila)
-- ---------------------------------------------------------------------------
create table public.store_settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null,
  whatsapp_number text,              -- formato internacional sin "+", ej. 573001234567
  support_email text,
  announcement text,                 -- franja superior; vacío = oculta
  shipping_cost integer not null default 0 check (shipping_cost >= 0),
  free_shipping boolean not null default true,
  delivery_estimate text not null default '2 a 5 días hábiles',
  cod_enabled boolean not null default true,
  online_payment_enabled boolean not null default false,
  tiktok_pixel_id text,
  meta_pixel_id text,
  legal_name text,                   -- razón social o nombre del responsable (Ley 1480, art. 50)
  tax_id text,                       -- NIT o cédula
  legal_address text,                -- dirección física de contacto
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Productos
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  headline text,                     -- frase principal de la primera pantalla
  short_description text,
  description text,
  price integer not null check (price >= 0),          -- COP, sin decimales
  compare_at_price integer check (compare_at_price is null or compare_at_price > 0),
  images jsonb not null default '[]'::jsonb,           -- [{url, alt}]
  moments jsonb not null default '[]'::jsonb,          -- tomas en primera persona [{url, caption, stamp, sample}]
  variants jsonb not null default '[]'::jsonb,         -- [{id, name, swatch}]
  bundles jsonb not null default '[]'::jsonb,          -- [{qty, price, label, badge}]
  features jsonb not null default '[]'::jsonb,         -- [{title, body}]
  specs jsonb not null default '[]'::jsonb,            -- [{value, unit, label}]
  faq jsonb not null default '[]'::jsonb,              -- [{q, a}]
  in_the_box jsonb not null default '[]'::jsonb,       -- ["Gafas", "Cable USB-C", ...]
  stock integer check (stock is null or stock >= 0),   -- null = sin control de stock
  active boolean not null default true,
  featured boolean not null default false,
  sort integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_active_sort_idx on public.products (active, sort);

-- ---------------------------------------------------------------------------
-- Pedidos
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity (start with 1001) unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status public.order_status not null default 'nuevo',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'pendiente',
  payment_reference text unique,
  payment_provider_id text,

  customer_name text not null,
  phone text not null,
  email text,
  department text not null,
  city text not null,
  address text not null,
  address_details text,
  notes text,

  items jsonb not null,              -- [{product_id, name, variant, qty, unit_price, line_total}]
  subtotal integer not null,
  shipping integer not null default 0,
  total integer not null,
  currency text not null default 'COP',

  -- atribución de campañas
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ttclid text,
  fbclid text,
  landing_page text,
  referrer text,
  user_agent text,
  ip inet,
  event_id text,                     -- deduplicación píxel / API de eventos

  -- operación
  carrier text,
  tracking_number text,
  admin_notes text
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status);
create index orders_phone_idx on public.orders (phone);

-- ---------------------------------------------------------------------------
-- Visitas (una por sesión de navegador) para medir conversión por campaña
-- ---------------------------------------------------------------------------
create table public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null unique,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  ttclid text,
  landing_page text,
  referrer text,
  user_agent text
);

create index visits_created_at_idx on public.visits (created_at desc);

-- ---------------------------------------------------------------------------
-- Reseñas (solo reales, cargadas por el equipo)
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete cascade,
  author text not null,
  city text,
  rating smallint not null default 5 check (rating between 1 and 5),
  body text not null,
  photo_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index reviews_product_published_idx on public.reviews (product_id, published);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();
create trigger store_settings_touch before update on public.store_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Stock: descuento atómico (solo servidor)
-- ---------------------------------------------------------------------------
create or replace function public.decrement_stock(p_product_id uuid, p_qty integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated integer;
begin
  update public.products
     set stock = stock - p_qty
   where id = p_product_id
     and stock is not null
     and stock >= p_qty;
  get diagnostics updated = row_count;
  return updated > 0
      or exists (select 1 from public.products where id = p_product_id and stock is null);
end;
$$;

revoke all on function public.decrement_stock(uuid, integer) from public, anon, authenticated;
grant execute on function public.decrement_stock(uuid, integer) to service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.store_settings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.visits enable row level security;
alter table public.reviews enable row level security;

create policy "admins ven su propia fila" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "ajustes públicos" on public.store_settings
  for select to anon, authenticated using (true);
create policy "admins editan ajustes" on public.store_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "productos activos públicos" on public.products
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "admins crean productos" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins editan productos" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins borran productos" on public.products
  for delete to authenticated using ((select public.is_admin()));

create policy "admins ven pedidos" on public.orders
  for select to authenticated using ((select public.is_admin()));
create policy "admins editan pedidos" on public.orders
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins ven visitas" on public.visits
  for select to authenticated using ((select public.is_admin()));

create policy "reseñas publicadas públicas" on public.reviews
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admins crean reseñas" on public.reviews
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins editan reseñas" on public.reviews
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins borran reseñas" on public.reviews
  for delete to authenticated using ((select public.is_admin()));

grant select on public.store_settings, public.products, public.reviews to anon;
grant select, insert, update, delete on public.store_settings, public.products, public.reviews,
  public.orders, public.visits, public.admins to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

-- ---------------------------------------------------------------------------
-- Imágenes de producto (Storage)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "admins suben imágenes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy "admins editan imágenes" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));
create policy "admins borran imágenes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));
