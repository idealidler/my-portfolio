export const aiConfig = {
  chat: {
    model: "gpt-5.6-luna",
    maxOutputTokens: 2200,
    reasoningEffort: "medium",
    verbosity: "medium",
  },
  jobFit: {
    model: "gpt-5.6-luna",
    maxOutputTokens: 3000,
    reasoningEffort: "medium",
    verbosity: "medium",
    modelTimeoutMs: 20000,
  },
} as const;
