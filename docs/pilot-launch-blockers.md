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

## 6. OTP stored in plaintext + logged in production — FIXED
- Was: OTP codes stored as plain 6-digit strings in otp_codes table, and
  console.log'd unconditionally (would appear in Vercel production logs).
- Fixed: codes now hashed with SHA-256 before storage; console.log gated
  behind NODE_ENV === "development" (never true on Vercel).
- Verified: dashboard login still works end-to-end; otp_codes.code column
  now contains a 64-char hash, not the plaintext code.

## 7. Spoofable X-Forwarded-For header — FIXED
- Was: /api/scan trusted the client-controllable X-Forwarded-For header for
  rate limiting, allowing an attacker to bypass IP-based limits by
  sending fake values.
- Fixed: now uses x-vercel-forwarded-for, which Vercel's infrastructure
  sets and cannot be spoofed by the client. Falls back to x-forwarded-for
  only in local development (NODE_ENV === "development"), never in production.
- Verified: scan endpoint still works locally with correct IP logging.

## 8. Phone-based login blocked by Twilio limitations — RESOLVED (architecture change)
- Was: login required SMS OTP via Twilio, which was blocked by Trial account
  Content Template restrictions (see item 2). This meant admin login would
  become impossible in production once console.log was correctly restricted
  to development-only (H1 fix).
- Resolved: switched login to email-based OTP via Resend (already working,
  free tier). Phone number is now optional contact info, saved separately
  via /dashboard/settings, not required for login.
- Impact: item 2 (SMS notification channel) is now lower priority — email
  is the primary guardian-facing channel for both login and scan alerts.
  SMS can still be added later as a scan-notification fallback once on a
  paid Twilio plan, but is no longer a login blocker.

## 9. Reauth OTP not bound to specific action — FIXED (M1)
- Was: confirmReauthOtp() returned a bare { success: true }, with no link
  to a specific bracelet or time window — theoretically allowing a single
  OTP confirmation to be reused across multiple sensitive actions.
- Fixed: confirmReauthOtp() now creates a single-use, 2-minute-expiry
  confirmation token (confirmed_reauth_actions table) tied to the guardian.
  deactivateBracelet() now requires and consumes this token.
- Verified: full deactivate flow tested end-to-end; confirmation row
  correctly marked used=true after successful deactivation.

## Remaining Medium items (deferred, low urgency for solo-founder stage)
- M2: hardcoded ADMIN_USER_ID — fine until a second admin is added
- M4: no explicit session-refresh middleware — Supabase handles this reasonably by default
- M5: GPS consent UX polish — functional as-is
- M6: expired push subscriptions not cleaned up — minor storage/performance, not security
