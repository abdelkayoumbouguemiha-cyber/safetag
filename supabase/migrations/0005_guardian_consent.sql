-- Adds consent tracking to guardians, required by Algeria's Law 18-07
-- (amended by Law 25-11): guardians must give explicit, informed consent
-- before their personal data (and their child's) is processed, including
-- the cross-border transfer to Supabase's hosting region.
--
-- consent_accepted_at: timestamp of the most recent consent action.
--   NULL means the guardian has not yet consented (existing guardians
--   before this migration will have NULL and will be prompted on next
--   login, handled in application logic, not by this migration).
-- consent_policy_version: which version of the privacy policy text was
--   shown/accepted, so a future policy change doesn't silently count as
--   "already consented." Bump this string in code whenever the policy
--   text materially changes.

alter table guardians
  add column if not exists consent_accepted_at timestamptz,
  add column if not exists consent_policy_version text;
