import { describe, expect, it } from "vitest";
import { buildChatSystemPrompt } from "@/lib/server/chat/prompt";

describe("buildChatSystemPrompt", () => {
  it("uses the full approved portfolio context instead of retrieved snippets", () => {
    const prompt = buildChatSystemPrompt();

    expect(prompt).toContain("Your only source of truth is the Akshay Profile Context");
    expect(prompt).toContain("SUPPORTED, PARTIAL, or UNSUPPORTED");
    expect(prompt).toContain("Never output the words SUPPORTED, PARTIAL, or UNSUPPORTED");
    expect(prompt).toContain("Use tasteful Markdown");
    expect(prompt).toContain("Start with a direct answer, not a status label");
    expect(prompt).toContain("Analytics Engineer at Holman");
    expect(prompt).toContain("Data Science Intern at LabWare");
    expect(prompt).toContain("Drexel University");
    expect(prompt).toContain("H-1B Wage Map");
    expect(prompt).toContain("GitDecode");
    expect(prompt).not.toContain("Retrieved portfolio evidence");
  });
});
