import { buildPortfolioContext } from "@/lib/portfolio-context";
import type { JobFitResult } from "@/lib/job-fit";

export const runtime = "edge";

const portfolioContext = buildPortfolioContext();
const jobFitPrompt = [
  "You are AkshayGPT, a recruiter-facing portfolio analyst for Akshay Jain.",
  "You evaluate job descriptions only against the provided portfolio context.",
  "Be honest, concise, and evidence-based.",
  "Do not invent experience, metrics, technologies, or outcomes that are not present in the portfolio context.",
  "Return JSON only. No markdown fences. No extra commentary.",
  "Choose fitLabel from exactly one of: Strong fit, Relevant fit, Partial fit.",
  "Extract the five most important hiring priorities from the job description.",
  "For each priority, map it to real evidence from the portfolio and assign confidence as exactly one of: Direct evidence, Related evidence, Limited evidence.",
  "Then produce two brutally honest sections: why Akshay could be a good fit, and why Akshay could not be a good fit.",
  "If the portfolio does not clearly support something, say so plainly.",
  "The recruiterTakeaway should be 2-3 concise sentences answering whether Akshay looks worth a screening call and what should be validated.",
  "",
  "Return JSON in this shape:",
  '{',
  '  "fitLabel": "Strong fit | Relevant fit | Partial fit",',
  '  "summary": "string",',
  '  "priorities": [',
  '    {',
  '      "requirement": "string",',
  '      "evidence": "string",',
  '      "confidence": "Direct evidence | Related evidence | Limited evidence"',
  "    }",
  "  ],",
  '  "whyGoodFit": ["string"],',
  '  "whyNotFit": ["string"],',
  '  "recruiterTakeaway": "string"',
  "}",
  "",
  "Portfolio context:",
  portfolioContext,
].join("\n");

const jobFitSchema = {
  name: "job_fit_result",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      fitLabel: {
        type: "string",
        enum: ["Strong fit", "Relevant fit", "Partial fit"],
      },
      summary: {
        type: "string",
      },
      priorities: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            requirement: { type: "string" },
            evidence: { type: "string" },
            confidence: {
              type: "string",
              enum: ["Direct evidence", "Related evidence", "Limited evidence"],
            },
          },
          required: ["requirement", "evidence", "confidence"],
        },
      },
      whyGoodFit: {
        type: "array",
        items: { type: "string" },
      },
      whyNotFit: {
        type: "array",
        items: { type: "string" },
      },
      recruiterTakeaway: {
        type: "string",
      },
    },
    required: ["fitLabel", "summary", "priorities", "whyGoodFit", "whyNotFit", "recruiterTakeaway"],
  },
} as const;

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

function validateJobFitResult(payload: unknown): payload is JobFitResult {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const validFitLabels = new Set(["Strong fit", "Relevant fit", "Partial fit"]);
  const validConfidence = new Set(["Direct evidence", "Related evidence", "Limited evidence"]);

  return (
    typeof candidate.summary === "string" &&
    typeof candidate.recruiterTakeaway === "string" &&
    typeof candidate.fitLabel === "string" &&
    validFitLabels.has(candidate.fitLabel) &&
    Array.isArray(candidate.whyGoodFit) &&
    candidate.whyGoodFit.every((item) => typeof item === "string") &&
    Array.isArray(candidate.whyNotFit) &&
    candidate.whyNotFit.every((item) => typeof item === "string") &&
    Array.isArray(candidate.priorities) &&
    candidate.priorities.length > 0 &&
    candidate.priorities.every((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const priority = item as Record<string, unknown>;
      return (
        typeof priority.requirement === "string" &&
        typeof priority.evidence === "string" &&
        typeof priority.confidence === "string" &&
        validConfidence.has(priority.confidence)
      );
    })
  );
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
            ...jobFitSchema,
          },
        },
        instructions: jobFitPrompt,
        input: [
          {
            role: "user",
            content: `Analyze this job description for recruiter fit:\n\n${jobDescription}`,
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

      return Response.json({ error: message }, { status: openAiResponse.status || 500 });
    }

    const payload = (await openAiResponse.json()) as unknown;
    const rawText = extractResponseText(payload);
    const jsonText = extractJson(rawText);

    if (!jsonText) {
      return Response.json(
        { error: "The model returned an unreadable fit analysis. Please try again." },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(jsonText) as unknown;
    if (!validateJobFitResult(parsed)) {
      return Response.json(
        { error: "The model returned an unexpected fit analysis shape. Please try again." },
        { status: 502 },
      );
    }

    return Response.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return Response.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}
