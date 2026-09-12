# Product Requirements Document (PRD)
## ClubConnect: Member Contribution & Recognition Platform
**Edition:** Hackathon Edition  
**Version:** 1.0.0  
**Status:** Ready for Development  

---

## 1. Executive Summary

**ClubConnect** is a centralized platform designed to make club member contributions visible, verifiable, measurable, and recognized. It systematically tracks and validates technical work, event organization, mentoring, design, sponsorship, media, and leadership activities, translating verified work into dynamic points, badges, levels, club analytics, and a shareable contribution portfolio.

### Core Journey Loop
$$\text{Contribute} \longrightarrow \text{Submit Evidence} \longrightarrow \text{Verify} \longrightarrow \text{Earn Recognition} \longrightarrow \text{Build Portfolio} \longrightarrow \text{Generate Insights}$$

---

## 2. Problem & Product Vision

### 2.1 The Problem
Clubs operate on decentralized volunteer labor. Members contribute substantial effort, but:
1. **Lack of Records:** Contributions are scattered across chat apps (Discord, WhatsApp), code repositories, and spreadsheets, often getting lost over time.
2. **Subjective Recognition:** End-of-year awards or leadership promotions often favor visibility over actual output.
3. **No Shareable Proof:** Members cannot easily demonstrate their campus leadership and execution proof to external employers or sponsors.

### 2.2 Product Vision
Make ClubConnect the definitive **single source of truth** for student club contributions and organizational intelligence.

### 2.3 Core Design Principles
* **Immediate Utility:** Answering three questions for every member within 5 seconds: *What have I contributed? How am I progressing? What can I do next?*
* **Trust Through Verification:** No unverified self-reporting inflates ranks or portfolios.
* **Balanced Recognition:** Rewarding diverse skills (mentorship, logistics, code, design) rather than solely high-frequency code or volume metrics.

---

## 3. User Personas & Roles

```
┌─────────────────────────────────────────────────────────────┐
│                         ROLES & ACCESS                      │
├─────────────────┬───────────────────────────┬───────────────┤
│ Member          │ Coordinator               │ Admin         │
├─────────────────┼───────────────────────────┼───────────────┤
│ • Submit work   │ • Verification queue      │ • Point rules │
│ • Track stats   │ • Create challenges       │ • Categories  │
│ • Earn badges   │ • Track club health       │ • System RBAC │
│ • Share profile │ • Member engagement tools │ • Audit logs  │
└─────────────────┴───────────────────────────┴───────────────┘
```

1. **Member:**
   * Submits activity records with evidence.
   * Tracks review status in real time.
   * Earns XP, levels, and achievement badges.
   * Competes in challenges and maintains a public-facing contribution portfolio.
2. **Coordinator:**
   * Reviews incoming evidence in a triage queue.
   * Approves, rejects, or requests clarifications with context.
   * Launches time-bound club challenges and monitors engagement health.
3. **Admin:**
   * Defines and adjusts category base point weights.
   * Configures badge rules and unlocks.
   * Manages user roles and inspects security audit logs.

---

## 4. System Architecture & Information Architecture

### 4.1 Information Architecture

```
[Public]
 ├── Landing Page (Hero, Value Prop, Live Previews)
 ├── How It Works
 └── Authentication (Sign In, Sign Up, Password Reset)

[Member Workspace]
 ├── Dashboard (XP Gauge, Current Streak, Quick Actions, Activity Stream)
 ├── Add Contribution (4-Step Flow)
 ├── Contribution History (Filter by Status, Category, Project)
 ├── Leaderboard (Weekly, Monthly, Semester, All-Time, Most Improved)
 ├── Challenges & Milestones (Active, Expiring, Completed)
 ├── Achievements & Badges (Unlocked vs Locked Requirements)
 ├── Personal Analytics (Category Breakdown, Velocity)
 └── Public Portfolio View (/portfolio/:username)

[Coordinator Workspace]
 ├── Overview Dashboard (Pending Count, Active Members, Velocity)
 ├── Verification Queue (Split-screen Evidence Review)
 ├── Member Directory (Contribution Records & Search)
 ├── Challenge Management (Creation, XP Bounties)
 └── Club Health & Smart Insights (Retention, Category Deficits)

[Admin Control Panel]
 ├── Role Assignments & Access Control
 ├── Point Weights & Category Configuration
 ├── Badge Criteria Engine
 └── Audit & Security Logs
```

### 4.2 Navigation Architecture
* **Mobile (Member View):** Persistent bottom bar: `Home` | `Activity` | `[+] (Add)` | `Leaderboard` | `Profile`.
* **Desktop (Member & Coordinator):** Persistent collapsible sidebar with breadcrumb top navigation and global action menu.

---

## 5. End-to-End Feature Specifications

