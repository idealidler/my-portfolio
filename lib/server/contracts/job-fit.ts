import { z } from "zod";
import { requestLimits } from "@/lib/server/config/limits";

const limits = requestLimits.jobFit;

export const jobFitRequestSchema = z
  .object({
    jobDescription: z
      .string()
      .transform((value) => value.replace(/\s+/g, " ").trim())
      .pipe(z.string().min(1, "Please paste a job description to analyze.").max(limits.maxJobDescriptionCharacters)),
  })
  .strict();

export type JobFitRequest = z.infer<typeof jobFitRequestSchema>;

export function parseJobFitRequestBody(rawBody: string): JobFitRequest {
  if (rawBody.length > limits.maxRawBodyCharacters) {
    throw new Error(`Job fit request body must not exceed ${limits.maxRawBodyCharacters} characters.`);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new Error("Job fit request body must be valid JSON.");
  }

  const result = jobFitRequestSchema.safeParse(payload);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid job fit request.");
  }

  return result.data;
}
