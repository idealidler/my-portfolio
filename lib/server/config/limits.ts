export const requestLimits = {
  chat: {
    maxSubmittedMessages: 6,
    maxMessageCharacters: 2400,
    maxTotalContentCharacters: 14400,
    maxRawBodyCharacters: 18000,
    maxHistoryMessages: 6,
    maxCachedResponses: 24,
  },
  jobFit: {
    maxJobDescriptionCharacters: 20000,
    maxRawBodyCharacters: 22000,
  },
} as const;
