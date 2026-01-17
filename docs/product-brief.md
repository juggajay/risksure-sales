# RiskSure.AI Product Brief

## Overview

RiskSure.AI automates Certificate of Currency (COC) verification for Australian construction companies. It transforms manual insurance document verification from a time-consuming administrative burden into an automated, AI-powered system.

---

## 1. Product Specifics

### Insurance Types Verified

| Insurance Type | Tier Availability |
|----------------|-------------------|
| Public Liability | All tiers |
| Workers Compensation | All tiers |
| Professional Indemnity | All tiers |
| Contract Works / Construction All Risk | All tiers |
| Motor Vehicle | All tiers |
| Principal Indemnity Clause | Compliance+ tiers |
| Cross Liability Clause | Compliance+ tiers |
| Waiver of Subrogation | Compliance+ tiers |

### Coverage Validation

- Policy limit checks (e.g., $20M Public Liability)
- Expiration date tracking (30/60/90 day warnings)
- Named insured verification
- ABN/ACN validation against ASIC
- APRA-registered insurer verification (19 insurers in database)
- WorkCover state-specific compliance
- Per project requirements

### AI Accuracy & Speed

- **Processing time:** Under 30 seconds per certificate
- **Auto-approval threshold:** 70% confidence score (documents below this go to manual review)
- **Auto-approval rate:** 60-70% of compliant certificates
- **Verification checks:** 12 automated checks per document

### File Formats Supported

- PDF (recommended)
- JPG
- PNG
- Max file size: 10MB
- OCR fallback: Tesseract.js for handwritten documents

### Integrations

- **Procore** (Compliance+ tiers only) - bi-directional sync
- **Resend** - transactional email
- **Twilio** - SMS notifications
- **Google Workspace / Microsoft 365** - planned for email ingestion

---

## 2. Pricing & Tiers (AUD, GST inclusive)

| Tier | Monthly | Annual | Subbies | Projects | Users |
|------|---------|--------|---------|----------|-------|
| Velocity | $349 | $3,490 | 75 | 5 | 3 |
| Compliance | $749 | $7,490 | 250 | 25 | 10 |
| Business | $1,499 | $14,990 | 500 | Unlimited | Unlimited |

### Key Tier Differences

- **Velocity:** Basic AI verification, expiry alerts, fraud detection, email support
- **Compliance:** Adds Procore integration, Principal Indemnity/Cross Liability/Waiver of Subrogation detection, SMS stop-work alerts, morning brief dashboard
- **Business:** Adds dedicated onboarding, quarterly business reviews, priority SLA

### Free Trial

- 14 days, full Compliance tier features
- Up to 50 subbies during trial
- No credit card required
- Target conversion: 20-30%

### Founder Coupon

- **Code:** FOUNDER50
- **Discount:** 50% off for 6 months
- **Max uses:** 20

### Subcontractor Cost

**$0 forever** - major differentiator vs Cm3 ($400-$3,000/year)

---

## 3. Target Customer

### Ideal Customer Profile

| Metric | Velocity | Compliance | Business |
|--------|----------|------------|----------|
| Annual Revenue | $5M-$20M | $20M-$100M | $100M+ |
| Subcontractors | 20-75 | 75-250 | 250-500 |
| Active Projects | 3-5 | 5-25 | 25+ |
| Employees | 15-50 | 50-200 | 200+ |
| Pain Level | High | Critical | Enterprise |

### Buyer Personas

1. **"Compliance Claire"** - Risk/Compliance Manager (Primary buyer) - spends 2-3 days/week chasing certs
2. **"Operations Owen"** - Operations Director/GM (Economic buyer) - cares about cost center reduction
3. **"Finance Fiona"** - CFO (Budget holder) - wants ROI metrics
4. **"Subbie Sam"** - Subcontractor owner (Influencer) - hates paying Cm3 fees

### Purchase Triggers

- Audit failure or near-miss
- Industrial manslaughter legislation concerns
- Growth requiring more subbies
- New large project with compliance requirements
- Frustration with Cm3 adoption rates
- Staff leaving who managed spreadsheets

### Geographic Focus

- **Primary:** NSW, VIC (densest head contractor populations)
- **Expansion:** QLD, WA
- **Coverage:** All 8 Australian states/territories supported

---

## 4. Competitive Landscape

### Main Competitors

| Competitor | Weakness |
|------------|----------|
| Cm3 | Charges subbies $400-$3K/year, killing adoption rates |
| Procore | Manual verification, no AI, compliance is afterthought |
| Spreadsheets | No audit trail, manual chase, person-dependent |
| Hammertech | Safety-focused, insurance is bolt-on |

### Our Key Differentiators

