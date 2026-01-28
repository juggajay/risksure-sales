# RiskSure Sales Automation System

## Overview

RiskSure Sales Automation is an AI-powered outbound sales system built to generate, qualify, and nurture leads for RiskSure.AI - an insurance certificate verification platform for Australian construction companies.

The system automatically:
1. Validates email addresses before sending
2. Researches companies using AI to understand their business
3. Generates personalized email copy based on research
4. Sends multi-step email sequences with A/B testing
5. Tracks engagement and manages unsubscribes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LEAD SOURCES                              │
│   Manual Entry │ CSV Import │ Apollo │ Web Scrape │ Inbound     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DAILY PIPELINE (Cron Job)                     │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   VALIDATE   │ -> │    ENRICH    │ -> │  SEND EMAIL  │       │
│  │  ZeroBounce  │    │  Jina+Gemini │    │    Resend    │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         TRACKING                                 │
│   Resend Webhooks │ Calendly Webhooks │ Unsubscribe Handling    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js 14 | Dashboard & unsubscribe pages |
| Database | Convex | Real-time database for leads, events, metrics |
| Email Sending | Resend | Transactional email delivery |
| Email Validation | ZeroBounce | Verify emails before sending |
| Web Scraping | Jina AI | Scrape company websites & search results |
| AI Processing | Google Gemini | Research analysis & copy generation |
| Hosting | Vercel | Serverless deployment |
| Scheduling | Calendly | Demo booking integration |

---

## The Pipeline: Step by Step

### Step 1: Lead Creation

Leads enter the system through various sources:

```typescript
// Lead data structure
{
  companyName: "Built Pty Ltd",
  contactName: "John Smith",
  contactEmail: "john@builtproperty.com.au",
  contactTitle: "Project Director",
  website: "https://www.built.com.au",
  state: "NSW",
  source: "manual",
  estimatedSubbies: 200
}
```

**Sources supported:**
- `manual` - Single lead entry
- `csv_import` - Bulk import from spreadsheet
- `apollo` - Apollo.io integration
- `web_scrape` - Scraped from directories
- `inbound` - Website signups
- `referral` - Referred leads

### Step 2: Email Validation (ZeroBounce)

Before any processing, the email is validated:

```typescript
// ZeroBounce checks:
// - Email syntax
// - Domain MX records
// - Mailbox existence (SMTP verification)
// - Spam trap detection
// - Disposable email detection

// Results:
"valid"     → Proceed to enrichment
"invalid"   → Mark as invalid, skip
"spamtrap"  → Mark as invalid, skip (protects sender reputation)
"risky"     → Proceed with caution (catch-all domains)
```

**Why this matters:** Sending to invalid emails hurts your domain reputation. A bounce rate >2% will get you flagged by Gmail/Outlook.

### Step 3: Company Research & Enrichment

The enrichment process uses AI to research the company:

```
┌─────────────────────────────────────────────────────────────────┐
│                     ENRICHMENT PROCESS                           │
│                                                                  │
│  1. SCRAPE WEBSITE (Jina Reader)                                │
│     → Fetches company website content as markdown               │
│     → Extracts projects, services, about info                   │
│                                                                  │
│  2. WEB SEARCH (Jina Search)                                    │
│     → Searches: "{company} construction {state} projects"       │
│     → Finds news, project announcements, company info           │
│                                                                  │
│  3. AI ANALYSIS (Google Gemini)                                 │
│     → Analyzes scraped content + search results                 │
│     → Estimates: projects, subcontractors, revenue              │
│     → Identifies: pain points, decision makers, news            │
│     → Assigns confidence level (low/medium/high)                │
│                                                                  │
│  4. TIER QUALIFICATION                                          │
│     → velocity:   <75 subbies, $5M-$20M revenue                │
│     → compliance: 75-250 subbies, $20M-$100M revenue           │
│     → business:   250+ subbies, $100M+ revenue                  │
│                                                                  │
│  5. PERSONALIZED OPENER (Gemini)                                │
│     → Generates 1-2 sentence hook based on research             │
│     → References specific projects/news/pain points             │
│     → Does NOT mention RiskSure - just the hook                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Example enrichment output:**

```json
{
  "companySummary": "Major Australian commercial builder with projects across NSW and VIC",
  "estimatedProjects": 15,
  "estimatedSubcontractors": 300,
  "estimatedRevenue": "$100M+",
  "complianceMaturity": "basic",
  "painPointSignals": [
    "Managing subcontractor insurance across multiple sites",
    "WorkSafe compliance requirements increasing"
  ],
  "decisionMakers": ["Project Director", "Compliance Manager"],
  "recentNews": ["Won $50M hospital project in Melbourne"],
  "confidence": "high"
}
```

**Personalized opener generated:**

> "Seeing Built's growth with the new hospital project in Melbourne, I imagine managing insurance compliance across 300+ subbies is becoming a significant challenge."

### Step 4: A/B Variant Assignment

Each lead is randomly assigned to Variant A or B for testing:

```typescript
// 50/50 split
variant = Math.random() < 0.5 ? "A" : "B"
```

This allows testing different:
- Subject lines
- Email content approaches
- Call-to-action styles

### Step 5: Email Template Selection

Based on tier and variant, the system selects the appropriate template:

```
TIER: business (250+ subbies)
├── Step 0: Initial outreach
│   ├── Variant A: "Portfolio compliance risk at {company}"
│   │   → Problem-focused, enterprise risk angle
│   └── Variant B: "Audit question for {company}"
│       → Question-based, WorkSafe audit angle
├── Step 1: Follow-up (4 days later)
├── Step 2: Value prop (8 days later)
├── Step 3: ROI/case study (12 days later)
└── Step 4: Final touch (18 days later)

