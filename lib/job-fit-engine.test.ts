import { describe, expect, it } from "vitest";
import {
  computeScore,
  mapRequirementsToEvidence,
  verdictFromScore,
} from "@/lib/job-fit-engine";
import type { NormalizedJobBrief, NormalizedJobRequirement } from "@/lib/job-fit";
import { buildPortfolioEvidenceUnits } from "@/lib/portfolio-evidence";

const allEvidence = buildPortfolioEvidenceUnits();

function requirement(
  canonicalLabel: string,
  importance: NormalizedJobRequirement["importance"],
  category: NormalizedJobRequirement["category"],
): NormalizedJobRequirement {
  return {
    canonicalLabel,
    sourceText: canonicalLabel,
    importance,
    category,
    isExplicit: true,
    notes: "",
  };
}

function brief(overrides: Partial<NormalizedJobBrief>): NormalizedJobBrief {
  return {
    roleSummary: "Analytics role",
    cleanedJobDescription: "",
    coreRequirements: [],
    secondaryRequirements: [],
    tools: [],
    stakeholderSignals: [],
    senioritySignals: [],
    constraints: [],
    unclearItems: [],
    ...overrides,
  };
}

describe("mapRequirementsToEvidence golden fixtures", () => {
  it("classifies a strong-fit JD (Power BI + stakeholder analytics) as direct evidence", () => {
    const normalizedBrief = brief({
      roleSummary: "Analytics Engineer partnering with business stakeholders on Power BI reporting",
      coreRequirements: [
        requirement("Power BI", "Core", "Tool"),
        requirement("SQL", "Core", "Tool"),
        requirement("stakeholder communication", "Core", "Stakeholder"),
      ],
    });

    const requirementMap = mapRequirementsToEvidence(normalizedBrief, allEvidence);

    for (const item of requirementMap) {
      expect(item.evidenceStrength).toBe("Direct evidence");
      expect(item.matchedEvidenceIds.length).toBeGreaterThan(0);
    }

    const scoreBreakdown = computeScore(normalizedBrief, requirementMap);
    expect(scoreBreakdown.overallScore).toBeGreaterThanOrEqual(70);
    expect(verdictFromScore(scoreBreakdown)).not.toBe("Not ideal");
  });

  it("does not classify a JD requiring a completely absent technology as direct evidence", () => {
    const normalizedBrief = brief({
      roleSummary: "Backend engineer role",
      coreRequirements: [
        requirement("Kubernetes container orchestration", "Core", "Tool"),
        requirement("Java backend development", "Core", "Tool"),
      ],
    });

    const requirementMap = mapRequirementsToEvidence(normalizedBrief, allEvidence);

    for (const item of requirementMap) {
      expect(item.evidenceStrength).not.toBe("Direct evidence");
    }

    const scoreBreakdown = computeScore(normalizedBrief, requirementMap);
    expect(scoreBreakdown.overallScore).toBeLessThan(70);
    expect(verdictFromScore(scoreBreakdown)).not.toBe("Strong fit");
  });

  it("does not let common requirements crowd out a niche core requirement (regression guard)", () => {
    // Regression guard for the top-N global crowding bug: mapRequirementsToEvidence must be given
    // the full evidence corpus (not a pre-filtered shortlist) so a niche-but-real requirement like
    // Azure Databricks isn't starved out by more generic requirements sharing common tokens.
    const normalizedBrief = brief({
      roleSummary: "Analytics role requiring broad business and technical collaboration",
      coreRequirements: [
        requirement("business partnership", "Core", "Stakeholder"),
        requirement("data analysis", "Core", "Capability"),
        requirement("reporting", "Core", "Capability"),
        requirement("communication", "Core", "Stakeholder"),
        requirement("Azure Databricks", "Core", "Tool"),
      ],
    });

    const requirementMap = mapRequirementsToEvidence(normalizedBrief, allEvidence);
    const databricksRequirement = requirementMap.find((item) => item.requirement === "Azure Databricks");

    expect(databricksRequirement?.evidenceStrength).not.toBe("No clear evidence");
    expect(databricksRequirement?.matchedEvidenceIds.length).toBeGreaterThan(0);
  });

  it("caps the score when the JD looks senior/lead but seniority evidence is not direct", () => {
    const normalizedBrief = brief({
      roleSummary: "Senior Lead Analytics Manager overseeing a data team",
      senioritySignals: ["Senior", "Lead", "Manager"],
      coreRequirements: [
        requirement("SQL", "Core", "Tool"),
        requirement("team leadership", "Core", "Seniority"),
      ],
    });

    const requirementMap = mapRequirementsToEvidence(normalizedBrief, allEvidence);
    const scoreBreakdown = computeScore(normalizedBrief, requirementMap);

    expect(scoreBreakdown.overallScore).toBeLessThanOrEqual(59);
    expect(scoreBreakdown.scoreRationale).toContain("seniority risk");
  });
});
