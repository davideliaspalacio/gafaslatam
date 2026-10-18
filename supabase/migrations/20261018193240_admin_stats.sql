-- Estadísticas del panel calculadas en la base de datos (evita el límite de filas de la API).
-- security invoker: se aplican las políticas RLS del admin que consulta.

create or replace function public.admin_summary(p_days integer default 7)
returns table (
  orders_today bigint,
  revenue_today bigint,
  orders_period bigint,
  revenue_period bigint,
  visits_period bigint,
  pending_confirmation bigint,
  delivered_period bigint,
  returned_period bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with bounds as (
    select
      date_trunc('day', now() at time zone 'America/Bogota') at time zone 'America/Bogota' as today_start,
      now() - make_interval(days => p_days) as period_start
  )
  select
    (select count(*) from public.orders o, bounds b
      where o.created_at >= b.today_start and o.status not in ('cancelado')),
    (select coalesce(sum(o.total), 0) from public.orders o, bounds b
      where o.created_at >= b.today_start and o.status not in ('cancelado', 'devuelto')),
    (select count(*) from public.orders o, bounds b
      where o.created_at >= b.period_start and o.status not in ('cancelado')),
    (select coalesce(sum(o.total), 0) from public.orders o, bounds b
      where o.created_at >= b.period_start and o.status not in ('cancelado', 'devuelto')),
    (select count(*) from public.visits v, bounds b where v.created_at >= b.period_start),
    (select count(*) from public.orders o where o.status = 'nuevo'),
    (select count(*) from public.orders o, bounds b
      where o.created_at >= b.period_start and o.status = 'entregado'),
    (select count(*) from public.orders o, bounds b
      where o.created_at >= b.period_start and o.status = 'devuelto');
$$;

create or replace function public.admin_campaign_stats(p_days integer default 7)
returns table (
  source text,
  campaign text,
  visits bigint,
  orders bigint,
  revenue bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with since as (select now() - make_interval(days => p_days) as t),
  v as (
    select coalesce(nullif(utm_source, ''), 'directo') as source,
           coalesce(nullif(utm_campaign, ''), '—') as campaign,
           count(*) as visits
      from public.visits, since where created_at >= since.t
     group by 1, 2
  ),
  o as (
    select coalesce(nullif(utm_source, ''), 'directo') as source,
           coalesce(nullif(utm_campaign, ''), '—') as campaign,
           count(*) as orders,
           coalesce(sum(total) filter (where status not in ('cancelado', 'devuelto')), 0) as revenue
      from public.orders, since
     where created_at >= since.t and status <> 'cancelado'
     group by 1, 2
  )
  select coalesce(v.source, o.source), coalesce(v.campaign, o.campaign),
         coalesce(v.visits, 0), coalesce(o.orders, 0), coalesce(o.revenue, 0)::bigint
    from v full outer join o on v.source = o.source and v.campaign = o.campaign
   order by coalesce(o.orders, 0) desc, coalesce(v.visits, 0) desc
   limit 50;
$$;

revoke all on function public.admin_summary(integer) from public, anon;
revoke all on function public.admin_campaign_stats(integer) from public, anon;
grant execute on function public.admin_summary(integer) to authenticated;
grant execute on function public.admin_campaign_stats(integer) to authenticated;
