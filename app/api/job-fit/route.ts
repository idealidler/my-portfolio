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
        enum: ["Strong", "Plausible", "Stretch", "Weak"],
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
        minItems: 2,
        maxItems: 2,
        items: { type: "string" },
      },
      screeningRecommendation: { type: "string" },
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
      "summary",
      "topMatches",
      "topGaps",
      "screeningRecommendation",
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
  "You are AkshayGPT, a recruiter-facing portfolio analyst for Akshay Jain.",
  "Use only the normalized job brief and the portfolio evidence units provided.",
  "Be evidence-first, conservative, and concise.",
  "Never invent experience, seniority, technologies, or scale that are not supported by the evidence units.",
  "Do not treat tool-name overlap alone as qualification if the evidence does not show meaningful usage.",
  "If a core requirement lacks explicit support, say so plainly and factor it into the verdict.",
  "Verdict rules:",
  "- Strong: direct evidence for most core requirements, with no major missing must-have.",
  "- Plausible: strong overlap overall, but at least one area should be validated in screening.",
  "- Stretch: some overlap, but multiple core gaps or depth concerns remain.",
  "- Weak: limited overlap or several important core requirements lack evidence.",
  "topMatches should be exactly 3 short bullets.",
  "topGaps should be exactly 2 short bullets.",
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
  const validVerdicts = new Set(["Strong", "Plausible", "Stretch", "Weak"]);

  return (
    typeof result.verdict === "string" &&
    validVerdicts.has(result.verdict) &&
    typeof result.summary === "string" &&
    isStringArray(result.topMatches) &&
    result.topMatches.length === 3 &&
    isStringArray(result.topGaps) &&
    result.topGaps.length === 2 &&
    typeof result.screeningRecommendation === "string" &&
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
