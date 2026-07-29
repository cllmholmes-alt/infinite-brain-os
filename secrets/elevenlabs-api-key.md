---
id: "secret-elevenlabs-api-key"
aliases: ["secret-evenlabs-api-key", "elevenlabs-api-key", "evenlabs-tts"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the ElevenLabs API key used for TTS across Hermes, TALOS, and Aurora."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# ElevenLabs API Key

## What this is

The ElevenLabs API key powers text-to-speech across all agentic systems. Uses a custom cloned voice
"Archie" (voice ID `aMdQCEO9kwP77QH1DiFy) for all TTS tasks on Hermes, TALOS, and Aurora.

## Secret reference

```yaml
secret_ref:
  id: "elevenlabs-api-key"
  status: "live"
  backend: "elevenlabs-console"
  locator: "ElevenLabs > Profile + API key"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["hermes-agent", "talos-runtime", "aurora-api"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `~/.hermes/.env` | `ELEVENLABS_API_KEY` |
| `~/.hermes/profiles/fusion/.env` | `ELEVENLABS_API_KEY` |
| `~/.hermes/profiles/taloscontrol/.env` | `ELEVENLABS_API_KEY` |

## Scope

All TTS across the operator's systems. Custom voice "Archie" is bound to this account.
Voice ID: `aMdQCEO9kwP77QH1DiFy`
