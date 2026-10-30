-- Rediseño Gafas Latam: catálogo de varios modelos, redes y video de portada.

-- Catálogo: etiquetas para los filtros (camara, audio, sol), etiqueta comercial y video de lo que graba.
alter table public.products
  add column tags text[] not null default '{}'::text[]
    check (tags <@ array['camara', 'audio', 'sol']::text[]),
  add column badge text,
  add column video_url text;

-- Redes y portada.
alter table public.store_settings
  add column instagram_handle text,
  add column tiktok_handle text,
  add column facebook_url text,
  add column hero_video_url text,
  add column hero_poster_url text;

-- El bucket también acepta videos cortos (mp4/webm) para la portada y los modelos.
update storage.buckets
   set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'],
       file_size_limit = 15728640
 where id = 'product-images';

-- El brief prohíbe fotos de banco: se quitan las imágenes de Unsplash de muestra.
update public.products
   set images = coalesce((
         select jsonb_agg(img) from jsonb_array_elements(images) img
          where img->>'url' not like 'https://images.unsplash.com/%'), '[]'::jsonb),
       moments = coalesce((
         select jsonb_agg(m) from jsonb_array_elements(moments) m
          where m->>'url' not like 'https://images.unsplash.com/%'), '[]'::jsonb);
