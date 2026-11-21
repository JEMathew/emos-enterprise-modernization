import React, { useCallback, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Library,
  Map,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  VideoOff,
} from 'lucide-react';
import { LearningVideoModal } from './LearningVideoModal';
import { ThemeSelector } from './ThemeSelector';
import {
  CURRENT_V2_CAPABILITIES,
  FUTURE_ROADMAP_CAPABILITIES,
  LEARNING_CATEGORIES,
  LEARNING_VIDEOS,
  LEARNING_MASTERS,
  type LearningCategory,
  type LearningVideo,
} from '../data/learningVideos';

import type { User } from 'firebase/auth';

interface LearningCenterPageProps {
  user?: User | null;
  onNavigate: (path: string) => void;
  videos?: readonly LearningVideo[];
}

const LIFECYCLE_TOPIC_GUIDES = [
  {
    "id": "what-is-emos",
    "title": "What is EMOS V2?",
    "summary": "Follow evidence through decisions, human approval, governed execution, Measure and Learn.",
    "masterId": "orientation",
    "transcript": "What should your enterprise modernize, and what evidence supports that choice?  EMOS is the Enterprise Modernization Operating System. Follow Understand, Decide, Govern, Transform, and Outcomes. Inspect Enterprise DNA, identify missing facts, and compare the recommendation with alternatives before making a decision. Ask EMOS is the conversational interface.  A deterministic orchestrator routes reasoning to two Gemini-backed specialists: Portfolio Discovery and Enterprise Architect.  Deterministic validation and governance enforce the rules.  The orchestrator is not a third agent. Evidence readiness never grants approval.  A human must explicitly approve governed progression.  Transform tracks disposition-specific workflows; it does not perform live cloud migrations. Next, choose an estate and inspect one workload."
  },
  {
    "id": "product-vision",
    "title": "End-to-end V2 journey",
    "summary": "Follow evidence through decisions, human approval, governed execution, Measure and Learn.",
    "masterId": "orientation",
    "transcript": "What should your enterprise modernize, and what evidence supports that choice?  EMOS is the Enterprise Modernization Operating System. Follow Understand, Decide, Govern, Transform, and Outcomes. Inspect Enterprise DNA, identify missing facts, and compare the recommendation with alternatives before making a decision. Ask EMOS is the conversational interface.  A deterministic orchestrator routes reasoning to two Gemini-backed specialists: Portfolio Discovery and Enterprise Architect.  Deterministic validation and governance enforce the rules.  The orchestrator is not a third agent. Evidence readiness never grants approval.  A human must explicitly approve governed progression.  Transform tracks disposition-specific workflows; it does not perform live cloud migrations. Next, choose an estate and inspect one workload."
  },
  {
    "id": "getting-started",
    "title": "Getting started with EMOS V2",
    "summary": "Find the Command Center, choose an estate and workload, and navigate your workspace.",
    "masterId": "workspace",
    "transcript": "Where should you begin?  Open EMOS and choose your workspace context.  The Command Center summarizes the selected estate so you can identify workloads and evidence that need attention. Use Understand to explore the portfolio and Enterprise DNA.  Decide brings assessment and recommendations into focus.  Governance remains a required checkpoint before approved transformation. Transform organizes the execution plan. Keep the same estate and workload context as you move between these areas. Sign in for the private, owner-bound workspace.  Use the appearance control for light, dark, or system themes, and adapt the layout to your screen.  Next, select one workload and inspect its evidence."
  },
  {
    "id": "portfolio-upload",
    "title": "Import and assess a portfolio",
    "summary": "Use the template, validate a CSV or JSON portfolio and inspect the resulting workload evidence.",
    "masterId": "import",
    "transcript": "How do you bring your own workload inventory into EMOS?  Start with the sample dataset to understand the structure, or choose a sanitized CSV or JSON portfolio. The import path checks the schema and applies input-safety controls.  Review the imported workload records and the evidence they contain before drawing conclusions. Importing a row does not verify every claim or make the workload ready.  Open Enterprise DNA to inspect known, incomplete, and missing evidence. Imported data is not live CMDB or telemetry discovery.  Next, select an imported workload, close its critical gaps."
  },
  {
    "id": "enterprise-dna",
    "title": "Enterprise DNA and evidence readiness",
    "summary": "Open workload DNA, inspect 18 attributes, ask about missing evidence and prepare for assessment.",
    "masterId": "dna",
    "transcript": "Open the portfolio to prioritize workloads. Is the workload evidence sufficient for a decision?  Enterprise DNA organizes eighteen attributes across six dimensions: business, technology, dependencies, economics, data and risk, and target state. Inspect the values and verification status.  Relationship views support context, while missing and incomplete fields show where further investigation is needed. The deterministic readiness gate requires at least seventy percent completeness and zero critical gaps.  Confidence, completeness, and readiness are different signals. Next, ask what evidence is missing. The Portfolio Discovery specialist uses Gemini to reason about heterogeneous evidence, relationships, ambiguity, and missing facts. Verify facts using appropriate evidence. Next, carry the workload context into assessment; readiness still requires separate human approval."
  },
  {
    "id": "modernization-agent",
    "title": "Ask EMOS and governed AI",
    "summary": "Ask the two specialists about missing evidence, modernization choices and the next governed step.",
    "masterId": "ask",
    "transcript": "How can you ask a useful question about the selected workload?  Open Ask EMOS and ask about evidence, dependencies, modernization options, or the next governed step. Ask EMOS is an interface, not a third specialist.  A deterministic orchestrator routes the request to Portfolio Discovery, Enterprise Architect, or both, using the current context. Portfolio Discovery investigates ambiguity and evidence gaps.  Enterprise Architect reasons across the six R choices.  Deterministic validation and governance check the response, and explicit human approval retains authority. If AI reasoning is unavailable, EMOS labels the deterministic status and evidence fallback.  It does not pretend that a model answered.  Agents for ambiguity.  Workflows for predictability.  Rules for governance.  Humans for authority.  Next, ask what evidence is missing."
  },
  {
    "id": "6r-overview",
    "title": "6R decisions and the Enterprise Architect",
    "summary": "Review a recommendation, compare all six paths and examine the evidence behind the decision.",
    "masterId": "decision",
    "transcript": "Which modernization path fits this workload?  The Enterprise Architect specialist compares the evidence across six canonical dispositions, through Ask EMOS and the governed assessment experience. Retain means Govern and Monitor.  Retire means Safely Decommission.  Rehost means Migrate Infrastructure.  Replatform means Transition Platform.  Refactor means Transform Architecture.  Repurchase means Replace and Adopt. Review the recommendation, rationale, alternatives, risks, constraints, and the evidence that could change the decision.  Target-platform claims must follow verified target-state evidence; EMOS should not invent a cloud choice. New evidence can inform a follow-up assessment.  Confidence does not equal readiness, and readiness does not equal approval.  Next, resolve critical gaps, examine rejected alternatives, and bring the decision to an accountable human."
  },
  {
    "id": "retain",
    "title": "Retain — Govern & Monitor",
    "summary": "Govern & Monitor: retain the workload with accountable oversight and evidence-based reassessment.",
    "masterId": "retain",
    "transcript": "When is staying in place a valid modernization choice?  Retain means Govern and Monitor when the evidence supports keeping the workload. The EMOS playbook structures keeping, optimizing, monitoring, outcome review, and learning. These are governed planning stages, not a live telemetry integration or automatic infrastructure changes. Next, verify the supporting evidence, retain human oversight, and identify the conditions that would justify reassessment."
  },
  {
    "id": "retire",
    "title": "Retire — Safely Decommission",
    "summary": "Safely Decommission: verify consumers, archive requirements, human approval, and closure checkpoints.",
    "masterId": "retire",
    "transcript": "When should a workload be removed?  Retire means Safely Decommission when verified evidence supports its removal. The playbook covers approval, consumer transition, archiving, decommissioning, closure validation, measurement, and learning. EMOS tracks these checkpoints; it does not shut down production systems for you. Next, verify dependencies and retention requirements, obtain human approval, and confirm accountable owners before decommissioning."
  },
  {
    "id": "rehost",
    "title": "Rehost — Migrate Infrastructure",
    "summary": "Migrate Infrastructure: plan destination, validation, rollback, cutover, and stabilization with human authority.",
    "masterId": "rehost",
    "transcript": "When does a workload need a change of infrastructure?  Rehost means Migrate Infrastructure while preserving much of the existing application. The playbook structures approval, destination preparation, movement, validation, cutover, stabilization, measurement, and learning. EMOS plans and tracks this work; it does not perform the migration or cutover. Next, verify the target environment, dependencies, rollback plan, and human approval before delivery teams proceed."
  },
  {
    "id": "replatform",
    "title": "Replatform — Transition Platform",
    "summary": "Transition Platform: review compatibility and target constraints before governed platform delivery.",
    "masterId": "replatform",
    "transcript": "When is a platform change appropriate?  Replatform means Transition Platform while keeping the decision grounded in workload and target-state evidence. The playbook covers approval, target preparation, migration or transformation, validation, cutover, optimization, measurement, and learning. EMOS does not provision a managed platform or execute a live migration. Next, verify compatibility, target constraints, and accountable human approval before following the plan."
  },
  {
    "id": "refactor",
    "title": "Refactor — Transform Architecture",
    "summary": "Transform Architecture: organize decomposition, implementation, testing, and incremental transition.",
    "masterId": "refactor",
    "transcript": "When does the architecture itself need to change?  Refactor means Transform Architecture when the evidence justifies redesign. The playbook covers approval, decomposition, implementation, testing, transition, stabilization, measurement, and learning. These stages organize governed delivery.  EMOS does not autonomously rewrite or deploy your production application. Next, verify architectural drivers, dependencies, risks, and human approval, then plan an incremental transition."
  },
  {
    "id": "repurchase",
    "title": "Repurchase — Replace & Adopt",
    "summary": "Replace & Adopt: review fit, compliance, data portability, user transition, and retirement of the previous system.",
    "masterId": "repurchase",
    "transcript": "When is buying a replacement the right path?  Repurchase means Replace and Adopt when evidence supports moving to a commercial product. The playbook structures approval, replacement selection, configuration, data and user migration, transition, retirement of the previous system, measurement, and learning. EMOS tracks the plan; it does not purchase software or migrate users automatically. Next, verify fit, compliance, data portability, and human approval before adoption."
  },
  {
    "id": "governance",
    "title": "Evidence gates and human approval",
    "summary": "Distinguish readiness from approval and follow the explicit human decision into governed execution.",
    "masterId": "governance",
    "transcript": "Can AI approve its own recommendation?  No.  EMOS separates reasoning, deterministic readiness, and human authority so that a confident answer cannot authorize execution. Readiness requires at least seventy percent evidence completeness and zero critical gaps.  Needs Evidence blocks approval and execution progression. The governed workflow requires explicit human sign-off.  An AI request to bypass approval cannot change these rules.  Even complete evidence does not remove the human decision. Inspect the evidence gaps, recommendation, alternatives, and risks before approval.  Next, obtain accountable human review, then follow the disposition-specific plan.  EMOS tracks governed work; it does not autonomously change production infrastructure."
  },
  {
    "id": "execution",
    "title": "Wave planning and governed execution",
    "summary": "Review a wave plan, follow the selected 6R workflow and identify the next accountable action.",
    "masterId": "execution",
    "transcript": "How does an approved decision become organized delivery work?  EMOS uses deterministic wave planning and disposition-specific workflows to structure the next steps. Review wave sequencing, readiness actions, stage owners, blockers, and checkpoint requirements.  The chosen six R disposition determines the downstream playbook. Needs Evidence and unapproved workloads cannot enter or advance governed execution.  Resolve evidence gaps and record explicit human approval before progressing through the workflow. These are planning and tracking controls.  EMOS does not run a real cloud migration, provision infrastructure, or perform a production cutover.  Next, review the current blocker and assign the required evidence or delivery action to its accountable owner."
  },
  {
    "id": "outcomes-learning",
    "title": "Measure and Learn: V2 boundaries",
    "summary": "Compare reference outcomes and record a session note to inform the next review.",
    "masterId": "outcomes",
    "transcript": "What can outcomes tell you about a modernization plan?  Measure presents Baseline, Target, and Observed values so you can discuss assumptions and differences in the chosen disposition's context. They are not readings from a live production telemetry, billing, or benefits-realization integration. Learn presents representative archetype lessons and lets you capture a session-only note.  Describe the assumption, observed difference, lesson, and possible relevance to future work. Session notes do not retrain the agents or automatically change recommendations.  Next, use these views to structure a review, then validate real outcomes in your approved systems.  Any future recommendation still requires current evidence and human authority."
  }
] as const;

