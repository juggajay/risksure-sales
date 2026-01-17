import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readFileSync } from "fs";

// Load .env.local manually
const envContent = readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=");
    if (key && value) {
      process.env[key] = value;
    }
  }
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function checkEmail() {
  console.log("📧 Checking email status...\n");

  // Get the lead
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107@gmail.com" });

  if (!lead) {
    console.log("❌ Lead not found");
    return;
  }

  console.log("Lead ID:", lead._id);
  console.log("Status:", lead.status);
  console.log("Current Sequence Step:", lead.currentSequenceStep);
  console.log("Last Email Sent At:", lead.lastEmailSentAt ? new Date(lead.lastEmailSentAt).toISOString() : "Never");

  // Get email events for this lead
  console.log("\n📬 Email Events:");
  const events = await convex.query(api.emailEvents.getByLead, { leadId: lead._id });

  if (events.length === 0) {
    console.log("   No email events found");
  } else {
    for (const event of events) {
      console.log(`   - ${event.eventType}: "${event.emailSubject}" (Step ${event.sequenceStep})`);
      console.log(`     Resend ID: ${event.resendMessageId}`);
      console.log(`     Time: ${new Date(event.createdAt).toISOString()}`);
    }
  }

  // Get recent email events across all leads
  console.log("\n📊 Recent Email Events (all leads):");
  const recentEvents = await convex.query(api.emailEvents.getRecent, { limit: 5 });

  if (recentEvents.length === 0) {
    console.log("   No recent events");
  } else {
    for (const event of recentEvents) {
      console.log(`   - ${event.eventType}: "${event.emailSubject}"`);
      console.log(`     Resend ID: ${event.resendMessageId}`);
    }
  }
}

checkEmail().catch(console.error);
