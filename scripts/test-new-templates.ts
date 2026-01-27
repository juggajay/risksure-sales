import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

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

const resend = new Resend(process.env.RESEND_API_KEY);

// Test recipients
const testRecipients = [
  { email: "jaysonryan21@hotmail.com", name: "Jayson (Hotmail)" },
  { email: "jaysonryan2107@gmail.com", name: "Jayson (Gmail)" },
  { email: "jayson@ryoxcarpentry.com", name: "Jayson (Ryox)" },
];

// Template variables for test
const templateVars = {
  contactName: "Jayson",
  companyName: "Ryox Carpentry",
  personalizedOpener: "Saw Ryox just landed the fit-out for the new medical centre in Penrith - nice win.",
  estimatedSubbies: "45",
  state: "NSW",
  senderName: "Jayson",
  senderTitle: "Founder",
  senderPhone: "0412 345 678",
  calendlyUrl: "https://calendly.com/jaysonryan2107",
  demoVideoUrl: "https://risksure.ai/demo",
  unsubscribeUrl: "https://sales.risksure.ai/unsubscribe/test-token",
};

function loadTemplate(step: number, filename: string): string {
  const filePath = join(process.cwd(), "templates", `step-${step}`, filename);
  return readFileSync(filePath, "utf-8");
}

function replaceVariables(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

async function sendTestEmail(
  to: string,
  subject: string,
  body: string,
  step: number,
  variant: string
): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Jayson <jayson@risksure.ai>",
      to,
      subject,
      text: body,
      tags: [
        { name: "test", value: "true" },
        { name: "step", value: String(step) },
        { name: "variant", value: variant },
      ],
    });

    if (error) {
      console.error(`  ❌ Failed: ${error.message}`);
    } else {
      console.log(`  ✅ Sent! Message ID: ${data?.id}`);
    }
  } catch (err) {
    console.error(`  ❌ Error:`, err);
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("RiskSure Email Template Test - New Plain Text Templates");
  console.log("=".repeat(60));
  console.log();

  // Test all 5 steps
  for (let step = 0; step <= 4; step++) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`STEP ${step}`);
    console.log(`${"─".repeat(60)}`);

    // Load subject lines
    const subjectA = loadTemplate(step, "subject-a.txt");
    const subjectB = loadTemplate(step, "subject-b.txt");

    // Load body - Step 2 has tier-specific bodies
    let bodyFile = "body.txt";
    if (step === 2) {
      bodyFile = "body-velocity.txt"; // Use velocity tier for test (Ryox is small)
    }
    const body = loadTemplate(step, bodyFile);

    // Replace variables
    const processedSubjectA = replaceVariables(subjectA, templateVars);
    const processedSubjectB = replaceVariables(subjectB, templateVars);
    const processedBody = replaceVariables(body, templateVars);

    console.log(`\nSubject A: "${processedSubjectA}"`);
    console.log(`Subject B: "${processedSubjectB}"`);
    console.log(`\nBody preview (first 100 chars):`);
    console.log(`"${processedBody.substring(0, 100)}..."`);

    // Send to each recipient - alternate variants
    for (let i = 0; i < testRecipients.length; i++) {
      const recipient = testRecipients[i];
      const variant = i % 2 === 0 ? "A" : "B";
      const subject = variant === "A" ? processedSubjectA : processedSubjectB;

      console.log(`\nSending Step ${step} Variant ${variant} to ${recipient.name}...`);
      await sendTestEmail(recipient.email, subject, processedBody, step, variant);

      // Small delay between sends
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("TEST COMPLETE");
  console.log("=".repeat(60));
  console.log("\nCheck all 3 inboxes for the test emails:");
  console.log("- jaysonryan21@hotmail.com (Hotmail/Outlook)");
  console.log("- jaysonryan2107@gmail.com (Gmail)");
  console.log("- jayson@ryoxcarpentry.com (Custom domain)");
  console.log("\nEach inbox should have 5 emails (Step 0-4)");
  console.log("Variant A sent to: Hotmail, Ryox");
  console.log("Variant B sent to: Gmail");
}

runTests().catch(console.error);
