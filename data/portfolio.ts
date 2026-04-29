export type HeroStat = {
  label: string;
  value: string;
  detail: string;
};

export type Highlight = {
  title: string;
  detail: string;
};

export type AudiencePath = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  cta: string;
};

export type ExperienceItem = {
  company: string;
  location: string;
  role: string;
  period: string;
  summary: string;
  impact: string[];
  tools: string[];
};

export type EducationItem = {
  school: string;
  location: string;
  degree: string;
  period: string;
};

export type ProjectItem = {
  title: string;
  slug: string;
  client: string;
  industry: string;
  year: string;
  role: string;
  status: string;
  summary: string;
  whyItMatters: string;
  problem: string;
  highlights: string[];
  stack: string[];
  github: string;
  demo?: string;
  image?: string;
  featured: boolean;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type NarrativeField = {
  title: string;
  body: string;
};

export const recruiterSignals = [
  "Consultative analytics partner for business-facing teams",
  "Turns ambiguous requests into structured, adopted solutions",
  "Translates technical complexity into clear business decisions",
  "Moves quickly while protecting accuracy and trust",
  "Helps teammates unblock analysis, reporting, and delivery problems",
  "Strong ownership across discovery, build, rollout, and iteration",
  "Looks beyond requirements to suggest better analytical approaches",
];

export const heroStats: HeroStat[] = [
  {
    label: "Users on flagship dashboard",
    value: "1000+",
    detail: "Built a flagship Power BI reporting experience that became one of the most active dashboards in the company.",
  },
  {
    label: "Hours saved through automation",
    value: "2000+",
    detail: "Reduced manual reporting at scale by replacing recurring Excel-heavy workflows with automated BI reporting.",
  },
  {
    label: "Client engagement lift",
    value: "30%",
    detail: "Architected executive-level KPIs, driving accountability and reducing missed communications by 80%",
  },
];

export const highlights: Highlight[] = [
  {
    title: "Enterprise BI builder with strong product instincts",
    detail:
      "I connect stakeholder discovery, data modeling, automation, and UX into reporting people actually use.",
  },
  {
    title: "Consultative problem-solver in ambiguous spaces",
    detail:
      "My best work starts with unclear business questions and turns them into practical, measurable decisions.",
  },
  {
    title: "Operational analytics with measurable business impact",
    detail:
      "I build systems that reduce manual effort, improve leadership visibility, and give frontline teams clearer next actions.",
  },
];

export const audiencePaths: AudiencePath[] = [
  {
    eyebrow: "Recruiter path",
    title: "Analyze role fit against a real job description",
    description:
      "Paste a JD and get a recruiter-friendly fit summary, top priorities, honest strengths, and realistic gaps.",
    href: "/recruiter-fit",
    cta: "Open Recruiter Tool",
  },
  {
    eyebrow: "Hiring manager path",
    title: "Business-facing depth across BI, ETL, and data products",
    description:
      "See how stakeholder problems became usable reporting systems, data apps, and decision tools.",
    href: "#projects",
    cta: "See featured work",
  },
  {
    eyebrow: "Interactive path",
    title: "Explore the portfolio with AkshayGPT",
    description:
      "Ask focused questions about projects, business impact, technical strengths, and working style.",
    href: "/akshaygpt",
    cta: "Launch AkshayGPT",
  },
];

export const experience: ExperienceItem[] = [
  {
    company: "Holman",
    location: "Mount Laurel, New Jersey",
    role: "Analytics Engineer",
    period: "July 2023 - Present",
    summary:
      "Owns business-facing analytics delivery from problem discovery through rollout, turning ambiguous operational needs into Power BI reporting, SQL/Python logic, dbt and Databricks transformations, and reusable semantic models.",
    impact: [
      "Delivered Holman's flagship Power BI dashboard by consolidating multiple consulting reports into a single semantic-model-driven experience, now actively used by 1,000+ users enterprise-wide.",
      "Architected a Microsoft Fabric Metrics KPI for senior leadership that drove a 30% lift in active client engagement and an 80% reduction in missed client communications, directly improving account-management accountability.",
      "Consolidated 8 call-center data sources into a unified reporting model, eliminating Excel-heavy workflows and saving 2,000+ hours through automation; further reduced average speed of answer by 15 seconds through PO complexity scoring that distinguished simple versus complex calls and surfaced agent handling patterns.",
      "Built a KPI benchmarking solution that normalized 20 client KPIs, enabling client-to-client, peer-group, and industry-level comparisons that strengthened client conversations and supported retention efforts.",
      "Engineered advanced DAX measures, calculation groups, and RLS frameworks with deep expertise in filter context, row context, and expanded table behavior; used DAX Studio log timings and Tabular Editor to systematically eliminate bottlenecks and optimize query performance across enterprise datasets.",
      "Designed dbt models, macros, and Azure Databricks SQL transformations to move curated data through silver-to-gold layers, powering star-schema semantic models for enterprise Power BI reporting.",
      "Implemented Git-based BI deployment workflows using Power BI PBIR artifacts, CI/CD pipelines, and source-controlled releases across environments, standardizing and de-risking the delivery lifecycle.",
      "Partnered with Account Managers, Fleet Managers, and IT leaders to translate loosely defined business needs into trusted analytical solutions, including executive-level analysis on auto-approval rejection patterns and service behavior that gave VP-level stakeholders clearer visibility into training and operational opportunities.",
      "Presented dashboard work at IBIS 2024 in Phoenix and internal seminars, consistently translating complex technical design decisions into measurable business value for mixed technical and executive audiences.",
    ],
    tools: ["Power BI", "SQL", "Python", "dbt", "Azure Databricks", "Git", "CI/CD", "Microsoft Fabric", "DAX", "SAP BusinessObjects"],
  },
  {
    company: "Collabera",
    location: "Basking Ridge, New Jersey",
    role: "Data Analyst Intern",
    period: "May 2023 - July 2023",
    summary:
      "Improved KPI reporting performance and model structure for business users who needed faster, clearer operational visibility.",
    impact: [
      "Optimized SQL queries and Power BI models, reducing report rendering time by 30%.",
      "Built a dimensional calendar and DAX-led reporting structure that improved reporting efficiency by 15%.",
      "Built KPI dashboards that gave stakeholders clearer performance signals.",
    ],
    tools: ["Power BI", "DAX", "SQL Server"],
  },
  {
    company: "LabWare",
    location: "Wilmington, Delaware",
    role: "Data Science Intern",
    period: "June 2022 - September 2022",
    summary:
      "Connected ETL, machine learning, and visualization so non-technical teams could interpret model outputs more easily.",
    impact: [
      "Developed an end-to-end ETL pipeline using Python, AWS S3, and Snowflake for crime data analysis.",
      "Engineered an XGBoost model that predicted crime types with 80% accuracy.",
      "Translated machine learning outputs into Tableau dashboards for intuitive stakeholder use.",
    ],
    tools: ["Python", "Tableau", "AWS S3", "Snowflake", "XGBoost"],
  },
];

export const education: EducationItem[] = [
  {
    school: "Drexel University",
    location: "Philadelphia, Pennsylvania",
    degree: "M.S. in Business Analytics",
    period: "August 2021 - March 2023",
  },
  {
    school: "Savitribai Phule Pune University",
    location: "Pune, India",
    degree: "B.E. in Electronics and Telecommunication",
    period: "July 2016 - April 2020",
  },
];

export const projects: ProjectItem[] = [
  {
    title: "H-1B Wage Map",
    slug: "h1b-wage-map",
    client: "Independent product build",
    industry: "Immigration intelligence",
    year: "2026",
    role: "Product builder, data engineer, frontend engineer",
    status: "Live",
    summary:
      "Built an interactive geospatial decision tool that helps H-1B applicants compare county-level wage competitiveness under the FY 2027 weighted selection rule.",
    whyItMatters:
      "Shows how an ambiguous policy change became a practical tool for high-stakes personal decision-making.",
    problem:
      "Applicants need a clearer way to evaluate how job titles, counties, and wage levels affect H-1B odds under the new selection process.",
    highlights: [
      "Combined DOL wage data with historical filing data into a geospatial decision tool.",
      "Used static JSON sharding to support fast search across 200,000+ filing records without a traditional backend database.",
      "Added county-level safety visualization, employer filing lookup, and AI-assisted SOC matching to reduce user guesswork.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Mapbox", "Python", "Pandas"],
    github: "https://github.com/idealidler/h1b-wage-map",
    demo: "https://h1b-wage-map.vercel.app",
    image: "/assets/wagemap.jpg",
    featured: true,
  },
  {
    title: "GitDecode",
    slug: "gitdecode-backend",
    client: "Real-world application backend",
    industry: "Developer intelligence",
    year: "2026",
    role: "Backend engineer, data engineer, and AI systems builder",
    status: "Production support",
    summary:
      "Built a FastAPI backend that turns public GitHub activity into structured engineering signals and recruiter-friendly candidate summaries for a Chrome extension workflow.",
    whyItMatters:
      "Shows ownership of a messy evaluation problem, from API design and data ingestion to scoring logic and AI-assisted explanation.",
    problem:
      "Recruiters and hiring teams need a faster way to turn public GitHub activity into structured engineering signals instead of relying on manual repo scanning.",
    highlights: [
      "Converts GitHub GraphQL activity into normalized behavioral features.",
      "Computes deterministic dimensions such as execution, collaboration, ownership, maintenance, and credibility before generating narrative summaries.",
      "Supports a real Chrome extension experience with recruiter-facing outputs, evidence grouping, placement guidance, and health-check endpoints.",
    ],
    stack: ["Python", "FastAPI", "GitHub GraphQL", "Feature Engineering", "OpenAI", "Data Pipelines"],
    github: "https://github.com/idealidler/gitdecode-backend",
    demo: "https://chromewebstore.google.com/detail/afgkahemmcbjadcngdlhngipjphpbnal?utm_source=item-share-cb",
    image: "/assets/gitdecode.jpg",
    featured: true,
  },
  {
    title: "Net Worth Tracker",
    slug: "net-worth-tracker",
    client: "Independent product build",
    industry: "Personal finance",
    year: "2026",
    role: "Frontend-heavy product builder",
    status: "Live",
    summary:
      "Built a private financial dashboard for net-worth tracking, historical snapshots, portfolio analysis, and long-term goal monitoring.",
    whyItMatters:
      "Shows thoughtful data UX beyond traditional reporting, with financial information organized around personal decisions.",
    problem:
      "Most budgeting tools are not designed for high-level wealth tracking, custom asset mixes, or clean historical snapshot analysis.",
    highlights: [
      "Designed a ledger-driven dashboard for assets, liabilities, goals, and historical net worth changes.",
      "Used immutable snapshots to preserve point-in-time financial history.",
      "Focused on privacy-first product design with Google OAuth and Firestore-backed persistence.",
    ],
    stack: ["React", "Tailwind CSS", "Firebase", "Firestore", "Framer Motion", "Recharts"],
    github: "https://github.com/idealidler/net-worth-tracker",
    demo: "https://networthguide.vercel.app/",
    image: "/assets/networth.jpg",
    featured: true,
  },
  {
    title: "Contextly",
    slug: "contextly",
    client: "Independent VS Code product build",
    industry: "Developer tooling",
    year: "2026",
    role: "Product engineer and extension builder",
    status: "Live on Marketplace",
    summary:
      "Built a local-first VS Code extension that saves reusable AI context inside each workspace so developers can reopen structured prompts without retyping setup.",
    whyItMatters:
      "Shows product-minded engineering across extension UX, local storage design, prompt structure, and real developer workflow integration.",
    problem:
      "Developers repeatedly rewrite repo-specific schema notes, business rules, and prompt constraints across AI chats, which creates friction and inconsistent outputs.",
    highlights: [
      "Stores prompt context locally in a hidden `.contextly.json` file so context stays workspace-specific and shareable through Git when teams want it.",
      "Structures prompt context into intent, task, context, constraints, and output format instead of one long note.",
      "Includes a status-bar picker, management dashboard, search, clipboard copy, and VS Code chat prefill for fast day-to-day use.",
    ],
    stack: ["TypeScript", "VS Code Extension API", "ESBuild", "Local JSON Storage", "Product UX"],
    github: "https://github.com/idealidler/contextly",
    demo: "https://marketplace.visualstudio.com/items?itemName=idealidler.contextly",
    featured: true,
  },
  {
    title: "Starbucks Drink Recommendation",
    slug: "starbucks-drink-recommendation",
    client: "Independent analysis project",
    industry: "Consumer analytics",
    year: "2023",
    role: "Data analyst and NLP practitioner",
    status: "Archived showcase",
    summary:
      "Analyzed social media data to identify Starbucks brand perception and engagement patterns through topic modeling.",
    whyItMatters:
      "A strong example of turning noisy, unstructured text into usable audience insight.",
    problem:
      "The project explored what Starbucks fans discussed online and how topic emphasis shifted over time.",
    highlights: [
      "Applied topic modeling to Reddit content around Starbucks conversations.",
      "Explored user engagement trends and brand-perception themes.",
      "Framed the output as business insight rather than notebook-only analysis.",
    ],
    stack: ["Python", "NLP", "Topic Modeling", "REST API", "Data Scraping"],
    github: "https://github.com/idealidler/Studying-Starbucks-through-the-lens-of-social-media",
    image: "/assets/star.jpg",
    featured: false,
  },
  {
    title: "E-Commerce Customer Purchase Analysis",
    slug: "ecommerce-customer-purchase-analysis",
    client: "Graduate analysis project",
    industry: "Retail analytics",
    year: "2023",
    role: "Data analyst and storyteller",
    status: "Archived showcase",
    summary:
      "Analyzed customer reviews and recommendation behavior to identify what drives product advocacy.",
    whyItMatters:
      "Shows customer insight work, topic analysis, and the translation of raw review data into actionable merchandising signals.",
    problem:
      "The project focused on understanding what drives recommendations in women's e-commerce review data.",
    highlights: [
      "Used exploratory analysis, topic modeling, and segmentation to uncover recommendation drivers.",
      "Connected themes like fit, feel, and online shopping experience to recommendation outcomes.",
      "Translated findings into practical merchandising and customer-experience suggestions.",
    ],
    stack: ["Python", "Pandas", "Power BI", "NLTK", "Scikit-learn"],
    github: "https://github.com/idealidler/E-Commerce-Customer-Purchase-Analysis",
    image: "/assets/dress.jpg",
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const selectedAnalysisProjects = projects.filter((project) => !project.featured);

export const skillGroups: SkillGroup[] = [
  {
    label: "Decision Analytics",
    items: ["Power BI", "DAX", "KPI design", "Executive reporting"],
  },
  {
    label: "Data Products",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Streamlit", "Mapbox"],
  },
  {
    label: "Data Modeling & Platforms",
    items: ["SQL", "dbt", "Semantic modeling", "Azure Databricks", "Microsoft Fabric", "PostgreSQL"],
  },
  {
    label: "Automation & ML",
    items: ["Python", "Pandas", "ETL automation", "Scikit-learn", "XGBoost", "NLP workflows"],
  },
];

export const contactLinks = {
  email: "mailto:akshayjain128@gmail.com",
  linkedin: "https://www.linkedin.com/in/akshayjain128",
  calendly: "https://calendly.com/akshayjain128/30min",
  resume: "/resume.pdf",
};

export const chatPrompts = [
  "What kind of roles is Akshay best suited for?",
  "Summarize his impact at Holman.",
  "How did he reduce manual reporting effort at Holman?",
  "Which featured project best shows product thinking?",
  "How does Akshay approach ambiguous problems?",
];

export const profileNarratives: Record<string, NarrativeField> = {
  about: {
    title: "About",
    body:
      "Akshay is a business-facing data professional who turns ambiguous questions into structured analytics, reporting systems, and decision tools. At Holman, he partners closely with stakeholders to clarify the real problem, design practical solutions, and move quickly from messy operational data to reporting that leaders and frontline teams use. He is strongest when the path is not fully defined: he figures things out quickly, helps teammates unblock problems, and often suggests better approaches than the original request.",
  },
  problemSolving: {
    title: "Problem Solving",
    body:
      "Akshay starts by clarifying the decision the business needs to make, then breaks the work into analytical, data-modeling, and delivery pieces. At Holman, that has meant turning loosely defined requests into SQL logic, Power BI dashboards, Python scoring methods, and reusable reporting systems while helping stakeholders understand tradeoffs, options, and realistic next steps.",
  },
  careerGoals: {
    title: "Career Goals",
    body:
      "Akshay is targeting roles where analytics, BI, and data products sit close to business decisions, with a long-term focus on building durable systems that make complex information easier to act on.",
  },
  workStyle: {
    title: "Working Style",
    body:
      "Akshay works like an internal consultant: he listens for the underlying business problem, structures the work, communicates clearly, and stays hands-on through delivery.",
  },
  backendNotes: {
    title: "Backend Notes",
    body:
      "Akshay has worked with Python since 2019 through personal projects and professional analytics work, including LabWare and Holman use cases involving ETL, scoring logic, and data problem-solving. He is familiar with medallion-style architecture, dbt, and Azure Databricks SQL transformations that move curated data from silver to gold layers for Power BI semantic models. Beyond implementation, he regularly helps stakeholders understand available options, what the data can realistically answer, and how reporting should be shaped so decision-makers can get to the right information quickly.",
  },
};
