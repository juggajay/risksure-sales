# Email Template Updates - Implementation Spec

## Overview

Update all email templates in the RiskSure sales automation system to incorporate regulatory urgency, stronger differentiation, and more authentic messaging. These changes are based on market research showing that **"Protect Your Licence"** is a stronger driver than **"Save Time"**.

---

## Key Messaging Changes

### 1. Add Regulatory Urgency (Industrial Manslaughter)
- Industrial Manslaughter laws now active in ALL Australian states
- Penalties: up to $20M fines, 25 years imprisonment
- Pafburn ruling: head contractors liable for subbie negligence (non-delegable duty)
- This creates urgency - it's not just admin, it's personal liability

### 2. Lead with "Free for Subbies" Earlier
- This is the #1 differentiator vs Cm3 (who charges subbies $400-$3,000/year)
- Mention in Step 0, not just Step 3
- Emphasize: "no login required, just a magic link"

### 3. Be Honest About Being New
- Don't use fake social proof ("A builder similar to yours...")
- Position as "early adopter opportunity" with pricing benefits
- Builds trust and credibility

### 4. Add WorkSafe Audit Trail Angle
- "Timestamped proof of every verification"
- "A system, not a spreadsheet"
- Appeals to fear of audits

---

## File to Update

**Location:** `convex/templates.ts`

Update the `defaultTemplates` object with the new content below.

---

## Updated Templates

### Subject Lines

```typescript
subjects: {
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
},
```

---

### Step 0: Initial Outreach (Updated)

**Key changes:**
- Added "free for subbies, no login required" earlier
- Added soft regulatory mention
- Kept the "name their reality" opening

```typescript
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
```

---

### Step 1: Follow-Up (Updated)

**Key changes:**
- Added Procore integration mention
- Kept it short
- Added video link placeholder

```typescript
step1: `{{contactName}},

Following up on my last note.

The short version: subbies upload their own docs through a free portal (no login, just a secure link), we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Already using Procore? We sync directly - your subbie compliance status shows up right in your project.

Here's a 45-second video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,
```

---

### Step 2: Value Prop + Liability Angle (Updated)

**Key changes:**
- Added Industrial Manslaughter and Pafburn angles
- Split into regulatory risk + time savings
- Tier-specific versions

#### Velocity Tier
```typescript
step2_velocity: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,
```

#### Compliance Tier
```typescript
step2_compliance: `{{contactName}},

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
```

#### Business Tier
```typescript
step2_business: `{{contactName}},

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
```

---

### Step 3: Early Adopter Angle (Updated)

**Key changes:**
- Removed fake social proof
- Honest about being new
- Positioned as early adopter opportunity with **FOUNDER50** promo code
- Specific offer: 50% off for first 6 months
- Added real value prop

```typescript
step3: `{{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Here's how it works: your team adds a subbie, they get a portal link, they upload in 60 seconds (free for them, no login required), and our AI verifies against your requirements in 30 seconds. You just review the exceptions.

If you'd be open to being one of our early adopters, use code FOUNDER50 for 50% off your first 6 months. You'd also get direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,
```

---

### Step 4: Final Touch (Updated)

**Key changes:**
- Added FOUNDER50 promo reminder as final incentive
- Kept respectful close

```typescript
step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

The FOUNDER50 code (50% off first 6 months) stays valid if you want to revisit later.

All the best with the projects.

{{senderName}}
{{senderPhone}}`,
```

---

## Complete Updated `defaultTemplates` Object

Replace the entire `defaultTemplates` object in `convex/templates.ts` with:

```typescript
const defaultTemplates = {
  subjects: {
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
  },
  bodies: {
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

Here's a 45-second video showing how it works: {{demoVideoUrl}}

Or grab a time for a live walkthrough: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just reply and I'll stop following up.`,

    step2_velocity: `{{contactName}},

Two angles to consider:

**The time angle:** With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

**The liability angle:** With Industrial Manslaughter laws now active in {{state}}, you're personally liable if an uninsured subbie causes an incident on your site. The Pafburn ruling confirmed you can't contract that away - head contractors carry the risk.

We've built something that handles both - automates the admin AND gives you a timestamped audit trail proving you verified every certificate. If WorkSafe walks in, you show them a system, not a spreadsheet.

Worth a 15-minute look? {{calendlyUrl}}

{{senderName}}
{{senderPhone}}`,

    step2_compliance: `{{contactName}},

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

    step2_business: `{{contactName}},

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

    step3: `{{contactName}},

One more thought and I'll leave you alone.

We're a new player in this space - purpose-built for Australian construction compliance. No legacy from overseas markets, no charging subbies hundreds of dollars to upload a certificate.

Here's how it works: your team adds a subbie, they get a portal link, they upload in 60 seconds (free for them, no login required), and our AI verifies against your requirements in 30 seconds. You just review the exceptions.

If you'd be open to being one of our early adopters, use code FOUNDER50 for 50% off your first 6 months. You'd also get direct input into what we build next.

Interested? {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}`,

    step4: `{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie insurance compliance - haven't heard back, so I'll assume the timing isn't right.

If things change - whether it's an upcoming audit, a close call with an uninsured subbie, or just wanting to free up admin time - the door's open: {{calendlyUrl}}

The FOUNDER50 code (50% off first 6 months) stays valid if you want to revisit later.

All the best with the projects.

{{senderName}}
{{senderPhone}}`,
  },
  timing: {
    step0: 0,
    step1: 4,
    step2: 9,
    step3: 15,
    step4: 22,
  },
};
```

---

## Additional Required Changes

### 1. Add `{{demoVideoUrl}}` Variable

**Location:** Wherever template variables are defined/replaced

Add support for `{{demoVideoUrl}}` variable. This should be configurable in settings or env vars.

**Default value:** `https://www.loom.com/share/risksure-demo` (placeholder - replace with actual video)

