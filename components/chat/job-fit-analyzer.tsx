"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { jobFitSampleDescription, type JobFitResult } from "@/lib/job-fit";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function verdictToneClasses(verdict: JobFitResult["verdict"]) {
  switch (verdict) {
    case "Strong fit":
      return "border-emerald-300 bg-white text-emerald-700";
    case "Moderate fit":
      return "border-sky-300 bg-white text-sky-700";
    case "Stretch":
      return "border-amber-300 bg-white text-amber-700";
    default:
      return "border-rose-300 bg-white text-rose-700";
  }
}

function evidenceToneClasses(evidenceStrength: JobFitResult["requirementMap"][number]["evidenceStrength"]) {
  switch (evidenceStrength) {
    case "Direct evidence":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "Adjacent evidence":
      return "border-sky-200 bg-sky-50 text-sky-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function compactList(items: string[]) {
  return items.length ? items.join(", ") : "None identified";
}

function scoreToneClass(score: number) {
  if (score >= 85) {
    return "bg-emerald-500";
  }

  if (score >= 70) {
    return "bg-sky-500";
  }

  if (score >= 50) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-semibold text-slate-950">{boundedScore}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full", scoreToneClass(boundedScore))} style={{ width: `${boundedScore}%` }} />
      </div>
    </div>
  );
}

