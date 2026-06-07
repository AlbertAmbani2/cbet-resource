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

## Phase 4: Learner Reviews & Community (Weeks 21-23)

**Goal**: Add social proof via learner reviews and ratings system. Build community engagement.

### 4.1 Rating & Review System

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Database table: `reviews`
  - id (UUID)
  - resource_id (FK to resources)
  - learner_id (string, optional for anonymous reviews)
  - rating (integer 1-5)
  - review_text (text, max 300 chars)
  - created_at, updated_at (timestamps)
  - is_verified_download (boolean; only rate if actually downloaded)

- [ ] Backend endpoints:
  - `POST /api/resources/{id}/reviews` - Create review (auth optional, tracks learner)
  - `GET /api/resources/{id}/reviews?page=1&limit=10` - List reviews with pagination
  - `PUT /api/reviews/{id}` - Update own review
  - `DELETE /api/reviews/{id}` - Delete own review
  - `GET /api/resources/{id}/rating` - Get aggregated rating (avg, count, distribution)

- [ ] Frontend components:
  - ReviewForm: 5-star picker + text input (max 300 chars), submit + cancel
  - ReviewsList: Paginated reviews with learner name (anonymous if opted), rating, text, date
  - ReviewsModal: Triggered by clicking review count on ResourceCard
  - ResourceCard updates: Display avg rating badge, review count as link

- [ ] Quality gates:
  - Reviews hidden if flagged as spam (all 1-star + abusive language)
  - One review per resource per learner (prevent duplicate/fake ratings)
  - Auto-hide reviews with profanity

- [ ] E2E tests (6 test cases):
  1. Submit new 5-star review + verify appears on card
  2. Update own review (3-star → 4-star)
  3. Delete own review
  4. Verify one-review-per-user gate (second attempt fails)
  5. Verify avg rating aggregation (multiple reviews → correct avg)
  6. View review modal with pagination

**Success metric**:

- 10%+ of downloaders leave a rating
- Average platform rating >4.0
- Review count visible + increases social proof
- No spam reviews appear

---

### 4.2 Trainer Profile Enhancements

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Enhanced trainer profile page (`/trainer/{id}`):
  - Trainer bio, institution, department, verification badges
  - All resources they've uploaded with ratings
  - Aggregate stats: Total resources, total downloads, average resource rating
  - Resources sorted by download count (most popular first)

- [ ] Trainer leaderboard page (`/trainers/top`):
  - Top 10 trainers this month (by total downloads)
  - Top 10 trainers all-time (by average resource rating)
  - Trainer card: name, institution, resources count, avg. rating, total downloads

**Success metric**:

- Trainer profile page viewed >100x per active trainer
- Leaderboard drives 5% of traffic to trainer profiles

---

## Phase 5: Trainer Onboarding Hub (Weeks 24-26)

**Goal**: Enable trainers to manage resources, track impact, and grow audience.

### 5.1 Trainer Dashboard

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Dashboard landing page (`/trainer/dashboard`):
  - Overview cards: Total uploads, pending review, approved, total downloads
  - Resource performance table: Resource title, status, downloads, rating, approval date, actions (view, edit, delete)
  - Recent activity feed: "Resource 'Lesson Plan 101' was downloaded 15 times today"
  - Quick actions: "Upload New Resource" button

- [ ] Dashboard endpoints:
  - `GET /api/trainer/dashboard` - Overview stats
  - `GET /api/trainer/resources` - List trainer's own resources
  - `GET /api/trainer/resources/{id}/analytics` - Single resource performance

**Success metric**:

- Trainer logs in >2x/week on average
- 50%+ trainer retention after 3 months

---

### 5.2 Resource Upload Workflow

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Upload form (modal or dedicated page):
  - Step 1: Basic info (title, department, resource type, CBET units)
  - Step 2: Description (max 500 chars) + tags
  - Step 3: File upload (drag-and-drop + click-to-select, PDF/DOCX, max 25MB)
  - Step 4: Preview (shows how card will appear)
  - Submit → confirmation: "Thank you! Under review (usually <24h)"

- [ ] File validation:
  - Format: PDF or DOCX only
  - Size: Max 25MB
  - Scans file for readability (basic check)

