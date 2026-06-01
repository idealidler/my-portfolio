export const aiConfig = {
  chat: {
    model: "gpt-4o-mini",
    maxOutputTokens: 700,
  },
  jobFit: {
    model: "gpt-4o-mini",
    maxOutputTokens: 1800,
    modelTimeoutMs: 12000,
  },
} as const;
