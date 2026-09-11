export const requestLimits = {
  chat: {
    maxSubmittedMessages: 6,
    maxMessageCharacters: 1800,
    maxTotalContentCharacters: 7200,
    maxRawBodyCharacters: 9000,
    maxHistoryMessages: 6,
    maxCachedResponses: 24,
    maxRequestsPerMinute: 12,
    maxRequestsPerDay: 120,
  },
  jobFit: {
    maxJobDescriptionCharacters: 20000,
    maxRawBodyCharacters: 22000,
  },
} as const;
