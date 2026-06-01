# AkshayGPT Architecture Review

**Audit date:** 2026-05-31  
**Scope:** Repository-level architecture audit of the portfolio chatbot and recruiter job-fit analyzer.  
**Audit basis:** Static inspection of the checked-out codebase plus successful execution of `npm run lint`, `npm run typecheck`, and `npm run build`. No production telemetry, Vercel project settings, OpenAI dashboard settings, or external infrastructure configuration were available in the repository.

## Executive Summary

This repository is a compact Next.js portfolio application with two public AI-backed features:

1. **AkshayGPT chat** retrieves a small set of relevant portfolio sections with deterministic lexical scoring, injects those sections into an OpenAI Responses API system prompt, and streams generated Markdown to the browser.
2. **Recruiter job-fit analysis** sends a pasted job description through a structured LLM normalization step, retrieves portfolio evidence with deterministic lexical scoring, computes a deterministic fit score and verdict, then uses a second structured LLM call to generate recruiter-facing narrative text. It can fall back to deterministic parsing and narrative generation when recoverable model failures occur.

The system is stronger than a typical portfolio chatbot in one important way: the recruiter analyzer does not let the LLM choose its own score or verdict. Evidence extraction, requirement mapping, scoring, score caps, and verdict selection are implemented in application code. The structured output schemas, prompt-injection instructions for pasted job descriptions, output validators, degraded mode, and evidence-ID filtering are meaningful reliability controls.

The system is not enterprise-ready. The chat endpoint has a stream reassembly defect that can silently discard valid content when a JSONL record is split across network chunks. Both AI endpoints are public and have no rate limiting, abuse prevention, authentication, budget guardrails, or request telemetry. The recruiter score engine can inflate category scores when a job description has no requirements in a category. Caching is process-local, inconsistent across horizontally scaled edge instances, and unbounded for job-fit analyses. There is no evaluation suite, automated test suite, trace correlation, persistent observability, semantic retrieval, source-version tracking, or citation UI for ordinary chat.

The appropriate characterization is: **well-structured portfolio prototype with several thoughtful AI reliability patterns, but not a production-grade enterprise AI system.**

## 1. High-Level Architecture

### 1.1 Application Surfaces

The repository exposes three user-facing routes:

| Route | Purpose | Primary implementation |
| --- | --- | --- |
| `/` | Portfolio landing page | `app/page.tsx`, `components/site/home-page.tsx` |
| `/akshaygpt` | Portfolio-grounded conversational assistant | `app/akshaygpt/page.tsx`, `components/chat/akshay-gpt-shell.tsx`, `app/api/chat/route.ts` |
| `/recruiter-fit` | Job-description-to-candidate-fit analyzer | `app/recruiter-fit/page.tsx`, `components/chat/job-fit-analyzer.tsx`, `app/api/job-fit/route.ts` |

The application uses the Next.js App Router. Static portfolio content lives in `data/portfolio.ts` and is reused by the landing page, chat retrieval logic, and job-fit evidence builder.

### 1.2 Overall System Flow

The architecture is a single deployable Next.js application with browser UI components and two server-side edge route handlers:

1. A browser loads a static or server-rendered page.
2. A client component sends JSON to a same-origin API route.
3. The API route loads trusted portfolio content from TypeScript modules.
4. The API route either retrieves relevant portfolio context or constructs job-fit evidence.
5. The API route calls the OpenAI Responses API using the server-side `OPENAI_API_KEY`.
6. The API route returns either a streamed JSONL response (`/api/chat`) or a JSON document (`/api/job-fit`).
7. The browser renders Markdown chat content or structured recruiter-analysis cards.

There is no separate backend service, database, vector store, queue, worker process, or persistent session service in this repository.

### 1.3 Frontend / Backend Interaction

#### AkshayGPT chat

`components/chat/akshay-gpt-shell.tsx:87-185`:

1. Stores the conversation in React component state.
2. Sends the full browser-held conversation plus the new question to `POST /api/chat`.
3. Reads the response stream with `ReadableStreamDefaultReader`.
4. Parses newline-delimited JSON fragments.
5. Incrementally appends `message.content` to the visible bot message.

`app/api/chat/route.ts:175-245`:

1. Validates that an OpenAI key and at least one message exist.
2. Finds the latest user message.
3. Checks a process-local first-turn response cache.
4. Retrieves portfolio context for the latest user message.
5. Calls `https://api.openai.com/v1/responses` with streaming enabled.
6. Converts OpenAI server-sent events into newline-delimited JSON records for the browser.

#### Recruiter job-fit analyzer

`components/chat/job-fit-analyzer.tsx:86-129`:

1. Sends `{ jobDescription }` to `POST /api/job-fit`.
2. Reads one complete JSON response.
3. Renders score bars, evidence mappings, normalized requirements, gaps, screening questions, and analysis mode.

`app/api/job-fit/route.ts:875-1014`:

1. Validates the OpenAI key and job-description size.
2. Checks a hash-keyed process-local cache.
3. Calls the model to normalize the pasted job description into a strict schema.
4. Falls back to deterministic parsing for recoverable model failures or invalid output.
5. Retrieves portfolio evidence and maps requirements to evidence deterministically.
6. Computes category scores, applies caps, and selects a verdict deterministically.
7. Calls the model to produce a recruiter-facing narrative with a strict schema.
8. Falls back to deterministic narrative generation for recoverable failures or invalid output.
9. Filters invalid evidence IDs and requirement IDs from the narrative.
10. Returns the structured analysis.

### 1.4 Request Lifecycles

#### Chat request lifecycle

| Step | Implementation | Notes |
| --- | --- | --- |
| Browser state | `components/chat/akshay-gpt-shell.tsx:45-53` | Conversation exists only in browser memory. |
| Request creation | `components/chat/akshay-gpt-shell.tsx:105-113` | The browser sends prior messages and the latest question. |
| Input trimming | `app/api/chat/route.ts:46-53` | Server retains the last six non-system messages and truncates each to 2,400 characters. |
| Retrieval | `app/api/chat/route.ts:30-36`, `lib/portfolio-retrieval.ts:227-256` | Retrieval uses the latest user message only. |
| LLM call | `app/api/chat/route.ts:203-215` | OpenAI Responses API, `gpt-4o-mini`, streaming enabled. |
| Stream translation | `app/api/chat/route.ts:85-173` | OpenAI SSE is translated into JSONL-like records. |
| Browser rendering | `components/chat/akshay-gpt-shell.tsx:120-155` | Browser reads chunks and updates Markdown-rendered response text. |

