Update the existing CityZen mobile app prototype. Do NOT redesign the app from scratch and do NOT remove the existing visual identity.

Keep the existing:
- CityZen branding and logo
- blue + green color palette
- rounded cards
- typography
- mobile-first layout
- bottom navigation
- maps
- community/social section
- volunteer section
- authority dashboard
- profile/reputation section
- city statistics
- DAO/Web3 concepts

The goal is to make CityZen's core purpose much clearer:

"CityZen doesn't just track complaints. It tracks whether the resolution can be trusted."

The central product flow should be:

REPORT → ACTION → RESOLUTION PROOF → CITIZEN VERIFICATION → VERIFIED OR REOPENED

Make this accountability loop the most prominent feature of the app.

==================================================
1. LANDING / LOGIN
==================================================

Keep the existing CityZen landing screen.

Change the subtitle from:
"Empowering Communities through Decentralized Governance"

to something more directly connected to the product:

"Report problems. Verify resolutions. Hold your city accountable."

Keep:
- Log in as Citizen
- Log in as Authority
- Connect Wallet

However, make wallet connection optional and do not make Web3 appear mandatory for ordinary citizens.

Add a small line:

"Anonymous reporting available. No personal information required."

==================================================
2. CITIZEN IDENTITY / ANONYMITY
==================================================

Redesign the Citizen Identity screen because the current combination of National ID + Photo ID + Maintain Anonymity is confusing.

Do NOT require National ID or government ID for ordinary civic reporting.

Create two optional modes:

A. Anonymous Citizen
- No name
- No phone number
- No government ID
- No public identity
- Can report civic problems and track them using a Complaint ID

B. Verified Citizen
- Optional identity verification
- Used only for features that genuinely require verified participation, such as governance or reputation

Explain clearly:

"Your identity is never shown publicly."

Keep wallet connection as an optional Web3 feature.

Do not ask citizens to upload government identification just to report a pothole, garbage issue, streetlight problem, etc.

==================================================
3. HOME SCREEN
==================================================

Keep the current Home layout but make the main call-to-action:

"Report a Problem"

Immediately underneath, show:

"Track Your Reports"

and:

"Verify a Resolution"

Add a small explanatory card:

"Resolved doesn't always mean solved."

Text:
"Authorities can mark an issue resolved, but the community has the final verification."

This should introduce CityZen's main innovation.

==================================================
4. REPORT A PROBLEM
==================================================

Keep the existing reporting flow:
- photo
- category
- location
- description
- anonymous reporting

Add:
- automatically generated Complaint ID after submission
- timestamp
- location
- evidence attached to the report

After submitting, show a confirmation screen:

"Report Submitted"

Complaint ID:
CZ-2026-0001

Status:
REPORTED

Message:
"Save this Complaint ID to track your report without revealing your identity."

Add a button:
"Track My Complaint"

==================================================
5. COMPLAINT TRACKING
==================================================

Strengthen the existing complaint tracking screen.

Instead of only showing a simple progress tracker, show the complete lifecycle:

REPORTED
↓
UNDER REVIEW
↓
ACTION ASSIGNED
↓
RESOLUTION SUBMITTED
↓
AWAITING CITIZEN VERIFICATION
↓
VERIFIED / REOPENED

Each stage should have:
- date
- responsible party
- short description
- evidence if available

Make it clear that "Resolved" is NOT the final state.

==================================================
6. RESOLUTION VERIFICATION — IMPORTANT
==================================================

Add a dedicated screen after an authority submits a resolution.

Title:

"Is this problem actually fixed?"

Show:
- original citizen photo
- authority resolution photo
- resolution description
- resolution date
- location
- evidence status

Give two large options:

✓ VERIFY RESOLUTION

and

✕ CHALLENGE RESOLUTION

Underneath:

"Your response helps keep civic records accurate."

==================================================
7. CHALLENGE RESOLUTION
==================================================

When the citizen selects "Challenge Resolution", show:

"Why are you challenging this resolution?"

Options:

- Problem still exists
- Only partially fixed
- Wrong location
- Evidence does not match
- Problem has returned
- Other

Allow an optional short explanation and additional photo evidence.

Submit button:

"Submit Challenge"

After submission:

Status:
REOPENED

Message:

"The previous resolution remains permanently visible in the complaint history."

This is an important feature and should be visually prominent.

==================================================
8. COMPLAINT HISTORY / AUDIT TRAIL
==================================================

Create a clear timeline screen.

Example:

CZ-2026-0001
Pothole — Outer Ring Road

11 Oct
Report submitted

12 Oct
Issue verified by field officer

14 Oct
Repair crew assigned

18 Oct
Authority submitted resolution evidence

20 Oct
Citizen challenged resolution

20 Oct
Issue REOPENED

25 Oct
New resolution submitted

27 Oct
Citizen verified resolution

FINAL STATUS:
VERIFIED

Every event should remain visible.

Do not delete previous statuses when a complaint is reopened.

==================================================
9. RECURRING / CHRONIC PROBLEMS
==================================================

Keep the existing "Top Recurring Problems" concept.

Strengthen it into a major CityZen feature.

Instead of simply showing popular problem categories, show persistent infrastructure issues.

