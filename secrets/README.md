# Secret Registry

`secrets/` is the root operating registry for secret references.

Use this folder to answer:

- what stable secret ids exist in the OS
- which surfaces, tools, or workflows may resolve each secret
- which backend currently stores the real value
- what rotation and exposure policy applies

This folder does not store secret values.

## Core rule

The repo stores references and policy metadata. A trusted runtime resolves the value at
execution time, from wherever the value actually lives (a cloud secret manager, an OS
keychain, a password manager). The model should see ids and redacted outcomes, never raw
credentials.

## Master Index (29 entries)

### LLM Provider Keys
| ID | File | Backend | Scopes |
|----|------|---------|--------|
| `glm-zai-api-key` | [glm-zai-api-key.md](glm-zai-api-key.md) | Z.AI Console + Keychain | Hermes, TALOS, Fusion |
| `deepseek-api-key` | [deepseek-api-key.md](deepseek-api-key.md) | DeepSeek Console | Hermes, TALOS, Fusion |
| `deepseek-backup-api-key` | [deepseek-backup-api-key.md](deepseek-backup-api-key.md) | DeepSeek Console | Hermes failover |
| `openai-api-key` | [openai-api-key.md](openai-api-key.md) | OpenAI Platform | ADHD-OS, GetSubmitReady, Hermes |
| `openai-service-account-api-key` | [openai-service-account-api-key.md](openai-service-account-api-key.md) | OpenAI Platform | GetSubmitReady server |
| `anthropic-api-key` | [anthropic-api-key.md](anthropic-api-key.md) | Anthropic Console | Hermes |
| `moonshot-kimi-api-key` | [moonshot-kimi-api-key.md](moonshot-kimi-api-key.md) | Moonshot Platform | Fusion |
| `openrouter-api-key` | [openrouter-api-key.md](openrouter-api-key.md) | OpenRouter | Fusion |
| `llm-provider-api-keys` | [llm-provider-api-keys.md](llm-provider-api-keys.md) | Aggregate ref | All (cross-refs individual entries) |

### TTS / Voice / Media
| ID | File | Backend | Scopes |
|----|------|---------|--------|
| `elevenlabs-api-key` | [elevenlabs-api-key.md](elevenlabs-api-key.md) | ElevenLabs Console | Hermes, TALOS, Aurora |
| `browserbase-api-key` | [browserbase-api-key.md](browserbase-api-key.md) | Browserbase Dashboard | Hermes |

### Database / Backend
| ID | File | Backend | Scopes |
|----|------|---------|--------|
| `supabase-credentials` | [supabase-credentials.md](supabase-credentials.md) | Supabase Dashboard | ADHD-OS, GetSubmitReady, Fusion |
| `stripe-secret-key` | [stripe-secret-key.md](stripe-secret-key.md) | Stripe Dashboard | ADHD-OS, GetSubmitReady |

### Auth / Access
| ID | File | Backend | Scopes |
|----|------|---------|--------|
| `talos-fusion-auth-tokens` | [talos-fusion-auth-tokens.md](talos-fusion-auth-tokens.md) | Generated secrets | TALOS, Fusion, Hermes |
| `github-ssh-key` | [github-ssh-key.md](github-ssh-key.md) | `~/.ssh/id_ed25519` | Git, SSH, gh CLI |
| `github-cllmholmes-alt-gh-cli-token` | [github-cllmholmes-alt-gh-cli-token.md](github-cllmholmes-alt-gh-cli-token.md) | macOS Keychain | gh CLI |
| `github-cllmholmes-alt-personal-access-token` | [github-cllmholmes-alt-personal-access-token.md](github-cllmholmes-alt-personal-access-token.md) | ⚠️ Compromised | Deprecated |
| `vps-ssh-access` | [vps-ssh-access.md](vps-ssh-access.md) | `~/.ssh/id_ed25519` → hermes-vps | SSH to 37.221.192.116 |
| `telegram-bot-token` | [telegram-bot-token.md](telegram-bot-token.md) | BotFather | Hermes gateway |
| `codex-auth-token` | [codex-auth-token.md](codex-auth-token.md) | macOS Keychain | Codex CLI, Hermes |
| `cursor-access-token` | [cursor-access-token.md](cursor-access-token.md) | macOS Keychain | Cursor IDE |
| `searxng-api-key` | [searxng-api-key.md](searxng-api-key.md) | VPS self-hosted | Hermes search |
| `cloudflare-api-token` | [cloudflare-api-token.md](cloudflare-api-token.md) | Cloudflare Dashboard | Fusion, VPS DNS |

