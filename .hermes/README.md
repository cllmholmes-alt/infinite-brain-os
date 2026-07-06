# Hermes Agent — IB-OS Adapter

This folder registers Infinite Brain OS entities (agents, commands, skills, rules)
as Hermes-compatible shims. Hermes reads from this directory for skill loading,
agent definitions, and command invocations within the IB-OS repo.

## What's Loaded

- `.hermes/agents/` — Agent entity definitions (loaded as Hermes-compatible agent specs)
- `.hermes/commands/` — Command entity definitions (slash commands for Hermes sessions)
- `.hermes/skills/` — Skill entity definitions (loaded as Hermes skills when `external_dirs` is configured)

## How It Works

Files here are **copies** from the canonical definitions in `entities/{type}/{name}.md`.
Edit the canonical file, then run:

```bash
bash sync-adapters.sh
```

This copies the updated entity into `.hermes/`, `.claude/`, and `.codex/` adapters.

## Configuration

To have Hermes auto-load IB-OS skills, add to Hermes `config.yaml`:

```yaml
skills:
  external_dirs:
    - path: /Users/callumholmes/Documents/infinite-brain-os/.hermes/skills
```

## Entity Contract

Every file in this directory mirrors the canonical IB-OS frontmatter contract:

```yaml
---
id: "agent-{name}"
type: "Agent|Command|Skill|Rule"
lifecycle_state: "scratch|research|candidate|canon"
summary: "..."
---
```

Never edit files here directly — edit the canonical entity in `entities/{type}/{name}.md`.
