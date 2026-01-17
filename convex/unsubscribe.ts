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
