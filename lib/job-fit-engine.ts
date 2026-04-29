import type {
  EvidenceStrength,
  JobFitVerdict,
  MatchScoreBreakdown,
  NormalizedJobBrief,
  NormalizedJobRequirement,
  PortfolioEvidenceUnit,
  RequirementEvidenceClassification,
  RequirementMapItem,
} from "@/lib/job-fit";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "build",
  "for",
  "from",
  "has",
  "have",
  "in",
  "into",
  "is",
  "of",
  "on",
  "or",
  "our",
  "the",
  "to",
  "using",
  "with",
]);

const skillAliases: Record<string, string[]> = {
  "business intelligence": ["bi", "dashboard", "dashboards", "reporting", "analytics reporting"],
  "power bi": ["powerbi", "pbi", "dashboard", "dashboards", "dax"],
  "semantic modeling": ["semantic model", "semantic models", "star schema", "dimensional modeling"],
  "data modeling": ["semantic modeling", "star schema", "dimensional modeling", "dbt"],
  "data transformation": ["etl", "elt", "dbt", "databricks", "pipeline", "pipelines"],
  "analytics engineering": ["analytics engineer", "analytics engineering", "dbt", "semantic modeling"],
  "stakeholder communication": ["stakeholder", "stakeholders", "business partner", "executive", "cross-functional"],
  "python": ["pandas", "scikit-learn", "xgboost", "automation", "etl"],
  "sql": ["sql server", "databricks sql", "snowflake", "query", "queries"],
  "dbt": ["models", "macros", "silver", "gold", "transformation"],
  "azure databricks": ["databricks", "lakehouse", "silver", "gold"],
  "tableau": ["dashboard", "data visualization"],
};

const directMatchThreshold = 10;
const adjacentMatchThreshold = 3;

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ");
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function requirementId(requirement: NormalizedJobRequirement, index: number) {
  const label = normalizeText(requirement.canonicalLabel).trim().replace(/\s+/g, "-");
  return `req-${index + 1}-${label || "requirement"}`;
}

function requirementTerms(requirement: NormalizedJobRequirement) {
  const base = [
    requirement.canonicalLabel,
    requirement.sourceText,
    requirement.category,
    requirement.notes,
  ];
  const expanded = base.flatMap((value) => {
    const key = normalizeText(value).trim();
    return [value, ...(skillAliases[key] ?? [])];
  });

  return unique(expanded.flatMap(tokenize));
}

function evidenceTerms(evidence: PortfolioEvidenceUnit) {
  return unique(
    [
      evidence.claim,
      evidence.sourceArea,
      ...evidence.capabilities,
      ...evidence.tools,
      evidence.metric ?? "",
    ].flatMap(tokenize),
  );
}

function phraseMatches(needle: string, haystack: string) {
  const normalizedNeedle = normalizeText(needle).trim();
  const normalizedHaystack = normalizeText(haystack);

  if (!normalizedNeedle) {
    return false;
  }

  return normalizedHaystack.includes(normalizedNeedle);
}

function scoreEvidenceForRequirement(
  requirement: NormalizedJobRequirement,
  evidence: PortfolioEvidenceUnit,
) {
  const terms = requirementTerms(requirement);
  const evidenceText = [
    evidence.claim,
    evidence.sourceArea,
    ...evidence.capabilities,
    ...evidence.tools,
  ].join(" ");
  const evidenceTokenSet = new Set(evidenceTerms(evidence));
  let score = 0;

  for (const term of terms) {
    if (evidenceTokenSet.has(term)) {
      score += 2;
    }
  }

  const canonical = normalizeText(requirement.canonicalLabel).trim();
  const aliases = skillAliases[canonical] ?? [];
  if (phraseMatches(requirement.canonicalLabel, evidenceText)) {
    score += 8;
  }

  for (const alias of aliases) {
    if (phraseMatches(alias, evidenceText)) {
      score += 5;
    }
  }

  if (evidence.evidenceStrength === "strong") {
    score += 1;
  }

  return score;
}

function classifyEvidenceScore(score: number): RequirementEvidenceClassification {
  if (score >= directMatchThreshold) {
    return "direct";
  }

  if (score >= adjacentMatchThreshold) {
    return "adjacent";
  }

  return "missing";
}

