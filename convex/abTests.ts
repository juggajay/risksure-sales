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
