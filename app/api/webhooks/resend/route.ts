import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { sendNotification } from "@/lib/resend";
import crypto from "crypto";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function verifySignature(payload: string, signature: string): boolean {
  if (!process.env.RESEND_WEBHOOK_SECRET) return true; // Skip in dev

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RESEND_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

interface ResendTag {
  name: string;
  value: string;
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("resend-signature") || "";

  // Verify signature in production
  if (process.env.NODE_ENV === "production") {
    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const { type, data } = JSON.parse(payload);

  // Extract tags
  const tags: ResendTag[] = data.tags || [];
  const leadIdStr = tags.find((t) => t.name === "lead_id")?.value;
  const variant = tags.find((t) => t.name === "variant")?.value as "A" | "B" | undefined;
  const tier = tags.find((t) => t.name === "tier")?.value;
  const sequenceStep = parseInt(
    tags.find((t) => t.name === "sequence_step")?.value || "0"
  );

  if (!leadIdStr) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const leadId = leadIdStr as Id<"leads">;

  try {
    switch (type) {
      case "email.delivered":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "delivered",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
        });
        await convex.mutation(api.metrics.increment, { metric: "emailsDelivered" });
        break;

      case "email.opened":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "opened",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
        });

        await convex.mutation(api.leads.markOpened, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsOpened" });
        await convex.mutation(api.metrics.increment, {
          metric: variant === "A" ? "variantAOpened" : "variantBOpened",
        });

        // Record A/B test result
        if (tier && variant) {
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${tier}_step${sequenceStep}`,
            tier,
            sequenceStep,
            variant,
            eventType: "opened",
          });
        }

        // Notify on first open
        await sendNotification(
          "Email Opened",
          `Lead opened email: ${data.to?.[0] || "unknown"}`
        );
        break;

      case "email.clicked":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "clicked",
          emailSubject: data.subject || "",
          sequenceStep,
          sequenceVariant: variant,
          resendMessageId: data.email_id,
          metadata: { url: data.click?.link },
        });

        await convex.mutation(api.leads.markClicked, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsClicked" });

        // Record A/B test
        if (tier && variant) {
          await convex.mutation(api.abTests.recordEvent, {
            testName: `${tier}_step${sequenceStep}`,
            tier,
            sequenceStep,
            variant,
            eventType: "clicked",
          });
        }

        // HOT LEAD - notify immediately
        await sendNotification(
          "HOT LEAD - Link Clicked!",
          `Lead clicked link: ${data.to?.[0] || "unknown"}\nURL: ${data.click?.link || "unknown"}`
        );
        break;

      case "email.bounced":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "bounced",
          emailSubject: data.subject || "",
          sequenceStep,
          resendMessageId: data.email_id,
          metadata: { reason: data.bounce?.type },
        });

        await convex.mutation(api.leads.markBounced, { leadId });
        await convex.mutation(api.metrics.increment, { metric: "emailsBounced" });
        // Track bounce in warming system for dynamic limit adjustment
        await convex.mutation(api.warming.recordBounce);
        break;

      case "email.complained":
        await convex.mutation(api.emailEvents.log, {
          leadId,
          eventType: "complained",
          emailSubject: data.subject || "",
          sequenceStep,
          resendMessageId: data.email_id,
        });

        // Treat complaint as unsubscribe
        await convex.mutation(api.leads.updateStatus, {
          leadId,
          status: "unsubscribed",
          note: "Marked as spam",
        });
        await convex.mutation(api.metrics.increment, { metric: "unsubscribes" });
        // Track complaint in warming system for auto-pause
        await convex.mutation(api.warming.recordComplaint);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Webhook error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