function toEvidenceStrength(classification: RequirementEvidenceClassification): EvidenceStrength {
  if (classification === "direct") {
    return "Direct evidence";
  }

  if (classification === "adjacent") {
    return "Adjacent evidence";
  }

  return "No clear evidence";
}

function formatEvidenceSummary(matches: PortfolioEvidenceUnit[]) {
  if (!matches.length) {
    return "No explicit portfolio evidence was retrieved for this requirement.";
  }

  return matches
    .slice(0, 2)
    .map((evidence) => `${evidence.id}: ${evidence.claim}`)
    .join(" ");
}

function recruiterNoteForClassification(classification: RequirementEvidenceClassification) {
  if (classification === "direct") {
    return "Directly supported by retrieved portfolio evidence.";
  }

  if (classification === "adjacent") {
    return "Supported by transferable or related evidence; validate exact depth in screening.";
  }

  return "No clear retrieved evidence; treat this as a screening risk or gap.";
}

export function retrieveRelevantEvidence(
  normalizedBrief: NormalizedJobBrief,
  allEvidence: PortfolioEvidenceUnit[],
  limit = 10,
) {
  const requirements = [
    ...normalizedBrief.coreRequirements,
    ...normalizedBrief.secondaryRequirements,
  ];
  const queryText = [
    normalizedBrief.roleSummary,
    ...requirements.map((requirement) => requirement.canonicalLabel),
    ...normalizedBrief.tools,
    ...normalizedBrief.stakeholderSignals,
    ...normalizedBrief.senioritySignals,
  ].join(" ");
  const queryTokens = new Set(tokenize(queryText));

  const rankedEvidence = allEvidence
    .map((evidence) => {
      const terms = evidenceTerms(evidence);
      const tokenOverlap = terms.filter((term) => queryTokens.has(term)).length;
      const requirementScore = requirements.reduce(
        (total, requirement) => total + scoreEvidenceForRequirement(requirement, evidence),
        0,
      );
      const toolBoost = normalizedBrief.tools.some((tool) =>
        evidence.tools.some((evidenceTool) => phraseMatches(tool, evidenceTool)),
      )
        ? 8
        : 0;
      const strengthBoost = evidence.evidenceStrength === "strong" ? 3 : 0;

      return {
        evidence,
        score: tokenOverlap + requirementScore + toolBoost + strengthBoost,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (rankedEvidence.length) {
    return rankedEvidence.slice(0, limit).map((item) => item.evidence);
  }

  return allEvidence
    .filter((evidence) => evidence.evidenceStrength === "strong")
    .slice(0, Math.min(3, limit));
}

export function mapRequirementsToEvidence(
  normalizedBrief: NormalizedJobBrief,
  evidenceUnits: PortfolioEvidenceUnit[],
) {
  const requirements = [
    ...normalizedBrief.coreRequirements,
    ...normalizedBrief.secondaryRequirements,
  ];

  return requirements.map<RequirementMapItem>((requirement, index) => {
    const scoredEvidence = evidenceUnits
      .map((evidence) => ({
        evidence,
        score: scoreEvidenceForRequirement(requirement, evidence),
      }))
      .filter((item) => item.score >= adjacentMatchThreshold)
      .sort((left, right) => right.score - left.score);
    const topEvidence = scoredEvidence.slice(0, 3).map((item) => item.evidence);
    const bestClassification = classifyEvidenceScore(scoredEvidence[0]?.score ?? 0);

    return {
      requirementId: requirementId(requirement, index),
      requirement: requirement.canonicalLabel,
      category: requirement.category,
      importance: requirement.importance,
      evidenceStrength: toEvidenceStrength(bestClassification),
      matchedEvidenceIds: topEvidence.map((evidence) => evidence.id),
      matchedEvidence: formatEvidenceSummary(topEvidence),
      recruiterNote: recruiterNoteForClassification(bestClassification),
    };
  });
}

function classificationValue(item: RequirementMapItem) {
  if (item.evidenceStrength === "Direct evidence") {
    return 1;
  }

  if (item.evidenceStrength === "Adjacent evidence") {
    return 0.55;
  }

  return 0;
}

function requirementWeight(item: RequirementMapItem) {
  const importanceWeight = item.importance === "Core" ? 2 : 1;
  const categoryWeight: Record<RequirementMapItem["category"], number> = {
    Capability: 1.2,
    Tool: 1.15,
    Stakeholder: 1,
    Domain: 0.85,
    Seniority: 1.25,
    Constraint: 0.7,
  };

  return importanceWeight * categoryWeight[item.category];
}

function weightedScore(items: RequirementMapItem[], category?: RequirementMapItem["category"]) {
  const scoped = category ? items.filter((item) => item.category === category) : items;
  const fallback = scoped.length ? scoped : items;
  const weightedTotal = fallback.reduce(
    (total, item) => total + classificationValue(item) * requirementWeight(item),
    0,
  );
  const maxTotal = fallback.reduce((total, item) => total + requirementWeight(item), 0);

  return maxTotal ? Math.round((weightedTotal / maxTotal) * 100) : 0;
}

function inferSeniorityRisk(normalizedBrief: NormalizedJobBrief, requirementMap: RequirementMapItem[]) {
  const seniorityText = [
    normalizedBrief.roleSummary,
    ...normalizedBrief.senioritySignals,
    ...requirementMap.map((item) => item.requirement),
  ]
    .join(" ")
    .toLowerCase();
  const roleLooksSenior = /\b(senior|lead|staff|principal|manager|architect)\b/.test(seniorityText);
  const seniorityItems = requirementMap.filter((item) => item.category === "Seniority");
  const hasDirectSeniorityEvidence = seniorityItems.some(
    (item) => item.evidenceStrength === "Direct evidence",
  );

  return roleLooksSenior && !hasDirectSeniorityEvidence;
}

export function computeScore(
  normalizedBrief: NormalizedJobBrief,
  requirementMap: RequirementMapItem[],
): MatchScoreBreakdown {
  const skillsMatch = Math.round(
    weightedScore(requirementMap.filter((item) => item.category === "Tool" || item.category === "Capability")),
  );
  const experienceRelevance = Math.round(
    weightedScore(
      requirementMap.filter(
        (item) =>
          item.category === "Capability" ||
          item.category === "Stakeholder" ||
          item.category === "Seniority",
      ),
    ),
  );
  const domainAlignment = weightedScore(requirementMap, "Domain");
  const seniorityFit = weightedScore(requirementMap, "Seniority");
  const rawOverall = Math.round(
    skillsMatch * 0.35 +
      experienceRelevance * 0.3 +
      domainAlignment * 0.15 +
      seniorityFit * 0.2,
  );
  const missingCoreCount = requirementMap.filter(
    (item) => item.importance === "Core" && item.evidenceStrength === "No clear evidence",
  ).length;
  let overallScore = rawOverall;
  const caps: string[] = [];

  if (missingCoreCount >= 1) {
    overallScore = Math.min(overallScore, 84);
    caps.push("capped below Strong fit because at least one core requirement lacks clear evidence");
  }

  if (missingCoreCount >= 2) {
    overallScore = Math.min(overallScore, 69);
    caps.push("capped below Moderate fit because multiple core requirements lack clear evidence");
  }

  if (inferSeniorityRisk(normalizedBrief, requirementMap)) {
    overallScore = Math.min(overallScore, 59);
    caps.push("capped for seniority risk because the JD appears senior/lead but direct seniority evidence is limited");
  }

  const directCoreCount = requirementMap.filter(
    (item) => item.importance === "Core" && item.evidenceStrength === "Direct evidence",
  ).length;
  const coreCount = requirementMap.filter((item) => item.importance === "Core").length;
  const scoreRationale = [
    `Programmatic score based on ${directCoreCount}/${coreCount} core requirements with direct evidence.`,
    caps.length ? `Rules applied: ${caps.join("; ")}.` : "No hard score caps were triggered.",
  ].join(" ");

  return {
    overallScore,
    skillsMatch,
    experienceRelevance,
    domainAlignment,
    seniorityFit,
    scoreRationale,
  };
}

export function verdictFromScore(scoreBreakdown: MatchScoreBreakdown): JobFitVerdict {
  if (scoreBreakdown.overallScore >= 85) {
    return "Strong fit";
  }

  if (scoreBreakdown.overallScore >= 70) {
    return "Moderate fit";
  }

  if (scoreBreakdown.overallScore >= 50) {
    return "Stretch";
  }

  return "Not ideal";
}
