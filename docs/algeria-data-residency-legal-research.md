# Legal Research — Algeria Data Protection & Data Residency (Task 8, Milestone 6)

**Status:** Research complete. Not legal advice — recommend a licensed Algerian lawyer review before public launch, especially given minors' data is involved.
**Date researched:** August 2026

---

## 1. The applicable law

**Law No. 18-07** (10 June 2018) — Algeria's primary personal data protection law, recently amended by **Law No. 25-11** (24 July 2025). The amendment moves the framework closer to GDPR: mandatory DPO appointment, DPIA requirements for high-risk processing, and clearer international transfer rules.

**Regulator:** ANPDP (Autorité Nationale de Protection des Données à Caractère Personnel), under the Ministry of Justice.

**⚠️ Important caveat found in research:** at least one source (Data Protection Africa, dated March 2025) states the law provides a one-year compliance grace period *from the date the ANPDP is established*, but **the authority had not yet been created as of that writing**, meaning the law technically wasn't yet being enforced. This detail is time-sensitive and **must be re-verified with current sources** — specifically, sources dated after the July 2025 amendment mention the authority operating (issuing declarations, receiving breach notifications), so this may have changed. Do not treat SafeTag's compliance posture as settled based on this alone.

---

## 2. Does the law apply to SafeTag?

**Yes, clearly.** The law applies to:
- Any entity operating in Algerian territory (you, based in Skikda), **and**
- Any entity using automated means located in Algeria to process personal data, even without being established there

SafeTag collects personal data (guardian phone numbers, emails, children's first names, scan locations) from people physically in Algeria. This is squarely in scope.

---

## 3. Data residency / localization — the actual answer

This was the specific open question from the architecture doc. The research found:

- **Algeria is one of the African countries with an explicit data localization stance.** Article 44 of Law 18-07 (referenced in a CIPESA policy brief) **prohibits transfer of personal data to a foreign state when it is likely to harm public security or the vital interests of Algeria.**
- This is **not a blanket "all data must stay in Algeria" rule** — it's a conditional restriction tied to public security/national interest, plus a general requirement that **any transfer abroad requires either an adequacy finding for the receiving country or prior ANPDP authorization** (with exceptions: explicit consent, contractual necessity, legal obligation, public interest, court proceedings).
- Separately, an ARPCE (telecom regulator) directive on cloud computing and the 2018 e-commerce law are cited as additional sources with localization-adjacent provisions — **not reviewed in detail here**, flagged for follow-up if the project scales.

**Practical reading for SafeTag's current architecture (Supabase, likely EU/US hosting region):**
- Storing guardian and child data on Supabase's non-Algerian servers is a **cross-border transfer** under this law.
- This is very likely **permitted**, not prohibited outright, provided:
  1. Guardians give **explicit, informed consent** to the transfer (standard consent language in signup/onboarding should cover this — not yet built into SafeTag's current flow), **and**
  2. The processing doesn't fall into the "harms public security or vital interests" carve-out (a child-safety product reuniting lost children with parents is very unlikely to trigger this, but this is a judgment call, not a certainty).

---

## 4. Other concrete obligations this law creates for SafeTag

Beyond the residency question, the research surfaced obligations not yet addressed anywhere in the project's design docs — worth tracking as their own checklist:

| Obligation | Current SafeTag status |
|---|---|
| **Prior declaration to ANPDP** before processing personal data | ❌ Not done — needs research into the actual filing process |
| **Explicit, informed consent** before collecting data | ⚠️ Partial — OTP login implies consent to *some* processing, but no explicit privacy policy / consent screen exists yet |
| **DPO appointment** (mandatory under the 2025 amendment) | ❌ Not done — as a solo founder, you may need to appoint yourself formally or determine if a small-scale operation is exempt (unclear from research, needs a lawyer) |
| **Breach notification to ANPDP within 5 days** | ❌ No incident-response process defined yet |
| **DPIA for high-risk processing** | ⚠️ Arguably required — this product processes children's location data, which is plausibly "high-risk" | 
| **Right to withdraw consent at any time** | ❌ No account/data deletion flow exists yet for guardians |
| **Data minimization / purpose limitation** | ✅ Largely followed already — SafeTag's architecture deliberately minimizes what's collected and exposed (documented in prior design docs) |

---

## 5. What this means for SafeTag's launch plan

**Does this block the pilot?** No — but it means the "resolve before public launch" framing from the original PRD risk list was correct, and the scope is broader than just "where is data hosted."

**Recommended before any public pilot (not before internal dev/testing):**
1. **Consult a licensed Algerian lawyer** familiar with Law 18-07 — this document is a starting point, not a substitute. The one-year grace period / ANPDP-not-yet-established detail alone needs professional confirmation of current status.
2. **Add an explicit consent screen** at guardian signup, covering: what's collected, why, that it's processed on servers outside Algeria (Supabase), and get affirmative consent.
3. **Draft a basic privacy policy** — currently absent from the entire project.
4. **File the prior declaration with ANPDP** (or confirm with a lawyer that this isn't yet operationally possible/required given the authority's establishment status).
5. **Build a guardian data-deletion flow** — currently missing; needed both for the "withdraw consent" right and general good practice.

**Not urgent for pilot scale, but track for later:**
- Formal DPO appointment
- Documented DPIA
- Breach response runbook

---

## 6. Sources

- CookieScript: Algeria Data Protection Law 18-07 and Amendments
- CookieYes: Guide on Algeria Data Protection Law
- DLA Piper: Data Protection Laws of the World — Algeria
- Signzy: Algeria Law 18-07 Explained
- CIPESA: "Which Way for Data Localisation in Africa?" (policy brief, cites Article 44 specifically)
- Data Protection Africa: Algeria Fact Sheet
- CMS Expert Guide: Data protection and cybersecurity laws in Algeria
- Gide: Personal Data Protection — Overview of Algerian Regulations

All sources are secondary (law firm/compliance-vendor summaries), not the primary legal text itself. **A primary-source read of Law 18-07 and Law 25-11 (in Arabic or French, the official languages) by a qualified lawyer remains the necessary next step** — this research is sufficient to unblock continued development, not to certify compliance.
