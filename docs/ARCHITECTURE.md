# EMOS V2.0 Architecture

[Product contract](../EMOS_V2_PRODUCT_CONTRACT.md) · [Product walkthrough](product-walkthrough/README.md) · [Evidence index](EVIDENCE_INDEX.md)

EMOS connects workload evidence, constrained AI reasoning, explicit approval and disposition-specific operating workflows. The current reference implementation uses React, a Node.js/Express API, Gemini and Firebase on Google Cloud.

## Current V2.0 request and authority flow

```text
User
  → Ask EMOS (React conversational interface)
  → Authenticated API boundary (Firebase ID token + request schema)
  → Deterministic Orchestrator (context, routing, pre-model governance)
      → Portfolio Discovery specialist (Gemini)
      → Enterprise Architect specialist (Gemini)
  → Deterministic Governance (output schema, evidence, canonical 6R)
  → Explicit Human Approval
  → Governed 6R Workflow (Plan / Execute / Measure / Learn)
```

The two specialist branches run independently or as a Discovery → Architect handoff according to the request. There are exactly **two Gemini-backed specialist reasoning components**. Ask EMOS is the interface; the deterministic orchestrator is not another agent.

| Component | Responsibility | Implementation |
| --- | --- | --- |
| Ask EMOS | Conversational interface, workload/stage context and explicit fallback provenance | [`ModernizationAgentPanel.tsx`](../src/components/ModernizationAgentPanel.tsx) |
| API boundary | Verify identity, validate bounded requests, protect credentials and call server-side reasoning | [`server.ts`](../server.ts) |
| Orchestrator | Deterministic intent routing, context lock, pre-model blocking and specialist handoff | [`orchestrator.ts`](../src/lib/agents/orchestrator.ts), [`geminiOrchestrator.ts`](../src/lib/agents/geminiOrchestrator.ts) |
| Portfolio Discovery | Missing evidence, dependency interpretation and next investigation | [`geminiDiscoveryAgent.ts`](../src/lib/agents/geminiDiscoveryAgent.ts) |
| Enterprise Architect | 6R choices, alternatives, risks and evidence-grounded explanations | [`geminiArchitectAgent.ts`](../src/lib/agents/geminiArchitectAgent.ts) |
| Readiness and guardrails | ≥70% completeness, zero critical gaps, canonical 6R reconciliation and untrusted-output validation | [`readiness.ts`](../src/lib/readiness.ts), [`guardrails.ts`](../src/lib/guardrails.ts) |
| Operating workflows | Human approval, deterministic waves, 6R-specific checkpoints, Measure and Learn | [`Dashboard.tsx`](../src/components/Dashboard.tsx), [`PortfolioPlanView.tsx`](../src/components/PortfolioPlanView.tsx), [`wavePlanner.ts`](../src/lib/wavePlanner.ts), [`transformationEngine.ts`](../src/lib/transformationEngine.ts) |

`POST /api/ask-emos` is the conversational specialist endpoint. The application also exposes authenticated assessment/follow-up behavior through `POST /api/chat`; an endpoint is not an additional specialist identity.

## Governance and trust boundaries

**Agents reason. Rules validate. Humans approve.**

1. Browser input, imported evidence, history and model output are untrusted.
2. Protected API requests require verified Firebase identity and valid request schemas. Credentials remain server-side.
3. The deterministic orchestrator intercepts applicable bypass requests before Gemini is called. Recorded adversarial cases demonstrate zero model calls on those blocks.
4. Validated model reasoning cannot override the readiness calculation or canonical 6R constraints.
5. Readiness requires both ≥70% completeness and zero critical gaps. `READY` does not imply approval.
6. Explicit Human Approval and remaining checkpoint gates govern progression. V2.0 records and coordinates work; it does not mutate external production infrastructure.

## Six disposition-specific workflows

| Disposition | Current Execute surface |
| --- | --- |
| Retain | Govern & Monitor |
| Retire | Safely Decommission |
| Rehost | Migrate Infrastructure |
| Replatform | Transition Platform |
| Refactor | Transform Architecture |
| Repurchase | Replace & Adopt |

The real Plan surface is **Modernization Wave Plan**. Its selected disposition continues into the corresponding Execute surface. Read-only playbook previews do not change a workload's assessed recommendation.

## Identity and persistence

Firebase Authentication provides Google Sign-In. The API verifies signed ID tokens rather than trusting a browser-supplied user ID. Firestore rules restrict user records to the authenticated owner's path and deny unmatched paths.

Assessments, imported workloads and program alignment use owner-bound persistence. Reference-estate state, approval/checkpoint UI state and session-scoped lesson notes must not be described as a durable multi-user workflow or learning platform. Measure uses current reference outcomes, not production telemetry. See [`firestore.rules`](../firestore.rules) and its [security tests](../tests/firestore.rules.test.ts).

## Runtime versus delivery tooling

| Layer | Technology and role |
| --- | --- |
| Current runtime | Google Gemini API for reasoning; Cloud Run for API/application hosting; Secret Manager for server-side credentials; Firebase Authentication for identity; Cloud Firestore for owner-bound records. |
| Delivery | GitHub Actions runs the [release gate](../.github/workflows/guardrail-release-gate.yml). The recorded Cloud Run source-deploy workflow uses Cloud Build/Buildpacks and Artifact Registry images. |
| Build/design workflow | Google Stitch and Google Antigravity are build/design tools, not dependencies invoked by the EMOS runtime. |

Google Cloud is the current reference platform. It does not define the product's modernization destination or make EMOS a cloud-consumption-first tool.

## Future / Full EMOS Vision

Automated enterprise discovery, deep dependency intelligence, Target Architecture generation, portfolio optimization, policy packs, execution integrations, production outcome telemetry, persistent organizational learning and vendor-neutral execution ecosystems remain planned. The full vision spans applications, data and infrastructure, enterprise-controlled/private/on-premises deployment and managed SaaS deployment. Current V2.0 does not claim those integrations or deployment products are shipped.
