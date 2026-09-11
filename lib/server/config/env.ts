import { z } from "zod";

const aiEnvironmentSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1, "OPENAI_API_KEY is missing."),
});

const rateLimitEnvironmentSchema = z
  .object({
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().trim().min(1).optional(),
  })
  .refine(
    (environment) =>
      (environment.UPSTASH_REDIS_REST_URL && environment.UPSTASH_REDIS_REST_TOKEN) ||
      (!environment.UPSTASH_REDIS_REST_URL && !environment.UPSTASH_REDIS_REST_TOKEN),
    {
      message:
        "Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when Redis rate limiting is enabled.",
    },
  );

const siteEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export function parseAiEnvironment(environment: Record<string, string | undefined> = process.env) {
  return aiEnvironmentSchema.parse(environment);
}

export function parseRateLimitEnvironment(environment: Record<string, string | undefined> = process.env) {
  return rateLimitEnvironmentSchema.parse(environment);
}

export function parseSiteEnvironment(environment: Record<string, string | undefined> = process.env) {
  return siteEnvironmentSchema.parse(environment);
}
