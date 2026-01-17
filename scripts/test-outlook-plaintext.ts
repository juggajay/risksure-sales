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

async function testOutlookPlaintext() {
  console.log("Testing PURE PLAIN TEXT email to Outlook\n");

  // Use Watpac - Australian builder
  const testLead = {
    companyName: "Watpac",
    contactName: "Jayson",
    contactEmail: "jaysonryan21+watpac@hotmail.com",
    website: "https://www.watpac.com.au",
    contactTitle: "Project Director",
    state: "QLD",
    source: "manual" as const,
    estimatedSubbies: 300,
  };

  console.log("1. Creating lead for Watpac...");
  const result = await convex.mutation(api.leads.create, testLead);

  if (!result.success && result.error !== "Email already exists") {
    console.error("   Failed:", result.error);
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
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan21+watpac@hotmail.com" });

  if (lead) {
    console.log("   Tier:", lead.tier);
    console.log("   Variant:", lead.sequenceVariant);
    console.log("   Score:", lead.enrichmentScore);
  }

  console.log("\nCheck Outlook inbox - this is PURE PLAIN TEXT (no HTML)");
  console.log("Should go to your main inbox, not Junk");
}

testOutlookPlaintext().catch(console.error);
