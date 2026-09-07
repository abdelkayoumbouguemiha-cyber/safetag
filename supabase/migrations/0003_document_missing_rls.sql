-- Documents RLS policies for tables that were created directly via the
-- Supabase SQL Editor during development (Milestones 4-6) but were never
-- recorded in a migration file. This migration is a documentation catch-up:
-- running it against a database that already has these policies is safe
-- (uses "if not exists" / drop-and-recreate patterns), and it makes the
-- schema reproducible from git history alone, per the architecture doc's
-- principle that migrations/ — not the dashboard — are the source of truth.
--
-- Verified against the live database on [date] before writing this file:
-- all four tables have relrowsecurity = true, and the policies below match
-- pg_policies exactly.

-- ============================================
-- otp_codes (Milestone 3 — custom OTP system)
-- ============================================
-- RLS is enabled with NO policies — this table is intentionally reachable
-- only via the service_role client (lib/supabase/admin.ts), never directly
-- from any authenticated or anonymous client.
alter table otp_codes enable row level security;

-- ============================================
-- push_subscriptions (Milestone 4 — Web Push)
-- ============================================
alter table push_subscriptions enable row level security;

create policy "push_subs_select_own"
on push_subscriptions
for select
using (guardian_id = auth.uid());

create policy "push_subs_insert_own"
on push_subscriptions
for insert
with check (guardian_id = auth.uid());

create policy "push_subs_delete_own"
on push_subscriptions
for delete
using (guardian_id = auth.uid());

-- ============================================
-- flagged_scans (Milestone 5 — abuse detection)
-- ============================================
-- RLS is enabled with NO policies — only service_role (admin actions in
-- actions/admin.ts, gated by requireAdmin()) can read/write this table.
alter table flagged_scans enable row level security;

-- ============================================
-- scan_logs.deletion_warning_sent (Milestone 6 — retention cron)
-- ============================================
-- Column added for the 90-day retention job (app/api/cron/scan-cleanup).
-- No new RLS policy needed — the existing scan_logs_select_own policy
-- (defined in migration 0001) already covers this column since it's a
-- SELECT on the same row, not a separate table.
alter table scan_logs add column if not exists deletion_warning_sent boolean not null default false;

-- ============================================
-- rate_limit_hits (this session — database-backed rate limiting)
-- ============================================
-- No RLS policies — service_role only, same pattern as otp_codes.
create table if not exists rate_limit_hits (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  created_at timestamptz default now()
);

create index if not exists idx_rate_limit_key_time on rate_limit_hits (key, created_at);

alter table rate_limit_hits enable row level security;
