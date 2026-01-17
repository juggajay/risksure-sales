import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sendNotification } from "@/lib/resend";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  const payload = await request.json();

  // Calendly sends events with this structure
  const { event, payload: eventData } = payload;

  try {
    if (event === "invitee.created") {
      // Demo was scheduled
      const email = eventData.invitee?.email;
      const scheduledTime = eventData.event?.start_time;
      const eventUrl = eventData.event?.uri;
      const inviteeName = eventData.invitee?.name;

      if (!email) {
        return NextResponse.json({ received: true, skipped: true });
      }

      // Find lead by email
      const lead = await convex.query(api.leads.getByEmail, {
        email: email.toLowerCase(),
      });

      if (lead) {
        // Update lead status
        await convex.mutation(api.leads.setDemoScheduled, {
          leadId: lead._id,
          scheduledAt: new Date(scheduledTime).getTime(),
          calendlyUrl: eventUrl,
        });

        // Update metrics
        await convex.mutation(api.metrics.increment, { metric: "demosBooked" });

        // Notify
        await sendNotification(
          "Demo Booked!",
          `New demo scheduled!\n\nCompany: ${lead.companyName}\nContact: ${lead.contactName}\nEmail: ${email}\nTime: ${new Date(scheduledTime).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`
        );
      } else {
        // Lead not in system - still notify
        await sendNotification(
          "Demo Booked (New Lead)",
          `Demo scheduled with unknown lead:\n\nName: ${inviteeName || "Unknown"}\nEmail: ${email}\nTime: ${new Date(scheduledTime).toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}`
        );
      }
    }

    if (event === "invitee.canceled") {
      const email = eventData.invitee?.email;

      if (email) {
        const lead = await convex.query(api.leads.getByEmail, {
          email: email.toLowerCase(),
        });

        if (lead) {
          await convex.mutation(api.leads.updateStatus, {
            leadId: lead._id,
            status: "contacted",
            note: "Demo canceled",
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Calendly webhook error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
