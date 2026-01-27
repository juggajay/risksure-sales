import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default templates - used for initialization
// Updated January 2026: Added regulatory urgency, "free for subbies" earlier,
// honest early-adopter positioning, WorkSafe audit trail angle
// Added FOUNDER50 promo code (50% off first 6 months) to Step 3 and Step 4
const defaultTemplates = {
  subjects: {
    step0: {
      A: "Quick question about {{companyName}}'s COC process",
      B: "{{contactName}} - subbie insurance compliance",
    },
    step1: {
      A: "Re: Quick question about {{companyName}}'s COC process",
      B: "The workflow shift (+ Procore sync)",
    },
    step2: {
      A: "{{contactName}} - the compliance maths",
      B: "Beyond time savings - the liability angle",
    },
    step3: {
      A: "Early adopter opportunity",
      B: "What {{state}} builders are switching to",
    },
    step4: {
      A: "Closing the loop",
      B: "Last note from me",
    },
  },
  bodies: {
    step0: `{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each. That's a lot of admin hours - and a lot of liability if something slips through.

We built something that changes that:
- Each subbie gets their own portal (free for them, no account required - just a link)
- They upload their docs in 60 seconds
- Our AI verifies everything against your requirements in 30 seconds
- Your team just reviews what we flag

You get a timestamped audit trail of every verification - useful if WorkSafe ever asks.

Happy to show you how it works if you're interested: {{calendlyUrl}}

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.`,

    step1: `{{contactName}},

Following up on my last note.

The short version: subbies upload their own docs through a free portal (no login, just a secure link), we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Already using Procore? We sync directly - your subbie compliance status shows up right in your project.

Here's a 2-minute video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,

    step2_velocity: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_compliance: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. That's a lot of hours spent on admin work that doesn't need a human.

**The liability angle:** Industrial Manslaughter laws are now active in {{state}} - up to $20M in fines and personal imprisonment for officers. The Pafburn High Court ruling confirmed head contractors can't delegate this liability to subbies.

We've built something that handles both:
- Automates collection and verification (AI checks in 30 seconds)
- Creates timestamped audit trail for every verification
- Flags exceptions for your team to review

Your compliance team spends time on actual risk management, not document admin.

Worth a look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_business: `{{contactName}},

At {{companyName}}'s scale, you've got thousands of certificates across your portfolio. That's either a full-time job for someone, or gaps are forming.

With Industrial Manslaughter laws now active nationally and the Pafburn ruling confirming non-delegable duty, those gaps represent serious liability - not just admin inconvenience.

We work with builders managing 300+ subbies where:
- The compliance team has complete visibility across every project
- Every verification is timestamped (audit-ready)
- Subbies actually upload on time (because our portal is free and takes 60 seconds)
- The team focuses on risk management, not document chasing

If you'd like to see how this works at enterprise scale: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step3: `{{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Here's how it works: your team adds a subbie, they get a portal link, they upload in 60 seconds (free for them, no login required), and our AI verifies against your requirements in 30 seconds. You just review the exceptions.

If you'd be open to being one of our early adopters, use code FOUNDER50 for 50% off your first 6 months. You'd also get direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

    step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

The FOUNDER50 code (50% off first 6 months) stays valid if you want to revisit later.

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
