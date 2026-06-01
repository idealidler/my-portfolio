import { describe, expect, it } from "vitest";
import { parseJobFitRequestBody } from "@/lib/server/contracts/job-fit";

describe("parseJobFitRequestBody", () => {
  it("accepts a valid request and normalizes whitespace", () => {
    expect(parseJobFitRequestBody(JSON.stringify({ jobDescription: "  SQL   and\nPower BI  " }))).toEqual({
      jobDescription: "SQL and Power BI",
    });
  });

  it.each([
    ["empty descriptions", JSON.stringify({ jobDescription: "  " })],
    ["non-string descriptions", JSON.stringify({ jobDescription: 42 })],
    ["unknown fields", JSON.stringify({ jobDescription: "SQL", extra: true })],
    ["oversized cleaned descriptions", JSON.stringify({ jobDescription: "a".repeat(20001) })],
    ["malformed JSON", "{"],
  ])("rejects %s", (_caseName, rawBody) => {
    expect(() => parseJobFitRequestBody(rawBody)).toThrow();
  });

  it("rejects an oversized raw body", () => {
    expect(() => parseJobFitRequestBody(" ".repeat(22001))).toThrow(/22000/);
  });
});
