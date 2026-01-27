import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// ============================================
// MULTI-INBOX SENDER CONFIG
// ============================================

interface SenderConfig {
  name: string;
  email: string;
}

/**
 * Parse sender configs from environment.
 * Supports a single sender via SENDER_EMAIL / SENDER_NAME,
 * or multiple senders via SENDER_EMAILS (comma-separated)
 * and SENDER_NAMES (comma-separated).
 *
 * Examples:
 *   SENDER_EMAIL=jayson@risksure.ai  SENDER_NAME=Jayson
 *   SENDER_EMAILS=jayson@risksure.ai,alex@risksure.ai  SENDER_NAMES=Jayson,Alex
 */
function getSenderConfigs(): SenderConfig[] {
  const emails = process.env.SENDER_EMAILS?.split(",").map((s) => s.trim());
  const names = process.env.SENDER_NAMES?.split(",").map((s) => s.trim());

  if (emails && emails.length > 0 && emails[0]) {
    return emails.map((email, i) => ({
      name: names?.[i] || process.env.SENDER_NAME || "Jayson",
      email,
    }));
  }

  // Fallback: single sender
  return [
    {
      name: process.env.SENDER_NAME || "Jayson",
      email: process.env.SENDER_EMAIL || "jayson@risksure.ai",
    },
  ];
}

// Track send counts per sender for round-robin rotation
const senderSendCounts = new Map<string, number>();

/**
 * Get the next sender using round-robin (fewest sends first).
 */
export function getNextSender(): SenderConfig {
  const configs = getSenderConfigs();
  if (configs.length === 1) return configs[0];

  // Initialize counts for any new senders
  for (const config of configs) {
    if (!senderSendCounts.has(config.email)) {
      senderSendCounts.set(config.email, 0);
    }
  }

  // Pick sender with fewest sends
  configs.sort(
    (a, b) =>
      (senderSendCounts.get(a.email) ?? 0) -
      (senderSendCounts.get(b.email) ?? 0)
  );

  return configs[0];
}

function recordSend(email: string): void {
  senderSendCounts.set(email, (senderSendCounts.get(email) ?? 0) + 1);
}

// ============================================
// EMAIL SENDING
// ============================================

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  leadId: string;
  sequenceStep: number;
  variant: "A" | "B";
  tier: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const resend = getResendClient();
    const sender = getNextSender();
    const from = `${sender.name} <${sender.email}>`;

    const tags = [
      { name: "lead_id", value: params.leadId },
      { name: "sequence_step", value: String(params.sequenceStep) },
      { name: "variant", value: params.variant },
      { name: "tier", value: params.tier },
    ];

    // Use plain text if provided (for Gmail Primary), otherwise HTML
    const { data, error } = params.text
      ? await resend.emails.send({
          from,
          to: params.to,
          subject: params.subject,
          text: params.text,
          tags,
        })
      : await resend.emails.send({
          from,
          to: params.to,
          subject: params.subject,
          html: params.html!,
          tags,
        });

    if (error) {
      return { success: false, error: error.message };
    }

    recordSend(sender.email);
    return { success: true, messageId: data?.id };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

export async function sendNotification(
  subject: string,
  message: string
): Promise<void> {
  if (!process.env.NOTIFICATION_EMAIL) return;

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: "RiskSure Alerts <alerts@risksure.ai>",
      to: process.env.NOTIFICATION_EMAIL,
      subject,
      text: message,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
