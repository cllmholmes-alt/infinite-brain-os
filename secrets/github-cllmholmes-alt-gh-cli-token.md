---
id: "secret-github-cllmholmes-alt-token"
aliases: ["secret-github-cllmholmes-alt-token", "github-cllmholmes-alt-token", "gh-cli-token"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the GitHub CLI (gh) OAuth token for the cllmholmes-alt account."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# GitHub CLI Token (cllmholmes-alt)

## What this is

The OAuth token used by the `gh` CLI to authenticate as `cllmholmes-alt`. Stored in macOS Keychain
under the `gh:github.com` service. Provides `repo`, `read:org`, `workflow`, `admin:public_key`, and
`gist` scopes.

## Secret reference

```yaml
secret_ref:
  id: "github-cllmholmes-alt-token"
  status: "live"
  backend: "github-oauth"
  locator: "macOS Keychain > 'gh:github.com'"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["gh-cli"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Description |
|---------|-------------|
| macOS Keychain | `gh:github.com` service |
| GitHub | OAuth app token for `cllmholmes-alt` |

## Scope

This is the active working token for `gh` CLI operations (PR creation, repo forking, API queries).
The previous PAT (`gho_`) found embedded in a Windows clone remote is tracked separately in
`github-cllmholmes-alt-personal-access-token.md` (status: compromised).
