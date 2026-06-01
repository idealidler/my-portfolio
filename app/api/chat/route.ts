import { retrievePortfolioContext } from "@/lib/portfolio-retrieval";
import { aiConfig } from "@/lib/server/config/ai-config";
import { parseAiEnvironment } from "@/lib/server/config/env";
import { requestLimits } from "@/lib/server/config/limits";
import { type ChatMessage, parseChatRequestBody } from "@/lib/server/contracts/chat";
import { createLogger, createRequestId } from "@/lib/server/observability/logger";

export const runtime = "edge";

const responseCache = new Map<string, string>();

const baseSystemPrompt = [
  "You are AkshayGPT, a professional portfolio assistant for Akshay Jain.",
  "Answer only from the provided portfolio context and the conversation.",
  "Sound like a polished, consultative version of Akshay: practical, specific, business-aware, and direct.",
  "Emphasize Akshay's problem-solving ability, business stakeholder partnership, and systems-thinking when the evidence supports it.",
  "If the portfolio context does not support a claim, say that you do not have that detail in the portfolio data.",
  "Do not invent dates, metrics, employers, technologies, or project outcomes.",
  "If the user asks a vague question, answer with the most relevant portfolio evidence and ask one useful follow-up question only when it would materially improve the answer.",
  "Prioritize the strongest, most relevant evidence first.",
  "Format answers in clean Markdown.",
  "Use short bullet points when listing skills, projects, or outcomes.",
  "Use bold text sparingly for section labels or the most important phrases.",
  "If mentioning a URL that exists in the portfolio context, format it as a proper Markdown link.",
  "Prefer short sections and readable spacing over dense paragraphs.",
].join("\n");

function buildSystemPrompt(latestUserMessage: string) {
  return [
    baseSystemPrompt,
    "",
    "Portfolio context:",
    retrievePortfolioContext(latestUserMessage),
  ].join("\n");
}

function toOpenAIInput(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function trimConversation(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.role !== "system")
    .slice(-requestLimits.chat.maxHistoryMessages)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, requestLimits.chat.maxMessageCharacters),
    }));
}

function normalizeCacheKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 240);
}

function setCachedResponse(key: string, value: string) {
  if (!value.trim()) {
    return;
  }

  responseCache.set(key, value);

  if (responseCache.size > requestLimits.chat.maxCachedResponses) {
    const oldestKey = responseCache.keys().next().value as string | undefined;
    if (oldestKey) {
      responseCache.delete(oldestKey);
    }
  }
}

function createCachedJsonLineResponse(content: string, requestId: string) {
  return new Response(`${JSON.stringify({ message: { content } })}\n`, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "private, max-age=60",
      "X-AkshayGPT-Cache": "HIT",
      "X-Request-Id": requestId,
    },
  });
}

function createJsonLineStream(
  openAiStream: ReadableStream<Uint8Array>,
  onComplete?: (content: string) => void,
) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let fullContent = "";

  function close(controller: ReadableStreamDefaultController<Uint8Array>) {
    onComplete?.(fullContent);
    controller.close();
  }

  return new ReadableStream({
    async start(controller) {
      const reader = openAiStream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const eventBlock of events) {
            const lines = eventBlock.split("\n");
            const dataLines = lines
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim());

            if (dataLines.length === 0) {
              continue;
            }

            const payload = dataLines.join("\n");
            if (payload === "[DONE]") {
              close(controller);
              return;
            }

            try {
              const parsed = JSON.parse(payload) as
                | { type?: string; delta?: string; error?: { message?: string } }
                | undefined;

              if (parsed?.type === "response.output_text.delta" && parsed.delta) {
                fullContent += parsed.delta;
                controller.enqueue(
                  encoder.encode(
                    `${JSON.stringify({ message: { content: parsed.delta } })}\n`,
                  ),
                );
              }

              if (parsed?.type === "error") {
                const message = parsed.error?.message ?? "The model returned an unexpected error.";
                controller.enqueue(
                  encoder.encode(
                    `${JSON.stringify({ message: { content: `Sorry, I ran into an issue: ${message}` } })}\n`,
                  ),
                );
                close(controller);
                return;
              }
            } catch {
              // Ignore incomplete or non-JSON SSE fragments.
            }
          }
        }

        close(controller);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Streaming failed unexpectedly.";
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ message: { content: `Sorry, I ran into an issue: ${message}` } })}\n`,
          ),
        );
        close(controller);
      }
    },
  });
}

export async function POST(request: Request) {
  const requestId = createRequestId();
  const logger = createLogger({ requestId, route: "chat" });
  const jsonResponse = (body: unknown, status: number) =>
    Response.json(body, { status, headers: { "X-Request-Id": requestId } });

  try {
    let messages: ChatMessage[];
    try {
      ({ messages } = parseChatRequestBody(await request.text()));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid chat request.";
      logger.warn("request.validation_failed", { reason: message });
      return jsonResponse({ error: message, requestId }, 400);
    }

    let apiKey: string;
    try {
      ({ OPENAI_API_KEY: apiKey } = parseAiEnvironment());
    } catch {
      logger.error("environment.invalid");
      return jsonResponse(
        { error: "OPENAI_API_KEY is missing. Add it to your environment to enable AkshayGPT.", requestId },
        500,
      );
    }

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
    if (!latestUserMessage?.content.trim()) {
      const message = "Please ask a question to start the conversation.";
      logger.warn("request.validation_failed", { reason: message });
      return jsonResponse({ error: message, requestId }, 400);
    }

    const cacheKey = normalizeCacheKey(latestUserMessage.content);
    const canUseCache = messages.length <= 1 && cacheKey.length > 0;
    const cachedResponse = canUseCache ? responseCache.get(cacheKey) : undefined;

    if (cachedResponse) {
      logger.info("cache.hit");
      return createCachedJsonLineResponse(cachedResponse, requestId);
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Client-Request-Id": requestId,
      },
      body: JSON.stringify({
        model: aiConfig.chat.model,
        max_output_tokens: aiConfig.chat.maxOutputTokens,
        stream: true,
        instructions: buildSystemPrompt(latestUserMessage.content),
        input: toOpenAIInput(trimConversation(messages)),
      }),
    });

    if (!openAiResponse.ok || !openAiResponse.body) {
      const errorText = await openAiResponse.text();
      let message = "The chat request failed.";

      try {
        const parsed = JSON.parse(errorText) as { error?: { message?: string } };
        message = parsed.error?.message ?? message;
      } catch {
        if (openAiResponse.status === 429) {
          message = "AkshayGPT is temporarily rate-limited. Please try again in a moment.";
        }
      }

      logger.warn("openai.request_failed", { status: openAiResponse.status });
      return jsonResponse({ error: message, requestId }, openAiResponse.status || 500);
    }

    const stream = createJsonLineStream(openAiResponse.body, (content) => {
      if (canUseCache) {
        setCachedResponse(cacheKey, content);
      }
      logger.info("request.completed", { cacheStatus: "miss" });
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-store",
        "X-AkshayGPT-Cache": "MISS",
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    logger.error("request.failed", { error: message });
    return jsonResponse({ error: "Internal Server Error", details: message, requestId }, 500);
  }
}
