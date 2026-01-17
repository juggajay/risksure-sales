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

async function checkResendStatus() {
  const messageIds = [
    "e5aa2dca-36a5-485e-8379-b6f63afcffe4", // Lendlease - Audit question
    "57f533b9-14f0-49d5-b52a-c154082ee370", // Executive visibility
    "49c4c978-d9b8-46bc-904c-cf5e07ec80f1", // Built Pty Ltd
  ];

  console.log("Checking Resend delivery status...\n");

  for (const id of messageIds) {
    try {
      const response = await fetch("https://api.resend.com/emails/" + id, {
        headers: {
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Email:", data.subject);
        console.log("  To:", data.to);
        console.log("  Status:", data.last_event);
        console.log("  Created:", data.created_at);
        console.log("");
      } else {
        console.log("Failed to fetch", id, ":", response.status);
      }
    } catch (err) {
      console.log("Error fetching", id, ":", err);
    }
  }
}

checkResendStatus().catch(console.error);
