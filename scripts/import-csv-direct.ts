import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface CSVLead {
  companyName: string;
  contactName: string;
  contactEmail: string;
  website?: string;
  contactTitle?: string;
  state?: string;
  estimatedSubbies?: number;
}

function parseCSV(csvText: string): CSVLead[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const headerMap: Record<string, string> = {
    "company name": "companyName",
    "contact name": "contactName",
    "contact email": "contactEmail",
    website: "website",
    "job title": "contactTitle",
    state: "state",
    subbies: "estimatedSubbies",
  };

  const leads: CSVLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

    const lead: Record<string, string | number | undefined> = {};

    headers.forEach((header, index) => {
      const mappedKey = headerMap[header] || header;
      if (values[index]) {
        if (mappedKey === "estimatedSubbies") {
          lead[mappedKey] = parseInt(values[index]) || undefined;
        } else {
          lead[mappedKey] = values[index];
        }
      }
    });

    if (lead.companyName && lead.contactName && lead.contactEmail) {
      leads.push(lead as unknown as CSVLead);
    }
  }

  return leads;
}

async function main() {
  const csvPath = path.join(__dirname, "leads-priority-1-compliance.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const leads = parseCSV(csvText);

  console.log(`Parsed ${leads.length} leads from CSV`);

  const result = await convex.mutation(api.leads.bulkCreate, {
    leads: leads.map((lead) => ({
      companyName: lead.companyName,
      contactName: lead.contactName,
      contactEmail: lead.contactEmail,
      website: lead.website,
      contactTitle: lead.contactTitle,
      state: lead.state,
      source: "csv_import" as const,
      estimatedSubbies: lead.estimatedSubbies,
    })),
  });

  console.log(`Imported: ${result.created} leads`);
  if (result.duplicates > 0) {
    console.log(`Skipped (duplicates): ${result.duplicates}`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
