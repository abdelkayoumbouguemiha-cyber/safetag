-- SafeTag — Initial Schema + RLS Policies
-- Migration: 0001_initial_schema_and_rls.sql

-- ============================================
-- TABLES
-- ============================================

create table guardians (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  backup_email text,
  full_name text,
  created_at timestamptz default now()
);

create table children_bracelets (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid references guardians(id),
  child_first_name text,
  status text not null default 'unactivated'
    check (status in ('unactivated','active','inactive')),
  created_at timestamptz default now(),
  activated_at timestamptz
);

create table scan_logs (
  id uuid primary key default gen_random_uuid(),
  bracelet_id uuid references children_bracelets(id) not null,
  ip_address inet not null,
  consent_given boolean not null default false,
  approx_lat double precision,
  approx_lng double precision,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  scan_log_id uuid references scan_logs(id) not null,
  channel text not null check (channel in ('push','sms','email')),
  status text not null check (status in ('sent','delivered','failed')),
  sent_at timestamptz default now()
);

create table scan_acknowledgements (
  scan_log_id uuid primary key references scan_logs(id),
  status text not null check (status in ('acknowledged','resolved')),
  updated_at timestamptz default now()
);

-- ============================================
-- RLS: guardians
-- ============================================

alter table guardians enable row level security;

create policy "guardians_select_own"
on guardians
for select
using (id = auth.uid());

create policy "guardians_insert_own"
on guardians
for insert
with check (id = auth.uid());

create policy "guardians_update_own"
on guardians
for update
using (id = auth.uid())
with check (id = auth.uid());

-- ============================================
-- RLS: children_bracelets
-- ============================================

alter table children_bracelets enable row level security;

create policy "bracelets_select_own"
on children_bracelets
for select
using (guardian_id = auth.uid());

create policy "bracelets_update_own"
on children_bracelets
for update
using (guardian_id = auth.uid())
with check (guardian_id = auth.uid());

create policy "bracelets_activate_unclaimed"
on children_bracelets
for update
using (guardian_id is null and status = 'unactivated')
with check (guardian_id = auth.uid());

-- Note: no INSERT policy — bracelet rows are created only via
-- the service_role-backed generate-codes Edge Function.

-- ============================================
-- RLS: scan_logs
-- ============================================

alter table scan_logs enable row level security;

create policy "scan_logs_select_own"
on scan_logs
for select
using (
  bracelet_id in (
    select id from children_bracelets where guardian_id = auth.uid()
  )
);

-- Note: no INSERT policy — scan_logs rows are written only via
-- the service_role client inside the /api/scan route handler
-- (never directly from the browser), so all rate limiting and
-- validation logic is enforced before any row is written.

-- ============================================
-- RLS: notifications
-- ============================================

alter table notifications enable row level security;

-- Note: no policies at all — this table is fully locked to any
-- client (anon or authenticated). Only service_role (used inside
-- the notify-guardian Edge Function) can read/write it.

-- ============================================
-- RLS: scan_acknowledgements
-- ============================================

alter table scan_acknowledgements enable row level security;

create policy "acknowledgements_select_own"
on scan_acknowledgements
for select
using (
  scan_log_id in (
    select sl.id from scan_logs sl
    join children_bracelets cb on cb.id = sl.bracelet_id
    where cb.guardian_id = auth.uid()
  )
);

create policy "acknowledgements_insert_own"
on scan_acknowledgements
for insert
with check (
  scan_log_id in (
    select sl.id from scan_logs sl
    join children_bracelets cb on cb.id = sl.bracelet_id
    where cb.guardian_id = auth.uid()
  )
);

create policy "acknowledgements_update_own"
on scan_acknowledgements
for update
using (
  scan_log_id in (
    select sl.id from scan_logs sl
    join children_bracelets cb on cb.id = sl.bracelet_id
    where cb.guardian_id = auth.uid()
  )
)
with check (
  scan_log_id in (
    select sl.id from scan_logs sl
    join children_bracelets cb on cb.id = sl.bracelet_id
    where cb.guardian_id = auth.uid()
  )
);
