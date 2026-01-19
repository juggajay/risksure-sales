/**
 * Setup Calendly Webhook
 *
 * This script creates a webhook subscription in Calendly to receive
 * notifications when demos are scheduled or canceled.
 *
 * Prerequisites:
 * 1. Set CALENDLY_API_TOKEN in .env.local (from Calendly API tokens page)
 * 2. Set NEXT_PUBLIC_APP_URL in .env.local (your production URL)
 *
 * Usage:
 *   npx tsx scripts/setup-calendly-webhook.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sales.risksure.ai";

if (!CALENDLY_API_TOKEN) {
  console.error("Error: CALENDLY_API_TOKEN is not set in .env.local");
  console.error("Get your token from: https://calendly.com/integrations/api_webhooks");
  process.exit(1);
}

const CALENDLY_API_BASE = "https://api.calendly.com";

async function calendlyFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${CALENDLY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${CALENDLY_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Calendly API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function getCurrentUser() {
  const data = await calendlyFetch("/users/me");
  return data.resource;
}

async function listWebhooks(organizationUri: string) {
  const params = new URLSearchParams({
    organization: organizationUri,
    scope: "organization",
  });
  const data = await calendlyFetch(`/webhook_subscriptions?${params}`);
  return data.collection;
}

async function createWebhook(organizationUri: string, callbackUrl: string) {
  const data = await calendlyFetch("/webhook_subscriptions", {
    method: "POST",
    body: JSON.stringify({
      url: callbackUrl,
      events: ["invitee.created", "invitee.canceled"],
      organization: organizationUri,
      scope: "organization",
    }),
  });
  return data.resource;
}

async function getWebhook(webhookUri: string) {
  const uuid = webhookUri.split("/").pop();
  const data = await calendlyFetch(`/webhook_subscriptions/${uuid}`);
  return data.resource;
}

async function deleteWebhook(webhookUri: string) {
  const uuid = webhookUri.split("/").pop();
  await fetch(`${CALENDLY_API_BASE}/webhook_subscriptions/${uuid}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${CALENDLY_API_TOKEN}`,
    },
  });
}

async function main() {
  console.log("Setting up Calendly webhook...\n");

  // Get current user and organization
  console.log("1. Fetching current user...");
  const user = await getCurrentUser();
  console.log(`   User: ${user.name} (${user.email})`);
  console.log(`   Organization: ${user.current_organization}`);

  const organizationUri = user.current_organization;
  const callbackUrl = `${APP_URL}/api/webhooks/calendly`;

  // Check for existing webhooks
  console.log("\n2. Checking existing webhooks...");
  const existingWebhooks = await listWebhooks(organizationUri);

  const existingCallback = existingWebhooks.find(
    (w: any) => w.callback_url === callbackUrl
  );

  if (existingCallback) {
    console.log(`   Found existing webhook for ${callbackUrl}`);
    console.log("   Deleting old webhook to create fresh one...");
    await deleteWebhook(existingCallback.uri);
    console.log("   Deleted.");
  } else {
    console.log(`   No existing webhook found for ${callbackUrl}`);
  }

  // Create new webhook
  console.log("\n3. Creating webhook subscription...");
  const webhook = await createWebhook(organizationUri, callbackUrl);

  // Fetch webhook details to get signing key
  console.log("   Fetching webhook details...");
  const webhookDetails = await getWebhook(webhook.uri);

  console.log("\n========================================");
  console.log("WEBHOOK CREATED SUCCESSFULLY!");
  console.log("========================================\n");
  console.log(`Callback URL: ${webhookDetails.callback_url}`);
  console.log(`Events: ${webhookDetails.events.join(", ")}`);
  console.log(`Scope: ${webhookDetails.scope}`);
  console.log(`State: ${webhookDetails.state}`);

  if (webhookDetails.signing_key) {
    console.log(`\nSigning Key: ${webhookDetails.signing_key}`);
    console.log("\n========================================");
    console.log("IMPORTANT: Add this to your .env.local:");
    console.log("========================================\n");
    console.log(`CALENDLY_WEBHOOK_SECRET=${webhookDetails.signing_key}`);
  } else {
    console.log("\nNOTE: Calendly did not return a signing key.");
    console.log("Webhook signature verification will be skipped in dev mode.");
    console.log("For production, check your Calendly webhook settings.");
  }
  console.log("\n");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
