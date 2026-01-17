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
