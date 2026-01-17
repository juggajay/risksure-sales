# RiskSure Sales Automation - Implementation Plan

> **For Claude (Ralph Loop):** This plan is optimized for Ralph Wiggum iterative execution. Update the Progress Tracker below as you complete tasks. When ALL tasks are complete and verified, output the completion promise.

**Goal:** Build an autonomous sales pipeline that finds Australian construction companies, enriches them with AI, and sends personalized cold email sequences to book demos for RiskSure.AI.

**Architecture:** Next.js 14 app with Convex database, Resend for email, Gemini Flash for AI enrichment, Jina AI for web scraping. Daily cron jobs handle validation, enrichment, and email sending with warming limits. Webhooks track opens/clicks/replies.

**Tech Stack:** Next.js 14, Convex, Resend, Google Gemini 3 Flash, Jina AI, ZeroBounce, Vercel

**Reference:** See `docs/product-brief.md` for complete product details, pricing, and personas.

---

## 🎯 Completion Promise

When ALL phases are complete and verified working, output:
```
<promise>RISKSURE SALES AUTOMATION COMPLETE</promise>
```

---

## 📋 Progress Tracker

<!-- Claude: Update checkboxes as you complete each task -->

### Phase 1: Project Setup
- [x] Task 1.1: Initialize Next.js Project
- [x] Task 1.2: Initialize Convex

### Phase 2: Database Schema
- [x] Task 2.1: Create Complete Schema

### Phase 3: Core Convex Functions
- [x] Task 3.1: Lead CRUD Operations
- [x] Task 3.2: Warming Configuration
- [x] Task 3.3: Unsubscribe System
- [x] Task 3.4: Metrics Tracking
- [x] Task 3.5: A/B Test Tracking
- [x] Task 3.6: Email Events Logging

### Phase 4: External Service Integrations
- [x] Task 4.1: Gemini AI Client
- [x] Task 4.2: Jina AI Web Scraping
- [x] Task 4.3: Email Validation (ZeroBounce)
- [x] Task 4.4: Resend Email Client
- [x] Task 4.5: Enrichment Pipeline

### Phase 5: Email Templates
- [x] Task 5.1: Email Template Components
- [x] Task 5.2: Velocity Tier Email Templates
- [x] Task 5.3: Compliance Tier Email Templates
- [x] Task 5.4: Business Tier Email Templates
- [x] Task 5.5: Template Index

### Phase 6: API Routes
- [x] Task 6.1: Daily Pipeline Cron
- [x] Task 6.2: Resend Webhook Handler
- [x] Task 6.3: Calendly Webhook Handler
- [x] Task 6.4: CSV Import Endpoint

### Phase 7: Unsubscribe Page
- [x] Task 7.1: Unsubscribe Page

### Phase 8: Deployment Configuration
- [x] Task 8.1: Vercel Configuration
- [x] Task 8.2: Convex Provider Setup
- [x] Task 8.3: Environment Variables Setup

### Phase 9: Testing & Validation
- [x] Task 9.1: Manual Test Checklist

---

## 🔧 Browser Automation Notes

For Convex setup tasks, use Playwright MCP tools if needed:
- `browser_navigate` to go to dashboard.convex.dev
- `browser_snapshot` to see current state
- `browser_click` to interact with UI elements
- `browser_type` to enter project names/settings

---

## Project Structure

```
risksure-sales/
├── convex/
│   ├── schema.ts              # Database schema
│   ├── leads.ts               # Lead CRUD operations
│   ├── emailEvents.ts         # Email event logging
│   ├── activities.ts          # Activity logging
│   ├── metrics.ts             # Daily metrics
│   ├── warming.ts             # Email warming config
│   ├── unsubscribe.ts         # Unsubscribe tokens
│   └── abTests.ts             # A/B test tracking
├── app/
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── resend/route.ts
│   │   │   └── calendly/route.ts
│   │   ├── cron/
│   │   │   ├── daily-pipeline/route.ts
│   │   │   └── weekly-report/route.ts
│   │   └── leads/
│   │       └── import/route.ts
│   ├── unsubscribe/[token]/page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── leads/page.tsx
│       └── analytics/page.tsx
├── lib/
│   ├── gemini.ts
│   ├── jina.ts
│   ├── resend.ts
│   ├── validation.ts
│   └── enrichment.ts
├── templates/
│   ├── velocity/
│   ├── compliance/
│   ├── business/
│   └── components/
├── docs/
│   ├── product-brief.md
│   └── plans/
├── package.json
├── vercel.json
└── .env.local
```

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `.env.local.example`

**Step 1: Create Next.js app with required dependencies**

Run:
```bash
cd C:/Users/jayso/risksure-sales
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Expected: Project scaffolded with Next.js 14

**Step 2: Install core dependencies**

Run:
```bash
npm install convex resend @react-email/components nanoid
npm install @google/generative-ai
npm install -D @types/node
```

Expected: Dependencies installed

**Step 3: Create environment template**

Create `.env.local.example`:
```bash
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Resend
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=

# Google Gemini
GOOGLE_API_KEY=

# Jina AI (optional - has free tier without key)
JINA_API_KEY=

# ZeroBounce
ZEROBOUNCE_API_KEY=

# Calendly
CALENDLY_WEBHOOK_SECRET=
CALENDLY_BOOKING_URL=https://calendly.com/risksure/demo

# Cron Security
CRON_SECRET=

# Notifications
NOTIFICATION_EMAIL=

# App
NEXT_PUBLIC_APP_URL=https://sales.risksure.ai
UNSUBSCRIBE_BASE_URL=https://sales.risksure.ai/unsubscribe
```

**Step 4: Commit**

Run:
```bash
git init
git add .
git commit -m "chore: initialize Next.js 14 project with dependencies"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds with no errors

---

### Task 1.2: Initialize Convex

**Files:**
- Create: `convex/_generated/` (auto-generated)
- Create: `convex/schema.ts`

**Step 1: Initialize Convex**

Run:
```bash
npx convex dev --once
```

Expected: Convex initialized, `convex/` folder created

**Step 2: Commit**

Run:
```bash
git add .
git commit -m "chore: initialize Convex"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Convex runs without errors, `convex/_generated/` exists

---

## Phase 2: Database Schema

### Task 2.1: Create Complete Schema

**Files:**
- Create: `convex/schema.ts`

**Step 1: Write the schema**

Create `convex/schema.ts`:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============================================
  // LEADS TABLE
  // ============================================
  leads: defineTable({
    // Company Info
    companyName: v.string(),
    website: v.optional(v.string()),
    abn: v.optional(v.string()),

    // Contact Info
    contactName: v.string(),
    contactEmail: v.string(),
    contactTitle: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),

    // Company Qualification
    estimatedRevenue: v.optional(v.string()), // "$5M-$20M", "$20M-$100M", "$100M+"
    estimatedSubbies: v.optional(v.number()),
    estimatedProjects: v.optional(v.number()),
    estimatedEmployees: v.optional(v.number()),
    state: v.optional(v.string()), // NSW, VIC, QLD, WA, etc.

    // Source & Classification
    source: v.union(
      v.literal("apollo"),
      v.literal("csv_import"),
      v.literal("web_scrape"),
      v.literal("manual"),
      v.literal("referral"),
      v.literal("inbound")
    ),

    // Tier (based on ICP qualification)
    tier: v.union(
      v.literal("velocity"),     // $5M-$20M, 20-75 subbies
      v.literal("compliance"),   // $20M-$100M, 75-250 subbies
      v.literal("business")      // $100M+, 250-500 subbies
    ),

    // Email Validation
    emailValidated: v.boolean(),
    emailValidationResult: v.optional(v.union(
      v.literal("valid"),
      v.literal("invalid"),
      v.literal("risky"),
      v.literal("unknown")
    )),

    // Enrichment
    enrichmentScore: v.optional(v.number()), // 0-100
    enrichmentData: v.optional(v.any()),
    personalizedOpener: v.optional(v.string()),
    painPoints: v.optional(v.array(v.string())),
    enrichmentError: v.optional(v.string()),

    // Pipeline Status
    status: v.union(
      v.literal("new"),
      v.literal("validating"),
      v.literal("enriching"),
      v.literal("ready"),         // Ready for outreach
      v.literal("contacted"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("replied"),
      v.literal("demo_scheduled"),
      v.literal("demo_complete"),
      v.literal("trial"),
      v.literal("closed_won"),
      v.literal("closed_lost"),
      v.literal("nurture"),
      v.literal("unsubscribed"),
      v.literal("bounced"),
      v.literal("invalid_email")
    ),

    // Sequence Tracking
    currentSequenceStep: v.number(),
    sequenceVariant: v.optional(v.union(v.literal("A"), v.literal("B"))),
    lastEmailSentAt: v.optional(v.number()),
    lastEmailOpenedAt: v.optional(v.number()),
    lastEmailClickedAt: v.optional(v.number()),
    nextEmailAt: v.optional(v.number()), // Scheduled next send time

    // Unsubscribe
    unsubscribedAt: v.optional(v.number()),
    unsubscribeReason: v.optional(v.string()),

    // Demo Booking
    demoScheduledAt: v.optional(v.number()),
    demoCalendlyUrl: v.optional(v.string()),

    // Metadata
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_tier", ["tier"])
    .index("by_email", ["contactEmail"])
    .index("by_state", ["state"])
    .index("by_validation", ["emailValidated", "status"])
    .index("by_next_email", ["nextEmailAt"]),

  // ============================================
  // EMAIL EVENTS TABLE
  // ============================================
  emailEvents: defineTable({
    leadId: v.id("leads"),
    eventType: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("replied"),
      v.literal("bounced"),
      v.literal("complained"),
      v.literal("unsubscribed")
    ),
    emailSubject: v.string(),
    sequenceStep: v.number(),
    sequenceVariant: v.optional(v.union(v.literal("A"), v.literal("B"))),
    resendMessageId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_resend_id", ["resendMessageId"])
    .index("by_type", ["eventType"]),

  // ============================================
  // ACTIVITIES TABLE
  // ============================================
  activities: defineTable({
    leadId: v.id("leads"),
    activityType: v.union(
      v.literal("created"),
      v.literal("validated"),
      v.literal("enriched"),
      v.literal("email_sent"),
      v.literal("email_opened"),
      v.literal("email_clicked"),
      v.literal("email_replied"),
      v.literal("demo_scheduled"),
      v.literal("demo_completed"),
      v.literal("status_change"),
      v.literal("note_added"),
      v.literal("unsubscribed")
    ),
    description: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_lead", ["leadId"]),

  // ============================================
  // DAILY METRICS TABLE
  // ============================================
  dailyMetrics: defineTable({
    date: v.string(), // YYYY-MM-DD

    // Lead Gen
    leadsImported: v.number(),
    leadsValidated: v.number(),
    leadsInvalid: v.number(),

    // Enrichment
    leadsEnriched: v.number(),
    enrichmentErrors: v.number(),

    // Outreach
    emailsSent: v.number(),
    emailsDelivered: v.number(),
    emailsOpened: v.number(),
    emailsClicked: v.number(),
    emailsBounced: v.number(),

    // Engagement
    replies: v.number(),
    demosBooked: v.number(),
    unsubscribes: v.number(),

    // A/B Testing
    variantASent: v.number(),
    variantAOpened: v.number(),
    variantBSent: v.number(),
    variantBOpened: v.number(),

    // By Tier
    velocitySent: v.number(),
    complianceSent: v.number(),
    businessSent: v.number(),
  })
    .index("by_date", ["date"]),

  // ============================================
  // EMAIL WARMING CONFIG
  // ============================================
  warmingConfig: defineTable({
    isActive: v.boolean(),
    currentDailyLimit: v.number(),    // Start at 20
    maxDailyLimit: v.number(),        // Target: 200
    incrementAmount: v.number(),      // Increase by 10/day
    lastIncrementDate: v.string(),
    emailsSentToday: v.number(),
    warmingStartDate: v.string(),
  }),

  // ============================================
  // UNSUBSCRIBE TOKENS
  // ============================================
  unsubscribeTokens: defineTable({
    leadId: v.id("leads"),
    token: v.string(),
    createdAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_lead", ["leadId"]),

  // ============================================
  // A/B TEST RESULTS
  // ============================================
  abTestResults: defineTable({
    testName: v.string(),           // e.g., "velocity_step0"
    tier: v.string(),
    sequenceStep: v.number(),
    variantA: v.object({
      subject: v.string(),
      sent: v.number(),
      opened: v.number(),
      clicked: v.number(),
      replied: v.number(),
    }),
    variantB: v.object({
      subject: v.string(),
      sent: v.number(),
      opened: v.number(),
      clicked: v.number(),
      replied: v.number(),
    }),
    winner: v.optional(v.union(v.literal("A"), v.literal("B"), v.literal("none"))),
    startDate: v.string(),
    endDate: v.optional(v.string()),
  })
    .index("by_test", ["testName"]),

  // ============================================
  // EMAIL SEQUENCES CONFIG
  // ============================================
  sequences: defineTable({
    tier: v.string(),
    step: v.number(),
    delayDays: v.number(),          // Days after previous email
    subjectA: v.string(),
    subjectB: v.string(),
    templateA: v.string(),          // Template key
    templateB: v.string(),
    isActive: v.boolean(),
  })
    .index("by_tier_step", ["tier", "step"]),
});
```

