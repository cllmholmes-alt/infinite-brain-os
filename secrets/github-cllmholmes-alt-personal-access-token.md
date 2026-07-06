---
id: "secret-github-cllmholmes-alt-personal-access-token"
aliases: ["secret-github-cllmholmes-alt-personal-access-token", "github-cllmholmes-alt-token"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "scratch"
summary: "Reference for the GitHub personal access token that was found embedded in a local repo remote URL. Tracks rotation posture only; the value is never stored in this repo."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# GitHub PAT (cllmholmes-alt) leaked in a remote URL

## What this is

A GitHub fine-grained personal access token (prefix `gho_`) was found embedded directly in
the origin remote URL of the local clone at `C:\Projects\AdhdosArtsyledWebsite-clone`. This
is an exposure: anyone with read access to that local git config has the token.

## Secret reference

```yaml
secret_ref:
  id: "github-cllmholmes-alt-personal-access-token"
  status: "compromised"
  backend: "github-fine-grained-pat"
  locator: "GitHub > Settings > Developer settings > Personal access tokens (cllmholmes-alt)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["git"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Required operator action

1. Revoke this token now in the GitHub account settings (it is compromised by being in a
   plain-text remote URL).
2. Replace the remote URL with a credential-free HTTPS or SSH remote:
   `git -C "C:\Projects\AdhdosArtsyledWebsite-clone" remote set-url origin <new-url>`.
3. Use a credential helper or SSH key for future auth, never an inline token URL.
4. Set `status` to `active` and `last_rotated` to today once rotated.

## Scope

This token granted the clone push/pull access to `cllmholmes-alt/AdhdosArtsyledWebsite`. Its
exact scopes are unknown from the URL alone; assume broad repo access until confirmed during
rotation.
