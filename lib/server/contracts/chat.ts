import { z } from "zod";
import { requestLimits } from "@/lib/server/config/limits";

const limits = requestLimits.chat;

export const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().max(limits.maxMessageCharacters),
  })
  .strict();

export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(limits.maxSubmittedMessages),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    const totalCharacters = messages.reduce((total, message) => total + message.content.length, 0);
    if (totalCharacters > limits.maxTotalContentCharacters) {
      context.addIssue({
        code: "custom",
        message: `Combined message content must not exceed ${limits.maxTotalContentCharacters} characters.`,
        path: ["messages"],
      });
    }
  });

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export function parseChatRequestBody(rawBody: string): ChatRequest {
  if (rawBody.length > limits.maxRawBodyCharacters) {
    throw new Error(`Chat request body must not exceed ${limits.maxRawBodyCharacters} characters.`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new Error("Chat request body must be valid JSON.");
  }

  const result = chatRequestSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid chat request.");
  }

  return result.data;
}
