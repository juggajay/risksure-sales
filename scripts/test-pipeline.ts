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

async function testPipeline() {
  console.log("🧪 Testing RiskSure Sales Pipeline\n");

  // Step 1: Add a test lead (real Australian construction company)
  console.log("1️⃣ Creating test lead...");

  const testLead = {
    companyName: "Built Pty Ltd",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107@gmail.com",
    website: "https://www.built.com.au",
    contactTitle: "Project Manager",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 150,
  };

  const createResult = await convex.mutation(api.leads.create, testLead);

  if (!createResult.success) {
    if (createResult.error === "Email already exists") {
      console.log("   ⚠️  Lead already exists, continuing with existing lead\n");
    } else {
      console.error("   ❌ Failed to create lead:", createResult.error);
      return;
    }
  } else {
    console.log("   ✅ Lead created:", createResult.leadId);
  }

  // Step 2: Check lead stats
  console.log("\n2️⃣ Current lead stats:");
  const stats = await convex.query(api.leads.getStats);
  console.log("   Total leads:", stats.total);
  console.log("   By status:", JSON.stringify(stats.byStatus, null, 2));
  console.log("   By tier:", JSON.stringify(stats.byTier, null, 2));

  // Step 3: Trigger the pipeline
  console.log("\n3️⃣ Triggering daily pipeline...");

  // Use Vercel URL directly since custom domain may not be set up
  const pipelineUrl = "https://risksure-sales.vercel.app/api/cron/daily-pipeline";
  console.log("   URL:", pipelineUrl);

  try {
    const response = await fetch(pipelineUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log("\n   ✅ Pipeline completed successfully!");
      console.log("   Results:");
      console.log("   - Validated:", result.validated);
      console.log("   - Enriched:", result.enriched);
      console.log("   - Emails Sent:", result.emailsSent);
      if (result.errors?.length > 0) {
        console.log("   - Errors:", result.errors);
      }
      if (result.warmingStatus) {
        console.log("   - Warming Status:", result.warmingStatus);
      }
    } else {
      console.error("   ❌ Pipeline failed:", result.error);
    }
  } catch (error) {
    console.error("   ❌ Request failed:", error);
  }

  // Step 4: Check updated stats
  console.log("\n4️⃣ Updated lead stats:");
  const updatedStats = await convex.query(api.leads.getStats);
  console.log("   By status:", JSON.stringify(updatedStats.byStatus, null, 2));

  // Step 5: Get the test lead details
  console.log("\n5️⃣ Test lead details:");
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107@gmail.com" });
  if (lead) {
    console.log("   Status:", lead.status);
    console.log("   Tier:", lead.tier);
    console.log("   Email Validated:", lead.emailValidated);
    console.log("   Validation Result:", lead.emailValidationResult);
    console.log("   Enrichment Score:", lead.enrichmentScore);
    if (lead.personalizedOpener) {
      console.log("   Personalized Opener:", lead.personalizedOpener);
    }
    if (lead.painPoints) {
      console.log("   Pain Points:", lead.painPoints);
    }
  }

  console.log("\n✅ Test complete!");
}

testPipeline().catch(console.error);
