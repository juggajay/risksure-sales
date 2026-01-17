import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { readFileSync } from "fs";

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

async function check() {
  const events = await convex.query(api.emailEvents.getRecent, { limit: 2 });

  for (const e of events) {
    const resp = await fetch("https://api.resend.com/emails/" + e.resendMessageId, {
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY }
    });
    const data = await resp.json();
    console.log(data.subject);
    console.log("  To:", data.to[0]);
    console.log("  Status:", data.last_event);
    console.log("");
  }
}

check().catch(console.error);
