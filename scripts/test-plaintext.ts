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

async function testPlainText() {
  console.log("Testing PLAIN TEXT emails for better deliverability\n");

  // Use Brookfield - another major Australian builder
  const testLead = {
    companyName: "Brookfield",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107+brookfield@gmail.com",
    website: "https://www.brookfield.com/our-businesses/real-estate",
    contactTitle: "Development Manager",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 400,
  };

  console.log("1. Creating lead for Brookfield...");
  const result = await convex.mutation(api.leads.create, testLead);

  if (!result.success && result.error !== "Email already exists") {
    console.error("   Failed:", result.error);
    return;
  }
  console.log("   Lead ready\n");

  // Wait for Vercel deployment
  console.log("2. Waiting 45s for Vercel deployment...");
  await new Promise(r => setTimeout(r, 45000));
  console.log("   Done\n");

  // Trigger pipeline
  console.log("3. Triggering pipeline...");
  const response = await fetch("https://risksure-sales.vercel.app/api/cron/daily-pipeline", {
    headers: { Authorization: "Bearer " + process.env.CRON_SECRET },
  });
  const pipelineResult = await response.json();

  console.log("   Validated:", pipelineResult.validated);
  console.log("   Enriched:", pipelineResult.enriched);
  console.log("   Emails Sent:", pipelineResult.emailsSent);

  // Get lead details
  console.log("\n4. Lead Details:");
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+brookfield@gmail.com" });

  if (lead) {
    console.log("   Tier:", lead.tier);
    console.log("   Variant:", lead.sequenceVariant);
    console.log("   Score:", lead.enrichmentScore);
    if (lead.personalizedOpener) {
      console.log("\n   Opener:", lead.personalizedOpener);
    }
  }

  console.log("\nCheck Gmail - this should be a PLAIN TEXT email");
  console.log("Subject: 'Audit question for Brookfield' or 'Portfolio compliance risk at Brookfield'");
  console.log("If it lands in PRIMARY, the plain text fix worked!");
}

testPlainText().catch(console.error);
