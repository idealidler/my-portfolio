import {
  education,
  experience,
  featuredProjects,
  profileNarratives,
  selectedAnalysisProjects,
} from "@/data/portfolio";
import type { PortfolioEvidenceUnit } from "@/lib/job-fit";

const capabilityMap: Record<string, string[]> = {
  Holman: [
    "analytics engineering",
    "business intelligence",
    "semantic modeling",
    "reporting automation",
    "stakeholder communication",
    "agile delivery",
    "operational analytics",
    "data transformation",
    "executive reporting",
  ],
  Collabera: ["business intelligence", "sql optimization", "power bi", "kpi reporting"],
  LabWare: ["etl", "machine learning", "data visualization", "python pipelines"],
};

function extractMetric(text: string) {
  const match = text.match(/(\d[\d,+]*\+?(?:\s?(?:hours|users|sec|seconds|%|accuracy))?)/i);
  return match?.[1];
}

function normalizeTags(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function buildPortfolioEvidenceUnits() {
  const units: PortfolioEvidenceUnit[] = [];

  for (const item of experience) {
    units.push({
      id: `exp-${slugify(item.company)}-summary`,
      claim: item.summary,
      sourceArea: `${item.role} at ${item.company}`,
      capabilities: normalizeTags(capabilityMap[item.company] ?? ["analytics", "stakeholder communication"]),
      tools: normalizeTags(item.tools),
      evidenceStrength: "strong",
    });

    for (const [index, impact] of item.impact.entries()) {
      units.push({
        id: `exp-${slugify(item.company)}-impact-${index + 1}`,
        claim: impact,
        sourceArea: `${item.role} at ${item.company}`,
        capabilities: normalizeTags([...(capabilityMap[item.company] ?? []), item.role, item.company]),
        tools: normalizeTags(item.tools),
        metric: extractMetric(impact),
        evidenceStrength: impact.match(/\d/) ? "strong" : "supporting",
      });
    }
  }

  for (const project of [...featuredProjects, ...selectedAnalysisProjects]) {
    units.push({
      id: `project-${project.slug}-summary`,
      claim: project.summary,
      sourceArea: `${project.title} project`,
      capabilities: normalizeTags([project.role, project.industry, "product thinking", ...project.stack]),
      tools: normalizeTags(project.stack),
      evidenceStrength: project.featured ? "strong" : "supporting",
    });

    for (const [index, highlight] of project.highlights.entries()) {
      units.push({
        id: `project-${project.slug}-highlight-${index + 1}`,
        claim: highlight,
        sourceArea: `${project.title} project`,
        capabilities: normalizeTags([project.role, project.industry, "project execution", ...project.stack]),
        tools: normalizeTags(project.stack),
        metric: extractMetric(highlight),
        evidenceStrength: project.featured ? "strong" : "supporting",
      });
    }
  }

  for (const narrative of Object.values(profileNarratives)) {
    units.push({
      id: `narrative-${slugify(narrative.title)}`,
      claim: narrative.body,
      sourceArea: narrative.title,
      capabilities: normalizeTags([narrative.title.toLowerCase(), "communication", "working style"]),
      tools: [],
      evidenceStrength: "supporting",
    });
  }

  for (const item of education) {
    units.push({
      id: `education-${slugify(item.school)}`,
      claim: `${item.degree} from ${item.school}`,
      sourceArea: "Education",
      capabilities: ["education"],
      tools: [],
      evidenceStrength: "supporting",
    });
  }

  return units;
}

export function buildPortfolioEvidenceContext() {
  return buildPortfolioEvidenceUnits()
    .map((unit, index) => {
      const metricLine = unit.metric ? `\nMetric: ${unit.metric}` : "";

      return [
        `Evidence ${index + 1}`,
        `ID: ${unit.id}`,
        `Source: ${unit.sourceArea}`,
        `Claim: ${unit.claim}`,
        `Capabilities: ${unit.capabilities.join(", ")}`,
        `Tools: ${unit.tools.join(", ") || "None"}`,
        `Evidence strength: ${unit.evidenceStrength}`,
        metricLine,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}
