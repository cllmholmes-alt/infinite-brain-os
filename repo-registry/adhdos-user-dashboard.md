---
id: "repo-registry-adhdos-user-dashboard"
aliases: ["repo-registry-adhdos-user-dashboard", "adhdos-user-dashboard", "figmaadhdosuserdashboard"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "The ADHD-OS Executive Function Operating System dashboard app: a calm, cognitive-load-reducing behavioral OS with a capacity-aware execution layer. Built as an Expo (React Native) app with a Docker backend. Owned by cllmholmes-alt."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: adhdos-user-dashboard

## Repo Identity

- Repo slug: `adhdos-user-dashboard`
- Canonical path (Mac): `/Users/callumholmes/Documents/Figmaadhdosuserdashboard`
- VPS clone: `/root/documents/adhd-os` on `hermes-vps`
- Remote: `git@github.com:cllmholmes-alt/The-ADHD-OS-Ecosystem.git`
- Version control: git - **main-only branch policy** (pre-push hook enforced)
- Stack: React 19 + Vite web app (Meridian design system), Expo/React Native
  iOS app in `adhd-os-mobile/`, Supabase backend, Cloudflare Pages hosting

## Primary Job

The ADHD-OS Executive Function Operating System: a calm, institutional, cognitive-load
reducing behavioral operating system. Its doctrine is "cognitive load is a structural issue,
not a moral failing." Built to stabilise executive function, not to capture attention or
exploit behavioural data. Core architecture includes a capacity-aware execution layer.

## Current Registry Status

- Working status: `primary`
- Operator confirmation required: yes

## Department Linkage

- Working primary owning department: `adhd-os-product` (planned)

## Related Surfaces

- Related namespaces: `knowledge/adhd-os/`
- Related brand: `parties/brands/adhd-os.md`
- Related repos: `adhdos-artsyled-website`, `adhd-os-master-reference-database`

## Digestion or Migration Posture

- Working posture: `primary` (the mobile app implementation; high ingestion value for the
  namespace)

## Current State (2026-07-08)

- Meridian identity shipped across web + iOS (Fraunces/Satoshi/IBM Plex Mono,
  Porcelain/Observatory dual-mode, ember accent, phosphor Aurora).
- Constellation second-brain graph live on web (`BrainMirrorView`) and iOS,
  on a shared pattern engine; lens context feeds Aurora chat packets.
- Aurora unified on one live Supabase transport (Edge Function
  `make-server-f019d189`) with labeled rule-based fallbacks.
- Web deployed to Cloudflare Pages (`figmaadhdosuserdashboard` project;
  production domain `adhd-os.co.uk` - purge CDN cache after deploys).
- All branches folded into `main` locally and on GitHub (single-main state).
- iOS: local gates green (typecheck/lint/2531 tests); EAS/Expo cloud disabled
  by policy - wired USB is the device proof path.

## Open Decisions and Risks

- Physical-device and Watch proof paths remain manual (USB, no OTA/EAS).
- Cloudflare CDN cache must be purged manually after production deploys.
