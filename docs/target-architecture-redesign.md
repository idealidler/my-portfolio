# AkshayGPT Production-Grade Target Architecture

**Design date:** 2026-05-31  
**Scope:** Target-state redesign for the portfolio-grounded chat assistant and recruiter job-fit analyzer.  
**Current-state baseline:** [`docs/architecture-review.md`](./architecture-review.md)  
**Design objective:** maximize factual correctness, groundedness, retrieval quality, reliability, maintainability, and operational visibility. Token savings are secondary.

## Executive Decision

The right target is **not** an autonomous multi-agent system. It is a small number of explicit, typed, observable AI pipelines with deterministic decision logic and narrow LLM responsibilities.

The current repository already has the correct instinct in its recruiter path:

```text
LLM extraction
  -> deterministic evidence retrieval
  -> deterministic requirement mapping
  -> deterministic scoring and verdict
  -> LLM explanation
  -> validation
```

That pattern should become the architectural standard for the entire product.

The upgraded system should use:

- one application-facing AI orchestrator with separate chat and recruiter pipelines;
- typed request and response contracts;
- deterministic retrieval and evidence selection before generation;
- structured claims with source IDs;
- claim-level grounding enforcement;
- explicit abstention when evidence is weak;
- distributed rate limits and bounded caches;
- end-to-end traces and eval gates;
- a durable but privacy-aware conversation store only when persistence is genuinely needed;
- hybrid retrieval only after the corpus expands or lexical retrieval fails measured recall targets.

The upgraded system should **not** use:

- open-ended agents;
- recursive planning loops;
- agent-to-agent handoffs;
- autonomous web browsing;
- a graph database;
- a vector database for the current 49 evidence-unit corpus;
- a workflow engine for ordinary synchronous chat;
- long-term user profiling by default.

## Design Principles

1. **Evidence before prose.** Retrieve and validate evidence before asking a model to explain it.
2. **Deterministic decisions stay deterministic.** Scores, verdicts, access checks, cache policies, citation rules, and retention rules belong in code.
3. **Generated claims are typed data.** Important claims must carry evidence IDs and pass support checks before display.
4. **Abstention is a successful outcome.** The assistant should say that the portfolio does not contain enough evidence rather than produce plausible filler.
5. **Small corpus, small machinery.** Improve retrieval quality first. Add infrastructure when measured need appears.
6. **Every change is eval-gated.** Prompt, model, retrieval, scoring, and corpus versions must be independently observable and regression-tested.
7. **Privacy is designed into storage.** Do not persist raw conversations or pasted job descriptions unless a product requirement justifies retention.

## Priority Taxonomy

| Class | Meaning |
| --- | --- |
| **MUST HAVE** | Required before treating the system as a reliable public production feature |
| **SHOULD HAVE** | Required for enterprise-grade accuracy, operability, and maintainability |
| **NICE TO HAVE** | Valuable after measured traffic, corpus growth, or product demand justifies it |
| **OVERENGINEERING** | Adds cost or failure modes without solving a current or foreseeable measured problem |

## 1. Target Architecture

### 1.1 Target Component Model

```text
                                +--------------------------+
                                | Browser                  |
                                | - chat UI                |
                                | - recruiter-fit UI       |
                                | - feedback controls      |
                                +------------+-------------+
                                             |
                                             | HTTPS
                                             v
                                +--------------------------+
                                | Edge Protection Layer    |
                                | - WAF / bot protection   |
                                | - IP and session limits  |
                                | - body size limits       |
                                +------------+-------------+
                                             |
                                             v
                     +-----------------------+-----------------------+
                     | Next.js API Boundary                          |
                     | - runtime schemas                             |
                     | - request IDs                                 |
                     | - auth / anonymous session                    |
                     | - redaction policy                            |
                     +-----------+----------------------+------------+
                                 |                      |
                                 v                      v
                  +--------------------------+   +--------------------------+
                  | Chat Pipeline            |   | Recruiter-Fit Pipeline   |
                  | - query rewrite          |   | - JD normalization       |
                  | - retrieve evidence      |   | - per-requirement search |
                  | - answer plan            |   | - deterministic score    |
                  | - grounded generation    |   | - grounded narrative     |
                  | - claim verification     |   | - claim verification     |
                  +------------+-------------+   +------------+-------------+
                               |                              |
                               +--------------+---------------+
                                              |
                                              v
                                +--------------------------+
                                | AI Orchestration Layer   |
                                | - OpenAI Responses API   |
                                | - structured outputs     |
                                | - model routing          |
                                | - retries / timeouts     |
                                | - prompt versions        |
                                +------------+-------------+
                                             |
                         +-------------------+-------------------+
                         |                                       |
                         v                                       v
             +--------------------------+            +--------------------------+
             | Knowledge Service        |            | Reliability Services     |
             | - canonical evidence     |            | - Redis-compatible cache |
             | - BM25 retrieval         |            | - distributed limiter    |
             | - metadata filters       |            | - in-flight dedupe       |
             | - optional embeddings    |            | - circuit state          |
             | - corpus version         |            +--------------------------+
             +------------+-------------+
                          |
                          v
             +--------------------------+
             | Durable Data Store       |
             | - evidence metadata      |
             | - prompt/model versions  |
             | - eval fixtures          |
             | - feedback               |
             | - privacy-safe traces    |
             | - optional conversations |
             +--------------------------+

 Every request emits privacy-safe telemetry:

 +-------------------------------------------------------------------+
 | OpenTelemetry-style traces + logs + metrics                        |
 | request -> rate limit -> cache -> retrieval -> model -> validator  |
 +-------------------------------------------------------------------+
```

### 1.2 Frontend Architecture

#### MUST HAVE

Keep the two existing user surfaces, but replace ad hoc transport handling with typed client services:

```text
components/chat/
  akshay-gpt-shell.tsx
  job-fit-analyzer.tsx

lib/client/
  chat-client.ts
  job-fit-client.ts
  ndjson-stream-reader.ts
```

`chat-client.ts` should:

- send a typed `ChatRequest`;
- attach an anonymous session ID and request ID;
- parse `application/x-ndjson` or SSE with a retained partial-line buffer;
- surface typed events such as `message.delta`, `citation`, `usage`, `error`, and `done`;
- abort the upstream request when the user cancels or navigates away;
- expose retry only for safe pre-stream failures.

The stream parser must fix the current chunk-boundary defect in `components/chat/akshay-gpt-shell.tsx:125-153`.

The frontend should render citations as source chips tied to portfolio sections or evidence units. Markdown rendering should remain constrained:

- raw HTML disabled;
- explicit protocol allowlist: `https:`, `mailto:`, and same-origin relative links only;
- `target="_blank"` with `rel="noopener noreferrer"`;
- no model-generated scripts, styles, or arbitrary embeds.

#### SHOULD HAVE

Add:

- thumbs-up/down feedback per answer;
- optional free-text correction;
- “show sources” disclosure;
- clear degraded-mode label;
- explicit “portfolio data does not contain this detail” UX;
- cancel-generation control;
- client-side request timing capture.

#### NICE TO HAVE

- retry failed answers with a new request ID;
- copy answer with citations;
- display source confidence for advanced recruiter users.

### 1.3 Backend Architecture

Move route-handler business logic into typed services. Route files should validate, authorize, call one pipeline, and serialize output.

```text
app/api/chat/route.ts
app/api/job-fit/route.ts
app/api/feedback/route.ts

lib/server/
  config/
    env.ts
    ai-config.ts
    limits.ts
  contracts/
    chat.ts
    job-fit.ts
    feedback.ts
  ai/
    openai-client.ts
    model-router.ts
    prompt-registry.ts
    retry-policy.ts
  retrieval/
    corpus.ts
    bm25-index.ts
    hybrid-retriever.ts
    reranker.ts
    confidence.ts
  grounding/
    claim-schema.ts
    claim-verifier.ts
    abstention.ts
    citations.ts
  pipelines/
    chat-pipeline.ts
    job-fit-pipeline.ts
  reliability/
    rate-limit.ts
    cache.ts
    request-dedupe.ts
    circuit-breaker.ts
  observability/
    tracing.ts
    metrics.ts
    logger.ts
```

Use a schema library such as `zod` for:

