# EMOS — Canonical Messaging Source

Updated 21 November 2026 against the current V2.0 implementation. This document governs repository presentation; it does not authorize application behavior or scope changes. [Product contract](../EMOS_V2_PRODUCT_CONTRACT.md) · [Architecture](../docs/ARCHITECTURE.md)

## Product statement

**EMOS — Enterprise Modernization Operating System** connects enterprise evidence, governed AI decisions, disposition-specific operating workflows, outcomes and learning.

**UNDERSTAND → DECIDE → GOVERN → TRANSFORM → OUTCOMES & LEARN**

EMOS is workload-first and governed. Its full vision is vendor-agnostic. Google Cloud powers the current reference implementation; EMOS is not limited to cloud migration, assessment, planning or a conversational interface.

## Two scope categories

### Current V2.0

Command Center and Portfolio Discovery; CSV/JSON import; 18-attribute Enterprise DNA; evidence readiness; canonical 6R recommendations, explainability and alternatives; deterministic evidence gates; Human Approval; Program Alignment; Wave Planning; all-six-6R Plan/Execute workflows; Ask EMOS; Measure; Learn; evaluation/safety; identity and owner-bound persistence.

Measure uses current reference values where applicable. Learn includes session-scoped notes where applicable. These qualify data and persistence within V2.0 and are not a separate product status. V2.0 orchestrates governed workflows; it does not autonomously modify external production infrastructure.

### Future / Full EMOS Vision

Unified enterprise coverage across applications, data and infrastructure; automated CMDB/APM/cloud/repository/FinOps discovery; deep dependency intelligence; Target Architecture generation; portfolio optimization; enterprise policy packs; execution integrations; production telemetry; persistent organizational learning; vendor-neutral/multi-cloud execution ecosystems; enterprise-controlled/private/on-premises deployment; managed SaaS deployment.

Use planned or future tense for these capabilities. Do not present them as implemented integrations or deployment offerings.

## AI and authority

User → Ask EMOS → Deterministic Orchestrator → Portfolio Discovery and/or Enterprise Architect → Deterministic Governance → Human Approval → Governed 6R Workflow.

There are exactly two Gemini-backed specialist reasoning components: **Portfolio Discovery** and **Enterprise Architect**. Ask EMOS is the interface. The orchestrator is deterministic coordination, not a third agent. When live reasoning is unavailable, the product identifies its deterministic fallback explicitly.

**Agents reason. Rules validate. Humans approve.**

Readiness requires **≥70% completeness and zero critical gaps**. Confidence is not readiness; readiness is not approval. Canonical 6R reconciliation and deterministic validation constrain model advice. Applicable adversarial bypass requests are blocked before a model call.

## Canonical workflow names

| 6R | Workflow |
| --- | --- |
| Retain | Govern & Monitor |
| Retire | Safely Decommission |
| Rehost | Migrate Infrastructure |
| Replatform | Transition Platform |
| Refactor | Transform Architecture |
| Repurchase | Replace & Adopt |

The selected 6R determines the downstream operating workflow. Target-platform choices must follow evidence; Retain and Retire remain first-class options.

## Factual boundaries

- Apex Aerospace and Global Financial Services are reference enterprise estates, not customers.
- The 10,420+ asset context is not a live-connected inventory claim.
- The genuine `Load Sample Evidence (Demo)` control supplies reference values, not external verification. Preserve authentic UI labels in product recordings.
- Measure does not establish real customer ROI or live telemetry. Learn does not establish persistent autonomous learning or retraining.
- No autonomous external migration, multi-cloud execution integration, private/on-premises deployment product or managed SaaS product is claimed for current V2.0.
- Use the [evidence index](../docs/EVIDENCE_INDEX.md) for dated counts. Separate software tests, rule tests, local evals, successful live calls and scenario correctness.

## Presentation rules

Use natural product language: workload, portfolio, enterprise evidence, reference estate and governed workflow. Avoid repetitive simulation framing, unsupported superlatives and internal event terminology. Keep qualifications close to the claims they constrain.

The canonical short video is **EMOS V2 — Product Walkthrough**, duration **2:57**. It uses real light-mode product UI, the two specialists, governance, six workflows, Measure/Learn and bounded verification evidence. [Watch the walkthrough](../docs/product-walkthrough/README.md).

Runtime: Gemini API, Cloud Run, Secret Manager, Firebase Authentication and Cloud Firestore. Google Stitch and Google Antigravity are build/design tools, not runtime components.

The existing public landing page retains earlier Beta v1.0 copy. That authentic source is not retouched in the walkthrough; changing production copy is outside this repository-presentation update.

## Preserved company and full-vision facts

Founder experience: **15+ years**. Evidence model: **18 attributes across six dimensions**. The full architecture is designed to remain model-agnostic; the current implementation uses Gemini.

The authoritative lifecycle contains fifteen stages. The five-stage product narrative summarizes Align · Discover · Understand · Assess · Decide · Govern · Prioritize · Plan · Define Target State · Execute · Validate · Transition · Measure Benefits · Learn · Reassess. This full-vision lifecycle does not claim that every stage is implemented at enterprise scale.

The preserved public tagline is “AI-Native Modernization, Governed by Evidence—From First Signal to Proven Outcome.” The full-vision statement remains: “EMOS is designed to govern the full enterprise modernization lifecycle—from business alignment and estate discovery through evidence-based decisions and planning, into governed execution, validation, transition to live operations, measured benefits, learning and reassessment.” Current V2.0 availability is defined above.

## Dated public-copy history

The September 2026 Beta v1.0 messaging used “Beta v1.0 delivers the evidence, decision and planning foundation today” and “The current beta does not execute migrations”. These quotations explain the unchanged public landing copy and retained historical materials; they are not the current V2.0 capability definition. Use the Current V2.0 and Future / Full EMOS Vision sections above for new product education.
