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

async function retry() {
  console.log("Waiting 3 seconds before retry...");
  await new Promise(r => setTimeout(r, 3000));

  console.log("Calling pipeline...");
  const response = await fetch(
    "https://risksure-sales.vercel.app/api/cron/daily-pipeline",
    {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    }
  );

  const result = await response.json();
  console.log("Result:", JSON.stringify(result, null, 2));
}

retry().catch(console.error);
