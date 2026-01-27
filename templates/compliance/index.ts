import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

export const complianceSequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Scaling {{company}}'s compliance process",
    subjectB: "Your subbies hate Cm3 fees. What if it was free?",
  },
  {
    step: 1,
    delayDays: 3,
    subjectA: "Re: Scaling compliance",
    subjectB: "Re: Free for subbies",
  },
  {
    step: 2,
    delayDays: 7,
    subjectA: "Multi-project compliance visibility",
    subjectB: "Morning briefings on compliance gaps",
  },
  {
    step: 3,
    delayDays: 10,
    subjectA: "Procore integration for {{company}}",
    subjectB: "Procore + automated compliance",
  },
  {
    step: 4,
    delayDays: 14,
    subjectA: "Final follow-up",
    subjectB: "Closing the loop",
  },
];

export function complianceStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>At your scale, manually tracking subbie insurance across multiple projects becomes a full-time job. And when something slips through, it's your neck on the line.</p>
    <p>We built RiskSure for exactly this: AI that verifies certificates in 30 seconds, tracks expiries across your entire portfolio, and sends you a morning brief on who's compliant and who's not.</p>
    <p>Green light, red light. No spreadsheets.</p>
    <p>Worth 20 minutes to see how it works for multi-project operations?</p>
    <p>Jayson<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Quick question: what's your subbie adoption rate on Cm3?</p>
    <p>We keep hearing it's under 50% because subbies don't want to pay $400-$3,000/year. So you're still chasing certificates manually anyway.</p>
    <p>RiskSure is free for subbies—literally $0 forever. They get a magic link, upload in 60 seconds, done. No account creation, no fees.</p>
    <p>That's how we get 90%+ adoption.</p>
    <p>Happy to show you how it works.</p>
    <p>Jayson<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on multi-project compliance.</p>
    <p>One thing I forgot to mention: we integrate with Procore. Bi-directional sync—subbie data flows both ways, no double entry.</p>
    <p>Worth a quick chat?</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back on the subbie adoption question.</p>
    <p>If Cm3 is working great for you, ignore me. But if adoption is a headache, might be worth 15 minutes to see how we solved it.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Something our compliance-tier customers love: the morning brief.</p>
    <p>Every day at 7am, you get a dashboard showing:</p>
    <ul>
      <li>Which subbies have expiring certificates this week</li>
      <li>Which projects have compliance gaps</li>
      <li>Who's at stop-work risk</li>
    </ul>
    <p>It's like having a compliance officer who never sleeps.</p>
    <p><a href="${params.calendlyUrl}">Grab 20 mins here</a> if you want to see it in action.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Imagine this: 7am Monday, coffee in hand, you open your email.</p>
    <p>"${params.companyName} Compliance Brief: 3 subbies with expiring WorkCover this week. 1 stop-work risk at [Project Name]."</p>
    <p>That's RiskSure. You know exactly what needs attention before your feet hit the site.</p>
    <p><a href="${params.calendlyUrl}">Quick demo?</a></p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Last thing I wanted to mention: Procore integration.</p>
    <p>If you're using Procore for project management, RiskSure syncs directly. Subbie compliance data flows both ways—no copy-pasting, no double entry.</p>
    <p>Your project managers see compliance status right in Procore.</p>
    <p>Worth discussing?</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>One more thing on the Procore front:</p>
    <p>We built bi-directional sync specifically for companies your size. Pull subbies from Procore, push compliance status back. Your PMs see green/red lights without leaving their workflow.</p>
    <p><a href="${params.calendlyUrl}">15 mins to see it?</a></p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep4A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>This is my last email on compliance automation.</p>
    <p>If it's not a priority for ${params.companyName} right now, I get it. But the offer stands: 14-day free trial, full Compliance tier features, no credit card.</p>
    <p><a href="${params.calendlyUrl}">Calendar link here</a> if timing ever works out.</p>
    <p>All the best.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function complianceStep4B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop—last note from me.</p>
    <p>If you're ever prepping for a WorkSafe audit or drowning in subbie compliance, we're here. Founder's special still applies: FOUNDER50 for 50% off.</p>
    <p>Good luck with the projects.</p>
    <p>Jayson</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function getComplianceTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": complianceStep0A,
    "0B": complianceStep0B,
    "1A": complianceStep1A,
    "1B": complianceStep1B,
    "2A": complianceStep2A,
    "2B": complianceStep2B,
    "3A": complianceStep3A,
    "3B": complianceStep3B,
    "4A": complianceStep4A,
    "4B": complianceStep4B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: compliance step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getComplianceSubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = complianceSequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: compliance step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}
