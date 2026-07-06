---
id: "knowledge-adhd-os-concepts-component-architecture"
aliases: ["knowledge-adhd-os-concepts-component-architecture", "component-architecture", "adhd-os-architecture", "adhd-os-components"]
type: "Knowledge"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "The component architecture of ADHD-OS maps how the five repo surfaces relate: the Master Reference Database as the content and design reference backbone, the Artsyled Website as the Figma-generated public conversion surface and authenticated web dashboard, the Figma Dashboard App as the main development monorepo hosting the Expo mobile app, Apple Watch app, Supabase backend, and Agentic-OS control plane, the Money Website as a planned but not-yet-implemented monetization surface, and the Alternative Design directory as an empty placeholder."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
created: "2026-07-06"
edges:
  - target: "[[adhd-os-core-doctrine]]"
    relation: "part_of"
    confidence: 0.9
  - target: "[[capacity-aware-execution-layer]]"
    relation: "depends_on"
    confidence: 0.8
---

# Component Architecture

## Map

The ADHD-OS product surface spans five repo directories on disk. Three contain
active code and content; two are placeholders. They interlink through shared
backend infrastructure (Supabase), a shared visual source of truth (Figma), and
shared behavioral contracts.

## The five component repos

### 1. Master Reference Database (`C:\Projects\ADHD-OS - Master Reference Database`)

State: resource collection, not a code repo.

This is the canonical content, design reference, and specification backbone. It
holds:
- The Figma Cognitive Visual Canon (2048-line design system document defining
  the four cognitive states, layout grid, Aurora animation spec, interaction
  choreography, accessibility canon, and UX writing canon)
- Build engine prompts (SOVEREIGN v1-v3, multi-agent orchestration prompts)
- Widget wireframe specifications and accessibility framework evidence
- Target market research and avatar documentation
- ~80 UI reference images (dashboard grids, widget layouts, accessibility
  guides)
- A Figma-to-Next.js converter tool

Role: the design and specification authority. Everything built in the other
repos should be traceable to specs held here. The Figma Cognitive Visual Canon
is the most authoritative single document for visual and behavioral design
rules.

### 2. AdhdosArtsyledWebsite (`C:\Projects\AdhdosArtsyledWebsite-clone`)

State: active Vite + React project. Version 0.0.1.

This is the public-facing website and authenticated web dashboard, generated
from the Figma source of truth via Figma Make. Package name: `@figma/my-make-file`.

Tech stack: React 18, Vite 6, Tailwind CSS 4, Radix UI (20+ components), MUI 7,
zustand (state), react-router 7 (routing), motion (animation), recharts (charts).

Surfaces:
- **Public pages**: Home, How it Works, Modules Hub, Pricing, Security and
  Privacy, FAQ, About, Contact, Login, Signup, Terms, Privacy, Cookies,
  Acceptable Use, Changelog, Status.
- **Authenticated dashboard**: the full module catalog rendered in a web
  dashboard (Today, Clear My Head, Tasks, Calendar, Plan, Regulation, Money,
  Mood, Habits, Notes, Goals, Insights, Integrations, Settings, Aurora).

The website's `src/imports/` directory contains 70+ AI-generated specification
files that drove its construction, including the Full System Spec
(`adhd-os-spec.md`) covering all modules across desktop, mobile, and wearable
form factors.

### 3. Figma Dashboard App (`C:\Projects\Figmaadhdosuserdashboard`)

State: active monorepo. Version 1.0.0. The main development hub.

This is the largest and most architecturally complete repo. It contains:

- **Web app**: React 19, Vite 6, Tailwind CSS 4, the same UI component surface
  as the Artsyled Website (Radix UI, MUI, zustand).
- **Expo mobile app** (`adhd-os-mobile/`): React Native via Expo, Capacitor 8
  for native iOS/Android bridges. Bottom-bar navigation (Today/Capture/Plan/More).
  SQLite-first with sync queue. StoreKit purchase abstraction for App Store IAP.
  iOS bundle ID: com.adhdos.app.
- **Apple Watch app** (`ADHDOS/WatchApp/`): Swift. Controllers for Today, Focus,
  Habits, Aurora, Recover. Separate App Store submission from iOS.
- **Supabase backend** (`supabase/`): Migrations, Edge Functions (Stripe webhook,
  Aurora AI via Anthropic API, process-email-queue with lifecycle sequences),
  RLS policies. Project: fumohclfkkihwhrsufsn.
- **Agentic-OS** (`src/app/adhd-os/agentic-os/`): Internal control plane dashboard
  at `/admin/agentic-os` for AI agents that build ADHD-OS. Tracks tasks, gates,
  evidence, coverage, Company OS imports, prompts. Supabase-backed with seed
  fallback.
- **Governance system**: Scripts enforcing typography hierarchy, visual density,
  tone/language, and accessibility against committed baselines. Zero-generic-visual
  enforcement.
