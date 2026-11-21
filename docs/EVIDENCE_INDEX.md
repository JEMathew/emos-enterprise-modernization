# EMOS V2 — Implementation and Verification Evidence

The current product follows Understand → Decide → Govern → Transform → Outcomes & Learn. [Current V2.0 and Future / Full EMOS Vision](../EMOS_V2_PRODUCT_CONTRACT.md) are the two scope categories. Reference values and session-scoped notes are current-product data boundaries.

## Implementation map

| Current V2.0 claim | Evidence |
| --- | --- |
| Exactly two Gemini specialists | `src/lib/agents/geminiOrchestrator.ts` routes Portfolio Discovery and Enterprise Architect; Ask EMOS is the interface and orchestration is deterministic. |
| Evidence readiness | `src/lib/readiness.ts` requires ≥70% completeness and zero critical gaps. Readiness does not grant approval. |
| Human Approval and all-six-6R workflows | `src/components/PortfolioPlanView.tsx` defines the disposition-specific operating frames; explicit approval controls progression. See the [canonical mapping](../README.md#six-6rs-six-operating-workflows). |
| Explainable planning | `src/lib/wavePlanner.ts` derives waves and mobilization readiness from workload evidence, dependencies, criticality and readiness. Missing evidence stays visible. |
| Measure and Learn | `src/lib/transformationEngine.ts` supplies reference outcomes; `src/components/Dashboard.tsx` retains session notes. Production telemetry and persistent organizational learning are future scope. |
| Authenticated model access | `server.ts` validates Firebase identity, request schemas and bounded untrusted context; credentials remain server-side. |
| Owner-bound persistence | `firestore.rules` and `tests/firestore.rules.test.ts` constrain stored assessments, imported workloads and program alignment. Reference-estate edits and approval state also use session state; no durable cross-user approval record is claimed. |
| Bounded imports | `src/utils/portfolioImporter.ts` and `tests/portfolioImporter.limits.test.ts` enforce 5 MB / 200-workload limits for CSV and JSON. |
| Governed execution scope | Execute exposes operating workflows, owners and checkpoints. It does not autonomously mutate external production infrastructure. |

[Architecture and trust boundaries](ARCHITECTURE.md) · [Approved product walkthrough](product-walkthrough/README.md)

## Verification at implementation commit 321478f

Verified 21 November 2026. The [machine-readable verification record](verification/v2-2026-11-21.json) retains provenance and hashes.

| Layer | Result | Source |
| --- | --- | --- |
| TypeScript / production build | PASS | `npm run lint`; `npm run build`, rerun locally |
| Software tests | 311/311 in 19 files | `npm run test:unit`, rerun locally; [current implementation CI](https://github.com/JEMathew/emos-enterprise-modernization/actions/runs/44837986000) |
| Firestore rules | 8/8, separate from software tests | Same CI run, Java 21 emulator |
| Local deterministic evals | 52/52 across six suites | Local rerun; [retained report](../evals/reports/latest-eval-report.json) |
| Full live Gemini baseline | 48/48 successful calls: 25 specialist calls + 23 independent model-based checks | [Recorded baseline](../evals/reports/baseline-run2-paid-tier-live-eval-report.json) |
| Specialist scenarios | Portfolio Discovery 4/4; Enterprise Architect 12/12 | Same recorded baseline |
| Canonical 6R agreement | 12/12, two per disposition | Same recorded baseline |
| Governance | 6/6 adversarial requests blocked before model invocation; zero model calls | Same recorded baseline |
| Later targeted verification | 3/3 checks | [Separate retained report](../evals/reports/targeted-live-verify-report.json) |

Successful API calls are distinct from answer correctness: the full baseline conversational suite passed 6/7. Later targeted checks passed 3/3 and are not added to the baseline's 48-call count. These observations do not establish universal accuracy or production-scale customer outcomes. No paid live evals were rerun for this documentation update.

## Historical configuration evidence

The [preserved AI Studio security constitution](AI_STUDIO_SECURITY_CONSTITUTION.md) records builder configuration verified on 14 September 2026, including an exact 4,654-character saved-value comparison. The historical record did not include a durable workspace-identifying screenshot. That dated configuration evidence does not replace current runtime tests or establish a new runtime dependency.

At that historical verification, Cloud Run injected the Gemini credential through Secret Manager and the runtime identity retained the required secret-access permission. The current [architecture](ARCHITECTURE.md) describes the runtime; no new IAM or deployment changes were made for this repository presentation update.
