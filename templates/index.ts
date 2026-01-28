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
  // Nurture steps (longer delays, re-engagement)
  step5: {
    A: "New feature: automated expiry alerts",
    B: "Product update from RiskSure",
  },
  step6: {
    A: "Still relevant for {{companyName}}?",
    B: "Quick check-in",
  },
  step7: {
    A: "Final note from RiskSure",
    B: "One last thought on compliance",
  },
};

// ============================================
// EMAIL BODIES
// Updated January 2026: Regulatory urgency, "free for subbies" earlier,
// honest early-adopter positioning, WorkSafe audit trail angle
// ============================================

const bodies = {
  step0: `Hi {{contactName}},

{{personalizedOpener}}

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

  step1: `Hi {{contactName}},

Following up on my last note.

The short version: subbies upload their own docs through a free portal (no login, just a secure link), we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Already using Procore? We sync directly - your subbie compliance status shows up right in your project.

Here's a 45-second video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,

  step2: {
    velocity: `Hi {{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    compliance: `Hi {{contactName}},

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

    business: `Hi {{contactName}},

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

  step3: `Hi {{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Early users are seeing their compliance admin drop from 15+ hours/week to 2-3 hours reviewing exceptions. Their subbies actually upload on time because it's free and takes 60 seconds.

If you'd be open to being one of our early adopters, we'd make it worth your while on pricing. And you'd have direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

  step4: `Hi {{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

All the best with the projects.

{{senderName}}
{{senderPhone}}`,

  // ============================================
  // NURTURE STEPS (5-7) — longer delays, re-engagement
  // ============================================

  step5: `Hi {{contactName}},

It's been a while since we last connected. Wanted to share a quick update.

We've just launched automated expiry alerts — our system now monitors every certificate in real time and notifies both you and the subbie before anything lapses. No more manual tracking or surprise gaps.

A few {{state}} builders have told us this alone saves them 5+ hours a week.

If things have changed on your end and compliance is back on the radar: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

  step6: `Hi {{contactName}},

Just a quick check-in from RiskSure.

Is subbie insurance compliance still a pain point for {{companyName}}? If you've solved it another way, genuinely curious to hear what's working.

If it's still on the back burner, no pressure. But if a 15-minute look would be useful, I'm here: {{calendlyUrl}}

Either way, hope the projects are going well.

{{senderName}}`,

  step7: `Hi {{contactName}},

This will be my last note.

If {{companyName}} ever needs a better way to handle subbie insurance verification — whether it's before an audit, after a near-miss, or just to free up admin time — we're here.

We've helped dozens of Australian builders go from spreadsheets to a fully automated compliance system. The door's always open: {{calendlyUrl}}

All the best.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,
};

// ============================================
// SEQUENCE CONFIG
// ============================================

// Initial outreach sequence (steps 0-4)
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

// Nurture sequence (steps 5-7) — shared across all tiers
const nurtureSequenceConfig = [
  { step: 5, delayDays: 45 },
  { step: 6, delayDays: 60 },
  { step: 7, delayDays: 90 },
];

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
    senderName: params.senderName || "Jayson",
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
  companyName: string,
  contactName?: string,
  state?: string
): string {
  const stepKey = `step${step}` as keyof typeof subjects;
  const subjectTemplate = subjects[stepKey]?.[variant] || subjects.step0[variant];
  return replaceVariables(subjectTemplate, {
    contactName: contactName || "",
    companyName,
    personalizedOpener: "",
    unsubscribeUrl: "",
    calendlyUrl: "",
    state,
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
    if (typeof body === "string") {
      template = body;
    } else if (body === undefined) {
      // Step not found — shouldn't happen but fall back gracefully
      return null;
    } else {
      template = bodies.step0;
    }
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

export function getNurtureMaxSteps(): number {
  return nurtureSequenceConfig.length + 5; // steps 5-7 = total of 8 steps (0-7)
}

export function getNurtureSequence() {
  return nurtureSequenceConfig;
}

export function getDelayDays(tier: Tier, step: number): number {
  // Check nurture steps first
  if (step >= 5) {
    const nurtureConfig = nurtureSequenceConfig.find((c) => c.step === step);
    if (nurtureConfig) return nurtureConfig.delayDays;
    return 30;
  }
  const sequence = sequenceConfig[tier];
  const config = sequence[step];
  if (!config) return 7;
  return config.delayDays;
}
