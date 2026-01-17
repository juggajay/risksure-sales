import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

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

  // Map common header variations
  const headerMap: Record<string, string> = {
    company: "companyName",
    "company name": "companyName",
    company_name: "companyName",
    name: "contactName",
    "contact name": "contactName",
    contact_name: "contactName",
    email: "contactEmail",
    "contact email": "contactEmail",
    contact_email: "contactEmail",
    website: "website",
    url: "website",
    title: "contactTitle",
    "job title": "contactTitle",
    contact_title: "contactTitle",
    state: "state",
    location: "state",
    subbies: "estimatedSubbies",
    subcontractors: "estimatedSubbies",
    estimated_subbies: "estimatedSubbies",
  };

  const leads: CSVLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

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

    // Validate required fields
    if (lead.companyName && lead.contactName && lead.contactEmail) {
      leads.push(lead as unknown as CSVLead);
    }
  }

  return leads;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const csvText = await file.text();
    const leads = parseCSV(csvText);

    if (leads.length === 0) {
      return NextResponse.json(
        { error: "No valid leads found in CSV" },
        { status: 400 }
      );
    }

    // Bulk create leads
    const result = await convex.mutation(api.leads.bulkCreate, {
      leads: leads.map((lead) => ({
        companyName: lead.companyName,
        contactName: lead.contactName,
        contactEmail: lead.contactEmail,
        website: lead.website,
        contactTitle: lead.contactTitle,
        state: lead.state,
        source: "csv_import",
        estimatedSubbies: lead.estimatedSubbies,
      })),
    });

    // Update metrics
    await convex.mutation(api.metrics.increment, {
      metric: "leadsImported",
      amount: result.created,
    });

    return NextResponse.json({
      success: true,
      ...result,
      total: leads.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("CSV import error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
