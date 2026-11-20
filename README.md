# EMOS
**Enterprise Modernization Operating System (V2)**

> **AGENTS FOR AMBIGUITY · WORKFLOWS FOR PREDICTABILITY · RULES FOR GOVERNANCE · HUMANS FOR AUTHORITY.**

---

## What is EMOS?

**EMOS** is a governed, evidence-first Enterprise Modernization Operating System built on Google Cloud and Gemini. It turns fragmented application and data-platform evidence into auditable **6R** modernization decisions, disposition-specific execution plans, and structured outcome/learning workflows—while enforcing deterministic readiness gates and explicit human approval authority.

---

## Live Product

- **Production Application**: [https://emos-modernization-1027874783780.asia-southeast1.run.app](https://emos-modernization-1027874783780.asia-southeast1.run.app)
- **Trust & Evaluation Surface**: [https://emos-modernization-1027874783780.asia-southeast1.run.app/trust](https://emos-modernization-1027874783780.asia-southeast1.run.app/trust)
- **Public Evaluation Sandbox**: [https://emos-modernization-1027874783780.asia-southeast1.run.app/sandbox](https://emos-modernization-1027874783780.asia-southeast1.run.app/sandbox)
- **Canonical Repository**: [https://github.com/JEMathew/emos-enterprise-modernization](https://github.com/JEMathew/emos-enterprise-modernization)

---

## The Problem

Large enterprises manage thousands of interconnected applications and data platforms. Modernization programs routinely stall or overspend because:

- **Fragmented evidence**: Business criticality, stack lifecycle, TCO baselines, and target-state constraints live across disconnected spreadsheets and teams.
- **Hidden dependencies & risk**: Downstream integrations and cutover tolerances are often unverified when migration commitments are made.
- **Opaque decision rationale**: 6R recommendations are debated subjectively without traceable evidence or explicit alternative trade-offs.
- **Weak governance**: Unconstrained AI assistants can hallucinate missing financial/technical facts or recommend action without readiness gates.
- **Execution disconnect**: A 6R label rarely drives disposition-specific execution gates, wave sequencing, and outcome tracking.

---

## How EMOS Works

```
UNDERSTAND  →  DECIDE  →  GOVERN  →  TRANSFORM  →  OUTCOMES
```

1. **UNDERSTAND**: Inspect estate posture in the Command Center, browse or import portfolios (BYOP CSV/JSON), and audit each workload's 18-attribute **Enterprise DNA** (and Spatial DNA Mesh) against the deterministic **Evidence Readiness Gate** (`≥ 70%` completeness and `0` critical gaps).
2. **DECIDE**: Generate and explain canonical **6R** recommendations with supporting evidence, rejected alternatives, architectural risks, and counterfactual triggers (*"What evidence would change this recommendation?"*).
3. **GOVERN**: Enforce hard readiness gates (`NEEDS EVIDENCE` workloads cannot be approved or enter execution), prohibit auto-approval (`READY` never implies approval), and require explicit **Human-in-the-Loop (HITL)** sign-off.
4. **TRANSFORM**: Sequence approved workloads into deterministic modernization waves and progress through 6R-specific execution pipelines and checkpoint gates.
5. **OUTCOMES**: Compare Baseline → Target → Observed KPIs (**Measure**) and record playbook lessons (**Learn**), transparently scoped as representative/session-only views in V2.

---

## AI Architecture

```
User
  → Ask EMOS (single conversational interface)
  → Deterministic Orchestrator (routing, context lock, governance pre-check)
  → Portfolio Discovery Specialist and/or Enterprise Architect Specialist (Gemini)
  → Deterministic Validation & Governance (Zod schemas, 6R & readiness guardrails)
  → Explicit Human Approval (HITL)
  → Governed Modernization Workflow
```

EMOS V2 deliberately uses **TWO Gemini-backed specialist reasoning components** rather than an unconstrained multi-agent swarm:

- **Portfolio Discovery** (`src/lib/agents/geminiDiscoveryAgent.ts`): Reasons over heterogeneous Enterprise DNA evidence, synthesizes dependency relationships, detects ambiguities, identifies missing evidence, and prioritizes next investigations.
- **Enterprise Architect** (`src/lib/agents/geminiArchitectAgent.ts`): Reasons over multi-factor modernization options, trade-offs across all six canonical 6Rs, architectural risks, counterfactual change triggers, and premise-aware outcome questions.
- **Ask EMOS** (`src/components/ModernizationAgentPanel.tsx` → `POST /api/ask-emos`): One user-facing conversational interface (`Ask EMOS ⌘J`) with zero separate agent-picker buttons. If AI reasoning is unavailable or unauthenticated, it displays an explicit deterministic fallback banner (`"AI reasoning unavailable. Showing deterministic EMOS status/evidence instead."`).
- **Orchestrator** (`src/lib/agents/orchestrator.ts`, `src/lib/agents/geminiOrchestrator.ts`): A **deterministic coordination layer — NOT a third Agent**. It classifies intent, preserves estate/workload/stage context, coordinates Discovery → Architect handoff when needed, and intercepts governance/safety violations before any model call.

---

## Governed 6R Decisioning

EMOS enforces the six canonical modernization dispositions:

| Disposition | Plain-English Action | Downstream Operating Track |
| :--- | :--- | :--- |
| **Retain** | Keep it as-is | Govern & Monitor (Keep → Optimize → Monitor → Review Outcome) |
| **Retire** | Safely shut it down | Decommission & Archive (Consumer Transition → Archive → Decommission → Closure) |
| **Rehost** | Move it as-is | Infrastructure Migration (Prepare Destination → Move → Validate → Cutover → Stabilize) |
| **Replatform** | Move it to a better platform | Platform Transition (Prepare Target Platform → Transform/Migrate → Validate → Cutover) |
| **Refactor** | Redesign & modernize | Architecture Transformation (Redesign/Decompose → Implement → Test → Transition) |
| **Repurchase** | Replace with commercial SaaS | SaaS Replacement & Adoption (Select Replacement → Configure → Migrate Data/Users → Retire Legacy) |

Every recommendation surfaces evidence readiness, rationale, rejected alternatives, key risks, and requires explicit human approval before governed execution unlocks.

---

## Governance

- **Deterministic Evidence Readiness**: `evaluateEvidenceReadiness()` (`src/lib/readiness.ts`) enforces `≥ 70%` completeness and `0` critical gaps across Dependency, TCO Baseline (`e3`), and Target State.
- **Deterministic Gates**: `NEEDS EVIDENCE` workloads cannot be approved, cannot enter governed execution, and cannot advance stages—enforced across UI, `Dashboard`, `PortfolioPlanView`, and `transformationEngine`.
- **Explicit HITL Authority**: Evidence completeness (`85%`, `94%`, `100%`) **never** auto-approves a workload; explicit human sign-off is mandatory.
- **AI Cannot Self-Approve**: Model outputs are treated as untrusted advisory input, validated against strict Zod schemas and canonical 6R rules.
- **Fail-Closed Safety**: Adversarial bypass requests (gate bypass, HITL bypass, unsupported overrides, cross-workload evidence leakage, fabricated cost requests) and invalid API payloads fail closed before model execution.

---

## Evaluation

Software verification, local deterministic evals, paid-tier live Gemini evals, and post-fix targeted live verification are tracked separately:

| Evidence Layer | Verified Result | Source Artifact |
| :--- | :--- | :--- |
| **Software Tests (`npx vitest run`)** | **248 / 248 tests PASS** (`19 / 19` test files) | `tests/` |
| **Local Deterministic Evals (`npm run evals`)** | **52 / 52 cases PASS** (`6 / 6` suites) | [latest-eval-report.json](./evals/reports/latest-eval-report.json) |
| **Paid-Tier Live Gemini Run 2 (`npm run evals:live`)** | **48 / 48 live Gemini calls succeeded** (`gemini-flash-latest`, `0` timeouts, `0` 429s, `0` fallbacks) | [baseline-run2-paid-tier-live-eval-report.json](./evals/reports/baseline-run2-paid-tier-live-eval-report.json) |
| ↳ **Portfolio Discovery (Live)** | **4 / 4 live scenarios PASS** | Run 2 report |
| ↳ **Enterprise Architect (Live)** | **12 / 12 live scenarios PASS** | Run 2 report |
| ↳ **6R Agreement (Live)** | **12 / 12 across all six dispositions** (`2/2` each for Retain, Retire, Rehost, Replatform, Refactor, Repurchase) | Run 2 report |
| ↳ **Governance / Safety** | **6 / 6 tested adversarial scenarios blocked** (`0` model calls) | Run 2 report |
| **Targeted Post-Fix Live Verify (`npm run evals:live:targeted`)** | **3 / 3 PASS** (`LIVE-ASK-06` false-premise correction via `POST /api/ask-emos`, governance block, `400` schema fail-closed) | [targeted-live-verify-report.json](./evals/reports/targeted-live-verify-report.json) |

*(Evaluation scores reflect bounded synthetic benchmark scenarios and live API observations—not production throughput benchmarks or claims of infallible AI.)*

---

## Google Cloud Architecture

Deployed architecture on Google Cloud (`project: emos-enterprise-modernization`, `region: asia-southeast1`):

- **Cloud Run**: Hosts the unified Node.js/Express API and React 19 production bundle (`service: emos-modernization`).
- **Gemini API (`@google/genai`)**: Server-side specialist reasoning for Portfolio Discovery, Enterprise Architect, `POST /api/ask-emos` (45s timeout), and `POST /api/chat`.
- **Google Cloud Secret Manager**: Stores `emos-gemini-api-key` and injects `GEMINI_API_KEY` server-side only (never exposed to browser bundles).
- **Firebase Authentication**: Google Sign-In and verified Firebase ID token validation on protected AI endpoints.
- **Cloud Firestore**: Per-user isolated persistence for assessments, imported workloads, and program alignment governed by [firestore.rules](./firestore.rules).

---

## Trust & Evaluation

Evaluators can inspect live trust and governance posture directly at **[Trust & Evaluation](/trust)** ([https://emos-modernization-1027874783780.asia-southeast1.run.app/trust](https://emos-modernization-1027874783780.asia-southeast1.run.app/trust)):

- **Identity & Data Isolation**: Firebase Auth boundaries and user-scoped Firestore rules.
- **Evidence & Readiness Rules**: Deterministic `≥ 70%` + zero critical-gap conformance tests (`tests/readiness.evals.test.ts`).
- **AI Boundaries & Governance**: Untrusted-output validation, canonical 6R repair, secret redaction, and explicit HITL enforcement.
- **Implementation Limitations**: Explicit disclosure of synthetic demo evidence and representative Measure/Learn scope.

---

## Current Product Boundary

Authoritative scope is defined in [EMOS_V2_PRODUCT_CONTRACT.md](./EMOS_V2_PRODUCT_CONTRACT.md):

- **IMPLEMENTED**: 4-job OS workspace (`Understand / Decide / Transform / Outcomes`), BYOP CSV/JSON import, 18-attribute Enterprise DNA + Spatial Mesh, deterministic readiness gate, two Gemini-backed specialist agents behind `POST /api/ask-emos`, single `Ask EMOS ⌘J` UI with explicit fallback, explicit HITL approval, deterministic Wave Planning, 6R-specific execution pipelines, and `248` automated tests + local/live eval suites.
- **REPRESENTATIVE / PROTOTYPE**: `Load Sample Evidence (Demo)` vendor-neutral sandbox shortcut; archetype-level Baseline → Target → Observed benchmarks in **Measure**; archetype lessons and session-only notes in **Learn** (`Representative archetype lesson · Session-only note`).
- **FUTURE VISION**: Automated CMDB/APM/FinOps ingestion, persistent multi-user organizational learning feedback into scoring, live cloud migration execution/IaC provisioning, and enterprise ServiceNow/Jira approval integrations.

---

## Run Locally

```bash
git clone https://github.com/JEMathew/emos-enterprise-modernization.git
cd emos-enterprise-modernization
npm ci
cp .env.example .env
# Set GEMINI_API_KEY=<your-server-side-key> in .env (never commit .env)
npm run dev
```

---

## Verification

```bash
npm run lint        # Expected: PASS (0 TypeScript errors)
npm run build       # Expected: PASS (Vite client + esbuild server bundle)
npx vitest run      # Expected: PASS (19/19 files, 248/248 tests)
npm run evals       # Expected: PASS (6/6 suites, 52/52 local deterministic evals)
```

Live Gemini evals (require `GEMINI_API_KEY` in `.env`):

```bash
npm run evals:live
npm run evals:live:targeted
```

---

## Repository Structure

- `src/components/` — React 19 UI views (Command Center, Portfolio, Enterprise DNA, Decision Workspace, Plan/Execute/Measure/Learn, Ask EMOS, Trust & Evaluation, Learning Center).
- `src/lib/agents/` — Deterministic orchestrator, Gemini runtime, Zod schemas, Portfolio Discovery specialist, and Enterprise Architect specialist.
- `src/lib/` — Deterministic readiness engine (`readiness.ts`), 6R/security guardrails (`guardrails.ts`), transformation engine, wave planner, and Firebase/Gemini clients.
- `server.ts` — Express server, Firebase ID token verification, `POST /api/ask-emos`, `POST /api/chat`, and static production serving.
- `tests/` — 19 Vitest software, API contract, governance, fallback, and provenance test suites (`248` tests).
- `evals/` — Separate local deterministic eval suite (`52` cases), 18-scenario 6R dataset, paid-tier live Gemini eval runner, and preserved JSON reports.
- `firestore.rules` — User-isolated Cloud Firestore security rules.

---

## Product Contract & Engineering References

- **[EMOS_V2_PRODUCT_CONTRACT.md](./EMOS_V2_PRODUCT_CONTRACT.md)** — Authoritative V2 scope contract:
  > *"Implementation does not redefine product scope. Any proposed scope change requires explicit product-owner approval."*
- [AI Studio Security Constitution](./docs/AI_STUDIO_SECURITY_CONSTITUTION.md) — Trust boundaries, Firebase Auth, Secret Manager, and model-output guardrails.
- [Evidence Index](./docs/EVIDENCE_INDEX.md) — Dated verification and security audit log.
- [Canonical Messaging Source](./claude/messaging-source.md) — Capability-honest product messaging reference.
