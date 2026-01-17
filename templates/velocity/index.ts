import { wrapEmail } from "../components/EmailWrapper";

interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
}

// ============================================
// SEQUENCE CONFIGURATION
// ============================================
export const velocitySequence = [
  {
    step: 0,
    delayDays: 0,
    subjectA: "Quick question about certificate compliance",
    subjectB: "Still chasing certificates from subbies?",
  },
  {
    step: 1,
    delayDays: 3,
    subjectA: "Re: Quick question",
    subjectB: "Re: Certificate compliance",
  },
  {
    step: 2,
    delayDays: 7,
    subjectA: "How {{company}} can save 10+ hours/week",
    subjectB: "What if WorkSafe audits tomorrow?",
  },
  {
    step: 3,
    delayDays: 14,
    subjectA: "Last note on compliance automation",
    subjectB: "Closing the loop",
  },
];

// ============================================
// STEP 0 - INITIAL OUTREACH
// ============================================
export function velocityStep0A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Most builders I talk to spend 5-10 hours a week chasing Certificates of Currency from subbies. And even then, there are usually gaps.</p>
    <p>We built an AI that reads certificates in 30 seconds and flags compliance issues automatically. No more spreadsheets, no more chasing.</p>
    <p>Worth a quick look?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep0B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>${params.personalizedOpener}</p>
    <p>Here's what keeps me up at night for builders: WorkSafe shows up, asks for your subbie compliance records, and you're digging through spreadsheets hoping nothing slipped through.</p>
    <p>We built RiskSure to fix that—AI verifies every certificate in 30 seconds, creates an audit trail, and alerts you to gaps before they become problems.</p>
    <p>Best part? It's free for your subbies, so they actually use it (unlike Cm3).</p>
    <p>Got 15 minutes this week?</p>
    <p>Jason<br/>RiskSure.AI</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 1 - FOLLOW UP
// ============================================
export function velocityStep1A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Following up on my note about certificate compliance.</p>
    <p>Quick question: How are you currently tracking subbie insurance? Spreadsheets? Cm3? Someone's inbox?</p>
    <p>Just curious what the process looks like at ${params.companyName}.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep1B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Circling back—did my last email about certificate verification land?</p>
    <p>One thing I should mention: if you're using Cm3, our customers typically see 2-3x better adoption because subbies don't have to pay anything.</p>
    <p>Happy to show you how it works in 15 minutes.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 2 - VALUE PROPOSITION
// ============================================
export function velocityStep2A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Did some quick math for a company your size:</p>
    <p>If you're manually verifying certificates for 50+ subbies, that's probably 10-15 hours/week of admin time. At $50/hour, that's $25,000-$40,000/year.</p>
    <p>RiskSure automates all of it for $349/month. Plus you get an audit trail that actually impresses WorkSafe.</p>
    <p><a href="${params.calendlyUrl}">Book 15 mins here</a> if you want to see how it works.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep2B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I keep hearing about builders who nearly got caught out by WorkSafe audits—expired certificates they didn't catch, subbies who "forgot" to renew their WorkCover.</p>
    <p>With the new industrial manslaughter laws, that's not just a fine anymore. It's personal liability.</p>
    <p>RiskSure gives you a defensible audit trail: every certificate verified by AI, every check timestamped, every gap flagged.</p>
    <p>Worth 15 minutes to see how it works?</p>
    <p><a href="${params.calendlyUrl}">Grab a time here</a></p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// STEP 3 - BREAKUP
// ============================================
export function velocityStep3A(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>I'll keep this short—this is my last email.</p>
    <p>If subbie compliance isn't a pain point for ${params.companyName} right now, totally understand. I'll close your file.</p>
    <p>But if you're ever drowning in certificate chasing or prepping for an audit, the door's always open: <a href="${params.calendlyUrl}">risksure.ai/demo</a></p>
    <p>Good luck with the projects.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

export function velocityStep3B(params: TemplateParams): string {
  const content = `
    <p>Hi ${params.contactName},</p>
    <p>Closing the loop on my emails about certificate compliance.</p>
    <p>If timing isn't right, no worries. But before I go—we're running a founder's special: 50% off for 6 months for early adopters.</p>
    <p>Code is FOUNDER50 if you ever want to try it out.</p>
    <p>All the best with ${params.companyName}.</p>
    <p>Jason</p>
  `;
  return wrapEmail({ content, unsubscribeUrl: params.unsubscribeUrl });
}

// ============================================
// TEMPLATE GETTER
// ============================================
export function getVelocityTemplate(
  step: number,
  variant: "A" | "B",
  params: TemplateParams
): string {
  const templates: Record<string, (p: TemplateParams) => string> = {
    "0A": velocityStep0A,
    "0B": velocityStep0B,
    "1A": velocityStep1A,
    "1B": velocityStep1B,
    "2A": velocityStep2A,
    "2B": velocityStep2B,
    "3A": velocityStep3A,
    "3B": velocityStep3B,
  };

  const key = `${step}${variant}`;
  const template = templates[key];

  if (!template) {
    throw new Error(`Template not found: velocity step ${step} variant ${variant}`);
  }

  return template(params);
}

export function getVelocitySubject(
  step: number,
  variant: "A" | "B",
  companyName: string
): string {
  const config = velocitySequence[step];
  if (!config) {
    throw new Error(`Sequence step not found: velocity step ${step}`);
  }

  const subject = variant === "A" ? config.subjectA : config.subjectB;
  return subject.replace("{{company}}", companyName);
}