#### Job-fit request lifecycle

| Step | Implementation | Notes |
| --- | --- | --- |
| Request validation | `app/api/job-fit/route.ts:884-897` | Empty input rejected; maximum cleaned length is 20,000 characters. |
| Cache lookup | `app/api/job-fit/route.ts:899-903` | SHA-256 of lowercased cleaned JD. |
| LLM normalization | `app/api/job-fit/route.ts:908-931` | Strict JSON schema; deterministic fallback on recoverable failure or invalid shape. |
| Evidence retrieval | `app/api/job-fit/route.ts:933`, `lib/job-fit-engine.ts:200-248` | Top ten lexical evidence units. |
| Requirement mapping | `app/api/job-fit/route.ts:934`, `lib/job-fit-engine.ts:250-281` | Deterministic direct, adjacent, or missing classification. |
| Score calculation | `app/api/job-fit/route.ts:935-936`, `lib/job-fit-engine.ts:338-417` | Deterministic score and verdict. |
| LLM narrative | `app/api/job-fit/route.ts:940-979` | Strict JSON schema; deterministic fallback on recoverable failure or invalid shape. |
| Grounding enforcement | `app/api/job-fit/route.ts:981`, `app/api/job-fit/route.ts:663-693` | Invalid referenced IDs are replaced with valid fallback IDs. |
| Response validation | `app/api/job-fit/route.ts:1000-1005` | Final structural validation before response. |

### 1.5 Authentication Flow

There is **no authentication flow** in the checked-in application.

- `/api/chat` is publicly callable.
- `/api/job-fit` is publicly callable.
- No cookies, sessions, OAuth, API tokens, middleware, role checks, or bot challenges are implemented.
- The OpenAI API key remains server-side because it is read from `process.env.OPENAI_API_KEY` inside route handlers (`app/api/chat/route.ts:176`, `app/api/job-fit/route.ts:876`).

For a public portfolio this may be intentional, but it creates a direct cost-abuse surface.

### 1.6 Data Flow

The source of truth is `data/portfolio.ts`.

| Data class | Source | Consumers |
| --- | --- | --- |
| Work experience | `data/portfolio.ts:139-188` | Landing page, chat context, job-fit evidence |
| Education | `data/portfolio.ts:190-203` | Landing page, chat context, job-fit evidence |
| Projects | `data/portfolio.ts:205-356` | Landing page, chat context, job-fit evidence |
| Skills | `data/portfolio.ts:358-375` | Landing page, chat context |
| Contact information | `data/portfolio.ts:377-382` | Landing page, chat retrieval |
| Profile narratives | `data/portfolio.ts:392-417` | Chat retrieval, job-fit evidence |

Chat context is assembled into text by `lib/portfolio-retrieval.ts`. Recruiter evidence units are assembled by `lib/portfolio-evidence.ts`. Two older or currently unused builders remain in the repository: `lib/portfolio-context.ts` and `buildPortfolioEvidenceContext()` in `lib/portfolio-evidence.ts:116-135`.

### 1.7 External Services

| Service | Evidence | Role |
| --- | --- | --- |
| OpenAI Responses API | `app/api/chat/route.ts:203`, `app/api/job-fit/route.ts:812` | Chat generation and structured job-fit model calls |
| Vercel Analytics | `app/layout.tsx:2`, `app/layout.tsx:55` | Page-level web analytics |
| Vercel hosting | `.vercel/README.txt`, `@vercel/analytics`, project conventions | Deployment target is strongly suggested, but production configuration was not audited |

No other external runtime service is called by the checked-in chatbot implementation.

## 2. LLM Architecture

### 2.1 Models

Both AI routes hard-code `gpt-4o-mini`:

- Chat: `app/api/chat/route.ts:210`
- Job-fit normalization and narrative generation: `app/api/job-fit/route.ts:820`

There is no model configuration layer, environment-specific model routing, fallback model, provider abstraction, model-version pinning, or A/B evaluation mechanism.

### 2.2 Prompt Construction

#### Chat prompt

The base chat prompt is assembled in `app/api/chat/route.ts:9-23`. It instructs the model to:

- answer only from portfolio context and conversation;
- avoid invented dates, metrics, employers, technologies, and outcomes;
- state when portfolio data lacks support;
- prioritize relevant evidence;
- produce readable Markdown.

`buildSystemPrompt()` appends retrieved portfolio context in `app/api/chat/route.ts:30-37`.

#### Job-fit normalization prompt

`app/api/job-fit/route.ts:184-196` instructs the model to treat the pasted JD as untrusted content, ignore embedded instructions, remove filler, deduplicate requirements, distinguish core from secondary requirements, and return JSON only.

#### Job-fit narrative prompt

`app/api/job-fit/route.ts:198-220` instructs the model to use backend-computed facts, preserve the deterministic score and verdict, bind top matches to evidence IDs, bind gaps to requirement IDs, and state hiring trade-offs honestly.

### 2.3 System Prompts

OpenAI Responses API `instructions` are used as the system-level instruction channel:

- Chat: `app/api/chat/route.ts:212`
- Job-fit normalization and analysis: `app/api/job-fit/route.ts:829`

The chat prompt receives trusted local portfolio text after the behavioral instructions. The job-fit prompts receive untrusted JD-derived content in the user input channel rather than concatenating it into `instructions`, which is the correct boundary.

### 2.4 Context Handling

#### Chat

Chat context is intentionally bounded:

- Maximum six recent non-system messages: `app/api/chat/route.ts:5`, `app/api/chat/route.ts:46-53`
- Maximum 2,400 characters per retained message: `app/api/chat/route.ts:52`
- Maximum five retrieved portfolio sections by default: `lib/portfolio-retrieval.ts:227`
- Compact overview always included: `lib/portfolio-retrieval.ts:248-255`

Important limitation: retrieval is based only on the latest user message (`app/api/chat/route.ts:190`, `app/api/chat/route.ts:212`). Follow-up questions such as “what about the second project?” may retrieve poorly because retrieval does not use prior turns or a rewritten standalone query.

#### Job fit

The analyzer bounds raw JD input to 20,000 cleaned characters (`app/api/job-fit/route.ts:22`, `app/api/job-fit/route.ts:892-896`). Its analysis packet includes:

- normalized JD brief;
- deterministic verdict;
- deterministic score breakdown;
- requirement map;
- top retrieved evidence units.

