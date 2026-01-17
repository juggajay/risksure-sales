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
