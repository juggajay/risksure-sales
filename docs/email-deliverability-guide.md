Complete Email Deliverability Guide: B2B Cold Outreach for Australian Construction
The Modern Deliverability Landscape
The domain of email deliverability has undergone a radical architectural shift between 2024 and 2026. Historically, inbox placement was a function of static rule sets—spam filters scanned subject lines for specific keywords (e.g., "free," "discount") and checked the sending IP address against rigid blocklists (RBLs). Today, the ecosystem is governed by sophisticated artificial intelligence and machine learning models that assess sender intent and recipient engagement in real-time.
Pure plain text emails are your best path to inbox placement. Research consistently shows that any HTML—even minimal tags like <br> or <a href>—triggers Gmail's Promotions tab, while new domains face automatic skepticism from Outlook that takes 6-8 weeks of careful warming to overcome. Leading cold email platforms like Instantly and Smartlead have built explicit plain-text modes specifically because HTML emails are flagged as marketing content by modern spam filters. With proper domain warming, authentication setup, and content optimization, you can achieve 95%+ deliverability rates even with a new domain.
The core challenge—that HTML emails effectively trigger the Gmail Promotions tab while pure plain text emails appear unprofessional—is a symptom of this algorithmic evolution. Providers like Google and Microsoft have optimized their user interfaces to segregate "commercial" communication from "personal" correspondence. The "Promotions" tab in Gmail and the "Other" inbox in Outlook are not spam folders; they are functioning repositories for legitimate marketing material. However, for B2B sales automation, where the objective is to initiate a peer-to-peer conversation, placement in these secondary tabs is functionally equivalent to invisibility.

The Algorithmic Divergence: Gmail vs. Outlook
You are fighting a war on two distinct fronts. The algorithms powering Gmail and Microsoft Exchange (Outlook/Office 365) operate on fundamentally different philosophies, necessitating a bifurcated strategy.
Gmail functions as a semantic categorization engine. Its AI, utilizing models such as RETVec (Resilient & Efficient Text Vectorizer), analyzes the structure and content of the email to determine if it resembles a newsletter or a personal letter. It is highly sensitive to HTML complexity, image density, and link patterns. Gmail is generally more forgiving of new domains regarding delivery (it will accept the mail) but aggressive regarding placement (it will segregate it to Promotions). Gmail's inbox placement rate is approximately 87.2%.
Microsoft Outlook, particularly within enterprise environments common in the construction industry, operates as a fortress of reputation. Its SmartScreen filter and Smart Network Data Services (SNDS) place a disproportionate weight on the age and history of the sending infrastructure. Unlike Gmail, which classifies based on content type, Outlook classifies based on trust. A new domain faces a "trust deficit" where the default action is often quarantine or the Junk folder until a specific threshold of positive interaction is proven over time. Outlook's filtering operates more at the infrastructure and routing level rather than content analysis. This means authentication and reputation matter more than exact email formatting. Microsoft's inbox placement rate is approximately 75.6%.
The "New Domain" Disadvantage: The status of a new domain is the single most significant variable. In the current email ecosystem, age is a proxy for legitimacy. Spammers frequently register domains, burn them through high-volume sending in days, and abandon them. Consequently, ESPs treat any domain younger than 30-60 days with extreme suspicion. This "warming period" is not merely a recommendation; it is a technical probationary period enforced by ISP filters. During this phase, volume and frequency must be mathematically modeled to mimic human behavior, as any deviation—such as a sudden spike in volume—confirms the "spammer" heuristic.

Why HTML Emails Land in Gmail Promotions
Gmail's classification algorithm analyzes multiple signals to sort emails, and HTML structure is a primary trigger for Promotions routing. Testing data shows that simple HTML maintains roughly 80% Primary inbox placement, but heavier HTML drops to 70%—and cold outreach needs every percentage point. The algorithm treats HTML formatting as a signal of mass marketing because legitimate one-to-one business correspondence typically lacks styled templates.
Gmail's classification is not punitive; it is organizational. The "Primary" tab is reserved for high-priority, conversational emails—typically from known contacts or entities engaging in one-to-one dialogue. The "Promotions" tab captures bulk, impersonal, or structurally complex emails.
Structural Triggers: The HTML Trap
Gmail's parser analyzes the Document Object Model (DOM) of the email:
Code-to-Text Ratio: Marketing emails typically contain heavy HTML markup—nested <div> tags, complex CSS classes, and media queries for responsiveness. Personal emails, even those written in rich text, produce relatively clean, linear HTML. When the ratio of code to visible text is high, Gmail categorizes the email as commercial.
The <table> Heuristic: While tables are standard in HTML email design to ensure layout consistency, they are rarely used in personal correspondence. A complex table structure, particularly one used for multi-column layouts, is a strong signal of a newsletter.
Image Density: A high number of images, or a large single image with minimal text, triggers the Promotions filter. This is often calculated as a ratio; safe emails typically maintain a text-to-image ratio of at least 60:40 or 80:20.
Specific HTML Elements That Trigger Promotional Classification

