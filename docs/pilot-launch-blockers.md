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


## 4. In-memory rate limiter unreliable on serverless — FIXED
- Was: lib/rate-limit.ts used an in-memory Map, unreliable across Vercel serverless invocations.
- Fixed: replaced with lib/rate-limit-db.ts (Supabase-backed), applied to /api/scan and all OTP flows in actions/auth.ts.
- Verified working via manual curl test — 5 allowed, subsequent requests correctly blocked with 429.

## 5. Notification flood via multiple IPs — FIXED
- Was: rate limiting only applied per-IP, so an attacker using multiple IPs (VPNs) could still flood a guardian with notifications.
- Fixed: added a second rate limit layer keyed by bracelet_id (15 scans/hour), independent of IP.
- Verified working via manual test — 5 scans recorded correctly under the bracelet-specific key.
