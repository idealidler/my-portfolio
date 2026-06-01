type ReadNdjsonStreamOptions<T> = {
  stream: ReadableStream<Uint8Array>;
  onFrame: (frame: T) => void;
  signal?: AbortSignal;
};

function createAbortError() {
  const error = new Error("The stream was cancelled.");
  error.name = "AbortError";
  return error;
}

export async function readNdjsonStream<T>({
  stream,
  onFrame,
  signal,
}: ReadNdjsonStreamOptions<T>) {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  let transportBuffer = "";

  function parseFrame(frame: string) {
    const trimmedFrame = frame.trim();
    if (!trimmedFrame) {
      return;
    }

    try {
      onFrame(JSON.parse(trimmedFrame) as T);
    } catch {
      // Skip malformed complete frames so later valid frames can still render.
    }
  }

  function parseCompleteFrames() {
    const frames = transportBuffer.split("\n");
    transportBuffer = frames.pop() ?? "";
    frames.forEach(parseFrame);
  }

  const abort = () => {
    void reader.cancel(createAbortError());
  };

  if (signal?.aborted) {
    abort();
    throw createAbortError();
  }

  signal?.addEventListener("abort", abort, { once: true });

  try {
    while (true) {
      if (signal?.aborted) {
        throw createAbortError();
      }

      const { done, value } = await reader.read();
      if (signal?.aborted) {
        throw createAbortError();
      }

      if (done) {
        break;
      }

      transportBuffer += decoder.decode(value, { stream: true });
      parseCompleteFrames();
    }

    transportBuffer += decoder.decode();
    parseCompleteFrames();
    parseFrame(transportBuffer);
  } finally {
    signal?.removeEventListener("abort", abort);
    reader.releaseLock();
  }
}
