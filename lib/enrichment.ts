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

Research findings:
${JSON.stringify(research, null, 2)}

Product: RiskSure.AI - automates Certificate of Currency verification for Australian construction companies.
- AI verifies insurance certificates in 30 seconds (not 3-5 days of chasing)
- FREE for subcontractors (unlike Cm3 which charges $400-$3,000/year)
- Audit-ready compliance trail for WorkSafe

Value prop for ${tier} tier: ${tierValueProps[tier]}

Write ONLY a 1-2 sentence opener that:
1. References something specific about their company (project, growth, location)
2. Connects to a compliance or subcontractor management pain point
3. Feels personal and relevant - like you actually researched them

Do NOT mention RiskSure or the product yet. Just the hook.
Keep it under 50 words. No greeting, no sign-off.
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