**Action Required:** 45-second demo video showing:
1. Subbie receives portal link
2. Subbie uploads COC (60 seconds)
3. AI verification happens (30 seconds)
4. Dashboard shows green/red status
5. Exception review workflow

---

### 2. Update AI Enrichment Prompt

**Location:** Wherever the AI enrichment/personalized opener is generated

Update the prompt to include state-specific Industrial Manslaughter context:

```typescript
const enrichmentPrompt = `
You are writing the opening line of a cold email to a construction company executive.

Company: {{companyName}}
Contact: {{contactName}}, {{contactTitle}}
State: {{state}}
Research: {{enrichmentData}}

Write 1-2 sentences that:
1. Reference something specific about their company (recent project, growth, news)
2. Sound like a human wrote it, not a template
3. Do NOT mention RiskSure or our product
4. Do NOT be sycophantic or overly complimentary
5. Lead naturally into a conversation about their operations

Examples of good openers:
- "Saw {{companyName}} just started on the new hospital project in Melbourne - big job."
- "Noticed you've expanded into Queensland based on your recent project wins - exciting growth."
- "Your team's been busy - 3 new commercial projects in the last 6 months."

Examples of bad openers:
- "I hope this email finds you well." (generic)
- "Congratulations on your amazing success!" (sycophantic)
- "I'm reaching out because..." (template)
- "As a leader in the construction industry..." (flattery)
`;
```

---

### 3. Reset Existing Templates in Database

After deploying the code changes, run the reset mutation to clear old templates and reinitialize with new ones:

```typescript
// In Convex dashboard or via API call:
await ctx.runMutation(api.templates.reset, {});
await ctx.runMutation(api.templates.initialize, {});
```

Or add a migration script:

```typescript
// convex/migrations/resetTemplates.ts
import { mutation } from "./_generated/server";

export const resetAndReinitialize = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing templates
    const existing = await ctx.db.query("emailTemplates").collect();
    for (const t of existing) {
      await ctx.db.delete(t._id);
    }

    // The next call to getAll or getByStep will return new defaults
    return { success: true, deleted: existing.length };
  },
});
```

---

## Pre-Launch Checklist

Before starting outreach:

- [ ] Update `convex/templates.ts` with new templates
- [ ] Reset templates in database (run migration)
- [ ] **Configure FOUNDER50 promo code in Stripe (50% off, 6 months)**
- [x] Record 45-second demo video and update `{{demoVideoUrl}}` → https://risksure.ai/demo
- [ ] Set up Calendly link and update `{{calendlyUrl}}`
- [ ] Configure sender details (`{{senderName}}`, `{{senderTitle}}`, `{{senderPhone}}`)
- [ ] Verify email domain is warmed (check current day count)
- [ ] Load test CSV with 5-10 leads to verify flow
- [ ] Send test emails to yourself for all 5 steps
- [ ] Verify unsubscribe links work
- [ ] Verify Calendly webhook is connected

---

## Testing the Templates

Send test emails to yourself for each step:

```bash
# Via API or dashboard, trigger test sends:
Step 0: Initial outreach
Step 1: Follow-up
Step 2 (Velocity): Small builder angle
Step 2 (Compliance): Mid-market angle
Step 2 (Business): Enterprise angle
Step 3: Early adopter
Step 4: Final touch
```

Verify:
- All variables are replaced correctly
- No `{{variable}}` placeholders showing
- Plain text renders correctly (no HTML artifacts)
- Line breaks are preserved
- Links are clickable

---

## Summary of Changes

| Template | Key Changes |
|----------|-------------|
| **Step 0** | Added "free for subbies", audit trail mention, liability soft-mention |
| **Step 1** | Added Procore integration, video link |
| **Step 2** | Split into time + liability angles, Industrial Manslaughter + Pafburn mentions |
| **Step 3** | Removed fake social proof, honest "early adopter" positioning, **FOUNDER50 promo code** |
| **Step 4** | Added audit/close-call triggers, **FOUNDER50 reminder as final incentive** |
| **Subjects** | Updated to reflect new angles |

---

## FOUNDER50 Promotion Details

| Aspect | Details |
|--------|---------|
| **Code** | FOUNDER50 |
| **Discount** | 50% off |
| **Duration** | First 6 months |
| **Mentioned in** | Step 3 (main offer), Step 4 (reminder) |
| **Positioning** | Early adopter reward |

**Note:** Ensure your Stripe/billing system has this promo code configured before sending outreach.

---

*Last updated: January 2026*