### Product / Domain Credentials
| ID | File | Backend | Scopes |
|----|------|---------|--------|
| `aurora-ai-api-key` | [aurora-ai-api-key.md](aurora-ai-api-key.md) | Aurora service | ADHD-OS dashboard |
| `google-workspace-credentials` | [google-workspace-credentials.md](google-workspace-credentials.md) | ⚠️ Plaintext .env | GetSubmitReady |
| `ftp-credentials` | [ftp-credentials.md](ftp-credentials.md) | Plaintext .env | GetSubmitReady |
| `crm-credentials` | [crm-credentials.md](crm-credentials.md) | Keychain + .env | GetSubmitReady |
| `apple-developer-account` | [apple-developer-account.md](apple-developer-account.md) | Apple | ADHD-OS iOS |
| `scaleway-api-credentials` | [scaleway-api-credentials.md](scaleway-api-credentials.md) | Scaleway | Infra |

## Coverage by .env location

| `.env` Location | Secrets Referenced |
|-----------------|-------------------|
| `~/.hermes/.env` | glm-zai, deepseek, deepseek-backup, elevenlabs, browserbase, telegram-bot-token, searxng, talos-fusion-auth-tokens |
| `~/.hermes/profiles/fusion/.env` | glm-zai, deepseek, elevenlabs, browserbase, telegram-bot-token, searxng, talos-fusion-auth-tokens |
| `~/.hermes/profiles/taloscontrol/.env` | glm-zai, deepseek, elevenlabs, browserbase, telegram-bot-token, searxng, talos-fusion-auth-tokens |
| `Documents/fusion-harness/.env` | glm-zai, deepseek, moonshot-kimi, openrouter, supabase, cloudflare, talos-fusion-auth-tokens |
| `Documents/Figmaadhdosuserdashboard/.env` | supabase, stripe, openai, aurora-ai |
| `Documents/Getreviewreadycom/.env` | supabase, stripe (×4), openai, openai-service-account, google-workspace, ftp, crm |

## Coverage by backend

| Backend | Secrets stored there |
|---------|---------------------|
| macOS Keychain (30 entries) | cursor, codex-auth, claude-code, TALOS-GLM, CRM, stripe-webhook, gh:github.com |
| SSH key files | github-ssh-key, vps-ssh-access (shared `id_ed25519`) |
| Plaintext `.env` files | All LLM keys, TALOS tokens, Google Workspace, FTP (⚠️ see security flags) |
| Hermes `auth.json` (6 providers) | openai-api, anthropic, zai, deepseek, openai-codex, custom:fusion |
| Platform consoles (SaaS dashboards) | All provider keys originate here; .env/keychain are downstream copies |

## When to use `secrets/`

Use `secrets/` for:

- provider-neutral secret reference ids
- backend pointer metadata (which secret manager, which entry name)
- least-privilege binding scope (who may resolve the secret)
- ownership and rotation posture

Do not use `secrets/` for:

- `.env` snapshots
- copied API keys or tokens
- OAuth refresh state
- live request queues or approval flows
- vendor-specific secret-manager tutorials that belong in an ops runbook

## How to add a reference

Copy `_template.md` to a new file named after the secret id, fill in the reference fields,
and link it to the tools and workflows that consume it. Pick a stable kebab-case id that
describes the credential, not the value.

## Scope model

Use the reference fields to attach each secret to the rest of the system without storing
values:

- `allowed_tools`, `allowed_runtimes`, `allowed_workflows`: who may bind it
- `scope_class`: whether the secret is shared platform infrastructure, scoped to one
  project or client, or personal to the operator
- `rotation_class` and `last_rotated`: the rotation posture

Keep references minimal at first. Add scope fields when a real consumer exists, not
speculatively.

## ⚠️ Security Flags

1. **`google-workspace-credentials`** — HIGHEST RISK. Admin email + password + MFA backup code in plaintext `.env`. Recommend migration to Keychain.
2. **`github-cllmholmes-alt-personal-access-token`** — COMPROMISED. A PAT was found embedded in a Windows git remote URL. Should be revoked and rotated.
3. **Duplicate `.env` files** — `Figmaadhdosuserdashboard/.env` and `.env.local` are duplicates; consolidation reduces exposure surface.
4. **Stale snapshot** — `~/.hermes/state-snapshots/20260716-190309-pre-update/.env` is a stale copy of live credentials. Recommend deletion.
