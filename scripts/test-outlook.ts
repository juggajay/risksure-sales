import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readFileSync } from "fs";

// Load .env.local
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

async function testOutlook() {
  console.log("Testing email delivery to Outlook/Hotmail\n");

  // Use CPB Contractors - major Australian builder
  const testLead = {
    companyName: "CPB Contractors",
    contactName: "Jayson",
    contactEmail: "jaysonryan21@hotmail.com",
    website: "https://www.cpbcon.com.au",
    contactTitle: "Project Manager",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 450,
  };

  console.log("1. Creating lead for CPB Contractors...");
  const result = await convex.mutation(api.leads.create, testLead);

  if (!result.success && result.error !== "Email already exists") {
    console.error("   Failed:", result.error);
    return;
  }
  console.log("   Lead ready\n");

  // Trigger pipeline immediately (Vercel already has latest code)
  console.log("2. Triggering pipeline...");
  const response = await fetch("https://risksure-sales.vercel.app/api/cron/daily-pipeline", {
    headers: { Authorization: "Bearer " + process.env.CRON_SECRET },
  });
  const pipelineResult = await response.json();

  console.log("   Validated:", pipelineResult.validated);
  console.log("   Enriched:", pipelineResult.enriched);
  console.log("   Emails Sent:", pipelineResult.emailsSent);

  // Get lead details
  console.log("\n3. Lead Details:");
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan21@hotmail.com" });

  if (lead) {
    console.log("   Tier:", lead.tier);
    console.log("   Variant:", lead.sequenceVariant);
    console.log("   Score:", lead.enrichmentScore);
    if (lead.personalizedOpener) {
      console.log("\n   Opener:", lead.personalizedOpener);
    }
  }

  console.log("\nCheck Outlook inbox for the email!");
}

testOutlook().catch(console.error);
