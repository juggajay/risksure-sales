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

// Use unique aliases so they're treated as new leads
const timestamp = Date.now();
const testLeads = [
  {
    companyName: "Hansen Yuncken",
    contactName: "Jayson",
    contactEmail: `jaysonryan21+hy${timestamp}@hotmail.com`,
    contactTitle: "Contracts Manager",
    website: "https://hansenyuncken.com.au",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 300, // Business tier
  },
  {
    companyName: "Multiplex",
    contactName: "Jayson",
    contactEmail: `jaysonryan2107+mp${timestamp}@gmail.com`,
    contactTitle: "Commercial Manager",
    website: "https://multiplex.global",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 150, // Compliance tier
  },
  {
    companyName: "Ryox Carpentry",
    contactName: "Jayson",
    contactEmail: `jayson+rx${timestamp}@ryoxcarpentry.com`,
    contactTitle: "Director",
    website: "https://ryoxcarpentry.com",
    state: "NSW",
    source: "manual" as const,
    estimatedSubbies: 45, // Velocity tier
  },
];

async function run() {
  console.log("=".repeat(70));
  console.log("RISKSURE FULL PIPELINE - NEW TEMPLATES TEST");
  console.log("=".repeat(70));
  console.log(`\nTimestamp: ${timestamp}`);
  console.log("\nWaiting 60 seconds for Vercel deployment...");
  await new Promise(r => setTimeout(r, 60000));
  console.log("Done waiting.\n");

  // Step 1: Create leads
  console.log("─".repeat(70));
  console.log("STEP 1: CREATING LEADS");
  console.log("─".repeat(70));

  for (const lead of testLeads) {
    console.log(`\n  Creating: ${lead.companyName} (${lead.estimatedSubbies} subbies)`);
    console.log(`    Email: ${lead.contactEmail}`);

    const result = await convex.mutation(api.leads.create, lead);
    if (result.success) {
      console.log(`    ✅ Created`);
    } else {
      console.log(`    ❌ ${result.error}`);
    }
  }

  // Step 2: Run pipeline
  console.log("\n" + "─".repeat(70));
  console.log("STEP 2: RUNNING PIPELINE");
  console.log("─".repeat(70));
  console.log("\n  Validating → Enriching → Sending...\n");

  const response = await fetch(
    "https://risksure-sales.vercel.app/api/cron/daily-pipeline",
    {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    }
  );

  const result = await response.json();
  console.log("  Results:");
  console.log(`    Validated: ${result.validated}`);
  console.log(`    Enriched: ${result.enriched}`);
  console.log(`    Emails Sent: ${result.emailsSent}`);

  if (result.errors?.length > 0) {
    console.log(`    Errors:`);
    for (const err of result.errors) {
      console.log(`      - ${err}`);
    }
  }

  // Handle rate limiting - retry if needed
  if (result.emailsSent < 3 && result.enriched > 0) {
    console.log("\n  Some emails may have hit rate limit. Retrying in 5 seconds...");
    await new Promise(r => setTimeout(r, 5000));

    const retryResponse = await fetch(
      "https://risksure-sales.vercel.app/api/cron/daily-pipeline",
      {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      }
    );
    const retryResult = await retryResponse.json();
    console.log(`    Retry sent: ${retryResult.emailsSent} more emails`);
  }

  // Step 3: Show results
  console.log("\n" + "─".repeat(70));
  console.log("STEP 3: LEAD DETAILS");
  console.log("─".repeat(70));

  for (const testLead of testLeads) {
    const lead = await convex.query(api.leads.getByEmail, {
      email: testLead.contactEmail,
    });

    if (lead) {
      console.log(`\n  ${lead.companyName} (${lead.tier} tier)`);
      console.log(`  ${"─".repeat(50)}`);
      console.log(`    Status: ${lead.status}`);
      console.log(`    Variant: ${lead.sequenceVariant || "pending"}`);
      console.log(`    Subbies: ${lead.estimatedSubbies}`);

      if (lead.personalizedOpener) {
        console.log(`\n    AI Opener: "${lead.personalizedOpener.substring(0, 100)}..."`);
      }
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("DONE - CHECK YOUR INBOXES");
  console.log("=".repeat(70));
  console.log("\nEmails should now include the full template with:");
  console.log("  - AI-generated personalized opener");
  console.log("  - Problem description (COC process pain)");
  console.log("  - Product pitch (subbie portal, verification, flagging)");
  console.log("  - CTA and signature");
  console.log("\nRecipients:");
  console.log("  • jaysonryan21@hotmail.com");
  console.log("  • jaysonryan2107@gmail.com");
  console.log("  • jayson@ryoxcarpentry.com");
}

run().catch(console.error);
