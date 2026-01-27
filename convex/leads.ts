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
    // Query all statuses that are eligible for email sends:
    // - "ready": initial outreach (step 0)
    // - "contacted": sent at least one email, due for follow-up
    // - "opened": opened an email, due for follow-up
    // - "clicked": clicked a link, due for follow-up
    const eligibleStatuses = ["ready", "contacted", "opened", "clicked"] as const;
    const results = [];

    for (const status of eligibleStatuses) {
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_status", (q) => q.eq("status", status))
        .filter((q) =>
          q.or(
            q.eq(q.field("nextEmailAt"), undefined),
            q.lte(q.field("nextEmailAt"), now)
          )
        )
        .take(args.limit);
      results.push(...leads);
    }

    // Return up to the requested limit, sorted by nextEmailAt (oldest first)
    return results
      .sort((a, b) => (a.nextEmailAt ?? 0) - (b.nextEmailAt ?? 0))
      .slice(0, args.limit);
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

    // Advance currentSequenceStep to the NEXT step after the one just sent
    const nextStep = args.sequenceStep + 1;

    // Delay days for each step (matches sequenceConfig in templates/index.ts)
    const stepDelays: Record<number, number> = {
      0: 0, 1: 4, 2: 9, 3: 15, 4: 22,
      5: 45, 6: 60, 7: 90, // nurture steps
    };
    const delayDays = stepDelays[nextStep] !== undefined
      ? stepDelays[nextStep] - (stepDelays[args.sequenceStep] ?? 0)
      : 21;
    const nextEmailAt = Date.now() + (delayDays * 24 * 60 * 60 * 1000);

    // Keep "nurture" status for leads in nurture sequence (steps 5+),
    // otherwise set to "contacted"
    const newStatus = lead.status === "nurture" ? "nurture" : "contacted";

    await ctx.db.patch(args.leadId, {
      status: newStatus,
      currentSequenceStep: nextStep,
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

// ============================================
// NURTURE QUERIES
// ============================================

export const getNurtureLeads = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db
      .query("leads")
      .withIndex("by_status", (q) => q.eq("status", "nurture"))
      .filter((q) =>
        q.or(
          q.eq(q.field("nextEmailAt"), undefined),
          q.lte(q.field("nextEmailAt"), now)
        )
      )
      .take(args.limit);
  },
});