Tracking pixels (detected as surveillance)
<a href> links (especially multiple hyperlinks)
Inline CSS styling
Images of any kind
Formatted signatures with logos or social icons
Annotations and Schema (application/ld+json scripts) used to highlight deals or expiration dates

Gmail's filtering is also personalized per recipient—the same email can land in Primary for one person and Promotions for another based on their individual engagement history with similar senders.
The Role of Annotations and Schema
Gmail actively scans for specific code snippets known as "Annotations" which marketers use to highlight deals or expiration dates in the Promotions tab. While you are unlikely to be intentionally adding these, standard templates from some ESPs may include legacy schema markup. Paradoxically, the absence of this schema does not guarantee Primary placement, but its presence guarantees Promotions placement. The goal is to ensure the HTML header is stripped of any such marketing-specific metadata.
Engagement: The Override Mechanism
User engagement overrides content analysis in Gmail's logic:
The "Reply" Signal: A reply is the strongest positive signal in the Gmail ecosystem. If a recipient replies to your email, Google effectively whitelists the domain for that user and strengthens the domain's global reputation. This is why "conversation starter" calls-to-action (CTAs) are superior to "click here" CTAs for cold outreach.
The "Move to Primary" Action: If a user manually drags an email from Promotions to Primary, this trains the specific user's model. While relying on this for cold outreach is impractical, the internal testing team should perform this action rigorously during the warm-up phase to seed positive data.
Negative Signals: Conversely, if users delete the email without opening (low dwell time) or mark it as spam, the domain's reputation degrades, making Primary placement increasingly difficult regardless of content quality.
Sender Reputation vs. Content
While sender reputation is paramount, it acts as a gatekeeper rather than a sorter. A high sender reputation ensures the email lands in the Inbox rather than Spam. However, even a high-reputation domain like amazon.com lands in Promotions because the content is promotional. High reputation is the prerequisite for delivery; content structure is the key to placement.
Sender reputation provides partial protection but doesn't override content signals. Even high-reputation senders are seeing increased Promotions routing due to Gmail algorithm shifts in 2024-2025. The most reliable approach is eliminating HTML entirely for initial cold outreach, which is why Instantly's "Delivery Optimization" feature strips all HTML and sends emails as text-only while disabling open tracking.

Microsoft Outlook's Aggressive Filtering
Microsoft's filtering is more aggressive than Gmail's. New domains face automatic junk folder placement because Outlook treats unknown senders as potential threats until proven legitimate through consistent, safe behavior over time.
The SmartScreen Filter and SCL Scores
Microsoft's SmartScreen filter assigns a Spam Confidence Level (SCL) to every incoming message, typically ranging from -1 (Trusted) to 9 (High Confidence Spam):

SCL 0-1: Inbox
SCL 5-6: Junk Folder
SCL 9: Blocked/Quarantine

