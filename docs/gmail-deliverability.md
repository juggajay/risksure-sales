# Gmail Deliverability Guide

## Summary

To land in Gmail's **Primary** tab instead of Promotions, emails must be **pure plain text** with no HTML whatsoever.

## What Works (Primary Inbox)

**Pure plain text emails:**
- No HTML tags at all
- No `<br>`, `<a href>`, `<p>`, `<div>`, etc.
- Line breaks using actual newlines (`\n`)
- URLs shown as plain text (e.g., `https://example.com/unsubscribe/token`)

**Example that landed in Primary:**
```
Hi Jayson,

Seeing Brookfield's substantial growth...

At Brookfield's scale, subcontractor compliance isn't just an admin task—it's enterprise risk.

One uninsured subbie incident across your portfolio could mean millions in exposure.

Worth a conversation with your leadership team?

Jason
RiskSure.AI

---
Unsubscribe: https://sales.risksure.ai/unsubscribe/T1l0jmL8amFXSHk8nIKT940MSEcMATDH
```

## What Triggers Promotions

1. **Any HTML tags** - Even minimal HTML like `<br>` or `<a href>` triggers promotional filtering
2. **HTML structure** - `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` tags
3. **Inline CSS** - Any `style=""` attributes
4. **Marketing-style subjects** - "Executive visibility into..." vs "Audit question for..."
5. **Feature-focused content** - Listing features instead of asking questions

## Tested Results

| Company | Format | Subject Style | Inbox |
|---------|--------|---------------|-------|
| Built Pty Ltd | HTML | Problem-focused | Primary |
| Multiplex | HTML | Feature-focused | Promotions |
| Lendlease | HTML | Problem-focused (rewritten) | Promotions |
| **Brookfield** | **Plain text** | Problem-focused | **Primary** ✅ |
| John Holland | Minimal HTML (`<br>`, `<a>`) | Problem-focused | Promotions |

## Recommendations

### For Gmail Deliverability

1. **Use pure plain text** for Step 0 (first touch) emails
2. **Show unsubscribe URL** as plain text - it's ugly but works
3. **Problem-focused subjects** - Ask questions, don't announce features
4. **Short, conversational content** - Avoid marketing language

### For Outlook/Hotmail

- Plain text may still go to Junk (domain reputation issue)
- Consider warming up the domain with engagement
- SPF/DKIM/DMARC should be configured properly

## Technical Implementation

In `templates/business/index.ts`, use template literals with `\n` for line breaks:

```typescript
export function businessStep0BText(params: TemplateParams): string {
  return `Hi ${params.contactName},

${params.personalizedOpener}

Quick question: If WorkSafe walked into ${params.companyName} tomorrow, could you show them exactly which subbies have valid insurance across every project?

Most enterprise builders we talk to can't. The data exists—scattered across spreadsheets, Cm3, email threads—but pulling it together for an audit is a nightmare.

That's the gap we built RiskSure to close. Not another system to manage, but a single answer when someone asks "are we covered?"

Is this a problem you're dealing with?

Jason
RiskSure.AI

---
Unsubscribe: ${params.unsubscribeUrl}`;
}
```

## Key Insight

Gmail's ML filter is highly sensitive to HTML. Even "minimal" HTML that looks like plain text is detected and categorized as promotional. The only reliable way to reach Primary is pure plain text sent via the `text` field in the email API, not `html`.
