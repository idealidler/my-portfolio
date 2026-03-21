export type JobFitPriority = {
  requirement: string;
  evidence: string;
  confidence: "Direct evidence" | "Related evidence" | "Limited evidence";
};

export type JobFitResult = {
  fitLabel: "Strong fit" | "Relevant fit" | "Partial fit";
  summary: string;
  priorities: JobFitPriority[];
  whyGoodFit: string[];
  whyNotFit: string[];
  recruiterTakeaway: string;
};

export const jobFitSampleDescription = `We are hiring an Analytics Engineer to partner with business stakeholders, build semantic models, develop Power BI dashboards, and improve reporting automation. The ideal candidate has experience with SQL, Python, dbt, Databricks, stakeholder communication, and translating ambiguous business needs into scalable analytics solutions.`;
