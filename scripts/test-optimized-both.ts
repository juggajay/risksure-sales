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

async function testOptimizedBoth() {
  console.log("Testing OPTIMIZED templates (per deliverability guide)\n");
  console.log("Changes:");
  console.log("  - 70-80 words (was 130+)");
  console.log("  - Social proof included");
  console.log("  - Soft opt-out instead of ugly URL");
  console.log("  - Phone number in signature\n");

  // Gmail test - Hansen Yuncken
  const gmailLead = {
    companyName: "Hansen Yuncken",
    contactName: "Jayson",
    contactEmail: "jaysonryan2107+hansenyuncken@gmail.com",
    website: "https://www.hansenyuncken.com.au",
    contactTitle: "Project Director",
    state: "VIC",
    source: "manual" as const,
    estimatedSubbies: 400,
  };

  // Outlook test - Icon Co
  const outlookLead = {
    companyName: "Icon Co",
    contactName: "Jayson",
    contactEmail: "jaysonryan21+iconco@hotmail.com",
    website: "https://www.youricon.com.au",
    contactTitle: "Construction Manager",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 350,
  };

  console.log("1. Creating leads...");

  const gmailResult = await convex.mutation(api.leads.create, gmailLead);
  if (!gmailResult.success && gmailResult.error !== "Email already exists") {
    console.error("   Gmail lead failed:", gmailResult.error);
  } else {
    console.log("   Gmail (Hansen Yuncken): Ready");
  }

  const outlookResult = await convex.mutation(api.leads.create, outlookLead);
  if (!outlookResult.success && outlookResult.error !== "Email already exists") {
    console.error("   Outlook lead failed:", outlookResult.error);
  } else {
    console.log("   Outlook (Icon Co): Ready");
  }

  // Wait for Vercel deployment
  console.log("\n2. Waiting 35s for Vercel deployment...");
  await new Promise(r => setTimeout(r, 35000));
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
  console.log("\n4. Results:");

  const gmailLeadInfo = await convex.query(api.leads.getByEmail, {
    email: "jaysonryan2107+hansenyuncken@gmail.com"
  });
  if (gmailLeadInfo) {
    console.log("\n   GMAIL (Hansen Yuncken):");
    console.log("   - Tier:", gmailLeadInfo.tier);
    console.log("   - Variant:", gmailLeadInfo.sequenceVariant);
    console.log("   - Status:", gmailLeadInfo.status);
  }

  const outlookLeadInfo = await convex.query(api.leads.getByEmail, {
    email: "jaysonryan21+iconco@hotmail.com"
  });
  if (outlookLeadInfo) {
    console.log("\n   OUTLOOK (Icon Co):");
    console.log("   - Tier:", outlookLeadInfo.tier);
    console.log("   - Variant:", outlookLeadInfo.sequenceVariant);
    console.log("   - Status:", outlookLeadInfo.status);
  }

  console.log("\n" + "=".repeat(50));
  console.log("CHECK YOUR INBOXES:");
  console.log("=".repeat(50));
  console.log("\nGmail: jaysonryan2107+hansenyuncken@gmail.com");
  console.log("  -> Should land in PRIMARY (not Promotions)");
  console.log("\nOutlook: jaysonryan21+iconco@hotmail.com");
  console.log("  -> Should land in Inbox (not Junk)");
  console.log("\nLook for shorter email with:");
  console.log("  - Social proof ('One client cut compliance admin by 10 hours')");
  console.log("  - Soft opt-out ('If this isn't relevant... just let me know')");
  console.log("  - Phone number in signature");
}

testOptimizedBoth().catch(console.error);
