# CBET-Resource: Production-Ready Implementation Plan

**Status**: MVP Scoped | Learner-First | Freemium Model | Offline-Capable  
**Last Updated**: April 2026  
**Owner**: Engineering + Product + Content Team

---

## Executive Summary

This document outlines a **production-ready, scalable MVP** for cbet-resource that prioritizes:

- **Real content over UI polish** (Phase 0: content seeding before launch)
- **Trust through transparency** (real download counts, verified badges, documented review process)
- **Learner-first acquisition** (free browsing with no friction)
- **Offline-first design** (PWA/caching from Phase 1, not upsold later)
- **Hypothesis-driven freemium** (premium features chosen strategically, not reactively)

---

## Phase 0: Content & Ops Foundation (Weeks 1-3)

**Goal**: Launch with 30-50 real resources seeded by 10-15 educators. Define operational workflows before UI.

### 0.1 Content Seeding

**Owner**: Product + Content Manager  
**Deliverables**:

- [ ] Identify and recruit 10-15 TVET educators (Kenya-based, active trainers)
- [ ] Create onboarding packet: department list, resource type guidelines, CBET alignment checklist, file formats accepted
- [ ] Manually collect 30-50 real resources across departments (Automotive, ICT, Business, etc.)
- [ ] Store in staging database or Google Drive (temporary; will migrate to system)
- [ ] Verify each resource meets basic standards (PDF readable, title clear, department mapped)

**Why this matters**:  
Mock data destroys trust. When educators see fake download counts, the platform becomes a toy. Real content from real trainers signals legitimacy and creates a "launch with momentum" effect.

**Success metric**: 30+ resources live before UI launch date.

---

### 0.2 Admin Review Workflow (Non-UI)

**Owner**: Admin Operations Lead  
**Deliverables**:

- [ ] Define **Reject Criteria Checklist** (written document):
  - CBET unit mapping required? (Y/N)
  - File quality standards (legible, complete, etc.)
  - Plagiarism/IP concerns flagged?
  - Completeness (lesson plan must include objectives, activities, assessment)
  - Language/grammar acceptable for publication?
- [ ] Assign **named review owner** (e.g., "Sarah reviews all uploads Mon-Fri 9am; 24h SLA")
- [ ] Define escalation path (who approves edge cases?)
- [ ] Create Review Log template (spreadsheet: upload date, resource name, reviewer, decision, decision time, feedback)
- [ ] Test workflow with 5-10 seeded resources (dry run before system goes live)

