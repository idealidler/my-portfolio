"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { jobFitSampleDescription, type JobFitResult } from "@/lib/job-fit";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function fitToneClasses(fitLabel: JobFitResult["fitLabel"]) {
  switch (fitLabel) {
    case "Strong fit":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Relevant fit":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function confidenceToneClasses(confidence: JobFitResult["priorities"][number]["confidence"]) {
  switch (confidence) {
    case "Direct evidence":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Related evidence":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export function JobFitAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobFitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function analyzeFit() {
    const trimmed = jobDescription.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/job-fit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription: trimmed }),
      });

      const payload = (await response.json()) as JobFitResult & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "The job fit analysis failed.");
      }

      setResult(payload);
    } catch (analysisError) {
      const message =
        analysisError instanceof Error
          ? analysisError.message
          : "Something went wrong during job fit analysis.";
      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function copyTakeaway() {
    if (!result) {
      return;
    }

    const text = [
      `Fit label: ${result.fitLabel}`,
      `Summary: ${result.summary}`,
      "",
      "Top recruiter priorities:",
      ...result.priorities.map(
        (priority, index) =>
          `${index + 1}. ${priority.requirement}\nEvidence: ${priority.evidence}\nConfidence: ${priority.confidence}`,
      ),
      "",
      "Why Akshay could be a good fit:",
      ...result.whyGoodFit.map((item) => `- ${item}`),
      "",
      "Why Akshay could not be a good fit:",
      ...result.whyNotFit.map((item) => `- ${item}`),
      "",
      `Recruiter takeaway: ${result.recruiterTakeaway}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="surface rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
                Recruiter tool
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Job Fit Analyzer
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Paste a job description and get a recruiter-friendly fit summary based only on Akshay&apos;s actual portfolio evidence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setJobDescription(jobFitSampleDescription)}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full border border-slate-200 bg-white/75")}
            >
              Use sample JD
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-4 sm:p-5">
              <label htmlFor="job-description" className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Paste job description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the recruiter or hiring manager's job description here..."
                className="mt-4 min-h-[16rem] w-full resize-y rounded-[1.25rem] border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void analyzeFit()}
                  disabled={isLoading || !jobDescription.trim()}
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Analyze fit
                </button>
                {result ? (
                  <button
                    type="button"
                    onClick={() => void copyTakeaway()}
                    className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied" : "Copy summary"}
                  </button>
                ) : null}
              </div>
              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-4 sm:p-5">
              {result ? (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={fitToneClasses(result.fitLabel)}>{result.fitLabel}</Badge>
                    <p className="text-sm text-slate-500">Portfolio-grounded recruiter summary</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{result.summary}</p>

                  <div className="mt-6 space-y-4">
                    {result.priorities.map((priority, index) => (
                      <div key={`${priority.requirement}-${index}`} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-950">
                            {index + 1}. {priority.requirement}
                          </p>
                          <Badge className={confidenceToneClasses(priority.confidence)}>{priority.confidence}</Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{priority.evidence}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/65 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Why Akshay could be a good fit
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {result.whyGoodFit.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/65 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Why Akshay could not be a good fit
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {result.whyNotFit.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-amber-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-900/90 bg-slate-950 p-4 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                        Recruiter takeaway
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{result.recruiterTakeaway}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[16rem] flex-col justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    What this gives recruiters
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li>The five most important recruiter-priority signals extracted from the JD.</li>
                    <li>Evidence mapping grounded in Akshay&apos;s actual portfolio.</li>
                    <li>Brutally honest reasons he could be a fit and why he might not be.</li>
                    <li>A fast recruiter takeaway on whether he looks worth a call.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
