import { requestLimits } from "@/lib/server/config/limits";

const promptExtractionPatterns = [
  /\b(system|developer)\s+(prompt|message|instructions?)\b/i,
  /\b(reveal|print|show|dump|repeat|verbatim|exact)\b.*\b(prompt|context|instructions?|hidden|policy)\b/i,
  /\bignore\b.*\b(previous|above|earlier|system|developer)\b/i,
  /\bdisregard\b.*\b(previous|above|earlier|system|developer)\b/i,
  /\bact\s+as\b.*\b(unrestricted|uncensored|developer|system)\b/i,
];

export function isLikelyPromptAttack(message: string) {
  return promptExtractionPatterns.some((pattern) => pattern.test(message));
}

export function validateLatestUserMessage(message: string) {
  const trimmed = message.trim();

  if (!trimmed) {
    return "Please ask a question to start the conversation.";
  }

  if (trimmed.length > requestLimits.chat.maxMessageCharacters) {
    return `Messages must not exceed ${requestLimits.chat.maxMessageCharacters} characters.`;
  }

  if (isLikelyPromptAttack(trimmed)) {
    return "I can answer questions about Akshay's experience, projects, skills, education, and contact details, but I cannot share hidden instructions or internal context.";
  }

  return null;
}

