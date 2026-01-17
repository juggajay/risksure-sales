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

async function testRealLead() {
  console.log("🧪 Testing with REAL company data\n");
  console.log("Company: Multiplex (Major Australian Construction)");
  console.log("Email: Will be sent to YOUR inbox for review\n");

  // Real Australian construction company - Multiplex
  // Using your email so you can review the output
  const testLead = {
    companyName: "Multiplex",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107+multiplex@gmail.com", // Gmail alias - goes to your inbox
    website: "https://www.multiplex.global",
    contactTitle: "Construction Director",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 500, // Large company
  };

  // Step 1: Create lead
  console.log("1️⃣ Creating lead for Multiplex...");
  const createResult = await convex.mutation(api.leads.create, testLead);

  if (!createResult.success) {
    if (createResult.error === "Email already exists") {
      console.log("   ⚠️  Email already used - deleting old lead first...");
      // We can't easily delete, so let's check status
      const existing = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+multiplex@gmail.com" });
      if (existing) {
        console.log("   Current status:", existing.status);
        console.log("   Company:", existing.companyName);
        if (existing.companyName === "Multiplex") {
          console.log("   ✅ Multiplex lead already exists, will trigger pipeline\n");
        } else {
          console.log("   ❌ Lead exists for different company. Please wait or use different email.");
          return;
        }
      }
    } else {
      console.error("   ❌ Failed:", createResult.error);
      return;
    }
  } else {
    console.log("   ✅ Lead created:", createResult.leadId, "\n");
  }

  // Step 2: Wait for Vercel deployment (the footer fix)
  console.log("2️⃣ Waiting 30s for Vercel to deploy footer fix...");
  await new Promise(r => setTimeout(r, 30000));
  console.log("   ✅ Done waiting\n");

  // Step 3: Trigger pipeline
  console.log("3️⃣ Triggering pipeline (validation + enrichment + email)...");
  const pipelineUrl = "https://risksure-sales.vercel.app/api/cron/daily-pipeline";

  try {
    const response = await fetch(pipelineUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log("\n   ✅ Pipeline completed!");
      console.log("   - Validated:", result.validated);
      console.log("   - Enriched:", result.enriched);
      console.log("   - Emails Sent:", result.emailsSent);
      if (result.errors?.length > 0) {
        console.log("   - Errors:", result.errors);
      }
    } else {
      console.error("   ❌ Pipeline failed:", result);
    }
  } catch (error) {
    console.error("   ❌ Request failed:", error);
  }

  // Step 4: Show enrichment results
  console.log("\n4️⃣ Enrichment Results:");
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan2107+multiplex@gmail.com" });

  if (lead) {
    console.log("   Status:", lead.status);
    console.log("   Tier:", lead.tier);
    console.log("   Enrichment Score:", lead.enrichmentScore || "N/A");

    if (lead.personalizedOpener) {
      console.log("\n   📝 PERSONALIZED OPENER:");
      console.log("   ", lead.personalizedOpener);
    }

    if (lead.painPoints?.length) {
      console.log("\n   🎯 PAIN POINTS IDENTIFIED:");
      lead.painPoints.forEach((p: string, i: number) => console.log(`   ${i + 1}. ${p}`));
    }

    if (lead.enrichmentData) {
      console.log("\n   📊 ENRICHMENT DATA:");
      console.log("   Company Summary:", lead.enrichmentData.companySummary);
      console.log("   Est. Projects:", lead.enrichmentData.estimatedProjects);
      console.log("   Est. Subcontractors:", lead.enrichmentData.estimatedSubcontractors);
      console.log("   Est. Revenue:", lead.enrichmentData.estimatedRevenue);
      console.log("   Compliance Maturity:", lead.enrichmentData.complianceMaturity);
    }
  }

  console.log("\n✅ Check your inbox for the email!");
  console.log("   Subject will be: 'Portfolio compliance risk at Multiplex'");
}

testRealLead().catch(console.error);
