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
