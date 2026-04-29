import {
  type JobFitResult,
  type NormalizedJobBrief,
  type RequirementMapItem,
} from "@/lib/job-fit";
import { buildPortfolioEvidenceContext } from "@/lib/portfolio-evidence";

export const runtime = "edge";

const portfolioEvidenceContext = buildPortfolioEvidenceContext();

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

const jobFitResultSchema = {
  name: "job_fit_result",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      verdict: {
        type: "string",
        enum: ["Strong fit", "Moderate fit", "Stretch", "Not ideal"],
      },
      scoreBreakdown: {
        type: "object",
        additionalProperties: false,
        properties: {
          overallScore: { type: "number", minimum: 0, maximum: 100 },
          skillsMatch: { type: "number", minimum: 0, maximum: 100 },
          experienceRelevance: { type: "number", minimum: 0, maximum: 100 },
          domainAlignment: { type: "number", minimum: 0, maximum: 100 },
          seniorityFit: { type: "number", minimum: 0, maximum: 100 },
          scoreRationale: { type: "string" },
        },
        required: [
          "overallScore",
          "skillsMatch",
          "experienceRelevance",
          "domainAlignment",
          "seniorityFit",
          "scoreRationale",
        ],
      },
      summary: { type: "string" },
      topMatches: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: { type: "string" },
      },
      topGaps: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: { type: "string" },
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
      requirementMap: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            requirement: { type: "string" },
            category: {
              type: "string",
              enum: ["Capability", "Tool", "Stakeholder", "Domain", "Seniority", "Constraint"],
            },
            importance: { type: "string", enum: ["Core", "Secondary"] },
            evidenceStrength: {
              type: "string",
              enum: ["Direct evidence", "Adjacent evidence", "No clear evidence"],
            },
            matchedEvidence: { type: "string" },
            recruiterNote: { type: "string" },
          },
          required: [
            "requirement",
            "category",
            "importance",
            "evidenceStrength",
            "matchedEvidence",
            "recruiterNote",
          ],
        },
      },
    },
    required: [
      "verdict",
      "scoreBreakdown",
      "summary",
      "topMatches",
      "topGaps",
      "recruiterInsight",
      "screeningRecommendation",
      "screeningQuestions",
      "requirementMap",
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
  "Use only the normalized job brief and the portfolio evidence units provided.",
  "Your job is to help a recruiter decide whether Akshay is worth screening, not to sell him uncritically.",
  "Be evidence-first, conservative, concise, and balanced.",
  "Never invent experience, seniority, technologies, or scale that are not supported by the evidence units.",
  "Do not treat tool-name overlap alone as qualification if the evidence does not show meaningful usage.",
  "Do not inflate scores to be polite. Missing direct evidence should lower the relevant component score.",
  "Distinguish direct matches, adjacent/transferable matches, and gaps.",
  "If a core requirement lacks explicit support, say so plainly and factor it into the verdict.",
  "Recognize synonyms and related tools conservatively: SQL can transfer across warehouses, Power BI can transfer to BI/reporting roles, Python analytics can transfer to data workflow roles, but do not claim exact tool experience unless evidenced.",
  "Scoring rules:",
  "- overallScore is a weighted recruiter estimate: skillsMatch 35%, experienceRelevance 30%, domainAlignment 15%, seniorityFit 20%.",
  "- 85-100 means strong direct evidence across nearly all core requirements.",
  "- 70-84 means credible fit with one or two validation areas.",
  "- 50-69 means plausible but meaningfully adjacent or incomplete.",
  "- Below 50 means important core requirements are unsupported.",
  "- Cap overallScore at 84 if any must-have/core requirement has No clear evidence.",
  "- Cap overallScore at 69 if two or more core requirements have No clear evidence.",
  "- Cap overallScore at 59 if the role appears clearly senior/lead/staff and the evidence does not support that level.",
  "Verdict rules:",
  "- Strong fit: direct evidence for most core requirements, no major missing must-have, overallScore normally 85+.",
  "- Moderate fit: strong overlap overall, but at least one area should be validated in screening, overallScore normally 70-84.",
  "- Stretch: some overlap, but multiple core gaps or depth concerns remain.",
  "- Not ideal: limited overlap or several important core requirements lack evidence.",
  "topMatches should be exactly 3 specific bullets tied to direct or transferable evidence.",
  "topGaps should be exactly 3 specific bullets. Include missing skills, partial depth, seniority concerns, domain gaps, or uncertainty when relevant.",
  "recruiterInsight.differentiator should explain what stands out beyond keyword overlap, especially problem-solving, business stakeholder partnership, and consultative execution when supported.",
  "recruiterInsight.tradeoff should state the main hiring trade-off honestly.",
  "recruiterInsight.screeningFocus should say what a recruiter should validate in a first call.",
  "screeningQuestions should include 2-3 practical questions that test gaps or depth, not softball questions.",
  "requirementMap should include the 4-6 highest-signal requirements from the normalized brief.",
  "For evidenceStrength use exactly one of: Direct evidence, Adjacent evidence, No clear evidence.",
  "screeningRecommendation must be one concise sentence for a recruiter.",
  "Return JSON only.",
  "",
  "Portfolio evidence units:",
  portfolioEvidenceContext,
].join("\n");

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match?.[0] ?? null;
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
    typeof item.requirement === "string" &&
    typeof item.category === "string" &&
    validCategories.has(item.category) &&
    typeof item.importance === "string" &&
    validImportance.has(item.importance) &&
    typeof item.evidenceStrength === "string" &&
    validEvidence.has(item.evidenceStrength) &&
    typeof item.matchedEvidence === "string" &&
    typeof item.recruiterNote === "string"
  );
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
    isStringArray(result.topMatches) &&
    result.topMatches.length === 3 &&
    isStringArray(result.topGaps) &&
    result.topGaps.length === 3 &&
    isRecruiterInsight(result.recruiterInsight) &&
    typeof result.screeningRecommendation === "string" &&
    Array.isArray(result.screeningQuestions) &&
    result.screeningQuestions.length >= 2 &&
    result.screeningQuestions.length <= 3 &&
    result.screeningQuestions.every(isScreeningQuestion) &&
    Array.isArray(result.requirementMap) &&
    result.requirementMap.length >= 4 &&
    result.requirementMap.length <= 6 &&
    result.requirementMap.every(isRequirementMapItem)
  );
}

