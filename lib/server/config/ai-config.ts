export const aiConfig = {
  chat: {
    model: "gpt-5-mini",
    maxOutputTokens: 700,
    reasoningEffort: "minimal",
    verbosity: "low",
  },
  jobFit: {
    model: "gpt-4o-mini",
    maxOutputTokens: 1800,
    modelTimeoutMs: 12000,
  },
} as const;
