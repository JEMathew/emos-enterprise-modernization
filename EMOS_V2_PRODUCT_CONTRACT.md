# EMOS V2.0 Product Contract

**EMOS — Enterprise Modernization Operating System**

[Live product](https://emos-modernization-1027874783780.asia-southeast1.run.app/) · [Canonical repository](https://github.com/JEMathew/emos-enterprise-modernization) · [Product walkthrough](docs/product-walkthrough/README.md) · [Architecture](docs/ARCHITECTURE.md)

> Implementation does not redefine product scope. Any proposed scope change requires explicit product-owner approval.

This contract describes the current repository implementation and the planned full EMOS vision. It has two scope categories: **Current V2.0** and **Future / Full EMOS Vision**. Descriptions of reference data and session persistence qualify current behavior; they do not form another product status.

## Product principle

**UNDERSTAND → DECIDE → GOVERN → TRANSFORM → OUTCOMES & LEARN**

EMOS is workload-first and governed. Its full vision is vendor-agnostic. The current reference implementation uses Google Cloud and Gemini while keeping Retain, Retire and evidence-led target selection first-class.

## Current V2.0

| Area | Available behavior and implementation boundary |
| --- | --- |
| Portfolio Discovery | Command Center, reference enterprise portfolios, CSV/JSON import and workload prioritization. Import limits are 5 MB and 200 workloads, validated without silent partial ingestion. |
| Enterprise DNA | Eighteen attributes across six dimensions, evidence verification, dependency context and Spatial DNA Mesh. |
| Evidence Readiness | `READY` requires ≥70% completeness and zero critical gaps. Otherwise the state is `NEEDS EVIDENCE`. |
| 6R decisioning | Canonical recommendations, evidence, rationale, proof points, alternatives, risks and counterfactual explanations. |
| Ask EMOS | One interface to Portfolio Discovery and Enterprise Architect, with explicit fallback when live AI reasoning is unavailable. |
| Governance | Deterministic validation and canonical 6R reconciliation, pre-model blocking where applicable, explicit Human Approval and zero auto-approval. |
| Program Alignment and Wave Planning | Owner-bound program context, deterministic sequencing and visible readiness/dependency constraints. |
| Plan / Execute | Six disposition-specific operating playbooks with owners, prerequisites, checkpoints, deliverables and approval gates. No autonomous external infrastructure mutation. |
| Measure | Current baseline, target and observed reference values where applicable. These are not live customer telemetry or demonstrated customer ROI. |
| Learn | Contextual lessons and session-scoped notes where applicable. No persistent autonomous learning or automated retraining. |
| Identity and persistence | Firebase Authentication; owner-bound Firestore assessments, imported workloads and program alignment; history and access rules. Session-scoped UI state is not represented as durable enterprise workflow storage. |
| Verification and education | Software/API/UI/security tests, local and live eval evidence, public Trust/sandbox surfaces and the Learning Center. |

Apex Aerospace and Global Financial Services are reference estates, not actual customers. The 10,420+ asset context is not a claim of 10,420 live production connections. The real `Load Sample Evidence (Demo)` control fills reference values; it does not perform external verification. Its authentic label remains unchanged.

## Six 6Rs select six workflows

| Disposition | Execute workflow |
| --- | --- |
| Retain | Govern & Monitor |
| Retire | Safely Decommission |
| Rehost | Migrate Infrastructure |
| Replatform | Transition Platform |
| Refactor | Transform Architecture |
| Repurchase | Replace & Adopt |

These are the current titles in [`PortfolioPlanView.tsx`](src/components/PortfolioPlanView.tsx). A 6R is an operating-workflow choice, not only a classification. Governed workflow orchestration does not imply live migrations or external provisioning.

## Two Gemini specialists and deterministic authority

```text
User → Ask EMOS → Deterministic Orchestrator
                 → Portfolio Discovery and/or Enterprise Architect
                 → Deterministic Governance → Human Approval
                 → Governed 6R Workflow
```

- **Portfolio Discovery**: missing evidence, dependency interpretation, ambiguity and next investigations; [`geminiDiscoveryAgent.ts`](src/lib/agents/geminiDiscoveryAgent.ts).
- **Enterprise Architect**: 6R reasoning, alternatives, risks, counterfactuals and premise-aware explanations; [`geminiArchitectAgent.ts`](src/lib/agents/geminiArchitectAgent.ts).
- **Ask EMOS** is the interface. The orchestrator is deterministic coordination, **not a third agent**; [`geminiOrchestrator.ts`](src/lib/agents/geminiOrchestrator.ts).
- Model output is advisory and schema-validated. Readiness and approval authority remain in code and explicit human action.

**Agents reason. Rules validate. Humans approve.**

[`readiness.ts`](src/lib/readiness.ts) checks the threshold and critical dependency, detailed TCO baseline and target-state evidence. [`guardrails.ts`](src/lib/guardrails.ts) constrains canonical output. [`transformationEngine.ts`](src/lib/transformationEngine.ts) and the UI preserve evidence and approval gates. High completeness or confidence never substitutes for Human Approval.

## Future / Full EMOS Vision

- Unified end-to-end enterprise coverage across applications, data and infrastructure.
- Automated CMDB/APM/cloud/repository/FinOps discovery and deep dependency intelligence.
- Target Architecture generation, portfolio optimization and enterprise policy packs.
- Execution integrations, automated provisioning/cutover and a vendor-neutral, multi-cloud execution ecosystem.
- Production outcome telemetry and persistent organizational learning.
- Enterprise-controlled/private/on-premises deployment and managed SaaS deployment.
- Enterprise approval integrations and broader organizational access-policy support.

These remain planned product capabilities. Current reference architecture, source availability or example workflow steps do not establish that these integrations or deployment offerings are implemented.

## Verification and deployment reference

The [evidence index](docs/EVIDENCE_INDEX.md) records the implementation commit and dated checks: 311 software tests in 19 files, 8 separate Firestore-rule tests, 52 local cases, the retained 48-call live baseline and 3 targeted post-fix checks. Call success and scenario correctness are distinct measures.

Current production: Cloud Run service `emos-modernization`, project `emos-enterprise-modernization`, region `asia-southeast1`. This documentation update does not change application behavior, runtime configuration or deployment.
