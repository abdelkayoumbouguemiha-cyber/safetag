# Pilot Launch Blockers — Must Resolve Before Public Pilot

## 1. Supabase Free Plan has NO automatic backups
- Confirmed directly in Supabase dashboard (Settings → Database → Backups): "Free Plan does not include project backups."
- **Fix**: upgrade to Supabase Pro ($25/month) before the pilot — includes daily automated backups (up to 7 days retention) and Point-in-Time Recovery option.
- Risk if not fixed: total, unrecoverable loss of all guardian/child/scan data on any database failure or mistake.
- Cost is acceptable at pilot scale — do this the week before launch, not after.

## 2. SMS notification channel disabled (Twilio Trial limitation)
- See lib/notifications/notify.ts comments — Twilio Trial requires pre-approved Content Templates, inaccessible without a paid account.
- **Fix**: upgrade to a paid Twilio account before pilot, re-enable the commented-out SMS fallback code.

## 3. Legal — Algeria data protection consent flow
- See docs/algeria-data-residency-legal-research.md
- **Fix**: add explicit consent screen + privacy policy before public guardian signups; consult a lawyer.

