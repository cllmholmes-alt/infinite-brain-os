---
id: "secret-supabase-credentials"
aliases: ["secret-supabase-credentials", "supabase-credentials", "supabase-anon-key", "supabase-service-role-key", "supabase-url"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for Supabase project credentials (URL, anon key, service role key) across ADHD-OS, GetSubmitReady, and Fusion."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Supabase Credentials

## What this is

Supabase project credentials for PostgreSQL database, authentication, and storage. Three projects are
in use across the operator's systems, each with its own URL and key pair.

## Secret reference

```yaml
secret_ref:
  id: "supabase-credentials"
  status: "live"
  backend: "supabase-dashboard"
  locator: "Supabase Dashboard > Project Settings > API"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "server"]
  allowed_tools: ["adhd-os-dashboard", "getsubmitready-backend", "fusion-harness"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key names | Project |
|---------|-----------|---------|
| `Documents/Figmaadhdosuserdashboard/.env` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | ADHD-OS |
| `Documents/Getreviewreadycom/.env` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | GetSubmitReady |
| `Documents/fusion-harness/.env` | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Fusion |

## Scope

Three distinct Supabase projects. The service role keys grant full database access - treat as highest
sensitivity. DDL requires the Management API (sbp_ token), not PostgREST.
