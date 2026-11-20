# EMOS V2 Product Contract

> **Scope-Control Rule**:  
> *"Implementation does not redefine product scope. Any proposed scope change requires explicit product-owner approval."*

---

## 1. Product
**EMOS — Enterprise Modernization Operating System**

## 2. Version
**V2**

## 3. Canonical Repository
**`JEMathew/emos-enterprise-modernization`** (`https://github.com/JEMathew/emos-enterprise-modernization`)

## 4. Core User Journey
**`Understand → Decide → Govern → Transform → Outcomes`**
- **Understand**: Command Center, Portfolio Discovery, BYOP CSV/JSON import, Enterprise DNA (18 attributes + Spatial DNA Mesh), deterministic Evidence Readiness Gate (`≥ 70%` completeness and `0` critical gaps).
- **Decide**: Canonical 6R assessment, plain-English recommendations, rejected alternatives, counterfactual triggers, risks/constraints, and evidence-grounded explainability.
- **Govern**: Hard-enforced deterministic readiness gate (`NEEDS EVIDENCE` cannot be approved or enter/advance execution), zero auto-approval (`READY` never implies approval), explicit Human-in-the-Loop (HITL) approval authority.
- **Transform**: Deterministic Wave Planning and 6R-specific downstream execution playbooks (`Retain`, `Retire`, `Rehost`, `Replatform`, `Refactor`, `Repurchase`).
- **Outcomes**: Baseline → Target → Observed outcome tracking (`Measure`) and playbook lesson capture (`Learn`), transparently scoped as representative/session-only in V2.

## 5. Six Canonical 6R Dispositions
1. **Retain** — Govern & Monitor in place
2. **Retire** — Safely Decommission & Archive
3. **Rehost** — Migrate Infrastructure (Lift-and-Shift)
4. **Replatform** — Transition to Managed Platform
5. **Refactor** — Transform Architecture (Cloud-Native Decomposition)
6. **Repurchase** — Replace with Commercial SaaS & Adopt

## 6. AI & Governance Architecture
Design principle: **AGENTS FOR AMBIGUITY · WORKFLOWS FOR PREDICTABILITY · RULES FOR GOVERNANCE · HUMANS FOR AUTHORITY.**

- **Portfolio Discovery Specialist Agent** (`src/lib/agents/geminiDiscoveryAgent.ts`): Server-side Gemini reasoning over heterogeneous Enterprise DNA evidence, dependency/relationship synthesis, ambiguity detection, missing-evidence identification, and prioritized next investigations, validated against strict Zod output schemas (`portfolioDiscoveryOutputSchema`).
- **Enterprise Architect Specialist Agent** (`src/lib/agents/geminiArchitectAgent.ts`): Server-side Gemini multi-factor reasoning across all six canonical 6R dispositions, alternative comparisons, risks/constraints, counterfactual triggers (`recommendationChangeTriggers`), and premise-aware outcome reasoning (`directAnswer`), validated against strict Zod output schemas (`enterpriseArchitectOutputSchema`) and canonical 6R guardrails.
- **Ask EMOS Conversational Interface** (`src/components/ModernizationAgentPanel.tsx` → `POST /api/ask-emos`): Single user-facing conversational experience (`Ask EMOS ⌘J`) with zero separate user-selectable agent buttons, authenticated server-side execution, and explicit deterministic fallback semantics when AI reasoning is unavailable.
- **Deterministic Orchestration** (`src/lib/agents/orchestrator.ts`, `src/lib/agents/geminiOrchestrator.ts`): Intent classification, estate/workload/stage context isolation, Discovery → Architect handoff, and pre-model adversarial governance interception (`0` LLM calls on blocked prompts).
- **Deterministic Governance & Readiness** (`src/lib/readiness.ts`, `src/lib/guardrails.ts`, `src/lib/transformationEngine.ts`): Authoritative `≥ 70%` + `0` critical-gap readiness gate, canonical 6R taxonomy enforcement, input fencing, secret redaction, and hard-blocked execution for `NEEDS EVIDENCE` or unapproved workloads.
- **Explicit Human Approval (HITL)**: Human approval is never inferred from evidence completeness (`85%`, `94%`, `100%` still require explicit human sign-off).

## 7. Implemented & Verified V2 Capabilities
- 4-job governed OS workspace (`Understand`, `Decide`, `Transform`, `Outcomes`) with persistent estate and workload context.
- Synthetic reference estates (Apex Aerospace, Global Financial Services) + Bring-Your-Own-Portfolio (BYOP) CSV/JSON import with schema sanitization.
- 18-attribute Enterprise DNA inspector with manual per-field verification and explicitly labeled vendor-neutral demo shortcut (`Load Sample Evidence (Demo)`).
- Deterministic Evidence Readiness Gate (`≥ 70%` + `0` critical gaps) enforced across UI, `Dashboard`, `PortfolioPlanView`, and `transformationEngine`.
- Two Gemini-backed specialist agents (`Portfolio Discovery` and `Enterprise Architect`) orchestrated deterministically behind authenticated `POST /api/ask-emos` (45s production timeout) and `POST /api/chat`.
- Single `Ask EMOS ⌘J` conversational drawer with explicit fallback banner (`"AI reasoning unavailable. Showing deterministic EMOS status/evidence instead."`).
- Deterministic Wave Planning and 6R-specific execution pipelines gated behind `READY` + explicit Human Approval.
- History, Learning Center, Evaluation Evidence, Data Access Controls, and Firestore Security Rules (`firestore.rules`).
- Automated verification: `248/248` Vitest tests (`19/19` files), `52/52` local deterministic evals, `48/48` paid-tier live Gemini evals (all 6 canonical 6Rs live-verified), and `3/3` post-fix targeted live verification.

## 8. Representative / Demo Capabilities (Explicitly Disclosed)
- **Measure**: Archetype-level Baseline → Target → Observed benchmarks (`src/lib/transformationEngine.ts`), labeled in UI as representative synthetic benchmarks.
- **Learn**: Archetype lessons + session-only user lesson notes (`useState`), labeled in UI as `Representative archetype lesson · Session-only note (No automated retraining)`.
- **Demo Evidence Shortcut**: `Load Sample Evidence (Demo)` loads vendor-neutral synthetic sample values for sandbox evaluation without claiming external verification.

## 9. Future / Full-Vision Capabilities (Out of V2 Scope)
- Automated enterprise CMDB, APM, cloud billing, and FinOps telemetry ingestion.
- Persistent multi-user organizational learning store and governed feedback into future portfolio scoring.
- Live cloud migration execution, IaC provisioning, and CI/CD cutover automation.
- Enterprise SSO/RBAC approval workflows with external change-management (ServiceNow/Jira) integration.

## 10. Production URL
**`https://emos-modernization-1027874783780.asia-southeast1.run.app`**  
*(Google Cloud Project: `emos-enterprise-modernization` · Region: `asia-southeast1` · Service: `emos-modernization`)*

## 11. Scope-Control Rule
> **Implementation does not redefine product scope. Any proposed scope change requires explicit product-owner approval.**