The packet is built in `app/api/job-fit/route.ts:381-415`.

### 2.5 Conversation Memory

There is no durable conversation memory.

- Chat history is browser-local React state: `components/chat/akshay-gpt-shell.tsx:47`
- The browser resends history with each turn: `components/chat/akshay-gpt-shell.tsx:33-43`
- The backend does not persist sessions, summaries, user profiles, or conversation records.
- Refreshing or navigating away clears the conversation.

This is stateless from the server perspective, which simplifies horizontal scaling, but it prevents auditability, feedback linkage, and long-running conversational memory.

### 2.6 Token Management

The implementation uses character limits rather than token accounting.

| Flow | Existing control | Missing controls |
| --- | --- | --- |
| Chat input history | Six messages, 2,400 characters each | No tokenizer-aware budgeting, no request body limit, no maximum latest query length before retrieval, no `max_output_tokens`, no timeout |
| Chat retrieved context | Maximum five sections plus overview | No token budget by section size, no adaptive context packing |
| Job-fit input | Maximum 20,000 cleaned characters | No token-aware limit |
| Job-fit output | `max_output_tokens: 1800` | No separate budgets per normalization vs narrative call |

The chat route can consume more model output than intended because it does not pass `max_output_tokens`.

### 2.7 Streaming Architecture

The chat route implements a proxy stream:

```text
OpenAI SSE stream
  -> app/api/chat/route.ts parses SSE blocks
  -> emits newline-delimited JSON records
  -> browser reads network chunks
  -> browser parses each newline-delimited JSON record
  -> React state appends visible Markdown text
```

Server-side SSE parsing is implemented in `app/api/chat/route.ts:85-173`.

The emitted content type is `application/json` (`app/api/chat/route.ts:241`) even though the body is a stream of separate JSON records. `application/x-ndjson` would describe the payload correctly.

**Critical defect:** the browser parser does not preserve a partial JSON line across `reader.read()` boundaries. It declares `buffer`, but uses it only as the assembled answer text. Each raw network chunk is independently split and parsed (`components/chat/akshay-gpt-shell.tsx:125-153`). A valid JSONL record split between chunks is treated as malformed and silently discarded. Streaming boundaries are arbitrary, so this can cause missing response text in production.

### 2.8 Function / Tool Calling

No OpenAI function calling, Responses API tools, MCP tools, browser tools, or application actions are implemented. The assistant produces text only.

### 2.9 Multi-Agent Orchestration

No multi-agent architecture exists.

The recruiter analyzer is a sequential multi-stage pipeline, not a multi-agent system:

```text
LLM normalization
  -> deterministic retrieval
  -> deterministic mapping and scoring
  -> LLM narrative generation
```

This is appropriate for the current scope. Introducing autonomous agents would add unnecessary failure modes.

## 3. RAG / Knowledge Architecture

### 3.1 Is RAG Implemented?

**Yes, in a lightweight deterministic form.** The chat system retrieves local portfolio sections before generation. It is retrieval-augmented generation, but it is not embedding-based semantic RAG.

The recruiter analyzer also retrieves relevant evidence before narrative generation. Its evidence architecture is more structured and auditable than the chat context architecture.

### 3.2 Embedding Model

No embedding model is used. There are no embedding API calls, embedding libraries, or stored vectors.

### 3.3 Chunking Strategy

#### Chat chunks

`lib/portfolio-retrieval.ts:110-193` materializes approximately 17 logical sections:

- one contact section;
- five profile narrative sections;
- one section per experience item;
- one aggregate skills section;
- one section per project;
- one aggregate education section.

Chunks are manually derived from structured portfolio records. This is a sensible strategy for a small curated corpus.

#### Recruiter evidence units

`lib/portfolio-evidence.ts:42-114` creates approximately 49 finer-grained evidence units:

- experience summaries;
- individual experience impact bullets;
- project summaries;
- individual project highlight bullets;
- profile narratives;
- education records.

Each unit has an ID, claim, source area, capability tags, tool tags, optional metric, and evidence-strength label.

### 3.4 Retrieval Strategy

#### Chat retrieval

`lib/portfolio-retrieval.ts:204-256`:

1. Tokenizes the latest query.
2. Removes hard-coded stop words.
3. Expands terms through hard-coded synonym groups.
4. Scores title matches at `7`, keyword matches at `5`, and body matches at `2`.
5. Multiplies by section priority.
6. Returns the top five positive-scoring sections.
7. Falls back to about, working style, Holman, and skills sections if no score is positive.

#### Job-fit retrieval

`lib/job-fit-engine.ts:200-248`:

1. Builds query text from role summary, requirement labels, tools, stakeholder signals, and seniority signals.
2. Scores evidence using token overlap, per-requirement matching, exact-tool boosts, and strong-evidence boosts.
3. Returns the top ten positive-scoring evidence units.
4. Falls back to up to three strong evidence units if nothing scores positively.

### 3.5 Re-ranking

There is no separate re-ranker. The deterministic lexical score is the only ranking layer.

### 3.6 Metadata Filtering

There is no query-time metadata filter. Metadata affects scoring indirectly:

- Chat sections have `kind`, keywords, and `priority`, but `kind` is not used to filter results.
- Recruiter evidence units include capabilities, tools, source area, metric, and evidence strength. These fields feed lexical scoring but are not exposed as explicit filters.

### 3.7 Citation Handling

#### Chat

Chat responses do not return structured citations. Retrieved chunks are labeled `Evidence 1`, `Evidence 2`, etc. inside the system prompt (`lib/portfolio-retrieval.ts:251-254`), but the model is not required to cite them and the browser does not render source references.

#### Job fit

The recruiter analyzer has partial citation support:

- Requirement-map items include matched evidence IDs: `lib/job-fit-engine.ts:270-279`
- Model-generated top matches must include evidence IDs: `app/api/job-fit/route.ts:103-116`
- Invalid model-provided IDs are filtered or replaced: `app/api/job-fit/route.ts:663-693`
- The UI displays evidence IDs in detailed output: `components/chat/job-fit-analyzer.tsx:537-540`

However, grounding is only referential. The backend verifies that an ID exists, not that the generated text is semantically entailed by the cited evidence.

### 3.8 Vector Database Structure

No vector database exists. Portfolio knowledge is compiled into the application bundle as TypeScript data.

### 3.9 Freshness and Update Strategy

