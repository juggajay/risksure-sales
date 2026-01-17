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

async function testMinimalHtml() {
  console.log("Testing MINIMAL HTML emails (clean unsubscribe link)\n");

  // Test to Gmail
  const gmailLead = {
    companyName: "John Holland",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107+johnholland@gmail.com",
    website: "https://www.johnholland.com.au",
    contactTitle: "Project Director",
    state: "VIC",
    source: "manual" as const,
    estimatedSubbies: 350,
  };

  console.log("1. Creating lead for John Holland (Gmail test)...");
  const gmailResult = await convex.mutation(api.leads.create, gmailLead);
  if (!gmailResult.success && gmailResult.error !== "Email already exists") {
    console.error("   Failed:", gmailResult.error);
    return;
  }
  console.log("   Lead ready\n");

  // Wait for Vercel deployment
  console.log("2. Waiting 30s for Vercel deployment...");
  await new Promise(r => setTimeout(r, 30000));
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
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+johnholland@gmail.com" });

  if (lead) {
    console.log("   Tier:", lead.tier);
    console.log("   Variant:", lead.sequenceVariant);
  }

  console.log("\nCheck Gmail - should have clean 'Unsubscribe' link (not ugly URL)");
  console.log("Should land in PRIMARY tab");
}

testMinimalHtml().catch(console.error);
