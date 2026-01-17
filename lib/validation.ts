export interface ValidationResult {
  valid: boolean;
  result: "valid" | "invalid" | "risky" | "unknown";
  reason?: string;
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${process.env.ZEROBOUNCE_API_KEY}&email=${encodeURIComponent(email)}`
    );

    const data = await response.json();

    // ZeroBounce status codes:
    // valid, invalid, catch-all, unknown, spamtrap, abuse, do_not_mail

    if (data.status === "valid") {
      return { valid: true, result: "valid" };
    }

    if (
      data.status === "invalid" ||
      data.status === "spamtrap" ||
      data.status === "abuse"
    ) {
      return { valid: false, result: "invalid", reason: data.status };
    }

    if (data.status === "catch-all" || data.status === "unknown") {
      return { valid: true, result: "risky", reason: data.status };
    }

    if (data.status === "do_not_mail") {
      return { valid: false, result: "invalid", reason: "do_not_mail" };
    }

    return { valid: false, result: "unknown", reason: data.status };
  } catch (error) {
    console.error("Email validation failed:", error);
    return { valid: false, result: "unknown", reason: "api_error" };
  }
}

export async function validateEmailBatch(
  emails: string[]
): Promise<Map<string, ValidationResult>> {
  const results = new Map<string, ValidationResult>();

  for (const email of emails) {
    const result = await validateEmail(email);
    results.set(email, result);

    // Rate limit: 1 request per 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return results;
}
