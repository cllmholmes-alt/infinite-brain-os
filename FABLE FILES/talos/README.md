# TALOS - governed local-first agentic OS (foundation build)

Run: npm i && npm run typecheck && npm test && npm run api
Verify: npm run verify:system-law && npm run verify:no-production-fixtures && npm run verify:audit-chain
Prime law: TALOS_SYSTEM_LAW.md (protected). Spec: TALOS_MAXIMUM_CAPABILITY_SPEC_v2.md.
Only legal path: UI/API -> ExecutionCoordinator -> PLTE -> Approvals -> Tool Contract -> Evidence.
Blocked in this env: Postgres/Redis/Next build (see UNKNOWN_BLOCKED_REGISTER.md).
