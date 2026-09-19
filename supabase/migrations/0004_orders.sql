-- Orders (cash on delivery) — written only via service_role from a server action.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  full_name text not null check (char_length(full_name) between 3 and 100),
  phone text not null check (phone ~ '^0[5-7][0-9]{8}$'),

  wilaya_code smallint not null check (wilaya_code between 1 and 58),
  wilaya_name text not null,
  commune text not null check (char_length(commune) between 2 and 100),

  delivery_type text not null check (delivery_type in ('home', 'desk')),
  address text check (address is null or char_length(address) <= 250),

  quantity smallint not null check (quantity between 1 and 20),
  unit_price integer not null check (unit_price >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),

  status text not null default 'new'
    check (status in ('new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
  customer_note text check (customer_note is null or char_length(customer_note) <= 500),
  admin_note text,

  ip_address inet,
  updated_at timestamptz not null default now(),

  constraint address_required_for_home
    check (delivery_type <> 'home' or address is not null)
);

create index if not exists idx_orders_status_created on orders (status, created_at desc);
create index if not exists idx_orders_created on orders (created_at desc);

-- RLS enabled with NO policies: only service_role (server actions) can access.
alter table orders enable row level security;
