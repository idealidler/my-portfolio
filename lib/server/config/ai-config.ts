export const aiConfig = {
  chat: {
    model: "gpt-5-mini",
    maxOutputTokens: 700,
    reasoningEffort: "minimal",
    verbosity: "medium",
  },
  jobFit: {
    model: "gpt-5-mini",
    maxOutputTokens: 3000,
    reasoningEffort: "minimal",
    verbosity: "medium",
    modelTimeoutMs: 20000,
  },
} as const;
