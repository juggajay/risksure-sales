import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readFileSync } from "fs";

const envContent = readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=");
    if (key && value) process.env[key] = value;
  }
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function check() {
  console.log("Checking Lendlease email status...\n");

  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+lendlease@gmail.com" });
  if (lead) {
    console.log("Lead Status:", lead.status);
    console.log("Sequence Step:", lead.currentSequenceStep);
    console.log("Last Email Sent:", lead.lastEmailSentAt ? new Date(lead.lastEmailSentAt).toISOString() : "Never");
    console.log("Variant:", lead.sequenceVariant);
    console.log("Tier:", lead.tier);
  } else {
    console.log("Lead not found");
  }

  console.log("\nRecent Email Events:");
  const events = await convex.query(api.emailEvents.getRecent, { limit: 10 });
  for (const e of events) {
    console.log("  -", e.eventType + ":", e.emailSubject);
    console.log("    Resend ID:", e.resendMessageId);
    console.log("    Time:", new Date(e.createdAt).toISOString());
  }
}

check().catch(console.error);