**Step 2: Push schema to Convex**

Run:
```bash
npx convex dev --once
```

Expected: Schema deployed successfully

**Step 3: Commit**

Run:
```bash
git add convex/schema.ts
git commit -m "feat: add complete database schema"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Schema deploys successfully, no type errors

---

## Phase 3: Core Convex Functions

### Task 3.1: Lead CRUD Operations

**Files:**
- Create: `convex/leads.ts`

**Step 1: Create leads.ts with all operations**

Create `convex/leads.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES
// ============================================

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").take(100);
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .take(100);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.email))
      .first();
  },
});

export const getPendingValidation = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "new"))
      .filter((q) => q.eq(q.field("emailValidated"), false))
      .take(50);
  },
});

export const getPendingEnrichment = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "enriching"))
      .take(20);
  },
});

export const getReadyForEmail = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "ready"))
      .filter((q) =>
        q.or(
          q.eq(q.field("nextEmailAt"), undefined),
          q.lte(q.field("nextEmailAt"), now)
        )
      )
      .take(args.limit);
  },
});

export const getByTier = query({
  args: { tier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_tier", (q) => q.eq("tier", args.tier as any))
      .take(100);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("leads").collect();

    const stats = {
      total: all.length,
      byStatus: {} as Record<string, number>,
      byTier: {} as Record<string, number>,
      byState: {} as Record<string, number>,
    };

    for (const lead of all) {
      stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
      stats.byTier[lead.tier] = (stats.byTier[lead.tier] || 0) + 1;
      if (lead.state) {
        stats.byState[lead.state] = (stats.byState[lead.state] || 0) + 1;
      }
    }

    return stats;
  },
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: {
    companyName: v.string(),
    contactName: v.string(),
    contactEmail: v.string(),
    website: v.optional(v.string()),
    contactTitle: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    state: v.optional(v.string()),
    source: v.union(
      v.literal("apollo"),
      v.literal("csv_import"),
      v.literal("web_scrape"),
      v.literal("manual"),
      v.literal("referral"),
      v.literal("inbound")
    ),
    estimatedSubbies: v.optional(v.number()),
    estimatedRevenue: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("contactEmail", args.contactEmail))
      .first();

    if (existing) {
      return { success: false, error: "Email already exists", leadId: existing._id };
    }

    // Determine tier based on subbies
    let tier: "velocity" | "compliance" | "business" = "velocity";
    if (args.estimatedSubbies) {
      if (args.estimatedSubbies > 250) tier = "business";
      else if (args.estimatedSubbies > 75) tier = "compliance";
    }

    const now = Date.now();
    const leadId = await ctx.db.insert("leads", {
      companyName: args.companyName,
      contactName: args.contactName,
      contactEmail: args.contactEmail.toLowerCase(),
      website: args.website,
      contactTitle: args.contactTitle,
      contactPhone: args.contactPhone,
      state: args.state,
      source: args.source,
      estimatedSubbies: args.estimatedSubbies,
      estimatedRevenue: args.estimatedRevenue,
      tier,
      emailValidated: false,
      status: "new",
      currentSequenceStep: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      leadId,
      activityType: "created",
      description: `Lead imported from ${args.source}`,
      createdAt: now,
    });

    return { success: true, leadId };
  },
});

export const bulkCreate = mutation({
  args: {
    leads: v.array(v.object({
      companyName: v.string(),
      contactName: v.string(),
      contactEmail: v.string(),
      website: v.optional(v.string()),
      contactTitle: v.optional(v.string()),
      state: v.optional(v.string()),
      source: v.string(),
      estimatedSubbies: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const results = { created: 0, duplicates: 0, errors: [] as string[] };
    const now = Date.now();

    for (const lead of args.leads) {
      // Check duplicate
      const existing = await ctx.db
        .query("leads")
        .withIndex("by_email", (q) => q.eq("contactEmail", lead.contactEmail.toLowerCase()))
        .first();

      if (existing) {
        results.duplicates++;
        continue;
      }

      // Determine tier
      let tier: "velocity" | "compliance" | "business" = "velocity";
      if (lead.estimatedSubbies) {
        if (lead.estimatedSubbies > 250) tier = "business";
        else if (lead.estimatedSubbies > 75) tier = "compliance";
      }

      await ctx.db.insert("leads", {
        companyName: lead.companyName,
        contactName: lead.contactName,
        contactEmail: lead.contactEmail.toLowerCase(),
        website: lead.website,
        contactTitle: lead.contactTitle,
        state: lead.state,
        source: lead.source as any,
        estimatedSubbies: lead.estimatedSubbies,
        tier,
        emailValidated: false,
        status: "new",
        currentSequenceStep: 0,
        createdAt: now,
        updatedAt: now,
      });

      results.created++;
    }

    return results;
  },
});

export const updateValidation = mutation({
  args: {
    leadId: v.id("leads"),
    emailValidated: v.boolean(),
    emailValidationResult: v.union(
      v.literal("valid"),
      v.literal("invalid"),
      v.literal("risky"),
      v.literal("unknown")
    ),
  },
  handler: async (ctx, args) => {
    const newStatus = args.emailValidationResult === "invalid"
      ? "invalid_email"
      : "enriching";

    await ctx.db.patch(args.leadId, {
      emailValidated: args.emailValidated,
      emailValidationResult: args.emailValidationResult,
      status: newStatus,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("activities", {
      leadId: args.leadId,
      activityType: "validated",
      description: `Email validation: ${args.emailValidationResult}`,
      createdAt: Date.now(),
    });
  },
});

export const updateEnrichment = mutation({
  args: {
    leadId: v.id("leads"),
    enrichmentData: v.any(),
    enrichmentScore: v.number(),
    tier: v.union(v.literal("velocity"), v.literal("compliance"), v.literal("business")),
    estimatedSubbies: v.number(),
    estimatedRevenue: v.optional(v.string()),
    personalizedOpener: v.string(),
    painPoints: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      enrichmentData: args.enrichmentData,
      enrichmentScore: args.enrichmentScore,
      tier: args.tier,
      estimatedSubbies: args.estimatedSubbies,
      estimatedRevenue: args.estimatedRevenue,
      personalizedOpener: args.personalizedOpener,
      painPoints: args.painPoints,
      status: "ready",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("activities", {
      leadId: args.leadId,
      activityType: "enriched",
      description: `Enriched: score ${args.enrichmentScore}, tier ${args.tier}`,
      createdAt: Date.now(),
    });
  },
});

export const setEnrichmentError = mutation({
  args: {
    leadId: v.id("leads"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      enrichmentError: args.error,
      status: "ready", // Still proceed with generic messaging
      updatedAt: Date.now(),
    });
  },
});

export const markEmailSent = mutation({
  args: {
    leadId: v.id("leads"),
    resendMessageId: v.string(),
    subject: v.string(),
    sequenceStep: v.number(),
    variant: v.union(v.literal("A"), v.literal("B")),
  },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return;

    // Calculate next email time based on sequence
    const delayDays = [0, 3, 7, 14][args.sequenceStep + 1] || 21;
    const nextEmailAt = Date.now() + (delayDays * 24 * 60 * 60 * 1000);

    await ctx.db.patch(args.leadId, {
      status: "contacted",
      currentSequenceStep: args.sequenceStep,
      sequenceVariant: args.variant,
      lastEmailSentAt: Date.now(),
      nextEmailAt,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("emailEvents", {
      leadId: args.leadId,
      eventType: "sent",
      emailSubject: args.subject,
      sequenceStep: args.sequenceStep,
      sequenceVariant: args.variant,
      resendMessageId: args.resendMessageId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("activities", {
      leadId: args.leadId,
      activityType: "email_sent",
      description: `Email ${args.sequenceStep + 1} sent: "${args.subject}"`,
      createdAt: Date.now(),
    });
  },
});

export const markOpened = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return;

    // Only update if not already in a more advanced status
    if (["contacted", "ready"].includes(lead.status)) {
      await ctx.db.patch(args.leadId, {
        status: "opened",
        lastEmailOpenedAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const markClicked = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return;

    if (["contacted", "ready", "opened"].includes(lead.status)) {
      await ctx.db.patch(args.leadId, {
        status: "clicked",
        lastEmailClickedAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const markBounced = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: "bounced",
      updatedAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: args.status as any,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("activities", {
      leadId: args.leadId,
      activityType: "status_change",
      description: `Status changed to ${args.status}${args.note ? `: ${args.note}` : ""}`,
      createdAt: Date.now(),
    });
  },
});

export const setDemoScheduled = mutation({
  args: {
    leadId: v.id("leads"),
    scheduledAt: v.number(),
    calendlyUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      status: "demo_scheduled",
      demoScheduledAt: args.scheduledAt,
      demoCalendlyUrl: args.calendlyUrl,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("activities", {
      leadId: args.leadId,
      activityType: "demo_scheduled",
      description: `Demo scheduled for ${new Date(args.scheduledAt).toLocaleDateString()}`,
      createdAt: Date.now(),
    });
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

Expected: Functions deployed

**Step 3: Commit**

Run:
```bash
git add convex/leads.ts
git commit -m "feat: add lead CRUD operations"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Functions deploy, no type errors

---

### Task 3.2: Warming Configuration

**Files:**
- Create: `convex/warming.ts`

**Step 1: Create warming.ts**

Create `convex/warming.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("warmingConfig").first();
    if (existing) return existing._id;

    return await ctx.db.insert("warmingConfig", {
      isActive: true,
      currentDailyLimit: 20,      // Start with 20 emails/day
      maxDailyLimit: 200,         // Target: 200/day after warmup
      incrementAmount: 10,        // Increase by 10/day
      lastIncrementDate: new Date().toISOString().split("T")[0],
      emailsSentToday: 0,
      warmingStartDate: new Date().toISOString().split("T")[0],
    });
  },
});

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return null;

    const today = new Date().toISOString().split("T")[0];
    const emailsRemaining = config.currentDailyLimit - config.emailsSentToday;
    const warmingComplete = config.currentDailyLimit >= config.maxDailyLimit;

    // Calculate days since start
    const startDate = new Date(config.warmingStartDate);
    const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    return {
      ...config,
      emailsRemaining: Math.max(0, emailsRemaining),
      warmingComplete,
      daysSinceStart,
      isNewDay: config.lastIncrementDate !== today,
    };
  },
});

export const incrementDailyLimit = mutation({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    const today = new Date().toISOString().split("T")[0];

    // Only increment once per day
    if (config.lastIncrementDate === today) return;

    const newLimit = Math.min(
      config.currentDailyLimit + config.incrementAmount,
      config.maxDailyLimit
    );

    await ctx.db.patch(config._id, {
      currentDailyLimit: newLimit,
      lastIncrementDate: today,
      emailsSentToday: 0, // Reset daily counter
    });
  },
});

export const recordEmailSent = mutation({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    await ctx.db.patch(config._id, {
      emailsSentToday: config.emailsSentToday + 1,
    });
  },
});

export const canSendEmail = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return false;
    if (!config.isActive) return false;

    return config.emailsSentToday < config.currentDailyLimit;
  },
});

export const updateConfig = mutation({
  args: {
    isActive: v.optional(v.boolean()),
    currentDailyLimit: v.optional(v.number()),
    maxDailyLimit: v.optional(v.number()),
    incrementAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    await ctx.db.patch(config._id, {
      ...(args.isActive !== undefined && { isActive: args.isActive }),
      ...(args.currentDailyLimit !== undefined && { currentDailyLimit: args.currentDailyLimit }),
      ...(args.maxDailyLimit !== undefined && { maxDailyLimit: args.maxDailyLimit }),
      ...(args.incrementAmount !== undefined && { incrementAmount: args.incrementAmount }),
    });
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

**Step 3: Commit**

Run:
```bash
git add convex/warming.ts
git commit -m "feat: add email warming configuration"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Warming functions deploy successfully

---

### Task 3.3: Unsubscribe System

**Files:**
- Create: `convex/unsubscribe.ts`

**Step 1: Create unsubscribe.ts**

Create `convex/unsubscribe.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const generateTokenForLead = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    // Check if token already exists
    const existing = await ctx.db
      .query("unsubscribeTokens")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .first();

    if (existing) {
      return existing.token;
    }

    const token = generateToken();
    await ctx.db.insert("unsubscribeTokens", {
      leadId: args.leadId,
      token,
      createdAt: Date.now(),
    });

    return token;
  },
});

export const verifyToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("unsubscribeTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenRecord) {
      return { valid: false, alreadyUsed: false };
    }

    return {
      valid: true,
      alreadyUsed: !!tokenRecord.usedAt,
    };
  },
});

