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
// Updated January 2026: New angles for regulatory urgency
// ============================================

const subjects = {
  step0: {
    A: "Quick question about {{companyName}}'s COC process",
    B: "{{contactName}} - subbie insurance compliance",
  },
  step1: {
    A: "Re: Quick question about {{companyName}}'s COC process",
    B: "The workflow shift (+ Procore sync)",
  },
  step2: {
    A: "{{contactName}} - the compliance maths",
    B: "Beyond time savings - the liability angle",
  },
  step3: {
    A: "Early adopter opportunity",
    B: "What {{state}} builders are switching to",
  },
  step4: {
    A: "Closing the loop",
    B: "Last note from me",
  },
};

// ============================================
// EMAIL BODIES
// Updated January 2026: Regulatory urgency, "free for subbies" earlier,
// honest early-adopter positioning, WorkSafe audit trail angle
// ============================================

const bodies = {
  step0: `{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each. That's a lot of admin hours - and a lot of liability if something slips through.

We built something that changes that:
- Each subbie gets their own portal (free for them, no account required - just a link)
- They upload their docs in 60 seconds
- Our AI verifies everything against your requirements in 30 seconds
- Your team just reviews what we flag

You get a timestamped audit trail of every verification - useful if WorkSafe ever asks.

Happy to show you how it works if you're interested: {{calendlyUrl}}

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.`,

  step1: `{{contactName}},

Following up on my last note.

The short version: subbies upload their own docs through a free portal (no login, just a secure link), we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Already using Procore? We sync directly - your subbie compliance status shows up right in your project.

Here's a 2-minute video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,

  step2: {
    velocity: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    compliance: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. That's a lot of hours spent on admin work that doesn't need a human.

**The liability angle:** Industrial Manslaughter laws are now active in {{state}} - up to $20M in fines and personal imprisonment for officers. The Pafburn High Court ruling confirmed head contractors can't delegate this liability to subbies.

We've built something that handles both:
- Automates collection and verification (AI checks in 30 seconds)
- Creates timestamped audit trail for every verification
- Flags exceptions for your team to review

Your compliance team spends time on actual risk management, not document admin.

Worth a look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    business: `{{contactName}},

At {{companyName}}'s scale, you've got thousands of certificates across your portfolio. That's either a full-time job for someone, or gaps are forming.

With Industrial Manslaughter laws now active nationally and the Pafburn ruling confirming non-delegable duty, those gaps represent serious liability - not just admin inconvenience.

We work with builders managing 300+ subbies where:
- The compliance team has complete visibility across every project
- Every verification is timestamped (audit-ready)
- Subbies actually upload on time (because our portal is free and takes 60 seconds)
- The team focuses on risk management, not document chasing

If you'd like to see how this works at enterprise scale: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,
  },

  step3: `{{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Early users are seeing their compliance admin drop from 15+ hours/week to 2-3 hours reviewing exceptions. Their subbies actually upload on time because it's free and takes 60 seconds.

If you'd be open to being one of our early adopters, we'd make it worth your while on pricing. And you'd have direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

  step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

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