export function JobFitAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<JobFitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

      const payload = (await response.json()) as JobFitResult & { error?: string; details?: string };
      if (!response.ok) {
        throw new Error(payload.error || "The job fit analysis failed.");
      }

      setResult(payload);
      setIsDetailsOpen(false);
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
      `Verdict: ${result.verdict} (${Math.round(result.scoreBreakdown.overallScore)}%)`,
      `Score rationale: ${result.scoreBreakdown.scoreRationale}`,
      `Summary: ${result.summary}`,
      "",
      "Score breakdown:",
      `Skills match: ${Math.round(result.scoreBreakdown.skillsMatch)}%`,
      `Experience relevance: ${Math.round(result.scoreBreakdown.experienceRelevance)}%`,
      `Domain alignment: ${Math.round(result.scoreBreakdown.domainAlignment)}%`,
      `Seniority fit: ${Math.round(result.scoreBreakdown.seniorityFit)}%`,
      "",
      "Strongest alignment:",
      ...result.topMatches.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Gaps and risks:",
      ...result.topGaps.map((item, index) => `${index + 1}. ${item}`),
      "",
      "Recruiter insight:",
      `Differentiator: ${result.recruiterInsight.differentiator}`,
      `Trade-off: ${result.recruiterInsight.tradeoff}`,
      `Screening focus: ${result.recruiterInsight.screeningFocus}`,
      "",
      "Screening questions:",
      ...result.screeningQuestions.map(
        (item, index) => `${index + 1}. ${item.question}\nWhy ask: ${item.whyAsk}`,
      ),
      "",
      `Recommendation: ${result.screeningRecommendation}`,
      "",
      "Requirement map:",
      ...result.requirementMap.map(
        (item, index) =>
          `${index + 1}. ${item.requirement} [${item.importance}; ${item.evidenceStrength}]\nEvidence: ${item.matchedEvidence}\nNote: ${item.recruiterNote}`,
      ),
      "",
      "JD brief:",
      result.normalizedJobBrief.roleSummary,
      result.normalizedJobBrief.cleanedJobDescription,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="job-fit-print-shell px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
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
                Paste a JD and get a balanced recruiter-style evaluation grounded only in
                Akshay&apos;s portfolio evidence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setJobDescription(jobFitSampleDescription)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "job-fit-print-hidden rounded-full border border-slate-200 bg-white/75",
              )}
            >
              Use sample JD
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div className="job-fit-print-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-4 sm:p-5">
              <label
                htmlFor="job-description"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
              >
                Paste job description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job responsibilities and requirements here..."
                className="mt-4 min-h-[16rem] w-full resize-y rounded-[1.25rem] border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Best results come from responsibilities and requirements. Benefits, company
                overview, and boilerplate are optional.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void analyzeFit()}
                  disabled={isLoading || !jobDescription.trim()}
                  className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Analyzing..." : "Analyze fit"}
                </button>
              </div>
              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-4 sm:p-5">
              {result ? (
                <div>
                  <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge className={verdictToneClasses(result.verdict)}>{result.verdict}</Badge>
                          <p className="text-sm text-slate-500">Recruiter decision signal</p>
                        </div>
                        <p className="mt-4 text-base leading-7 text-slate-800">{result.summary}</p>
                        <div className="mt-4 rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Recommendation
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {result.screeningRecommendation}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 lg:min-w-[230px]">
                        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/85 p-4 text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Match score
                          </p>
                          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                            {Math.round(result.scoreBreakdown.overallScore)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">out of 100</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void copyTakeaway()}
                          className={cn(
                            buttonVariants({ variant: "secondary", size: "sm" }),
                            "job-fit-print-hidden",
                          )}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Score breakdown
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <ScoreBar label="Skills match" score={result.scoreBreakdown.skillsMatch} />
                      <ScoreBar label="Experience relevance" score={result.scoreBreakdown.experienceRelevance} />
                      <ScoreBar label="Domain alignment" score={result.scoreBreakdown.domainAlignment} />
                      <ScoreBar label="Seniority fit" score={result.scoreBreakdown.seniorityFit} />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {result.scoreBreakdown.scoreRationale}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/65 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Strongest alignment
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {result.topMatches.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/65 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Gaps and risks
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                        {result.topGaps.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-amber-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Differentiator
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {result.recruiterInsight.differentiator}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Hiring trade-off
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {result.recruiterInsight.tradeoff}
                      </p>
                    </div>
                    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Screen for
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {result.recruiterInsight.screeningFocus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Screening questions
                    </p>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      {result.screeningQuestions.map((item) => (
                        <div key={item.question} className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                          <p className="text-sm font-semibold leading-6 text-slate-950">
                            {item.question}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.whyAsk}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <details
                      open={isDetailsOpen}
                      onToggle={(event) => setIsDetailsOpen(event.currentTarget.open)}
                      className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 sm:p-5"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                              Detailed breakdown
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                              Expand to review the normalized JD brief and the full requirement map together.
                            </p>
                          </div>
                          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                            {isDetailsOpen ? "Collapse details" : "Expand details"}
                          </div>
                        </div>
                      </summary>

                      <div className="mt-5 grid gap-4 xl:grid-cols-2">
                        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4 sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            JD brief
                          </p>
                          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                            <div>
                              <p className="font-semibold text-slate-900">Role summary</p>
                              <p className="mt-1">{result.normalizedJobBrief.roleSummary}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Normalized JD brief</p>
                              <p className="mt-1 whitespace-pre-line">
                                {result.normalizedJobBrief.cleanedJobDescription}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Core requirements</p>
                              <ul className="mt-2 space-y-2">
                                {result.normalizedJobBrief.coreRequirements.map((item) => (
                                  <li key={`${item.canonicalLabel}-${item.sourceText}`}>
                                    <span className="font-medium text-slate-800">
                                      {item.canonicalLabel}
                                    </span>
                                    {item.notes ? ` - ${item.notes}` : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {result.normalizedJobBrief.secondaryRequirements.length ? (
                              <div>
                                <p className="font-semibold text-slate-900">Secondary requirements</p>
                                <ul className="mt-2 space-y-2">
                                  {result.normalizedJobBrief.secondaryRequirements.map((item) => (
                                    <li key={`${item.canonicalLabel}-${item.sourceText}`}>
                                      <span className="font-medium text-slate-800">
                                        {item.canonicalLabel}
                                      </span>
                                      {item.notes ? ` - ${item.notes}` : ""}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                            <div className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/90 p-4">
                              <p className="font-semibold text-slate-900">Key metadata</p>
                              <ul className="mt-2 space-y-2">
                                <li>
                                  <span className="font-medium text-slate-800">Tools:</span>{" "}
                                  {compactList(result.normalizedJobBrief.tools)}
                                </li>
                                <li>
                                  <span className="font-medium text-slate-800">Stakeholder:</span>{" "}
                                  {compactList(result.normalizedJobBrief.stakeholderSignals)}
                                </li>
                                <li>
                                  <span className="font-medium text-slate-800">Seniority:</span>{" "}
                                  {compactList(result.normalizedJobBrief.senioritySignals)}
                                </li>
                                <li>
                                  <span className="font-medium text-slate-800">Constraints:</span>{" "}
                                  {compactList(result.normalizedJobBrief.constraints)}
                                </li>
                              </ul>
                            </div>
                            {result.normalizedJobBrief.unclearItems.length ? (
                              <div className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/90 p-4">
                                <p className="font-semibold text-slate-900">Filtered / unclear</p>
                                <ul className="mt-2 space-y-2">
                                  {result.normalizedJobBrief.unclearItems.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-4 sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Requirement map
                          </p>
                          <div className="mt-4 space-y-3">
                            {result.requirementMap.map((item, index) => (
                              <div
                                key={`${item.requirement}-${index}`}
                                className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/90 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-950">
                                      {item.requirement}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                                      {item.importance} • {item.category}
                                    </p>
                                  </div>
                                  <Badge className={evidenceToneClasses(item.evidenceStrength)}>
                                    {item.evidenceStrength}
                                  </Badge>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                  {item.matchedEvidence}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                  {item.recruiterNote}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </details>
                  </div>

                  <div className="job-fit-print-only mt-8 hidden">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                        Akshay Jain Recruiter Tool Summary
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                        {result.verdict} ({Math.round(result.scoreBreakdown.overallScore)}/100)
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{result.summary}</p>
                      <div className="mt-6">
                        <p className="text-sm font-semibold text-slate-900">Recommendation</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {result.screeningRecommendation}
                        </p>
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Strongest alignment</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                            {result.topMatches.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Gaps and risks</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                            {result.topGaps.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">JD brief</p>
                          <p className="mt-3 text-sm leading-6 text-slate-700">
                            {result.normalizedJobBrief.roleSummary}
                          </p>
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                            {result.normalizedJobBrief.cleanedJobDescription}
                          </p>
                          <div className="mt-4 text-sm leading-6 text-slate-600">
                            <p>
                              <span className="font-medium text-slate-900">Tools:</span>{" "}
                              {compactList(result.normalizedJobBrief.tools)}
                            </p>
                            <p>
                              <span className="font-medium text-slate-900">Stakeholder:</span>{" "}
                              {compactList(result.normalizedJobBrief.stakeholderSignals)}
                            </p>
                            <p>
                              <span className="font-medium text-slate-900">Seniority:</span>{" "}
                              {compactList(result.normalizedJobBrief.senioritySignals)}
                            </p>
                            <p>
                              <span className="font-medium text-slate-900">Constraints:</span>{" "}
                              {compactList(result.normalizedJobBrief.constraints)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Requirement map</p>
                          <div className="mt-3 space-y-3">
                            {result.requirementMap.map((item, index) => (
                              <div key={`${item.requirement}-${index}`} className="rounded-xl border border-slate-200 p-3">
                                <p className="text-sm font-semibold text-slate-900">
                                  {item.requirement}
                                </p>
                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                                  {item.importance} • {item.category} • {item.evidenceStrength}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {item.matchedEvidence}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                  {item.recruiterNote}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[16rem] flex-col justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-6 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    What recruiters get
                  </p>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <li>A transparent score with skills, experience, domain, and seniority breakdowns.</li>
                    <li>Three strongest alignment signals recruiters can scan quickly.</li>
                    <li>Three gaps or risks to validate before the screening call.</li>
                    <li>Screening questions and requirement mapping when deeper review is needed.</li>
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