async function callStructuredModel<T>({
  apiKey,
  instructions,
  schema,
  input,
}: {
  apiKey: string;
  instructions: string;
  schema: typeof normalizeJobSchema | typeof jobFitResultSchema;
  input: string;
}) {
  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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
    if (!jobDescription?.trim()) {
      return Response.json({ error: "Please paste a job description to analyze." }, { status: 400 });
    }

    const normalizedBrief = await callStructuredModel<NormalizedJobBrief>({
      apiKey,
      instructions: normalizeJobPrompt,
      schema: normalizeJobSchema,
      input: `Normalize this pasted job description into a compact hiring brief:\n\n${jobDescription.trim()}`,
    });

    if (!validateNormalizedJobBrief(normalizedBrief)) {
      return Response.json(
        { error: "The job description normalization step returned an unexpected shape." },
        { status: 502 },
      );
    }

    const result = await callStructuredModel<Omit<JobFitResult, "normalizedJobBrief">>({
      apiKey,
      instructions: analyzeJobFitPrompt,
      schema: jobFitResultSchema,
      input: `Analyze Akshay's fit using this normalized job brief:\n\n${JSON.stringify(normalizedBrief, null, 2)}`,
    });

    const responsePayload = {
      ...result,
      normalizedJobBrief: normalizedBrief,
    } satisfies JobFitResult;

    if (!validateJobFitResult(responsePayload)) {
      return Response.json(
        { error: "The model returned an unexpected fit analysis shape. Please try again." },
        { status: 502 },
      );
    }

    return Response.json(responsePayload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json({ error: message }, { status: message.includes("rate-limited") ? 429 : 500 });
  }
}
