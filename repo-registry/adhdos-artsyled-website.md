---
id: "repo-registry-adhdos-artsyled-website"
aliases: ["repo-registry-adhdos-artsyled-website", "adhdos-artsyled-website"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "The New ADHD-OS website code bundle, a Vite web app derived from the Figma design. Owned by cllmholmes-alt. SECURITY: its local remote URL embeds a live GitHub token that must be rotated."
confidence: 0.85
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: adhdos-artsyled-website

## Repo Identity

- Repo slug: `adhdos-artsyled-website`
- Canonical path: `C:\Projects\AdhdosArtsyledWebsite-clone`
- Remote: `github.com/cllmholmes-alt/AdhdosArtsyledWebsite.git`
- Version control: git
- Stack: Vite, `package.json`, `index.html`

## Primary Job

"The New ADHD-OS" website. A code bundle generated from the Figma design at
`https://www.figma.com/design/QNmiv2oZ9Jyz08orjDb7Cl/The-New-ADHD-OS`. Runs with `npm i`
then `npm run dev`.

## Current Registry Status

- Working status: `primary`
- Operator confirmation required: yes

## Department Linkage

- Working primary owning department: `adhd-os-product` (planned)

## Related Surfaces

- Related namespaces: `knowledge/adhd-os/`
- Related brand: `parties/brands/adhd-os.md`
- Related secret reference: `secrets/github-cllmholmes-alt-personal-access-token.md`

## Digestion or Migration Posture

- Working posture: `primary` (the live ADHD-OS website implementation)

## Open Decisions and Risks

- SECURITY (urgent): the local remote URL embeds a live `gho_` personal access token. See
  `secrets/github-cllmholmes-alt-personal-access-token.md`. Rotate the token and replace the
  remote with a credential-free URL before any remote operation.