**Why this matters**:  
The admin queue is a bottleneck. Documenting _how_ decisions are made (not just that they're made) scales the process and lets trainers understand rejection reasons.

**Success metric**: Reject criteria documented, first 10 resources reviewed manually within SLA.

---

### 0.3 Database Schema (Simple MVP)

**Owner**: Backend/Data Team  
**Deliverables** (mock/simple implementation):

```
Resources Table:
- id (UUID)
- title (string, max 120 chars)
- department (string: ENUM of Kenya TVET departments)
- resource_type (ENUM: lesson_plan | notes | scheme_of_work | assessment | other)
- trainer_id (UUID, foreign key)
- file_url (string, S3 or similar)
- description (text, max 500 chars)
- cbet_units (array of strings, e.g., ["Unit 101", "Unit 205"])
- created_at (timestamp)
- approved_at (timestamp, nullable until approved)
- approval_notes (text, nullable)
- download_count (integer, default 0)
- status (ENUM: pending_review | approved | rejected)
- is_approved_by (UUID, foreign key to admin user)
- rating (float 1-5, nullable; average of learner ratings)

Trainers Table:
- id (UUID)
- name (string)
- email (string, unique)
- department (string)
- bio (text, optional)
- verified_badge (boolean, default false)
- created_at (timestamp)
- total_uploads (integer, default 0)
- total_downloads (integer, default 0)
- is_admin (boolean, default false)

Downloads Table (analytics):
- id (UUID)
- resource_id (UUID, foreign key)
- learner_id (string, optional; null if anonymous)
- downloaded_at (timestamp)
- retention_seconds (integer; how long learner used resource)
```

**Why this matters**:  
Clean schema allows real download tracking from day 1. No "we'll add analytics later" — download counts are baked in.

---

## Phase 1: Learner-First MVP with Real Data (Weeks 4-8)

**Goal**: Launch public platform with 30-50 real resources, zero-friction browsing, live download counts, offline capability.

### 1.1 Resource Browser Component

**Owner**: Frontend Lead  
**Deliverables**:

- [ ] ResourceBrowser component:
  - Grid display (3-4 columns, responsive)
  - Each card shows: Title, Trainer Name, Department, Resource Type, **Real Download Count**, Quick Preview button
  - Search bar (debounced, filters across title + description + trainer name)
  - Filter buttons: Department (multi-select), Resource Type (multi-select)
  - Sort options: Recently Approved, Most Downloaded, Rating (when available)
  - Empty state with helpful messaging ("No resources in ICT yet. Browse other departments or sign up to contribute")

- [ ] ResourceCard component (reusable):
  - Trainer avatar/name with verification badge (if applicable)
  - Download count with ➓ icon (real number, refreshed hourly)
  - Quick description (~80 chars)
  - "Preview" button (opens modal) + "Download" button
  - Rating stars (if feedback available) + # of ratings
  - Responsive design (mobile: 1 column, tablet: 2, desktop: 3-4)

- [ ] Search & Filter Logic:
  - Debounce search input (300ms)
  - Filter persists in URL params (shareable: `/browse?department=ICT&type=lesson_plan`)
  - Download counts update live (not cached; refresh every 60s background)

**Why this matters**:  
Real download counts visible from day 1 build credibility. Trainers see immediate feedback: "My resource was downloaded 23 times today." Learners see popularity signals.

**Success metric**:

- Learner can find resource in <30 seconds
- Download counts visible and updating
- Mobile fully responsive

---

### 1.2 Department Grid & Coverage

**Owner**: Content Manager + Frontend  
**Deliverables**:

- [ ] DepartmentGrid component displayed on Hero or dedicated "Browse by Department" section:
  - 8-12 department cards (Kenya TVET departments)
  - Each card: Department name, icon, # of resources available, # of trainers, sample topics
  - Click to filter ResourceBrowser to that department
  - Cards that show 0 resources display: "Coming soon" + email signup to get notified

**Kenya TVET Departments (example list)**:

- Automotive Technology (e.g., 12 resources, 3 trainers)
- Business & Entrepreneurship (e.g., 18 resources, 5 trainers)
- Information & Communication Technology (e.g., 25 resources, 7 trainers)
- Construction & Civil Engineering (e.g., 8 resources, 2 trainers)
- Hospitality & Tourism (e.g., 6 resources, 1 trainer)
- [... more TBD based on content seeding]

**Why this matters**:  
Department cards make the platform's scope visible. A learner from Hospitality instantly sees "6 resources here" and can browse. Creates a coverage roadmap.

**Success metric**: All departments displayed, real resource counts visible.

---

### 1.3 Trust Layer: Badges, Approval Feed, Verification

**Owner**: Frontend + Product  
**Deliverables**:

- [ ] Trainer Verification Badges:
  - "Government-Registered TVET Center" (blue badge) — trainer affiliated with verified institution
  - "Years Active" badge (e.g., "4+ years uploading") — shows tenure
  - "High Rating" badge (e.g., "⭐ 4.5+") — learner reviews average >4.5

- [ ] "Recently Approved" Feed (5-10 latest approved resources):
  - Displayed on Hero or dedicated widget
  - Shows: New resource title, trainer name, department, ✓ Approved [timestamp]
  - Purpose: Signals platform activity and freshness
  - Auto-refreshes every 15 minutes

- [ ] Approval Timeline (transparent to trainers):
  - "Reviewed & Approved" label on resource card shows approval date
  - Hover tooltip: "Approved by admin on Mar 25"
  - (Admin name not revealed, but approval legitimacy is)

**Why this matters**:  
Transparency builds trust. Showing real approval badges, recent activity, and verified trainers combats skepticism in a market still learning about digital education.

**Success metric**:

- 50%+ of resources have at least one trust badge
- "Recently Approved" feed updates live
- Learners report higher confidence in resource quality (survey)

---

### 1.4 Real-Time Download Counter (Backend Instrumentation)

**Owner**: Backend  
**Deliverables**:

- [ ] Endpoint: `GET /resources/{id}/metadata` → returns `{ download_count: 324, rating: 4.2, ... }`
- [ ] Log every download: `POST /analytics/download` → increments counter
- [ ] Cache download counts with TTL (60s) to avoid DB thrashing
- [ ] Expose in UI: ResourceCard displays live count, refreshes on interval
- [ ] Trainer Dashboard: "Your resources were downloaded X times this week"

**Why this matters**:  
Download counts are social proof. Without them, trainers have no feedback loop. With them, the platform feels alive.

**Success metric**:

- Download counts accurate within 60s
- Backend handles 100+ concurrent downloads without degradation
- No mock data anywhere in UI

---

### 1.5 Offline-First Architecture (PWA Caching)

**Owner**: Frontend + DevOps  
**Deliverables**:

- [ ] Service Worker:
  - Cache resource list (ResourceBrowser metadata: titles, departments, type, download counts)
  - Cache all PDF files on download (store locally in browser)
  - Offline page: "Browse cached resources, download history available"
  - Cache invalidation: refresh on app boot if online

- [ ] Resource Download Strategy:
  - User can "Download for Offline" (explicit CTA)
  - Stores PDF + metadata locally (IndexedDB or SQLite via sql.js)
  - Offline view: List of downloaded resources, searchable
  - Sync on reconnection: Mark as downloaded, sync analytics

- [ ] Progressive Enhancement:
  - Online: Full browsing, real-time filters, live counts
  - Offline: Browse cached list, access downloaded PDFs
  - Reconnect: Auto-resume browsing, push analytics

**Why this matters**:  
Kenya's internet is spotty. Offline-first isn't a premium feature; it's table stakes for learners in rural areas or on limited mobile data. Building it from Phase 1 means architecture is proven, not bolted on.

**Success metric**:

- User can download resource online, access offline on next boot
- Service worker cache hits >90%
- Learner retains access for 14 days without reconnection

---

### 1.6 Payment Foundation (Non-Functional UI)

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Update Payment section → "Premium Features" (clear not-yet-live messaging)
- [ ] Display premium tier options (see Section 2.1 for final spec):
  - "Free Tier": Browse, download, offline access (ALL RESOURCES)
  - "Premium Tier": Certificates, advanced search, bookmarks, batch downloads (TBD pricing)
- [ ] Email capture form: "Get notified when Premium launches"
  - Call: `POST /waitlist/premium` → stores email + date
  - Confirmation: "Check your email for updates"
  - No payment integration yet; purely interest collection

**Why this matters**:  
Gathering email addresses early lets you test conversion hypothesis before building expensive checkout. Hypothesis: "Educators will pay 50KES/month for offline bulk packs + certificates" — validate this via email interest first.

**Success metric**:

- 100+ emails collected by end of Phase 1
- Premium copy is clear (no confusion about what's free vs. paid)
- No payment page shown yet

---

### 1.7 Hero Section Rewrite (Learner-First Narrative)

**Owner**: Product + Marketing  
**Deliverables (copy changes)**:

- [ ] Hero headline: ~~"Quality Resources, Empowered Learning"~~ → **"Find Verified CBET Learning Materials in Seconds"**
- [ ] Hero subheadline: ~~"Trainers upload, admin reviews..."~~ → **"Browse 30+ resources for free. Download PDFs to work offline. No login required."**
- [ ] Primary CTA: ~~"Explore Resources"~~ → **"Browse Now"** (button text)
- [ ] Secondary CTA: ~~"Become a Trainer"~~ → Remove from hero; keep in "For Trainers" section below

- [ ] Update stats to real numbers:
  - 30+ Resources (from seeding)
  - 10+ Verified Trainers (from seeding)
  - 1-day Admin Review SLA (ops guarantee)

**Why this matters**:  
Copy directs user attention. "Browse now" → learner. "Become a trainer" → trainer. No more generic "Get Started."

**Success metric**:

- 60%+ of hero visitors click "Browse Now" (vs. secondary action)
- Time-to-resource <30 seconds

---

### 1.8 Navigation Restructuring

**Owner**: Frontend + Product  
**Deliverables**:

- [ ] Update Header nav links:

  ```
  Logo | Browse Resources | For Trainers | About | Sign In (future)
  ```

  - Remove "Start Here" (confusing)
  - "Browse Resources" → links to ResourceBrowser
  - "For Trainers" → section with upload CTA + guidelines
  - "About" → FAQ + admin guidelines

- [ ] Footer links updated to match new structure

**Why this matters**:  
Clear navigation reduces friction. Learner path obvious: "Browse" is the homepage, not a hidden feature.

---

### 1.9 FAQ & Admin Guidelines

**Owner**: Product + Ops  
**Deliverables** (new pages):

- [ ] Admin Guidelines page (`/admin-guidelines`):
  - What gets approved? (Criteria from Phase 0.2)
  - What gets rejected? (Examples + reasons)
  - Review timeline: "Most uploads reviewed within 24 hours"
  - Feedback loop: "If rejected, we'll email you why + how to resubmit"
  - Link from "For Trainers" section

- [ ] Expand FAQ:
  - Add: "How is content reviewed?"
  - Add: "Why was my upload rejected?"
  - Add: "How do I see if my resource was downloaded?"
  - Update: Clarify offline browsing is free (not premium)

**Success metric**:

- Trainer reads guidelines before uploading (completion rate >70%)
- Rejection rate stabilizes at 10-15% (expected for quality bar)

---

## Phase 2: Freemium Revenue Model & Premium Features (Weeks 9-14)

**Goal**: Define and build premium feature set. Establish payment infrastructure. Convert waitlist emails to paid.

### 2.1 Premium Feature Definition & Hypothesis

**Owner**: Product + Business  
**Deliverables**:

- [ ] Write down **Freemium Feature Matrix**:

| Feature                                        | Free | Premium | Rationale                                                                   |
| ---------------------------------------------- | ---- | ------- | --------------------------------------------------------------------------- |
| Browse Resources                               | ✓    | ✓       | Core value—never locked                                                     |
| Download Offline                               | ✓    | ✓       | Table stakes for Kenya market; free tier includes 1 collection of resources |
| Certificates/Completion                        | ✗    | ✓       | Institutional value; educators want proof of learning for portfolios        |
| Unlimited Batch Downloads                      | ✗    | ✓       | Premium QoL: download 50 resources at once vs. 5/month free                 |
| Advanced Search (difficulty, duration, author) | ✗    | ✓       | Learner UX improvement; not core to discovery                               |
| Bookmarks/Collections                          | ✗    | ✓       | Personalization; learners curate learning paths                             |
| Ad-free browsing                               | ✗    | ✓       | Future when platform ads introduced                                         |
| Trainer Analytics                              | ✗    | Premium | Trainers track impact (dashboard sees download trends)                      |

- [ ] Write **Conversion Hypothesis**:

  > "Educators will pay 50-100 KES/month for offline bulk-download packs + completion certificates, targeting trainers who want to track learner progress. We'll reach 5% conversion from 10k monthly learners by month 6."

- [ ] Define **Pricing Tiers**:
  - Free: Always free, no credit card
  - Premium: 99 KES/month (M-Pesa) or 2,500 KES/year (annual discount ~60%)
  - Bundle: "Trainer Premium" – same features + analytics dashboard + featured listing (200 KES/month, TBD)

- [ ] Identify **Premium Launch Trigger**: Wait until 1k+ monthly active learners OR email interest >200 addresses (whichever first)

**Why this matters**:  
Avoid building guesses. Write down what you're betting on (premium features _and_ who'll pay). Test hypothesis via email interest first—expensive checkout shouldn't be first experiment.

**Success metric**:

- Feature matrix reviewed + approved by stakeholders
- Hypotheses explicitly documented
- Premium launch gates defined (not "whenever we feel ready")

---

### 2.2 Premium Checkout Integration (M-Pesa + Card)

**Owner**: Backend + Frontend  
**Deliverables**:

- [ ] Stripe/Flutterwave integration (payment processor):
  - M-Pesa Express (STK Push) for mobile-first users
  - Card payments as fallback
  - Webhook handling: `payment.success` → unlock premium features
  - Refund handling: 30-day money-back guarantee

- [ ] Premium Gate Component (UI):
  - Triggered when learner clicks locked feature (e.g., "Batch Download")
  - Modal: Feature description + pricing + 1-click purchase
  - Post-purchase: Feature unlocked, confirmation email, receipt

- [ ] Subscription Management Dashboard (learner view):
  - Upgrade/downgrade billing
  - Download invoice
  - Cancel subscription

**Success metric**:

- 99.5% payment success rate
- <2% fraud rate
- <24h support response for payment issues

---

### 2.3 Certificate Generation & Delivery

**Owner**: Backend  
**Deliverables** (if including in Premium):

- [ ] Certificate template: PDF with learner name, resource completed, date, trainer signature (placeholder), QR code for verification
- [ ] Trigger: System detects learner completed resource (e.g., accessed PDF for >10 min + took assessment)
- [ ] Email delivery: "Your certificate is ready" + PDF download
- [ ] Verification endpoint: QR code links to `/verify/[cert_id]` → shows certificate validity
- [ ] Trainer can issue certificates manually: Dashboard button "Issue Certificate to Learner"

**Success metric**:

- 50+ certificates issued by month 2 of Premium
- Verification endpoint queried >100x (proof of social sharing)

---

### 2.4 Analytics Dashboard (Trainer Premium)

**Owner**: Frontend + Backend  
**Deliverables** (if including Trainer Premium):

- [ ] Trainer Dashboard page:
  - Overview: Total uploads, total downloads, average rating
  - Resource performance: Table of uploads, each showing downloads, rating, approval date, avg. time spent
  - Engagement: Downloads over time (chart: last 30 days)
  - Learner feedback: Recent comments/ratings on resources

- [ ] Alerts: "Your resource was rated 5⭐" or "Downloaded 50 times this week"

**Success metric**:

- Trainer logs in >2x/week on average
- 40%+ retention (trainer keeps uploading after 3 months)

---

## Phase 3: Trainer Experience & Community (Weeks 15-20)

**Goal**: Scale trainer acquisition and retention. Build community features.

### 3.1 Trainer Upload Workflow (Functional)

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Upload form (in trainer dashboard or modal):
  - File upload: Drag-and-drop + click-to-select
  - Resource details: Title, department, type, CBET units, description
  - File validation: PDF/DOCX only, max 25MB
  - Preview before submit: Shows how card will appear to learners
  - Submit → confirmation: "Thank you! Your resource is under review. We'll email when it's live (usually <24h)."

- [ ] Real-time status tracking:
  - Dashboard: "My Uploads" table shows status (Pending Review → Approved → Published)
  - Email notifications: "Your resource 'Lesson Plan 101' was approved" or "Your resource needs revisions: [reason]"

**Success metric**:

- Trainer can upload in <5 minutes
- 80%+ of first-time uploads approved (expectations met)
- Average upload-to-publish time: 18 hours

---

### 3.2 Trainer Profile & Reputation

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Public trainer profile page (`/trainer/[id]`):
  - Trainer bio, institution, department, verification badges
  - All resources they've uploaded (paginated)
  - Average rating of their uploads
  - Total downloads across all resources
  - "Follow" button (future community feature)
  - Email contact (optional, trainer controlled)

- [ ] Trainer leaderboard (future, Phase 4): "Top 10 Trainers This Month" on homepage

**Success metric**:

- Trainer profile page viewed >50x per active trainer (peer recognition)
- Follow button clicked >100x by end of Phase 3

---

### 3.3 Learner Reviews & Ratings

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Post-download feedback prompt (after 5 min of viewing PDF):
  - "How useful was this resource?" (1-5 stars)
  - Optional comment box
  - Submit → rating appears on resource card within 1 hour

- [ ] Resource card shows:
  - Average rating (e.g., ⭐ 4.3 / 23 reviews)
  - Clickable to see recent reviews

- [ ] Quality gates: Reviews flagged as spam (all 1-star + abusive text) are hidden

**Success metric**:

- 10%+ of downloaders leave a rating
- Average rating >4.0 across platform (proof of quality)
- No spam reviews appear

---

### 3.4 Community Engagement (Optional for MVP)

**Owner**: Product  
**Deliverables** (if scope allows):

- [ ] Discussion forum per resource (simple):
  - Learner comments: "This was great, but I found Unit 105 confusing"
  - Trainer can reply: "Good catch, here's a follow-up video"
  - Moderation: Flag inappropriate comments

- [ ] "Trending This Week" resource feed
- [ ] Trainer follow system: Get notified when favorite trainer uploads new resource

**Success metric**:

- 20%+ of resources have >1 comment
- Trainer-to-learner response rate >50%

---

## Phase 4: Scale & Optimization (Weeks 21+)

**Goal**: Platform efficiency, analytics, and growth features.

### 4.1 Analytics & Dashboarding

**Owner**: Data + Backend  
**Deliverables**:

- [ ] Admin analytics dashboard:
  - Daily active learners, new uploads, approval rate, avg. review time
  - Resource quality metrics: avg. rating, flagged/rejected rate
  - Department coverage: Resources available per department, gaps

- [ ] Business metrics:
  - Conversion funnel: Visitors → Browsers → Downloaders → Premium signups
  - Churn rate: Premium cancellations
  - Revenue tracking: MRR, LTV

**Success metric**:

- Admin dashboards updated daily
- Data informs feature decisions (e.g., "ICT has 40% of downloads → invest there")

---

### 4.2 Search & Recommendation Engine

**Owner**: Backend  
**Deliverables**:

- [ ] Full-text search (Elasticsearch or similar):
  - Fuzzy matching ("Busnes Suudies" → "Business Studies")
  - Search filters: Department, type, rating, date uploaded
  - Search analytics: Track popular queries → inform content gaps

- [ ] Recommendation engine (simple):
  - "Learners who downloaded this also liked..."
  - Trained on download co-occurrence data

**Success metric**:

- Search handles 100+ queries/min without degradation
- Recommended resources get 20% CTR

---

### 4.3 Mobile App (Optional, Future)

**Owner**: Mobile Engineering  
**Scope**: Post-MVP if user demand signals
**Approach**: React Native or Flutter to reuse web logic

---

## Architecture & Scalability Notes

### Technology Stack (MVP)

```
Frontend: React 19 + TypeScript + Tailwind CSS + Vite
State: React Context (simple) or Zustand (if needed)
PWA: Service Worker + Workbox
Backend: Node.js/Express or similar (fast iteration)
Database: PostgreSQL (relational; strong for resource metadata)
File Storage: S3 or Google Cloud Storage (PDFs)
Payment: Stripe or Flutterwave (M-Pesa support)
Analytics: Mixpanel or Segment (event-based)
Search: PostgreSQL full-text (simple) or Elasticsearch (scale)
```

### Scalability Checkpoints

1. **Phase 1**: Supports 10k monthly active learners, 100 uploads/week
2. **Phase 2**: Supports 50k MAU, 500 uploads/week, payments stable
3. **Phase 3**: Supports 100k MAU, trainer retention >50%, discussion moderation scales
4. **Phase 4**: Supports 500k MAU, recommendation engine ML-powered, multi-region deployment

### Database Indexing (from day 1)

```sql
CREATE INDEX idx_resources_department ON resources(department);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX idx_downloads_resource_id ON downloads(resource_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at DESC);
```

### Caching Strategy

- ResourceBrowser list: 60s cache (fresh, not stale)
- Download counts: 60s cache (real-time signals important)
- User profiles: 5min cache
- Department list: 1hr cache (rarely changes)

---

## Success Metrics & Goalposts

### Phase 1 Goalposts (MVP Launch)

- [ ] 30+ real resources live
- [ ] 0 mock data in UI
- [ ] 100+ learners browsing (first week)
- [ ] Offline download functionality tested
- [ ] 24h admin review SLA met for 90% of uploads
- [ ] 50+ waitlist signups for Premium

### Phase 2 Goalposts (Premium Launch)

- [ ] 10k+ monthly active learners
- [ ] 5% Premium conversion rate
- [ ] 50+ certificates issued
- [ ] 2k monthly recurring revenue (MRR)

### Phase 3 Goalposts (Trainer Growth)

- [ ] 50+ active trainers
- [ ] 200+ resources total
- [ ] 40%+ trainer retention (uploading after 3 months)
- [ ] 10% of resources have learner reviews

### Phase 4 Goalposts (Scale Ready)

- [ ] 100k+ monthly active learners
- [ ] 500+ resources across all departments
- [ ] 100+ paid trainers (revenue-sharing if model changes)
- [ ] Topic-specific recommendations driving 15% of downloads

---

## Risk Mitigations

| Risk                                       | Mitigation                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 0 fails: Can't recruit educators** | Start with 5-10 personally recruited + incentivize with "featured trainer" badge + email to TVET networks                                                           |
| **Admin review SLA broken**                | Pre-document criteria + run dry-run with 10 resources. If still 48h+, hire part-time reviewer or create auto-accept rules for known-good sources                    |
| **Offline caching breaks on update**       | Service Worker versioning + manual cache buster. Test monthly on real devices.                                                                                      |
| **Payment processing fails**               | Use Stripe fallback + manual payment option ("Email invoice, pay via bank transfer") for first 50 transactions                                                      |
| **Low Premium interest**                   | Email waitlist with premium feature updates (certificates, offline packs) to test demand. If <2% interest, pivot to annual plan or B2B model (school subscriptions) |
| **Download counts don't build trust**      | A/B test: half of users see download counts, half don't. If no engagement lift, add learner testimonials instead.                                                   |

---

## Product Owner Responsibilities

- [ ] Approve Phase 0 content seeding list
- [ ] Assign admin review owner (named person)
- [ ] Sign off on Premium feature matrix & pricing
- [ ] Weekly review of real download counts + engagement (Phase 1+)
- [ ] Manage email waitlist outreach (Phase 2)
- [ ] Monitor analyst + resource quality feedback (Phase 3+)

---

## Timeline Summary

| Phase   | Duration    | Key Deliverable                                     |
| ------- | ----------- | --------------------------------------------------- |
| Phase 0 | Weeks 1-3   | 30+ real resources, documented admin workflow       |
| Phase 1 | Weeks 4-8   | Live MVP: browse, download, offline, real counts    |
| Phase 2 | Weeks 9-14  | Premium features, payment integration, certificates |
| Phase 3 | Weeks 15-20 | Trainer dashboard, reviews, community               |
| Phase 4 | Weeks 21+   | Search, analytics, scale to 100k+ users             |

**Total MVP-to-Scale**: ~6 months to Phase 3 readiness (trainer + learner growth sustainable)

---

## Appendix: Sample Content Seeding

**Target Departments (initial 8)**:

1. Automotive Technology (engine mechanics, diagnostics)
2. Business & Entrepreneurship (accounting, business management)
3. ICT (web design, networking, databases)
4. Construction & Civil Engineering (CAD, building design)
5. Hospitality & Tourism (kitchen operations, front office)
6. Cosmetology & Beauty (hair care, skin care)
7. Agriculture & Agribusiness (crop farming, animal husbandry)
8. Health & Social Services (nursing basics, first aid)

**Sample Resources (per department)**:

- Automotive: "Engine Basics Lesson Plan (Unit 101)" (PDF, 3MB)
- Business: "Financial Statements Scheme of Work (Unit 205)" (PDF, 2MB)
- ICT: "HTML/CSS Notes (Unit 301)" (PDF, 4MB)
- [... 5-10 more per department with different types]

**Recruitment Message to Educators**:

> "We're building a platform where trainers share CBET resources. You're invited to upload 3-5 of your best materials for free. Your resources will be reviewed within 24 hours and visible to thousands of learners. You get a verified badge and attribution. No payment yet—help us launch with real content. Interested?"

---

## Next Steps (Immediate)

1. **Assign Phase 0 owner** (content seeding lead)
2. **Recruit first 10 educators** (this week)
3. **Document admin review workflow** (by end of week)
4. **Seed 20-30 resources** (by Week 2)
5. **Review + approve Phase 1 component specs** (this week)
6. **Begin Phase 1 development** (Week 4)

---

**Document Version**: 1.0 Production Ready  
**Author**: Engineering + Product Team  
**Approval**: [Pending]  
**Last Reviewed**: April 2026
