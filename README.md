# EMOS V2 — Enterprise Modernization Operating System

**Governed, Evidence-First Enterprise Modernization on Google Cloud & Gemini**

- **Production Demo URL**: [https://emos-modernization-1027874783780.asia-southeast1.run.app](https://emos-modernization-1027874783780.asia-southeast1.run.app)
- **Canonical Repository**: [https://github.com/JEMathew/emos-enterprise-modernization](https://github.com/JEMathew/emos-enterprise-modernization)
- **Product Scope Contract**: [EMOS_V2_PRODUCT_CONTRACT.md](./EMOS_V2_PRODUCT_CONTRACT.md)

---

## The Problem

Large enterprises operate thousands of interconnected applications and data platforms and must continuously decide what stays, what retires, what moves, what changes, and what gets replaced. In practice, modernization programs fail because:

- **Evidence is fragmented** across spreadsheets, CMDBs, architects, and finance teams.
- **Decisions are inconsistent and opaque**, relying on ad-hoc opinions rather than verifiable facts.
- **AI tools hallucinate or bypass governance**, producing confident recommendations even when critical dependency, TCO, or target-state facts are missing.
- **Decisions disconnect from execution and outcomes**, leaving organizations without disposition-specific execution gates or reusable institutional memory.

---

## What EMOS V2 Delivers

EMOS V2 turns fragmented workload evidence into governed 6R modernization decisions, disposition-specific execution plans, and structured outcome/learning views across a unified five-stage lifecycle:

```
UNDERSTAND  →  DECIDE  →  GOVERN  →  TRANSFORM  →  OUTCOMES
```

1. **Understand**: Command Center estate posture, Portfolio Discovery, BYOP CSV/JSON import with sanitization, 18-attribute **Enterprise DNA** (with Spatial DNA Mesh), and a deterministic **Evidence Readiness Gate** (`≥ 70%` completeness + `0` critical gaps).
2. **Decide**: Canonical **6R** assessment (`Retain`, `Retire`, `Rehost`, `Replatform`, `Refactor`, `Repurchase`), plain-English recommendations, rejected alternatives, counterfactual triggers, and evidence-grounded explainability.
3. **Govern**: Deterministic enforcement of the readiness gate (`NEEDS EVIDENCE` workloads cannot be approved or enter/advance execution), **zero auto-approval** (`READY` never implies approval), and **explicit Human-in-the-Loop (HITL) approval authority**.
4. **Transform**: Deterministic Wave Planning and 6R-specific execution pipelines whose stages and gates adapt to the approved disposition.
5. **Outcomes**: Baseline → Target → Observed KPI comparison (`Measure`) and archetype playbook lessons + session-only notes (`Learn`), transparently disclosed as representative prototype views in V2.

---

## Architecture Overview

EMOS V2 follows one strict engineering thesis:

> **AGENTS FOR AMBIGUITY · WORKFLOWS FOR PREDICTABILITY · RULES FOR GOVERNANCE · HUMANS FOR AUTHORITY.**

```
                         ┌─────────────────────────────────────┐
                         │   Ask EMOS (Single User Surface)    │
                         │      React 19 · TypeScript · Vite   │
                         └──────────────────┬──────────────────┘
                                            │ Authenticated HTTPS (Firebase ID Token)
                                            ▼
                         ┌─────────────────────────────────────┐
                         │  POST /api/ask-emos (Express / CR)  │
                         │   Deterministic EMOS Orchestrator   │
                         │  • Pre-model governance guardrail   │
                         │  • Intent routing & context lock    │
                         │  • Discovery → Architect handoff    │
                         └──────────┬────────────────┬─────────┘
                                    │                │
              ┌─────────────────────▼──┐          ┌──▼──────────────────────┐
              │ Portfolio Discovery    │          │ Enterprise Architect    │
              │ Specialist (Gemini)    │          │ Specialist (Gemini)     │
              │ • Evidence synthesis   │          │ • Multi-factor 6R       │
              │ • Dependency/ambiguity │          │ • Alternatives & risks  │
              │ • Next investigations  │          │ • Counterfactuals       │
              │ • Zod schema validated │          │ • Premise correction    │
              └────────────────────────┘          └─────────────────────────┘
                                    │                │
                                    └────────┬───────┘
                                             ▼
                         ┌─────────────────────────────────────┐
                         │ Deterministic Guardrails & HITL     │
                         │ • ≥70% + 0 critical gaps (readiness)│
                         │ • Canonical 6R taxonomy validation  │
                         │ • Explicit Human Approval required  │
                         │ • Explicit fallback if AI offline   │
                         └─────────────────────────────────────┘
```

- **Two Gemini-Backed Specialist Agents** (`src/lib/agents/geminiDiscoveryAgent.ts`, `src/lib/agents/geminiArchitectAgent.ts`): Invoke server-side `@google/genai` (key mounted via Google Cloud Secret Manager; never exposed client-side) with strict Zod structured JSON contracts and deterministic reconciliation.
- **Ask EMOS** (`src/components/ModernizationAgentPanel.tsx`): One quiet conversational entry point (`Ask EMOS ⌘J`) wired to `POST /api/ask-emos`. When unauthenticated or when AI reasoning is unavailable, it displays an explicit fallback banner (`"AI reasoning unavailable. Showing deterministic EMOS status/evidence instead."`) and never silently fakes a live AI answer.
- **All Six Canonical 6Rs as an Operating Model**: Each disposition (`Retain`, `Retire`, `Rehost`, `Replatform`, `Refactor`, `Repurchase`) selects distinct downstream execution stages, gates, outcome metrics, and learning playbooks (`src/lib/transformationEngine.ts`).

---

## Verification & Evaluation Evidence

EMOS separates software testing, local deterministic evals, paid-tier live Gemini evals, and targeted post-fix live verification:

| Verification Layer | Command | Verified Baseline | Scope / Boundary |
| :--- | :--- | :--- | :--- |
| **Typecheck & Production Build** | `npm run lint && npm run build` | **PASS** (0 TS errors; client + server bundle) | Static typing & production packaging |
| **Automated Software Tests** | `npx vitest run` | **19/19 files · 248/248 tests PASS** | Unit, API contract, governance invariants, fallback, UI & provenance tests |
| **Firestore Security Rules** | `npm run test:firestore` (CI) | **PASS in GitHub Actions CI** | Isolated user data access rules (`firestore.rules`) |
| **Local Deterministic Evals** | `npm run evals` | **6/6 suites · 52/52 cases PASS (100%)** | Deterministic routing, handoff, 6R baseline, governance & 8-stage workflows |
| **Paid-Tier Live Gemini Evals** | `npm run evals:live` | **48/48 live calls ok (`gemini-flash-latest`)** · Discovery `4/4` · Architect `12/12` (all 6 canonical 6Rs `2/2` each) · Ask EMOS `6/7` (`92.9%`) · Gov `6/6` · `100%` groundedness · `0%` unsupported claims | Live eval observations (`evals/reports/baseline-run2-paid-tier-live-eval-report.json`), graded with deterministic checks + independent Gemini rubric evaluator |
| **Targeted Post-Fix Live Verify** | `npm run evals:live:targeted` | **3/3 PASS (100%)** | Live `POST /api/ask-emos` verification of `LIVE-ASK-06` false-premise correction (`2/2/2`), deterministic governance block (`0` model calls), and `400` schema fail-closed |

---

## Local Development

```bash
npm ci
npm run lint
npm run build
npx vitest run
npm run evals
```

To run the development server locally:
```bash
cp .env.example .env
# Add your server-side GEMINI_API_KEY to .env (never commit .env)
npm run dev
```

To run live Gemini evaluations (requires `GEMINI_API_KEY` in `.env` or environment):
```bash
npm run evals:live
npm run evals:live:targeted
```

---

## Security & Engineering Evidence References

- [EMOS V2 Product Contract](./EMOS_V2_PRODUCT_CONTRACT.md) — Canonical V2 scope and scope-control rule.
- [AI Studio Security Constitution](./docs/AI_STUDIO_SECURITY_CONSTITUTION.md) — Trust boundaries, Firebase Auth, Secret Manager, and untrusted-model-output guardrails.
- [Evidence Index](./docs/EVIDENCE_INDEX.md) — Dated verification and security audit log.
- [Canonical Messaging Source](./claude/messaging-source.md) — Capability-honest product messaging reference.
