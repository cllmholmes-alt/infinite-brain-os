---
id: "partner-ocnal"
aliases: ["partner-ocnal", "ocnal", "ocnai"]
type: "Party"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "OCNAI is the upstream open-source organization behind the AI Video Upscaler project. The operator consumes and may contribute to OCNAI's AI media pipeline code."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
party_slug: "ocnal"
party_type: "partner"
display_name: "OCNAI"
status: "active"
parent_party_slug: null
client_slug: null
brand_slug: null
namespace_slugs: []
department_slugs: []
tool_slugs: []
repo_slugs: ["ai-media-pipeline"]
notes: "Upstream open-source org for AI video upscaling. Relationship scope is upstream AI media code only. The operator uses the pipeline but does not own or control the upstream project."
---

# OCNAI

## Summary

OCNAI is the upstream open-source organization that develops and maintains the AI Video
Upscaler project. The operator's AI media pipeline depends on OCNAI's models and tooling
for video upscaling workflows. The relationship is upstream consumer: the operator pulls
from the upstream, potentially contributes back, but does not own the project or its
direction.

## Type and scope

- `party_type`: partner (upstream open-source collaborator)
- primary scope: upstream AI media pipeline code and models
- relationship: consumer and potential contributor

## Related repos

- AI Media Pipeline (`cllmholmes-alt/ai-media-pipeline`): the operator's fork or
  integration of the upstream AI Video Upscaler project

## Notes

The upstream repository is the authoritative source for the AI Video Upscaler models and
processing pipeline. The operator's `ai-media-pipeline` repo is the working integration
surface. Any upstream changes should be reviewed before pulling into the operator's
integration.
