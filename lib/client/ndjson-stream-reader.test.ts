import { describe, expect, it, vi } from "vitest";
import { readNdjsonStream } from "@/lib/client/ndjson-stream-reader";

const encoder = new TextEncoder();

function streamFromChunks(chunks: string[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

async function readFrames(chunks: string[]) {
  const frames: Array<{ message?: { content?: string } }> = [];
  await readNdjsonStream<{ message?: { content?: string } }>({
    stream: streamFromChunks(chunks),
    onFrame: (frame) => frames.push(frame),
  });
  return frames;
}

describe("readNdjsonStream", () => {
  it("reassembles a JSON frame split across two chunks", async () => {
    const frames = await readFrames(['{"message":{"con', 'tent":"hello"}}\n']);
    expect(frames).toEqual([{ message: { content: "hello" } }]);
  });

  it("reassembles a JSON frame split across many chunks", async () => {
    const line = '{"message":{"content":"byte by byte"}}\n';
    const frames = await readFrames([...line]);
    expect(frames).toEqual([{ message: { content: "byte by byte" } }]);
  });

  it("parses multiple messages from the same chunk", async () => {
    const frames = await readFrames([
      '{"message":{"content":"one"}}\n{"message":{"content":"two"}}\n',
    ]);
    expect(frames).toEqual([
      { message: { content: "one" } },
      { message: { content: "two" } },
    ]);
  });

  it("recovers after a malformed complete frame", async () => {
    const frames = await readFrames(['not json\n{"message":{"content":"valid"}}\n']);
    expect(frames).toEqual([{ message: { content: "valid" } }]);
  });

  it("preserves the original regression case instead of discarding split content", async () => {
    const frames = await readFrames([
      '{"message":{"content":"port',
      'folio-grounded"}}\n{"message":{"content":" answer"}}\n',
    ]);
    expect(frames.map((frame) => frame.message?.content).join("")).toBe(
      "portfolio-grounded answer",
    );
  });

  it("cancels the reader safely when aborted", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      pull() {
        return new Promise(() => undefined);
      },
      cancel,
    });
    const controller = new AbortController();
    const reading = readNdjsonStream({ stream, signal: controller.signal, onFrame: vi.fn() });

    controller.abort();

    await expect(reading).rejects.toMatchObject({ name: "AbortError" });
    expect(cancel).toHaveBeenCalledOnce();
  });
});