The "New Domain" penalty specifically affects this score. Outlook treats unknown domains as untrusted sources. Unlike Gmail, which might "test" an email in the Promotions tab, Outlook will often route unknown senders directly to Junk (SCL 5) until the domain accumulates sufficient history.
Key Triggers for Outlook Junk Placement
IP Reputation (SNDS): Outlook relies heavily on the reputation of the sending IP. If using a Shared IP pool from an ESP, "noisy neighbors" (other users) who abuse this IP can cause the entire IP range to be flagged. Monitor IP status via Microsoft's Smart Network Data Services (SNDS) at sendersupport.olc.protection.outlook.com/snds. Note: SNDS only covers consumer Microsoft domains (Outlook.com, Hotmail, Live)—not Office 365 business accounts where construction executive targets likely reside. This creates a visibility gap.
Link Obfuscation & Mismatches: Outlook is highly aggressive against phishing. If the visible text of a link says www.example.com but the underlying href points to track.esp.com (the default tracking behavior), Outlook flags this as a potential phishing attempt, spiking the SCL score. This makes Custom Tracking Domains mandatory.
Grey-listing (The "451/421" Errors): New domains often face "grey-listing," where the receiving server temporarily rejects the email to see if the sending server acts legitimately and retries. This causes delivery delays. While not a block, it indicates the domain is not yet trusted.
Microsoft's 2025 Authentication Requirements
Microsoft implemented new authentication requirements effective May 5, 2025 for domains sending 5,000+ emails daily to consumer Microsoft addresses:

SPF must pass
DKIM must pass
DMARC must be configured with at least p=none policy

Non-compliant messages receive a 550 rejection error.
HTML Rendering in Outlook
Outlook uses Microsoft Word's rendering engine to display emails, which is notoriously non-standard compared to web browsers. Complex HTML features (like background images, CSS positioning, and rounded corners) often break in Outlook. A broken email looks unprofessional and suspicious, leading to deletion. This reinforces the need for the "Minimalist HTML" approach—using ancient, table-based HTML structures that are robust enough to render correctly in Word's engine while simple enough to pass Gmail's filters.
Volume Thresholds for Outlook
Volume thresholds matter significantly for Outlook:

Sending limits should stay at 20-50 emails per inbox per day even after full warmup
Avoid link shorteners entirely (Outlook is more sensitive than Gmail)
Use reply-based calls-to-action rather than click-based ones
Keep signatures minimal


Technical Infrastructure Architecture
Authentication Protocols: SPF, DKIM, and DMARC
These form the authentication foundation, but implementation details matter significantly.
ProtocolFunctionOptimization for Cold OutreachCommon PitfallSPF (Sender Policy Framework)Authorizes IPs to send on behalf of the domainEnsure include:youresp.com is present. Minimize other includes.DNS Lookup Limit: SPF records cannot exceed 10 lookups. If you add Google, ESP, and other tools, this limit is easily breached, causing PermError which Outlook treats as a hard fail.DKIM (DomainKeys Identified Mail)Verifies content integrity and sender identity via cryptographyUse 2048-bit encryption keys (industry standard). Ensure the selector matches the DNS record exactly.Misalignment: The d= domain in the DKIM signature must match the From header domain.DMARC (Domain-based Message Authentication)Specifies policy for failed checksPhase 1: p=none (Monitoring) for 2-4 weeks. Phase 2: p=quarantine. Phase 3: p=reject.Missing Record: Gmail now requires DMARC for bulk senders. Having a DMARC record (even p=none) acts as a "trust badge" separating you from fly-by-night spammers.
SPF Configuration Details
The most common error is exceeding the 10 DNS lookup limit—each include: directive counts as one lookup, and using multiple email services quickly exhausts this limit. Use MXToolbox's SPF checker to verify. Set the policy to ~all (softfail) rather than -all to allow DKIM evaluation.
Example SPF record: v=spf1 include:youresp.com ~all
DKIM Configuration Details
DKIM keys should be 2048-bit (1024-bit is increasingly considered weak) with rotation every 6-12 months. Assign unique selectors for each sending service to isolate reputations. Verify the key is properly configured before sending.
DMARC Configuration Details
DMARC is now mandatory for bulk senders, required by Gmail/Yahoo since February 2024 and Microsoft since May 2025. Start with p=none (monitor only) while confirming all legitimate sources pass authentication, then progress to p=quarantine and eventually p=reject. Never jump directly to reject policy. Include reporting by adding rua=mailto:dmarc@yourdomain.com to receive aggregate reports.
Example DMARC record: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; pct=100
Domain Reputation vs. IP Reputation
Domain reputation now matters more than IP reputation for Gmail, Yahoo, and Outlook. This shift occurred because IP addresses are easily changed or shared, while domain reputation follows you permanently. Using an ESP's shared IPs shouldn't significantly hurt deliverability—reputable ESPs maintain clean IP pools, and your results depend primarily on your domain's behavior.
The Custom Tracking Domain (CNAME) Imperative
This is arguably the most critical technical fix. Using an ESP's default tracking likely rewrites links to track.esp.com.
The Problem:

