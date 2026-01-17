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
  const lead = await convex.query(api.leads.getByEmail, { email: "jaysonryan21@hotmail.com" });
  if (lead) {
    console.log("Company:", lead.companyName);
    console.log("Status:", lead.status);
    console.log("Step:", lead.currentSequenceStep);
    console.log("Last Email:", lead.lastEmailSentAt ? new Date(lead.lastEmailSentAt).toISOString() : "Never");
  } else {
    console.log("Lead not found");
  }
}

check().catch(console.error);