TIER: compliance (75-250 subbies)
└── Different messaging focused on scaling compliance

TIER: velocity (20-75 subbies)
└── Different messaging focused on time savings
```

### Step 6: Email Content Assembly

The final email is assembled:

```typescript
// Template parameters
{
  contactName: "John",
  companyName: "Built Pty Ltd",
  personalizedOpener: "[AI-generated opener from enrichment]",
  unsubscribeUrl: "https://sales.risksure.ai/unsubscribe/{token}",
  calendlyUrl: "https://calendly.com/risksure/demo"
}

// Final email (plain text for deliverability)
`Hi John,

[Personalized opener about their specific projects/news]

We help builders like Built Pty Ltd get audit-ready in days, not weeks.
One client cut their compliance admin by 10 hours a week.

Worth a quick chat about how this could work for your projects?

Jayson
Head of Growth | RiskSure.AI
0449 228 921

If this isn't relevant for Built Pty Ltd, just let me know.`
```

### Step 7: Email Sending (Resend)

Emails are sent via Resend with:
- Domain-authenticated sending (jayson@risksure.ai)
- SPF/DKIM/DMARC configured
- Tags for tracking (lead_id, sequence_step, variant, tier)
- Plain text format (for Gmail Primary inbox placement)

**Domain warming:** The system gradually increases daily send volume:
- Week 1: 20 emails/day
- Week 2: 40 emails/day
- Week 3: 60 emails/day
- Target: 200 emails/day max

### Step 8: Engagement Tracking

Resend webhooks track email events:

```typescript
// Events tracked:
"delivered"    → Email accepted by recipient server
"opened"       → Recipient opened the email
"clicked"      → Recipient clicked a link
"bounced"      → Email bounced (hard/soft)
"complained"   → Marked as spam
"unsubscribed" → Clicked unsubscribe
```

Events update:
- Lead status
- A/B test metrics
- Daily analytics

### Step 9: Demo Booking (Calendly)

When a recipient books a demo:
1. Calendly webhook fires
2. System matches email to lead
3. Lead status updates to `demo_scheduled`
4. Activity logged

---

## Database Schema

### Leads Table

| Field | Type | Description |
|-------|------|-------------|
| companyName | string | Company name |
| contactEmail | string | Primary contact email |
| tier | velocity/compliance/business | ICP qualification tier |
| status | enum | Pipeline stage |
| enrichmentScore | number | 0-100 qualification score |
| personalizedOpener | string | AI-generated opener |
| sequenceVariant | A/B | Test variant |
| currentSequenceStep | number | Current email in sequence |

### Lead Status Flow

```
new → validating → enriching → ready → contacted → opened → clicked → replied
                                                              ↓
                                                    demo_scheduled → demo_complete
                                                              ↓
                                                    trial → closed_won/closed_lost
