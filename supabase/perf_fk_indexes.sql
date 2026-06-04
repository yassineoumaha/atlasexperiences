-- ═════════════════════════════════════════════════════════════════════════════
-- Performance: add covering indexes for unindexed foreign keys (linter 0001).
-- Run in Supabase SQL Editor. Purely ADDITIVE — adding an index cannot break
-- any query or access rule; it only speeds up FK lookups/joins/cascades.
--
-- This block auto-detects EVERY foreign key in `public` that lacks a covering
-- index and creates one, so it covers all flagged tables (blog_posts,
-- destination_photos, and any others) without needing each name spelled out.
--
-- NOTE: the other linter items (auth_rls_initplan, multiple_permissive_policies)
-- are PERFORMANCE-only and harmless at current data volume. They require
-- rewriting RLS policy bodies, which risks changing access control if done
-- wrong, so they are intentionally NOT touched here. Revisit at scale.
-- ═════════════════════════════════════════════════════════════════════════════

do $$
declare
  fk record;
  idx_name text;
  col_list text;
begin
  for fk in
    select
      con.conname        as constraint_name,
      rel.relname        as table_name,
      con.conkey         as col_attnums
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where con.contype = 'f'
      and nsp.nspname = 'public'
      -- only FKs that do NOT already have an index whose leading columns match
      and not exists (
        select 1
        from pg_index i
        where i.indrelid = con.conrelid
          and (i.indkey::smallint[])[0:array_length(con.conkey,1)-1] = con.conkey
      )
  loop
    -- Build the comma-separated column list for the FK's columns.
    select string_agg(quote_ident(att.attname), ', ' order by k.ord)
      into col_list
    from unnest(fk.col_attnums) with ordinality as k(attnum, ord)
    join pg_attribute att
      on att.attrelid = (quote_ident('public') || '.' || quote_ident(fk.table_name))::regclass
     and att.attnum = k.attnum;

    idx_name := 'idx_' || fk.table_name || '_' || fk.constraint_name;
    -- Postgres identifier limit is 63 chars.
    idx_name := left(idx_name, 63);

    execute format(
      'create index if not exists %I on public.%I (%s);',
      idx_name, fk.table_name, col_list
    );
    raise notice 'Indexed FK % on %(%)', fk.constraint_name, fk.table_name, col_list;
  end loop;
end $$;