type CategoryFilter = 'All Categories' | LearningCategory;

export const LearningCenterPage: React.FC<LearningCenterPageProps> = ({
  user = null,
  onNavigate,
  videos = LEARNING_VIDEOS,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All Categories');
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo | null>(null);
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null);
  const playbackTriggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return videos.filter((video) => {
      const matchesCategory = category === 'All Categories' || video.category === category;
      const searchableText = [
        video.sequence,
        video.title,
        video.description,
        video.category,
        video.fileName,
        ...video.tags,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query, videos]);

  const groupedVideos = LEARNING_CATEGORIES.map((group) => ({
    category: group,
    videos: filteredVideos.filter((video) => video.category === group),
  })).filter((group) => group.videos.length > 0);

  const navigate = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(path);
  };

  const openVideo = (video: LearningVideo, trigger: HTMLElement) => {
    playbackTriggerRef.current = trigger;
    setSelectedVideo(video);
  };

  const closeVideo = useCallback(() => setSelectedVideo(null), []);

  return (
    <div className="emos-landing min-h-screen bg-[var(--emos-bg)] text-[var(--emos-text-primary)] font-sans transition-colors">
      <header className="sticky top-0 z-30 border-b border-[var(--emos-border-subtle)] bg-[var(--emos-surface)]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <a
            href="/"
            onClick={navigate('/')}
            className="group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--emos-accent)]"
            aria-label="Return to EMOS home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4648D4] text-white shadow-xs transition-colors">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <span className="truncate font-display text-base font-bold tracking-tight">EMOS</span>
            <span className="hidden rounded-full border border-[var(--emos-accent-border)] bg-[var(--emos-accent-subtle)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--emos-accent-text)] sm:inline">
              Learning Center
            </span>
          </a>

          <div className="flex items-center gap-2">
            {user && (
              <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Signed in as {user.displayName || user.email}
              </span>
            )}
            <a
              href="/workspace"
              onClick={navigate('/workspace')}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#4648D4] hover:bg-[#3B3DC2] px-3.5 text-xs font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emos-accent)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Workspace</span>
            </a>
            <a
              href="/"
              onClick={navigate('/')}
              className="hidden min-h-9 items-center gap-1.5 rounded-lg border border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] px-3 text-xs font-semibold text-[var(--emos-text-secondary)] transition-colors hover:text-[var(--emos-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emos-accent)] sm:inline-flex"
            >
              EMOS Home
            </a>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <main>
        <section className="landing-scene landing-video relative overflow-hidden border-b border-[var(--emos-border-subtle)]">
          <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" aria-hidden="true" />
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-[88rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
          >
            <div className="max-w-4xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--emos-accent-border)] bg-[var(--emos-accent-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--emos-accent-text)]">
                <Library className="h-3.5 w-3.5" aria-hidden="true" />
                EMOS V2 Learning Library · No EMOS Sign-In Required
              </div>
              <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                See EMOS in Motion
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--emos-text-secondary)]">
                Follow the evidence-to-decision journey from portfolio discovery and Enterprise DNA through explainable 6R recommendations, governance, governed transformation, outcomes and learning.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    const introVideo = videos.find((v) => v.sequence === '00') || videos[0];
                    if (introVideo?.mediaUrl) {
                      openVideo(introVideo, e.currentTarget);
                    }
                  }}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4648D4] hover:bg-[#3B3DC2] px-5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emos-accent)] cursor-pointer"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  <span>Start Guided Journey</span>
                </button>
                <a
                  href="#catalogue"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] hover:bg-[var(--emos-surface-hover)] px-4 text-sm font-semibold text-[var(--emos-text-secondary)] hover:text-[var(--emos-text-primary)] transition-colors"
                >
                  Browse All 20 Lessons
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Task / Role-Based Learning Paths aligned to Canonical 4-Stage EMOS Model */}
        <section aria-label="Task and role-based learning paths" className="mx-auto max-w-[88rem] px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mb-4">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[var(--emos-accent-text)]">
              Task &amp; Role-Based Learning
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-[var(--emos-text-primary)]">
              Learn by Modernization Stage
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                stage: '01 · Understand',
                role: 'Leaders & Architects',
                desc: 'Explore portfolios, upload CSV/JSON inventories, and inspect Enterprise DNA.',
                seq: 'F10',
              },
              {
                stage: '02 · Decide',
                role: 'Solution Architects',
                desc: 'Verify evidence gates, compare all 6Rs, and govern human approval.',
                seq: 'F03',
              },
              {
                stage: '03 · Transform',
                role: 'Program & Platform Teams',
                desc: 'Sequence waves, clear mobilization gates, and track execution stages.',
                seq: 'F19',
              },
              {
                stage: '04 · Outcomes',
                role: 'Executives & Delivery Leads',
                desc: 'Measure Baseline vs. Target vs. Observed impact and capture wave lessons.',
                seq: 'outcomes',
              },
            ].map((path) => {
              const targetVideo = path.seq === 'outcomes' ? LEARNING_MASTERS.outcomes : videos.find((v) => v.sequence === path.seq);
              return (
                <div
                  key={path.stage}
                  className="stitch-card p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--emos-text-muted)]">
                      <span className="font-bold text-[var(--emos-accent-text)] uppercase">{path.stage}</span>
                      <span>{path.role}</span>
                    </div>
                    <p className="text-xs text-[var(--emos-text-secondary)] leading-relaxed">{path.desc}</p>
                  </div>
                  {targetVideo?.mediaUrl && (
                    <button
                      type="button"
                      onClick={(e) => openVideo(targetVideo, e.currentTarget)}
                      className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#4648D4] dark:text-[#818CF8] hover:underline cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Watch lesson</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="catalogue" className="mx-auto max-w-[88rem] scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--emos-accent-text)]">
                V2 Walkthrough Catalogue
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">Choose a Learning Path</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--emos-text-secondary)]">
                For a concise end-to-end journey, watch 00 and then F10 → F11 → F12 → F03 → F04 → F19.
              </p>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search learning videos</span>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--emos-text-muted)]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search lessons, topics, or filenames"
                aria-label="Search learning videos"
                className="min-h-11 w-full rounded-xl border border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--emos-text-primary)] outline-none placeholder:text-[var(--emos-text-muted)] focus:border-[var(--emos-accent)] focus:ring-2 focus:ring-[var(--emos-accent-subtle)]"
              />
            </label>
          </div>

          <div
            role="tablist"
            aria-label="Filter videos by category"
            className="mb-9 flex snap-x gap-2 overflow-x-auto pb-2"
          >
            {(['All Categories', ...LEARNING_CATEGORIES] as CategoryFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={category === filter}
                aria-controls="learning-video-results"
                onClick={() => setCategory(filter)}
                className={`min-h-10 shrink-0 snap-start rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emos-accent)] ${
                  category === filter
                    ? 'border-[var(--emos-accent-border)] bg-[var(--emos-accent-subtle)] text-[var(--emos-accent-text)]'
                    : 'border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] text-[var(--emos-text-secondary)] hover:text-[var(--emos-text-primary)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div id="learning-video-results" aria-live="polite">
            <p className="sr-only">{filteredVideos.length} learning videos shown</p>
            {groupedVideos.length > 0 ? (
              <div className="space-y-12">
                {groupedVideos.map((group) => (
                  <section key={group.category} aria-labelledby={`category-${group.category.replaceAll(' ', '-').toLowerCase()}`}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3
                        id={`category-${group.category.replaceAll(' ', '-').toLowerCase()}`}
                        className="font-serif text-xl font-bold sm:text-2xl"
                      >
                        {group.category}
                      </h3>
                      <span className="shrink-0 text-xs text-[var(--emos-text-muted)]">
                        {group.videos.length} {group.videos.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {group.videos.map((video) => (
                        <motion.article
                          key={video.sequence}
                          data-testid={`video-${video.sequence.toLowerCase()}`}
                          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.12 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={reduceMotion ? undefined : { y: -5 }}
                          className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] shadow-sm hover:shadow-xl"
                        >
                          <img
                            src={video.thumbnailUrl}
                            alt={`${video.sequence}: ${video.title}`}
                            loading="lazy"
                            className="aspect-video w-full bg-[#08152a] object-cover"
                          />
                          <div className="flex flex-1 flex-col gap-3 p-5">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                              <span className="rounded-full border border-[var(--emos-accent-border)] bg-[var(--emos-accent-subtle)] px-2 py-1 text-[var(--emos-accent-text)]">
                                {video.sequence}
                              </span>
                              <span className="rounded-full border border-[var(--emos-border-subtle)] bg-[var(--emos-bg-tertiary)] px-2 py-1 text-[var(--emos-text-secondary)]">
                                EMOS V2
                              </span>
                              {video.duration && (
                                <span className="inline-flex items-center gap-1 text-[var(--emos-text-muted)]">
                                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                                  {video.duration}
                                </span>
                              )}
                            </div>
                            <h4 id={`video-title-${video.sequence}`} className="font-serif text-lg font-bold leading-snug">
                              {video.title}
                            </h4>
                            <p className="text-xs font-semibold text-[var(--emos-accent-text)]">{video.category}</p>
                            <p className="text-sm leading-relaxed text-[var(--emos-text-secondary)]">
                              {video.description}
                            </p>
                            {video.mediaUrl ? (
                              <button
                                type="button"
                                onClick={(event) => openVideo(video, event.currentTarget)}
                                aria-label={`Play ${video.sequence}: ${video.title} in EMOS`}
                                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-[#4648D4] hover:bg-[#3B3DC2] px-4 text-xs font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emos-accent)] cursor-pointer"
                              >
                                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                                Play in EMOS
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                aria-label={`Video temporarily unavailable for ${video.sequence}: ${video.title}`}
                                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[var(--emos-border-subtle)] bg-[var(--emos-bg-tertiary)] px-4 text-xs font-bold text-[var(--emos-text-muted)] opacity-75"
                              >
                                <VideoOff className="h-3.5 w-3.5" aria-hidden="true" />
                                Temporarily unavailable
                              </button>
                            )}
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div role="status" className="rounded-2xl border border-dashed border-[var(--emos-border-strong)] p-10 text-center">
                <Search className="mx-auto h-7 w-7 text-[var(--emos-text-muted)]" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-lg font-bold">No matching lessons</h3>
                <p className="mt-1 text-sm text-[var(--emos-text-secondary)]">
                  Clear the search or choose another learning category.
                </p>
              </div>
            )}
          </div>
        </section>

        <section aria-label="V2 Capability and 6R Topic Guides" className="mx-auto max-w-[88rem] px-4 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[var(--emos-border-strong)] bg-[var(--emos-surface)] p-6 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--emos-accent-text)]">
                V2 Capability &amp; 6R Topic Guides
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold">
                Full Lifecycle &amp; 6R Reference
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {LIFECYCLE_TOPIC_GUIDES.map((guide) => {
                const matchedVideo = LEARNING_MASTERS[guide.masterId];
                const isTranscriptOpen = activeTranscriptId === guide.id;
                return (
                  <div
                    key={guide.id}
                    className="rounded-2xl border border-[var(--emos-border-subtle)] bg-[var(--emos-bg-secondary)] p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--emos-text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-[var(--emos-accent-subtle)] text-[var(--emos-accent-text)] font-bold">
                          Captions in video
                        </span>
                        <span>{matchedVideo.duration}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--emos-text-primary)]">{guide.title}</h3>
                      <p className="text-xs text-[var(--emos-text-secondary)] leading-relaxed">{guide.summary}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[var(--emos-border-subtle)]">
                      <div className="flex items-center justify-between gap-2">
                        {matchedVideo?.mediaUrl && (
                          <button
                            type="button"
                            onClick={(e) => openVideo(matchedVideo, e.currentTarget)}
                            className="px-2.5 py-1 rounded-lg bg-[#4648D4] hover:bg-[#3B3DC2] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            <span>Watch</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveTranscriptId(isTranscriptOpen ? null : guide.id)}
                          aria-expanded={isTranscriptOpen}
                          className="px-2.5 py-1 rounded-lg border border-[var(--emos-border-subtle)] bg-[var(--emos-surface)] text-[11px] font-semibold text-[var(--emos-text-secondary)] hover:text-[var(--emos-text-primary)] cursor-pointer"
                        >
                          {isTranscriptOpen ? 'Hide Transcript' : 'Transcript'}
                        </button>
                      </div>

                      {isTranscriptOpen && (
                        <p className="p-2.5 rounded-xl bg-[var(--emos-surface)] border border-[var(--emos-border-subtle)] text-[11px] text-[var(--emos-text-secondary)] leading-relaxed">
                          {guide.transcript}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--emos-border-subtle)] bg-[var(--emos-bg-secondary)]">
          <div className="mx-auto grid max-w-[88rem] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
            <motion.article initial={reduceMotion ? false : { opacity: 0, x: -16 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                <h2 className="font-serif text-xl font-bold">V2.0 Scope</h2>
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--emos-text-secondary)]">
                {CURRENT_V2_CAPABILITIES.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            <motion.article initial={reduceMotion ? false : { opacity: 0, x: 16 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-6">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                <Map className="h-5 w-5" aria-hidden="true" />
                <h2 className="font-serif text-xl font-bold">Future / Full Vision</h2>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--emos-text-muted)]">
                These capabilities describe the broader product direction and are not claimed as implemented in V2.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--emos-text-secondary)]">
                {FUTURE_ROADMAP_CAPABILITIES.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Map className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--emos-border-subtle)] bg-[var(--emos-bg-secondary)] px-4 py-8 text-xs text-[var(--emos-text-muted)] sm:px-6">
        <div className="mx-auto flex max-w-[88rem] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center sm:text-left">
            <span className="font-serif font-bold text-[var(--emos-text-primary)]">EMOS</span> — Enterprise Modernization Operating System · EMOS V2
          </p>
          <nav aria-label="Learning Center footer" className="flex flex-wrap justify-center gap-5">
            <a href="/" onClick={navigate('/')} className="font-medium hover:text-[var(--emos-text-primary)] hover:underline">Home</a>
            <a href="/sandbox" onClick={navigate('/sandbox')} className="font-medium hover:text-[var(--emos-text-primary)] hover:underline">Public Sandbox</a>
            <a href="/trust" onClick={navigate('/trust')} className="font-medium hover:text-[var(--emos-text-primary)] hover:underline">Trust &amp; Evaluation</a>
            <a href="/privacy" onClick={navigate('/privacy')} className="font-medium hover:text-[var(--emos-text-primary)] hover:underline">Privacy Policy</a>
            <a href="/terms" onClick={navigate('/terms')} className="font-medium hover:text-[var(--emos-text-primary)] hover:underline">Terms of Service</a>
          </nav>
        </div>
      </footer>

      {selectedVideo && (
        <LearningVideoModal
          video={selectedVideo}
          onClose={closeVideo}
          returnFocusTo={playbackTriggerRef.current}
        />
      )}
    </div>
  );
};
