import { z } from "zod";

const aiEnvironmentSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1, "OPENAI_API_KEY is missing."),
});

const siteEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export function parseAiEnvironment(environment: Record<string, string | undefined> = process.env) {
  return aiEnvironmentSchema.parse(environment);
}

export function parseSiteEnvironment(environment: Record<string, string | undefined> = process.env) {
  return siteEnvironmentSchema.parse(environment);
}
