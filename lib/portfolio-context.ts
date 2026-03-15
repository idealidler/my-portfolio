import {
  contactLinks,
  education,
  experience,
  featuredProjects,
  profileNarratives,
  selectedAnalysisProjects,
  skillGroups,
} from "@/data/portfolio";

export function buildPortfolioContext() {
  const experienceSection = experience
    .map(
      (item) =>
        `${item.role} at ${item.company} (${item.period}, ${item.location})\nSummary: ${item.summary}\nImpact:\n- ${item.impact.join("\n- ")}\nTools: ${item.tools.join(", ")}`,
    )
    .join("\n\n");

  const projectSection = [...featuredProjects, ...selectedAnalysisProjects]
    .map(
      (project) =>
        `${project.title} [${project.status}, ${project.year}]\nRole: ${project.role}\nSummary: ${project.summary}\nWhy it matters: ${project.whyItMatters}\nProblem: ${project.problem}\nHighlights:\n- ${project.highlights.join("\n- ")}\nStack: ${project.stack.join(", ")}\nGitHub: ${project.github}${project.demo ? `\nDemo: ${project.demo}` : ""}`,
    )
    .join("\n\n");

  const skillsSection = skillGroups
    .map((group) => `${group.label}: ${group.items.join(", ")}`)
    .join("\n");

  const educationSection = education
    .map((item) => `${item.degree} — ${item.school} (${item.period}, ${item.location})`)
    .join("\n");

  const narrativeSection = Object.values(profileNarratives)
    .map((item) => `${item.title}: ${item.body}`)
    .join("\n");

  return `
Portfolio owner: Akshay Jain
Email: ${contactLinks.email.replace("mailto:", "")}
LinkedIn: ${contactLinks.linkedin}
Calendly: ${contactLinks.calendly}

${narrativeSection}

Experience:
${experienceSection}

Education:
${educationSection}

Skills:
${skillsSection}

Projects:
${projectSection}
`.trim();
}
