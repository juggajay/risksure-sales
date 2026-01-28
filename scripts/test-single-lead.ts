/**
 * Test enrichment + step 0 email for a single company
 * Usage: npx tsx scripts/test-single-lead.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { enrichLead } from "../lib/enrichment";
import { Resend } from "resend";

const LEAD = {
  companyName: "Coronation Property",
  website: "https://coronation.com.au",
  contactName: "Joseph Nahas",
  contactTitle: "Managing Director",
  state: "NSW",
};

const RECIPIENT = "jaysonryan2107@gmail.com";

const SENDER = {
  name: process.env.SENDER_NAME || "Jayson",
  title: process.env.SENDER_TITLE || "Founder",
  phone: process.env.SENDER_PHONE || "0449 228 921",
};

const CALENDLY_URL = process.env.CALENDLY_BOOKING_URL || "https://calendly.com/risksure/demo";

const subjectA = `Quick question about ${LEAD.companyName}'s COC process`;
const subjectB = `${LEAD.contactName.split(" ")[0]} - subbie insurance compliance`;

function buildBody(opener: string, subbies: number): string {
  return `Hi ${LEAD.contactName.split(" ")[0]},

${opener}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by ${subbies} subbies and 3-4 certs each. That's a lot of admin hours - and a lot of liability if something slips through.

We built something that changes that:
- Each subbie gets their own portal (free for them, no account required - just a link)
- They upload their docs in 60 seconds
- Our AI verifies everything against your requirements in 30 seconds
- Your team just reviews what we flag

You get a timestamped audit trail of every verification - useful if WorkSafe ever asks.

Happy to show you how it works if you're interested: ${CALENDLY_URL}

${SENDER.name}
${SENDER.title} | RiskSure.AI
${SENDER.phone}

If this isn't relevant for ${LEAD.companyName}, just let me know.`;
}

async function main() {
  console.log("=".repeat(50));
  console.log(`ENRICHING: ${LEAD.companyName}`);
  console.log("=".repeat(50));

  const result = await enrichLead(LEAD);

  if (!result.success) {
    console.error("Enrichment failed:", result.error);
    process.exit(1);
  }

  console.log("\n--- Enrichment Results ---");
  console.log(`Tier: ${result.tier}`);
  console.log(`Score: ${result.enrichmentScore}`);
  console.log(`Est. Subbies: ${result.estimatedSubbies}`);
  console.log(`Est. Revenue: ${result.estimatedRevenue}`);
  console.log(`Confidence: ${result.enrichmentData?.confidence}`);
  console.log(`Opener: ${result.personalizedOpener}`);
  console.log(`Pain Points: ${result.painPoints?.join(", ")}`);
  console.log(`Recent News: ${result.enrichmentData?.recentNews?.join(", ") || "none"}`);

  const opener = result.personalizedOpener || "";
  const subbies = result.estimatedSubbies || 50;
  const body = buildBody(opener, subbies);

  console.log("\n--- Email Preview ---");
  console.log(`Subject A: ${subjectA}`);
  console.log(`Subject B: ${subjectB}`);
  console.log(`\nBody:\n${body}`);

  // Send both variants
  const resend = new Resend(process.env.RESEND_API_KEY!);

  console.log("\n--- Sending ---");

  const { error: errA } = await resend.emails.send({
    from: `${SENDER.name} <jayson@risksure.ai>`,
    to: RECIPIENT,
    subject: `[TEST Subject A] ${subjectA}`,
    text: body,
    tags: [{ name: "test", value: "true" }],
  });

  if (errA) {
    console.error("Failed to send variant A:", errA.message);
  } else {
    console.log(`Sent variant A: "${subjectA}" -> ${RECIPIENT}`);
  }

  await new Promise((r) => setTimeout(r, 300));

  const { error: errB } = await resend.emails.send({
    from: `${SENDER.name} <jayson@risksure.ai>`,
    to: RECIPIENT,
    subject: `[TEST Subject B] ${subjectB}`,
    text: body,
    tags: [{ name: "test", value: "true" }],
  });

  if (errB) {
    console.error("Failed to send variant B:", errB.message);
  } else {
    console.log(`Sent variant B: "${subjectB}" -> ${RECIPIENT}`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("DONE - Check your inbox");
  console.log("=".repeat(50));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
