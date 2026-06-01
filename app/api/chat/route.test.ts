import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

const encoder = new TextEncoder();

function request(body: string) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/chat", () => {
  it("returns 400 before calling OpenAI for invalid input", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(request(JSON.stringify({ messages: [] })));

    expect(response.status).toBe(400);
    expect(response.headers.get("X-Request-Id")).toBeTruthy();
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
      requestId: expect.any(String),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("adds the output cap and client request ID to valid OpenAI requests", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const openAiStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"type":"response.output_text.delta","delta":"hello"}\n\ndata: [DONE]\n\n',
          ),
        );
        controller.close();
      },
    });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(openAiStream, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request(JSON.stringify({ messages: [{ role: "user", content: "unique question" }] })),
    );

    expect(response.status).toBe(200);
    const requestId = response.headers.get("X-Request-Id");
    expect(requestId).toBeTruthy();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(init.headers).get("X-Client-Request-Id")).toBe(requestId);
    expect(JSON.parse(String(init.body))).toMatchObject({
      model: "gpt-4o-mini",
      max_output_tokens: 700,
    });
  });
});