Reputation Contagion: track.esp.com is used by thousands of customers. If one sends spam, the domain is flagged, and your emails (containing that link) go to Junk.
Phishing Signal: The mismatch between the sender (yourdomain.com) and the link (esp.com) triggers Outlook's SmartScreen phishing heuristics.

The Solution: Implement a Custom Tracking Domain

Create a subdomain: e.g., link.yourdomain.com or track.yourdomain.com
Add a CNAME record in DNS pointing to your ESP's tracking server
Result: Links appear as https://link.yourdomain.com/.... This creates Domain Alignment, significantly boosting trust with Outlook and Gmail.
SSL Requirement: Ensure your ESP provisions an SSL certificate for this subdomain. Non-HTTPS links are an immediate red flag.

However, for cold email specifically, consider disabling open tracking entirely—tracking pixels trigger spam filter suspicion and provide limited value when plain text emails can't embed them anyway.
Open Tracking: The "Invisible" Risk
Open rate tracking utilizes a 1x1 pixel image embedded in the email.
Deliverability Impact: This pixel adds HTML code and an image request to the email. Some strict corporate filters (common in construction) block all external images by default. If the pixel is blocked, tracking is inaccurate. Worse, the presence of the pixel can act as a "marketing marker," pushing the email toward Promotions.
Recommendation: Disable Open Tracking for the first 30 days of cold outreach. Focus entirely on Reply Rate. A reply is 100% proof of delivery and placement. Prioritizing vanity metrics (opens) over placement is a strategic error for new domains.
IP Strategy: Shared vs. Dedicated
Shared IPs: For a startup sending <5,000 emails/day, a high-quality Shared IP is generally safer. It comes "pre-warmed" with traffic from other legitimate users, providing cover for the new domain.
Dedicated IPs: A dedicated IP offers isolation but requires rigorous management. If you send 0 emails on Saturday and 2,000 on Monday, the dedicated IP's reputation will crash due to volume spikes.
Verdict: Stick with your ESP's Shared IP pool initially. Reputable ESPs aggressively police their pools. Only migrate to a Dedicated IP if volume exceeds 50k-100k/month and you have a dedicated deliverability specialist.

Domain Warming & Reputation Strategy
Domain warming is non-negotiable for new domains. Without it, ESP algorithms have no positive history to evaluate, defaulting to suspicious treatment. The warmup process typically takes 3-6 weeks, with Outlook requiring the longer end (6-8 weeks) due to stricter infrastructure-level filtering.
The Physics of Reputation
Reputation is not a single score; it is a matrix of:

Volume Consistency: Sending 50 emails every day is better than sending 500 once a week.
Engagement Rate: High open/reply rates signal "wanted" mail.
Bounce Rate: >2% hard bounce rate is a critical failure signal.

Trust is built on consistency, not volume.
Automated Warming vs. Manual Warming
Manual: Emailing colleagues and friends. Pros: High quality. Cons: Does not scale; cannot simulate the volume needed to "teach" filters.
Automated (Recommended): Services like Instantly, Smartlead, or Warmup Inbox connect the sending account to a network of peer inboxes. These tools automatically send, open, reply, and (crucially) move emails from Spam/Promotions to Primary. This "rescue" action is the most powerful signal for training Gmail's AI.
Warmup Tools Worth Considering
Automated warmup tools maintain networks of real email accounts that send, receive, and engage with your emails to build positive signals:

Instantly: Offers the largest network at 4.2+ million accounts with unlimited warmup and inbox placement testing for $30-97/month.
Smartlead: Provides similar capabilities with AI-driven replies and dynamic IP rotation at $39-94/month.
Lemwarm: Integrates tightly with Lemlist campaigns at $24-40/month with a 20,000+ inbox network.

