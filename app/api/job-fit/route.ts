import {
  type GroundedGapItem,
  type GroundedMatchItem,
  type JobFitResult,
  type NormalizedJobBrief,
  type RequirementMapItem,
  type ScreeningQuestion,
} from "@/lib/job-fit";
import {
  computeScore,
  mapRequirementsToEvidence,
  retrieveRelevantEvidence,
  verdictFromScore,
} from "@/lib/job-fit-engine";
import { buildPortfolioEvidenceUnits } from "@/lib/portfolio-evidence";

export const runtime = "edge";

const allPortfolioEvidenceUnits = buildPortfolioEvidenceUnits();
const responseCache = new Map<string, JobFitResult>();
const maxJobDescriptionLength = 20000;

const normalizedRequirementSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonicalLabel: { type: "string" },
    sourceText: { type: "string" },
    importance: { type: "string", enum: ["Core", "Secondary"] },
    category: {
      type: "string",
      enum: ["Capability", "Tool", "Stakeholder", "Domain", "Seniority", "Constraint"],
    },
    isExplicit: { type: "boolean" },
    notes: { type: "string" },
  },
  required: ["canonicalLabel", "sourceText", "importance", "category", "isExplicit", "notes"],
} as const;

const normalizedJobBriefSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleSummary: { type: "string" },
    cleanedJobDescription: { type: "string" },
    coreRequirements: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: normalizedRequirementSchema,
    },
    secondaryRequirements: {
      type: "array",
      maxItems: 6,
      items: normalizedRequirementSchema,
    },
    tools: {
      type: "array",
      maxItems: 8,
      items: { type: "string" },
    },
    stakeholderSignals: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
    senioritySignals: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
    constraints: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
    unclearItems: {
      type: "array",
      maxItems: 6,
      items: { type: "string" },
    },
  },
  required: [
    "roleSummary",
    "cleanedJobDescription",
    "coreRequirements",
    "secondaryRequirements",
    "tools",
    "stakeholderSignals",
    "senioritySignals",
    "constraints",
    "unclearItems",
  ],
} as const;

const normalizeJobSchema = {
  name: "normalized_job_brief",
  schema: normalizedJobBriefSchema,
} as const;

const groundedMatchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    evidenceIds: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string" },
    },
  },
  required: ["text", "evidenceIds"],
} as const;

const groundedGapSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    requirementId: { type: "string" },
  },
  required: ["text", "requirementId"],
} as const;

const jobFitNarrativeSchema = {
  name: "job_fit_narrative",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string" },
      topMatches: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: groundedMatchSchema,
      },
      topGaps: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: groundedGapSchema,
      },
      recruiterInsight: {
        type: "object",
        additionalProperties: false,
        properties: {
          differentiator: { type: "string" },
          tradeoff: { type: "string" },
          screeningFocus: { type: "string" },
        },
        required: ["differentiator", "tradeoff", "screeningFocus"],
      },
      screeningRecommendation: { type: "string" },
      screeningQuestions: {
        type: "array",
        minItems: 2,
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            question: { type: "string" },
            whyAsk: { type: "string" },
          },
          required: ["question", "whyAsk"],
        },
      },
    },
    required: [
      "summary",
      "topMatches",
      "topGaps",
      "recruiterInsight",
      "screeningRecommendation",
      "screeningQuestions",
    ],
  },
} as const;

const normalizeJobPrompt = [
  "You are a recruiter-tool preprocessing assistant.",
  "Your job is to turn a noisy pasted job description into a compact, structured hiring brief.",
  "Strip or ignore benefits, company marketing, EEO language, repeated headings, and generic filler unless it affects candidate evaluation.",
  "Prefer explicit requirements over inferred ones.",
  "If something is only loosely implied, keep it conservative and mention that in notes or unclearItems.",
  "Deduplicate overlapping requirements and normalize them into canonical labels.",
  "Core requirements should be the most decision-critical skills or expectations in the JD.",
  "Secondary requirements should be useful but not central.",
  "Return JSON only.",
].join("\n");

