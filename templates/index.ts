export interface TemplateParams {
  contactName: string;
  companyName: string;
  personalizedOpener: string;
  unsubscribeUrl: string;
  calendlyUrl: string;
  estimatedSubbies?: number;
  state?: string;
  senderName?: string;
  senderTitle?: string;
  senderPhone?: string;
  demoVideoUrl?: string;
}

export type Tier = "velocity" | "compliance" | "business";
export type Variant = "A" | "B";

// ============================================
// SUBJECT LINES
// ============================================

const subjects = {
  step0: {
    A: "Quick question about {{companyName}}'s COC process",
    B: "{{contactName}} - how do you handle subbie certificates?",
  },
  step1: {
    A: "Re: Quick question about {{companyName}}'s COC process",
    B: "The workflow shift",
  },
  step2: {
    A: "What {{companyName}}'s compliance team could stop doing",
    B: "30 seconds vs 30 minutes",
  },
  step3: {
    A: "How [similar company] handles COC compliance now",
    B: "The maths on certificate admin",
  },
  step4: {
    A: "Closing the loop",
    B: "Last note from me",
  },
};

// ============================================
// EMAIL BODIES
// ============================================

const bodies = {
  step0: `{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each.

We built something that changes that - each subbie gets their own portal to upload their docs, we verify everything against your requirements, and your team just reviews what we flag.

We'd love to show you how it works if you're interested.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.`,

  step1: `{{contactName}},

Following up on my last note.

The short version: we've built a system where subbies upload their own docs through their own portal, we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Here's a 2-minute video showing the workflow: {{demoVideoUrl}}

Or if you'd prefer a live walkthrough, grab a time here: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just let me know and I'll stop following up.`,

  step2: {
    velocity: `{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

We've got builders doing that same volume where their team spends maybe 2 hours a month reviewing exceptions. The rest is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    compliance: `{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. At 20-30 minutes each - that's a lot of hours spent on admin work that doesn't need a human.

We've got builders at your scale where the compliance team spends a few hours a week reviewing exceptions. Everything else - the collection, verification, tracking, follow-ups - is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    business: `{{contactName}},

Quick thought:

At {{companyName}}'s scale, you've probably got thousands of certificates across your portfolio. That's either a full-time job for someone, or it's falling through the cracks.

We work with builders managing 300+ subbies where the compliance team has complete visibility across every project - and spends most of their time on actual risk management, not document admin.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,
  },

  step3: `{{contactName}},

One more thought and I'll leave you alone.

A {{state}} builder similar to {{companyName}} switched to us six months ago. Their compliance admin went from 15+ hours a week to about 2 hours reviewing exceptions.

Their subbies actually upload on time now (because it's free and takes 60 seconds through their own portal). No more chasing.

If you want to see what that looks like, we'd love to walk you through it: {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

  step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie certificates - haven't heard back, so I'll assume the timing isn't right.

If things change and you want to see how other builders have streamlined this, the door's open: {{calendlyUrl}}

All the best with the projects.

{{senderName}}
{{senderPhone}}`,
};

// ============================================
// SEQUENCE CONFIG
// ============================================

const sequenceConfig = {
  velocity: [
    { step: 0, delayDays: 0 },
    { step: 1, delayDays: 4 },
    { step: 2, delayDays: 9 },
    { step: 3, delayDays: 15 },
    { step: 4, delayDays: 22 },
  ],
  compliance: [
    { step: 0, delayDays: 0 },
    { step: 1, delayDays: 4 },
    { step: 2, delayDays: 9 },
    { step: 3, delayDays: 15 },
    { step: 4, delayDays: 22 },
  ],
  business: [
    { step: 0, delayDays: 0 },
    { step: 1, delayDays: 4 },
    { step: 2, delayDays: 9 },
    { step: 3, delayDays: 15 },
    { step: 4, delayDays: 22 },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function replaceVariables(template: string, params: TemplateParams): string {
  const vars: Record<string, string> = {
    contactName: params.contactName,
    companyName: params.companyName,
    personalizedOpener: params.personalizedOpener,
    unsubscribeUrl: params.unsubscribeUrl,
    calendlyUrl: params.calendlyUrl,
    estimatedSubbies: String(params.estimatedSubbies || 50),
    state: params.state || "NSW",
    senderName: params.senderName || "Jason",
    senderTitle: params.senderTitle || "Founder",
    senderPhone: params.senderPhone || "0412 345 678",
    demoVideoUrl: params.demoVideoUrl || "https://risksure.ai/demo",
  };

  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return result;
}

// ============================================
// EXPORTS
// ============================================

export function getSubject(
  tier: Tier,
  step: number,
  variant: Variant,
  companyName: string
): string {
  const stepKey = `step${step}` as keyof typeof subjects;
  const subjectTemplate = subjects[stepKey]?.[variant] || subjects.step0[variant];
  return replaceVariables(subjectTemplate, {
    contactName: "",
    companyName,
    personalizedOpener: "",
    unsubscribeUrl: "",
    calendlyUrl: "",
  });
}

export function getPlainTextTemplate(
  tier: Tier,
  step: number,
  variant: Variant,
  params: TemplateParams
): string | null {
  let template: string;

  if (step === 2) {
    // Step 2 has tier-specific bodies
    template = bodies.step2[tier];
  } else {
    const stepKey = `step${step}` as keyof typeof bodies;
    const body = bodies[stepKey];
    template = typeof body === "string" ? body : bodies.step0;
  }

  return replaceVariables(template, params);
}

// For backwards compatibility
export function getTemplate(
  tier: Tier,
  step: number,
  variant: Variant,
  params: TemplateParams
): string {
  return getPlainTextTemplate(tier, step, variant, params) || "";
}

export function getSequence(tier: Tier) {
  return sequenceConfig[tier];
}

export function getMaxSteps(tier: Tier): number {
  return sequenceConfig[tier].length;
}

export function getDelayDays(tier: Tier, step: number): number {
  const sequence = sequenceConfig[tier];
  const config = sequence[step];
  if (!config) return 7;
  return config.delayDays;
}
