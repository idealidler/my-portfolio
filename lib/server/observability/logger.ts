type LogLevel = "info" | "warn" | "error";
type LogMetadata = Record<string, unknown>;

type LoggerContext = {
  requestId: string;
  route: "chat" | "job-fit";
};

export function createRequestId() {
  return crypto.randomUUID();
}

export function createLogger(context: LoggerContext) {
  function write(level: LogLevel, event: string, metadata: LogMetadata = {}) {
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      requestId: context.requestId,
      route: context.route,
      event,
      ...metadata,
    });

    console[level](entry);
  }

  return {
    info: (event: string, metadata?: LogMetadata) => write("info", event, metadata),
    warn: (event: string, metadata?: LogMetadata) => write("warn", event, metadata),
    error: (event: string, metadata?: LogMetadata) => write("error", event, metadata),
  };
}
