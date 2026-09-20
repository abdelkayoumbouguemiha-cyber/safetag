-- Product color catalog + per-order color breakdown, so a single order
-- can mix multiple colors (e.g. 2 green + 1 yellow) and stock is tracked
-- and decremented safely per color.

-- ============================================
-- product_colors
-- ============================================

create table if not exists product_colors (
  code text primary key,
  name_ar text not null,
  name_fr text not null,
  name_en text not null,
  hex text not null,
  stock integer not null default 0 check (stock >= 0),
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into product_colors (code, name_ar, name_fr, name_en, hex, stock, sort_order) values
  ('white',  'أبيض/كريمي', 'Blanc/Crème',   'White/Cream',  '#f0ead6', 50, 1),
  ('green',  'أخضر فاتح',  'Vert clair',    'Light Green',  '#a8d5ba', 50, 2),
  ('pink',   'وردي',       'Rose',          'Pink',         '#e8b4a8', 50, 3),
  ('blue',   'أزرق فاتح',  'Bleu clair',    'Light Blue',   '#a9c6e8', 50, 4),
  ('navy',   'كحلي',       'Bleu marine',   'Navy',         '#2c3e5c', 50, 5),
  ('yellow', 'أصفر',       'Jaune',         'Yellow',       '#f0d264', 50, 6)
on conflict (code) do nothing;

-- Service-role only, same pattern as otp_codes / rate_limit_hits — colors
-- and stock are read/written through server actions, never directly from
-- the browser, since stock changes must go through the atomic decrement
-- function below.
alter table product_colors enable row level security;

-- ============================================
-- orders.color_breakdown
-- ============================================

alter table orders
  add column if not exists color_breakdown jsonb;

comment on column orders.color_breakdown is
  'Array of {code, quantity} objects, e.g. [{"code":"green","quantity":2},{"code":"yellow","quantity":1}]. Sum of quantities must equal orders.quantity — enforced in application validation (lib/validation/order.ts), not a DB constraint, to keep the check readable.';

-- ============================================
-- decrement_colors_stock: atomic, all-or-nothing stock decrement
-- ============================================
-- Called once per order with the full color breakdown. Locks each
-- relevant row (FOR UPDATE) to avoid race conditions between concurrent
-- orders, checks every color has enough stock, and only then decrements
-- all of them. If any single color is short, the exception raised rolls
-- back the entire function call automatically — no partial decrements.

create or replace function decrement_colors_stock(colors jsonb)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  item_code text;
  item_qty integer;
  current_stock integer;
begin
  -- First pass: lock and validate every requested color has enough stock.
  for item in select * from jsonb_array_elements(colors)
  loop
    item_code := item->>'code';
    item_qty := (item->>'quantity')::integer;

    select stock into current_stock
    from product_colors
    where code = item_code
    for update;

    if current_stock is null then
      raise exception 'Unknown color code: %', item_code;
    end if;

    if current_stock < item_qty then
      raise exception 'Insufficient stock for color %: requested %, available %',
        item_code, item_qty, current_stock;
    end if;
  end loop;

  -- Second pass: all validated, now actually decrement.
  for item in select * from jsonb_array_elements(colors)
  loop
    item_code := item->>'code';
    item_qty := (item->>'quantity')::integer;

    update product_colors
    set stock = stock - item_qty, updated_at = now()
    where code = item_code;
  end loop;

  return true;
end;
$$;

-- Not granted to "authenticated" or "anon" — only the service_role client
-- (used in actions/orders.ts) calls this, consistent with how orders are
-- written only via the service-role client, never directly from the browser.
