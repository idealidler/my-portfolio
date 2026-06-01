import { describe, expect, it } from "vitest";
import { aiConfig } from "@/lib/server/config/ai-config";
import { parseAiEnvironment, parseSiteEnvironment } from "@/lib/server/config/env";

describe("environment configuration", () => {
  it("accepts valid AI environment values", () => {
    expect(parseAiEnvironment({ OPENAI_API_KEY: "test-key" })).toEqual({
      OPENAI_API_KEY: "test-key",
    });
  });

  it("rejects a missing API key lazily", () => {
    expect(() => parseAiEnvironment({})).toThrow();
  });

  it("rejects a blank API key", () => {
    expect(() => parseAiEnvironment({ OPENAI_API_KEY: "  " })).toThrow();
  });

  it("rejects an invalid optional site URL", () => {
    expect(() => parseSiteEnvironment({ NEXT_PUBLIC_SITE_URL: "not-a-url" })).toThrow();
  });

  it("keeps the Stage 1 AI defaults centralized", () => {
    expect(aiConfig).toEqual({
      chat: { model: "gpt-4o-mini", maxOutputTokens: 700 },
      jobFit: { model: "gpt-4o-mini", maxOutputTokens: 1800, modelTimeoutMs: 12000 },
    });
  });
});