There is no runtime ingestion pipeline. Freshness depends on code edits to `data/portfolio.ts` followed by a deployment.

Missing capabilities:

- source timestamps;
- evidence version IDs;
- content provenance;
- automated resume ingestion;
- CMS integration;
- incremental indexing;
- cache invalidation keyed to corpus version.

### 3.10 Hallucination Prevention

Implemented controls:

| Control | Location | Assessment |
| --- | --- | --- |
| Chat grounding instructions | `app/api/chat/route.ts:10-22` | Useful but prompt-only |
| Curated local corpus | `data/portfolio.ts` | Strong source-quality control |
| JD prompt-injection warnings | `app/api/job-fit/route.ts:184-220` | Good baseline |
| Structured JSON schemas | `app/api/job-fit/route.ts:25-182`, `app/api/job-fit/route.ts:822-827` | Strong structural control |
| Deterministic score and verdict | `lib/job-fit-engine.ts:338-417` | Strong design choice |
| Structural output validators | `app/api/job-fit/route.ts:577-660` | Useful defense in depth |
| Evidence-ID filtering | `app/api/job-fit/route.ts:663-693` | Prevents nonexistent citations |
| Degraded deterministic mode | `app/api/job-fit/route.ts:707-774`, `app/api/job-fit/route.ts:923-979` | Good availability pattern |

Missing controls:

- semantic entailment validation between narrative claims and cited evidence;
- claim-level citations for chat;
- retrieval-confidence thresholds;
- abstention when evidence quality is insufficient;
- prompt-injection detection beyond instructions;
- corpus provenance and source versioning;
- evaluation datasets for groundedness and retrieval recall.

## 4. Accuracy and Reliability Analysis

### 4.1 Highest-Risk Findings

#### AR-1: Chat streaming can silently lose model output

**Severity:** High  
**Location:** `components/chat/akshay-gpt-shell.tsx:125-153`

The browser calls `decoder.decode(value)`, splits only the current raw chunk by newline, and attempts to parse each fragment immediately. Network chunks do not align with JSONL records. A split record is ignored by the catch block and never retried. The visible answer can omit words or passages without reporting an error.

Required fix: maintain a raw transport buffer, append decoded chunks with `{ stream: true }`, parse complete lines only, and retain the final incomplete line until more bytes arrive.

#### AR-2: Missing category requirements can inflate job-fit scores

**Severity:** High  
**Location:** `lib/job-fit-engine.ts:309-319`, `lib/job-fit-engine.ts:355-362`

`weightedScore(items, category)` falls back to all `items` when the requested category has no entries:

```ts
const scoped = category ? items.filter((item) => item.category === category) : items;
const fallback = scoped.length ? scoped : items;
```

As a result, if a JD has no `Domain` requirement, `domainAlignment` becomes the score for all requirements. If it has no `Seniority` requirement, `seniorityFit` also becomes the score for all requirements. Those inflated dimensions contribute 35% of the overall score. The score is therefore not measuring the displayed dimensions faithfully.

Required fix: explicitly define neutral or not-applicable handling. For accuracy-first behavior, compute `null` / `N/A` for absent dimensions and renormalize overall weights over applicable dimensions.

#### AR-3: Chat input schema is not validated at runtime

**Severity:** High  
**Location:** `app/api/chat/route.ts:184-193`

The route trusts a TypeScript cast for untrusted JSON. It does not validate:

- whether `messages` is an array;
- maximum number of submitted messages;
- allowed roles;
- content type;
- per-message submitted size before processing;
- total body size.

The server filters `system` roles during trimming, but malformed objects, extremely large arrays, and non-string content can still trigger errors or excess processing.

#### AR-4: Public AI endpoints have no abuse controls

**Severity:** High  
**Location:** `app/api/chat/route.ts:175`, `app/api/job-fit/route.ts:875`

Any caller can consume OpenAI spend. The job-fit route can invoke two model calls per request. There is no IP-based limiter, user quota, request throttling, challenge, budget cap, or upstream gateway policy represented in code.

#### AR-5: Job-fit citation enforcement can preserve hallucinated prose

**Severity:** Medium-High  
**Location:** `app/api/job-fit/route.ts:663-693`

`enforceNarrativeGrounding()` validates IDs, not claims. If the LLM writes an unsupported top-match statement and attaches an invalid ID, the backend swaps in a valid fallback ID without changing the unsupported text. This creates a citation laundering risk: the UI can display a valid evidence ID next to text that the cited evidence does not support.

Required fix: generate top-match text deterministically from mapped claims or run entailment validation and reject unsupported narrative items.

### 4.2 Potential Hallucination Points

| Point | Risk | Existing mitigation | Remaining issue |
| --- | --- | --- | --- |
| Chat response generation | Model may infer unsupported experience from nearby context | Grounding prompt | No claim-level citations or post-generation validation |
| Chat fallback retrieval | Generic overview and strongest profile sections are injected for unrelated queries | Hard-coded fallback | Model can answer broad unrelated questions with portfolio-shaped prose instead of abstaining |
| JD normalization | Malicious or noisy JD may distort extracted requirements | Untrusted-content prompt, strict schema | No deterministic cross-check that extracted requirements are entailed by source JD |
| Job-fit requirement mapping | Lexical overlap and aliases may overstate relevance | Direct/adjacent thresholds, deterministic logic | No calibrated evaluation; aliases can turn loose overlap into direct evidence |
| Job-fit narrative | Model can overstate supported experience | Score/verdict locked, evidence IDs required | Narrative semantic entailment is not checked |
| Profile narratives | Self-authored narrative claims are treated as evidence | Curated local data | No source provenance or distinction between verified metric and positioning statement |

### 4.3 Prompt Injection Risks

#### Chat

The latest user input remains in the user-message channel, which is good. However:

- the chat system prompt does not explicitly label user instructions as untrusted;
- there is no injection detector;
- there is no response policy validator;
- user-supplied prior assistant messages are accepted from the browser and forwarded after trimming.

A caller can fabricate assistant history to steer later responses because the backend does not own conversation state.

#### Recruiter analyzer

This path is better defended:

- the prompts explicitly describe JD text and requirement labels as untrusted;
- the JD is passed as user content;
- structured schemas constrain output shape;
- deterministic scoring limits narrative control.

Remaining weakness: the model-normalized requirement labels feed deterministic retrieval and scoring. A successful injection or extraction error in normalization can indirectly alter the score.

### 4.4 Weak Retrieval Patterns

