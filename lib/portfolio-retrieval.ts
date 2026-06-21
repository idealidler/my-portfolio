import {
  contactLinks,
  education,
  experience,
  featuredProjects,
  profileNarratives,
  selectedAnalysisProjects,
  skillGroups,
} from "@/data/portfolio";

type PortfolioSection = {
  id: string;
  title: string;
  kind: "profile" | "experience" | "project" | "skills" | "education" | "contact";
  text: string;
  keywords: string[];
  priority: number;
};

type QueryIntent =
  | "education"
  | "contact"
  | "skills"
  | "projects"
  | "experience"
  | "holman"
  | "impact"
  | "fit"
  | "working-style"
  | "authorization";

const stopWords = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "best",
  "can",
  "did",
  "do",
  "does",
  "for",
  "from",
  "he",
  "her",
  "his",
  "how",
  "i",
  "in",
  "is",
  "it",
  "kind",
  "me",
  "of",
  "on",
  "or",
  "role",
  "roles",
  "should",
  "summarize",
  "tell",
  "that",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
]);

const synonymGroups = [
  ["holman", "fleet", "operational", "call", "center", "asa", "po"],
  ["impact", "metric", "metrics", "hours", "automation", "reduced", "saved"],
  ["project", "projects", "portfolio", "product", "github", "demo"],
  ["skill", "skills", "tools", "stack", "technology", "technologies"],
  ["style", "strength", "strengths", "ambiguous", "consultant", "consultative"],
  ["role", "roles", "fit", "suited", "career", "targeting"],
  ["contact", "email", "linkedin", "calendly", "resume"],
  ["backend", "python", "sql", "dbt", "databricks", "fabric", "etl"],
  ["bi", "power", "dashboard", "dashboards", "reporting", "semantic", "model"],
  [
    "education",
    "school",
    "college",
    "university",
    "degree",
    "graduate",
    "graduated",
    "graduation",
    "alma",
    "mater",
    "master",
    "masters",
    "bachelor",
    "bachelors",
    "undergrad",
    "undergraduate",
  ],
];