const analyzeJobFitPrompt = [
  "You are AkshayGPT, a recruiter-facing candidate evaluation analyst for Akshay Jain.",
  "The backend has already retrieved evidence, mapped requirements, computed scores, and selected the verdict.",
  "Your job is to explain those backend-computed facts clearly for a recruiter.",
  "Never invent experience, seniority, technologies, or scale that are not supported by the evidence units.",
  "Do not create, alter, or mention a different score than the provided backend score.",
  "Do not create, alter, or mention a different verdict than the provided backend verdict.",
  "Use the requirementMap and scoreBreakdown as source-of-truth.",
  "Every topMatches item must include evidenceIds from retrievedEvidence.",
  "Every topGaps item must include a requirementId from requirementMap.",
  "Use missing or adjacent mappings honestly; do not soften gaps into strengths.",
  "Recognize synonyms and related tools conservatively: SQL can transfer across warehouses, Power BI can transfer to BI/reporting roles, Python analytics can transfer to data workflow roles, but do not claim exact tool experience unless evidenced.",
  "topMatches should be exactly 3 specific bullets tied to direct or transferable evidence.",
  "topGaps should be exactly 3 specific bullets. Include missing skills, partial depth, seniority concerns, domain gaps, or uncertainty when relevant.",
  "recruiterInsight.differentiator should explain what stands out beyond keyword overlap, especially problem-solving, business stakeholder partnership, and consultative execution when supported.",
  "recruiterInsight.tradeoff should state the main hiring trade-off honestly.",
  "recruiterInsight.screeningFocus should say what a recruiter should validate in a first call.",
  "screeningQuestions should include 2-3 practical questions that test gaps or depth, not softball questions.",
  "screeningRecommendation must be one concise sentence for a recruiter.",
  "Return JSON only.",
].join("\n");

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match?.[0] ?? null;
}

async function hashText(value: string) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanJobDescription(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function buildAnalysisPacket({
  normalizedBrief,
  retrievedEvidence,
  requirementMap,
  scoreBreakdown,
  verdict,
}: {
  normalizedBrief: NormalizedJobBrief;
  retrievedEvidence: JobFitResult["retrievedEvidence"];
  requirementMap: RequirementMapItem[];
  scoreBreakdown: JobFitResult["scoreBreakdown"];
  verdict: JobFitResult["verdict"];
}) {
  return JSON.stringify(
    {
      backendInstructions:
        "Explain the backend-computed score and verdict. Use only retrievedEvidence IDs and requirementMap IDs.",
      verdict,
      scoreBreakdown,
      normalizedJobBrief: normalizedBrief,
      requirementMap,
      retrievedEvidence: retrievedEvidence.map((evidence) => ({
        id: evidence.id,
        sourceArea: evidence.sourceArea,
        claim: evidence.claim,
        capabilities: evidence.capabilities,
        tools: evidence.tools,
        metric: evidence.metric,
        evidenceStrength: evidence.evidenceStrength,
      })),
    },
    null,
    2,
  );
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const response = payload as Record<string, unknown>;
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  const output = Array.isArray(response.output) ? response.output : [];
  const fragments: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const outputItem = item as Record<string, unknown>;
    const content = Array.isArray(outputItem.content) ? outputItem.content : [];

    for (const part of content) {
      if (!part || typeof part !== "object") {
        continue;
      }

      const contentPart = part as Record<string, unknown>;
      if (typeof contentPart.text === "string") {
        fragments.push(contentPart.text);
      }
    }
  }

  return fragments.join("\n").trim();
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isRequirementMapItem(value: unknown): value is RequirementMapItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  const validCategories = new Set([
    "Capability",
    "Tool",
    "Stakeholder",
    "Domain",
    "Seniority",
    "Constraint",
  ]);
  const validImportance = new Set(["Core", "Secondary"]);
  const validEvidence = new Set(["Direct evidence", "Adjacent evidence", "No clear evidence"]);

  return (
    typeof item.requirementId === "string" &&
    typeof item.requirement === "string" &&
    typeof item.category === "string" &&
    validCategories.has(item.category) &&
    typeof item.importance === "string" &&
    validImportance.has(item.importance) &&
    typeof item.evidenceStrength === "string" &&
    validEvidence.has(item.evidenceStrength) &&
    isStringArray(item.matchedEvidenceIds) &&
    typeof item.matchedEvidence === "string" &&
    typeof item.recruiterNote === "string"
  );
}

function isGroundedMatchItem(value: unknown): value is GroundedMatchItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.text === "string" && isStringArray(item.evidenceIds) && item.evidenceIds.length > 0;
}

function isGroundedGapItem(value: unknown): value is GroundedGapItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.text === "string" && typeof item.requirementId === "string";
}

function isFiniteScore(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

function isScoreBreakdown(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    isFiniteScore(item.overallScore) &&
    isFiniteScore(item.skillsMatch) &&
    isFiniteScore(item.experienceRelevance) &&
    isFiniteScore(item.domainAlignment) &&
    isFiniteScore(item.seniorityFit) &&
    typeof item.scoreRationale === "string"
  );
}

function isRecruiterInsight(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.differentiator === "string" &&
    typeof item.tradeoff === "string" &&
    typeof item.screeningFocus === "string"
  );
}

function isScreeningQuestion(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.question === "string" && typeof item.whyAsk === "string";
}