1. Chat retrieval uses only the latest message, not conversational context.
2. Retrieval is based on token overlap and small hard-coded synonym lists.
3. Chat retrieval has no score threshold calibrated against irrelevant queries beyond `score > 0`.
4. Job-fit retrieval selects a global top ten before mapping each requirement, so dominant common terms can crowd out evidence for a less common but decision-critical requirement.
5. No retrieval debug telemetry records selected chunks, score distributions, missed chunks, or query classes.
6. No offline retrieval-recall test corpus exists.

### 4.5 Missing Validation Layers

- Runtime request schema validation for chat.
- Runtime request schema validation library for job fit; it manually validates selected fields but does not centralize API contracts.
- Semantic validation that normalized requirements are supported by the pasted JD.
- Semantic validation that recruiter narrative claims are supported by evidence IDs.
- Chat response groundedness validation.
- URL allowlisting for model-rendered Markdown links.
- Application-level budget and rate controls.

### 4.6 Failure Cases

| Failure | Current behavior | Assessment |
| --- | --- | --- |
| Missing OpenAI key | Returns HTTP 500 with configuration message | Acceptable for local development; leaks deployment configuration detail publicly |
| Chat OpenAI 429 | Attempts friendly message only if error body is not parseable | Inconsistent error normalization |
| Chat upstream timeout | No explicit timeout | Request can remain open until platform or upstream timeout |
| Chat split JSONL record | Browser silently discards fragment | High-risk correctness defect |
| Job-fit recoverable model timeout/network error | Deterministic fallback | Good |
| Job-fit OpenAI 429 | Usually rethrows and returns 429 if friendly text contains `rate-limited` | Acceptable but not degraded |
| Invalid structured model result | Deterministic fallback | Good |
| Job-fit cache growth | Continues retaining entries for instance lifetime | Memory risk |
| Edge instance restart | In-memory caches disappear | Expected but inconsistent |

### 4.7 Race Conditions and Concurrency

- The UI prevents concurrent chat submissions with `isAnswering`, but direct API callers are unrestricted.
- Duplicate simultaneous cache misses can each trigger an OpenAI request because there is no in-flight request coalescing.
- The process-local `Map` caches are not shared across edge instances.
- `Date.now()` is used for UI message IDs (`components/chat/akshay-gpt-shell.tsx:94`, `components/chat/akshay-gpt-shell.tsx:126`); collisions are unlikely in the current serialized UI flow but avoidable with `crypto.randomUUID()`.
- Chat cache insertion occurs only when the stream completes. This is reasonable, but aborted client connections may still allow upstream consumption without a client-cancellation propagation strategy.

## 5. Scalability Architecture

### 5.1 Queueing

No queue exists. Requests synchronously call OpenAI from edge route handlers.

This is acceptable for interactive chat but limits resilience for expensive recruiter analyses. There is no buffering, retry queue, priority lane, dead-letter mechanism, or background evaluation flow.

### 5.2 Caching

#### Chat cache

`app/api/chat/route.ts:5-7`, `app/api/chat/route.ts:56-73`, `app/api/chat/route.ts:195-201`:

- process-local `Map`;
- maximum 24 responses;
- first-turn requests only;
- normalized key truncated to 240 characters;
- insertion-order eviction;
- no TTL in application memory;
- cached HTTP responses advertise `private, max-age=60`.

Risks:

- key collisions after 240 characters;
- stale content after portfolio updates;
- edge-instance inconsistency;
- no corpus-version key;
- no observability for hit ratio.

#### Job-fit cache

`app/api/job-fit/route.ts:21`, `app/api/job-fit/route.ts:899-903`, `app/api/job-fit/route.ts:1007`:

- process-local `Map`;
- SHA-256 key of normalized JD;
- no maximum size;
- no TTL;
- stores full analysis, including normalized JD text.

Risks:

- unbounded memory growth;
- retained sensitive JD content;
- no portfolio-version invalidation;
- no cross-instance sharing;
- no hit-ratio telemetry.

### 5.3 Parallelization

The job-fit pipeline is sequential by necessity:

```text
normalize JD -> retrieve/map/score -> generate narrative
```

No independent tasks are currently parallelized. This is reasonable. Optimizing latency should focus on reducing model round trips or conditionally skipping narrative generation, not adding uncontrolled concurrency.

### 5.4 Rate Limiting

No application-level rate limiting exists. This is the most important scalability and cost-control gap.

### 5.5 Database Bottlenecks

There is no database. The current corpus is small enough for in-memory scans.

If persistent analytics, sessions, feedback, cache sharing, or a larger corpus are added, a storage design will be required. The present system should not introduce a vector database merely for its current small curated portfolio corpus.

### 5.6 Stateless / Stateful Concerns

The API routes are mostly stateless, but each route contains stateful in-memory caches. On edge infrastructure:

- caches are instance-local;
- cache contents are not durable;
- cache hit rates vary by traffic routing;
- memory lifetime is platform-dependent;
- horizontally scaled instances can return results generated from different cache generations.

### 5.7 Horizontal Scaling Readiness

Compute scales horizontally because requests do not require session affinity. However, enterprise-grade horizontal readiness is incomplete because:

- cache behavior is nondeterministic across instances;
- rate limits are absent;
- there is no shared trace store;
- there is no shared feedback store;
- no idempotency or in-flight deduplication exists;
- no centralized budget control exists.

### 5.8 Cost Optimization Observations

Accuracy is the priority, but avoidable cost still matters:

1. Chat has no output-token cap.
2. Job fit always uses two model calls on a cache miss.
3. Duplicate concurrent requests are not coalesced.
4. Cache invalidation is not tied to portfolio version.
5. No request-level usage logging exists, so token cost cannot be attributed to route, query, or result quality.
6. `gpt-4o-mini` is hard-coded, preventing evaluated model routing.

## 6. Observability and Evaluation

### 6.1 Logging Strategy

The only application logs are `console.warn()` statements for degraded job-fit analysis:

- `app/api/job-fit/route.ts:792-795`
- `app/api/job-fit/route.ts:921`
- `app/api/job-fit/route.ts:964`

There is no structured logging schema, request ID, trace ID, route latency log, token-usage log, retrieval log, model-response metadata log, or cache metric.

### 6.2 Tracing

No distributed tracing or LLM tracing is implemented.

Missing trace spans:

- browser request;
- API handler;
- cache lookup;
- retrieval;
- normalization model call;
- scoring;
- narrative model call;
- stream duration;
- upstream error;
- degraded-mode activation.

