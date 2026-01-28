import { scrapeUrl, searchWeb } from "./jina";
import { generateStructured } from "./gemini";

export interface EnrichmentResult {
  success: boolean;
  enrichmentData?: {
    companySummary: string;
    estimatedProjects: number;
    estimatedSubcontractors: number;
    estimatedRevenue: string;
    complianceMaturity: "none" | "basic" | "advanced";
    painPointSignals: string[];
    decisionMakers: string[];
    recentNews: string[];
    confidence: "low" | "medium" | "high";
  };
  enrichmentScore?: number;
  tier?: "velocity" | "compliance" | "business";
  estimatedSubbies?: number;
  estimatedRevenue?: string;
  personalizedOpener?: string;
  painPoints?: string[];
  error?: string;
}

interface ResearchOutput {
  companySummary: string;
  estimatedProjects: number;
  estimatedSubcontractors: number;
  estimatedRevenue: string;
  complianceMaturity: "none" | "basic" | "advanced";
  painPointSignals: string[];
  decisionMakers: string[];
  recentNews: string[];
  confidence: "low" | "medium" | "high";
}

export async function enrichLead(lead: {
  companyName: string;
  website?: string;
  contactName: string;
  contactTitle?: string;
  state?: string;
}): Promise<EnrichmentResult> {
  try {
    // Step 1: Scrape company website (graceful failure)
    let websiteContent = "";
    if (lead.website) {
      websiteContent = await scrapeUrl(lead.website);
    }

    // Step 2: Search for company info (graceful failure)
    const searchResults = await searchWeb(
      `${lead.companyName} construction ${lead.state || "Australia"} projects subcontractors`
    );

    // Step 3: Research with Gemini
    const research = await generateStructured<ResearchOutput>(
      `
You are researching an Australian construction company for sales outreach.

Company: ${lead.companyName}
Website: ${lead.website || "Unknown"}
State: ${lead.state || "Unknown"}

Website Content:
${websiteContent.slice(0, 15000) || "Not available"}

Search Results:
${searchResults.slice(0, 10000) || "Not available"}

Analyze this information and estimate:
1. Company summary (1-2 sentences)
2. Number of active projects
3. Number of subcontractors they likely work with
4. Estimated annual revenue bracket
5. Their compliance maturity level (none/basic/advanced)
6. Pain points related to subcontractor management and insurance compliance
7. Key decision makers
8. Recent news or notable projects

Revenue brackets: "$5M-$20M", "$20M-$100M", "$100M+"
Subcontractor estimates: Use company size, project count, and industry norms.

If information is limited, make reasonable estimates based on company type and mark confidence as "low".
`,
      `{
  "companySummary": "string",
  "estimatedProjects": "number",
  "estimatedSubcontractors": "number",
  "estimatedRevenue": "string (one of: $5M-$20M, $20M-$100M, $100M+)",
  "complianceMaturity": "none | basic | advanced",
  "painPointSignals": ["string array - specific pain points"],
  "decisionMakers": ["string array"],
  "recentNews": ["string array"],
  "confidence": "low | medium | high"
}`
    );

    // Step 4: Qualify into tier
    const estimatedSubbies = research.estimatedSubcontractors || 50;

    let tier: "velocity" | "compliance" | "business" = "velocity";
    if (estimatedSubbies > 250 || research.estimatedRevenue === "$100M+") {
      tier = "business";
    } else if (estimatedSubbies > 75 || research.estimatedRevenue === "$20M-$100M") {
      tier = "compliance";
    }

    // Step 5: Calculate enrichment score
    let score = 0;

    // Subbie count score
    if (estimatedSubbies >= 20 && estimatedSubbies <= 500) score += 30;
    else if (estimatedSubbies > 0) score += 15;

    // Pain point signals
    score += Math.min((research.painPointSignals?.length || 0) * 10, 30);

    // Compliance maturity (lower = better prospect)
    if (research.complianceMaturity === "none") score += 20;
    else if (research.complianceMaturity === "basic") score += 10;

    // Decision makers identified
    if (research.decisionMakers?.length > 0) score += 20;

    // Step 6: Generate personalized opener
    const tierValueProps = {
      velocity: "save hours every week on manual certificate checking",
      compliance: "scale your compliance process without adding headcount",
      business: "get portfolio-wide visibility and executive compliance reporting",
    };

    const openerResult = await generateStructured<{ opener: string }>(
      `
Write a personalized email opener for cold outreach to:

Contact: ${lead.contactName}${lead.contactTitle ? `, ${lead.contactTitle}` : ""}
Company: ${lead.companyName}
State: ${lead.state || "Unknown"}

Research findings:
${JSON.stringify(research, null, 2)}

CRITICAL RULES:
- ONLY reference facts that appear in the research findings above (website content or search results).
- DO NOT invent, assume, or fabricate any projects, wins, news, or events.
- DO NOT flatter, compliment, or suck up. No "speaks volumes about your values", no "impressive growth", no "nice win". Keep it matter-of-fact.
- The opener should simply show you understand their business and connect it to the problem of managing subcontractor compliance.
- If the research contains specific details (project types, locations, scale), use those to frame the compliance challenge.
- If the research has NO specific details, fall back to a straightforward opener about their sector and scale. Examples:
  - "Running ${research.estimatedSubcontractors || "a team of"} subbies across ${lead.state || "multiple"} projects means a lot of certificates to keep on top of."
  - "Managing subcontractor compliance across multiple projects is one of those jobs that never gets easier at scale."
- NEVER start with something like "Saw you just won..." or "Noticed your new project..." unless that information is explicitly in the research findings.

Write ONLY 1-2 sentences. Be direct and matter-of-fact — like a peer, not a salesperson.
Do NOT mention RiskSure or the product. No greeting, no sign-off.
Do NOT start with the contact's name — the email template already has "Hi {{contactName}}," before this opener.
Keep it under 40 words.
`,
      `{ "opener": "string" }`
    );

    return {
      success: true,
      enrichmentData: research,
      enrichmentScore: score,
      tier,
      estimatedSubbies,
      estimatedRevenue: research.estimatedRevenue,
      personalizedOpener: openerResult.opener,
      painPoints: research.painPointSignals,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Enrichment failed for ${lead.companyName}:`, error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