function isNormalizedRequirement(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  const validCategories = new Set([
    "Capability",
    "Tool",
    "Stakeholder",
    "Domain",
    "Seniority",
    "Constraint",
  ]);
  const validImportance = new Set(["Core", "Secondary"]);

  return (
    typeof item.canonicalLabel === "string" &&
    typeof item.sourceText === "string" &&
    typeof item.importance === "string" &&
    validImportance.has(item.importance) &&
    typeof item.category === "string" &&
    validCategories.has(item.category) &&
    typeof item.isExplicit === "boolean" &&
    typeof item.notes === "string"
  );
}

function validateNormalizedJobBrief(payload: unknown): payload is NormalizedJobBrief {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const brief = payload as Record<string, unknown>;
  return (
    typeof brief.roleSummary === "string" &&
    typeof brief.cleanedJobDescription === "string" &&
    Array.isArray(brief.coreRequirements) &&
    brief.coreRequirements.length > 0 &&
    brief.coreRequirements.every(isNormalizedRequirement) &&
    Array.isArray(brief.secondaryRequirements) &&
    brief.secondaryRequirements.every(isNormalizedRequirement) &&
    isStringArray(brief.tools) &&
    isStringArray(brief.stakeholderSignals) &&
    isStringArray(brief.senioritySignals) &&
    isStringArray(brief.constraints) &&
    isStringArray(brief.unclearItems)
  );
}

function validateJobFitResult(payload: unknown): payload is JobFitResult {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const result = payload as Record<string, unknown>;
  const validVerdicts = new Set(["Strong fit", "Moderate fit", "Stretch", "Not ideal"]);

  return (
    typeof result.verdict === "string" &&
    validVerdicts.has(result.verdict) &&
    isScoreBreakdown(result.scoreBreakdown) &&
    typeof result.summary === "string" &&
    Array.isArray(result.topMatches) &&
    result.topMatches.length === 3 &&
    result.topMatches.every(isGroundedMatchItem) &&
    Array.isArray(result.topGaps) &&
    result.topGaps.length === 3 &&
    result.topGaps.every(isGroundedGapItem) &&
    isRecruiterInsight(result.recruiterInsight) &&
    typeof result.screeningRecommendation === "string" &&
    Array.isArray(result.screeningQuestions) &&
    result.screeningQuestions.length >= 2 &&
    result.screeningQuestions.length <= 3 &&
    result.screeningQuestions.every(isScreeningQuestion) &&
    Array.isArray(result.requirementMap) &&
    result.requirementMap.length >= 1 &&
    result.requirementMap.every(isRequirementMapItem) &&
    Array.isArray(result.retrievedEvidence)
  );
}

type JobFitNarrative = {
  summary: string;
  topMatches: GroundedMatchItem[];
  topGaps: GroundedGapItem[];
  recruiterInsight: JobFitResult["recruiterInsight"];
  screeningRecommendation: string;
  screeningQuestions: ScreeningQuestion[];
};

function validateJobFitNarrative(payload: unknown): payload is JobFitNarrative {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const result = payload as Record<string, unknown>;
  return (
    typeof result.summary === "string" &&
    Array.isArray(result.topMatches) &&
    result.topMatches.length === 3 &&
    result.topMatches.every(isGroundedMatchItem) &&
    Array.isArray(result.topGaps) &&
    result.topGaps.length === 3 &&
    result.topGaps.every(isGroundedGapItem) &&
    isRecruiterInsight(result.recruiterInsight) &&
    typeof result.screeningRecommendation === "string" &&
    Array.isArray(result.screeningQuestions) &&
    result.screeningQuestions.length >= 2 &&
    result.screeningQuestions.length <= 3 &&
    result.screeningQuestions.every(isScreeningQuestion)
  );
}

function enforceNarrativeGrounding(
  narrative: JobFitNarrative,
  requirementMap: RequirementMapItem[],
  retrievedEvidence: JobFitResult["retrievedEvidence"],
) {
  const validEvidenceIds = new Set(retrievedEvidence.map((evidence) => evidence.id));
  const validRequirementIds = new Set(requirementMap.map((item) => item.requirementId));
  const fallbackEvidenceIds = requirementMap.flatMap((item) => item.matchedEvidenceIds);
  const fallbackEvidenceId = fallbackEvidenceIds.find((id) => validEvidenceIds.has(id)) ?? retrievedEvidence[0]?.id;
  const fallbackGapRequirement =
    requirementMap.find((item) => item.evidenceStrength === "No clear evidence") ??
    requirementMap.find((item) => item.evidenceStrength === "Adjacent evidence") ??
    requirementMap[0];

  return {
    ...narrative,
    topMatches: narrative.topMatches.map((item) => {
      const evidenceIds = item.evidenceIds.filter((id) => validEvidenceIds.has(id));
      return {
        ...item,
        evidenceIds: evidenceIds.length ? evidenceIds : fallbackEvidenceId ? [fallbackEvidenceId] : [],
      };
    }),
    topGaps: narrative.topGaps.map((item) => ({
      ...item,
      requirementId: validRequirementIds.has(item.requirementId)
        ? item.requirementId
        : fallbackGapRequirement.requirementId,
    })),
  } satisfies JobFitNarrative;
}

