---
id: "repo-registry-hermes-agent"
aliases: ["repo-registry-hermes-agent", "hermes-agent", "hermes"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Hermes Agent by Nous Research - the desktop AI agent that orchestrates the operator's entire ecosystem. Runs on macOS and Windows, with skills, plugins, cron, memory, and Telegram gateway integration. Personal forks at cllmholmes-alt/hermes-agent."
confidence: 0.92
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "operates"
    target: "[[repo-registry-talos]]"
    confidence: 0.9
  - relation: "deploys-to"
    target: "[[repo-registry-netcup-vps]]"
    confidence: 0.9
  - relation: "bridges-to"
    target: "[[repo-registry-aurora-api]]"
    confidence: 0.85
  - relation: "reads-from"
    target: "[[repo-registry-fusion-runtime]]"
    confidence: 0.9
---

# Repo: hermes-agent

## Repo Identity

- Repo slug: `hermes-agent`
- Upstream: `github.com/NousResearch/hermes-agent`
- Operator fork: `github.com/cllmholmes-alt/hermes-agent` (full push rights)
- Local path (Mac): `/Users/callumholmes/Documents/` (desktop app, updater-managed)
- Version control: git (fork tracking upstream)
- Stack: TypeScript, Electron desktop app, skill/plugin/cron system

## Primary Job

The operator's primary AI agent interface. Hermes is the desktop co-pilot that drives
both Mac workstations and the VPS. It provides:

- **Skills system** - hundreds of specialized procedural skills (design, code, ops, media)
- **Plugins** - extensible desktop panes and integrations
- **Cron jobs** - scheduled autonomous tasks (watchdogs, briefings, heartbeats)
- **Persistent memory** - cross-session context injected every turn
- **Telegram gateway** - `@TalosAgenticHermes_bot` (8815129482) for remote operation
- **Computer use** - background macOS desktop control via cua-driver
- **Delegation** - parallel subagent orchestration (up to 10 concurrent)

## Current Registry Status

- Working status: `primary-agent`
- Operator confirmation required: yes
- Desktop version: v0.15.1 (updater-managed, not patched in place)

## Related Surfaces

- Related namespaces: `knowledge/talos/`, `knowledge/ai-architecture/`
- Related repos: `[[repo-registry-talos]]`, `[[repo-registry-netcup-vps]]`, `[[repo-registry-aurora-api]]`, `[[repo-registry-fusion-runtime]]`
- Credential references: `secrets/telegram-bot-token.md`, `secrets/vps-ssh-access.md`, `secrets/codex-auth-token.md`

## Deployment Posture

- Dual operator machines: MacBook (`callumholmes`) + Windows PC (`Callu`)
- Both have SSH `hermes-vps` access to the Netcup VPS
- SSH tunnel: `launchd ai.fusion.vps-api-tunnel` bridges local :4000 to VPS :4000
- Voice: Telegram voice primary input, custom ElevenLabs 'Archie' voice for all TTS

## Open Decisions and Risks

- Hermes config migration between Mac and Windows documented in `config/hermes/migration/`
  within the TALOS repo
- Upstream tracking: `cllmholmes-alt` is READ-ONLY on `NousResearch/hermes-agent` upstream,
  full push on personal fork only