- environment validation;
- API request validation;
- API response validation;
- structured-output schemas;
- shared frontend/backend contracts.

The current manual validators in `app/api/job-fit/route.ts:453-660` should be replaced or generated from the same schemas used for OpenAI Structured Outputs.

### 1.4 AI Orchestration Layer

Implement one orchestration facade:

```ts
interface AiOrchestrator {
  rewriteChatQuery(input: RewriteInput): Promise<RewriteResult>;
  generateGroundedChatAnswer(input: GroundedChatInput): Promise<GroundedAnswer>;
  normalizeJobDescription(input: NormalizeJobInput): Promise<NormalizedJobBrief>;
  generateJobFitNarrative(input: JobFitNarrativeInput): Promise<JobFitNarrative>;
  verifyClaims(input: ClaimVerificationInput): Promise<ClaimVerificationResult>;
}
```

Responsibilities:

- choose the evaluated model snapshot per task;
- attach prompt version and model version;
- apply task-specific timeout and retry policy;
- use Structured Outputs for every machine-readable stage;
- log OpenAI `x-request-id`, application `X-Client-Request-Id`, latency, usage, and cached-token metrics;
- normalize refusals and upstream errors;
- return typed results only.

Do not place retrieval, scoring, or authorization inside the LLM layer.

### 1.5 Knowledge Architecture

The canonical evidence representation should replace parallel text builders:

```ts
type EvidenceUnit = {
  id: string;
  sourceType: "experience" | "project" | "profile" | "education" | "contact";
  sourceArea: string;
  title: string;
  claim: string;
  capabilities: string[];
  tools: string[];
  entities: string[];
  metrics: Array<{ value: string; unit?: string; context: string }>;
  dates?: { start?: string; end?: string };
  urls: string[];
  evidenceStrength: "verified" | "self_reported" | "supporting";
  visibility: "public";
  corpusVersion: string;
  contentHash: string;
};
```

`data/portfolio.ts` remains the curated source of truth now. A build-time indexing step should materialize:

- normalized evidence units;
- BM25 index;
- corpus manifest;
- content hashes;
- optional embeddings later.

### 1.6 Memory Architecture

Default chat should remain stateless at the server boundary until durable history is a product requirement.

Use:

- browser-held active messages for immediate UX;
- server-side short-term normalized turn window for generation;
- an optional anonymous session store with short TTL only if feedback linkage, follow-up retrieval, or abuse controls require it;
- no permanent user profile memory by default.

Detailed memory design appears in Section 5.

### 1.7 Grounding Architecture

Every material generated claim should follow this path:

```text
retrieve evidence
  -> build allowed evidence set
  -> generate typed claims with evidence IDs
  -> validate referenced IDs
  -> verify semantic support
  -> reject or rewrite unsupported claims
  -> attach citations
  -> render answer
```

Critical outputs such as recruiter score, verdict, strongest matches, and gaps should remain deterministic or template-backed whenever possible.

### 1.8 Observability Stack

At minimum:

- structured JSON logs;
- OpenTelemetry-compatible traces;
- route, retrieval, LLM, validation, cache, and rate-limit spans;
- error tracking such as Sentry;
- product analytics;
- dashboards and alerts;
- an eval-results store.

For a Vercel deployment, a practical stack is:

| Concern | Practical implementation |
| --- | --- |
| Web analytics | Keep Vercel Analytics |
| Exceptions | Sentry or equivalent |
| Traces | OpenTelemetry-compatible exporter supported by deployment environment |
| Logs | Structured JSON platform logs shipped to a searchable sink |
| Distributed cache and limiter | Managed Redis-compatible service |
| Durable metadata | Managed PostgreSQL |
| Product feedback | PostgreSQL table plus analytics event |

Do not log raw JDs or raw conversations by default.

### 1.9 Caching Architecture

Use three separate cache concepts:

| Cache | Purpose | Key | Retention |
| --- | --- | --- | --- |
| OpenAI prompt caching | Reuse repeated prompt prefixes | Provider-managed; optional `prompt_cache_key` | Provider policy |
| Application response cache | Reuse safe completed answers | normalized input + corpus version + prompt version + model snapshot + policy version | Bounded TTL |
| In-flight dedupe | Collapse identical simultaneous work | same as response cache key | Request lifetime |