### 6.3 Monitoring

No operational monitoring is represented in code. Vercel Analytics is integrated for web analytics (`app/layout.tsx:55`), but that is not sufficient for API reliability monitoring.

Missing monitors:

- request rate;
- OpenAI error rate;
- model latency percentiles;
- stream completion rate;
- degraded-mode rate;
- cache hit rate;
- token usage;
- estimated spend;
- 4xx / 5xx rate;
- job-fit score distribution drift.

### 6.4 Analytics

`@vercel/analytics` is installed and mounted. No custom product events are recorded for:

- chat started;
- suggested prompt used;
- chat completed;
- chat errored;
- job fit requested;
- job fit degraded;
- recruiter details expanded;
- result copied;
- user feedback submitted.

### 6.5 LLM Evaluation Approach

No evaluation framework exists.

There are no:

- golden chat questions;
- expected retrieved sections;
- adversarial prompt-injection fixtures;
- groundedness checks;
- JD normalization fixtures;
- score-engine unit tests;
- regression snapshots;
- model comparison harnesses;
- human-review rubrics.

### 6.6 Response Quality Measurement

No quality measurement exists. The system cannot quantify:

- answer correctness;
- citation correctness;
- retrieval recall;
- abstention quality;
- job-fit score calibration;
- false-positive direct matches;
- false-negative evidence misses;
- recruiter usefulness.

### 6.7 User Feedback Loop

No thumbs-up/down, free-text feedback, issue reporting, or result-quality capture exists.

### 6.8 Error Tracking

No Sentry, Datadog, OpenTelemetry exporter, or equivalent error tracker is configured. Browser errors and API exceptions are visible only to the current user or platform logs.

## 7. Security Review

### 7.1 Secrets Handling

Positive observations:

- `OPENAI_API_KEY` is server-side only.
- `.env.local` is gitignored: `.gitignore:9`.
- `.env.example` contains a placeholder, not a credential.
- The audited tracked-file list includes `.env.example` but not `.env.local`.

Remaining gaps:

- no documented secret rotation process;
- no environment validation at startup;
- public error messages disclose that `OPENAI_API_KEY` is the missing deployment configuration;
- no per-environment key separation is represented in code.

### 7.2 API Key Exposure Risks

The key is not directly exposed to the browser. The primary risk is indirect spend abuse through public proxy endpoints.

### 7.3 Prompt Injection Protection

The recruiter analyzer includes useful injection-resistant instructions (`app/api/job-fit/route.ts:187-188`, `app/api/job-fit/route.ts:202-203`). The ordinary chatbot lacks equally explicit untrusted-input language.

Neither route has:

- injection classification;
- policy enforcement after generation;
- content isolation with source delimiters and source metadata;
- automated adversarial tests.

### 7.4 Data Privacy

The public chat uses portfolio data intended for publication. The job-fit analyzer accepts arbitrary pasted JDs, which may include recruiter contact details, confidential company information, or internal hiring notes.

Privacy concerns:

- raw JD content is sent to OpenAI;
- cleaned JD content is included in API responses;
- complete results are retained in an unbounded in-memory cache;
- there is no consent notice in the API layer;
- there is no retention policy;
- there is no redaction pass;
- there is no data-classification policy.

### 7.5 PII Handling

No PII detection or redaction exists. Portfolio contact details are intentionally public in `data/portfolio.ts:377-382`. Pasted JD PII is not filtered.

### 7.6 Access Control

No access control exists. This is acceptable only if the endpoints remain deliberately public and are protected with abuse controls.

### 7.7 Vulnerability Observations

#### Positive controls

`next.config.mjs:4-28` configures:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restrictive `Permissions-Policy`

#### Missing controls

- Content Security Policy;
- Strict Transport Security represented in application config;
- explicit maximum request body policy;
- API rate limiting;
- bot protection;
- URL allowlisting for generated Markdown links;
- dependency vulnerability audit in the checked-in workflow;
- CI security scanning;
- structured audit logs.

The Markdown renderer uses `react-markdown` with raw HTML disabled by default, which reduces direct HTML injection risk (`components/chat/bot-message-markdown.tsx:14-82`). Links still deserve explicit protocol allowlisting as defense in depth.

## 8. Performance Review

### 8.1 Latency Bottlenecks

#### Chat

Primary latency:

1. lexical retrieval scan over a small local corpus;
2. one OpenAI Responses API call;
3. streamed browser rendering.

Local retrieval is negligible. OpenAI time-to-first-token dominates.

#### Job fit

Primary latency:

1. normalization model call;
2. local retrieval, mapping, and scoring;
3. narrative model call.

The two model calls are sequential. Each is bounded by a 12-second timeout (`app/api/job-fit/route.ts:23`, `app/api/job-fit/route.ts:808-871`), so worst-case model wait can approach 24 seconds before response overhead.

### 8.2 Slow Queries

There are no database queries. Local scans are small.

### 8.3 Excessive Token Usage

Potential sources:

- chat lacks `max_output_tokens`;
- chat context uses fixed section count rather than token-aware packing;
- every job-fit cache miss includes the normalized brief, requirement map, and up to ten evidence units in a second model call;
- job-fit model calls share a single 1,800 output-token cap even though normalization and narrative shapes have different needs.

### 8.4 Unnecessary LLM Calls

The second job-fit LLM call is primarily prose generation. Since deterministic fallback prose already exists, a production design could:

- return deterministic analysis immediately;
- generate enhanced narrative only when needed;
- use cached narrative keyed by JD hash, evidence corpus version, prompt version, and model version;
- measure whether the enhanced narrative improves recruiter outcomes enough to justify latency.

### 8.5 Context Inefficiencies

- Chat retrieval ignores prior conversation when selecting context.
- Chat sends recent assistant output back to the model without token-aware summarization.
- The compact chat overview is always injected even when the selected evidence already answers the query.
- Job-fit analysis sends full claims for up to ten evidence units even when fewer units support the mapped requirements.

### 8.6 Retrieval Inefficiencies

Current corpus scans are efficient enough. The larger issue is retrieval quality, not CPU time.

Do not add a vector database solely for performance at this corpus size. If the corpus expands, implement hybrid retrieval with lexical search, embeddings, metadata filters, and per-requirement evidence selection.

## 9. Current Tech Stack

### 9.1 Frameworks and Libraries