- [ ] Backend endpoint:
  - `POST /api/trainer/resources` - Create resource (auth required, trainer_id auto-filled)
  - Triggers auto-email: "Your resource 'Lesson Plan 101' has been submitted for review"

- [ ] Email notifications:
  - "Approved": "Congrats! Your resource is now live"
  - "Rejected": "Your resource needs revision: [reason]. Resubmit: [link]"

- [ ] E2E tests (5 test cases):
  1. Upload new resource + confirm pending status
  2. File validation (reject >25MB)
  3. File validation (reject .txt format)
  4. Resource appears in trainer dashboard after upload
  5. Approval email sent after admin review

**Success metric**:

- Trainer can upload in <5 minutes
- 80%+ of first uploads approved (expectations met)
- Average upload-to-publish: 18 hours

---

### 5.3 Trainer Profile Management

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Profile settings page (`/trainer/profile`):
  - Bio (textarea)
  - Institution/Organization
  - Specialties (multi-select tags)
  - Profile visibility (public/private)
  - Email for notifications
  - Verification badge eligibility (link to criteria)

- [ ] Backend endpoint:
  - `PUT /api/trainer/{id}/profile` - Update profile (auth required, own profile only)

**Success metric**:

- 70%+ of trainers complete full profile (not just signup)
- Trainer bio length >50 chars (not abandoned)

---

## Phase 6: Resource Approval & Admin Workflow (Weeks 27-29)

**Goal**: Build scalable admin review process with transparency and SLA tracking.

### 6.1 Admin Review Queue

**Owner**: Backend + Frontend  
**Deliverables**:

- [ ] Admin queue page (`/admin/queue`):
  - List of pending resources (sorted by submission date, oldest first)
  - Each row: Trainer name, resource title, submitted date, file preview link
  - Quick review: "Preview" button opens modal
  - Actions: "Approve" + "Reject" buttons (with reason dropdown)

- [ ] Review modal:
  - Resource metadata (title, department, type, CBET units)
  - File preview (embedded PDF viewer or link)
  - Reject reason templates (dropdown):
    - "File not readable"
    - "CBET alignment unclear"
    - "Content incomplete"
    - "Plagiarism concerns"
    - "Language/grammar needs review"
    - "Other" (free text)
  - Approve/Reject buttons

- [ ] Backend endpoints:
  - `GET /api/admin/queue` - List pending resources (admin only)
  - `PUT /api/resources/{id}/approve` - Approve (admin only, updates status + approval date)
  - `PUT /api/resources/{id}/reject` - Reject (admin only, updates status + sends trainer email)

- [ ] Tracking:
  - Review log: Tracks all approvals/rejections with timestamp, reviewer name, reason
  - SLA monitoring: Alert if resource pending >24h

**Success metric**:

- 90%+ of uploads reviewed within 24h SLA
- Rejection rate 10-15% (quality gate maintained)
- Trainer resubmission rate >70% (feedback actionable)

---

### 6.2 Admin Analytics

**Owner**: Backend + Frontend  
**Deliverables**:

- [ ] Admin dashboard (`/admin/analytics`):
  - Daily active learners, new uploads, approval rate, avg. review time
  - Resource quality: Avg rating, rejection rate, flagged reviews count
  - Department coverage gaps: Departments with <5 resources highlighted
  - Top trainers: By resource count, download count
  - Top resources: By downloads, rating

- [ ] Alerts/Warnings:
  - "Review queue >5 pending" (manual check needed)
  - "Department ICT has 50% of downloads" (content gap analysis)
  - "Trainer X uploaded 3 resources rejected" (potential spam)

**Success metric**:

- Admin checks dashboard weekly
- Data informs content recruitment decisions (e.g., hire ICT trainer)

---

### 6.3 Trainer Notification System

**Owner**: Backend  
**Deliverables**:

- [ ] Email templates:
  - Upload received: "We got your resource 'Lesson 101'. Expect review within 24 hours."
  - Approved: "Great news! Your 'Lesson 101' is now live and searchable."
  - Rejected: "Your 'Lesson 101' needs revision: [reason]. Resubmit: [link]"
  - Milestone: "Congratulations! Your resources have 500 downloads."

- [ ] Email system:
  - Uses SendGrid or similar
  - Tracks open rate, click rate (informs engagement)
  - Unsubscribe link included

**Success metric**:

