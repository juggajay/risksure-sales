import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default templates - used for initialization
const defaultTemplates = {
  subjects: {
    step0: {
      A: "Quick question about {{companyName}}'s COC process",
      B: "{{contactName}} - how do you handle subbie certificates?",
    },
    step1: {
      A: "Re: Quick question about {{companyName}}'s COC process",
      B: "The workflow shift",
    },
    step2: {
      A: "What {{companyName}}'s compliance team could stop doing",
      B: "30 seconds vs 30 minutes",
    },
    step3: {
      A: "How [similar company] handles COC compliance now",
      B: "The maths on certificate admin",
    },
    step4: {
      A: "Closing the loop",
      B: "Last note from me",
    },
  },
  bodies: {
    step0: `{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each.

We built something that changes that - each subbie gets their own portal to upload their docs, we verify everything against your requirements, and your team just reviews what we flag.

We'd love to show you how it works if you're interested.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.`,

    step1: `{{contactName}},

Following up on my last note.

The short version: we've built a system where subbies upload their own docs through their own portal, we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Here's a 2-minute video showing the workflow: {{demoVideoUrl}}

Or if you'd prefer a live walkthrough, grab a time here: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just let me know and I'll stop following up.`,

    step2_velocity: `{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

We've got builders doing that same volume where their team spends maybe 2 hours a month reviewing exceptions. The rest is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_compliance: `{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. At 20-30 minutes each - that's a lot of hours spent on admin work that doesn't need a human.

We've got builders at your scale where the compliance team spends a few hours a week reviewing exceptions. Everything else - the collection, verification, tracking, follow-ups - is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_business: `{{contactName}},

Quick thought:

At {{companyName}}'s scale, you've probably got thousands of certificates across your portfolio. That's either a full-time job for someone, or it's falling through the cracks.

We work with builders managing 300+ subbies where the compliance team has complete visibility across every project - and spends most of their time on actual risk management, not document admin.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step3: `{{contactName}},

One more thought and I'll leave you alone.

A {{state}} builder similar to {{companyName}} switched to us six months ago. Their compliance admin went from 15+ hours a week to about 2 hours reviewing exceptions.

Their subbies actually upload on time now (because it's free and takes 60 seconds through their own portal). No more chasing.

If you want to see what that looks like, we'd love to walk you through it: {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

    step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie certificates - haven't heard back, so I'll assume the timing isn't right.

If things change and you want to see how other builders have streamlined this, the door's open: {{calendlyUrl}}

All the best with the projects.

{{senderName}}
{{senderPhone}}`,
  },
  timing: {
    step0: 0,
    step1: 4,
    step2: 9,
    step3: 15,
    step4: 22,
  },
};

// ============================================
// QUERIES
// ============================================

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const templates = await ctx.db.query("emailTemplates").collect();

    // If no templates in DB, return defaults
    if (templates.length === 0) {
      return {
        initialized: false,
        templates: defaultTemplates,
      };
    }

    // Convert DB records to structured format
    const result: Record<string, any> = {
      subjects: {},
      bodies: {},
      timing: {},
    };

    for (const t of templates) {
      result.subjects[`step${t.step}`] = { A: t.subjectA, B: t.subjectB };
      result.timing[`step${t.step}`] = t.delayDays;

      if (t.step === 2) {
        result.bodies[`step2_velocity`] = t.bodyVelocity || defaultTemplates.bodies.step2_velocity;
        result.bodies[`step2_compliance`] = t.bodyCompliance || defaultTemplates.bodies.step2_compliance;
        result.bodies[`step2_business`] = t.bodyBusiness || defaultTemplates.bodies.step2_business;
      } else {
        result.bodies[`step${t.step}`] = t.body;
      }
    }

    return {
      initialized: true,
      templates: result,
    };
  },
});

