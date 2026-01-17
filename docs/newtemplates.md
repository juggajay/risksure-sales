# RiskSure Sales Email Templates - Implementation Spec

## Overview

This document defines the email templates for the RiskSure sales automation system. All emails should be sent as **plain text** (no HTML) for Gmail Primary inbox placement.

---

## Template Variables

All templates support these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{contactName}}` | First name of recipient | "John" |
| `{{companyName}}` | Company name | "Built Constructions" |
| `{{personalizedOpener}}` | AI-generated opener from enrichment (1-2 sentences) | "Saw Built just won the Westfield project in Parramatta..." |
| `{{estimatedSubbies}}` | Estimated subcontractor count from enrichment | "200" |
| `{{state}}` | Australian state | "NSW" |
| `{{senderName}}` | Sender's first name | "Jason" |
| `{{senderTitle}}` | Sender's title | "Founder" |
| `{{senderPhone}}` | Sender's phone | "0412 345 678" |
| `{{calendlyUrl}}` | Demo booking link | "https://calendly.com/risksure/demo" |
| `{{unsubscribeUrl}}` | Unsubscribe link | "https://sales.risksure.ai/unsubscribe/{{token}}" |

---

## Sequence Timing

| Step | Timing | Purpose |
|------|--------|---------|
| Step 0 | Day 0 | Initial outreach - name their reality |
| Step 1 | Day 4 | Follow-up - the workflow shift |
| Step 2 | Day 9 | Value prop - specific benefits |
| Step 3 | Day 15 | Social proof / ROI angle |
| Step 4 | Day 22 | Final touch - soft close |

---

## Tier Definitions

| Tier | Subbie Count | Revenue Range | Messaging Focus |
|------|--------------|---------------|-----------------|
| `velocity` | 20-75 | $5M-$20M | Time savings, simplicity |
| `compliance` | 75-250 | $20M-$100M | Workflow efficiency, scale |
| `business` | 250+ | $100M+ | Portfolio-wide visibility, enterprise scale |

---

## Step 0: Initial Outreach

### Subject Lines (A/B Test)

**Variant A:** `Quick question about {{companyName}}'s COC process`

**Variant B:** `{{contactName}} - how do you handle subbie certificates?`

### Body - All Tiers

```
{{personalizedOpener}}

When a new subbie comes on, someone on your team gets their COC, opens the PDF, checks the coverage and expiry, matches it to your requirements, logs it somewhere, and follows up if something's off.

Multiply that by {{estimatedSubbies}} subbies and 3-4 certs each.

We built something that changes that - each subbie gets their own portal to upload their docs, we verify everything against your requirements, and your team just reviews what we flag.

We'd love to show you how it works if you're interested.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}

If this isn't relevant for {{companyName}}, just let me know.
```

---

## Step 1: Follow-Up (Day 4)

### Subject Lines (A/B Test)

**Variant A:** `Re: Quick question about {{companyName}}'s COC process`

**Variant B:** `The workflow shift`

### Body - All Tiers

```
{{contactName}},

Following up on my last note.

The short version: we've built a system where subbies upload their own docs through their own portal, we verify everything in about 30 seconds, and your team just reviews the exceptions.

No chasing. No spreadsheets. No manual checking.

Here's a 2-minute video showing the workflow: {{demoVideoUrl}}

Or if you'd prefer a live walkthrough, grab a time here: {{calendlyUrl}}

{{senderName}}

If this isn't relevant, just let me know and I'll stop following up.
```

---

## Step 2: Value Prop (Day 9)

### Subject Lines (A/B Test)

**Variant A:** `What {{companyName}}'s compliance team could stop doing`

**Variant B:** `30 seconds vs 30 minutes`

### Body - Velocity Tier

```
{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies, you're probably processing 200-300 certificates a year. At 20-30 minutes each (download, open, check, log, follow up) - that's 100+ hours of admin work annually.

We've got builders doing that same volume where their team spends maybe 2 hours a month reviewing exceptions. The rest is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}
```

### Body - Compliance Tier

```
{{contactName}},

Quick thought:

With {{estimatedSubbies}} subbies across multiple projects, you're probably processing 600-1000 certificates a year. At 20-30 minutes each - that's a lot of hours spent on admin work that doesn't need a human.

We've got builders at your scale where the compliance team spends a few hours a week reviewing exceptions. Everything else - the collection, verification, tracking, follow-ups - is handled.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}
```

### Body - Business Tier

```
{{contactName}},

Quick thought:

At {{companyName}}'s scale, you've probably got thousands of certificates across your portfolio. That's either a full-time job for someone, or it's falling through the cracks.

We work with builders managing 300+ subbies where the compliance team has complete visibility across every project - and spends most of their time on actual risk management, not document admin.

If that sounds interesting, we'd love to show you how it works: {{calendlyUrl}}

{{senderName}}
{{senderPhone}}
```

---

## Step 3: Social Proof / ROI (Day 15)

