/**
 * Send Test Emails
 *
 * Sends all email template variants to specified test addresses
 * so you can review them in your inbox before launching.
 *
 * Usage:
 *   npx tsx scripts/send-test-emails.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Resend } from "resend";

const TEST_EMAILS = [
  "jaysonryan2107@gmail.com",
];

// Sample company data for template variables
const SAMPLE_DATA = {
  velocity: {
    contactName: "John",
    companyName: "Smith Builders",
    estimatedSubbies: 45,
    state: "NSW",
    personalizedOpener: "Saw Smith Builders just kicked off the new retail fit-out in Parramatta - nice win.",
  },
  compliance: {
    contactName: "Sarah",
    companyName: "Metro Construction Group",
    estimatedSubbies: 120,
    state: "VIC",
    personalizedOpener: "Noticed Metro Construction Group has expanded into aged care projects this year - that's a sector with serious compliance requirements.",
  },
  business: {
    contactName: "Michael",
    companyName: "Horizon Building Corporation",
    estimatedSubbies: 350,
    state: "QLD",
    personalizedOpener: "With Horizon Building Corporation's portfolio across three states, you're probably managing more subbie relationships than most.",
  },
};

const SENDER = {
  name: process.env.SENDER_NAME || "Jayson",
  title: process.env.SENDER_TITLE || "Founder",
  phone: process.env.SENDER_PHONE || "0449 228 921",
};

const CALENDLY_URL = process.env.CALENDLY_BOOKING_URL || "https://calendly.com/risksure/demo";
const DEMO_VIDEO_URL = process.env.DEMO_VIDEO_URL || "https://risksure.ai/demo";

// Templates (matching the new updated templates)
const templates = {
  subjects: {
    step0: {
      A: "Quick question about {{companyName}}'s COC process",
      B: "{{contactName}} - subbie insurance compliance",
    },
    step1: {
      A: "Re: Quick question about {{companyName}}'s COC process",
      B: "The workflow shift (+ Procore sync)",
    },
    step2: {
      A: "{{contactName}} - the compliance maths",
      B: "Beyond time savings - the liability angle",
    },
    step3: {
      A: "Early adopter opportunity",
      B: "What {{state}} builders are switching to",
    },
    step4: {
      A: "Closing the loop",
      B: "Last note from me",
    },
  },
  bodies: {
    step0: `Hi {{contactName}},

{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each. That's a lot of admin hours - and a lot of liability if something slips through.

We built something that changes that:
- Each subbie gets their own portal (free for them, no account required - just a link)
- They upload their docs in 60 seconds
- Our AI verifies everything against your requirements in 30 seconds
- Your team just reviews what we flag

You get a timestamped audit trail of every verification - useful if WorkSafe ever asks.

Happy to show you how it works if you're interested: {{calendlyUrl}}

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.`,

    step1: `Hi {{contactName}},

Following up on my last note.

The short version: subbies upload their own docs through a free portal (no login, just a secure link), we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Already using Procore? We sync directly - your subbie compliance status shows up right in your project.

Here's a 45-second video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,

    step2_velocity: `Hi {{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_compliance: `Hi {{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. That's a lot of hours spent on admin work that doesn't need a human.

**The liability angle:** Industrial Manslaughter laws are now active in {{state}} - up to $20M in fines and personal imprisonment for officers. The Pafburn High Court ruling confirmed head contractors can't delegate this liability to subbies.

We've built something that handles both:
- Automates collection and verification (AI checks in 30 seconds)
- Creates timestamped audit trail for every verification
- Flags exceptions for your team to review

Your compliance team spends time on actual risk management, not document admin.

Worth a look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_business: `Hi {{contactName}},

At {{companyName}}'s scale, you've got thousands of certificates across your portfolio. That's either a full-time job for someone, or gaps are forming.

With Industrial Manslaughter laws now active nationally and the Pafburn ruling confirming non-delegable duty, those gaps represent serious liability - not just admin inconvenience.

We work with builders managing 300+ subbies where:
- The compliance team has complete visibility across every project
- Every verification is timestamped (audit-ready)
- Subbies actually upload on time (because our portal is free and takes 60 seconds)
- The team focuses on risk management, not document chasing

If you'd like to see how this works at enterprise scale: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step3: `Hi {{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Here's how it works: your team adds a subbie, they get a portal link, they upload in 60 seconds (free for them, no login required), and our AI verifies against your requirements in 30 seconds. You just review the exceptions.

If you'd be open to being one of our early adopters, use code FOUNDER50 for 50% off your first 6 months. You'd also get direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

    step4: `Hi {{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

The FOUNDER50 code (50% off first 6 months) stays valid if you want to revisit later.

All the best with the projects.

{{senderName}}
{{senderPhone}}`,
  },
};

function replaceVars(template: string, data: typeof SAMPLE_DATA.velocity): string {
  return template
    .replace(/\{\{contactName\}\}/g, data.contactName)
    .replace(/\{\{companyName\}\}/g, data.companyName)
    .replace(/\{\{estimatedSubbies\}\}/g, String(data.estimatedSubbies))
    .replace(/\{\{state\}\}/g, data.state)
    .replace(/\{\{personalizedOpener\}\}/g, data.personalizedOpener)
    .replace(/\{\{calendlyUrl\}\}/g, CALENDLY_URL)
    .replace(/\{\{demoVideoUrl\}\}/g, DEMO_VIDEO_URL)
    .replace(/\{\{senderName\}\}/g, SENDER.name)
    .replace(/\{\{senderTitle\}\}/g, SENDER.title)
    .replace(/\{\{senderPhone\}\}/g, SENDER.phone);
}

interface EmailToSend {
  label: string;
  subject: string;
  body: string;
  tier: string;
  step: number;
  variant: "A" | "B";
}

function buildEmailList(): EmailToSend[] {
  const emails: EmailToSend[] = [];

  // Step 0 - Variant A (Velocity tier sample)
  emails.push({
    label: "Step 0 - Subject A (Velocity)",
    subject: replaceVars(templates.subjects.step0.A, SAMPLE_DATA.velocity),
    body: replaceVars(templates.bodies.step0, SAMPLE_DATA.velocity),
    tier: "velocity",
    step: 0,
    variant: "A",
  });

  // Step 0 - Variant B (Compliance tier sample)
  emails.push({
    label: "Step 0 - Subject B (Compliance)",
    subject: replaceVars(templates.subjects.step0.B, SAMPLE_DATA.compliance),
    body: replaceVars(templates.bodies.step0, SAMPLE_DATA.compliance),
    tier: "compliance",
    step: 0,
    variant: "B",
  });

  // Step 1 - Variant A
  emails.push({
    label: "Step 1 - Subject A (Velocity)",
    subject: replaceVars(templates.subjects.step1.A, SAMPLE_DATA.velocity),
    body: replaceVars(templates.bodies.step1, SAMPLE_DATA.velocity),
    tier: "velocity",
    step: 1,
    variant: "A",
  });

  // Step 1 - Variant B
  emails.push({
    label: "Step 1 - Subject B (Business)",
    subject: replaceVars(templates.subjects.step1.B, SAMPLE_DATA.business),
    body: replaceVars(templates.bodies.step1, SAMPLE_DATA.business),
    tier: "business",
    step: 1,
    variant: "B",
  });

  // Step 2 - All three tier variants
  emails.push({
    label: "Step 2 - Velocity Tier",
    subject: replaceVars(templates.subjects.step2.A, SAMPLE_DATA.velocity),
    body: replaceVars(templates.bodies.step2_velocity, SAMPLE_DATA.velocity),
    tier: "velocity",
    step: 2,
    variant: "A",
  });

  emails.push({
    label: "Step 2 - Compliance Tier",
    subject: replaceVars(templates.subjects.step2.B, SAMPLE_DATA.compliance),
    body: replaceVars(templates.bodies.step2_compliance, SAMPLE_DATA.compliance),
    tier: "compliance",
    step: 2,
    variant: "B",
  });

  emails.push({
    label: "Step 2 - Business Tier",
    subject: replaceVars(templates.subjects.step2.A, SAMPLE_DATA.business),
    body: replaceVars(templates.bodies.step2_business, SAMPLE_DATA.business),
    tier: "business",
    step: 2,
    variant: "A",
  });

  // Step 3 - Early adopter
  emails.push({
    label: "Step 3 - Subject A (Compliance)",
    subject: replaceVars(templates.subjects.step3.A, SAMPLE_DATA.compliance),
    body: replaceVars(templates.bodies.step3, SAMPLE_DATA.compliance),
    tier: "compliance",
    step: 3,
    variant: "A",
  });

  emails.push({
    label: "Step 3 - Subject B (Business)",
    subject: replaceVars(templates.subjects.step3.B, SAMPLE_DATA.business),
    body: replaceVars(templates.bodies.step3, SAMPLE_DATA.business),
    tier: "business",
    step: 3,
    variant: "B",
  });

  // Step 4 - Final touch
  emails.push({
    label: "Step 4 - Subject A (Velocity)",
    subject: replaceVars(templates.subjects.step4.A, SAMPLE_DATA.velocity),
    body: replaceVars(templates.bodies.step4, SAMPLE_DATA.velocity),
    tier: "velocity",
    step: 4,
    variant: "A",
  });

  emails.push({
    label: "Step 4 - Subject B (Compliance)",
    subject: replaceVars(templates.subjects.step4.B, SAMPLE_DATA.compliance),
    body: replaceVars(templates.bodies.step4, SAMPLE_DATA.compliance),
    tier: "compliance",
    step: 4,
    variant: "B",
  });

  return emails;
}

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error("Error: RESEND_API_KEY not set in .env.local");
    process.exit(1);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const emails = buildEmailList();

  console.log("=".repeat(50));
  console.log("SENDING TEST EMAILS");
  console.log("=".repeat(50));
  console.log(`\nRecipients: ${TEST_EMAILS.join(", ")}`);
  console.log(`Total emails to send: ${emails.length} templates x ${TEST_EMAILS.length} recipients = ${emails.length * TEST_EMAILS.length} emails\n`);

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    for (const recipient of TEST_EMAILS) {
      try {
        // Add [TEST] prefix to subject so it's clear these are test emails
        const testSubject = `[TEST ${email.label}] ${email.subject}`;

        const { error } = await resend.emails.send({
          from: "Jayson <jayson@risksure.ai>",
          to: recipient,
          subject: testSubject,
          text: email.body,
          tags: [
            { name: "test", value: "true" },
            { name: "tier", value: email.tier },
            { name: "step", value: String(email.step) },
            { name: "variant", value: email.variant },
          ],
        });

        if (error) {
          console.error(`✗ Failed: ${email.label} → ${recipient}: ${error.message}`);
          failed++;
        } else {
          console.log(`✓ Sent: ${email.label} → ${recipient}`);
          sent++;
        }

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error(`✗ Error: ${email.label} → ${recipient}: ${err}`);
        failed++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`COMPLETE: ${sent} sent, ${failed} failed`);
  console.log("=".repeat(50));
  console.log("\nCheck your inboxes:");
  TEST_EMAILS.forEach((e) => console.log(`  - ${e}`));
  console.log("\nLook for emails with [TEST Step X - ...] prefix in subject line.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
