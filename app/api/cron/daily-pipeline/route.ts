import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { validateEmail } from "@/lib/validation";
import { enrichLead } from "@/lib/enrichment";
import { sendEmail, sendNotification } from "@/lib/resend";
import { getTemplate, getPlainTextTemplate, getSubject, getMaxSteps, getNurtureMaxSteps } from "@/templates";

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
    nurtureEmailsSent: 0,
    nurtureCompleted: 0,
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

    // Terminal statuses — never send to these leads
    const terminalStatuses = new Set([
      "replied", "unsubscribed", "bounced", "demo_scheduled",
      "demo_complete", "trial", "closed_won", "closed_lost",
      "nurture", "invalid_email",
    ]);

    for (const lead of readyForEmail) {
      try {
        // Skip leads with terminal statuses
        if (terminalStatuses.has(lead.status)) {
          continue;
        }

        // Skip leads with no contact name — can't personalize
        if (!lead.contactName || !lead.contactName.trim()) {
          results.errors.push(`Skipped ${lead.contactEmail}: no contact name`);
          continue;
        }

        // If at max steps for initial sequence, transition to nurture
        const maxSteps = getMaxSteps(lead.tier);
        if (lead.currentSequenceStep >= maxSteps) {
          await convex.mutation(api.leads.updateStatus, {
            leadId: lead._id,
            status: "nurture",
            note: "Completed email sequence — moving to nurture",
          });
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
          estimatedSubbies: lead.estimatedSubbies,
          state: lead.state,
        };

        // Use plain text for Step 0 (Gmail Primary), HTML for follow-ups
        const plainText = getPlainTextTemplate(lead.tier, step, variant, templateParams);
        const html = plainText ? undefined : getTemplate(lead.tier, step, variant, templateParams);

        const subject = getSubject(lead.tier, step, variant, lead.companyName);

        // Send email - plain text lands in Gmail Primary
        const result = await sendEmail({
          to: lead.contactEmail,
          subject,
          html,
          text: plainText || undefined,
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

    // ============================================
    // STEP 5: SEND NURTURE EMAILS (Steps 5-7)
    // ============================================
    const nurtureMaxSteps = getNurtureMaxSteps(); // 8 (steps 0-7)
    const remainingAfterInitial = await convex.query(api.warming.canSendEmail);

    if (remainingAfterInitial) {
      const nurtureLeads = await convex.query(api.leads.getNurtureLeads, {
        limit: 50,
      });

      for (const lead of nurtureLeads) {
        try {
          // If past all nurture steps, transition to closed_lost
          if (lead.currentSequenceStep >= nurtureMaxSteps) {
            await convex.mutation(api.leads.updateStatus, {
              leadId: lead._id,
              status: "closed_lost",
              note: "Completed nurture sequence — no engagement",
            });
            results.nurtureCompleted++;
            continue;
          }

          // Check warming limit
          const canStillSend = await convex.query(api.warming.canSendEmail);
          if (!canStillSend) break;

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
            estimatedSubbies: lead.estimatedSubbies,
            state: lead.state,
          };

          const plainText = getPlainTextTemplate(lead.tier, step, variant, templateParams);
          const subject = getSubject(lead.tier, step, variant, lead.companyName);

          const result = await sendEmail({
            to: lead.contactEmail,
            subject,
            text: plainText || undefined,
            leadId: lead._id,
            sequenceStep: step,
            variant,
            tier: lead.tier,
          });

          if (result.success && result.messageId) {
            await convex.mutation(api.leads.markEmailSent, {
              leadId: lead._id,
              resendMessageId: result.messageId,
              subject,
              sequenceStep: step,
              variant,
            });

            await convex.mutation(api.warming.recordEmailSent);
            await convex.mutation(api.metrics.increment, { metric: "emailsSent" });

            results.nurtureEmailsSent++;
          } else {
            results.errors.push(`Nurture email error for ${lead.contactEmail}: ${result.error}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.errors.push(`Nurture error for ${lead.contactEmail}: ${errorMessage}`);
        }
      }
    }

    // Send summary notification
    if (results.emailsSent > 0 || results.enriched > 0 || results.nurtureEmailsSent > 0) {
      await sendNotification(
        "Daily Pipeline Complete",
        `Validated: ${results.validated}\nEnriched: ${results.enriched}\nEmails Sent: ${results.emailsSent}\nNurture Emails: ${results.nurtureEmailsSent}\nNurture Completed: ${results.nurtureCompleted}\nErrors: ${results.errors.length}`
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
