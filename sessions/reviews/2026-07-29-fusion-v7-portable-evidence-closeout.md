Session record: `sessions/closed/2026-07-29-fusion-v7-portable-evidence.md`

## Summary

Fusion Evolution V7 completed 50/50. Private release
`v27-3bf4d7f9-20260729T181942Z` is active with verified v25 rollback. Release evidence
now seals the exact staged candidate and remains stable after commit. Infinite Brain
receipts are portable, hash-chained, bounded, secret-safe, and Git-tracked.

## Outputs produced

- Deterministic evidence sealer and 11 Git-fixture tests.
- Portable schema-3 knowledge ledger and 61 adversarial tests.
- Fail-closed incomplete-cleanroom behavior and regression proof.
- Current Fusion release support, relationship candidate, and registry refresh.
- Tracked historical and current receipt backups plus v27 receipt.
- Closed session record and durable transcript log.

## Decisions made

- Keep Infinite Brain canonical and Hermes a digest-bound non-authoritative cache.
- Bind release evidence to the exact staged Git candidate before manifest generation.
- Track generated projection rollback bytes because they are bounded and secret-scanned.
- Preserve all historical receipt backups found after removing the blanket ignore rule.
- Keep v25 as designated rollback; retain v26 only as intermediate failure evidence.
- Preserve the protected public-edge block.

## Wrong turns and confusion

- The first v26 durable probe omitted required cleanroom outputs. This was a probe error,
  but it revealed a real TypeError and retry storm instead of a fail-closed result.
- The first v27 archive retained macOS provenance metadata. The unpromoted candidate was
  path-validated, replaced from its archive parent, rebuilt without extended attributes,
  and independently reverified before promotion.
- Several remote diagnostic Python snippets initially had shell-quoting errors. No runtime
  state changed in those failed diagnostics.

## Usage receipt

- Usage capture status: unavailable
- Usage source: unavailable
- Runtime session id: unavailable
- Captured at: 2026-07-29T18:28:08Z
- Input tokens: unavailable
- Output tokens: unavailable
- Cached input tokens: unavailable
- Tool calls: unavailable
- Tool cost usd: unavailable
- Estimated cost usd: unavailable
- Usage notes: This Codex surface does not expose reliable session-level usage totals.

## Memory candidates

- The v27 release packet, schema-3 receipt, and tracked backup sets are durable memory products.

## PKM or namespace candidates

- `knowledge/talos/synthesis/fusion-brain-relationship-current.md` remains operator-pending.

## Follow-up tasks

- Observe v27 through the rollback-retention window.
- Monitor Hermes and ADHD-OS timers, deep health, queue depth, and outbox state.
- Retire v25 only after explicit retention approval.

## Swarm candidates or follow-ups

- None.

## Human review needed

- Review the relationship candidate before promotion to canon.
- Public facade promotion still requires unanimous review and explicit operator approval.

## System improvements

- Evidence-generation order is now executable and self-checking.
- Clean clones can verify rollback backup membership and bytes.
- Incomplete cleanroom payloads terminate safely instead of exhausting worker retries.

## Unresolved risks or open questions

- Public routing remains intentionally blocked.
- Seventeen historical PostgreSQL dead-letter rows remain append-only incident evidence.
