import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { validateEmail } from "@/lib/validation";
import { enrichLead } from "@/lib/enrichment";
import { sendEmail, sendNotification } from "@/lib/resend";
import { getTemplate, getTextTemplate, getSubject, getMaxSteps } from "@/templates";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    validated: 0,
    enriched: 0,
    emailsSent: 0,
    errors: [] as string[],
  };

  try {
    // ============================================
    // STEP 1: INCREMENT WARMING LIMIT
    // ============================================
    await convex.mutation(api.warming.incrementDailyLimit);
    const warmingStatus = await convex.query(api.warming.getStatus);

    if (!warmingStatus) {
      await convex.mutation(api.warming.initialize);
    }

    // Ensure today's metrics exist
    await convex.mutation(api.metrics.getOrCreateToday);

    // ============================================
    // STEP 2: VALIDATE NEW LEADS
    // ============================================
    const pendingValidation = await convex.query(api.leads.getPendingValidation);

    for (const lead of pendingValidation.slice(0, 50)) {
      try {
        const validation = await validateEmail(lead.contactEmail);

        await convex.mutation(api.leads.updateValidation, {
          leadId: lead._id,
          emailValidated: true,
          emailValidationResult: validation.result,
        });

        await convex.mutation(api.metrics.increment, {
          metric: validation.result === "valid" ? "leadsValidated" : "leadsInvalid",
        });

        results.validated++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push(`Validation error for ${lead.contactEmail}: ${errorMessage}`);
      }
    }

    // ============================================
    // STEP 3: ENRICH VALIDATED LEADS
    // ============================================
    const pendingEnrichment = await convex.query(api.leads.getPendingEnrichment);

    for (const lead of pendingEnrichment.slice(0, 20)) {
      try {
        const enrichment = await enrichLead({
          companyName: lead.companyName,
          website: lead.website,
          contactName: lead.contactName,
          contactTitle: lead.contactTitle,
          state: lead.state,
        });

        if (enrichment.success) {
          // Assign A/B variant
          await convex.mutation(api.abTests.assignVariant, {
            leadId: lead._id,
          });

          await convex.mutation(api.leads.updateEnrichment, {
            leadId: lead._id,
            enrichmentData: enrichment.enrichmentData,
            enrichmentScore: enrichment.enrichmentScore!,
            tier: enrichment.tier!,
            estimatedSubbies: enrichment.estimatedSubbies!,
            estimatedRevenue: enrichment.estimatedRevenue,
            personalizedOpener: enrichment.personalizedOpener!,
            painPoints: enrichment.painPoints,
          });

          await convex.mutation(api.metrics.increment, { metric: "leadsEnriched" });
          results.enriched++;
        } else {
          await convex.mutation(api.leads.setEnrichmentError, {
            leadId: lead._id,
            error: enrichment.error || "Unknown error",
          });
          await convex.mutation(api.metrics.increment, { metric: "enrichmentErrors" });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push(`Enrichment error for ${lead.companyName}: ${errorMessage}`);
      }
    }

    // ============================================
    // STEP 4: SEND EMAILS
    // ============================================
    const currentWarmingStatus = await convex.query(api.warming.getStatus);

    if (!currentWarmingStatus || currentWarmingStatus.emailsRemaining <= 0) {
      return NextResponse.json({
        ...results,
        message: "Daily email limit reached",
        warmingStatus: currentWarmingStatus,
      });
    }

    const readyForEmail = await convex.query(api.leads.getReadyForEmail, {
      limit: currentWarmingStatus.emailsRemaining,
    });

    for (const lead of readyForEmail) {
      try {
        // Skip if already at max steps
        const maxSteps = getMaxSteps(lead.tier);
        if (lead.currentSequenceStep >= maxSteps) {
          continue;
        }

        // Check warming limit
        const canSend = await convex.query(api.warming.canSendEmail);
        if (!canSend) break;

        const step = lead.currentSequenceStep;
        const variant = lead.sequenceVariant || "A";

        // Generate unsubscribe token
        const unsubscribeToken = await convex.mutation(
          api.unsubscribe.generateTokenForLead,
          { leadId: lead._id }
        );
        const unsubscribeUrl = `${process.env.UNSUBSCRIBE_BASE_URL}/${unsubscribeToken}`;

        const templateParams = {
          contactName: lead.contactName,
          companyName: lead.companyName,
          personalizedOpener: lead.personalizedOpener || "",
          unsubscribeUrl,
          calendlyUrl: process.env.CALENDLY_BOOKING_URL || "https://calendly.com/risksure/demo",
        };

        // Try plain text first (better deliverability for Step 0)
        const text = getTextTemplate(lead.tier, step, variant, templateParams);
        const html = text ? undefined : getTemplate(lead.tier, step, variant, templateParams);

        const subject = getSubject(lead.tier, step, variant, lead.companyName);

        // Send email - use text if available, otherwise HTML
        const result = await sendEmail({
          to: lead.contactEmail,
          subject,
          html,
          text: text || undefined,
          leadId: lead._id,
          sequenceStep: step,
          variant,
          tier: lead.tier,
        });

        if (result.success && result.messageId) {
          // Update lead
          await convex.mutation(api.leads.markEmailSent, {
            leadId: lead._id,
            resendMessageId: result.messageId,
            subject,
            sequenceStep: step,
            variant,
          });

          // Record warming
          await convex.mutation(api.warming.recordEmailSent);

          // Record metrics
          await convex.mutation(api.metrics.increment, { metric: "emailsSent" });
          await convex.mutation(api.metrics.increment, {
            metric: variant === "A" ? "variantASent" : "variantBSent",
          });
          await convex.mutation(api.metrics.increment, {
            metric: `${lead.tier}Sent`,
          });

          // Record A/B test
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${lead.tier}_step${step}`,
            tier: lead.tier,
            sequenceStep: step,
            variant,
            eventType: "sent",
            subjectA: getSubject(lead.tier, step, "A", lead.companyName),
            subjectB: getSubject(lead.tier, step, "B", lead.companyName),
          });

          results.emailsSent++;
        } else {
          results.errors.push(`Email error for ${lead.contactEmail}: ${result.error}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push(`Email error for ${lead.contactEmail}: ${errorMessage}`);
      }
    }

    // Send summary notification
    if (results.emailsSent > 0 || results.enriched > 0) {
      await sendNotification(
        "Daily Pipeline Complete",
        `Validated: ${results.validated}\nEnriched: ${results.enriched}\nEmails Sent: ${results.emailsSent}\nErrors: ${results.errors.length}`
      );
    }

    return NextResponse.json({
      success: true,
      ...results,
      warmingStatus: {
        dailyLimit: currentWarmingStatus?.currentDailyLimit,
        remaining: currentWarmingStatus?.emailsRemaining,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Daily pipeline failed:", error);
    return NextResponse.json(
      {
        error: errorMessage,
        ...results,
      },
      { status: 500 }
    );
  }
}
