import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/job-fit/route";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/job-fit", () => {
  it("returns 400 before calling OpenAI for invalid input", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(
      new Request("http://localhost/api/job-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: "" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
      requestId: expect.any(String),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("adds stage-specific client request IDs to both OpenAI calls", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const normalizedBrief = {
      roleSummary: "Analytics role",
      cleanedJobDescription: "SQL analytics",
      coreRequirements: [
        {
          canonicalLabel: "SQL",
          sourceText: "SQL analytics",
          importance: "Core",
          category: "Tool",
          isExplicit: true,
          notes: "",
        },
      ],
      secondaryRequirements: [],
      tools: ["SQL"],
      stakeholderSignals: [],
      senioritySignals: [],
      constraints: [],
      unclearItems: [],
    };
    const narrative = {
      summary: "SQL evidence is available.",
      topMatches: Array.from({ length: 3 }, () => ({
        text: "SQL experience is supported.",
        evidenceIds: ["placeholder"],
      })),
      topGaps: Array.from({ length: 3 }, () => ({
        text: "Confirm exact depth.",
        requirementId: "placeholder",
      })),
      recruiterInsight: {
        differentiator: "Business-facing analytics delivery.",
        tradeoff: "Confirm exact SQL depth.",
        screeningFocus: "Ask for a SQL example.",
      },
      screeningRecommendation: "Proceed to screening.",
      screeningQuestions: [
        { question: "Describe your SQL depth.", whyAsk: "Validate hands-on experience." },
        { question: "Describe a related project.", whyAsk: "Validate transferability." },
      ],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ output_text: JSON.stringify(normalizedBrief) })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ output_text: JSON.stringify(narrative) })));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/job-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: "SQL analytics" }),
      }),
    );

    expect(response.status).toBe(200);
    const requestId = response.headers.get("X-Request-Id");
    expect(requestId).toBeTruthy();
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get("X-Client-Request-Id")).toBe(
      `${requestId}:normalization`,
    );
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get("X-Client-Request-Id")).toBe(
      `${requestId}:narrative`,
    );
  });
});