### Subject Lines (A/B Test)

**Variant A:** `How [similar company] handles COC compliance now`

**Variant B:** `The maths on certificate admin`

### Body - All Tiers

```
{{contactName}},

One more thought and I'll leave you alone.

A {{state}} builder similar to {{companyName}} switched to us six months ago. Their compliance admin went from 15+ hours a week to about 2 hours reviewing exceptions.

Their subbies actually upload on time now (because it's free and takes 60 seconds through their own portal). No more chasing.

If you want to see what that looks like, we'd love to walk you through it: {{calendlyUrl}}

Either way, appreciate your time.

{{senderName}}
{{senderTitle}} | RiskSure.AI
{{senderPhone}}
```

---

## Step 4: Final Touch (Day 22)

### Subject Lines (A/B Test)

**Variant A:** `Closing the loop`

**Variant B:** `Last note from me`

### Body - All Tiers

```
{{contactName}},

I've reached out a few times about how {{companyName}} handles subbie certificates - haven't heard back, so I'll assume the timing isn't right.

If things change and you want to see how other builders have streamlined this, the door's open: {{calendlyUrl}}

All the best with the projects.

{{senderName}}
{{senderPhone}}
```

---

## Personalized Opener Generation (AI Prompt)

When enriching a lead, use this prompt to generate the `{{personalizedOpener}}`:

```
You are writing the opening line of a cold email to a construction company executive.

Company: {{companyName}}
Contact: {{contactName}}, {{contactTitle}}
Research: {{enrichmentData}}

Write 1-2 sentences that:
1. Reference something specific about their company (recent project, growth, news)
2. Sound like a human wrote it, not a template
3. Do NOT mention RiskSure or our product
4. Do NOT be sycophantic or overly complimentary
5. Lead naturally into a conversation about their operations

Examples of good openers:
- "Saw {{companyName}} just started on the new hospital project in Melbourne - big job."
- "Noticed you've grown from 80 to 150 subbies in the last year based on your recent project wins."
- "Your GM mentioned at the MBA event that you're expanding into Queensland - exciting time."

Examples of bad openers:
- "I hope this email finds you well." (generic)
- "Congratulations on your amazing success!" (sycophantic)
- "I'm reaching out because..." (template)
```

---

## Implementation Notes

### Email Sending Rules

1. **Plain text only** - no HTML tags, no images, no tracking pixels
2. **Line breaks** - use single line breaks for readability, double for paragraphs
3. **No salutation colon** - use `{{contactName}},` not `Dear {{contactName}}:`
4. **Signature** - keep simple: name, title, phone on separate lines
5. **Unsubscribe** - always include soft opt-out line at bottom

### Domain Warming Schedule

| Week | Daily Send Limit |
|------|------------------|
| 1 | 20 |
| 2 | 40 |
| 3 | 60 |
| 4 | 80 |
| 5 | 100 |
| 6+ | 150-200 max |

### A/B Testing

- Split 50/50 on subject lines
- Track: open rate, reply rate, demo booked rate
- Rotate winning variant after 100 sends per variant
- Test one element at a time

### Stop Conditions

Stop sequence immediately if:
- Lead replies (any reply)
- Lead books demo (Calendly webhook)
- Lead unsubscribes
- Email bounces (hard bounce)
- Lead marked as "not interested" manually

---

## Response Handling

### Positive Reply Detection

Flag as positive if reply contains:
- "interested"
- "show me"
- "let's chat"
- "book" / "schedule" / "calendar"
- "tell me more"
- "how does it work"
- "pricing"
- "cost"
- Question about features

### Negative Reply Detection

Flag as not interested if reply contains:
- "not interested"
- "remove me"
- "unsubscribe"
- "stop emailing"
- "don't contact"
- "wrong person"
- "we use Cm3" (potential objection to handle)

### Out of Office Detection

Pause sequence if reply contains:
- "out of office"
- "on leave"
- "away from"
- "returning on"
- Auto-resume 3 days after stated return date

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| Delivery rate | >98% |
| Open rate | >40% |
| Reply rate | >5% |
| Positive reply rate | >2% |
| Demo booked rate | >1% |
| Unsubscribe rate | <1% |
| Bounce rate | <2% |

---

## File Structure for Templates

```
templates/
├── step-0/
│   ├── subject-a.txt
│   ├── subject-b.txt
│   └── body.txt
├── step-1/
│   ├── subject-a.txt
│   ├── subject-b.txt
│   └── body.txt
├── step-2/
│   ├── subject-a.txt
│   ├── subject-b.txt
│   ├── body-velocity.txt
│   ├── body-compliance.txt
│   └── body-business.txt
├── step-3/
│   ├── subject-a.txt
│   ├── subject-b.txt
│   └── body.txt
└── step-4/
    ├── subject-a.txt
    ├── subject-b.txt
    └── body.txt
```

---

*Last updated: January 2026*
