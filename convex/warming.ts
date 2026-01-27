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
      bouncesToday: 0,
      complaintsToday: 0,
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

    // Bounce rate calculation
    const sent = config.emailsSentToday || 1; // avoid divide by zero
    const bounceRate = ((config.bouncesToday ?? 0) / sent) * 100;
    const complaintRate = ((config.complaintsToday ?? 0) / sent) * 100;

    return {
      ...config,
      emailsRemaining: Math.max(0, emailsRemaining),
      warmingComplete,
      daysSinceStart,
      isNewDay: config.lastIncrementDate !== today,
      bounceRate,
      complaintRate,
      isPaused: !!config.pausedAt,
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

    // Check bounce rate from previous day before incrementing
    const prevSent = config.emailsSentToday || 1;
    const prevBounceRate = ((config.bouncesToday ?? 0) / prevSent) * 100;

    let newLimit: number;
    if (prevBounceRate > 5) {
      // >5% bounce rate: decrease limit by half the increment
      newLimit = Math.max(
        20,
        config.currentDailyLimit - Math.floor(config.incrementAmount / 2)
      );
    } else if (prevBounceRate > 3) {
      // >3% bounce rate: hold steady, don't increase
      newLimit = config.currentDailyLimit;
    } else {
      // Healthy: increment as normal
      newLimit = Math.min(
        config.currentDailyLimit + config.incrementAmount,
        config.maxDailyLimit
      );
    }

    await ctx.db.patch(config._id, {
      currentDailyLimit: newLimit,
      lastIncrementDate: today,
      emailsSentToday: 0, // Reset daily counter
      bouncesToday: 0,    // Reset daily bounce counter
      complaintsToday: 0, // Reset daily complaint counter
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

export const recordBounce = mutation({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    const newBounces = (config.bouncesToday ?? 0) + 1;
    const sent = config.emailsSentToday || 1;
    const bounceRate = (newBounces / sent) * 100;

    const updates: Record<string, unknown> = {
      bouncesToday: newBounces,
    };

    // Auto-pause if bounce rate exceeds 8%
    if (bounceRate > 8 && !config.pausedAt) {
      updates.isActive = false;
      updates.pausedAt = Date.now();
      updates.pauseReason = `Auto-paused: bounce rate ${bounceRate.toFixed(1)}% (${newBounces}/${sent})`;
    }

    await ctx.db.patch(config._id, updates);
  },
});

export const recordComplaint = mutation({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    const newComplaints = (config.complaintsToday ?? 0) + 1;
    const sent = config.emailsSentToday || 1;
    const complaintRate = (newComplaints / sent) * 100;

    const updates: Record<string, unknown> = {
      complaintsToday: newComplaints,
    };

    // Auto-pause if complaint rate exceeds 0.5% (industry standard threshold)
    if (complaintRate > 0.5 && !config.pausedAt) {
      updates.isActive = false;
      updates.pausedAt = Date.now();
      updates.pauseReason = `Auto-paused: complaint rate ${complaintRate.toFixed(1)}% (${newComplaints}/${sent})`;
    }

    await ctx.db.patch(config._id, updates);
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

export const unpause = mutation({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("warmingConfig").first();
    if (!config) return;

    await ctx.db.patch(config._id, {
      isActive: true,
      pausedAt: undefined,
      pauseReason: undefined,
    });
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
