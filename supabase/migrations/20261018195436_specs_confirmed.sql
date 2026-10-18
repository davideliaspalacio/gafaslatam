-- La ficha técnica solo se publica cuando el equipo la confirma con el proveedor.
alter table public.products
  add column specs_confirmed boolean not null default false;

-- Las fotos de muestra (no del producto real) llevan "sample": true y se rotulan en la tienda.
update public.products
   set images = (
     select coalesce(jsonb_agg(case when img->>'url' like 'https://images.unsplash.com/%'
                                    then img || '{"sample": true}'::jsonb else img end), '[]'::jsonb)
       from jsonb_array_elements(images) img
   ),
       bundles = (
     select coalesce(jsonb_agg(case when (b->>'qty')::int = 2 and b->>'label' = '2 pares'
                                    then b || '{"label": "Doble copia · 2 pares"}'::jsonb else b end), '[]'::jsonb)
       from jsonb_array_elements(bundles) b
   );
