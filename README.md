# EMOS — Enterprise Modernization Operating System

EMOS connects enterprise evidence, governed AI decisions, disposition-specific execution workflows, outcomes and learning in one workload-first modernization lifecycle.

**[LIVE PRODUCT](https://emos-modernization-1027874783780.asia-southeast1.run.app/)** · **[PRODUCT WALKTHROUGH · 2:57](docs/product-walkthrough/README.md)** · **[PRODUCT / TECHNICAL DOCUMENTATION](EMOS_V2_PRODUCT_CONTRACT.md)**

**UNDERSTAND → DECIDE → GOVERN → TRANSFORM → OUTCOMES & LEARN**

Modernization teams need to decide what should change, why, and in what order. EMOS connects fragmented portfolio evidence to accountable decisions and the operating workflow that follows each decision. Retain and Retire are first-class paths alongside platform change. Google Cloud powers the current V2.0 reference implementation; the full EMOS vision is vendor-agnostic.

## Current V2.0

| Capability | Available behavior |
| --- | --- |
| Understand | Command Center, Portfolio Discovery, CSV/JSON import, 18-attribute Enterprise DNA, dependency context and evidence readiness. |
| Decide | Canonical 6R recommendations with evidence, rationale, risks, alternatives, proof points and counterfactual explanations. |
| Govern | Deterministic evidence gates, canonical 6R reconciliation and explicit Human Approval. Readiness never grants approval. |
| Transform | Program Alignment, Wave Planning, Plan and all-six-6R Execute workflows with owners, checkpoints and approval gates. |
| Outcomes & Learn | Measure compares baseline, target and observed reference values. Learn provides contextual lessons and session-scoped notes. |
| Ask EMOS | One interface to exactly two Gemini-backed specialists: Portfolio Discovery and Enterprise Architect. |
| Identity & persistence | Firebase Authentication and owner-bound Firestore records for assessments, imported workloads and program alignment. |

V2.0 orchestrates governed work; it does not autonomously change external production infrastructure. Measure's reference values are not live customer telemetry, and Learn's session notes are not persistent autonomous organizational learning. These are data and persistence boundaries within current V2.0, not separate product-status categories.

Apex Aerospace and Global Financial Services are reference enterprise estates, not customers. The 10,420+ asset Aerospace context does not represent that many live-connected production systems.

## AI architecture

```text
User → Ask EMOS → Deterministic Orchestrator
                   ├─ Portfolio Discovery (Gemini)
                   └─ Enterprise Architect (Gemini)
     → Deterministic Governance → Human Approval → Governed 6R Workflow
```

**Portfolio Discovery** identifies missing evidence, dependencies and the next investigation. **Enterprise Architect** reasons through modernization choices, alternatives and workload-specific trade-offs. Ask EMOS is the interface. The deterministic orchestrator routes requests, preserves workload context and blocks unsafe requests before a model call; it is **not a third agent**.

[Architecture and implementation map](docs/ARCHITECTURE.md)

## Six 6Rs, six operating workflows

| 6R | Downstream workflow |
| --- | --- |
| Retain | Govern & Monitor |
| Retire | Safely Decommission |
| Rehost | Migrate Infrastructure |
| Replatform | Transition Platform |
| Refactor | Transform Architecture |
| Repurchase | Replace & Adopt |

A recommendation selects the downstream governed operating workflow, not merely a classification. The [product walkthrough](docs/product-walkthrough/README.md) follows Aerospace's Enterprise Data Warehouse through Replatform → Transition Platform, then Banking's ATM/HSM Switch through Retain → Govern & Monitor.

## Governance

**Agents reason. Rules validate. Humans approve.**

- Readiness requires **≥70% evidence completeness and zero critical gaps**. Dependency evidence, detailed TCO baseline and target-state fields participate in critical-gap checks.
- Model output is untrusted: schemas, canonical 6R reconciliation and deterministic validation constrain the result.
- `NEEDS EVIDENCE` blocks approval and governed progression. `READY` still requires explicit Human Approval; auto-approval is never allowed.
- Applicable adversarial requests are blocked by the orchestrator before Gemini is called. Failed authentication and invalid request schemas also fail closed.

See the [product contract](EMOS_V2_PRODUCT_CONTRACT.md), [implementation evidence](docs/EVIDENCE_INDEX.md), [live Trust page](https://emos-modernization-1027874783780.asia-southeast1.run.app/trust) and [public sandbox](https://emos-modernization-1027874783780.asia-southeast1.run.app/sandbox).

## Future / Full EMOS Vision

The full vision extends unified coverage across **applications, data and infrastructure**, while retaining workload-first decisions and accountable governance:

- Automated CMDB, APM, cloud, repository and FinOps discovery; deep dependency intelligence.
- Target Architecture generation, portfolio optimization and enterprise policy packs.
- Execution integrations and a vendor-neutral, multi-cloud execution ecosystem.
- Production outcome telemetry and persistent organizational learning.
- Enterprise-controlled/private/on-premises deployment and managed SaaS deployment.

These are planned capabilities, not claims that the current V2.0 reference implementation provides those integrations or deployment products.

## Verified V2.0 evidence

Rechecked against implementation commit `321478f` on 21 November 2026. Documentation and walkthrough publication do not change the implementation. [Verification record](docs/verification/v2-2026-11-21.json) · [Evidence index](docs/EVIDENCE_INDEX.md)

| Evidence | Result | Provenance |
| --- | --- | --- |
| Software tests | **311/311**, **19/19 files** | Current local run and [CI](https://github.com/JEMathew/emos-enterprise-modernization/actions/runs/44837986000) |
| Firestore security rules | **8/8**, separate from the 311 tests | Same CI run, Java 21 emulator |
| Local deterministic evals | **52/52**, six suites | Current local rerun; [retained report](evals/reports/latest-eval-report.json) |
| Full paid-tier live Gemini run | **48/48 successful calls** | [Recorded baseline](evals/reports/baseline-run2-paid-tier-live-eval-report.json) |
| Portfolio Discovery / Enterprise Architect | **4/4 / 12/12** scenarios | Same recorded baseline |
| All-six-6R live agreement | **12/12**, two per disposition | Same recorded baseline |
| Governance / safety | **6/6** adversarial requests blocked; **0 model calls** | Same recorded baseline |
| Targeted post-fix verification | **3/3** checks | [Separate later report](evals/reports/targeted-live-verify-report.json) |

The 48 calls comprise 25 specialist calls and 23 independent model-based checks. Successful calls do not imply universal answer correctness: the original conversational suite passed 6/7; the later targeted checks passed 3/3. These are bounded verification observations, not production-scale performance or real-customer outcome claims. No paid live evals were rerun for this documentation update.

## Technology

| Current runtime | Role |
| --- | --- |
| Google Gemini API | Server-side specialist reasoning |
| Google Cloud Run | Node.js/Express API and React application hosting |
| Google Cloud Secret Manager | Server-side Gemini credential injection |
| Firebase Authentication | Google Sign-In and verified identity |
| Cloud Firestore | Owner-bound application records and security rules |

Cloud Build/Buildpacks and Artifact Registry support the recorded deployment workflow. Google Stitch and Google Antigravity belong to the build/design workflow; they are not runtime dependencies. See [architecture](docs/ARCHITECTURE.md) for trust boundaries and code references.

## Run locally

Requires Node.js 20+ and npm. Java 21 is required for Firestore emulator tests.

```bash
git clone https://github.com/JEMathew/emos-enterprise-modernization.git
cd emos-enterprise-modernization
npm ci
cp .env.example .env
# Configure the server-side GEMINI_API_KEY in .env; never commit it.
npm run dev
```

The authenticated AI path also requires the existing Firebase project configuration. Without authenticated AI access, Ask EMOS explicitly identifies its deterministic fallback; it does not present fallback output as a live Gemini response.

```bash
npm run lint
npm run test:unit       # 311 tests in 19 files
npm run test:firestore  # 8 security-rule tests; Java 21 required
npm run evals           # 52 local cases; no live model calls
npm run build
```

`npm test` runs both software and Firestore-rule tests. Paid live checks are opt-in through `npm run evals:live` and `npm run evals:live:targeted`; they require server-side credentials and consume Gemini quota.

## Repository guide

- [Product contract](EMOS_V2_PRODUCT_CONTRACT.md) — current V2.0 and full-vision boundaries.
- [Architecture](docs/ARCHITECTURE.md) — two specialists, deterministic orchestration, governance and persistence.
- [Product walkthrough](docs/product-walkthrough/README.md) — final 2:57 video, captions and transcript.
- [Walkthrough route](docs/DEMO_FLOW.md) — the demonstrated product journey.
- [Evidence index](docs/EVIDENCE_INDEX.md) — implementation and verification sources.
- [Canonical messaging](claude/messaging-source.md) — product terminology and capability boundaries.
- [Security constitution](docs/AI_STUDIO_SECURITY_CONSTITUTION.md) — preserved builder-security requirements and dated configuration evidence.
- `src/` — product UI, deterministic engines and specialist implementations; `server.ts` — API/authentication boundary; `tests/` and `evals/` — distinct verification layers.

[Canonical GitHub repository](https://github.com/JEMathew/emos-enterprise-modernization)