- 40%+ email open rate
- Trainer resubmission within 7 days: >50%

---

## Phase 7: Freemium & Premium Features (Weeks 30-32)

**Goal**: Establish revenue stream and premium feature set. Test conversion hypothesis.

### 7.1 Premium Feature Definition

**Owner**: Product + Business  
**Deliverables**:

- [ ] Premium tier specification:

| Feature                                        | Free | Premium | Rationale                                                                   |
| ---------------------------------------------- | ---- | ------- | --------------------------------------------------------------------------- |
| Browse Resources                               | ✓    | ✓       | Core value—never locked                                                     |
| Download Offline                               | ✓    | ✓       | Table stakes; free tier includes up to 5 collections                        |
| Certificates/Completion Tracking               | ✗    | ✓       | Institutional value; educators track learner progress                       |
| Unlimited Batch Downloads                      | ✗    | ✓       | Premium QoL: download 100 resources at once vs. 5/month free                |
| Advanced Search (difficulty, duration, author) | ✗    | ✓       | Power-user feature                                                          |
| Bookmarks/Collections                          | ✗    | ✓       | Personalization; learners curate learning paths                             |
| Ad-free browsing                               | ✗    | ✓       | Future when platform ads introduced                                         |
| Trainer Analytics (for trainers)               | ✗    | ✓       | Trainers track impact (dashboard sees download trends)                      |

- [ ] Pricing tiers:
  - **Free**: Always free, no credit card, basic browsing + 5 offline downloads/month
  - **Premium**: 99 KES/month (M-Pesa) or 2,500 KES/year (annual discount ~60%)
  - **Trainer Premium**: 200 KES/month or 2,000 KES/year (includes all + analytics + featured listing)

- [ ] Premium launch gate:
  - Launch when: 10k+ monthly active learners OR email interest >500 addresses (whichever first)
  - Soft launch: Email waitlist first; measure conversion before paid traffic

**Success metric**:

- Feature matrix approved by stakeholders
- Pricing validated via waitlist email (>5% interest)
- Premium launch gates defined

---

### 7.2 Payment Infrastructure

**Owner**: Backend + Frontend  
**Deliverables**:

- [ ] Payment processor integration (Stripe + Pesapal):
  - M-Pesa Express (STK Push) for mobile-first users
  - Card payments as fallback
  - Webhook handling: `payment.success` → activate premium, send receipt email
  - Refund handling: 7-day money-back guarantee
  - Subscription management: Upgrade/downgrade/cancel

- [ ] Premium gate modal (frontend):
  - Triggered when learner clicks locked feature (e.g., "Batch Download")
  - Feature description + pricing + 1-click purchase
  - Post-purchase: Feature unlocked, confirmation email

- [ ] Subscription dashboard (learner view):
  - Current plan + renewal date
  - Upgrade/downgrade option
  - Download invoice history
  - Cancel subscription

- [ ] Database schema updates:
  - `subscriptions` table: user_id, status (active/inactive), plan_type, renewal_date, created_at
  - `payment_history` table: subscription_id, amount, currency, status, payment_date, provider

**Success metric**:

- 99.5% payment success rate
- <2% fraud rate
- <24h support response for payment issues

---

### 7.3 Certificate System

**Owner**: Backend  
**Deliverables**:

- [ ] Certificate generation (if Premium includes):
  - PDF template: Learner name, resource title, completion date, CBET units, QR code
  - Trigger: Auto-generate when learner spends >15 min on PDF or completes embedded assessment
  - Email delivery: "Your certificate for 'Lesson 101' is ready" + downloadable PDF

- [ ] Verification endpoint:
  - `GET /verify/{cert_id}` - Shows certificate validity + learner name (if public)
  - QR code links to this endpoint (shareable on social media)

- [ ] Trainer manual issuance:
  - Dashboard button: "Issue Certificate to [Learner Name]"
  - Creates certificate + sends email to learner

**Success metric**:

- 100+ certificates issued by month 2 of Premium
- Verification endpoint accessed >500x (proof of social sharing)

---

### 7.4 Premium Subscriber Analytics

**Owner**: Frontend + Backend  
**Deliverables**:

