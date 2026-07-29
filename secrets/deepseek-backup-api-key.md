---
id: "secret-deepseek-backup-api-key"
aliases: ["secret-deepseek-backup-api-key", "deepseek-backup-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the backup DeepSeek API key used as failover when primary hits rate limits."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# DeepSeek Backup API Key

## What this is

A second DeepSeek API key maintained as a backup/failover for the primary key. Used when the primary
key is rate-limited or temporarily blocked.

## Secret reference

```yaml
secret_ref:
  id: "deepseek-backup-api-key"
  status: "live"
  backend: "deepseek-console"
  locator: "DeepSeek Platform > API Keys (secondary account)"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `~/.hermes/.env` | `DEEPSEEK_BACKUP_API_KEY` |

## Scope

Failover only. Not referenced by Fusion or TALOS profiles — Hermes-only.