export const processUnsubscribe = mutation({
  args: {
    token: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("unsubscribeTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenRecord) {
      return { success: false, error: "Invalid token" };
    }

    if (tokenRecord.usedAt) {
      return { success: false, error: "Already unsubscribed" };
    }

    // Mark token as used
    await ctx.db.patch(tokenRecord._id, {
      usedAt: Date.now(),
    });

    // Update lead status
    await ctx.db.patch(tokenRecord.leadId, {
      status: "unsubscribed",
      unsubscribedAt: Date.now(),
      unsubscribeReason: args.reason,
      updatedAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      leadId: tokenRecord.leadId,
      activityType: "unsubscribed",
      description: `Unsubscribed${args.reason ? `: ${args.reason}` : ""}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

**Step 3: Commit**

Run:
```bash
git add convex/unsubscribe.ts
git commit -m "feat: add unsubscribe token system"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Unsubscribe functions deploy successfully

---

### Task 3.4: Metrics Tracking

**Files:**
- Create: `convex/metrics.ts`

**Step 1: Create metrics.ts**

Create `convex/metrics.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateToday = mutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];

    let metrics = await ctx.db
      .query("dailyMetrics")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (!metrics) {
      const id = await ctx.db.insert("dailyMetrics", {
        date: today,
        leadsImported: 0,
        leadsValidated: 0,
        leadsInvalid: 0,
        leadsEnriched: 0,
        enrichmentErrors: 0,
        emailsSent: 0,
        emailsDelivered: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        emailsBounced: 0,
        replies: 0,
        demosBooked: 0,
        unsubscribes: 0,
        variantASent: 0,
        variantAOpened: 0,
        variantBSent: 0,
        variantBOpened: 0,
        velocitySent: 0,
        complianceSent: 0,
        businessSent: 0,
      });
      metrics = await ctx.db.get(id);
    }

    return metrics;
  },
});

export const increment = mutation({
  args: {
    metric: v.string(),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const metrics = await ctx.db
      .query("dailyMetrics")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();

    if (!metrics) return;

    const increment = args.amount || 1;
    const currentValue = (metrics as any)[args.metric] || 0;

    await ctx.db.patch(metrics._id, {
      [args.metric]: currentValue + increment,
    });
  },
});

export const getToday = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    return await ctx.db
      .query("dailyMetrics")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();
  },
});

export const getRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const metrics = await ctx.db
      .query("dailyMetrics")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();

    return metrics.sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getSummary = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - args.days);

    const metrics = await ctx.db
      .query("dailyMetrics")
      .filter((q) =>
        q.gte(q.field("date"), startDate.toISOString().split("T")[0])
      )
      .collect();

    const totals = metrics.reduce(
      (acc, m) => ({
        leadsImported: acc.leadsImported + m.leadsImported,
        leadsEnriched: acc.leadsEnriched + m.leadsEnriched,
        emailsSent: acc.emailsSent + m.emailsSent,
        emailsOpened: acc.emailsOpened + m.emailsOpened,
        emailsClicked: acc.emailsClicked + m.emailsClicked,
        replies: acc.replies + m.replies,
        demosBooked: acc.demosBooked + m.demosBooked,
        unsubscribes: acc.unsubscribes + m.unsubscribes,
      }),
      {
        leadsImported: 0,
        leadsEnriched: 0,
        emailsSent: 0,
        emailsOpened: 0,
        emailsClicked: 0,
        replies: 0,
        demosBooked: 0,
        unsubscribes: 0,
      }
    );

    return {
      ...totals,
      openRate:
        totals.emailsSent > 0
          ? ((totals.emailsOpened / totals.emailsSent) * 100).toFixed(1)
          : "0",
      clickRate:
        totals.emailsOpened > 0
          ? ((totals.emailsClicked / totals.emailsOpened) * 100).toFixed(1)
          : "0",
      replyRate:
        totals.emailsSent > 0
          ? ((totals.replies / totals.emailsSent) * 100).toFixed(1)
          : "0",
      demoRate:
        totals.emailsSent > 0
          ? ((totals.demosBooked / totals.emailsSent) * 100).toFixed(1)
          : "0",
    };
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

**Step 3: Commit**

Run:
```bash
git add convex/metrics.ts
git commit -m "feat: add daily metrics tracking"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: Metrics functions deploy successfully

---

### Task 3.5: A/B Test Tracking

**Files:**
- Create: `convex/abTests.ts`

**Step 1: Create abTests.ts**

Create `convex/abTests.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const assignVariant = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const variant = Math.random() < 0.5 ? "A" : "B";

    await ctx.db.patch(args.leadId, {
      sequenceVariant: variant,
      updatedAt: Date.now(),
    });

    return variant as "A" | "B";
  },
});

export const recordEvent = mutation({
  args: {
    testName: v.string(),
    tier: v.string(),
    sequenceStep: v.number(),
    variant: v.union(v.literal("A"), v.literal("B")),
    eventType: v.union(
      v.literal("sent"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("replied")
    ),
    subjectA: v.optional(v.string()),
    subjectB: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let test = await ctx.db
      .query("abTestResults")
      .withIndex("by_test", (q) => q.eq("testName", args.testName))
      .first();

    if (!test) {
      const id = await ctx.db.insert("abTestResults", {
        testName: args.testName,
        tier: args.tier,
        sequenceStep: args.sequenceStep,
        variantA: {
          subject: args.subjectA || "",
          sent: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
        },
        variantB: {
          subject: args.subjectB || "",
          sent: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
        },
        startDate: new Date().toISOString().split("T")[0],
      });
      test = await ctx.db.get(id);
    }

    if (!test) return;

    const variantKey = args.variant === "A" ? "variantA" : "variantB";
    const currentVariant = test[variantKey];

    await ctx.db.patch(test._id, {
      [variantKey]: {
        ...currentVariant,
        [args.eventType]: (currentVariant as any)[args.eventType] + 1,
      },
    });
  },
});

export const getResults = query({
  args: { testName: v.string() },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("abTestResults")
      .withIndex("by_test", (q) => q.eq("testName", args.testName))
      .first();

    if (!test) return null;

    const aOpenRate =
      test.variantA.sent > 0
        ? (test.variantA.opened / test.variantA.sent) * 100
        : 0;
    const bOpenRate =
      test.variantB.sent > 0
        ? (test.variantB.opened / test.variantB.sent) * 100
        : 0;

    const totalSent = test.variantA.sent + test.variantB.sent;
    const hasEnoughData = totalSent >= 100;

    let winner: "A" | "B" | "none" = "none";
    if (hasEnoughData) {
      const diff = Math.abs(aOpenRate - bOpenRate);
      if (diff > 5) {
        winner = aOpenRate > bOpenRate ? "A" : "B";
      }
    }

    return {
      ...test,
      aOpenRate: aOpenRate.toFixed(1),
      bOpenRate: bOpenRate.toFixed(1),
      aClickRate:
        test.variantA.opened > 0
          ? ((test.variantA.clicked / test.variantA.opened) * 100).toFixed(1)
          : "0",
      bClickRate:
        test.variantB.opened > 0
          ? ((test.variantB.clicked / test.variantB.opened) * 100).toFixed(1)
          : "0",
      hasEnoughData,
      winner,
    };
  },
});

export const getAllResults = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("abTestResults").collect();
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

**Step 3: Commit**

Run:
```bash
git add convex/abTests.ts
git commit -m "feat: add A/B test tracking"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: A/B test functions deploy successfully

---

### Task 3.6: Email Events Logging

**Files:**
- Create: `convex/emailEvents.ts`

**Step 1: Create emailEvents.ts**

Create `convex/emailEvents.ts`:
```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const log = mutation({
  args: {
    leadId: v.id("leads"),
    eventType: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("replied"),
      v.literal("bounced"),
      v.literal("complained"),
      v.literal("unsubscribed")
    ),
    emailSubject: v.string(),
    sequenceStep: v.number(),
    sequenceVariant: v.optional(v.union(v.literal("A"), v.literal("B"))),
    resendMessageId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailEvents", {
      leadId: args.leadId,
      eventType: args.eventType,
      emailSubject: args.emailSubject,
      sequenceStep: args.sequenceStep,
      sequenceVariant: args.sequenceVariant,
      resendMessageId: args.resendMessageId,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export const getByLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailEvents")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .order("desc")
      .collect();
  },
});

export const getByResendId = query({
  args: { resendMessageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailEvents")
      .withIndex("by_resend_id", (q) => q.eq("resendMessageId", args.resendMessageId))
      .first();
  },
});

export const getRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailEvents")
      .order("desc")
      .take(args.limit);
  },
});
```

**Step 2: Push to Convex**

Run:
```bash
npx convex dev --once
```

**Step 3: Commit**

Run:
```bash
git add convex/emailEvents.ts
git commit -m "feat: add email events logging"
```

**✅ Verify:**
```bash
npx convex dev --once --typecheck
```
Expected: All Convex functions deploy, Phase 3 complete

---

## Phase 4: External Service Integrations

### Task 4.1: Gemini AI Client

**Files:**
- Create: `lib/gemini.ts`

**Step 1: Create gemini.ts**

Create `lib/gemini.ts`:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateWithGemini(
  prompt: string,
  jsonMode = false
): Promise<string> {
  const model = genai.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: jsonMode ? "application/json" : "text/plain",
          maxOutputTokens: 4096,
        },
      });

      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      return text;
    } catch (error: any) {
      lastError = error;
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (error.message?.includes("429") || error.message?.includes("quota")) {
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
      } else if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw new Error(
    `Gemini failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}

export async function generateStructured<T>(
  prompt: string,
  schema: string
): Promise<T> {
  const fullPrompt = `${prompt}

Return your response as valid JSON matching this schema:
${schema}

Return ONLY the JSON, no other text.`;

  const result = await generateWithGemini(fullPrompt, true);
  return JSON.parse(result) as T;
}
```

**Step 2: Commit**

Run:
```bash
git add lib/gemini.ts
git commit -m "feat: add Gemini AI client with retry logic"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, lib/gemini.ts compiles

---

### Task 4.2: Jina AI Web Scraping

**Files:**
- Create: `lib/jina.ts`

**Step 1: Create jina.ts**

Create `lib/jina.ts`:
```typescript
const JINA_READER_URL = "https://r.jina.ai";
const JINA_SEARCH_URL = "https://s.jina.ai";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function scrapeUrl(url: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${JINA_READER_URL}/${url}`, {
        headers: {
          Accept: "text/markdown",
          ...(process.env.JINA_API_KEY && {
            Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Jina scrape failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.text();
    } catch (error: any) {
      lastError = error;
      console.error(`Jina scrape attempt ${attempt} failed:`, error.message);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(
    `Jina scrape failed after ${MAX_RETRIES} attempts, returning empty`
  );
  return "";
}

export async function searchWeb(query: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `${JINA_SEARCH_URL}/?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Accept: "text/markdown",
            ...(process.env.JINA_API_KEY && {
              Authorization: `Bearer ${process.env.JINA_API_KEY}`,
            }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Jina search failed: ${response.status}`);
      }

      return await response.text();
    } catch (error: any) {
      lastError = error;
      console.error(`Jina search attempt ${attempt} failed:`, error.message);

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(
    `Jina search failed after ${MAX_RETRIES} attempts, returning empty`
  );
  return "";
}
```

**Step 2: Commit**

Run:
```bash
git add lib/jina.ts
git commit -m "feat: add Jina AI web scraping client"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, lib/jina.ts compiles

---

### Task 4.3: Email Validation (ZeroBounce)

**Files:**
- Create: `lib/validation.ts`

**Step 1: Create validation.ts**

Create `lib/validation.ts`:
```typescript
export interface ValidationResult {
  valid: boolean;
  result: "valid" | "invalid" | "risky" | "unknown";
  reason?: string;
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${encodeURIComponent(email)}`
    );

    const data = await response.json();

    // ZeroBounce status codes:
    // valid, invalid, catch-all, unknown, spamtrap, abuse, do_not_mail

    if (data.status === "valid") {
      return { valid: true, result: "valid" };
    }

    if (
      data.status === "invalid" ||
      data.status === "spamtrap" ||
      data.status === "abuse"
    ) {
      return { valid: false, result: "invalid", reason: data.status };
    }

    if (data.status === "catch-all" || data.status === "unknown") {
      return { valid: true, result: "risky", reason: data.status };
    }

    if (data.status === "do_not_mail") {
      return { valid: false, result: "invalid", reason: "do_not_mail" };
    }

    return { valid: false, result: "unknown", reason: data.status };
  } catch (error) {
    console.error("Email validation failed:", error);
    return { valid: false, result: "unknown", reason: "api_error" };
  }
}

export async function validateEmailBatch(
  emails: string[]
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();

  for (const email of emails) {
    const result = await validateEmail(email);
    results.set(email, result);

    // Rate limit: 1 request per 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}
```

**Step 2: Commit**

Run:
```bash
git add lib/validation.ts
git commit -m "feat: add ZeroBounce email validation"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, lib/validation.ts compiles

---

### Task 4.4: Resend Email Client

**Files:**
- Create: `lib/resend.ts`

**Step 1: Create resend.ts**

Create `lib/resend.ts`:
```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  leadId: string;
  sequenceStep: number;
  variant: "A" | "B";
  tier: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Jason <jason@risksure.ai>",
      to: params.to,
      subject: params.subject,
      html: params.html,
      tags: [
        { name: "lead_id", value: params.leadId },
        { name: "sequence_step", value: String(params.sequenceStep) },
        { name: "variant", value: params.variant },
        { name: "tier", value: params.tier },
      ],
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendNotification(
  subject: string,
  message: string
): Promise<void> {
  if (!process.env.NOTIFICATION_EMAIL) return;

  try {
    await resend.emails.send({
      from: "RiskSure Alerts <alerts@risksure.ai>",
      to: process.env.NOTIFICATION_EMAIL,
      subject,
      text: message,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
```

**Step 2: Commit**

Run:
```bash
git add lib/resend.ts
git commit -m "feat: add Resend email client"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, lib/resend.ts compiles

---

### Task 4.5: Enrichment Pipeline

**Files:**
- Create: `lib/enrichment.ts`

**Step 1: Create enrichment.ts**

Create `lib/enrichment.ts`:
```typescript
import { scrapeUrl, searchWeb } from "./jina";
import { generateStructured } from "./gemini";

export interface EnrichmentResult {
  success: boolean;
  enrichmentData?: {
    companySummary: string;
    estimatedProjects: number;
    estimatedSubcontractors: number;
    estimatedRevenue: string;
    complianceMaturity: "none" | "basic" | "advanced";
    painPointSignals: string[];
    decisionMakers: string[];
    recentNews: string[];
    confidence: "low" | "medium" | "high";
  };
  enrichmentScore?: number;
  tier?: "velocity" | "compliance" | "business";
  estimatedSubbies?: number;
  estimatedRevenue?: string;
  personalizedOpener?: string;
  painPoints?: string[];
  error?: string;
}

interface ResearchOutput {
  companySummary: string;
  estimatedProjects: number;
  estimatedSubcontractors: number;
  estimatedRevenue: string;
  complianceMaturity: "none" | "basic" | "advanced";
  painPointSignals: string[];
  decisionMakers: string[];
  recentNews: string[];
  confidence: "low" | "medium" | "high";
}

export async function enrichLead(lead: {
  companyName: string;
  website?: string;
  contactName: string;
  contactTitle?: string;
  state?: string;
}): Promise<EnrichmentResult> {
  try {
    // Step 1: Scrape company website (graceful failure)
    let websiteContent = "";
    if (lead.website) {
      websiteContent = await scrapeUrl(lead.website);
    }

    // Step 2: Search for company info (graceful failure)
    const searchResults = await searchWeb(
      `${lead.companyName} construction ${lead.state || "Australia"} projects subcontractors`
    );

    // Step 3: Research with Gemini
    const research = await generateStructured<ResearchOutput>(
      `
You are researching an Australian construction company for sales outreach.

Company: ${lead.companyName}
Website: ${lead.website || "Unknown"}
State: ${lead.state || "Unknown"}

Website Content:
${websiteContent.slice(0, 15000) || "Not available"}

Search Results:
${searchResults.slice(0, 10000) || "Not available"}

Analyze this information and estimate:
1. Company summary (1-2 sentences)
2. Number of active projects
3. Number of subcontractors they likely work with
4. Estimated annual revenue bracket
5. Their compliance maturity level (none/basic/advanced)
6. Pain points related to subcontractor management and insurance compliance
7. Key decision makers
8. Recent news or notable projects

Revenue brackets: "$5M-$20M", "$20M-$100M", "$100M+"
Subcontractor estimates: Use company size, project count, and industry norms.

If information is limited, make reasonable estimates based on company type and mark confidence as "low".
`,
      `{
  "companySummary": "string",
  "estimatedProjects": "number",
  "estimatedSubcontractors": "number",
  "estimatedRevenue": "string (one of: $5M-$20M, $20M-$100M, $100M+)",
  "complianceMaturity": "none | basic | advanced",
  "painPointSignals": ["string array - specific pain points"],
  "decisionMakers": ["string array"],
  "recentNews": ["string array"],
  "confidence": "low | medium | high"
}`
    );

    // Step 4: Qualify into tier
    const estimatedSubbies = research.estimatedSubcontractors || 50;

    let tier: "velocity" | "compliance" | "business" = "velocity";
    if (estimatedSubbies > 250 || research.estimatedRevenue === "$100M+") {
      tier = "business";
    } else if (estimatedSubbies > 75 || research.estimatedRevenue === "$20M-$100M") {
      tier = "compliance";
    }

    // Step 5: Calculate enrichment score
    let score = 0;

    // Subbie count score
    if (estimatedSubbies >= 20 && estimatedSubbies <= 500) score += 30;
    else if (estimatedSubbies > 0) score += 15;

    // Pain point signals
    score += Math.min((research.painPointSignals?.length || 0) * 10, 30);

    // Compliance maturity (lower = better prospect)
    if (research.complianceMaturity === "none") score += 20;
    else if (research.complianceMaturity === "basic") score += 10;

    // Decision makers identified
    if (research.decisionMakers?.length > 0) score += 20;

    // Step 6: Generate personalized opener
    const tierValueProps = {
      velocity: "save hours every week on manual certificate checking",
      compliance: "scale your compliance process without adding headcount",
      business: "get portfolio-wide visibility and executive compliance reporting",
    };

    const openerResult = await generateStructured<{ opener: string }>(
      `
Write a personalized email opener for cold outreach to:

Contact: ${lead.contactName}${lead.contactTitle ? `, ${lead.contactTitle}` : ""}
Company: ${lead.companyName}

Research findings:
${JSON.stringify(research, null, 2)}

Product: RiskSure.AI - automates Certificate of Currency verification for Australian construction companies.
- AI verifies insurance certificates in 30 seconds (not 3-5 days of chasing)
- FREE for subcontractors (unlike Cm3 which charges $400-$3,000/year)
- Audit-ready compliance trail for WorkSafe

Value prop for ${tier} tier: ${tierValueProps[tier]}

Write ONLY a 1-2 sentence opener that:
1. References something specific about their company (project, growth, location)
2. Connects to a compliance or subcontractor management pain point
3. Feels personal and relevant - like you actually researched them

Do NOT mention RiskSure or the product yet. Just the hook.
Keep it under 50 words. No greeting, no sign-off.
`,
      `{ "opener": "string" }`
    );

    return {
      success: true,
      enrichmentData: research,
      enrichmentScore: score,
      tier,
      estimatedSubbies,
      estimatedRevenue: research.estimatedRevenue,
      personalizedOpener: openerResult.opener,
      painPoints: research.painPointSignals,
    };
  } catch (error: any) {
    console.error(`Enrichment failed for ${lead.companyName}:`, error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

**Step 2: Commit**

Run:
```bash
git add lib/enrichment.ts
git commit -m "feat: add AI enrichment pipeline"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, all lib/ files compile, Phase 4 complete

---

## Phase 5: Email Templates

### Task 5.1: Email Template Components

**Files:**
- Create: `templates/components/UnsubscribeFooter.tsx`
- Create: `templates/components/EmailWrapper.tsx`

**Step 1: Create UnsubscribeFooter.tsx**

Create `templates/components/UnsubscribeFooter.tsx`:
```tsx
interface UnsubscribeFooterProps {
  unsubscribeUrl: string;
}

export function UnsubscribeFooter({ unsubscribeUrl }: UnsubscribeFooterProps) {
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; line-height: 18px;">
      <p style="margin: 0;">
        RiskSure.AI Pty Ltd | ABN: XX XXX XXX XXX<br />
        Sydney, NSW, Australia
      </p>
      <p style="margin-top: 10px;">
        You're receiving this because you may benefit from compliance automation.<br />
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">
          Unsubscribe from future emails
        </a>
      </p>
    </div>
  `;
}
```

**Step 2: Create EmailWrapper.tsx**

Create `templates/components/EmailWrapper.tsx`:
```tsx
import { UnsubscribeFooter } from "./UnsubscribeFooter";

interface EmailWrapperProps {
  content: string;
  unsubscribeUrl: string;
}

export function wrapEmail({ content, unsubscribeUrl }: EmailWrapperProps): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${content}
  ${UnsubscribeFooter({ unsubscribeUrl })}
</body>
</html>
  `.trim();
}
```

**Step 3: Commit**

Run:
```bash
git add templates/components/
git commit -m "feat: add email template components"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, template components compile

---

### Task 5.2: Velocity Tier Email Templates

**Files:**
- Create: `templates/velocity/index.ts`

**Step 1: Create velocity templates**

Create `templates/velocity/index.ts`:
```typescript
import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

// ============================================
// SEQUENCE CONFIGURATION
// ============================================
export const velocitySequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Quick question about certificate compliance",
    subjectB: "Still chasing certificates from subbies?",
  },
  {
    step: 1,
    delayDays: 3,
    subjectA: "Re: Quick question",
    subjectB: "Re: Certificate compliance",
  },
  {
    step: 2,
    delayDays: 7,
    subjectA: "How {{company}} can save 10+ hours/week",
    subjectB: "What if WorkSafe audits tomorrow?",
  },
  {
    step: 3,
    delayDays: 14,
    subjectA: "Last note on compliance automation",
    subjectB: "Closing the loop",
  },
];

// ============================================
// STEP 0 - INITIAL OUTREACH
// ============================================
export function velocityStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Most builders I talk to spend 5-10 hours a week chasing Certificates of Currency from subbies. And even then, there are usually gaps.</p>
    <p>We built an AI that reads certificates in 30 seconds and flags compliance issues automatically. No more spreadsheets, no more chasing.</p>
    <p>Worth a quick look?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Here's what keeps me up at night for builders: WorkSafe shows up, asks for your subbie compliance records, and you're digging through spreadsheets hoping nothing slipped through.</p>
    <p>We built RiskSure to fix that—AI verifies every certificate in 30 seconds, creates an audit trail, and alerts you to gaps before they become problems.</p>
    <p>Best part? It's free for your subbies, so they actually use it (unlike Cm3).</p>
    <p>Got 15 minutes this week?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 1 - FOLLOW UP
// ============================================
export function velocityStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on my note about certificate compliance.</p>
    <p>Quick question: How are you currently tracking subbie insurance? Spreadsheets? Cm3? Someone's inbox?</p>
    <p>Just curious what the process looks like at ${params.companyName}.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back—did my last email about certificate verification land?</p>
    <p>One thing I should mention: if you're using Cm3, our customers typically see 2-3x better adoption because subbies don't have to pay anything.</p>
    <p>Happy to show you how it works in 15 minutes.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 2 - VALUE PROPOSITION
// ============================================
export function velocityStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Did some quick math for a company your size:</p>
    <p>If you're manually verifying certificates for 50+ subbies, that's probably 10-15 hours/week of admin time. At $50/hour, that's $25,000-$40,000/year.</p>
    <p>RiskSure automates all of it for $349/month. Plus you get an audit trail that actually impresses WorkSafe.</p>
    <p><a href="${params.calendlyUrl}">Book 15 mins here</a> if you want to see how it works.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I keep hearing about builders who nearly got caught out by WorkSafe audits—expired certificates they didn't catch, subbies who "forgot" to renew their WorkCover.</p>
    <p>With the new industrial manslaughter laws, that's not just a fine anymore. It's personal liability.</p>
    <p>RiskSure gives you a defensible audit trail: every certificate verified by AI, every check timestamped, every gap flagged.</p>
    <p>Worth 15 minutes to see how it works?</p>
    <p><a href="${params.calendlyUrl}">Grab a time here</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 3 - BREAKUP
// ============================================
export function velocityStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I'll keep this short—this is my last email.</p>
    <p>If subbie compliance isn't a pain point for ${params.companyName} right now, totally understand. I'll close your file.</p>
    <p>But if you're ever drowning in certificate chasing or prepping for an audit, the door's always open: <a href="${params.calendlyUrl}">risksure.ai/demo</a></p>
    <p>Good luck with the projects.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop on my emails about certificate compliance.</p>
    <p>If timing isn't right, no worries. But before I go—we're running a founder's special: 50% off for 6 months for early adopters.</p>
    <p>Code is FOUNDER50 if you ever want to try it out.</p>
    <p>All the best with ${params.companyName}.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// TEMPLATE GETTER
// ============================================
export function getVelocityTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": velocityStep0A,
    "0B": velocityStep0B,
    "1A": velocityStep1A,
    "1B": velocityStep1B,
    "2A": velocityStep2A,
    "2B": velocityStep2B,
    "3A": velocityStep3A,
    "3B": velocityStep3B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: velocity step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getVelocitySubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = velocitySequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: velocity step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}
```

**Step 2: Commit**

Run:
```bash
git add templates/velocity/
git commit -m "feat: add Velocity tier email templates"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, velocity templates compile

---

### Task 5.3: Compliance Tier Email Templates

**Files:**
- Create: `templates/compliance/index.ts`

**Step 1: Create compliance templates**

Create `templates/compliance/index.ts`:
```typescript
import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

export const complianceSequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Scaling {{company}}'s compliance process",
    subjectB: "Your subbies hate Cm3 fees. What if it was free?",
  },
  {
    step: 1,
    delayDays: 3,
    subjectA: "Re: Scaling compliance",
    subjectB: "Re: Free for subbies",
  },
  {
    step: 2,
    delayDays: 7,
    subjectA: "Multi-project compliance visibility",
    subjectB: "Morning briefings on compliance gaps",
  },
  {
    step: 3,
    delayDays: 10,
    subjectA: "Procore integration for {{company}}",
    subjectB: "Procore + automated compliance",
  },
  {
    step: 4,
    delayDays: 14,
    subjectA: "Final follow-up",
    subjectB: "Closing the loop",
  },
];

export function complianceStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>At your scale, manually tracking subbie insurance across multiple projects becomes a full-time job. And when something slips through, it's your neck on the line.</p>
    <p>We built RiskSure for exactly this: AI that verifies certificates in 30 seconds, tracks expiries across your entire portfolio, and sends you a morning brief on who's compliant and who's not.</p>
    <p>Green light, red light. No spreadsheets.</p>
    <p>Worth 20 minutes to see how it works for multi-project operations?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Quick question: what's your subbie adoption rate on Cm3?</p>
    <p>We keep hearing it's under 50% because subbies don't want to pay $400-$3,000/year. So you're still chasing certificates manually anyway.</p>
    <p>RiskSure is free for subbies—literally $0 forever. They get a magic link, upload in 60 seconds, done. No account creation, no fees.</p>
    <p>That's how we get 90%+ adoption.</p>
    <p>Happy to show you how it works.</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on multi-project compliance.</p>
    <p>One thing I forgot to mention: we integrate with Procore. Bi-directional sync—subbie data flows both ways, no double entry.</p>
    <p>Worth a quick chat?</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back on the subbie adoption question.</p>
    <p>If Cm3 is working great for you, ignore me. But if adoption is a headache, might be worth 15 minutes to see how we solved it.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Something our compliance-tier customers love: the morning brief.</p>
    <p>Every day at 7am, you get a dashboard showing:</p>
    <ul>
      <li>Which subbies have expiring certificates this week</li>
      <li>Which projects have compliance gaps</li>
      <li>Who's at stop-work risk</li>
    </ul>
    <p>It's like having a compliance officer who never sleeps.</p>
    <p><a href="${params.calendlyUrl}">Grab 20 mins here</a> if you want to see it in action.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Imagine this: 7am Monday, coffee in hand, you open your email.</p>
    <p>"${params.companyName} Compliance Brief: 3 subbies with expiring WorkCover this week. 1 stop-work risk at [Project Name]."</p>
    <p>That's RiskSure. You know exactly what needs attention before your feet hit the site.</p>
    <p><a href="${params.calendlyUrl}">Quick demo?</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Last thing I wanted to mention: Procore integration.</p>
    <p>If you're using Procore for project management, RiskSure syncs directly. Subbie compliance data flows both ways—no copy-pasting, no double entry.</p>
    <p>Your project managers see compliance status right in Procore.</p>
    <p>Worth discussing?</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>One more thing on the Procore front:</p>
    <p>We built bi-directional sync specifically for companies your size. Pull subbies from Procore, push compliance status back. Your PMs see green/red lights without leaving their workflow.</p>
    <p><a href="${params.calendlyUrl}">15 mins to see it?</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep4A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>This is my last email on compliance automation.</p>
    <p>If it's not a priority for ${params.companyName} right now, I get it. But the offer stands: 14-day free trial, full Compliance tier features, no credit card.</p>
    <p><a href="${params.calendlyUrl}">Calendar link here</a> if timing ever works out.</p>
    <p>All the best.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep4B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop—last note from me.</p>
    <p>If you're ever prepping for a WorkSafe audit or drowning in subbie compliance, we're here. Founder's special still applies: FOUNDER50 for 50% off.</p>
    <p>Good luck with the projects.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function getComplianceTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": complianceStep0A,
    "0B": complianceStep0B,
    "1A": complianceStep1A,
    "1B": complianceStep1B,
    "2A": complianceStep2A,
    "2B": complianceStep2B,
    "3A": complianceStep3A,
    "3B": complianceStep3B,
    "4A": complianceStep4A,
    "4B": complianceStep4B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: compliance step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getComplianceSubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = complianceSequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: compliance step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}
```

**Step 2: Commit**

Run:
```bash
git add templates/compliance/
git commit -m "feat: add Compliance tier email templates"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, compliance templates compile

---

### Task 5.4: Business Tier Email Templates

**Files:**
- Create: `templates/business/index.ts`

**Step 1: Create business templates**

Create `templates/business/index.ts`:
```typescript
import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

export const businessSequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Portfolio compliance risk at {{company}}",
    subjectB: "Executive visibility into subbie compliance",
  },
  {
    step: 1,
    delayDays: 4,
    subjectA: "Re: Portfolio compliance",
    subjectB: "Re: Executive visibility",
  },
  {
    step: 2,
    delayDays: 8,
    subjectA: "WorkSafe audit readiness for {{company}}",
    subjectB: "Industrial manslaughter compliance trail",
  },
  {
    step: 3,
    delayDays: 12,
    subjectA: "ROI analysis for {{company}}",
    subjectB: "Cost of manual compliance at scale",
  },
  {
    step: 4,
    delayDays: 18,
    subjectA: "Leadership discussion?",
    subjectB: "Closing the loop",
  },
];

export function businessStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>At ${params.companyName}'s scale, subcontractor compliance isn't just an admin task—it's enterprise risk.</p>
    <p>One uninsured subbie incident across your portfolio could mean millions in exposure. And with industrial manslaughter laws, it's not just the company at risk.</p>
    <p>We built RiskSure for enterprise operations: portfolio-wide compliance visibility, executive dashboards, and an audit trail that stands up to scrutiny.</p>
    <p>Worth a conversation with your leadership team?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Quick question for you: Does your leadership team have real-time visibility into subbie compliance across all projects?</p>
    <p>Most enterprise builders we talk to have the data somewhere—spreadsheets, Cm3, email chains—but no single source of truth.</p>
    <p>RiskSure gives you a portfolio-wide dashboard: every project, every subbie, every certificate. Green light, red light, drill down as needed.</p>
    <p>Is this on your radar?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on portfolio compliance visibility.</p>
    <p>One thing I should mention: we offer dedicated onboarding for enterprise accounts. Your team won't be left figuring things out alone.</p>
    <p>Worth a quick call?</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back on executive dashboards.</p>
    <p>Imagine your Monday morning: CEO asks "where are we on subbie compliance?" You pull up a single dashboard, filter by project, drill down to problem subbies.</p>
    <p>That's what we built.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Something enterprise clients prioritize: WorkSafe audit readiness.</p>
    <p>RiskSure creates a timestamped audit trail for every certificate verification:</p>
    <ul>
      <li>When was each certificate uploaded?</li>
      <li>What checks were performed?</li>
      <li>What was the AI confidence score?</li>
      <li>Who approved it (or flagged it)?</li>
    </ul>
    <p>If WorkSafe walks in tomorrow, you hand them a system, not a scramble.</p>
    <p><a href="${params.calendlyUrl}">Worth discussing?</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>The industrial manslaughter laws changed the game for enterprise builders.</p>
    <p>It's not enough to have insurance—you need to prove you verified it. Prove you had a system. Prove due diligence.</p>
    <p>RiskSure gives you that paper trail. Every certificate, every check, timestamped and defensible.</p>
    <p>This is the kind of conversation worth having before an incident, not after.</p>
    <p><a href="${params.calendlyUrl}">Got 30 minutes?</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I ran some numbers for an operation your size:</p>
    <p>Assuming 300+ subbies, 4 certificates each, 30 minutes manual verification time:</p>
    <p><strong>Manual cost: ~$60,000/year in admin time alone.</strong></p>
    <p>RiskSure Business tier: $14,990/year. That's 75% savings, plus the audit trail, plus the peace of mind.</p>
    <p>Happy to walk through the ROI for ${params.companyName} specifically.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Quick math on manual compliance at enterprise scale:</p>
    <ul>
      <li>300 subbies × 4 certs × 30 min = 600 hours/year</li>
      <li>At $50/hour = $30,000 in direct labor</li>
      <li>Add chasing, follow-ups, exceptions = $60,000+</li>
    </ul>
    <p>RiskSure does it in 30 seconds per certificate. The math speaks for itself.</p>
    <p>Worth a CFO-level conversation?</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep4A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Last note from me on enterprise compliance.</p>
    <p>If this isn't a priority for ${params.companyName} right now, I understand. Enterprise decisions take time.</p>
    <p>But if you're ever evaluating compliance systems—or prepping for a major audit—I'd welcome the conversation.</p>
    <p><a href="${params.calendlyUrl}">Door's always open.</a></p>
    <p>All the best.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep4B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop on my emails about portfolio compliance.</p>
    <p>If the timing's not right, no problem. But one thing to file away: we offer quarterly business reviews for enterprise accounts—dedicated check-ins to optimize your compliance process.</p>
    <p>That's the kind of partnership we're building.</p>
    <p>Whenever you're ready.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function getBusinessTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": businessStep0A,
    "0B": businessStep0B,
    "1A": businessStep1A,
    "1B": businessStep1B,
    "2A": businessStep2A,
    "2B": businessStep2B,
    "3A": businessStep3A,
    "3B": businessStep3B,
    "4A": businessStep4A,
    "4B": businessStep4B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: business step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getBusinessSubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = businessSequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: business step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}
```

**Step 2: Commit**

Run:
```bash
git add templates/business/
git commit -m "feat: add Business tier email templates"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, business templates compile

---

### Task 5.5: Template Index

**Files:**
- Create: `templates/index.ts`

**Step 1: Create template index**

Create `templates/index.ts`:
```typescript
import {
  getVelocityTemplate,
  getVelocitySubject,
  velocitySequence,
} from "./velocity";
import {
  getComplianceTemplate,
  getComplianceSubject,
  complianceSequence,
} from "./compliance";
import {
  getBusinessTemplate,
  getBusinessSubject,
  businessSequence,
} from "./business";

export interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

export type Tier = "velocity" | "compliance" | "business";
export type Variant = "A" | "B";

export function getTemplate(
  tier: Tier,
  step: number,
  variant: Variant,
  params: TemplateParams
): string {
  switch (tier) {
    case "velocity":
      return getVelocityTemplate(step, variant, params);
    case "compliance":
      return getComplianceTemplate(step, variant, params);
    case "business":
      return getBusinessTemplate(step, variant, params);
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getSubject(
  tier: Tier,
  step: number,
  variant: Variant,
  companyName: string
): string {
  switch (tier) {
    case "velocity":
      return getVelocitySubject(step, variant, companyName);
    case "compliance":
      return getComplianceSubject(step, variant, companyName);
    case "business":
      return getBusinessSubject(step, variant, companyName);
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getSequence(tier: Tier) {
  switch (tier) {
    case "velocity":
      return velocitySequence;
    case "compliance":
      return complianceSequence;
    case "business":
      return businessSequence;
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

export function getMaxSteps(tier: Tier): number {
  return getSequence(tier).length;
}

export function getDelayDays(tier: Tier, step: number): number {
  const sequence = getSequence(tier);
  const config = sequence[step];
  if (!config) return 7; // Default fallback
  return config.delayDays;
}
```

**Step 2: Commit**

Run:
```bash
git add templates/index.ts
git commit -m "feat: add template index with tier routing"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, all templates compile, Phase 5 complete

---

## Phase 6: API Routes

### Task 6.1: Daily Pipeline Cron

**Files:**
- Create: `app/api/cron/daily-pipeline/route.ts`

**Step 1: Create daily pipeline route**

Create `app/api/cron/daily-pipeline/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { validateEmail } from "@/lib/validation";
import { enrichLead } from "@/lib/enrichment";
import { sendEmail, sendNotification } from "@/lib/resend";
import { getTemplate, getSubject, getMaxSteps } from "@/templates";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    validated: 0,
    enriched: 0,
    emailsSent: 0,
    errors: [] as string[],
  };

  try {
    // ============================================
    // STEP 1: INCREMENT WARMING LIMIT
    // ============================================
    await convex.mutation(api.warming.incrementDailyLimit);
    const warmingStatus = await convex.query(api.warming.getStatus);

    if (!warmingStatus) {
      await convex.mutation(api.warming.initialize);
    }

    // Ensure today's metrics exist
    await convex.mutation(api.metrics.getOrCreateToday);

    // ============================================
    // STEP 2: VALIDATE NEW LEADS
    // ============================================
    const pendingValidation = await convex.query(api.leads.getPendingValidation);

    for (const lead of pendingValidation.slice(0, 50)) {
      try {
        const validation = await validateEmail(lead.contactEmail);

        await convex.mutation(api.leads.updateValidation, {
          leadId: lead._id,
          emailValidated: true,
          emailValidationResult: validation.result,
        });

        await convex.mutation(api.metrics.increment, {
          metric: validation.result === "valid" ? "leadsValidated" : "leadsInvalid",
        });

        results.validated++;
      } catch (error: any) {
        results.errors.push(`Validation error for ${lead.contactEmail}: ${error.message}`);
      }
    }

    // ============================================
    // STEP 3: ENRICH VALIDATED LEADS
    // ============================================
    const pendingEnrichment = await convex.query(api.leads.getPendingEnrichment);

    for (const lead of pendingEnrichment.slice(0, 20)) {
      try {
        const enrichment = await enrichLead({
          companyName: lead.companyName,
          website: lead.website,
          contactName: lead.contactName,
          contactTitle: lead.contactTitle,
          state: lead.state,
        });

        if (enrichment.success) {
          // Assign A/B variant
          const variant = await convex.mutation(api.abTests.assignVariant, {
            leadId: lead._id,
          });

          await convex.mutation(api.leads.updateEnrichment, {
            leadId: lead._id,
            enrichmentData: enrichment.enrichmentData,
            enrichmentScore: enrichment.enrichmentScore!,
            tier: enrichment.tier!,
            estimatedSubbies: enrichment.estimatedSubbies!,
            estimatedRevenue: enrichment.estimatedRevenue,
            personalizedOpener: enrichment.personalizedOpener!,
            painPoints: enrichment.painPoints,
          });

          await convex.mutation(api.metrics.increment, { metric: "leadsEnriched" });
          results.enriched++;
        } else {
          await convex.mutation(api.leads.setEnrichmentError, {
            leadId: lead._id,
            error: enrichment.error || "Unknown error",
          });
          await convex.mutation(api.metrics.increment, { metric: "enrichmentErrors" });
        }
      } catch (error: any) {
        results.errors.push(`Enrichment error for ${lead.companyName}: ${error.message}`);
      }
    }

    // ============================================
    // STEP 4: SEND EMAILS
    // ============================================
    const currentWarmingStatus = await convex.query(api.warming.getStatus);

    if (!currentWarmingStatus || currentWarmingStatus.emailsRemaining <= 0) {
      return NextResponse.json({
        ...results,
        message: "Daily email limit reached",
        warmingStatus: currentWarmingStatus,
      });
    }

    const readyForEmail = await convex.query(api.leads.getReadyForEmail, {
      limit: currentWarmingStatus.emailsRemaining,
    });

    for (const lead of readyForEmail) {
      try {
        // Skip if already at max steps
        const maxSteps = getMaxSteps(lead.tier);
        if (lead.currentSequenceStep >= maxSteps) {
          continue;
        }

        // Check warming limit
        const canSend = await convex.query(api.warming.canSendEmail);
        if (!canSend) break;

        const step = lead.currentSequenceStep;
        const variant = lead.sequenceVariant || "A";

        // Generate unsubscribe token
        const unsubscribeToken = await convex.mutation(
          api.unsubscribe.generateTokenForLead,
          { leadId: lead._id }
        );
        const unsubscribeUrl = `${process.env.UNSUBSCRIBE_BASE_URL}/${unsubscribeToken}`;

        // Get template
        const html = getTemplate(lead.tier, step, variant, {
          contactName: lead.contactName,
          companyName: lead.companyName,
          personalizedOpener: lead.personalizedOpener || "",
          unsubscribeUrl,
          calendlyUrl: process.env.CALENDLY_BOOKING_URL || "https://calendly.com/risksure/demo",
        });

        const subject = getSubject(lead.tier, step, variant, lead.companyName);

        // Send email
        const result = await sendEmail({
          to: lead.contactEmail,
          subject,
          html,
          leadId: lead._id,
          sequenceStep: step,
          variant,
          tier: lead.tier,
        });

        if (result.success && result.messageId) {
          // Update lead
          await convex.mutation(api.leads.markEmailSent, {
            leadId: lead._id,
            resendMessageId: result.messageId,
            subject,
            sequenceStep: step,
            variant,
          });

          // Record warming
          await convex.mutation(api.warming.recordEmailSent);

          // Record metrics
          await convex.mutation(api.metrics.increment, { metric: "emailsSent" });
          await convex.mutation(api.metrics.increment, {
            metric: variant === "A" ? "variantASent" : "variantBSent",
          });
          await convex.mutation(api.metrics.increment, {
            metric: `${lead.tier}Sent`,
          });

          // Record A/B test
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${lead.tier}_step${step}`,
            tier: lead.tier,
            sequenceStep: step,
            variant,
            eventType: "sent",
            subjectA: getSubject(lead.tier, step, "A", lead.companyName),
            subjectB: getSubject(lead.tier, step, "B", lead.companyName),
          });

          results.emailsSent++;
        } else {
          results.errors.push(`Email error for ${lead.contactEmail}: ${result.error}`);
        }
      } catch (error: any) {
        results.errors.push(`Email error for ${lead.contactEmail}: ${error.message}`);
      }
    }

    // Send summary notification
    if (results.emailsSent > 0 || results.enriched > 0) {
      await sendNotification(
        "Daily Pipeline Complete",
        `Validated: ${results.validated}\nEnriched: ${results.enriched}\nEmails Sent: ${results.emailsSent}\nErrors: ${results.errors.length}`
      );
    }

    return NextResponse.json({
      success: true,
      ...results,
      warmingStatus: {
        dailyLimit: currentWarmingStatus?.currentDailyLimit,
        remaining: currentWarmingStatus?.emailsRemaining,
      },
    });
  } catch (error: any) {
    console.error("Daily pipeline failed:", error);
    return NextResponse.json(
      {
        error: error.message,
        ...results,
      },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

Run:
```bash
git add app/api/cron/daily-pipeline/
git commit -m "feat: add daily pipeline cron job"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, cron route compiles

---

### Task 6.2: Resend Webhook Handler

**Files:**
- Create: `app/api/webhooks/resend/route.ts`

**Step 1: Create Resend webhook route**

Create `app/api/webhooks/resend/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendNotification } from "@/lib/resend";
import crypto from "crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function verifySignature(payload: string, signature: string): boolean {
  if (!process.env.RESEND_WEBHOOK_SECRET) return true; // Skip in dev

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RESEND_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("resend-signature") || "";

  // Verify signature in production
  if (process.env.NODE_ENV === "production") {
    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const { type, data } = JSON.parse(payload);

  // Extract tags
  const tags = data.tags || [];
  const leadId = tags.find((t: any) => t.name === "lead_id")?.value;
  const variant = tags.find((t: any) => t.name === "variant")?.value as "A" | "B" | undefined;
  const tier = tags.find((t: any) => t.name === "tier")?.value;
  const sequenceStep = parseInt(
    tags.find((t: any) => t.name === "sequence_step")?.value || "0"
  );

  if (!leadId) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (type) {
      case "email.delivered":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "delivered",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
        });
        await convex.mutation(api.metrics.increment, { metric: "emailsDelivered" });
        break;

      case "email.opened":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "opened",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
        });

        await convex.mutation(api.leads.markOpened, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsOpened" });
        await convex.mutation(api.metrics.increment, {
          metric: variant === "A" ? "variantAOpened" : "variantBOpened",
        });

        // Record A/B test result
        if (tier && variant) {
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${tier}_step${sequenceStep}`,
            tier,
            sequenceStep,
            variant,
            eventType: "opened",
          });
        }

        // Notify on first open
        await sendNotification(
          "Email Opened",
          `Lead opened email: ${data.to?.[0] || "unknown"}`
        );
        break;

      case "email.clicked":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "clicked",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
          metadata: { url: data.click?.link },
        });

        await convex.mutation(api.leads.markClicked, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsClicked" });

        // Record A/B test
        if (tier && variant) {
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${tier}_step${sequenceStep}`,
            tier,
            sequenceStep,
            variant,
            eventType: "clicked",
          });
        }

        // HOT LEAD - notify immediately
        await sendNotification(
          "HOT LEAD - Link Clicked!",
          `Lead clicked link: ${data.to?.[0] || "unknown"}\nURL: ${data.click?.link || "unknown"}`
        );
        break;

      case "email.bounced":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "bounced",
          emailSubject: data.subject || "",
          sequenceStep,
          resendMessageId: data.email_id,
          metadata: { reason: data.bounce?.type },
        });

        await convex.mutation(api.leads.markBounced, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsBounced" });
        break;

      case "email.complained":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "complained",
          emailSubject: data.subject || "",
          sequenceStep,
          resendMessageId: data.email_id,
        });

        // Treat complaint as unsubscribe
        await convex.mutation(api.leads.updateStatus, {
          leadId,
          status: "unsubscribed",
          note: "Marked as spam",
        });
        await convex.mutation(api.metrics.increment, { metric: "unsubscribes" });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Step 2: Commit**

Run:
```bash
git add app/api/webhooks/resend/
git commit -m "feat: add Resend webhook handler"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, webhook route compiles

---

### Task 6.3: Calendly Webhook Handler

**Files:**
- Create: `app/api/webhooks/calendly/route.ts`

**Step 1: Create Calendly webhook route**

Create `app/api/webhooks/calendly/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendNotification } from "@/lib/resend";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  const payload = await request.json();

  // Calendly sends events with this structure
  const { event, payload: eventData } = payload;

  try {
    if (event === "invitee.created") {
      // Demo was scheduled
      const email = eventData.invitee?.email;
      const scheduledTime = eventData.event?.start_time;
      const eventUrl = eventData.event?.uri;
      const inviteeName = eventData.invitee?.name;

      if (!email) {
        return NextResponse.json({ received: true, skipped: true });
      }

      // Find lead by email
      const lead = await convex.query(api.leads.getByEmail, {
        email: email.toLowerCase(),
      });

      if (lead) {
        // Update lead status
        await convex.mutation(api.leads.setDemoScheduled, {
          leadId: lead._id,
          scheduledAt: new Date(scheduledTime).getTime(),
          calendlyUrl: eventUrl,
        });

        // Update metrics
        await convex.mutation(api.metrics.increment, { metric: "demosBooked" });

        // Notify
        await sendNotification(
          "Demo Booked!",
          `New demo scheduled!\n\nCompany: ${lead.companyName}\nContact: ${lead.contactName}\nEmail: ${email}\nTime: ${new Date(scheduledTime).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`
        );
      } else {
        // Lead not in system - still notify
        await sendNotification(
          "Demo Booked (New Lead)",
          `Demo scheduled with unknown lead:\n\nName: ${inviteeName || "Unknown"}\nEmail: ${email}\nTime: ${new Date(scheduledTime).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`
        );
      }
    }

    if (event === "invitee.canceled") {
      const email = eventData.invitee?.email;

      if (email) {
        const lead = await convex.query(api.leads.getByEmail, {
          email: email.toLowerCase(),
        });

        if (lead) {
          await convex.mutation(api.leads.updateStatus, {
            leadId: lead._id,
            status: "contacted",
            note: "Demo canceled",
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Calendly webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Step 2: Commit**

Run:
```bash
git add app/api/webhooks/calendly/
git commit -m "feat: add Calendly webhook handler"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, Calendly webhook compiles

---

### Task 6.4: CSV Import Endpoint

**Files:**
- Create: `app/api/leads/import/route.ts`

**Step 1: Create CSV import route**

Create `app/api/leads/import/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface CSVLead {
  companyName: string;
  contactName: string;
  contactEmail: string;
  website?: string;
  contactTitle?: string;
  state?: string;
  estimatedSubbies?: number;
}

function parseCSV(csvText: string): CSVLead[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  // Map common header variations
  const headerMap: Record<string, string> = {
    company: "companyName",
    "company name": "companyName",
    company_name: "companyName",
    name: "contactName",
    "contact name": "contactName",
    contact_name: "contactName",
    email: "contactEmail",
    "contact email": "contactEmail",
    contact_email: "contactEmail",
    website: "website",
    url: "website",
    title: "contactTitle",
    "job title": "contactTitle",
    contact_title: "contactTitle",
    state: "state",
    location: "state",
    subbies: "estimatedSubbies",
    subcontractors: "estimatedSubbies",
    estimated_subbies: "estimatedSubbies",
  };

  const leads: CSVLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

    const lead: any = {};

    headers.forEach((header, index) => {
      const mappedKey = headerMap[header] || header;
      if (values[index]) {
        if (mappedKey === "estimatedSubbies") {
          lead[mappedKey] = parseInt(values[index]) || undefined;
        } else {
          lead[mappedKey] = values[index];
        }
      }
    });

    // Validate required fields
    if (lead.companyName && lead.contactName && lead.contactEmail) {
      leads.push(lead as CSVLead);
    }
  }

  return leads;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvText = await file.text();
    const leads = parseCSV(csvText);

    if (leads.length === 0) {
      return NextResponse.json(
        { error: "No valid leads found in CSV" },
        { status: 400 }
      );
    }

    // Bulk create leads
    const result = await convex.mutation(api.leads.bulkCreate, {
      leads: leads.map((lead) => ({
        companyName: lead.companyName,
        contactName: lead.contactName,
        contactEmail: lead.contactEmail,
        website: lead.website,
        contactTitle: lead.contactTitle,
        state: lead.state,
        source: "csv_import",
        estimatedSubbies: lead.estimatedSubbies,
      })),
    });

    // Update metrics
    await convex.mutation(api.metrics.increment, {
      metric: "leadsImported",
      amount: result.created,
    });

    return NextResponse.json({
      success: true,
      ...result,
      total: leads.length,
    });
  } catch (error: any) {
    console.error("CSV import error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Step 2: Commit**

Run:
```bash
git add app/api/leads/import/
git commit -m "feat: add CSV import endpoint"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, all API routes compile, Phase 6 complete

---

## Phase 7: Unsubscribe Page

### Task 7.1: Unsubscribe Page

**Files:**
- Create: `app/unsubscribe/[token]/page.tsx`

**Step 1: Create unsubscribe page**

Create `app/unsubscribe/[token]/page.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function UnsubscribePage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done" | "already">("loading");
  const [reason, setReason] = useState("");

  useEffect(() => {
    async function verifyToken() {
      const result = await convex.query(api.unsubscribe.verifyToken, { token });

      if (!result.valid) {
        setStatus("invalid");
      } else if (result.alreadyUsed) {
        setStatus("already");
      } else {
        setStatus("valid");
      }
    }

    verifyToken();
  }, [token]);

  async function handleUnsubscribe() {
    const result = await convex.mutation(api.unsubscribe.processUnsubscribe, {
      token,
      reason: reason || undefined,
    });

    if (result.success) {
      setStatus("done");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9fafb",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      <div style={{
        maxWidth: 480,
        padding: 40,
        backgroundColor: "white",
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}>
        {status === "loading" && (
          <p>Loading...</p>
        )}

        {status === "invalid" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Invalid Link</h1>
            <p style={{ color: "#666" }}>
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}

        {status === "already" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Already Unsubscribed</h1>
            <p style={{ color: "#666" }}>
              You've already been unsubscribed from our emails.
            </p>
          </>
        )}

        {status === "valid" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Unsubscribe</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Are you sure you want to unsubscribe from RiskSure.AI emails?
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: "#666" }}>
                Reason (optional):
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: 14,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                }}
              >
                <option value="">Select a reason...</option>
                <option value="too_many_emails">Too many emails</option>
                <option value="not_relevant">Not relevant to me</option>
                <option value="using_competitor">Using a competitor</option>
                <option value="no_longer_in_role">No longer in this role</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              onClick={handleUnsubscribe}
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: 16,
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Unsubscribe
            </button>

            <p style={{ marginTop: 16, fontSize: 12, color: "#999" }}>
              You can also reply to any email with "unsubscribe" and we'll remove you.
            </p>
          </>
        )}

        {status === "done" && (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 16 }}>Unsubscribed</h1>
            <p style={{ color: "#666" }}>
              You've been successfully unsubscribed. You won't receive any more emails from us.
            </p>
            <p style={{ marginTop: 24, fontSize: 14, color: "#999" }}>
              Changed your mind?{" "}
              <a href="mailto:jason@risksure.ai" style={{ color: "#2563eb" }}>
                Contact us
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

Run:
```bash
git add app/unsubscribe/
git commit -m "feat: add unsubscribe page"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, unsubscribe page compiles, Phase 7 complete

---

## Phase 8: Deployment Configuration

### Task 8.1: Vercel Configuration

**Files:**
- Create: `vercel.json`

**Step 1: Create vercel.json**

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-pipeline",
      "schedule": "0 21 * * *"
    }
  ],
  "functions": {
    "app/api/cron/daily-pipeline/route.ts": {
      "maxDuration": 300
    }
  }
}
```

Note: `0 21 * * *` = 9:00 PM UTC = 7:00 AM AEST (next day). Adjust based on your needs.

**Step 2: Commit**

Run:
```bash
git add vercel.json
git commit -m "feat: add Vercel cron configuration"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, vercel.json is valid JSON

---

### Task 8.2: Convex Provider Setup

**Files:**
- Create: `app/providers.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create providers.tsx**

Create `app/providers.tsx`:
```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

**Step 2: Update layout.tsx**

Modify `app/layout.tsx` to wrap with Providers:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RiskSure Sales",
  description: "Sales automation for RiskSure.AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Step 3: Commit**

Run:
```bash
git add app/providers.tsx app/layout.tsx
git commit -m "feat: add Convex provider setup"
```

**✅ Verify:**
```bash
npm run build
```
Expected: Build succeeds, Convex provider configured

---

### Task 8.3: Environment Variables Setup

**Files:**
- Update: `.env.local.example`

**Step 1: Ensure .env.local.example is complete**

Verify `.env.local.example` contains:
```bash
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Resend
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=

# Google Gemini
GOOGLE_API_KEY=

# Jina AI (optional - has free tier without key)
JINA_API_KEY=

# ZeroBounce
ZEROBOUNCE_API_KEY=

# Calendly
CALENDLY_WEBHOOK_SECRET=
CALENDLY_BOOKING_URL=https://calendly.com/risksure/demo

# Cron Security
CRON_SECRET=

# Notifications
NOTIFICATION_EMAIL=

# App
NEXT_PUBLIC_APP_URL=https://sales.risksure.ai
UNSUBSCRIBE_BASE_URL=https://sales.risksure.ai/unsubscribe
```

**Step 2: Commit**

Run:
```bash
git add .env.local.example
git commit -m "docs: update environment variables example"
```

**✅ Verify:**
```bash
npm run build && npx convex dev --once --typecheck
```
Expected: Full build succeeds, all Convex functions deploy, Phase 8 complete

---

## Phase 9: Testing & Validation

### Task 9.1: Manual Test Checklist

**Verification Steps (manual)**

After deployment, verify:

1. **Convex Functions**
   - Run: `npx convex dev` and check dashboard
   - Verify all functions deployed without errors

2. **Lead Import**
   - Create test CSV with sample leads
   - POST to `/api/leads/import`
   - Verify leads appear in Convex dashboard

3. **Daily Pipeline (dry run)**
   - Trigger manually: `curl -H "Authorization: Bearer $CRON_SECRET" https://your-url/api/cron/daily-pipeline`
   - Check validation, enrichment, email sending

4. **Webhooks**
   - Set up Resend webhook pointing to `/api/webhooks/resend`
   - Set up Calendly webhook pointing to `/api/webhooks/calendly`
   - Send test events and verify handling

5. **Unsubscribe**
   - Visit `/unsubscribe/invalid-token` - should show invalid
   - Get valid token from DB, visit page, unsubscribe
   - Verify lead status updates

**✅ Final Verification:**
```bash
npm run build && npx convex dev --once --typecheck
```

When ALL of the following are true:
- Build passes with no errors
- All Convex functions deploy successfully
- All 24 tasks in Progress Tracker are marked `[x]`
- Git history shows all commits

Output the completion promise:
```
<promise>RISKSURE SALES AUTOMATION COMPLETE</promise>
```

---

## Summary

### Files Created

```
risksure-sales/
├── convex/
│   ├── schema.ts
│   ├── leads.ts
│   ├── emailEvents.ts
│   ├── metrics.ts
│   ├── warming.ts
│   ├── unsubscribe.ts
│   └── abTests.ts
├── app/
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── resend/route.ts
│   │   │   └── calendly/route.ts
│   │   ├── cron/
│   │   │   └── daily-pipeline/route.ts
│   │   └── leads/
│   │       └── import/route.ts
│   ├── unsubscribe/[token]/page.tsx
│   ├── providers.tsx
│   └── layout.tsx
├── lib/
│   ├── gemini.ts
│   ├── jina.ts
│   ├── resend.ts
│   ├── validation.ts
│   └── enrichment.ts
├── templates/
│   ├── components/
│   │   ├── UnsubscribeFooter.tsx
│   │   └── EmailWrapper.tsx
│   ├── velocity/index.ts
│   ├── compliance/index.ts
│   ├── business/index.ts
│   └── index.ts
├── docs/
│   ├── product-brief.md
│   └── plans/
├── vercel.json
└── .env.local.example
```

### Cost Estimates (Monthly)

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Convex | 1M function calls | $0 (starter) |
| Resend | 100 emails/day | $0-20 |
| Gemini | 1500 req/day | $0 (free tier) |
| Jina AI | 1M tokens/month | $0 (free tier) |
| ZeroBounce | Pay-per-use | $10-30 |
| Vercel | Hobby free | $0-20 |
| **Total** | | **$10-70/month** |

### Next Steps After Build

1. **Set up API keys** in Vercel environment variables
2. **Configure webhooks** in Resend and Calendly dashboards
3. **Import initial leads** from Apollo or CSV
4. **Monitor warming progress** (20 → 200 emails/day over 3 weeks)
5. **Watch A/B test results** after 100+ sends per variant
6. **Iterate on messaging** based on open/click rates

---

**End of Plan**