- [ ] Premium subscriber metrics (for business):
  - Monthly recurring revenue (MRR)
  - Conversion rate (free → premium)
  - Churn rate (cancellations per month)
  - LTV (lifetime value per subscriber)
  - Cohort retention (% of cohort active after 30/60/90 days)

- [ ] A/B testing setup:
  - Test 1: Does showing download count increase conversions?
  - Test 2: Does showing avg rating increase conversions?
  - Test 3: Does offering annual discount drive higher LTV?

**Success metric**:

- MRR >50,000 KES by end of Phase 7
- Churn rate <5% per month
- Premium retention >40% at 90 days

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
3. **Phase 3**: Supports 100k MAU, trainer retention >50%, community moderation scales
4. **Phase 4**: Supports 150k MAU, review system handles 1,000+ reviews/month
5. **Phase 5**: Supports 200k MAU, trainer dashboard analytics responsive (<500ms)
6. **Phase 6**: Supports 300k MAU, admin queue scales to 500+ pending reviews
7. **Phase 7**: Supports 500k MAU, payment processing 1,000+ transactions/month, revenue model validated

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

### Phase 0 Goalposts (Content Foundation)

- [ ] 30+ real resources live
- [ ] Admin review workflow documented
- [ ] 24h review SLA established

### Phase 1 Goalposts (MVP Launch)

- [ ] 0 mock data in UI
- [ ] 100+ learners browsing (first week)
- [ ] Offline download functionality tested
- [ ] 24h admin review SLA met for 90% of uploads
- [ ] 50+ waitlist signups for Premium

### Phase 2 Goalposts (Freemium Launch)

- [ ] 10k+ monthly active learners
- [ ] 5% Premium conversion rate
- [ ] 50+ certificates issued
- [ ] 2k monthly recurring revenue (MRR)

### Phase 3 Goalposts (Trainer Growth)

- [ ] 50+ active trainers
- [ ] 200+ resources total
- [ ] 40%+ trainer retention (uploading after 3 months)
- [ ] 10% of resources have learner reviews

### Phase 4 Goalposts (Community & Social Proof)

- [ ] 1,000+ reviews submitted
- [ ] Average platform rating >4.0
- [ ] Trainer profiles viewed >100x per active trainer
- [ ] Review system driving 5% of engagement

### Phase 5 Goalposts (Trainer Onboarding Hub)

- [ ] 60+ active trainers with complete profiles
- [ ] 250+ resources total
- [ ] Trainer login frequency >2x/week average
- [ ] 50%+ trainer retention at 3-month mark

### Phase 6 Goalposts (Admin & Approval Workflow)

- [ ] 90%+ of uploads reviewed within 24h SLA
- [ ] Rejection rate 10-15% (quality maintained)
- [ ] 70%+ trainer resubmission rate (feedback actionable)
- [ ] Department coverage >8 departments with 5+ resources each

### Phase 7 Goalposts (Freemium & Revenue)

- [ ] 50,000+ KES MRR (monthly recurring revenue)
- [ ] 5% Premium conversion from free users
- [ ] 40%+ Premium retention at 90 days
- [ ] 100+ certificates issued to Premium subscribers
- [ ] <5% monthly churn rate

---

## Risk Mitigations

| Risk                                           | Mitigation                                                                                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 0 fails: Can't recruit educators**     | Start with 5-10 personally recruited + incentivize with "featured trainer" badge + email to TVET networks                                                           |
| **Admin review SLA broken**                    | Pre-document criteria + run dry-run with 10 resources. If still 48h+, hire part-time reviewer or create auto-accept rules for known-good sources                    |
| **Offline caching breaks on update**           | Service Worker versioning + manual cache buster. Test monthly on real devices.                                                                                      |
| **Review system generates low engagement**     | Seed initial 50+ reviews manually. Run email campaign: "Help others learn—rate this resource" (opt-in)                                                              |
| **Trainer dashboard too complex**              | Simplify MVP to 3 cards (uploads, downloads, pending). Expand in Phase 5+                                                                                          |
| **Upload workflow abandonment**                | A/B test single-page vs. multi-step form. Track drop-off per step. If >30% drop at file upload, add progress indicator                                              |
| **Payment processing fails**                   | Use Stripe fallback + manual payment option ("Email invoice, pay via bank transfer") for first 50 transactions                                                      |
| **Low Premium conversion**                     | Email waitlist with premium feature updates. Test freemium gates (lock batch download at 5). If <2% interest, pivot to B2B model (school subscriptions)             |
| **Admin queue bottleneck**                     | Document review SLA upfront. At 50+ pending: hire part-time reviewer or auto-approve from vetted trainers                                                          |
| **Low trainer retention post-launch**          | Send weekly engagement emails: "Your resource downloaded X times." Offer incentives: featured listing for top trainers, revenue-share if subscriptions succeed      |
| **Certificate abuse (fake credentials)**       | Add trainer signature requirement + institution verification. QR code links to public cert DB (prevents offline verification fraud)                                |
| **Subscription churn >10%**                    | Email at day 30/60: "Still using premium?" Offer discount renewal. Survey cancellations (track "too expensive" vs. "didn't use it")                                 |

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