These tools work by creating peer-to-peer networks where your inbox sends warmup emails to network accounts, those accounts open and reply, mark messages as important, and remove any that land in spam. The engagement signals train ESPs that your sending is legitimate.
Manual warming works for 1-2 accounts sending fewer than 20 emails daily, but paid tools become essential when managing multiple inboxes or needing real-time deliverability monitoring.
The 4-Week Domain Warming Schedule (Basic)
Week 1 focuses on foundation building with only known, engaged contacts. Start with 5-10 emails daily for the first two days, increasing to 15-25 by week's end. Send plain text only with no links or images. The goal is generating replies—even short "Got it!" responses—because replies are the most powerful engagement signal for reputation building.
Week 2 involves controlled growth to 25-50 emails daily. Monitor bounce rates (must stay below 2%) and open rates (target above 20%). Continue focusing on contacts likely to engage rather than cold prospects.
Week 3 begins the scaling phase, reaching 50-100 emails daily with verified B2B contacts. Light outreach testing can begin, but primary focus remains on maintaining strong engagement metrics.
Week 4 and beyond transitions to full cold outreach while keeping warmup emails running at 15-40% of total daily volume indefinitely. This ongoing warmup prevents reputation decay during lower-activity periods.
The 30-Day Warm-Up Schedule (Detailed)
For a new domain, the following schedule is mandatory. Deviation (rushing) will result in "domain burn."
Assumptions: Using an automated warming tool + gradual manual outreach.
PhaseDaysDaily Volume (Warm-up Tool)Daily Volume (Real Leads)Total DailyObjective & MetricsIgnition1-55 -> 10005-10Est. Baseline. 100% Reply rate on warm-up mails.Ramp I6-1010 -> 200010-20Consistency. No cold outreach yet.Ramp II11-1420 -> 300525-35Testing. Send 5 highly personalized real emails.Integration15-2130 -> 4010 -> 1540-55Assessment. Monitor real open rates. If <30%, Pause.Scaling22-284020 -> 3060-70Growth. Keep Bounce rate <1%.Steady State29+40 (Maintenance)40-50 (Max)80-90Limit. Cap per inbox at 50 cold sends/day.
Crucial Rules
Inbox Rotation: If you need to send 200 emails/day, do not send 200 from john@domain.com. Create 4 inboxes (john@, j.doe@, hello@, harrison@) and send 50 from each. This distributes the load and risk.
The "Reply" Safety Net: Ensure the automated warm-up tool is set to a 30% reply rate. This artificially inflates engagement, counteracting the low response rate of cold outreach.
Critical Thresholds

Bounce rates below 2%
Spam complaints below 0.1%
Open rates above 20%

If any metric degrades, pause cold outreach immediately and investigate.

Email Structure That Avoids Spam Filters
Optimal Email Length
Optimal cold email length falls between 50-100 words—long enough to convey value but short enough for busy construction executives scanning on mobile. Research shows:

20-39 words produced highest reply rates
75-125 words achieved 52% booking rates versus 20% for emails exceeding 300 words

Structure messages in 3-5 short paragraphs of 1-2 sentences each.
Subject Lines
Subject lines should stay between 30-50 characters (4-7 words) to display fully on mobile. Personalization in subject lines increases open rates by 26-50%, but use company names or specific references rather than just first names.
Effective patterns include:

"Quick question about [Company]'s projects"
"Reducing delays on commercial builds"
"Project at [Location]"
"Safety compliance question"
"Your thoughts on"

Avoid:

Spam trigger words like free, earn, discount, urgent, limited time, act now, guaranteed, buy now
Sales-sounding words like "Introduction," "Partnership," "Solution"
ALL CAPS
Excessive punctuation
Emojis

Length: 1-3 words often work best. Data shows shorter subject lines mimic internal/peer email patterns.
Body Content
Avoid:

