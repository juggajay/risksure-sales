import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

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

    const tags = [
      { name: "lead_id", value: params.leadId },
      { name: "sequence_step", value: String(params.sequenceStep) },
      { name: "variant", value: params.variant },
      { name: "tier", value: params.tier },
    ];

    // Use text if provided (better deliverability), otherwise HTML
    const { data, error } = params.text
      ? await resend.emails.send({
          from: "Jason <jason@risksure.ai>",
          to: params.to,
          subject: params.subject,
          text: params.text,
          tags,
        })
      : await resend.emails.send({
          from: "Jason <jason@risksure.ai>",
          to: params.to,
          subject: params.subject,
          html: params.html!,
          tags,
        });

    if (error) {
      return { success: false, error: error.message };
    }

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