| Phase   | Duration    | Key Deliverable                                               |
| ------- | ----------- | ------------------------------------------------------------- |
| Phase 0 | Weeks 1-3   | 30+ real resources, documented admin workflow                 |
| Phase 1 | Weeks 4-8   | Live MVP: browse, download, offline, real counts              |
| Phase 2 | Weeks 9-14  | Premium features, payment integration, certificates            |
| Phase 3 | Weeks 15-20 | Trainer dashboard, reviews, community                         |
| Phase 4 | Weeks 21-23 | Rating & review system, trainer leaderboard                   |
| Phase 5 | Weeks 24-26 | Trainer onboarding hub, resource upload, profile management   |
| Phase 6 | Weeks 27-29 | Admin review queue, approval workflow, SLA tracking            |
| Phase 7 | Weeks 30-32 | Freemium model, payment infrastructure, certificates, premium |

**Total MVP-to-Revenue**: ~8 months (32 weeks) to validated business model with 50k+ KES MRR

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

## Implementation Roadmap: Next Steps

### Current Status: Phase 4 - Community & Social Proof (In Progress)

**Quick Win #6 - Rating & Review System**: Next to implement

**Immediate Actions (This Week)**:
1. Implement Quick Win #6: Rating & Review System (backend + frontend + E2E tests)
2. Test review aggregation and display on resource cards
3. Deploy to staging and verify all tests pass

**Sequence (Strictly Follow This Order)**:

1. ✅ **Quick Wins #1-5** (Completed)
   - Resource seeding, API integration, download tracking, auth flow, logout
   
2. ⏳ **Quick Win #6** (START HERE)
   - Rating & Review System (4-5 hours)
   - Backend: reviews table, 4 endpoints
   - Frontend: ReviewForm, ReviewsList, ReviewsModal
   - E2E: 6 test cases
   
3. ⏳ **Quick Win #7** (After #6)
   - Trainer Leaderboard & Profile Enhancements (3 hours)
   
4. ⏳ **Quick Win #8** (After #7)
   - Launch Phase 4 Complete
   
5. **Phase 5**: Trainer Onboarding Hub (Weeks 24-26)
   - Trainer Dashboard
   - Resource Upload Workflow
   - Profile Management
   
6. **Phase 6**: Resource Approval & Admin Workflow (Weeks 27-29)
   - Admin Review Queue
   - SLA Tracking
   - Trainer Notifications
   
7. **Phase 7**: Freemium & Premium Features (Weeks 30-32)
   - Payment Infrastructure
   - Premium Features
   - Certificate System

**Critical Constraints** (DO NOT VIOLATE):
- All work must maintain **0 TypeScript errors**
- All features must have **E2E test coverage** (minimum 6 tests per feature)
- Backend and frontend both **build successfully** before merging
- No mock data in production code
- All new endpoints documented + CORS-enabled

---

## Next Steps (Immediate)

1. **Implement Quick Win #6** - Rating & Review System (follow this module exactly)
2. **Review & Approve** all test cases before coding
3. **Deploy to staging** + verify against production DB
4. **Get user feedback** before Phase 5 planning
5. **Update this document** after each quick win completion

---

**Document Version**: 2.0 - Phases 4-7 Defined (Production Ready)  
**Author**: Engineering + Product Team  
**Approval**: Approved - Ready for Strict Implementation  
**Last Updated**: June 2026  
**Status**: LOCKED - Follow this document strictly. All future work must reference specific phase/quick-win from this plan.