Financial terms (profit, cash bonus, credit)
Urgency language (don't miss, expires, final notice)
Marketing phrases (special offer, exclusive deal, sign up free)

Personalization remains powerful—personalized CTAs convert 202% better than generic ones—but focus on specific project references, recent company news, or industry-relevant pain points rather than just mail-merge tokens.
Call-to-Action
Use a single call-to-action to avoid decision paralysis. Interest-based CTAs like "Worth exploring how this could work for [Company]?" outperform direct meeting requests like "Book a 30-minute demo." Keep CTAs to 4-8 words and favor low-commitment language.

Content Engineering: The "Hybrid-Minimalist" HTML Strategy
The dichotomy between plain text that works but looks bad and HTML that looks good but fails can be solved with Hybrid-Minimalist HTML. This is HTML code hand-crafted to look like a standard rich-text email while providing the structure needed for a professional signature, without the "bloat" of marketing templates.
The "Unprofessional" Plain Text Myth
Plain text often looks "unprofessional" because it lacks hierarchy (bolding, spacing) and branding (logo). However, a well-formatted HTML email that mimics plain text strikes the perfect balance. It signals "I sat down and wrote this" rather than "I blasted this via Mailchimp."
Safe vs. Toxic HTML Elements
ElementStatusReasoning & Recommendation<div>AvoidHeavy nesting of divs is a newsletter trait. Use <p> for paragraphs.<table>SafeUse only for the signature. A simple 2-column table is the only reliable way to align a logo next to text in Outlook. Keep it simple.<img>CautionZero images in the body. One small image (logo) in the signature. Host the image on a fast CDN (or your custom tracking domain). Add alt text. Max dimensions 150x150px.<a href>LimitMax 2 links total (e.g., one in body, one in signature). More than 2 links triggers the "Link Farm" filter.<style>InlineDo not use <head> style blocks if possible; inline CSS (style="...") is safer for Gmail parsing. Avoid complex classes.font-sizeStandardUse 14px or 12pt. Variations in font size/color signal marketing.
Plain Text Benefits
The deliverability data strongly favors plain text:

21-42% higher click-through rates
Significantly better spam filter performance
Higher Primary inbox placement
Litmus A/B testing found 60% of customer conversions came from plain text versions
HubSpot research showed HTML emails with images had 51% fewer clicks than plain text equivalents

More importantly, plain text emails look like legitimate business correspondence. Construction executives receive dozens of marketing emails daily—the styled templates, promotional graphics, and formatted buttons all signal "mass marketing, ignore this." A plain text email resembles what a colleague or trusted advisor would send, immediately differentiating your outreach.
Making plain text look professional requires structure, not styling. Use short paragraphs (1-2 sentences), consistent spacing, and a clear flow from personalized opener to value proposition to social proof to call-to-action. Mirror how executives email colleagues—direct, concise, and focused on the recipient's interests rather than seller features.

Signature and Unsubscribe Formatting
Signature Best Practices
Plain text signatures dramatically outperform HTML signatures for cold email deliverability. Spam filters analyze text-to-HTML ratios, and heavy signature formatting signals mass marketing.
Include only essential information:

Name
Title
Company
Phone number
Optionally a plain website URL

Exclude:

Images
Logos
Multiple social media icons
Handwritten signature graphics
Promotional banners

Example plain text signature format:
Best,
James Smith
Sales Director
Company Name
+61 4XX XXX XXX
company.com
Signature Engineering for Outlook
Outlook is the primary reason signatures break. It uses the Word rendering engine.
The Fix: Use a simple HTML table structure.

Left Cell: Logo (linked to website)
Right Cell: Name, Title, Link, Phone

Avoid: Background images, rounded corners (border-radius often fails in Outlook), and flexbox.
Unsubscribe Handling
For Australian Spam Act 2003 compliance, include an opt-out mechanism in commercial messages. However, the word "unsubscribe" makes emails look like mass marketing and reduces response rates.
More effective approach for personalized B2B outreach: "If this isn't relevant for [Company], just let me know and I won't follow up." This satisfies legal requirements while maintaining a personal tone.
For higher-volume campaigns, include a simple text-based unsubscribe option in the footer. Avoid HTML buttons—use plain text. Google's 2024 requirements mandate processing unsubscribe requests within 2 days.
The "Reply to Stop" Grey Area: Some cold emailers use "Reply 'stop' to unsubscribe." While technically a "facility," it puts the burden on the sender to manually process it within 5 days. If a reply is missed and a follow-up is sent, it is a violation.
Recommended Approach: Use a plain-text link ("Opt out") at the very bottom. This satisfies the "functional" requirement and the automation requirement, without the visual weight of a marketing "Unsubscribe" block that triggers Gmail Promotions.

Tracking Domains and Sending Limits
Custom Tracking Domains
Custom tracking domains improve deliverability by isolating your reputation from other users of shared tracking domains. Set up a subdomain like track.yourdomain.com via CNAME record pointing to your ESP's tracking server.
Daily Sending Limits
Daily sending limits for a new domain should follow a careful progression:

10-30 emails per inbox during weeks 1-2
Scale to 50-100 only after full warmup
Never exceed 200-300 emails per day from a single inbox even when fully established
Gmail's technical limit is 2,000/day, but safe limits are dramatically lower

Scaling Strategy
Scale by adding inboxes and domains rather than pushing single accounts harder. Example: sending 2,000 emails daily requires approximately 20 inboxes sending 100 emails each.
Timing

Space emails 90-140 seconds apart to mimic natural sending patterns
Send during business hours in the recipient's timezone
Tuesday-Thursday shows strongest engagement rates
9-10 AM is optimal

Monitoring
Register for Google Postmaster Tools immediately to monitor Gmail-specific reputation and spam rates—this is essential visibility that takes moments to configure but provides ongoing intelligence.

Regulatory Compliance: The Australian Context
Operating within the Australian jurisdiction introduces legal requirements under the Spam Act 2003. Unlike the US (CAN-SPAM), which is "opt-out" (you can spam until told to stop), Australia is generally "opt-in." However, there is a critical exception for B2B which must be leveraged carefully.
"Inferred Consent" in B2B
The Spam Act allows for "Inferred Consent" where there is a provable, ongoing relationship or a specific set of circumstances regarding published addresses.
The "Conspicuous Publication" Rule: You may send a commercial electronic message if:

The recipient has conspicuously published their email address (e.g., on a company website or public LinkedIn profile)
The email address is not accompanied by a statement saying "no spam" or "no unsolicited mail"
Crucially: The message must be directly relevant to the recipient's business functions

Relevance Test:

Compliant: Emailing a Site Manager about "Construction Risk Software"
Non-Compliant: Emailing a Payroll Officer about "Construction Risk Software" (irrelevant to their specific function)
Non-Compliant: Emailing a general info@ address if it's not clear who reads it

Implication: You cannot "spray and pray." List segmentation must be role-based. You must document the source of the email address to prove "conspicuous publication" in case of an ACMA audit.
The Unsubscribe Mechanism
The Act mandates a "functional unsubscribe facility."
Is a Link Required? The law requires a facility, not necessarily a link, but the facility must be easy to use.
Identification Requirements
Every message must accurately identify the sender and the organization.

Legal Entity: The email must identify the legal entity (e.g., Company Pty Ltd), not just a first name
Contact Details: It must include contact details valid for at least 30 days. This is why the physical address in the footer is not just for aesthetics—it is a compliance safeguard.


Recommended Email Templates
Plain Text Template for Construction Executives
Subject: Quick question about [Company]'s commercial projects
Hi [First Name],

I noticed [Company Name] recently [specific project or news—e.g., "won the contract for the new retail development in Melbourne"].

We work with construction firms across Australia to [specific benefit—e.g., "reduce project delays by 15-20% through improved risk visibility"].

[Client name] saw [specific result] within [timeframe].

Would you be open to a quick chat about whether this could help with [Company Name]'s upcoming projects?

Best,
[Your Name]
[Title]
[Company Name]
[Phone Number]

If this isn't relevant, just let me know.
This template runs approximately 75-90 words, uses no HTML, includes a single low-commitment CTA, demonstrates research on the prospect's company, provides social proof without overselling, and handles opt-out requirements gracefully. The subject line stays under 50 characters while incorporating company-specific personalization.
Hybrid-Minimalist HTML Template
This template is designed to pass Gmail's text-to-code ratio check while rendering correctly in Outlook:
html<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size: 14px; color: #000000; }
  a { color: #0000EE; text-decoration: none; }
</style>
</head>
<body>

<p>Hi {{first_name}},</p>

<p>I noticed [Company Name] is managing the [Project Name] site. With the new NSW safety compliance audits ramping up, I was curious how you are handling the documentation load.</p>

<p>At [Your Company], we automate the specific checklists required by the 2025 code. We recently saved [Competitor] about 10 hours a week on admin.</p>

<p>Are you open to a quick 45-second video on how it works?</p>

<p>Best,</p>

<br>
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
  <tr>
    <td style="padding-right: 15px; border-right: 2px solid #ddd;">
       <img src="https://link.yourdomain.com/logo.png" alt="Company" width="50" height="50" style="display:block;">
    </td>
    <td style="padding-left: 15px;">
       <strong>Your Name</strong><br>
       <span style="color:#555;">Head of Growth | <a href="https://yourdomain.com">YourDomain.com</a></span>
    </td>
  </tr>
</table>

<p style="font-size: 10px; color: #999999; margin-top: 30px;">
  Company Pty Ltd | 100 George St, Sydney<br>
  <a href="{{unsubscribe_url}}" style="color: #999999; text-decoration: underline;">Opt out</a>
</p>

</body>
</html>

Implementation Roadmap
Phase 1: Infrastructure & Authentication (Days 1-3 / Week 1)
DNS Configuration:

Verify SPF (include:youresp.com, ensure <10 lookups)
Configure DKIM (2048-bit, aligned)
Add DMARC (p=none)

Tracking Setup:

Configure link.yourdomain.com as the Custom Tracking Domain with valid SSL

Subdomain Creation:

Create mail.yourdomain.com or get.yourdomain.com for sending to protect the root domain, or make a conscious decision to use the root domain with strict volume caps (safer for branding, riskier for reputation)

Email Accounts:

Configure Google Workspace or Microsoft 365 email accounts (preferred over third-party SMTP for cold outreach)

Monitoring:

Register for Google Postmaster Tools and Microsoft SNDS

Phase 2: The Warming Cycle (Weeks 1-4 / Weeks 2-5)
Tooling:

Connect inboxes to Smartlead or Instantly

Settings:

Start: 5 warm-up emails/day
Increment: +2-3 per day
Cap: 40 warm-up emails/day
Reply Rate: Set to 30%

Observation:

Monitor the "Spam" vs "Inbox" ratio in the tool dashboard
Do not start cold outreach until the "Inbox" rate exceeds 95% for 3 consecutive days
Maintain warmup at 15-40% of total volume even after cold outreach begins
Monitor bounce rates, open rates, and engagement daily

Phase 3: The Pilot Campaign (Week 4-6)
Targeting:

Select 50 highly relevant Construction Managers in Australia

Content:

Use the Hybrid-Minimalist template or pure plain text

Settings:

Disable Open Tracking
Max Volume: 10-30 cold emails/day
Unsubscribe: Plain text link at bottom

Metric:

Measure Reply Rate. If <5%, stop and rewrite copy. Deliverability is likely fine; the offer is the problem.

Phase 4: Scale (Week 4+ / Month 2+)
Volume:

Begin with 20-30 cold emails daily while continuing warmup
Cap sending at 50-100 emails per inbox per day

Content:

Use pure plain text formatting with no HTML
Include a single plain URL only if absolutely necessary (preferably none in first email)

Inbox Scaling:

To send 500 emails/day, provision 10 separate user seats/inboxes
Add additional domains/inboxes to scale rather than pushing single accounts

IP Monitoring:

Weekly check of the domain on Google Postmaster Tools
Weekly check of the IP on Microsoft SNDS

DMARC Enforcement:

Move DMARC policy to p=quarantine once you are confident no legitimate mail is failing authentication

Ongoing Monitoring

Daily bounce and complaint rate checks
Weekly Google Postmaster Tools review
Monthly authentication validation with MXToolbox
Immediate investigation of any blacklist notifications or sudden metric changes
If spam complaints exceed 0.1% or bounce rates exceed 2%, pause all cold outreach immediately and investigate root causes before resuming


Conclusion
The path to inbox placement runs through plain text emails, patient domain warming, and proper authentication. The observation that pure plain text lands in Gmail Primary while any HTML triggers Promotions reflects exactly what research and industry best practices confirm—modern spam filters treat HTML formatting as a mass marketing signal. Embrace plain text as a competitive advantage rather than a limitation; it differentiates your outreach from the promotional noise filling your prospects' inboxes.
For new domains specifically, the new domain requires 4-6 weeks of warming before scaling cold outreach to construction executives. Invest in an automated warmup tool like Instantly or Smartlead to build reputation across both Gmail and Outlook networks. Configure DMARC immediately to meet the May 2025 Microsoft requirements. And resist the temptation to add HTML styling—the "professional" appearance of formatted emails comes at the cost of inbox placement that determines whether anyone sees your message at all.
By strictly adhering to this roadmap, email deliverability transforms from a game of chance into a predictable engineering discipline, aligning technical protocols with the realities of the Australian construction market.
