export type JobFitVerdict = "Strong fit" | "Moderate fit" | "Stretch" | "Not ideal";

export type JobRequirementImportance = "Core" | "Secondary";

export type JobRequirementCategory =
  | "Capability"
  | "Tool"
  | "Stakeholder"
  | "Domain"
  | "Seniority"
  | "Constraint";

export type EvidenceStrength = "Direct evidence" | "Adjacent evidence" | "No clear evidence";
export type RequirementEvidenceClassification = "direct" | "adjacent" | "missing";

export type NormalizedJobRequirement = {
  canonicalLabel: string;
  sourceText: string;
  importance: JobRequirementImportance;
  category: JobRequirementCategory;
  isExplicit: boolean;
  notes: string;
};

export type NormalizedJobBrief = {
  roleSummary: string;
  cleanedJobDescription: string;
  coreRequirements: NormalizedJobRequirement[];
  secondaryRequirements: NormalizedJobRequirement[];
  tools: string[];
  stakeholderSignals: string[];
  senioritySignals: string[];
  constraints: string[];
  unclearItems: string[];
};

export type RequirementMapItem = {
  requirementId: string;
  requirement: string;
  category: JobRequirementCategory;
  importance: JobRequirementImportance;
  evidenceStrength: EvidenceStrength;
  matchedEvidenceIds: string[];
  matchedEvidence: string;
  recruiterNote: string;
};

export type GroundedMatchItem = {
  text: string;
  evidenceIds: string[];
};

export type GroundedGapItem = {
  text: string;
  requirementId: string;
};

export type MatchScoreBreakdown = {
  overallScore: number;
  skillsMatch: number;
  experienceRelevance: number;
  domainAlignment: number;
  seniorityFit: number;
  scoreRationale: string;
};

export type RecruiterInsight = {
  differentiator: string;
  tradeoff: string;
  screeningFocus: string;
};

export type ScreeningQuestion = {
  question: string;
  whyAsk: string;
};

export type JobFitResult = {
  verdict: JobFitVerdict;
  scoreBreakdown: MatchScoreBreakdown;
  summary: string;
  topMatches: GroundedMatchItem[];
  topGaps: GroundedGapItem[];
  recruiterInsight: RecruiterInsight;
  screeningRecommendation: string;
  screeningQuestions: ScreeningQuestion[];
  requirementMap: RequirementMapItem[];
  normalizedJobBrief: NormalizedJobBrief;
  retrievedEvidence: PortfolioEvidenceUnit[];
  cacheStatus?: "hit" | "miss";
};

export type PortfolioEvidenceUnit = {
  id: string;
  claim: string;
  sourceArea: string;
  capabilities: string[];
  tools: string[];
  metric?: string;
  evidenceStrength: "strong" | "supporting";
};

export const jobFitSampleDescription = `We are hiring an Analytics Engineer to partner with business stakeholders, build semantic models, develop Power BI dashboards, and improve reporting automation. The ideal candidate has experience with SQL, Python, dbt, Azure Databricks, stakeholder communication, and translating ambiguous business needs into scalable analytics solutions.`;
