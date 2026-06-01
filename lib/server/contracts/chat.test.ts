import { describe, expect, it } from "vitest";
import { parseChatRequestBody } from "@/lib/server/contracts/chat";

function request(messages: unknown) {
  return JSON.stringify({ messages });
}

describe("parseChatRequestBody", () => {
  it("accepts a valid request", () => {
    expect(parseChatRequestBody(request([{ role: "user", content: "hello" }]))).toEqual({
      messages: [{ role: "user", content: "hello" }],
    });
  });

  it.each([
    ["invalid role", request([{ role: "bot", content: "hello" }])],
    ["non-string content", request([{ role: "user", content: 42 }])],
    ["unknown fields", JSON.stringify({ messages: [{ role: "user", content: "hello" }], extra: true })],
    ["empty messages", request([])],
    ["too many messages", request(Array.from({ length: 7 }, () => ({ role: "user", content: "a" })))],
    ["oversized message", request([{ role: "user", content: "a".repeat(2401) }])],
    [
      "oversized combined content",
      request(Array.from({ length: 6 }, () => ({ role: "user", content: "a".repeat(2401) }))),
    ],
    ["malformed JSON", "{"],
  ])("rejects %s", (_caseName, rawBody) => {
    expect(() => parseChatRequestBody(rawBody)).toThrow();
  });

  it("rejects an oversized raw body", () => {
    expect(() => parseChatRequestBody(" ".repeat(18001))).toThrow(/18000/);
  });
});