async function callStructuredModel<T>({
  apiKey,
  instructions,
  schema,
  input,
}: {
  apiKey: string;
  instructions: string;
  schema: typeof normalizeJobSchema | typeof jobFitNarrativeSchema;
  input: string;
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_output_tokens: 1800,
      text: {
        format: {
          type: "json_schema",
          strict: true,
          ...schema,
        },
      },
      instructions,
      input: [
        {
          role: "user",
          content: input,
        },
      ],
    }),
  });
  clearTimeout(timeout);

  if (!openAiResponse.ok) {
    const errorText = await openAiResponse.text();
    let message = "The fit analysis request failed.";

    try {
      const parsed = JSON.parse(errorText) as { error?: { message?: string } };
      message = parsed.error?.message ?? message;
    } catch {
      if (openAiResponse.status === 429) {
        message = "Job fit analysis is temporarily rate-limited. Please try again in a moment.";
      }
    }

    throw new Error(message);
  }

  const payload = (await openAiResponse.json()) as unknown;
  const rawText = extractResponseText(payload);
  const jsonText = extractJson(rawText);

  if (!jsonText) {
    throw new Error("The model returned unreadable structured output.");
  }

  return JSON.parse(jsonText) as T;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is missing. Add it to your environment to enable AkshayGPT." },
      { status: 500 },
    );
  }

  try {
    const { jobDescription } = (await request.json()) as { jobDescription?: string };
    const cleanedJobDescription = cleanJobDescription(jobDescription ?? "");

    if (!cleanedJobDescription) {
      return Response.json({ error: "Please paste a job description to analyze." }, { status: 400 });
    }

    if (cleanedJobDescription.length > maxJobDescriptionLength) {
      return Response.json(
        { error: `Please keep the job description under ${maxJobDescriptionLength.toLocaleString()} characters.` },
        { status: 413 },
      );
    }

    const cacheKey = await hashText(cleanedJobDescription.toLowerCase());
    const cached = responseCache.get(cacheKey);
    if (cached) {
      return Response.json({ ...cached, cacheStatus: "hit" });
    }

    const normalizedBrief = await callStructuredModel<NormalizedJobBrief>({
      apiKey,
      instructions: normalizeJobPrompt,
      schema: normalizeJobSchema,
      input: `Normalize this pasted job description into a compact hiring brief:\n\n${cleanedJobDescription}`,
    });

    if (!validateNormalizedJobBrief(normalizedBrief)) {
      return Response.json(
        { error: "The job description normalization step returned an unexpected shape." },
        { status: 502 },
      );
    }

    const retrievedEvidence = retrieveRelevantEvidence(normalizedBrief, allPortfolioEvidenceUnits, 10);
    const requirementMap = mapRequirementsToEvidence(normalizedBrief, retrievedEvidence);
    const scoreBreakdown = computeScore(normalizedBrief, requirementMap);
    const verdict = verdictFromScore(scoreBreakdown);

    const narrative = await callStructuredModel<JobFitNarrative>({
      apiKey,
      instructions: analyzeJobFitPrompt,
      schema: jobFitNarrativeSchema,
      input: buildAnalysisPacket({
        normalizedBrief,
        retrievedEvidence,
        requirementMap,
        scoreBreakdown,
        verdict,
      }),
    });

    if (!validateJobFitNarrative(narrative)) {
      return Response.json(
        { error: "The model returned an unexpected fit narrative shape. Please try again." },
        { status: 502 },
      );
    }

    const groundedNarrative = enforceNarrativeGrounding(narrative, requirementMap, retrievedEvidence);

    const responsePayload = {
      verdict,
      scoreBreakdown,
      ...groundedNarrative,
      requirementMap,
      normalizedJobBrief: normalizedBrief,
      retrievedEvidence,
      cacheStatus: "miss",
    } satisfies JobFitResult;

    if (!validateJobFitResult(responsePayload)) {
      return Response.json(
        { error: "The model returned an unexpected fit analysis shape. Please try again." },
        { status: 502 },
      );
    }

    responseCache.set(cacheKey, responsePayload);

    return Response.json(responsePayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("rate-limited") ? 429 : message.includes("abort") ? 408 : 500;
    return Response.json({ error: message }, { status });
  }
}
