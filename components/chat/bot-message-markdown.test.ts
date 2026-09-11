import { describe, expect, it } from "vitest";
import { normalizeBotMarkdown } from "@/components/chat/bot-message-markdown";

describe("normalizeBotMarkdown", () => {
  it("preserves ordinary Markdown formatting", () => {
    expect(normalizeBotMarkdown("**Impact**\n- Built dashboards.")).toBe(
      "**Impact**\n- Built dashboards.",
    );
  });

  it("normalizes escaped Markdown and escaped line breaks from model output", () => {
    expect(normalizeBotMarkdown("\\*\\*Projects\\*\\*\\n- [GitDecode](https://github.com/idealidler/gitdecode-backend)")).toBe(
      "**Projects**\n- [GitDecode](https://github.com/idealidler/gitdecode-backend)",
    );
  });

  it("removes leading whitespace that can break first-line Markdown", () => {
    expect(normalizeBotMarkdown("\n\n  **Skills**\n- Power BI")).toBe(
      "**Skills**\n- Power BI",
    );
  });
});

