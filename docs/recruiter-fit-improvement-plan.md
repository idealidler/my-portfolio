# Recruiter-Fit (Job-Fit) Backend Improvement Plan

**Status:** Draft, actionable
**Scope:** `app/api/job-fit/route.ts`, `lib/job-fit-engine.ts`, `lib/job-fit.ts`, `lib/portfolio-evidence.ts`, `lib/server/config/ai-config.ts`
**Related:** [`docs/target-architecture-redesign.md`](./target-architecture-redesign.md) (full-product redesign, this plan is the recruiter-fit-only execution slice of it)

## 0. Done in this pass

- Switched `aiConfig.jobFit.model` to `gpt-5.6-luna` (the same model AkshayGPT chat uses).
- Added `reasoning.effort` (`medium`) and `text.verbosity` (`medium`) to the job-fit Responses API calls; `gpt-5.6-luna` supports `medium` reasoning effort.
- Raised `modelTimeoutMs` from 12s → 20s because reasoning models have higher tail latency than `gpt-4o-mini`, and job-fit already has two sequential model calls (normalize + narrative) that must each complete inside the request.

Follow-up needed: watch p95 latency in production logs (`request.completed` / `analysis.degraded` log events) after this ships — if 20s is still too tight or too loose, tune it based on real data rather than guessing again.

## 1. Why matching accuracy is currently capped

The pipeline shape is already good (deterministic retrieval → deterministic scoring → LLM narrative), but three things limit accuracy today:

1. **Global-then-local retrieval.** `retrieveRelevantEvidence()` in [`lib/job-fit-engine.ts`](../lib/job-fit-engine.ts) ranks all evidence against the *whole* JD query and returns a single top-10 list before `mapRequirementsToEvidence()` scores each requirement against that list. A requirement that's real but lexically rare (e.g. a niche tool) can be pushed out of the top 10 by generic terms from a more common requirement, so it looks like "No clear evidence" even though matching evidence exists in the full 49-unit corpus.
2. **Hand-maintained alias/heuristic scoring.** `skillAliases`, `stopWords`, and the point-based `scoreEvidenceForRequirement` in `lib/job-fit-engine.ts` are a manually curated lexical model. It works, but it silently misses any skill/tool not in the alias table and doesn't scale as the JD corpus or portfolio grows.
3. **Grounding can mask true gaps.** `enforceNarrativeGrounding()` in `app/api/job-fit/route.ts` replaces an invalid `evidenceId`/`requirementId` from the model with a *fallback* ID rather than dropping/flagging the claim. This keeps the UI from crashing, but it can make an ungrounded LLM claim look cited.

## 2. P0 — do next (highest impact on match accuracy)

### 2.1 Per-requirement retrieval instead of one global shortlist
Retrieve evidence **per normalized requirement**, not once globally, then union the results for narrative context.

```ts
// lib/job-fit-engine.ts
export function retrieveEvidenceForRequirement(
  requirement: NormalizedJobRequirement,
  allEvidence: PortfolioEvidenceUnit[],
  limit = 5,
) {
  return allEvidence
    .map((evidence) => ({ evidence, score: scoreEvidenceForRequirement(requirement, evidence) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

`mapRequirementsToEvidence()` already scores per-requirement — the fix is to stop bottlenecking it through a pre-filtered top-10 global list from `retrieveRelevantEvidence()`. Feed it `allPortfolioEvidenceUnits` directly (49 units is cheap to score in full), and use the per-requirement union (deduped) as `retrievedEvidence` for the narrative step instead of the global ranking.

**Impact:** removes false "No clear evidence" gaps caused by requirement crowding — directly improves `requirementMap` accuracy, which is the source of truth for score, verdict, and gaps.

### 2.2 Replace ad hoc alias scoring with a small weighted-field lexical index (BM25-lite)
Keep it deterministic and in-process (corpus is tiny), but replace the flat point-scoring (`+2`, `+8`, `+5`) with field-weighted term matching so exact tool/company/metric matches outrank generic word overlap consistently:

| Field | Weight |
| --- | ---: |
| `tools` | 3.0 |
| `capabilities` | 2.5 |
| `sourceArea` | 2.0 |
| `claim` | 1.0 |

Keep `skillAliases` as explicit query expansion (already reasonable for a ~49-unit corpus) rather than removing it — just don't let it be the only signal.

**Impact:** more consistent, explainable ranking; easier to unit test with golden JD fixtures (see 2.4).

### 2.3 Stop silently re-grounding invalid citations
In `enforceNarrativeGrounding()`, when a model-produced `evidenceIds`/`requirementId` is invalid, don't substitute a fallback ID and keep the sentence as-is — either:
- drop that bullet and regenerate it from `buildFallbackNarrative()`'s deterministic template for that one item, or
- flag it in `analysisMeta.notes` so the UI can show "directional" instead of "evidence-backed" for that specific claim.

**Impact:** prevents a recruiter from trusting a citation that doesn't actually support the sentence next to it — this is the single biggest trust risk in the current design.

### 2.4 Golden JD regression fixtures
Add a small fixture set (5–10 real-style JDs spanning: strong fit, moderate fit, senior/stretch, clear gap, adversarial/prompt-injection JD) with expected verdict ranges and required requirement classifications. Run these in CI against `computeScore` + `mapRequirementsToEvidence` (pure functions, no model calls needed) so retrieval/scoring changes can't silently regress matching quality.

**Impact:** turns "trust me it's better" into a testable claim every time the engine changes.

## 3. P1 — next after P0

- **Rate limiting parity.** `app/api/job-fit/route.ts` has no request-rate limiting today (`enforceChatRateLimit` exists for chat in `lib/server/chat/rate-limit.ts` but isn't reused here). Add the same limiter to job-fit since it's a more expensive route (2 model calls/request).
- **Per-call retries.** A single transient failure in either the normalization or narrative call currently falls straight to the deterministic fallback. One bounded retry (e.g. 1 retry, short backoff) before falling back would recover more "model" (evidence-backed) responses instead of degrading to "directional" on blips.
- **Metadata filters.** Let JD `category` (Tool/Capability/Stakeholder/Domain/Seniority/Constraint) prioritize matching evidence fields — e.g. `Tool` requirements should weight `evidence.tools` higher, `Stakeholder` requirements should weight `capabilities` mentioning stakeholder/communication higher. Cheap win on top of 2.2.
- **Cache key robustness.** Current cache key is an exact-text SHA-256 hash (`hashText(cleanedJobDescription.toLowerCase())`), so near-duplicate pastes (extra whitespace, trailing "Apply now" boilerplate) always miss. Normalize more aggressively (collapse whitespace, strip common boilerplate lines) before hashing.

## 4. P2 — later, only if triggered

Deferred until the portfolio evidence corpus meaningfully grows (currently ~49 units) or measured recall problems appear — matches the "Add Later" guidance already in [`docs/target-architecture-redesign.md`](./target-architecture-redesign.md#27-add-later-embedding-retrieval):
- Embedding-based retrieval fused with lexical scores.
- Cross-encoder/LLM reranking of top candidates.

## 5. Suggested execution order

1. 2.1 per-requirement retrieval + 2.2 weighted lexical scoring (same PR, `lib/job-fit-engine.ts` only, no API shape change).
2. 2.4 golden JD fixtures (locks in the win from step 1, prevents regressions).
3. 2.3 citation grounding fix (`app/api/job-fit/route.ts`).
4. P1 items as follow-ups.