| Category | Technology | Evidence |
| --- | --- | --- |
| Web framework | Next.js 15 App Router | `package.json:18`, `app/` |
| UI runtime | React 19 | `package.json:19-20` |
| Language | TypeScript | `tsconfig.json`, `package.json:34` |
| Styling | Tailwind CSS 3 | `package.json:33`, `tailwind.config.ts` |
| Markdown | `react-markdown`, `remark-gfm` | `package.json:21-22`, `components/chat/bot-message-markdown.tsx` |
| Icons | `lucide-react` | `package.json:17` |
| CSS helpers | `class-variance-authority`, `clsx`, `tailwind-merge` | `package.json:15-16`, `package.json:23` |

### 9.2 AI SDKs and APIs

| Category | Technology | Evidence |
| --- | --- | --- |
| LLM provider | OpenAI | `app/api/chat/route.ts:203`, `app/api/job-fit/route.ts:812` |
| API style | Direct `fetch()` to OpenAI Responses API | Same locations |
| Model | `gpt-4o-mini` | `app/api/chat/route.ts:210`, `app/api/job-fit/route.ts:820` |
| AI SDK | None | No OpenAI SDK or orchestration library dependency |

### 9.3 Data and Infrastructure

| Category | Current state |
| --- | --- |
| Primary data source | Compiled TypeScript portfolio records |
| Relational database | None |
| Document database | None |
| Vector database | None |
| Cache system | Process-local JavaScript `Map` objects |
| Queue system | None |
| Authentication | None |
| Monitoring | No operational monitoring configured in code |
| Analytics | Vercel Analytics |
| Hosting provider | Vercel is strongly suggested by repository artifacts, but production deployment settings were not audited |

## 10. Architecture Diagram

```text
                                  +-----------------------------+
                                  |       Browser / User        |
                                  +--------------+--------------+
                                                 |
                +--------------------------------+--------------------------------+
                |                                                                 |
                v                                                                 v
 +------------------------------+                                  +------------------------------+
 | /akshaygpt                   |                                  | /recruiter-fit               |
 | AkshayGptShell client state  |                                  | JobFitAnalyzer client state  |
 | - in-memory conversation     |                                  | - pasted JD                  |
 | - JSONL stream reader        |                                  | - structured result renderer |
 +---------------+--------------+                                  +---------------+--------------+
                 | POST /api/chat                                                   | POST /api/job-fit
                 v                                                                  v
 +------------------------------+                                  +------------------------------+
 | Chat Edge Route              |                                  | Job-Fit Edge Route           |
 | app/api/chat/route.ts        |                                  | app/api/job-fit/route.ts     |
 | - request parsing            |                                  | - input validation           |
 | - six-message history trim   |                                  | - SHA-256 cache lookup       |
 | - first-turn local cache     |                                  | - degraded-mode control      |
 +---------------+--------------+                                  +------+-----------------------+
                 |                                                        |
                 v                                                        v
 +------------------------------+                           +------------------------------+
 | Lexical Chat Retrieval       |                           | Structured LLM Normalization |
 | lib/portfolio-retrieval.ts   |                           | - strict JSON schema         |
 | - tokenize / stop words      |                           | - untrusted-JD prompt rules  |
 | - synonym expansion          |                           +--------------+---------------+
 | - weighted section ranking  |                                          |
 +---------------+--------------+                                          v
                 |                                           +------------------------------+
                 |                                           | Deterministic Job-Fit Engine |
                 |                                           | lib/job-fit-engine.ts        |
                 |                                           | - lexical evidence retrieval |
                 |                                           | - requirement mapping        |
                 |                                           | - score caps and verdict     |
                 |                                           +--------------+---------------+
                 |                                                          |
                 |                                                          v
                 |                                           +------------------------------+
                 |                                           | Structured LLM Narrative     |
                 |                                           | - strict JSON schema         |
                 |                                           | - score/verdict locked       |
                 |                                           | - evidence IDs required      |
                 |                                           +--------------+---------------+
                 |                                                          |
                 |                                                          v
                 |                                           +------------------------------+
                 |                                           | Grounding ID Filter          |
                 |                                           | - valid evidence IDs only    |
                 |                                           | - valid requirement IDs only |
                 |                                           +--------------+---------------+
                 |                                                          |
                 +------------------------------+---------------------------+
                                                |
                                                v
                                  +-----------------------------+
                                  | OpenAI Responses API        |
                                  | model: gpt-4o-mini          |
                                  +-----------------------------+

 Trusted local knowledge source used by both flows:

 +-----------------------------+
 | data/portfolio.ts           |
 | - experience               |
 | - projects                 |
 | - skills                   |
 | - education                |
 | - profile narratives       |
 | - contact details          |
 +-------------+---------------+
               |
       +-------+------------------------+
       |                                |
       v                                v
 +---------------------------+   +----------------------------+
 | Chat portfolio sections   |   | Job-fit evidence units     |
 | lib/portfolio-retrieval.ts|   | lib/portfolio-evidence.ts  |
 +---------------------------+   +----------------------------+
```

## 11. Production Readiness Score

Scores use a 0-10 scale, where `10` means enterprise-grade controls are implemented, tested, observable, and operationally mature.

| Dimension | Score | Rationale |
| --- | ---: | --- |
| Architecture maturity | **4.5 / 10** | Clear small-system boundaries and a thoughtful deterministic job-fit pipeline, but no service-level operational architecture, configuration layer, persistent stores, or formal contracts. |
| Scalability | **3.0 / 10** | Stateless request handling is a good base. Public endpoints, no limiter, no shared cache, unbounded job-fit cache, no request coalescing, and no queueing prevent production confidence. |
| Reliability | **4.0 / 10** | Job-fit degraded mode and structured schemas are strong prototype controls. Chat stream loss, absent timeouts, weak runtime validation, and no tests are material risks. |
| Security | **3.0 / 10** | API key remains server-side and baseline headers exist. Public spend proxying, missing rate limits, missing CSP, JD privacy exposure, and no redaction or audit logging are significant. |
| Accuracy | **5.0 / 10** | Curated corpus, deterministic job-fit scoring, and evidence IDs are solid foundations. Score inflation, lexical-only retrieval, no entailment validation, and no evaluation corpus cap accuracy maturity. |
| Maintainability | **5.5 / 10** | Code is readable, typed, and sensibly modular for its size. Hard-coded prompts, aliases, model names, manual validators, duplicate/unused builders, and no tests will slow reliable evolution. |

**Overall production-readiness assessment:** **4.2 / 10**