1. **Free for subbies** → 100% adoption (vs Cm3's fee model killing adoption)
2. **30-second AI** → vs 3-5 day manual chase cycle
3. **Australian-built** → WorkCover state matching, APRA validation, AS 4000 awareness
4. **Fraud detection** → catches tampered documents
5. **Industrial manslaughter audit trail** → legal defense documentation

---

## 5. Sales Learnings

### Objection Handling

| Objection | Response |
|-----------|----------|
| "We use Cm3" | "How's subbie adoption? We hear it's typically under 50%. Our customers switched because subbies actually use it—it's free." |
| "Spreadsheets work fine" | "What happens when WorkSafe asks for your audit trail? Can you prove every certificate was verified?" |
| "Subbies won't adopt another portal" | "They will when it's free and takes 60 seconds. No account creation, just a magic link." |
| "Another expense" | "Calculate admin hours chasing certs. $349/mo vs 1 FTE's time." |
| "What if AI makes mistakes?" | "Every verification shows confidence scores. Your team reviews exceptions, AI handles the obvious ones." |

### Target Industries

- Commercial construction
- Residential construction
- Civil construction
- Fitout projects

---

## 6. Proof Points

### Quantified Claims

- **30 seconds** verification time
- **83% cost reduction** vs manual (calculated: 200 subbies × 4 certs × 30 min = $20K/year → $3,490/year)
- **19 APRA insurers** in database
- **12 automated checks** per certificate
- **60-second upload** for subbies

### Case Studies

Currently seeking 5-10 pilot customers for case study development (Month 1-3 objective)

---

## 7. Technical Details

### Safe to Mention in Marketing

- AI-powered verification (Google Gemini)
- Real-time dashboard
- Procore integration
- Mobile-friendly
- Australian data residency

### Keep Internal

- Specific model version (gemini-3-flash-preview)
- Database architecture (Convex)
- Tesseract.js OCR fallback
- Framework details (Next.js 14, React 18)

### Product Status

- **Production-ready** - full feature set built
- 220 features tracked across 9 categories
- 75+ API endpoints
- Recent migration: Supabase → Convex completed (Jan 2025)
- **Seeking:** 5-10 pilot customers

---

## 8. Key Messaging

### Tagline Options

- "Stop chasing certificates. Start building."
- "AI-powered insurance verification for Australian construction"
- "Free for subbies. Priceless for you."

### Value Proposition (30-second pitch)

> RiskSure.AI verifies subcontractor insurance certificates in 30 seconds using AI—not 3-5 days of manual chasing. Unlike Cm3, it's free for your subbies so they actually use it. You get a complete audit trail for WorkSafe, morning briefings on compliance gaps, and automatic expiry alerts. Starting at $349/month.

### Pain Points to Hit

1. "Spending days chasing certificates from subbies"
2. "Can't prove compliance if WorkSafe audits"
3. "Subbies won't pay for Cm3, so adoption is under 50%"
4. "Industrial manslaughter laws mean personal liability"
5. "The person who managed the spreadsheet left"

---

## 9. Builder Ben - Primary Persona

### Demographics
- Owner/Director of mid-market head contracting firm
- 45-60 years old
- Started as tradesman, built business over 15-25 years
- $30M-$150M annual revenue
- 120-250 active subcontractors
- 15-50 employees

### A Day in Ben's Life (Before RiskSure)

| Time | Pain Point |
|------|------------|
| 6:30 AM | Checks phone - office manager Sarah still chasing COCs from subbies |
| 7:15 AM | Can't let subbie start work because their Public Liability expired |
| 8:30 AM | WorkSafe audit coming - needs compliance docs for 47 subbies (stomach drops) |
| 10:00 AM | Can't read 40-page COC policy, gives up after 10 mins, "looks fine, approve it" |
| 12:30 PM | Accountant warns about industrial manslaughter laws - orders second beer |
| 3:00 PM | Cm3 renewal: $18K/year but half the subbies don't use it |
| 5:30 PM | Drives home thinking about the audit and the COC he didn't really check |
| 9:00 PM | Can't sleep - Googles "industrial manslaughter construction NSW penalties" |

### What Ben Wants (In His Words)

> "I just want to know that every subbie on my sites is properly insured. I don't want to read 40-page policies. I don't want Sarah spending half her week chasing certificates. I don't want to worry about going to jail because some sparky's WorkCover lapsed and I didn't catch it."

- "Tell me who's compliant and who's not. **Green light, red light.**"
- "Make the subbies actually upload their certs without me chasing them."
- "If WorkSafe walks in, I want to show them **a system, not a spreadsheet.**"
- "Don't make me pay $18K for something my subbies refuse to use."

### What Makes Ben Act

| Stage | Trigger |
|-------|---------|
| **Click** | "Your subbies upload for free. AI verifies in 30 seconds. You just review exceptions." |
| **Trial** | "14-day free trial. No credit card. See your compliance status in 24 hours." |
| **Buy** | Morning brief shows 12 subbies with expired certs he didn't know about |

### Acquisition Channels

| Channel | Signal |
|---------|--------|
| Peer recommendation | "What are you using for subbie compliance?" |
| Google search | "subcontractor insurance management software australia" |
| LinkedIn post | Industrial manslaughter compliance content |
| Insurance broker | Mentions "certificate verification software" |
| Subbie complaint | "Is there an alternative to Cm3? I hate paying those fees" |
| Cold email | Arrives the week before a major audit |
