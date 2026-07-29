---
id: "secret-aurora-ai-api-key"
aliases: ["secret-aurora-ai-api-key", "aurora-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the Aurora AI API key used by the ADHD-OS dashboard backend."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Aurora AI API Key

## What this is

The Aurora AI API key authenticates requests from the ADHD-OS dashboard to the Aurora service
(running on the VPS at adhd-os.co.uk/api/aurora).

## Secret reference

```yaml
secret_ref:
  id: "aurora-ai-api-key"
  status: "live"
  backend: "aurora-service"
  locator: "Documents/Figmaadhdosuserdashboard/.env (AURORA_AI_API_KEY)"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["server"]
  allowed_tools: ["adhd-os-dashboard"]
  allowed_workflows: []
  scope_class: "adhd-os"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `Documents/Figmaadhdosuserdashboard/.env` | `AURORA_AI_API_KEY` |

## Scope

ADHD-OS dashboard → VPS Aurora API. Service is live at adhd-os.co.uk/api/aurora (:3001 on VPS).