export const getByStep = query({
  args: { step: v.number() },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("emailTemplates")
      .withIndex("by_step", (q) => q.eq("step", args.step))
      .first();

    if (!template) {
      // Return defaults for this step
      const stepKey = `step${args.step}` as keyof typeof defaultTemplates.subjects;
      return {
        step: args.step,
        subjectA: defaultTemplates.subjects[stepKey]?.A || "",
        subjectB: defaultTemplates.subjects[stepKey]?.B || "",
        body: (defaultTemplates.bodies as Record<string, string>)[stepKey] || "",
        bodyVelocity: args.step === 2 ? defaultTemplates.bodies.step2_velocity : undefined,
        bodyCompliance: args.step === 2 ? defaultTemplates.bodies.step2_compliance : undefined,
        bodyBusiness: args.step === 2 ? defaultTemplates.bodies.step2_business : undefined,
        delayDays: (defaultTemplates.timing as Record<string, number>)[stepKey] || 7,
        isActive: true,
      };
    }

    return template;
  },
});

// ============================================
// MUTATIONS
// ============================================

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already initialized
    const existing = await ctx.db.query("emailTemplates").first();
    if (existing) {
      return { success: false, message: "Templates already initialized" };
    }

    // Create all 5 steps
    for (let step = 0; step <= 4; step++) {
      const stepKey = `step${step}` as keyof typeof defaultTemplates.subjects;

      await ctx.db.insert("emailTemplates", {
        step,
        subjectA: defaultTemplates.subjects[stepKey].A,
        subjectB: defaultTemplates.subjects[stepKey].B,
        body: step !== 2 ? (defaultTemplates.bodies as Record<string, string>)[stepKey] : "",
        bodyVelocity: step === 2 ? defaultTemplates.bodies.step2_velocity : undefined,
        bodyCompliance: step === 2 ? defaultTemplates.bodies.step2_compliance : undefined,
        bodyBusiness: step === 2 ? defaultTemplates.bodies.step2_business : undefined,
        delayDays: (defaultTemplates.timing as Record<string, number>)[stepKey],
        isActive: true,
        updatedAt: Date.now(),
      });
    }

    return { success: true, message: "Templates initialized" };
  },
});

export const update = mutation({
  args: {
    step: v.number(),
    subjectA: v.optional(v.string()),
    subjectB: v.optional(v.string()),
    body: v.optional(v.string()),
    bodyVelocity: v.optional(v.string()),
    bodyCompliance: v.optional(v.string()),
    bodyBusiness: v.optional(v.string()),
    delayDays: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("emailTemplates")
      .withIndex("by_step", (q) => q.eq("step", args.step))
      .first();

    const updates: Record<string, any> = { updatedAt: Date.now() };

    if (args.subjectA !== undefined) updates.subjectA = args.subjectA;
    if (args.subjectB !== undefined) updates.subjectB = args.subjectB;
    if (args.body !== undefined) updates.body = args.body;
    if (args.bodyVelocity !== undefined) updates.bodyVelocity = args.bodyVelocity;
    if (args.bodyCompliance !== undefined) updates.bodyCompliance = args.bodyCompliance;
    if (args.bodyBusiness !== undefined) updates.bodyBusiness = args.bodyBusiness;
    if (args.delayDays !== undefined) updates.delayDays = args.delayDays;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return { success: true, id: existing._id };
    } else {
      // Create new record
      const stepKey = `step${args.step}` as keyof typeof defaultTemplates.subjects;
      const id = await ctx.db.insert("emailTemplates", {
        step: args.step,
        subjectA: args.subjectA || defaultTemplates.subjects[stepKey]?.A || "",
        subjectB: args.subjectB || defaultTemplates.subjects[stepKey]?.B || "",
        body: args.body || (defaultTemplates.bodies as Record<string, string>)[stepKey] || "",
        bodyVelocity: args.bodyVelocity,
        bodyCompliance: args.bodyCompliance,
        bodyBusiness: args.bodyBusiness,
        delayDays: args.delayDays || (defaultTemplates.timing as Record<string, number>)[stepKey] || 7,
        isActive: args.isActive ?? true,
        updatedAt: Date.now(),
      });
      return { success: true, id };
    }
  },
});

export const reset = mutation({
  args: { step: v.optional(v.number()) },
  handler: async (ctx, args) => {
    if (args.step !== undefined) {
      // Reset single step
      const existing = await ctx.db
        .query("emailTemplates")
        .withIndex("by_step", (q) => q.eq("step", args.step!))
        .first();

      if (existing) {
        await ctx.db.delete(existing._id);
      }
    } else {
      // Reset all
      const all = await ctx.db.query("emailTemplates").collect();
      for (const t of all) {
        await ctx.db.delete(t._id);
      }
    }

    return { success: true };
  },
});
