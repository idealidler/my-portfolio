export type JobFitVerdict = "Strong" | "Plausible" | "Stretch" | "Weak";

export type JobRequirementImportance = "Core" | "Secondary";

export type JobRequirementCategory =
  | "Capability"
  | "Tool"
  | "Stakeholder"
  | "Domain"
  | "Seniority"
  | "Constraint";

export type EvidenceStrength = "Direct evidence" | "Adjacent evidence" | "No clear evidence";

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
  requirement: string;
  category: JobRequirementCategory;
  importance: JobRequirementImportance;
  evidenceStrength: EvidenceStrength;
  matchedEvidence: string;
  recruiterNote: string;
};

export type JobFitResult = {
  verdict: JobFitVerdict;
  summary: string;
  topMatches: string[];
  topGaps: string[];
  screeningRecommendation: string;
  requirementMap: RequirementMapItem[];
  normalizedJobBrief: NormalizedJobBrief;
};

export type PortfolioEvidenceUnit = {
  claim: string;
  sourceArea: string;
  capabilities: string[];
  tools: string[];
  metric?: string;
  evidenceStrength: "strong" | "supporting";
};

export const jobFitSampleDescription = `We are hiring an Analytics Engineer to partner with business stakeholders, build semantic models, develop Power BI dashboards, and improve reporting automation. The ideal candidate has experience with SQL, Python, dbt, Azure Databricks, stakeholder communication, and translating ambiguous business needs into scalable analytics solutions.`;