Prompt caching should optimize prefix reuse, not replace application caching. Official OpenAI guidance states that prompt caching works on exact prefixes and recommends static content first and variable content last. It also exposes cached-token usage for monitoring: [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

### 1.10 Security Model

Public use should be allowed only through:

```text
WAF / bot protection
  -> distributed IP limiter
  -> anonymous session limiter
  -> request schema and body size validation
  -> route-specific token budget
  -> redaction policy
  -> AI pipeline
```

Authenticated administration should be separate:

- prompt management;
- eval dataset changes;
- feedback review;
- trace access;
- corpus publishing.

### 1.11 Deployment Architecture

#### MUST HAVE

- separate staging and production deployments;
- separate OpenAI projects and API keys;
- environment validation at startup;
- immutable prompt, model, scoring, and corpus version identifiers;
- preview deployment checks;
- CI gates for unit tests, contract tests, eval smoke tests, lint, typecheck, and build.

OpenAI production guidance recommends secure server-side key handling and separate staging projects as systems scale: [Production best practices](https://platform.openai.com/docs/guides/production-best-practices).

#### SHOULD HAVE

- managed Redis-compatible service for distributed cache and limits;
- managed PostgreSQL for feedback, eval metadata, prompt metadata, and optional sessions;
- secret manager integration;
- trace and error sinks;
- blue/green or canary rollout for prompt and model changes.

#### NICE TO HAVE

- asynchronous worker deployment for batch evals and future indexing;
- regional deployment review if traffic or privacy requirements justify it.

### 1.12 Async Processing Architecture

Interactive chat and ordinary job-fit analysis should stay synchronous.

Use async jobs for:

- corpus re-indexing;
- embedding generation when semantic retrieval is introduced;
- nightly eval runs;
- feedback-driven regression candidate generation;
- batch re-analysis after scoring changes;
- trace sampling review;
- future large-document ingestion.

Do not put the basic chat path behind a queue.

### 1.13 Failure-Handling Patterns

| Failure | Required behavior |
| --- | --- |
| Validation error | Return typed 400/413 response before AI call |
| Rate limit exceeded | Return typed 429 with retry hint; do not call OpenAI |
| Retrieval confidence too low | Return evidence-insufficient abstention |
| OpenAI transient 429/5xx before streaming | Retry with bounded exponential backoff and jitter |
| OpenAI transient error after streaming starts | End stream with typed error event; do not duplicate partial output automatically |
| OpenAI timeout | Abort request; return degraded deterministic output where available |
| Claim-verification failure | Remove unsupported claim, retry one constrained rewrite, then abstain |
| Redis unavailable | Fall back to conservative local limiter/cache behavior; emit alert |
| Trace exporter unavailable | Do not block user response; buffer or drop sampled telemetry safely |

## 2. Retrieval Architecture Redesign

### 2.1 Current Retrieval Assessment

The current corpus is small:

- chat retrieval builds roughly 17 portfolio sections in `lib/portfolio-retrieval.ts:110-193`;
- recruiter analysis builds roughly 49 evidence units in `lib/portfolio-evidence.ts:42-114`;
- chat uses token overlap, synonym groups, and section priorities;
- recruiter fit uses lexical overlap, aliases, and tool boosts.

This is appropriate for a prototype. It should evolve carefully.

### 2.2 Retrieval Target

```text
user question + recent turns
  -> intent classification
  -> standalone query rewrite when needed
  -> metadata filters
  -> BM25 candidate retrieval
  -> optional embedding candidate retrieval
  -> reciprocal-rank fusion
  -> semantic deduplication
  -> optional reranking
  -> confidence scoring
  -> evidence pack with citations
```

### 2.3 Add Now: Deterministic BM25 Retrieval

#### MUST HAVE

Replace ad hoc token-overlap scoring with a real BM25 index over canonical evidence units.

Why now:

- exact technologies, company names, project names, metrics, and dates matter;
- BM25 handles term rarity better than uniform hand-tuned overlap;
- it remains deterministic, fast, debuggable, and inexpensive;
- the corpus is tiny enough for an in-process build-time index.

Implementation:

```ts
type SearchCandidate = {
  evidenceId: string;
  lexicalScore: number;
  matchedTerms: string[];
  matchedFields: string[];
};
```

Index weighted fields separately:

| Field | Relative weight |
| --- | ---: |
| `title` | 4.0 |
| `sourceArea` | 3.0 |
| `tools` | 3.0 |
| `capabilities` | 2.5 |
| `entities` | 2.0 |
| `claim` | 1.0 |

Retain the existing curated aliases, but treat them as explicit query expansion rather than an opaque scoring shortcut.

### 2.4 Add Now: Per-Requirement Evidence Retrieval

#### MUST HAVE

For recruiter analysis, retrieve candidates per normalized requirement before producing a global shortlist.

Current problem:

`retrieveRelevantEvidence()` ranks globally and returns ten units before `mapRequirementsToEvidence()` runs (`lib/job-fit-engine.ts:200-281`). Common terms can crowd out evidence for a niche core requirement.

Target:

```text
for each requirement:
  retrieve top N lexical candidates
  classify direct / adjacent / missing
  preserve candidate scores and reasons
merge evidence IDs for narrative context
```

This improves false-negative control and makes every requirement auditable.

### 2.5 Add Now: Conversational Query Rewriting

#### SHOULD HAVE

Only rewrite when the latest user message is context-dependent.

Examples:

- “What about the second one?”
- “Did he use it professionally?”
- “How does that compare to Holman?”

Use a cheap structured rewrite step:

```ts
type RewrittenQuery = {
  needsRewrite: boolean;
  standaloneQuery: string;
  referencedEntities: string[];
  filters: {
    sourceTypes: EvidenceUnit["sourceType"][];
    companies: string[];
    projects: string[];
  };
};
```

Rules:

1. First attempt deterministic rewrite from recent entity mentions.
2. Call an LLM rewrite stage only if references remain ambiguous.
3. Never let rewrite text become an answer.
4. Log original query, rewritten query hash, selected filters, and retrieval score distribution.

### 2.6 Add Now: Metadata Filtering

#### SHOULD HAVE

Use filters before ranking when intent is explicit:

| Query signal | Filter |
| --- | --- |
| “at Holman” | `sourceArea` company filter |
| “projects” | `sourceType = project` |
| “education” | `sourceType = education` |
| “contact” | `sourceType = contact` |
| “professional experience” | exclude personal projects unless requested |
| recruiter requirement category | prioritize matching tool or capability metadata |

Filters must narrow candidates without hiding relevant transfer evidence. For job fit, preserve separate direct and adjacent candidate lanes.

### 2.7 Add Later: Embedding Retrieval

#### SHOULD HAVE WHEN TRIGGERED

Do not add embeddings solely because modern RAG systems often use them. Add them when at least one trigger occurs:

- corpus exceeds roughly 200 evidence units;
- resume, case studies, project READMEs, or external documents are indexed;
- lexical retrieval recall fails the offline target;
- user questions become semantically broad enough that BM25 repeatedly misses relevant evidence.

When triggered:

1. embed each canonical evidence unit;
2. embed rewritten query text;
3. retrieve top semantic candidates;
4. fuse lexical and semantic ranks;
5. preserve both scores in traces.

For an accuracy-first OpenAI implementation, evaluate `text-embedding-3-large`, which official docs describe as the most capable embedding model: [text-embedding-3-large](https://developers.openai.com/api/docs/models/text-embedding-3-large).

Use a simpler managed vector extension such as PostgreSQL with `pgvector` before introducing a dedicated vector-database vendor. The corpus and access patterns do not justify a separate vector service initially.

### 2.8 Add Later: Hybrid Fusion

#### SHOULD HAVE WHEN EMBEDDINGS EXIST

Use reciprocal-rank fusion:

```text
hybridScore = sum(1 / (k + rank_i))
```

where rank lists are:

- BM25;
- embedding similarity;
- optional metadata-priority lane.

Why fusion:

- lexical search preserves exact tool, metric, and entity matching;
- embeddings improve semantic recall;
- rank fusion avoids fragile raw-score normalization across retrieval systems.

### 2.9 Add Later: Reranking

#### NICE TO HAVE WHEN MEASURED NEED EXISTS

Rerank only the top 10-20 fused candidates. Use:

- deterministic business rules first;
- a cross-encoder or structured LLM reranker only when offline evals show retrieval precision needs improvement.

Structured reranker output:

```ts
type RerankedCandidate = {
  evidenceId: string;
  relevance: "high" | "medium" | "low";
  supportType: "direct" | "adjacent" | "none";
  reason: string;
};
```

Never let reranking overwrite the original evidence. Preserve rank provenance for audit.

### 2.10 Chunking Strategy

#### Chat corpus

Use claim-sized evidence units rather than broad sections:

- one experience summary;
- one impact bullet;
- one project summary;
- one project highlight;
- one profile narrative paragraph;
- one education record;
- one contact record.

Then assemble adjacent units from the same source only when needed.

#### Future documents

For resumes, project READMEs, and case studies:

- parse document structure;
- chunk by heading and paragraph boundaries;
- target approximately 250-500 tokens per chunk;
- allow modest overlap only across boundary-sensitive prose;
- retain source URI, heading path, ordinal position, and content hash;
- do not split tables or bullet groups blindly.

### 2.11 Chunk Metadata

Every chunk should include:

```ts
type RetrievalChunk = {
  id: string;
  sourceId: string;
  sourceType: string;
  title: string;
  text: string;
  headingPath: string[];
  ordinal: number;
  entities: string[];
  tools: string[];
  capabilities: string[];
  metricTags: string[];
  visibility: "public";
  verifiedAt?: string;
  corpusVersion: string;
  contentHash: string;
};
```

### 2.12 Citation Strategy

#### MUST HAVE

Return structured claims:

```ts
type GroundedClaim = {
  text: string;
  evidenceIds: string[];
  support: "direct" | "adjacent";
};

type GroundedAnswer = {
  answerMarkdown: string;
  claims: GroundedClaim[];
  citations: Array<{
    evidenceId: string;
    label: string;
    sourceArea: string;
    excerpt: string;
    url?: string;
  }>;
  abstained: boolean;
  abstentionReason?: string;
};
```

Important factual bullets must cite evidence IDs. Render citations from backend-resolved metadata, never from model-authored URL text.

### 2.13 Retrieval Confidence

#### MUST HAVE

Compute a deterministic confidence object:

```ts
type RetrievalConfidence = {
  level: "high" | "medium" | "low" | "none";
  topScore: number;
  scoreMargin: number;
  directEvidenceCount: number;
  coveredIntentCount: number;
  uncoveredIntentCount: number;
  reasons: string[];
};
```

Use thresholds calibrated by evals, not guessed permanently.

Initial policy:

| Confidence | Generation behavior |
| --- | --- |
| `high` | Answer with supported claims and citations |
| `medium` | Answer conservatively; distinguish adjacent evidence |
| `low` | Ask one clarifying question or provide narrow partial answer |
| `none` | Abstain |

### 2.14 Semantic Deduplication

#### SHOULD HAVE

Before context assembly:

1. deduplicate exact content hashes;
2. collapse near-duplicate claims from the same source;
3. retain the strongest evidence unit;
4. preserve all source IDs in provenance metadata.

For the current corpus, deterministic normalized-text hashing is enough. Use embedding-based deduplication only after semantic indexing exists.

### 2.15 Retrieval Work Classification

| Classification | Add |
| --- | --- |
| **MUST HAVE NOW** | Canonical evidence units, BM25, per-requirement retrieval, retrieval confidence, citation payloads |
| **SHOULD HAVE NEXT** | Conversational rewriting, metadata filters, deterministic deduplication |
| **NICE TO HAVE LATER** | Embeddings, rank fusion, reranking after measured recall or precision gaps |
| **OVERENGINEERING NOW** | Dedicated vector DB, knowledge graph, graph RAG, autonomous retrieval agent, multi-hop web research |

## 3. Hallucination Reduction Strategy

### 3.1 Layered Control Model

```text
Layer 0: curated corpus and provenance
Layer 1: input isolation and injection screening
Layer 2: retrieval with confidence
Layer 3: evidence-pack construction
Layer 4: structured grounded generation
Layer 5: citation validation
Layer 6: claim support verification
Layer 7: deterministic rewrite or abstention
Layer 8: telemetry and sampled human review
```

### 3.2 Layer 0: Curated Corpus

#### MUST HAVE

Treat `data/portfolio.ts` as curated public evidence, but distinguish:

- verified metrics;
- self-reported claims;
- positioning narrative;
- transferable skill inference.

Do not let profile prose carry the same weight as a metric-backed work impact bullet.

### 3.3 Layer 1: Input Isolation

#### MUST HAVE

Separate:

- developer instructions;
- trusted evidence;
- untrusted user input;
- untrusted JD content;
- generated prior assistant content.

The job-fit prompts already instruct the model to treat JD content as untrusted (`app/api/job-fit/route.ts:184-220`). Apply the same discipline to chat.

Never interpolate user input into developer instructions. Wrap evidence in explicit machine-readable objects rather than free-form concatenated prose where practical.

### 3.4 Layer 2: Retrieval Confidence

#### MUST HAVE

Do not generate a factual answer when retrieval confidence is `none`. For `low`, answer only the supported portion or ask a clarifying question.

This directly fixes the current chat fallback behavior in `lib/portfolio-retrieval.ts:241-246`, where unrelated queries receive generic portfolio context.

### 3.5 Layer 3: Evidence Pack

#### MUST HAVE

Construct an allowlisted evidence packet:

```ts
type EvidencePack = {
  query: string;
  confidence: RetrievalConfidence;
  evidence: EvidenceUnit[];
  allowedEvidenceIds: string[];
  corpusVersion: string;
};
```

The model may cite only `allowedEvidenceIds`.

### 3.6 Layer 4: Structured Grounded Generation

#### MUST HAVE

For chat, generate structured claims and final Markdown in one schema or generate claims first and render Markdown deterministically.

For recruiter fit:

- keep score and verdict deterministic;
- keep requirement mappings deterministic;
- strongly consider rendering top matches and top gaps deterministically from requirement mappings;
- reserve the LLM for summary, recruiter insight, and screening-question wording.

This reduces the model’s opportunity to distort critical candidate-evaluation facts.

### 3.7 Layer 5: Citation Validation

#### MUST HAVE

Validate:

- evidence ID exists;
- evidence ID belongs to current evidence packet;
- claim has at least one citation;
- citation source visibility is public;
- rendered citation metadata comes from server storage.

Do **not** replace invalid IDs with a valid fallback ID while preserving prose. The current `enforceNarrativeGrounding()` behavior (`app/api/job-fit/route.ts:663-693`) can make an unsupported claim look cited.

### 3.8 Layer 6: Claim Support Verification

#### SHOULD HAVE

Use two levels:

1. **Deterministic verification**
   - metrics in output must appear in cited evidence;
   - employer, tool, project, and date names must be supported by cited evidence;
   - URLs must be server-resolved;
   - score and verdict must equal backend values.
2. **Semantic verification**
   - ask a separate structured verifier whether each claim is entailed, adjacent, unsupported, or contradicted by cited evidence;
   - reject unsupported or contradicted claims;
   - log verifier outcome.

Verifier schema:

```ts
type ClaimVerification = {
  claimIndex: number;
  verdict: "entailed" | "adjacent" | "unsupported" | "contradicted";
  evidenceIds: string[];
  reason: string;
};
```

Use semantic verification selectively:

- always for recruiter top matches and summary;
- always for chat claims containing metrics, dates, employers, or technology assertions;
- sample lower-risk chat responses until evals show whether full verification is necessary.

### 3.9 Layer 7: Rewrite or Abstain

#### MUST HAVE

Policy:

```text
unsupported generated claim
  -> remove claim if answer remains useful
  -> otherwise run one constrained rewrite with verifier feedback
  -> verify again
  -> otherwise abstain
```

Maximum one repair attempt for synchronous UX. Do not create recursive self-correction loops.

### 3.10 Layer 8: Monitoring

#### SHOULD HAVE

Track:

- abstention rate;
- unsupported-claim rate;
- contradiction rate;
- citation repair rate;
- retrieval-confidence distribution;
- human correction rate;
- answer feedback by prompt/model/retrieval version.

## 4. Modern AI Orchestration Design

### 4.1 Decision

Use **one orchestrator with multiple explicit pipelines**.

```text
AiOrchestrator
  -> ChatPipeline
  -> JobFitPipeline
  -> EvaluationPipeline
  -> IndexingPipeline
```

### 4.2 Chat Pipeline

```text
validate request
  -> enforce rate limit
  -> normalize recent turns
  -> rewrite context-dependent query if needed
  -> retrieve evidence
  -> compute retrieval confidence
  -> abstain or generate typed grounded answer
  -> verify citations
  -> verify high-risk claims
  -> stream validated answer events
  -> record trace and feedback handle
```

For strict accuracy, do not stream unverified factual claims directly to the user. Choose one of:

1. stream only progress events while generating, then emit verified answer;
2. generate sentence-sized structured claims, verify each claim, then stream accepted claims;
3. stream draft text visually marked as provisional, then replace it after verification.

Recommendation: use option 1 initially. It is simplest and safest. Preserve streaming later for low-risk prose if latency measurements justify complexity.

### 4.3 Recruiter-Fit Pipeline

```text
validate JD
  -> redact or warn on sensitive content
  -> enforce rate limit
  -> normalize JD with Structured Outputs
  -> verify extracted requirements against JD
  -> retrieve evidence per requirement
  -> deterministic mapping
  -> deterministic score with applicable-dimension weights
  -> deterministic verdict
  -> deterministic top matches and gaps
  -> LLM narrative for explanation and screening questions
  -> verify narrative claims
  -> return typed result
```

### 4.4 Tools and Function Calling

#### SHOULD HAVE ONLY WHEN NEEDED

Use function calling if the model must request application functionality. Official OpenAI guidance distinguishes function calling for application tools from structured response formats for typed user-facing output: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

Potential narrow tools:

```text
get_portfolio_evidence(ids)
search_portfolio(query, filters)
submit_feedback(answer_id, rating, note)
```

For the current product, retrieval should be orchestrated by application code before generation. Giving the model open-ended search tools is not necessary yet.

### 4.5 Planners

#### OVERENGINEERING

Do not add a planner for portfolio chat or recruiter fit. The workflows are known and short. A planner would:

- add latency;
- increase cost;
- make traces harder to compare;
- introduce branch variability;
- weaken deterministic guarantees.

### 4.6 Evaluators

#### SHOULD HAVE

Add evaluators, but keep them separate from the user-facing orchestrator:

- offline regression evaluators;
- sampled online claim verifier;
- human review queue;
- retrieval-recall evaluator.

### 4.7 Agents

#### OVERENGINEERING

Do not add:

- multi-agent debate;
- autonomous research agents;
- manager-worker agent trees;
- agent memory graphs;
- recursive self-reflection loops;
- agent-generated scoring.

These patterns solve a different class of problem. The portfolio corpus is bounded and curated.

## 5. Memory System Design

### 5.1 Memory Classes

| Memory type | Purpose | Persistence |
| --- | --- | --- |
| Active turn window | Maintain immediate conversation coherence | Browser and request only |
| Retrieval memory | Track recently referenced entities and evidence IDs | Optional session TTL |
| Conversation summary | Compress older context for longer sessions | Optional session TTL |
| Feedback memory | Store answer rating and correction | Durable, privacy-safe |
| User profile memory | Personalization | Disabled by default |
| Job-fit input | Analyze JD | No durable raw retention by default |

### 5.2 Short-Term Conversation Memory

#### MUST HAVE

Keep a bounded turn window:

- token-aware, not character-only;
- preserve latest user turns verbatim;
- retain recent cited evidence IDs;
- summarize older turns only when needed;
- exclude untrusted client-supplied assistant messages unless signed or server-stored.

Current risk: the browser supplies prior assistant history, so a direct caller can fabricate assistant messages (`components/chat/akshay-gpt-shell.tsx:33-43`, `app/api/chat/route.ts:213`).

### 5.3 Retrieval Memory

#### SHOULD HAVE

Store recent entity references:

```ts
type RetrievalMemory = {
  sessionId: string;
  recentEntities: string[];
  recentEvidenceIds: string[];
  lastStandaloneQuery?: string;
  expiresAt: string;
};
```

Use it for follow-up query rewriting. TTL should be short, such as 30-60 minutes for anonymous sessions.

### 5.4 Summarization Strategy

#### SHOULD HAVE WHEN SESSIONS GROW

Summarize only after token threshold is exceeded. Summary schema:

```ts
type ConversationSummary = {
  userIntents: string[];
  referencedEntities: string[];
  resolvedQuestions: string[];
  unresolvedQuestions: string[];
  citedEvidenceIds: string[];
};
```

Do not store unconstrained prose summaries as authoritative facts. Evidence IDs remain the source of truth.

Official OpenAI docs describe manual state, `previous_response_id`, durable Conversations API objects, and context management. They also state that response objects are saved for 30 days by default unless `store: false` is set: [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

### 5.5 Persistence Policy

#### MUST HAVE

Default:

- use `store: false` for OpenAI Responses unless a reviewed product requirement justifies provider-side response retention;
- avoid OpenAI durable conversation objects for anonymous portfolio chat;
- do not persist raw JD text;
- persist hashes and privacy-safe operational metadata;
- persist user feedback only with the answer ID, version IDs, rating, and optional user-submitted correction.

### 5.6 Long-Term Memory

#### OVERENGINEERING BY DEFAULT

Do not build long-term assistant memory for anonymous portfolio visitors.

Only add durable user memory if authenticated users request saved conversations or recruiter workspaces. Then:

- require explicit opt-in;
- apply tenant boundaries;
- support deletion;
- encrypt at rest;
- define retention;
- avoid storing inferred sensitive attributes;
- separate user-authored notes from model-generated summaries.

### 5.7 What Remains Stateless

- retrieval computation;
- job-fit scoring;
- verdict selection;
- citation validation;
- claim verification decisions;
- ordinary anonymous chat generation.

## 6. Observability and Evaluation

### 6.1 Trace Model

#### MUST HAVE

Emit one trace per user request:

```text
request
  rate_limit.check
  request.validate
  cache.lookup
  query.rewrite
  retrieval.search
  retrieval.confidence
  openai.responses.create
  claims.validate_ids
  claims.verify
  cache.write
  response.serialize
```

Job-fit adds:

```text
jd.redact
jd.normalize
requirements.verify
evidence.retrieve_per_requirement
score.compute
narrative.generate
```

### 6.2 Trace Attributes

Log privacy-safe attributes:

```ts
type AiTraceAttributes = {
  traceId: string;
  route: "chat" | "job-fit";
  anonymousSessionHash?: string;
  promptVersion: string;
  modelSnapshot: string;
  corpusVersion: string;
  scoringVersion?: string;
  retrievalVersion: string;
  cacheStatus: "hit" | "miss" | "deduped";
  retrievalConfidence?: string;
  evidenceIds: string[];
  inputTokenCount?: number;
  outputTokenCount?: number;
  cachedInputTokenCount?: number;
  openAiRequestId?: string;
  clientRequestId: string;
  degradedMode: boolean;
  abstained: boolean;
  latencyMs: number;
};
```

Do not log raw user text by default. Store sampled encrypted payloads only in a restricted review workflow with explicit retention.

Official OpenAI API reference recommends logging `x-request-id` and supports an application-provided `X-Client-Request-Id`: [API request debugging](https://developers.openai.com/api/reference/overview#debugging-requests).

### 6.3 Metrics

#### MUST HAVE

| Category | Metrics |
| --- | --- |
| Traffic | requests, unique anonymous sessions, route mix |
| Reliability | success rate, 4xx, 5xx, timeout rate, retry rate, degraded-mode rate |
| Latency | p50/p95/p99 total, retrieval, model, validation, stream duration |
| Retrieval | top score, margin, direct evidence count, confidence distribution, abstention rate |
| Grounding | invalid citation rate, unsupported-claim rate, repair rate, contradiction rate |
| Cost | input tokens, output tokens, cached input tokens, estimated cost by route and version |
| Abuse | rate-limit denials, WAF denials, body-size denials |
| Product | feedback rate, positive rating rate, copied recruiter reports |

### 6.4 Prompt and Model Versioning

#### MUST HAVE

Version:

- chat prompt;
- query-rewrite prompt;
- JD-normalization prompt;
- recruiter-narrative prompt;
- claim-verifier prompt;
- model snapshot per task;
- retrieval algorithm;
- alias dictionary;
- corpus;
- scoring formula.

Store versions in every trace and cache key.

Official OpenAI docs provide long-lived prompt objects with versioning and templating: [Prompting](https://developers.openai.com/api/docs/guides/prompting). Use those prompt objects or maintain an equivalent repository-backed prompt registry, but do not leave prompts as unversioned string constants spread across route files.

### 6.5 Model Promotion Policy

#### MUST HAVE

Never move a new model alias directly to production. Evaluate a pinned snapshot:

```text
candidate snapshot
  -> offline eval suite
  -> adversarial suite
  -> latency and cost benchmark
  -> shadow traffic sample
  -> canary release
  -> production promotion
```

Official OpenAI API docs note that prompting behavior can vary between model snapshots and recommend pinned versions plus evals for consistent behavior: [API overview](https://developers.openai.com/api/reference/overview#backwards-compatibility).

### 6.6 Evaluation Datasets

#### MUST HAVE

Create repository fixtures:

```text
evals/
  chat/
    factual.jsonl
    abstention.jsonl
    follow-ups.jsonl
    prompt-injection.jsonl
    retrieval-recall.jsonl
  job-fit/
    normalization.jsonl
    requirement-mapping.jsonl
    scoring.jsonl
    grounding.jsonl
    adversarial-jds.jsonl
  streaming/
    ndjson-fragmentation.jsonl
```

Minimum chat categories:

- exact work metrics;
- exact tools;
- project comparisons;
- ambiguous follow-ups;
- unsupported questions;
- malicious instruction overrides;
- fake assistant-history injection;
- contact-link questions.

Minimum recruiter categories:

- no-domain JD;
- no-seniority JD;
- senior JD;
- tool-heavy JD;
- irrelevant JD;
- malicious embedded instructions;
- repeated filler;
- confidential-text redaction fixture;
- evidence crowd-out regression;
- citation laundering regression.

### 6.7 Quality Scoring

#### MUST HAVE

Track:

| Metric | Meaning |
| --- | --- |
| Retrieval recall@K | Expected evidence appears in candidate set |
| Citation precision | Cited evidence supports displayed claim |
| Citation coverage | Material factual claims carry citations |
| Groundedness | Claims are entailed or explicitly labeled adjacent |
| Abstention precision | Assistant abstains when corpus lacks support |
| Abstention recall | Assistant does not abstain when strong evidence exists |
| Job-fit score calibration | Similar labeled JDs produce defensible ranking |
| Requirement extraction precision | Extracted requirements are present in JD |
| Requirement extraction recall | Decision-critical JD requirements are retained |

### 6.8 Automated Evaluation Pipeline

#### SHOULD HAVE

Run:

- deterministic unit tests on every PR;
- smoke eval subset on every PR;
- full offline eval suite nightly;
- full eval suite before prompt, retrieval, corpus, scoring, or model promotion;
- sampled online groundedness review daily;
- monthly human calibration review for job-fit scoring.

OpenAI provides an Evals API and describes evals as essential when improving prompts or upgrading models: [Working with evals](https://developers.openai.com/api/docs/guides/evals).

### 6.9 Human Review Workflow

#### SHOULD HAVE

Create a restricted review queue for:

- thumbs-down feedback;
- unsupported-claim verifier failures;
- low-confidence answers that were still shown;
- large score shifts after scoring-version changes;
- sampled recruiter analyses;
- prompt-injection attempts.

Review outcome should create:

- fixture candidate;
- corpus correction;
- alias update;
- scoring calibration issue;
- prompt update proposal.

## 7. Scalability and Performance

### 7.1 Distributed Caching

#### MUST HAVE FOR PUBLIC SCALE

Replace route-local `Map` caches with a bounded distributed cache.

Cache keys:

```text
chat:
  sha256(normalized_query + evidence_ids + corpus_version + prompt_version + model_snapshot + policy_version)

job-fit:
  sha256(redacted_normalized_jd + corpus_version + normalization_prompt_version +
         narrative_prompt_version + model_snapshots + retrieval_version + scoring_version)
```

Policies:

- TTL;
- maximum value size;
- no raw JD key;
- redacted or encrypted cached value if sensitive content is retained;
- explicit cache busting through version keys;
- cache-hit telemetry.

### 7.2 Streaming Architecture

#### MUST HAVE

Use one transport deliberately:

1. OpenAI SSE to server;
2. server parses provider events;
3. server emits typed SSE or NDJSON events;
4. client buffers partial transport frames;
5. client renders only complete events.

Recommended event contract:

```ts
type ChatStreamEvent =
  | { type: "status"; stage: "retrieval" | "generation" | "verification" }
  | { type: "message"; answer: GroundedAnswer }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "error"; code: string; message: string; retryable: boolean }
  | { type: "done"; traceId: string };
```

For accuracy-first rollout, emit the final verified answer as one event. Add verified incremental claim streaming only if latency measurements justify it.

Official Responses API docs support SSE streaming when `stream: true`: [Responses API](https://platform.openai.com/docs/api-reference/responses) and [Streaming responses](https://platform.openai.com/docs/guides/streaming-responses?api-mode=responses).

### 7.3 Concurrency Controls

#### MUST HAVE

- distributed per-IP token bucket;
- anonymous-session token bucket;
- route-level concurrent request ceiling;
- per-session one-active-chat-generation rule;
- stricter job-fit quota due to two-stage analysis;
- OpenAI concurrency semaphore;
- backpressure before upstream calls.

### 7.4 Request Deduplication

#### SHOULD HAVE

Use short-lived distributed locks:

```text
lock:job-fit:<cache-key>
lock:chat:<cache-key>
```

If identical work is active:

- wait briefly for result;
- attach to stream only if transport architecture supports fan-out safely;
- otherwise return a retryable status.

### 7.5 Retry Policy

#### MUST HAVE

Retry only:

- upstream 429;
- transient 5xx;
- network reset before output begins.

Use:

- exponential backoff;
- jitter;
- low maximum attempts;
- remaining deadline check;
- idempotent request semantics.

Do not retry:

- schema validation failure without a constrained repair strategy;
- prompt-injection rejection;
- request body errors;
- streaming responses after visible partial output.

OpenAI rate-limit guidance recommends bounded exponential backoff with random jitter and warns that failed requests still contribute to limits: [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits).

### 7.6 Timeouts

#### MUST HAVE

Define per-stage budgets:

| Stage | Initial budget |
| --- | ---: |
| Request validation and rate limit | 100 ms |
| Local retrieval | 100 ms |
| Query rewrite | 3 s |
| Chat generation | 15 s |
| Claim verification | 5 s |
| JD normalization | 12 s |
| Job-fit narrative | 12 s |
| Total chat request | 22 s |
| Total job-fit request | 30 s |

Tune from telemetry. Use degraded deterministic paths where they exist.

### 7.7 Circuit Breakers

#### SHOULD HAVE

Track recent OpenAI failures:

```text
closed -> open after threshold -> half-open probe -> closed
```

Behavior while open:

- job-fit returns deterministic analysis with degraded label;
- chat returns a clear temporary-unavailable response or a deterministic evidence summary;
- alert operators.

### 7.8 Queueing

#### NICE TO HAVE FOR ASYNC WORK

Use a queue for:

- indexing;
- embeddings;
- nightly evals;
- batch score migration;
- feedback review preprocessing.

Do not queue synchronous user chat.

### 7.9 Optimization Classification

| Classification | Add |
| --- | --- |
| **MUST HAVE NOW** | stream fix, output limits, timeouts, distributed rate limits, bounded cache, request validation |
| **SHOULD HAVE NEXT** | in-flight dedupe, circuit breaker, prompt-prefix optimization, usage analytics |
| **NICE TO HAVE LATER** | async workers, semantic index refresh jobs, regional scaling |
| **OVERENGINEERING NOW** | Kafka, Kubernetes, service mesh, separate microservices, GPU hosting |

## 8. Security and Privacy

### 8.1 Prompt Injection Protection

#### MUST HAVE

Apply controls in layers:

1. developer prompt explicitly labels user and JD content as untrusted;
2. user input stays in user content, never interpolated into instructions;
3. retrieval comes from allowlisted public corpus only;
4. tool access is absent or narrowly allowlisted;
5. generated claims require evidence IDs;
6. verifier rejects unsupported claims;
7. prompt-injection fixtures run in CI;
8. suspicious input metrics are tracked.

### 8.2 Rate Limiting and Abuse Prevention

#### MUST HAVE

- WAF and bot protection;
- IP limits;
- anonymous session limits;
- daily route quotas;
- stricter limits for job fit;
- request body limits;
- provider spend alerts;
- OpenAI project spend limits;
- emergency kill switch per route.

### 8.3 Authentication and Authorization

#### MUST HAVE

Public assistant usage can remain anonymous.

Administrative surfaces must require authentication and authorization:

| Role | Allowed actions |
| --- | --- |
| Public visitor | ask chat questions, submit JD, submit feedback |
| Reviewer | inspect sampled traces and feedback |
| Editor | update corpus drafts |
| Admin | publish corpus, change prompts, promote models, view cost dashboards |

Do not combine public API behavior with administrative operations.

### 8.4 Secret Management

#### MUST HAVE

- server-side secrets only;
- separate staging and production OpenAI keys;
- secret manager or platform encrypted environment variables;
- rotation procedure;
- least-privileged deployment access;
- no secrets in logs;
- startup validation without disclosing secret names to public callers.

Official OpenAI API reference states that API keys must not be exposed client-side and should be loaded from environment variables or a server-side key manager: [Authentication](https://developers.openai.com/api/reference/overview#authentication).

### 8.5 PII and JD Privacy

#### MUST HAVE

Before sending JD content upstream:

1. show a disclosure that pasted text is processed by an AI provider;
2. discourage confidential or personal data;
3. redact obvious email addresses, phone numbers, and recruiter names where not necessary;
4. use `store: false`;
5. avoid raw logging;
6. avoid durable raw caching;
7. define deletion and retention behavior.

### 8.6 Audit Logging

#### SHOULD HAVE

Log:

- admin changes;
- corpus publications;
- prompt promotions;
- model promotions;
- scoring-version changes;
- reviewer access to sampled payloads;
- retention-policy changes.

### 8.7 Safe Markdown

#### MUST HAVE

Keep `react-markdown`, raw HTML disabled, and:

- allowlist URL protocols;
- render portfolio links from backend metadata;
- block `javascript:`, `data:`, and unknown protocols;
- add CSP;
- disallow arbitrary iframe or image embeds from generated output.

## 9. Modern OpenAI Best Practices

### 9.1 Responses API

#### MUST HAVE

Keep the Responses API. The current routes already use `POST /v1/responses` (`app/api/chat/route.ts:203`, `app/api/job-fit/route.ts:812`).

Use an official OpenAI SDK wrapper instead of duplicating low-level parsing where it improves correctness:

- typed request construction;
- response parsing;
- structured-output helpers;
- request IDs;
- normalized errors;
- streaming event handling.

The Responses API supports text and JSON outputs, streaming, stateful interactions, and tools: [Responses API reference](https://platform.openai.com/docs/api-reference/responses).

### 9.2 Structured Outputs

#### MUST HAVE

Continue using strict JSON schemas for:

- JD normalization;
- recruiter narrative;
- query rewriting;
- claim verification;
- optional grounded chat claims.

Use Structured Outputs rather than JSON mode. Official guidance states that Structured Outputs enforce schema adherence and recommends them over JSON mode where supported: [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

### 9.3 Tool Calling

#### SHOULD HAVE ONLY FOR REAL APPLICATION ACTIONS

Use function calling only when the model must bridge to application functions. Do not use it as ceremony around deterministic retrieval.

Potential later use:

- model requests a narrower portfolio search after insufficient initial recall;
- authenticated recruiter workspace saves an analysis;
- feedback submission.

### 9.4 Streaming

#### MUST HAVE

- use SDK or fully correct SSE parsing;
- preserve partial frames;
- handle new event types safely;
- log time to first event and total time;
- propagate cancellation;
- do not display unverified factual text as final.

### 9.5 Retries

#### MUST HAVE

- retry transient failures with deadline-aware exponential backoff and jitter;
- do not retry blindly after partial streaming;
- respect OpenAI rate-limit headers;
- log provider request IDs and client request IDs.

### 9.6 Prompt Layering

#### MUST HAVE

Order prompt content:

```text
stable developer contract
  -> stable safety and grounding policy
  -> stable output schema through Structured Outputs
  -> trusted evidence packet
  -> untrusted user content
```

Keep stable prefixes identical where possible to benefit from prompt caching. Official guidance recommends static content first and variable content last: [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

### 9.7 Model Routing

#### MUST HAVE

The current code hard-codes `gpt-4o-mini`. Replace that with task-level configuration and benchmark candidates.

Accuracy-first initial evaluation matrix:

| Task | Baseline candidate | Lower-latency candidate | Rule |
| --- | --- | --- | --- |
| Chat grounded answer | pinned `gpt-5.5` snapshot | pinned smaller evaluated model | Promote only if groundedness and abstention evals pass |
| JD normalization | pinned `gpt-5.5` snapshot | pinned smaller evaluated model | Prefer smaller only if extraction precision and recall remain acceptable |
| Recruiter narrative | pinned `gpt-5.5` snapshot | pinned smaller evaluated model | Score/verdict remain deterministic regardless |
| Claim verification | pinned evaluated model | deterministic checks first | Use semantic verifier only where risk warrants it |
| Query rewrite | pinned smaller evaluated model | deterministic rewrite | Keep output structured and narrow |

As of the design date, official OpenAI guidance presents GPT-5.5 as the latest model family and recommends Responses API use, evaluation, intentional reasoning effort, Structured Outputs, and static-prefix prompt caching: [Using GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model).

Do not blindly replace `gpt-4o-mini` with an alias. Pin a tested snapshot after an eval pass.

### 9.8 Conversation State

#### MUST HAVE

For anonymous portfolio chat:

- prefer `store: false`;
- manually pass a bounded server-normalized context window;
- avoid durable Conversations API state unless saved chats become a product feature.

If durable conversations are added later, document retention and deletion. Official docs state that response objects are stored for 30 days by default unless `store: false`, while conversation objects persist differently: [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

## 10. Implementation Roadmap

### Phase 1: Critical Correctness Fixes

**Goal:** eliminate known incorrect behavior and close public abuse gaps.

| Task | Complexity | Impact | Dependencies | Priority |
| --- | --- | --- | --- | --- |
| Fix client JSONL frame buffering | Low | Very high | None | P0 |
| Add stream fragmentation tests | Medium | Very high | Test framework | P0 |
| Fix absent-category scoring and renormalize applicable weights | Medium | Very high | Score fixture design | P0 |
| Add score regression tests for missing domain and seniority | Medium | Very high | Test framework | P0 |
| Add `zod` API schemas and request body limits | Medium | High | `zod` | P0 |
| Add route-specific timeout and cancellation handling | Medium | High | Shared OpenAI client | P0 |
| Add `max_output_tokens` for chat | Low | Medium | Config module | P0 |
| Bound job-fit cache size and TTL immediately | Low | High | None | P0 |
| Add IP and anonymous-session rate limits | Medium | Very high | Managed Redis-compatible store or platform limiter | P0 |
| Stop replacing invalid evidence IDs with fallback IDs while preserving prose | Medium | Very high | Grounding validator | P0 |

Exit criteria:

- known stream-loss regression is tested;
- job-fit scores no longer inflate absent dimensions;
- malformed public requests fail before OpenAI calls;
- endpoints cannot proxy unlimited spend;
- unsupported recruiter claims cannot inherit unrelated citations.

### Phase 2: Production Readiness

**Goal:** introduce durable boundaries, operational visibility, and citation-first answers.

| Task | Complexity | Impact | Dependencies | Priority |
| --- | --- | --- | --- | --- |
| Extract route logic into typed pipelines | High | High | Phase 1 schemas | P1 |
| Add canonical evidence-unit schema and corpus version | Medium | High | Data migration | P1 |
| Replace ad hoc chat retrieval with BM25 | Medium | High | Canonical evidence units | P1 |
| Retrieve job-fit evidence per requirement | Medium | High | BM25 retriever | P1 |
| Add retrieval-confidence policy and abstention | Medium | Very high | Eval fixtures | P1 |
| Add chat citations and backend-resolved source chips | High | Very high | Canonical evidence | P1 |
| Add deterministic top matches and gaps for recruiter analysis | Medium | High | Requirement mapper | P1 |
| Add structured logs, traces, request IDs, and dashboards | High | High | Telemetry sink | P1 |
| Add feedback endpoint and review queue | Medium | High | PostgreSQL | P1 |
| Add staging/prod OpenAI projects and CI quality gates | Medium | High | Deployment settings | P1 |
| Set `store: false` and add JD privacy notice/redaction | Medium | High | Privacy policy | P1 |

Exit criteria:

- every answer has traceable versions;
- factual chat answers expose citations;
- low-confidence questions abstain;
- every job-fit requirement has per-requirement retrieval evidence;
- operators can see cost, latency, errors, and grounding quality.

### Phase 3: Advanced AI Reliability

**Goal:** make model and prompt changes measurable and enforce claim support.

| Task | Complexity | Impact | Dependencies | Priority |
| --- | --- | --- | --- | --- |
| Add full offline eval corpus | High | Very high | Phase 2 traces and fixtures | P2 |
| Add prompt and model registry | Medium | High | Version conventions | P2 |
| Benchmark pinned `gpt-5.5` snapshot and smaller candidates | Medium | High | Eval suite | P2 |
| Add conversational query rewriting | Medium | Medium-High | Retrieval memory | P2 |
| Add deterministic metric/entity claim checks | Medium | High | Claim schema | P2 |
| Add semantic entailment verifier for high-risk claims | High | Very high | Eval calibration | P2 |
| Add one-pass constrained claim repair | Medium | High | Verifier | P2 |
| Add sampled human-review workflow | Medium | High | Feedback store | P2 |
| Add canary promotion policy for prompts, models, retrieval, and scoring | Medium | High | Registry and dashboards | P2 |

Exit criteria:

- prompt and model promotions require eval evidence;
- high-risk factual claims are verified;
- unsupported claims are removed, repaired once, or abstained;
- follow-up questions retrieve correctly.

### Phase 4: Scale Architecture

**Goal:** introduce only infrastructure justified by corpus and traffic growth.

| Task | Complexity | Impact | Dependencies | Priority |
| --- | --- | --- | --- | --- |
| Add embeddings when lexical recall trigger is reached | Medium | Medium-High | Corpus growth or failed recall target | P3 |
| Evaluate `text-embedding-3-large` | Low-Medium | Medium | Embedding pipeline | P3 |
| Add PostgreSQL `pgvector` hybrid retrieval | Medium | Medium-High | Embeddings | P3 |
| Add reciprocal-rank fusion | Medium | Medium-High | BM25 and embeddings | P3 |
| Add reranking only if precision target remains unmet | Medium-High | Medium | Hybrid evals | P3 |
| Add queue-backed indexing and nightly eval workers | Medium | Medium | Queue service | P3 |
| Add distributed in-flight request dedupe | Medium | Medium | Redis-compatible store | P3 |
| Add circuit breaker and deterministic chat degraded response | Medium | Medium-High | Reliability service | P3 |
| Evaluate regional scaling and data residency | High | Conditional | Traffic and privacy requirements | P3 |

Exit criteria:

- added infrastructure is justified by metrics;
- hybrid retrieval improves eval scores materially;
- async jobs do not affect interactive latency;
- scaling remains horizontally safe.

## 11. Codebase Refactor Recommendations

### 11.1 Folder Structure

```text
app/
  api/
    chat/route.ts
    job-fit/route.ts
    feedback/route.ts

data/
  portfolio.ts

lib/
  client/
    chat-client.ts
    job-fit-client.ts
    ndjson-stream-reader.ts
  server/
    config/
      ai-config.ts
      env.ts
      limits.ts
    contracts/
      chat.ts
      evidence.ts
      feedback.ts
      job-fit.ts
    ai/
      openai-client.ts
      model-router.ts
      prompt-registry.ts
      retry-policy.ts
    corpus/
      portfolio-corpus.ts
      portfolio-index.ts
      corpus-version.ts
    retrieval/
      bm25-retriever.ts
      confidence.ts
      query-rewriter.ts
      hybrid-retriever.ts
      reranker.ts
    grounding/
      abstention.ts
      claim-validator.ts
      claim-verifier.ts
      citations.ts
    pipelines/
      chat-pipeline.ts
      job-fit-pipeline.ts
    reliability/
      cache.ts
      circuit-breaker.ts
      rate-limit.ts
      request-dedupe.ts
    observability/
      logger.ts
      metrics.ts
      tracing.ts

evals/
  chat/
  job-fit/
  streaming/

tests/
  unit/
  contract/
  integration/
```

### 11.2 Architecture Boundaries

| Layer | Owns | Must not own |
| --- | --- | --- |
| Route | HTTP validation, authorization, serialization | prompts, scoring, retrieval |
| Pipeline | workflow order and failure policy | provider-specific HTTP parsing |
| AI client | OpenAI request construction, retries, request IDs | business scoring |
| Retrieval | index, filtering, ranking, confidence | generated prose |
| Grounding | citations, support checks, abstention | retrieval ranking |
| Job-fit engine | requirement mapping, score formula, verdict | LLM calls |
| Observability | traces, metrics, safe logs | raw sensitive payload persistence |

### 11.3 Configuration

#### MUST HAVE

```ts
type AiConfig = {
  corpusVersion: string;
  retrievalVersion: string;
  scoringVersion: string;
  promptVersions: {
    chat: string;
    rewrite: string;
    normalizeJob: string;
    jobNarrative: string;
    verifyClaims: string;
  };
  models: {
    chat: string;
    rewrite: string;
    normalizeJob: string;
    jobNarrative: string;
    verifyClaims: string;
  };
  timeoutsMs: Record<string, number>;
  outputTokenLimits: Record<string, number>;
};
```

Load environment overrides through validated schema. Cache keys and traces must include relevant versions.

### 11.4 Typed Contracts

Use the same `zod` schema to:

- validate route requests;
- infer TypeScript types;
- validate pipeline outputs;
- generate JSON schema for Structured Outputs where supported;
- serialize frontend contracts.

Do not keep separate hand-written schema, type, and validator definitions unless unavoidable.

### 11.5 Dependency Injection

Use constructor or factory injection for testability:

```ts
createChatPipeline({
  retriever,
  ai,
  claimVerifier,
  cache,
  logger,
  clock,
});
```

Do not introduce a large dependency-injection framework.

### 11.6 Testing Strategy

#### Unit tests

- BM25 ranking;
- metadata filtering;
- synonym expansion;
- retrieval confidence;
- score weighting;
- absent-category handling;
- verdict caps;
- citation validation;
- redaction;
- cache keys;
- retry decisions;
- stream frame parsing.

#### Contract tests

- route schemas;
- stream events;
- OpenAI structured-output parsing;
- degraded job-fit response;
- feedback payload.

#### Integration tests

- chat question to cited answer with stubbed OpenAI;
- unsupported chat question to abstention;
- JD to normalized requirements to deterministic score;
- malicious JD to preserved prompt contract;
- model failure to degraded job-fit result;
- split stream frame reconstruction.

#### Eval tests

- retrieval recall;
- groundedness;
- citation support;
- abstention;
- extraction precision and recall;
- score calibration;
- prompt injection resistance.

### 11.7 Cleanup

Consolidate or remove:

- `lib/portfolio-context.ts`;
- `buildPortfolioEvidenceContext()` in `lib/portfolio-evidence.ts`;
- duplicate schema definitions;
- route-local cache implementations;
- route-local OpenAI fetch implementations.

## 12. Final Verdict

### 12.1 Strong Patterns Already Present

Keep these:

1. **Responses API usage.** The repository is already on the correct OpenAI API surface.
2. **Deterministic recruiter score and verdict.** Do not hand candidate scoring back to a model.
3. **Structured Outputs for recruiter stages.** This is the right reliability pattern.
4. **Curated structured portfolio source.** `data/portfolio.ts` is a clean source of truth for this product size.
5. **Degraded deterministic job-fit mode.** Preserve and expand this.
6. **Explicit untrusted-JD prompt rules.** Apply the same rigor to chat.
7. **Evidence IDs.** Strengthen them into claim-level citations rather than removing them.

### 12.2 Biggest Technical Risks

1. Chat transport can silently lose streamed content.
2. Job-fit category scoring can mathematically inflate absent dimensions.
3. Public endpoints expose unbounded spend and abuse risk.
4. Citation filtering can attach valid evidence IDs to unsupported generated prose.
5. Chat answers are grounded by prompt instruction only.
6. Retrieval has no calibrated confidence or abstention policy.
7. There is no eval suite, so model and prompt changes are guesswork.
8. There is no privacy-aware telemetry or JD retention policy.

### 12.3 What Absolutely Should Not Change

- Do not replace deterministic scoring with model judgment.
- Do not discard the curated TypeScript corpus prematurely.
- Do not add a vector database before retrieval evals demonstrate need.
- Do not introduce autonomous agents.
- Do not persist anonymous user memory by default.
- Do not optimize token cost ahead of factual reliability.
- Do not stream unverified factual claims merely to make the interface feel faster.

### 12.4 Hype to Avoid

| Trend | Verdict |
| --- | --- |
| Multi-agent debate for portfolio Q&A | Unnecessary complexity |
| Agentic RAG with recursive search | Unnecessary for a bounded curated corpus |
| Knowledge graph RAG | No justified graph problem exists |
| Dedicated vector DB immediately | Premature |
| Fine-tuning before evals and retrieval fixes | Wrong optimization order |
| Long-term memory for anonymous visitors | Privacy cost without product value |
| Autonomous web research | Conflicts with portfolio-grounding goal |
| Kubernetes and microservices | Operational overhead without scale evidence |

### 12.5 World-Class Implementation

A world-class implementation of this project would feel simple from the outside and disciplined inside:

- visitors ask portfolio questions and receive concise answers with visible source citations;
- unsupported questions receive a useful abstention instead of polished speculation;
- recruiter analyses expose deterministic scores, honest gaps, and auditable evidence;
- prompt injection attempts do not alter the workflow;
- every request carries trace, model, prompt, retrieval, scoring, and corpus versions;
- model changes are promoted only after evals;
- private text is minimized, redacted, and not retained by default;
- traffic spikes are bounded before they become cost incidents;
- retrieval evolves from BM25 to hybrid search only when measurements justify it;
- the system remains one understandable application with a few well-defined services, not a maze of agents.

## Appendix A: OpenAI Documentation Used

The OpenAI developer-docs MCP server was installed during this design task, but a Codex restart is required before its MCP tools become callable in this session. The following official OpenAI documentation pages were used as the fallback source:

1. [Using GPT-5.5](https://developers.openai.com/api/docs/guides/latest-model)
2. [Responses API reference](https://platform.openai.com/docs/api-reference/responses)
3. [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
4. [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state)
5. [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
6. [Prompting](https://developers.openai.com/api/docs/guides/prompting)
7. [Working with evals](https://developers.openai.com/api/docs/guides/evals)
8. [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits)
9. [API overview and request debugging](https://developers.openai.com/api/reference/overview#debugging-requests)
10. [text-embedding-3-large](https://developers.openai.com/api/docs/models/text-embedding-3-large)

## Appendix B: Immediate Engineering Sequence

The first implementation batch should be:

```text
1. Add test framework and streaming fragmentation regression.
2. Fix client stream buffering.
3. Add score regression fixtures and fix applicable-dimension weighting.
4. Add shared config and zod request schemas.
5. Add chat timeout, cancellation, and output token cap.
6. Replace unsafe citation fallback behavior.
7. Bound job-fit cache.
8. Add distributed route limits.
9. Extract shared OpenAI client with request ID logging.
10. Add canonical evidence schema and BM25 retrieval.
```