### 5.1 Authentication & Onboarding
* **Methods:** Email/Password with verification; optional Google OAuth or university identity.
* **Role-Based Routing:** Immediate redirection to `/dashboard` (Member) or `/coordinator/queue` (Coordinator) upon session check.
* **Onboarding Wizard:** Collects basic profile info, university/department, technical and soft skills, and primary club focus areas.

### 5.2 Contribution Submission Engine
* **Structured 4-Step Form:**
  1. **Category:** Technical, Design, Event, Marketing, Sponsorship, Mentoring, Leadership, Media.
  2. **Details:** Title, short description, date executed, associated project/event.
  3. **Evidence:** Attachment upload (PDF, PNG, JPG) or external link (GitHub PR, Figma, Drive, published article).
  4. **Confirmation & Preview:** Summary review before final dispatch.
* **Status Lifecycle:**
  $$\text{Draft} \longrightarrow \text{Pending} \mathrel{\substack{\nearrow \text{Verified} \\ \rightarrow \text{Clarification Needed} \\ \searrow \text{Rejected}}}$$

### 5.3 Coordinator Verification Queue
* **Split-Screen UX:** Submission metadata and contributor stats on left; embedded iframe/file preview on right.
* **Suggested XP Display:** Auto-calculates points based on category configuration before confirmation.
* **Triage Options:**
  * **Approve:** Commits XP immediately, triggers downstream badge/level checks.
  * **Request Clarification:** Suspends review, notifies member with coordinator's specific questions.
  * **Reject:** Requires a categorized rejection reason for contributor education.

### 5.4 Gamification & Level Engine
* **Configurable XP Weight Examples:**
  * Workshop Attendee / Volunteer: $+10\text{ XP}$
  * Poster / Graphic Design Asset: $+15\text{ XP}$
  * Peer Mentoring Session: $+20\text{ XP}$
  * Web / Tool Feature Implementation: $+30\text{ XP}$
  * Event Organizer / Lead: $+40\text{ XP}$
  * Major Project Lead / Hackathon Win: $+50\text{ XP}$
* **Default Progression Tiers:**
  * **Tier 1 (Newcomer):** $0 - 50\text{ XP}$
  * **Tier 2 (Contributor):** $51 - 150\text{ XP}$
  * **Tier 3 (Active Member):** $151 - 300\text{ XP}$
  * **Tier 4 (Core Member):** $301 - 500\text{ XP}$
  * **Tier 5 (Club Leader):** $500+\text{ XP}$
* **Leaderboard Logic:** Offers tabs for *Weekly*, *Monthly*, *Semester*, and *All-Time*, with an algorithmically weighted *Most Improved* tab highlighting recent acceleration over historical point totals.

### 5.5 Shareable Contribution Portfolio
* Accessible at unique URL: `/portfolio/{username}`.
* Toggleable privacy setting (`Public` vs `Unlisted` vs `Private`).
* Features verified contribution count, badge showcase, skill tags backed by verified evidence, and interactive project timeline.

### 5.6 Club Health & Smart Insights
* Aggregates team metrics: percentage of active vs inactive members.
* Identifies domain gaps (e.g., strong code contributions, but 0 sponsorship proposals logged in 30 days).
* Generates clear textual summaries highlighting standout contributors and at-risk initiatives.

---

## 6. Data Architecture & Relational Schema

```text
┌──────────────┐       1:N       ┌──────────────────┐       N:1       ┌──────────────┐
│    users     ├─────────────────┤  contributions   ├─────────────────┤  categories  │
└──────┬───────┘                 └────────┬─────────┘                 └──────────────┘
       │                                  │
       │ 1:N                              │ 1:N
       ├─────────────────┐                │
       ▼                 ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ user_badges  │  │ audit_logs   │  │ clarif_threads   │
└──────┬───────┘  └──────────────┘  └──────────────────┘
       │ N:1
       ▼
┌──────────────┐
│    badges    │
└──────────────┘
```

### 6.1 Database Schema Reference

#### `users`
* `id` (UUID, Primary Key)
* `email` (VARCHAR, Unique, Indexed)
* `name` (VARCHAR)
* `role` (ENUM: `'member'`, `'coordinator'`, `'admin'`)
* `department` (VARCHAR)
* `avatar_url` (TEXT)
* `skills` (TEXT[])
* `total_xp` (INTEGER, Default: 0)
* `current_level` (VARCHAR, Default: `'Newcomer'`)
* `portfolio_public` (BOOLEAN, Default: `true`)
* `created_at` (TIMESTAMP)

#### `contributions`
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `category_id` (UUID, Foreign Key $\rightarrow$ `categories.id`)
* `title` (VARCHAR(150))
* `description` (TEXT)
* `project_event_name` (VARCHAR(100))
* `evidence_type` (ENUM: `'url'`, `'file'`, `'github'`)
* `evidence_url` (TEXT)
* `status` (ENUM: `'draft'`, `'pending'`, `'verified'`, `'rejected'`, `'clarification'`)
* `points_awarded` (INTEGER, Default: 0)
* `reviewer_id` (UUID, Nullable, Foreign Key $\rightarrow$ `users.id`)
* `reviewer_notes` (TEXT, Nullable)
* `created_at` (TIMESTAMP)
* `verified_at` (TIMESTAMP, Nullable)

