import { config } from "dotenv";
config({ path: ".env.local" });

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Resend } from "resend";
import { enrichLead } from "../lib/enrichment";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const resend = new Resend(process.env.RESEND_API_KEY!);

// Jayson's email addresses for preview
const PREVIEW_EMAILS = [
  "jaysonryan21@hotmail.com",
  "jaysonryan2107@gmail.com",
  "jayson@ryoxcarpentry.com",
];

// Real Australian construction companies
const realLeads = [
  {
    companyName: "Hutchinson Builders",
    website: "https://www.hutchinsonbuilders.com.au",
    contactName: "Scott Hutchinson",
    contactTitle: "Chairman",
    state: "QLD",
  },
  {
    companyName: "ADCO Constructions",
    website: "https://www.adcoconstruct.com.au",
    contactName: "Neil Harding",
    contactTitle: "CEO",
    state: "NSW",
  },
  {
    companyName: "Grindley Construction",
    website: "https://www.grindley.com.au",
    contactName: "Michael Grindley",
    contactTitle: "Managing Director",
    state: "NSW",
  },
];

async function generateEmail(enrichment: any, companyName: string) {
  // Get templates from Convex
  const templatesData = await convex.query(api.templates.getAll);
  const templates = templatesData.templates;

  // Use Step 0 (Initial Outreach)
  const variant = Math.random() > 0.5 ? "A" : "B";
  const subject = variant === "A"
    ? templates.subjects.step0.A
    : templates.subjects.step0.B;
  const body = templates.bodies.step0;

  // Replace template variables
  const replacements: Record<string, string> = {
    "{{contactName}}": enrichment.contactName?.split(" ")[0] || "there",
    "{{companyName}}": companyName,
    "{{personalizedOpener}}": enrichment.personalizedOpener || "",
    "{{estimatedSubbies}}": String(enrichment.estimatedSubbies || 50),
    "{{state}}": enrichment.state || "Australia",
    "{{calendlyUrl}}": "https://calendly.com/risksure/demo",
    "{{senderName}}": "Jason",
    "{{senderTitle}}": "Founder",
    "{{senderPhone}}": "0412 345 678",
    "{{demoVideoUrl}}": "https://risksure.ai/demo",
  };

  let finalSubject = subject;
  let finalBody = body;

  for (const [key, value] of Object.entries(replacements)) {
    finalSubject = finalSubject.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value);
    finalBody = finalBody.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "g"), value);
  }

  return { subject: finalSubject, body: finalBody, variant };
}

async function sendEmail(to: string, subject: string, body: string, companyName: string) {
  // Convert body to HTML with proper formatting
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
      ${body.split("\n\n").map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, "<br>")}</p>`).join("")}
    </div>
  `;

  const result = await resend.emails.send({
    from: "Jason <jason@risksure.ai>",
    to: [to],
    subject: `[PREVIEW - ${companyName}] ${subject}`,
    html: htmlBody,
    text: body,
  });

  return result;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  RISKSURE PIPELINE PREVIEW - Using Gemini 3.0 Flash");
  console.log("═══════════════════════════════════════════════════════════\n");

  console.log("Preview emails will be sent to:");
  PREVIEW_EMAILS.forEach((email, i) => console.log(`  ${i + 1}. ${email}`));
  console.log("");

  for (let i = 0; i < realLeads.length; i++) {
    const lead = realLeads[i];
    const previewEmail = PREVIEW_EMAILS[i];

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 Processing: ${lead.companyName}`);
    console.log(`   Target: ${lead.contactName}, ${lead.contactTitle}`);
    console.log(`   Preview to: ${previewEmail}`);

    try {
      // Enrich with Gemini 3.0 Flash
      console.log(`\n🔍 Enriching with Gemini 3.0 Flash...`);
      const enrichment = await enrichLead(lead);

      if (!enrichment.success) {
        console.log(`   ❌ Enrichment failed: ${enrichment.error}`);
        continue;
      }

      console.log(`   ✓ Tier: ${enrichment.tier}`);
      console.log(`   ✓ Score: ${enrichment.enrichmentScore}`);
      console.log(`   ✓ Subbies: ${enrichment.estimatedSubbies}`);
      console.log(`   ✓ Opener: ${enrichment.personalizedOpener?.substring(0, 60)}...`);

      // Generate real email from templates
      const enrichmentWithContact = {
        ...enrichment,
        contactName: lead.contactName,
        state: lead.state,
      };
      const { subject, body, variant } = await generateEmail(enrichmentWithContact, lead.companyName);

      console.log(`\n   📝 Email Generated (Variant ${variant}):`);
      console.log(`      Subject: ${subject}`);

      // Send to Jayson's email
      const result = await sendEmail(previewEmail, subject, body, lead.companyName);

      if (result.data?.id) {
        console.log(`\n   ✅ SENT! Resend ID: ${result.data.id}`);
      } else {
        console.log(`\n   ❌ Failed:`, result.error);
      }

      // Delay between sends
      await new Promise(r => setTimeout(r, 3000));

    } catch (error) {
      console.error(`   ❌ Error processing ${lead.companyName}:`, error);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("  ✅ COMPLETE - Check your inboxes!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("\nEmails sent to:");
  console.log("  • jaysonryan21@hotmail.com (Hutchinson Builders)");
  console.log("  • jaysonryan2107@gmail.com (ADCO Constructions)");
  console.log("  • jayson@ryoxcarpentry.com (Grindley Construction)");
}

main().catch(console.error);
