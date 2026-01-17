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

async function testVariantB() {
  console.log("🧪 Testing NEW Variant B (problem-focused)\n");

  // Use Lendlease - another major Australian builder
  const testLead = {
    companyName: "Lendlease",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107+lendlease@gmail.com",
    website: "https://www.lendlease.com",
    contactTitle: "Project Director",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 600,
  };

  console.log("1️⃣ Creating lead for Lendlease...");
  const result = await convex.mutation(api.leads.create, testLead);

  if (!result.success && result.error !== "Email already exists") {
    console.error("   ❌ Failed:", result.error);
    return;
  }
  console.log("   ✅ Lead ready\n");

  // Wait for Vercel deployment
  console.log("2️⃣ Waiting 45s for Vercel deployment...");
  await new Promise(r => setTimeout(r, 45000));
  console.log("   ✅ Done\n");

  // Trigger pipeline
  console.log("3️⃣ Triggering pipeline...");
  const response = await fetch("https://risksure-sales.vercel.app/api/cron/daily-pipeline", {
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  const pipelineResult = await response.json();

  console.log("   Validated:", pipelineResult.validated);
  console.log("   Enriched:", pipelineResult.enriched);
  console.log("   Emails Sent:", pipelineResult.emailsSent);

  // Get lead details
  console.log("\n4️⃣ Lead Details:");
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+lendlease@gmail.com" });

  if (lead) {
    console.log("   Tier:", lead.tier);
    console.log("   Variant:", lead.sequenceVariant);
    console.log("   Score:", lead.enrichmentScore);
    if (lead.personalizedOpener) {
      console.log("\n   Opener:", lead.personalizedOpener);
    }
  }

  console.log("\n✅ Check Gmail - should have subject: 'Audit question for Lendlease'");
  console.log("   If it's in PRIMARY, the fix worked!");
}

testVariantB().catch(console.error);