const intentTerms: Record<QueryIntent, string[]> = {
  education: [
    "education",
    "school",
    "college",
    "university",
    "degree",
    "graduate",
    "graduated",
    "graduation",
    "study",
    "studied",
    "major",
    "masters",
    "bachelors",
    "undergrad",
  ],
  contact: [
    "contact",
    "email",
    "reach",
    "linkedin",
    "calendly",
    "calendar",
    "schedule",
    "resume",
    "cv",
  ],
  skills: [
    "skill",
    "skills",
    "tool",
    "tools",
    "stack",
    "technology",
    "technologies",
    "sql",
    "python",
    "power",
    "bi",
    "dbt",
    "databricks",
    "fabric",
    "dax",
    "react",
    "next",
    "typescript",
  ],
  projects: [
    "project",
    "projects",
    "portfolio",
    "github",
    "demo",
    "built",
    "build",
    "app",
    "application",
    "product",
    "products",
    "h1b",
    "gitdecode",
    "contextly",
    "tracker",
  ],
  experience: [
    "experience",
    "work",
    "worked",
    "job",
    "jobs",
    "company",
    "companies",
    "employer",
    "employers",
    "career",
    "professional",
    "intern",
    "internship",
  ],
  holman: [
    "holman",
    "fleet",
    "flagship",
    "call",
    "center",
    "po",
    "asa",
    "medallion",
    "gold",
    "client",
    "account",
  ],
  impact: [
    "impact",
    "metric",
    "metrics",
    "result",
    "results",
    "outcome",
    "outcomes",
    "saved",
    "reduced",
    "improved",
    "increase",
    "lift",
    "users",
    "hours",
  ],
  fit: [
    "fit",
    "role",
    "roles",
    "suited",
    "target",
    "targeting",
    "hire",
    "hiring",
    "recruiter",
    "manager",
    "analyst",
    "engineer",
  ],
  "working-style": [
    "style",
    "strength",
    "strengths",
    "approach",
    "approaches",
    "problem",
    "problems",
    "ambiguous",
    "ambiguity",
    "stakeholder",
    "stakeholders",
    "communicate",
    "communication",
  ],
  authorization: [
    "authorization",
    "authorized",
    "visa",
    "h1b",
    "1b",
    "sponsorship",
    "sponsor",
    "immigration",
    "relocate",
    "relocation",
  ],
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function expandTokens(tokens: string[]) {
  const expanded = new Set(tokens);

  for (const group of synonymGroups) {
    if (group.some((term) => expanded.has(term))) {
      group.forEach((term) => expanded.add(term));
    }
  }

  return expanded;
}

function detectIntents(queryTokens: Set<string>) {
  const intents = new Set<QueryIntent>();

  for (const [intent, terms] of Object.entries(intentTerms) as [QueryIntent, string[]][]) {
    if (terms.some((term) => queryTokens.has(term))) {
      intents.add(intent);
    }
  }

  return intents;
}

function intentSectionIds(intents: Set<QueryIntent>) {
  const ids = new Set<string>();

  if (intents.has("education")) {
    ids.add("education");
  }

  if (intents.has("contact")) {
    ids.add("contact");
  }

  if (intents.has("skills")) {
    ids.add("skills");
  }

  if (intents.has("projects")) {
    for (const sectionItem of portfolioSections) {
      if (sectionItem.kind === "project") {
        ids.add(sectionItem.id);
      }
    }
  }

  if (intents.has("experience")) {
    for (const sectionItem of portfolioSections) {
      if (sectionItem.kind === "experience") {
        ids.add(sectionItem.id);
      }
    }
  }

  if (intents.has("holman") || intents.has("impact")) {
    ids.add("experience-holman");
  }

  if (intents.has("fit")) {
    ids.add("profile-careerGoals");
    ids.add("profile-about");
    ids.add("skills");
    ids.add("experience-holman");
  }

  if (intents.has("working-style")) {
    ids.add("profile-workStyle");
    ids.add("profile-problemSolving");
    ids.add("profile-about");
  }

  if (intents.has("authorization")) {
    ids.add("profile-work-authorization");
  }

  return ids;
}

function uniqueSections(sections: PortfolioSection[]) {
  const seen = new Set<string>();

  return sections.filter((sectionItem) => {
    if (seen.has(sectionItem.id)) {
      return false;
    }

    seen.add(sectionItem.id);
    return true;
  });
}

function section({
  id,
  title,
  kind,
  text,
  keywords,
  priority,
}: PortfolioSection): PortfolioSection {
  return { id, title, kind, text, keywords, priority };
}

const portfolioSections: PortfolioSection[] = [
  section({
    id: "contact",
    title: "Contact",
    kind: "contact",
    priority: 1.2,
    keywords: ["contact", "email", "linkedin", "calendly", "resume"],
    text: [
      `Email: ${contactLinks.email.replace("mailto:", "")}`,
      `LinkedIn: ${contactLinks.linkedin}`,
      `Calendly: ${contactLinks.calendly}`,
      `Resume: ${contactLinks.resume}`,
    ].join("\n"),
  }),
  section({
    id: "profile-work-authorization",
    title: "Work Authorization",
    kind: "profile",
    priority: 1.35,
    keywords: [
      "work authorization",
      "authorized",
      "visa",
      "H-1B",
      "H1B",
      "sponsorship",
      "immigration",
      "relocation",
    ],
    text: "Authorized to work in the U.S. on an H-1B visa. Open to relocation and conversations around analytics engineering, data engineering, BI, and data product roles.",
  }),
  ...Object.entries(profileNarratives).map(([key, item]) =>
    section({
      id: `profile-${key}`,
      title: item.title,
      kind: "profile",
      priority: key === "about" || key === "workStyle" ? 1.35 : 1.15,
      keywords: [item.title, key, "working style", "strengths", "problem solving", "career"],
      text: item.body,
    }),
  ),
  ...experience.map((item) =>
    section({
      id: `experience-${item.company.toLowerCase()}`,
      title: `${item.role} at ${item.company}`,
      kind: "experience",
      priority: item.company === "Holman" ? 1.45 : 1.2,
      keywords: [item.company, item.role, item.location, item.period, ...item.tools],
      text: [
        `${item.role} at ${item.company} (${item.period}, ${item.location})`,
        `Summary: ${item.summary}`,
        `Impact:\n- ${item.impact.join("\n- ")}`,
        `Tools: ${item.tools.join(", ")}`,
      ].join("\n"),
    }),
  ),
  section({
    id: "skills",
    title: "Skills",
    kind: "skills",
    priority: 1.2,
    keywords: ["skills", "tools", "technologies", ...skillGroups.flatMap((group) => group.items)],
    text: skillGroups.map((group) => `${group.label}: ${group.items.join(", ")}`).join("\n"),
  }),
  ...[...featuredProjects, ...selectedAnalysisProjects].map((project) =>
    section({
      id: `project-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: project.title,
      kind: "project",
      priority: project.featured ? 1.35 : 1.05,
      keywords: [
        project.title,
        project.role,
        project.industry,
        project.status,
        String(project.year),
        ...project.stack,
      ],
      text: [
        `${project.title} [${project.status}, ${project.year}]`,
        `Role: ${project.role}`,
        `Summary: ${project.summary}`,
        `Why it matters: ${project.whyItMatters}`,
        `Problem: ${project.problem}`,
        `Highlights:\n- ${project.highlights.join("\n- ")}`,
        `Stack: ${project.stack.join(", ")}`,
        `GitHub: ${project.github}${project.demo ? `\nDemo: ${project.demo}` : ""}`,
      ].join("\n"),
    }),
  ),
  section({
    id: "education",
    title: "Education",
    kind: "education",
    priority: 1.25,
    keywords: [
      "education",
      "school",
      "college",
      "university",
      "degree",
      "graduate",
      "graduated",
      "graduation",
      "alma mater",
      "master",
      "bachelor",
      ...education.flatMap((item) => [item.school, item.degree, item.location, item.period]),
    ],
    text: education
      .map((item) => `${item.degree} — ${item.school} (${item.period}, ${item.location})`)
      .join("\n"),
  }),
];

const compactOverview = [
  "Portfolio owner: Akshay Jain",
  "Positioning: business-facing data professional focused on analytics, BI, data products, stakeholder problem solving, and durable reporting systems.",
  "Work authorization: Authorized to work in the U.S. on an H-1B visa; open to relocation for the right analytics, BI, data engineering, or data product role.",
  `Education: ${education
    .map((item) => `${item.degree} from ${item.school} (${item.period}, ${item.location})`)
    .join(" | ")}`,
  `Primary skills: ${skillGroups
    .map((group) => `${group.label}: ${group.items.join(", ")}`)
    .join(" | ")}`,
  `Contact: ${contactLinks.email.replace("mailto:", "")}; ${contactLinks.linkedin}`,
].join("\n");

function scoreSection(sectionItem: PortfolioSection, queryTokens: Set<string>) {
  const titleTokens = tokenize(sectionItem.title);
  const keywordTokens = tokenize(sectionItem.keywords.join(" "));
  const bodyTokens = tokenize(sectionItem.text);
  let score = 0;

  for (const token of queryTokens) {
    if (titleTokens.includes(token)) {
      score += 7;
    }

    if (keywordTokens.includes(token)) {
      score += 5;
    }

    if (bodyTokens.includes(token)) {
      score += 2;
    }
  }

  return score * sectionItem.priority;
}

export function retrievePortfolioContext(query: string, maxSections = 5) {
  const queryTokens = expandTokens(tokenize(query));
  const forcedSectionIds = intentSectionIds(detectIntents(queryTokens));
  const rankedSections = portfolioSections
    .map((sectionItem) => ({
      section: sectionItem,
      score: scoreSection(sectionItem, queryTokens),
    }))
    .sort((left, right) => right.score - left.score);

  const forcedSections = portfolioSections.filter((sectionItem) => forcedSectionIds.has(sectionItem.id));
  const rankedMatches = rankedSections
    .filter((item) => item.score > 0)
    .map((item) => item.section);
  const selected = uniqueSections([...forcedSections, ...rankedMatches]).slice(0, maxSections);

  const fallbackSections =
    selected.length > 0
      ? selected
      : portfolioSections.filter((item) =>
          ["profile-about", "profile-workStyle", "experience-holman", "skills"].includes(item.id),
        );

  return [
    compactOverview,
    "",
    "Retrieved portfolio evidence:",
    fallbackSections
      .map((item, index) => [`Evidence ${index + 1}: ${item.title}`, item.text].join("\n"))
      .join("\n\n"),
  ].join("\n");
}

export function getPortfolioContextStats() {
  return {
    sections: portfolioSections.length,
    compactOverviewCharacters: compactOverview.length,
  };
}
