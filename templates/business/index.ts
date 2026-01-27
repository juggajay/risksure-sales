import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

// Pure plain text for Step 0 (Gmail Primary inbox - NO HTML AT ALL)
// Optimized per email-deliverability-guide.md: 50-100 words, social proof, soft opt-out
export function businessStep0APlainText(params: TemplateParams): string {
  return `Hi ${params.contactName},

${params.personalizedOpener}

We help builders like ${params.companyName} get audit-ready in days, not weeks. One client cut their compliance admin by 10 hours a week.

Worth a quick chat about how this could work for your projects?

Jayson
Head of Growth | RiskSure.AI
0412 345 678

If this isn't relevant for ${params.companyName}, just let me know.`;
}

export function businessStep0BPlainText(params: TemplateParams): string {
  return `Hi ${params.contactName},

${params.personalizedOpener}

Quick question: if WorkSafe walked in tomorrow, could you show them which subbies have valid insurance across every project?

Most builders we talk to can't - the data's scattered across spreadsheets and emails. We built RiskSure to fix that.

Is this a problem you're dealing with?

Jayson
Head of Growth | RiskSure.AI
0412 345 678

If this isn't relevant for ${params.companyName}, just let me know.`;
}

export const businessSequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Portfolio compliance risk at {{company}}",
    subjectB: "Audit question for {{company}}",
  },
  {
    step: 1,
    delayDays: 4,
    subjectA: "Re: Portfolio compliance",
    subjectB: "Re: Executive visibility",
  },
  {
    step: 2,
    delayDays: 8,
    subjectA: "WorkSafe audit readiness for {{company}}",
    subjectB: "Industrial manslaughter compliance trail",
  },
  {
    step: 3,
    delayDays: 12,
    subjectA: "ROI analysis for {{company}}",
    subjectB: "Cost of manual compliance at scale",
  },
  {
    step: 4,
    delayDays: 18,
    subjectA: "Leadership discussion?",
    subjectB: "Closing the loop",
  },
];

export function businessStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>At ${params.companyName}'s scale, subcontractor compliance isn't just an admin task—it's enterprise risk.</p>
    <p>One uninsured subbie incident across your portfolio could mean millions in exposure. And with industrial manslaughter laws, it's not just the company at risk.</p>
    <p>We built RiskSure for enterprise operations: portfolio-wide compliance visibility, executive dashboards, and an audit trail that stands up to scrutiny.</p>
    <p>Worth a conversation with your leadership team?</p>
    <p>Jayson<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Quick question: If WorkSafe walked into ${params.companyName} tomorrow, could you show them exactly which subbies have valid insurance across every project?</p>
    <p>Most enterprise builders we talk to can't. The data exists—scattered across spreadsheets, Cm3, email threads—but pulling it together for an audit is a nightmare.</p>
    <p>That's the gap we built RiskSure to close. Not another system to manage, but a single answer when someone asks "are we covered?"</p>
    <p>Is this a problem you're dealing with?</p>
    <p>Jayson<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on portfolio compliance visibility.</p>
    <p>One thing I should mention: we offer dedicated onboarding for enterprise accounts. Your team won't be left figuring things out alone.</p>
    <p>Worth a quick call?</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back on executive dashboards.</p>
    <p>Imagine your Monday morning: CEO asks "where are we on subbie compliance?" You pull up a single dashboard, filter by project, drill down to problem subbies.</p>
    <p>That's what we built.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Something enterprise clients prioritize: WorkSafe audit readiness.</p>
    <p>RiskSure creates a timestamped audit trail for every certificate verification:</p>
    <ul>
      <li>When was each certificate uploaded?</li>
      <li>What checks were performed?</li>
      <li>What was the AI confidence score?</li>
      <li>Who approved it (or flagged it)?</li>
    </ul>
    <p>If WorkSafe walks in tomorrow, you hand them a system, not a scramble.</p>
    <p><a href="${params.calendlyUrl}">Worth discussing?</a></p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>The industrial manslaughter laws changed the game for enterprise builders.</p>
    <p>It's not enough to have insurance—you need to prove you verified it. Prove you had a system. Prove due diligence.</p>
    <p>RiskSure gives you that paper trail. Every certificate, every check, timestamped and defensible.</p>
    <p>This is the kind of conversation worth having before an incident, not after.</p>
    <p><a href="${params.calendlyUrl}">Got 30 minutes?</a></p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I ran some numbers for an operation your size:</p>
    <p>Assuming 300+ subbies, 4 certificates each, 30 minutes manual verification time:</p>
    <p><strong>Manual cost: ~$60,000/year in admin time alone.</strong></p>
    <p>RiskSure Business tier: $14,990/year. That's 75% savings, plus the audit trail, plus the peace of mind.</p>
    <p>Happy to walk through the ROI for ${params.companyName} specifically.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Quick math on manual compliance at enterprise scale:</p>
    <ul>
      <li>300 subbies × 4 certs × 30 min = 600 hours/year</li>
      <li>At $50/hour = $30,000 in direct labor</li>
      <li>Add chasing, follow-ups, exceptions = $60,000+</li>
    </ul>
    <p>RiskSure does it in 30 seconds per certificate. The math speaks for itself.</p>
    <p>Worth a CFO-level conversation?</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep4A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Last note from me on enterprise compliance.</p>
    <p>If this isn't a priority for ${params.companyName} right now, I understand. Enterprise decisions take time.</p>
    <p>But if you're ever evaluating compliance systems—or prepping for a major audit—I'd welcome the conversation.</p>
    <p><a href="${params.calendlyUrl}">Door's always open.</a></p>
    <p>All the best.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function businessStep4B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop on my emails about portfolio compliance.</p>
    <p>If the timing's not right, no problem. But one thing to file away: we offer quarterly business reviews for enterprise accounts—dedicated check-ins to optimize your compliance process.</p>
    <p>That's the kind of partnership we're building.</p>
    <p>Whenever you're ready.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function getBusinessTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": businessStep0A,
    "0B": businessStep0B,
    "1A": businessStep1A,
    "1B": businessStep1B,
    "2A": businessStep2A,
    "2B": businessStep2B,
    "3A": businessStep3A,
    "3B": businessStep3B,
    "4A": businessStep4A,
    "4B": businessStep4B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: business step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getBusinessSubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = businessSequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: business step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}

// Get pure plain text template for Step 0 (Gmail Primary inbox)
export function getBusinessPlainText(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string | null {
  // Only Step 0 has plain text versions
  if (step !== 0) return null;

  if (variant === "A") {
    return businessStep0APlainText(params);
  } else {
    return businessStep0BPlainText(params);
  }
}
