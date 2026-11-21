export const LEARNING_CATEGORIES = [
  "Start Here",
  "Assess and Decide",
  "Trust and Governance",
  "Portfolio and Enterprise DNA",
  "Product Experience and Security",
  "Plan and Mobilize"
] as const;
export type LearningCategory = (typeof LEARNING_CATEGORIES)[number];
export interface LearningVideo {
  sequence: string;
  masterId: string;
  title: string;
  description: string;
  category: LearningCategory;
  tags: string[];
  fileName: string;
  mediaUrl?: string;
  thumbnailUrl: string;
  transcriptUrl?: string;
  duration: string;
  durationSeconds: number;
  version: 'V2';
  burnedInCaptions: boolean;
}
export const LEARNING_MASTERS: Record<string, LearningVideo> = {
  "orientation": {
    "sequence": "V2-01",
    "masterId": "orientation",
    "title": "What is EMOS V2?",
    "description": "Follow evidence through decisions, human approval, governed execution, Measure and Learn.",
    "category": "Start Here",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-orientation.mp4",
    "mediaUrl": "/media/learning/emos-v2-orientation.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-orientation.jpg",
    "transcriptUrl": "/media/learning/emos-v2-orientation.txt",
    "duration": "0:56",
    "durationSeconds": 56.416667,
    "version": "V2",
    "burnedInCaptions": true
  },
  "workspace": {
    "sequence": "V2-02",
    "masterId": "workspace",
    "title": "Navigate EMOS and your workspace",
    "description": "Find the Command Center, choose an estate and workload, and navigate your workspace.",
    "category": "Start Here",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-workspace.mp4",
    "mediaUrl": "/media/learning/emos-v2-workspace.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-workspace.jpg",
    "transcriptUrl": "/media/learning/emos-v2-workspace.txt",
    "duration": "0:45",
    "durationSeconds": 45.348458,
    "version": "V2",
    "burnedInCaptions": true
  },
  "discovery": {
    "sequence": "V2-03",
    "masterId": "discovery",
    "title": "Portfolio Discovery and its specialist",
    "description": "Inspect portfolio evidence and use the Portfolio Discovery specialist to identify the next investigation.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-discovery.mp4",
    "mediaUrl": "/media/learning/emos-v2-discovery.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-discovery.jpg",
    "transcriptUrl": "/media/learning/emos-v2-discovery.txt",
    "duration": "0:40",
    "durationSeconds": 40.031271,
    "version": "V2",
    "burnedInCaptions": true
  },
  "dna": {
    "sequence": "V2-04",
    "masterId": "dna",
    "title": "Enterprise DNA and evidence readiness",
    "description": "Open workload DNA, inspect 18 attributes, ask about missing evidence and prepare for assessment.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-dna.mp4",
    "mediaUrl": "/media/learning/emos-v2-dna.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-dna.jpg",
    "transcriptUrl": "/media/learning/emos-v2-dna.txt",
    "duration": "1:00",
    "durationSeconds": 60.362938,
    "version": "V2",
    "burnedInCaptions": true
  },
  "decision": {
    "sequence": "V2-05",
    "masterId": "decision",
    "title": "6R decisions and the Enterprise Architect",
    "description": "Review a recommendation, compare all six paths and examine the evidence behind the decision.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-decision.mp4",
    "mediaUrl": "/media/learning/emos-v2-decision.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-decision.jpg",
    "transcriptUrl": "/media/learning/emos-v2-decision.txt",
    "duration": "1:07",
    "durationSeconds": 66.833333,
    "version": "V2",
    "burnedInCaptions": true
  },
  "ask": {
    "sequence": "V2-06",
    "masterId": "ask",
    "title": "Ask EMOS and governed AI",
    "description": "Ask the two specialists about missing evidence, modernization choices and the next governed step.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-ask.mp4",
    "mediaUrl": "/media/learning/emos-v2-ask.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-ask.jpg",
    "transcriptUrl": "/media/learning/emos-v2-ask.txt",
    "duration": "1:04",
    "durationSeconds": 63.75,
    "version": "V2",
    "burnedInCaptions": true
  },
  "governance": {
    "sequence": "V2-07",
    "masterId": "governance",
    "title": "Evidence gates and human approval",
    "description": "Distinguish readiness from approval and follow the explicit human decision into governed execution.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-governance.mp4",
    "mediaUrl": "/media/learning/emos-v2-governance.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-governance.jpg",
    "transcriptUrl": "/media/learning/emos-v2-governance.txt",
    "duration": "0:51",
    "durationSeconds": 51.015604,
    "version": "V2",
    "burnedInCaptions": true
  },
  "privacy-history": {
    "sequence": "V2-08",
    "masterId": "privacy-history",
    "title": "Private workspace and assessment history",
    "description": "Find a previous assessment and recheck its evidence before making a new decision.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-privacy-history.mp4",
    "mediaUrl": "/media/learning/emos-v2-privacy-history.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-privacy-history.jpg",
    "transcriptUrl": "/media/learning/emos-v2-privacy-history.txt",
    "duration": "0:42",
    "durationSeconds": 41.583333,
    "version": "V2",
    "burnedInCaptions": true
  },
  "import": {
    "sequence": "V2-09",
    "masterId": "import",
    "title": "Import and assess a portfolio",
    "description": "Use the template, validate a CSV or JSON portfolio and inspect the resulting workload evidence.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-import.mp4",
    "mediaUrl": "/media/learning/emos-v2-import.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-import.jpg",
    "transcriptUrl": "/media/learning/emos-v2-import.txt",
    "duration": "0:42",
    "durationSeconds": 42.083333,
    "version": "V2",
    "burnedInCaptions": true
  },
  "security": {
    "sequence": "V2-10",
    "masterId": "security",
    "title": "Trust and deterministic guardrails",
    "description": "See how deterministic controls block governance bypasses and preserve human authority.",
    "category": "Product Experience and Security",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-security.mp4",
    "mediaUrl": "/media/learning/emos-v2-security.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-security.jpg",
    "transcriptUrl": "/media/learning/emos-v2-security.txt",
    "duration": "0:35",
    "durationSeconds": 34.583333,
    "version": "V2",
    "burnedInCaptions": true
  },
  "execution": {
    "sequence": "V2-11",
    "masterId": "execution",
    "title": "Wave planning and governed execution",
    "description": "Review a wave plan, follow the selected 6R workflow and identify the next accountable action.",
    "category": "Plan and Mobilize",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-execution.mp4",
    "mediaUrl": "/media/learning/emos-v2-execution.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-execution.jpg",
    "transcriptUrl": "/media/learning/emos-v2-execution.txt",
    "duration": "0:48",
    "durationSeconds": 48.0,
    "version": "V2",
    "burnedInCaptions": true
  },
  "outcomes": {
    "sequence": "V2-12",
    "masterId": "outcomes",
    "title": "Measure and Learn",
    "description": "Compare reference outcomes and record a session note to inform the next review.",
    "category": "Plan and Mobilize",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-outcomes.mp4",
    "mediaUrl": "/media/learning/emos-v2-outcomes.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-outcomes.jpg",
    "transcriptUrl": "/media/learning/emos-v2-outcomes.txt",
    "duration": "0:48",
    "durationSeconds": 48.25,
    "version": "V2",
    "burnedInCaptions": true
  },
  "retain": {
    "sequence": "V2-13",
    "masterId": "retain",
    "title": "Retain — Govern & Monitor",
    "description": "Govern & Monitor: retain the workload with accountable oversight and evidence-based reassessment.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-retain.mp4",
    "mediaUrl": "/media/learning/emos-v2-retain.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-retain.jpg",
    "transcriptUrl": "/media/learning/emos-v2-retain.txt",
    "duration": "0:31",
    "durationSeconds": 30.916667,
    "version": "V2",
    "burnedInCaptions": true
  },
  "retire": {
    "sequence": "V2-14",
    "masterId": "retire",
    "title": "Retire — Safely Decommission",
    "description": "Safely Decommission: verify consumers, archive requirements, human approval, and closure checkpoints.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-retire.mp4",
    "mediaUrl": "/media/learning/emos-v2-retire.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-retire.jpg",
    "transcriptUrl": "/media/learning/emos-v2-retire.txt",
    "duration": "0:32",
    "durationSeconds": 32.083333,
    "version": "V2",
    "burnedInCaptions": true
  },
  "rehost": {
    "sequence": "V2-15",
    "masterId": "rehost",
    "title": "Rehost — Migrate Infrastructure",
    "description": "Migrate Infrastructure: plan destination, validation, rollback, cutover, and stabilization with human authority.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-rehost.mp4",
    "mediaUrl": "/media/learning/emos-v2-rehost.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-rehost.jpg",
    "transcriptUrl": "/media/learning/emos-v2-rehost.txt",
    "duration": "0:33",
    "durationSeconds": 33.010208,
    "version": "V2",
    "burnedInCaptions": true
  },
  "replatform": {
    "sequence": "V2-16",
    "masterId": "replatform",
    "title": "Replatform — Transition Platform",
    "description": "Transition Platform: review compatibility and target constraints before governed platform delivery.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-replatform.mp4",
    "mediaUrl": "/media/learning/emos-v2-replatform.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-replatform.jpg",
    "transcriptUrl": "/media/learning/emos-v2-replatform.txt",
    "duration": "0:29",
    "durationSeconds": 28.516625,
    "version": "V2",
    "burnedInCaptions": true
  },
  "refactor": {
    "sequence": "V2-17",
    "masterId": "refactor",
    "title": "Refactor — Transform Architecture",
    "description": "Transform Architecture: organize decomposition, implementation, testing, and incremental transition.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-refactor.mp4",
    "mediaUrl": "/media/learning/emos-v2-refactor.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-refactor.jpg",
    "transcriptUrl": "/media/learning/emos-v2-refactor.txt",
    "duration": "0:37",
    "durationSeconds": 37.255917,
    "version": "V2",
    "burnedInCaptions": true
  },
  "repurchase": {
    "sequence": "V2-18",
    "masterId": "repurchase",
    "title": "Repurchase — Replace & Adopt",
    "description": "Replace & Adopt: review fit, compliance, data portability, user transition, and retirement of the previous system.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-repurchase.mp4",
    "mediaUrl": "/media/learning/emos-v2-repurchase.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-repurchase.jpg",
    "transcriptUrl": "/media/learning/emos-v2-repurchase.txt",
    "duration": "0:32",
    "durationSeconds": 31.692104,
    "version": "V2",
    "burnedInCaptions": true
  }
};
export const LEARNING_VIDEOS: LearningVideo[] = [
  {
    "sequence": "00",
    "masterId": "orientation",
    "title": "What is EMOS V2?",
    "description": "Follow evidence through decisions, human approval, governed execution, Measure and Learn.",
    "category": "Start Here",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-orientation.mp4",
    "mediaUrl": "/media/learning/emos-v2-orientation.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-orientation.jpg",
    "transcriptUrl": "/media/learning/emos-v2-orientation.txt",
    "duration": "0:56",
    "durationSeconds": 56.416667,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F01",
    "masterId": "workspace",
    "title": "Sign in and enter the private workspace",
    "description": "Find the Command Center, choose an estate and workload, and navigate your workspace.",
    "category": "Start Here",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-workspace.mp4",
    "mediaUrl": "/media/learning/emos-v2-workspace.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-workspace.jpg",
    "transcriptUrl": "/media/learning/emos-v2-workspace.txt",
    "duration": "0:45",
    "durationSeconds": 45.348458,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F02",
    "masterId": "workspace",
    "title": "Take the guided product tour",
    "description": "Find the Command Center, choose an estate and workload, and navigate your workspace.",
    "category": "Start Here",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-workspace.mp4",
    "mediaUrl": "/media/learning/emos-v2-workspace.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-workspace.jpg",
    "transcriptUrl": "/media/learning/emos-v2-workspace.txt",
    "duration": "0:45",
    "durationSeconds": 45.348458,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F03",
    "masterId": "decision",
    "title": "Submit a workload for a 6R assessment",
    "description": "Review a recommendation, compare all six paths and examine the evidence behind the decision.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-decision.mp4",
    "mediaUrl": "/media/learning/emos-v2-decision.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-decision.jpg",
    "transcriptUrl": "/media/learning/emos-v2-decision.txt",
    "duration": "1:07",
    "durationSeconds": 66.833333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F04",
    "masterId": "decision",
    "title": "Explore options and generate an executive decision",
    "description": "Review a recommendation, compare all six paths and examine the evidence behind the decision.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-decision.mp4",
    "mediaUrl": "/media/learning/emos-v2-decision.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-decision.jpg",
    "transcriptUrl": "/media/learning/emos-v2-decision.txt",
    "duration": "1:07",
    "durationSeconds": 66.833333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F05",
    "masterId": "ask",
    "title": "Refine an assessment with new evidence",
    "description": "Ask the two specialists about missing evidence, modernization choices and the next governed step.",
    "category": "Assess and Decide",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-ask.mp4",
    "mediaUrl": "/media/learning/emos-v2-ask.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-ask.jpg",
    "transcriptUrl": "/media/learning/emos-v2-ask.txt",
    "duration": "1:04",
    "durationSeconds": 63.75,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F06",
    "masterId": "privacy-history",
    "title": "Verify owner-bound persistence and privacy",
    "description": "Find a previous assessment and recheck its evidence before making a new decision.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-privacy-history.mp4",
    "mediaUrl": "/media/learning/emos-v2-privacy-history.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-privacy-history.jpg",
    "transcriptUrl": "/media/learning/emos-v2-privacy-history.txt",
    "duration": "0:42",
    "durationSeconds": 41.583333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F07",
    "masterId": "privacy-history",
    "title": "Search, filter, and manage assessment history",
    "description": "Find a previous assessment and recheck its evidence before making a new decision.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-privacy-history.mp4",
    "mediaUrl": "/media/learning/emos-v2-privacy-history.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-privacy-history.jpg",
    "transcriptUrl": "/media/learning/emos-v2-privacy-history.txt",
    "duration": "0:42",
    "durationSeconds": 41.583333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F08",
    "masterId": "decision",
    "title": "Preserve cloud-platform neutrality",
    "description": "Review a recommendation, compare all six paths and examine the evidence behind the decision.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-decision.mp4",
    "mediaUrl": "/media/learning/emos-v2-decision.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-decision.jpg",
    "transcriptUrl": "/media/learning/emos-v2-decision.txt",
    "duration": "1:07",
    "durationSeconds": 66.833333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F09",
    "masterId": "governance",
    "title": "Check evidence and decision consistency",
    "description": "Distinguish readiness from approval and follow the explicit human decision into governed execution.",
    "category": "Trust and Governance",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-governance.mp4",
    "mediaUrl": "/media/learning/emos-v2-governance.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-governance.jpg",
    "transcriptUrl": "/media/learning/emos-v2-governance.txt",
    "duration": "0:51",
    "durationSeconds": 51.015604,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F10",
    "masterId": "discovery",
    "title": "Explore the enterprise portfolio",
    "description": "Inspect portfolio evidence and use the Portfolio Discovery specialist to identify the next investigation.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-discovery.mp4",
    "mediaUrl": "/media/learning/emos-v2-discovery.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-discovery.jpg",
    "transcriptUrl": "/media/learning/emos-v2-discovery.txt",
    "duration": "0:40",
    "durationSeconds": 40.031271,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F11",
    "masterId": "dna",
    "title": "Inspect Enterprise DNA and evidence gaps",
    "description": "Open workload DNA, inspect 18 attributes, ask about missing evidence and prepare for assessment.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-dna.mp4",
    "mediaUrl": "/media/learning/emos-v2-dna.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-dna.jpg",
    "transcriptUrl": "/media/learning/emos-v2-dna.txt",
    "duration": "1:00",
    "durationSeconds": 60.362938,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F12",
    "masterId": "dna",
    "title": "From Enterprise DNA to assessment",
    "description": "Open workload DNA, inspect 18 attributes, ask about missing evidence and prepare for assessment.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-dna.mp4",
    "mediaUrl": "/media/learning/emos-v2-dna.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-dna.jpg",
    "transcriptUrl": "/media/learning/emos-v2-dna.txt",
    "duration": "1:00",
    "durationSeconds": 60.362938,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F13",
    "masterId": "import",
    "title": "Import a CSV or JSON portfolio",
    "description": "Use the template, validate a CSV or JSON portfolio and inspect the resulting workload evidence.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-import.mp4",
    "mediaUrl": "/media/learning/emos-v2-import.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-import.jpg",
    "transcriptUrl": "/media/learning/emos-v2-import.txt",
    "duration": "0:42",
    "durationSeconds": 42.083333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F14",
    "masterId": "import",
    "title": "Download a portfolio template and dataset",
    "description": "Use the template, validate a CSV or JSON portfolio and inspect the resulting workload evidence.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-import.mp4",
    "mediaUrl": "/media/learning/emos-v2-import.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-import.jpg",
    "transcriptUrl": "/media/learning/emos-v2-import.txt",
    "duration": "0:42",
    "durationSeconds": 42.083333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F15",
    "masterId": "import",
    "title": "Assess and manage imported workloads",
    "description": "Use the template, validate a CSV or JSON portfolio and inspect the resulting workload evidence.",
    "category": "Portfolio and Enterprise DNA",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-import.mp4",
    "mediaUrl": "/media/learning/emos-v2-import.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-import.jpg",
    "transcriptUrl": "/media/learning/emos-v2-import.txt",
    "duration": "0:42",
    "durationSeconds": 42.083333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F16",
    "masterId": "workspace",
    "title": "Switch appearance and use responsive layouts",
    "description": "Find the Command Center, choose an estate and workload, and navigate your workspace.",
    "category": "Product Experience and Security",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-workspace.mp4",
    "mediaUrl": "/media/learning/emos-v2-workspace.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-workspace.jpg",
    "transcriptUrl": "/media/learning/emos-v2-workspace.txt",
    "duration": "0:45",
    "durationSeconds": 45.348458,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F17",
    "masterId": "security",
    "title": "Fence adversarial prompts and redact secrets",
    "description": "See how deterministic controls block governance bypasses and preserve human authority.",
    "category": "Product Experience and Security",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-security.mp4",
    "mediaUrl": "/media/learning/emos-v2-security.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-security.jpg",
    "transcriptUrl": "/media/learning/emos-v2-security.txt",
    "duration": "0:35",
    "durationSeconds": 34.583333,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F18",
    "masterId": "governance",
    "title": "Enforce canonical 6R and evidence readiness",
    "description": "Distinguish readiness from approval and follow the explicit human decision into governed execution.",
    "category": "Product Experience and Security",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-governance.mp4",
    "mediaUrl": "/media/learning/emos-v2-governance.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-governance.jpg",
    "transcriptUrl": "/media/learning/emos-v2-governance.txt",
    "duration": "0:51",
    "durationSeconds": 51.015604,
    "version": "V2",
    "burnedInCaptions": true
  },
  {
    "sequence": "F19",
    "masterId": "execution",
    "title": "Plan and mobilize the modernization program",
    "description": "Review a wave plan, follow the selected 6R workflow and identify the next accountable action.",
    "category": "Plan and Mobilize",
    "tags": [
      "V2"
    ],
    "fileName": "emos-v2-execution.mp4",
    "mediaUrl": "/media/learning/emos-v2-execution.mp4",
    "thumbnailUrl": "/media/learning/emos-v2-execution.jpg",
    "transcriptUrl": "/media/learning/emos-v2-execution.txt",
    "duration": "0:48",
    "durationSeconds": 48.0,
    "version": "V2",
    "burnedInCaptions": true
  }
];
export const CURRENT_V2_CAPABILITIES = [
  "Portfolio Discovery and Enterprise Architect: two Gemini-backed reasoning specialists behind Ask EMOS",
  "Enterprise DNA: 18 attributes and deterministic evidence readiness",
  "Canonical 6R recommendations, alternatives, risks, and explainability",
  "Readiness requires ≥70% completeness and zero critical gaps; explicit human approval remains separate",
  "Deterministic wave planning and disposition-specific execution tracking",
  "Owner-bound persistence, history, and tested input/output controls",
  "Measure: reference values; Learn: contextual lessons and session-scoped notes"
] as const;
export const FUTURE_ROADMAP_CAPABILITIES = [
  "Live enterprise CMDB, telemetry, billing, and FinOps ingestion",
  "Production telemetry and persistent organizational learning",
  "Live cloud migration, infrastructure provisioning, and automated cutover",
  "Enterprise SSO/RBAC approval workflows with external change-management integration",
  "Deep dependency intelligence, Target Architecture generation, portfolio optimization and policy packs",
  "Vendor-neutral execution integrations, private/on-premises deployment and managed SaaS",
  "Deep dependency intelligence, Target Architecture generation, portfolio optimization and policy packs",
  "Vendor-neutral execution integrations, private/on-premises deployment and managed SaaS",
  "Deep dependency intelligence, Target Architecture generation, portfolio optimization and policy packs",
  "Vendor-neutral execution integrations, private/on-premises deployment and managed SaaS",
  "Deep dependency intelligence, Target Architecture generation, portfolio optimization and policy packs",
  "Vendor-neutral execution integrations, private/on-premises deployment and managed SaaS"
] as const;
