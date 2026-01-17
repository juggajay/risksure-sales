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

async function checkBrookfield() {
  const messageId = "afaf85db-02d9-4afc-9a08-3a2dbb177c8a";

  console.log("Checking Brookfield email status...\n");

  const response = await fetch("https://api.resend.com/emails/" + messageId, {
    headers: {
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Subject:", data.subject);
    console.log("To:", data.to);
    console.log("Status:", data.last_event);
    console.log("Created:", data.created_at);
    console.log("\nThis email should be PLAIN TEXT and land in PRIMARY");
  } else {
    console.log("Failed to fetch:", response.status);
  }
}

checkBrookfield().catch(console.error);