#### `categories`
* `id` (UUID, Primary Key)
* `name` (VARCHAR(50), Unique)
* `base_xp` (INTEGER)
* `color_hex` (VARCHAR(7))
* `is_active` (BOOLEAN, Default: `true`)

#### `badges`
* `id` (UUID, Primary Key)
* `name` (VARCHAR(50))
* `description` (TEXT)
* `icon_key` (VARCHAR(50))
* `criteria_type` (ENUM: `'xp_threshold'`, `'count_category'`, `'streak'`)
* `criteria_threshold` (INTEGER)

#### `user_badges`
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `badge_id` (UUID, Foreign Key $\rightarrow$ `badges.id`)
* `unlocked_at` (TIMESTAMP)

#### `audit_logs`
* `id` (UUID, Primary Key)
* `actor_id` (UUID, Foreign Key $\rightarrow$ `users.id`)
* `action` (VARCHAR(50))
* `target_entity` (VARCHAR(50))
* `target_id` (UUID)
* `payload` (JSONB)
* `created_at` (TIMESTAMP)

---

## 7. UI/UX Design System & States

### 7.1 Visual Direction
* **Style:** High-productivity dashboard with disciplined glassmorphism.
* **Palette:**
  * Background: Slate/Neutral Dark (`#0B0F17`) or Clean Minimal Light (`#F8FAFC`).
  * Primary Brand: Electric Indigo / Cyan (`#6366F1` / `#06B6D4`).
  * Status Colors:
    * Verified: Emerald (`#10B981`)
    * Pending: Amber (`#F59E0B`)
    * Clarification: Sky Blue (`#0EA5E9`)
    * Rejected: Rose (`#F43F5E`)
* **Surfaces:** Solid container surfaces for tabular and form data to ensure optimal readability, high contrast, and WCAG AA accessibility compliance.

### 7.2 Core UI States
1. **Empty States:** Clear illustrations and direct action prompts ("No contributions submitted yet — claim your first points!").
2. **Loading States:** Polished skeleton loaders matching target component geometry (no layout shift).
3. **Queue Empty:** Positive confirmation ("All caught up! No pending submissions to review.").
4. **Error & Fallbacks:** Inline validation with guidance for broken external links or unsupported file formats.

---

## 8. MVP Scope vs. Stretch Roadmap

| Component | MVP (Hackathon Core) | Stretch / Post-Demo |
| :--- | :--- | :--- |
| **Auth & Profiles** | Email/Pass Auth, RBAC, Basic Profile | Institutional SSO, GitHub OAuth sync |
| **Submissions** | 4-step wizard, URL/file proof | Direct GitHub PR / Figma webhook scraping |
| **Verification** | Approve / Reject + XP dispatch | Threaded in-line clarification chat |
| **Gamification** | Base XP, Levels 1–5, 4 Core Badges | Weekly challenge bounties & streak freeze |
| **Leaderboard** | Global All-Time & Weekly view | Category-specific & "Most Improved" filters |
| **Portfolio** | Static public summary view with proof links | Custom domain export, downloadable PDF |
| **Analytics** | Verification stats, Category split | AI-powered health summaries & trends |

---

## 9. 3-Minute Hackathon Demo Script

* **0:00 – 0:30 (The Hook & Landing):**
  * Present the landing page hero: *"Every contribution deserves to be recognized."*
  * Articulate the student dilemma: Club members spend hundreds of hours building, designing, and organizing, yet leave campus with zero verifiable proof of their contributions.
* **0:30 – 1:05 (Member Submission Flow):**
  * Switch to member view: showcase current level, XP balance, and active weekly streak.
  * Click **"Add Contribution"**, select category `Technical`, link a real GitHub PR, add effort details, and submit.
  * Highlight the real-time submission appearing in the dashboard as `Pending`.
* **1:05 – 1:50 (Coordinator Review Queue):**
  * Switch to the coordinator profile; show instant update in the review counter.
  * Open the split-screen verification queue, preview the live GitHub link, check the category rules (+30 XP), and click **Approve**.
* **1:50 – 2:30 (Instant Recognition & Portfolio):**
  * Switch back to the member view: showcase toast notification, XP bar animation, and level upgrade.
  * Navigate to the public `/portfolio` link: show how the approved PR now displays as an official, tamper-proof club credential.
* **2:30 – 3:00 (Club Health & Strategic Close):**
  * Open the Coordinator Club Health view: show active distribution across Tech, Marketing, and Events.
  * Conclude: *"ClubConnect turns scattered volunteer labor into verifiable career credentials while giving student clubs the visibility they need to thrive."*