```

---

## Email Deliverability

### Plain Text Strategy

Gmail's ML filter detects HTML as promotional. Our solution:

```
❌ HTML emails → Gmail Promotions tab
❌ Minimal HTML (<br>, <a>) → Gmail Promotions tab
✅ Pure plain text → Gmail Primary inbox
```

### What Works

| Element | Status | Reason |
|---------|--------|--------|
| Plain text body | ✅ | Looks like personal email |
| Newlines for spacing | ✅ | Natural formatting |
| Plain URL for unsubscribe | ✅ | Required but acceptable |
| No images | ✅ | No tracking pixels |
| No HTML tags | ✅ | Avoids promotional filter |

### Deliverability Results

| Inbox Type | Result |
|------------|--------|
| Gmail (consumer) | Primary ✅ |
| Google Workspace (business) | Inbox/Other ✅ |
| Microsoft 365 (business) | Inbox/Other ✅ |
| Outlook/Hotmail (consumer) | Junk ❌ (domain reputation) |

---

## Configuration

### Environment Variables

```env
# Database
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud

# Email Services
RESEND_API_KEY=re_xxx
RESEND_WEBHOOK_SECRET=whsec_xxx
ZEROBOUNCE_API_KEY=xxx

# AI Services
GOOGLE_GEMINI_API_KEY=xxx
JINA_API_KEY=xxx (optional - free tier works)

# Webhooks & URLs
UNSUBSCRIBE_BASE_URL=https://sales.risksure.ai/unsubscribe
CALENDLY_BOOKING_URL=https://calendly.com/risksure/demo
CALENDLY_WEBHOOK_SECRET=xxx

# Cron Authentication
CRON_SECRET=xxx
```

### Daily Pipeline Trigger

The pipeline runs via cron job:

```
GET /api/cron/daily-pipeline
Authorization: Bearer {CRON_SECRET}
```

This:
1. Validates new leads (up to 50)
2. Enriches validated leads (up to 20)
3. Sends emails to ready leads (up to daily warming limit)

---

## File Structure

```
risksure-sales/
├── app/
│   ├── api/
│   │   ├── cron/daily-pipeline/     # Main pipeline
│   │   ├── leads/import/            # CSV import
│   │   └── webhooks/
│   │       ├── resend/              # Email events
│   │       └── calendly/            # Demo bookings
│   └── unsubscribe/[token]/         # Unsubscribe page
├── convex/
│   ├── schema.ts                    # Database schema
│   ├── leads.ts                     # Lead mutations/queries
│   ├── emailEvents.ts               # Event tracking
│   ├── metrics.ts                   # Analytics
│   ├── warming.ts                   # Domain warming
│   ├── abTests.ts                   # A/B test tracking
│   └── unsubscribe.ts               # Unsubscribe handling
├── lib/
│   ├── validation.ts                # ZeroBounce integration
│   ├── enrichment.ts                # Main enrichment logic
│   ├── jina.ts                      # Web scraping
│   ├── gemini.ts                    # AI processing
│   └── resend.ts                    # Email sending
├── templates/
│   ├── velocity/                    # Small company templates
│   ├── compliance/                  # Mid-size templates
│   ├── business/                    # Enterprise templates
│   └── components/                  # Shared components
└── docs/
    ├── system-overview.md           # This file
    ├── email-deliverability-guide.md
    └── gmail-deliverability.md
```

---

## Key Metrics Tracked

### Daily Metrics
- Leads imported/validated/enriched
- Emails sent/delivered/opened/clicked/bounced
- Replies and demos booked
- Unsubscribes
- A/B variant performance
- Performance by tier

### A/B Test Results
- Subject line performance
- Open rates by variant
- Click rates by variant
- Reply rates by variant
- Statistical significance

---

## Compliance

### Australian Spam Act 2003

The system complies with Australian spam laws:

1. **Consent**: Uses "inferred consent" for B2B - email addresses conspicuously published on company websites for business purposes

2. **Identification**: Every email clearly identifies:
   - Sender name (Jayson)
   - Company (RiskSure.AI)
   - Contact method (phone number)

3. **Unsubscribe**: Every email includes opt-out mechanism:
   - "If this isn't relevant for {company}, just let me know"
   - Unsubscribe requests processed within 5 days

4. **Relevance**: Emails are directly relevant to recipient's business function (construction compliance)

---

## Summary

RiskSure Sales Automation transforms cold outreach from manual spray-and-pray into an intelligent, personalized system:

1. **Validates** emails to protect sender reputation
2. **Researches** companies using AI to understand their business
3. **Personalizes** every email with specific company references
4. **Qualifies** leads into tiers for appropriate messaging
5. **Tests** subject lines and content with A/B variants
6. **Tracks** engagement to optimize performance
7. **Complies** with Australian spam laws

The result: Higher deliverability, better engagement, and scalable personalized outreach.