This is a credible portfolio-grade implementation. It should not be treated as an enterprise-grade candidate-evaluation system until the scoring defect, streaming defect, abuse controls, privacy posture, evaluation suite, and observability gaps are addressed.

## 12. Most Important Improvements

Priority legend:

- **P0:** fix before relying on the feature in production.
- **P1:** required for a serious public production release.
- **P2:** required for enterprise-grade reliability and maintainability.
- **P3:** valuable optimization after correctness controls exist.

| Rank | Improvement | Impact | Complexity | Priority | Why it matters |
| ---: | --- | --- | --- | --- | --- |
| 1 | Fix browser JSONL stream reassembly in `components/chat/akshay-gpt-shell.tsx:125-153` | Very high | Low | P0 | Current parsing can silently discard valid model text whenever a record crosses a network chunk boundary. |
| 2 | Fix absent-category scoring in `lib/job-fit-engine.ts:309-319` and renormalize weights over applicable dimensions | Very high | Medium | P0 | Domain and seniority scores can be inflated by unrelated requirements, making the recruiter score mathematically misleading. |
| 3 | Add distributed rate limiting and spend guardrails to both AI routes | Very high | Medium | P0 | The public routes proxy OpenAI spend with no quota or abuse resistance; job fit costs up to two model calls per cache miss. |
| 4 | Add runtime request schemas and hard body limits, especially for `POST /api/chat` | High | Medium | P0 | TypeScript casts do not validate public JSON. Bound array length, role values, message text, per-message length, total body size, and content type. |
| 5 | Replace ID-only narrative grounding with claim-level support enforcement | Very high | High | P1 | `enforceNarrativeGrounding()` can attach valid fallback evidence IDs to unsupported prose. Generate critical bullets deterministically or verify entailment. |
| 6 | Build an automated evaluation suite for chat retrieval, grounded answers, JD normalization, prompt injection, and score calibration | Very high | High | P1 | Without golden tests, accuracy regressions and scoring drift are invisible. Include adversarial JDs and irrelevant chat prompts. |
| 7 | Add structured observability for latency, OpenAI usage, model errors, degraded mode, retrieval scores, cache hits, and request IDs | High | Medium | P1 | Current `console.warn()` logging cannot support incident response, spend analysis, or quality debugging. |
| 8 | Replace the unbounded job-fit `Map` cache with a bounded TTL cache and explicit retention policy | High | Low-Medium | P1 | The current cache retains full JD analyses indefinitely for the edge-instance lifetime and can grow without limit. |
| 9 | Add JD privacy controls: disclosure, redaction, retention limits, and safe logging rules | High | Medium | P1 | Recruiters may paste confidential text or PII. Raw JD content is sent upstream and retained in memory. |
| 10 | Add a chat upstream timeout, client-cancellation propagation, and normalized error mapping | High | Medium | P1 | Chat has no explicit timeout and can hold open expensive upstream requests after the browser no longer needs them. |
| 11 | Retrieve evidence per requirement before global ranking in `lib/job-fit-engine.ts` | High | Medium | P1 | A global top-ten shortlist can crowd out evidence for niche but critical requirements, creating false gaps. |
| 12 | Add claim-level chat citations and an abstention policy based on retrieval confidence | High | Medium-High | P1 | Prompt-only grounding is insufficient for factual reliability. Users should see which portfolio source supports each material claim. |
| 13 | Make model, prompt, corpus, and scoring versions explicit and include them in cache keys and telemetry | High | Medium | P2 | Current cache entries can survive logic or content changes within an instance, and results cannot be reproduced or compared reliably. |
| 14 | Add conversational query rewriting or retrieval over recent turns for chat follow-ups | Medium-High | Medium | P2 | Retrieval uses only the latest user message, so pronouns and follow-up questions can select the wrong context. |
| 15 | Introduce hybrid retrieval only when corpus scope expands: lexical + embeddings + metadata filters + optional reranking | Medium-High | High | P2 | Current lexical search is appropriate for the tiny corpus but will not scale in recall or semantic matching as sources grow. Do not add a vector DB prematurely. |
| 16 | Calibrate lexical alias thresholds and score caps with labeled recruiter examples | High | Medium | P2 | Direct vs adjacent evidence classifications are hand-tuned. Accuracy requires measured precision and recall, not intuition alone. |
| 17 | Add CI with unit tests, API contract tests, streaming fragmentation tests, and security checks | High | Medium | P2 | The build passes, but there are no automated tests. The stream defect is exactly the kind of issue a fragmentation test would catch. |
| 18 | Add a configuration module for model IDs, timeouts, limits, route flags, and corpus version | Medium | Low | P2 | Hard-coded operational parameters are spread across route files, making controlled rollout and environment tuning harder. |
| 19 | Add Content Security Policy and explicit generated-link protocol allowlisting | Medium | Low-Medium | P2 | Existing headers are a good baseline, but model-rendered links and browser policy deserve defense in depth. |
| 20 | Remove or consolidate unused context builders (`lib/portfolio-context.ts`, `buildPortfolioEvidenceContext()`) | Medium | Low | P3 | Parallel context-building implementations create drift risk and make it unclear which representation is authoritative. |

## Appendix A: Concrete Modern AI Patterns Present and Missing

### Present

- Retrieval-augmented chat over curated local data.
- Structured output with strict JSON schemas.
- Deterministic scoring outside the LLM.
- Explicit untrusted-input instructions for pasted JDs.
- Degraded deterministic fallback.
- Evidence IDs and requirement IDs.
- Input-size limit for pasted JDs.
- Server-side secret use.

### Missing

- Token-aware context budgeting.
- Semantic retrieval and hybrid search.
- Query rewriting for conversational retrieval.
- Claim-level citations for chat.
- Entailment checks for narrative citations.
- Prompt and corpus versioning.
- LLM traces and cost attribution.
- Offline and online evaluations.
- Feedback collection.
- Model routing or fallback strategy.
- Distributed rate limiting.
- Persistent, privacy-aware caching.
- Request schema validation.
- Redaction and retention controls.

## Appendix B: Verification Results

The following commands completed successfully during the audit:

```bash
npm run lint
npm run typecheck
npm run build
```

The production build generated static routes for the portfolio surfaces and dynamic edge handlers for:

```text
/api/chat
/api/job-fit
```

No test files, CI workflows, middleware, queue configuration, database configuration, vector-database configuration, or operational monitoring configuration were found in the checked-in repository.