Example:

STREETLIGHT EL-04

12 reports
4 resolutions
3 reopenings

⚠ Persistent Issue Detected

"Repeated resolution failures suggest this problem requires structural intervention."

Other examples:
- recurring pothole
- repeatedly overflowing drain
- streetlight repeatedly failing
- garbage hotspot

Add a button:

"View Problem History"

==================================================
10. CITY MAP
==================================================

Keep the existing map.

Add different marker/status types:

Reported
Under Review
Resolution Submitted
Verified
Reopened
Persistent Issue

Allow users to tap a marker and see:

Problem ID
Category
Current Status
Number of reports
Number of reopenings

For recurring problems show:

"Persistent Issue"

==================================================
11. COMMUNITY / SOCIAL FEED
==================================================

Keep the existing community feed.

But make it civic accountability focused rather than looking like a generic social media app.

Posts can include:

- civic problem reports
- authority updates
- resolution evidence
- verification results
- reopened issues
- community support

Add actions such as:

"Support this report"

"View evidence"

"Challenge resolution"

"Thank a Worker"

Avoid making likes/followers the main focus.

==================================================
12. AUTHORITY DASHBOARD
==================================================

Keep the existing Authority Dashboard and statistics.

Make the following especially prominent:

- New reports
- Pending reports
- Overdue reports
- Resolution submissions awaiting verification
- Reopened complaints
- Persistent infrastructure problems

Add a dedicated section:

"Needs Attention"

Examples:

⚠ 8 resolutions challenged
⚠ 5 recurring problems detected
⚠ 12 overdue reports

Authority users should be able to:

- open complaint
- review citizen evidence
- assign action
- update status
- upload resolution evidence
- submit resolution

==================================================
13. AUTHORITY RESOLUTION SUBMISSION
==================================================

When an authority marks a problem as resolved, do NOT immediately show "Closed".

Instead:

"Submit Resolution Evidence"

Required:
- resolution description
- after-photo/evidence
- completion date
- location confirmation

Then status becomes:

RESOLUTION SUBMITTED
AWAITING CITIZEN VERIFICATION

This reinforces that authorities cannot unilaterally declare an issue permanently solved.

==================================================
14. EVIDENCE HEALTH
==================================================

Add a small "Evidence Health" indicator to complaints.

Example:

Evidence Health: 86/100

Based on:
- recent evidence
- location match
- before/after evidence
- citizen confirmation
- number of challenges

Use this as a trust indicator, not as a replacement for citizen verification.

==================================================
15. WEB3 / BLOCKCHAIN
==================================================

Keep Web3 features, but make their purpose clearer.

Do NOT make the app feel like a crypto-first application.

Web3 should support civic accountability.

Use blockchain / hashes for:

- complaint creation record
- authority action
- resolution submission
- verification
- reopening
- audit history

Do NOT put personal information, government IDs, or full photographs directly on-chain.

Add a simple label:

"Tamper-evident civic record"

When tapped, explain:

"Important complaint events are cryptographically recorded so that the history cannot be silently altered."

Wallet connection should remain optional for normal reporting.

==================================================
16. CIVIC TOKENS / REPUTATION
==================================================

Keep the existing reputation and CIVIC points concept, but make it secondary.

Do NOT make earning tokens the reason users report problems.

Reframe points as:

"Civic Contribution"

Examples:
- useful report
- verified evidence
- successful community validation
- volunteer participation
- helpful civic contribution

Avoid giving higher voting power simply because someone has accumulated more tokens unless explicitly needed for a future governance feature.

==================================================
17. VOLUNTEER
==================================================

Keep the existing Volunteer section.

Keep:
- drives
- community activities
- contribution tracking
- badges

However, present it as a secondary civic participation feature rather than the main purpose of CityZen.

==================================================
18. DAO / GOVERNANCE
==================================================

Keep the DAO & Treasury screens because they demonstrate the long-term decentralized governance vision.

However, visually separate them from the everyday complaint workflow.

Add a heading:

"Future Civic Governance"

Explain that governance can eventually allow communities to participate in:
- proposals
- prioritization
- civic funding
- community decisions

Do not make DAO functionality necessary for submitting or resolving a normal civic complaint.

==================================================
19. PROFILE
==================================================

Keep the profile screen.

Show:
- civic contribution
- verified contributions
- volunteer activity
- badges
- optional wallet
- reputation

Make privacy prominent.

If the user reports anonymously, their public profile should NOT reveal which anonymous complaints belong to them.

==================================================
20. OVERALL UX
==================================================

Maintain the current visual design.

Do not make the application look like a completely different product.

The biggest visual hierarchy should be:

1. Report a Problem
2. Track a Problem
3. Verify a Resolution
4. Challenge / Reopen
5. City Status / Map
6. Community
7. Volunteer / Reputation
8. Web3 / Governance

The user should understand CityZen's main purpose within 5 seconds of opening the app.

Add the recurring message throughout the app:

"Resolved doesn't always mean solved."

And use this as the main product statement:

"CityZen doesn't just track complaints. It tracks whether the resolution can be trusted."

The final prototype should feel like a polished civic accountability platform with Web3 as the trust layer, rather than a cryptocurrency application with civic features.