- **Autonomy layer**: 25+ GitHub Actions workflows for executive KPI tracking,
  UX trust cycles, schema drift detection, memory resilience, screen operations,
  product intelligence, Company OS integration, and more.
- **Mission Control**: Agentic build orchestration layer (`missionctl`) running
  on the ScaleWay iOS Cloud Mac for iOS build and sign.

### 4. Money Website (`C:\Projects\ADHD-Money-Website`)

State: placeholder. Contains only a `nul` file (effectively empty).

Planned role: the monetization and financial education surface. The Money module
is defined in the Full System Spec (`adhd-os-spec.md`) as covering runway,
upcoming obligations, alerts, subscriptions, and a Money Shield protective
action. The module exists conceptually and is wired into the behavioral engine
but has no standalone website implementation.

### 5. Alternative Design (`C:\Projects\ADHD-OS Alternative Design`)

State: empty directory. No content.

Planned role: an alternate design direction under evaluation. No designs or
code have been deposited yet.

## How they interlink

### Figma -> Website generation pipeline

The canonical Figma design at `https://www.figma.com/design/QNmiv2oZ9Jyz08orjDb7Cl/The-New-ADHD-OS`
is the visual source of truth. The Artsyled Website was generated from it via
Figma Make. The Figma file architecture blueprint (in the Master Reference
Database) specifies three permanent Figma files (Design System, Core App,
R&D Lab) that mirror the monorepo structure. Design tokens are meant to map
1:1 between `packages/design-tokens` and Figma, with no ad-hoc hex codes
allowed in either system. The canonical Figma-to-Tailwind checklist enforces
this parity.

### Shared backend (Supabase)

Both the Artsyled Website and the Figma Dashboard App share the same Supabase
project (fumohclfkkihwhrsufsn). This provides:
- Shared authentication (Supabase Auth with email and GitHub OAuth)
- Shared database (canonical tasks, calendar_events, capacity_states, etc.)
- Shared Edge Functions (Stripe billing, Aurora AI, lifecycle emails)
- Shared RLS policies (auth.uid() = user_id on all user-data tables)

The mobile app also connects to this Supabase instance, syncing local SQLite
state through a queue.

### Shared behavioral engine contracts

The behavioral engine (Next Best Action, capacity compression, risk signals,
continuity, overwhelm recovery) is defined in the Full System Spec
(`adhd-os-spec.md`), which was imported into the website repo as a build
spec. The dashboard app implements these contracts in its runtime code under
`src/app/` (taskEngine.ts, tier-authority.ts, aurora-stripe-gate.ts,
SubscriptionContext.tsx). Both surfaces must obey the same behavioral
contracts: one primary action per screen, max visible tasks capped by capacity
state, Start Here as the dominant CTA, no shame mechanics.

### Design authority chain

The Master Reference Database holds the specifications. The Figma design holds
the visual truth. The Website is the generated surface. The Dashboard App is the
development hub that implements the full behavioral system (including mobile and
wearable). Changes should flow: specification -> Figma -> generated website, and
specification -> dashboard app implementation.

## What is not yet mapped

- The Money Website has no implementation. The Money module exists within the
  dashboard app but has no standalone surface.
- The Alternative Design directory is empty. No direction has been deposited.
- The exact deployment pipeline (Cloudflare Pages for web, EAS for iOS,
  Google Play for Android) is known but not documented in this node.
- Cross-repo drift between the Artsyled Website (generated from Figma once)
  and the Dashboard App (actively developed) is a known risk. No automated
  drift detection between the two surfaces has been implemented yet.

## Provenance

Drawn from:
- `C:\Projects\Figmaadhdosuserdashboard\README.md` (dashboard app stack and architecture)
- `C:\Projects\Figmaadhdosuserdashboard\package.json` (script surface and dependencies)
- `C:\Projects\Figmaadhdosuserdashboard\CLAUDE.md` (Agentic-OS and governance layer)
- `C:\Projects\Figmaadhdosuserdashboard\CODEX_HANDOFF.md` (architecture decisions, readiness scores, Supabase project ID)
- `C:\Projects\AdhdosArtsyledWebsite-clone\README.md` (Figma link and build instructions)
- `C:\Projects\AdhdosArtsyledWebsite-clone\package.json` (website tech stack, origins as Figma Make output)
- `C:\Projects\AdhdosArtsyledWebsite-clone\src\imports\adhd-os-spec.md` (Full System Spec module catalog and behavioral contracts)
- `C:\Projects\ADHD-OS - Master Reference Database\Back-End Feature Roadmap Addons\Figma todos post-redesign.txt` (Figma file architecture blueprint, design token parity rules)
- Direct inspection of `C:\Projects\ADHD-OS Alternative Design\` (empty) and `C:\Projects\ADHD-Money-Website\` (nul file only)
