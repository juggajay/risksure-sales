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
