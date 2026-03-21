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
  "High-ownership executor who gets critical work over the line",
  "Trusted stakeholder partner for business-facing analytics work",
  "Translates technical complexity into clear business language",
  "Detail-oriented analyst with strong depth of analysis",
  "Fast turnaround without losing structure or accuracy",
  "Strong time and priority management in Agile environments",
  "Dependable teammate with strong work ethic and follow-through",
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
    label: "ASA improvement delivered",
    value: "15 sec",
    detail: "Reduced average speed of answer in call center operations through schedule and call-behavior analytics.",
  },
];

export const highlights: Highlight[] = [
  {
    title: "Enterprise BI builder with strong product instincts",
    detail:
      "I move comfortably between stakeholder discovery, BI modeling, ETL, dashboards, and user-facing data apps.",
  },
  {
    title: "Strong translator across technical and business audiences",
    detail:
      "My best work happens when ambiguous business requests need to become something useful, measurable, and adopted.",
  },
  {
    title: "Operational analytics with measurable business impact",
    detail:
      "I build reporting that reduces manual effort, improves visibility for leadership, and gives frontline teams clearer actions.",
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
    title: "Technical depth across BI, ETL, and data products",
    description:
      "See the projects, system choices, and delivery patterns behind the dashboards and applications.",
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
      "Progressed from SAP BusinessObjects reporting into owning modern BI delivery across Power BI, SQL, Python, dbt, Databricks, CI/CD, semantic modeling, and stakeholder-led Agile execution.",
    impact: [
      "Designed dbt models, macros, and Databricks SQL transformations to move curated data from silver to gold layers and support star-schema-based semantic models for enterprise Power BI reporting.",
      "Implemented Git-based BI deployment workflows using Power BI PBIR artifacts and source-controlled workspaces, managing dashboard and semantic model promotion across environments through CI/CD pipelines and version-controlled releases.",
      "Built a KPI benchmarking solution using SQL, Python scoring logic, backend semantic models, and Power BI visual layers; normalized 20 client KPIs and enabled client-to-client, peer-group, and industry benchmarking for stronger client conversations and retention support.",
      "Delivered Holman’s flagship Power BI dashboard, consolidating multiple consulting reports into a single semantic-model-driven reporting experience now used by 1000+ active distinct users across the company.",
      "Consolidated 8 call-center data sources into one Power BI reporting model, eliminated recurring Excel-based workflows, and contributed to 2000+ hours saved through automated operational reporting.",
      "Developed call-center analytics using SQL, Power BI, and Python-based PO complexity scoring to distinguish simple versus complex purchase-order calls, explain agent handling patterns, and reduce average speed of answer by 15 seconds.",
      "Built executive-facing reports on auto-approval rejection patterns, edge cases, and client-administrator phone behavior using complex SQL shaping and Power BI dashboards, giving VP-level leaders clearer visibility into service and training opportunities.",
      "Partnered daily with business stakeholders in Agile workflows to gather requirements, manage fast-turnaround ad hoc work, and translate technical analysis into clear business language; also presented dashboard work at IBIS 2024 (Phoenix) and internal team seminars.",
    ],
    tools: ["Power BI", "SQL", "Python", "dbt", "Databricks", "Git", "CI/CD", "Microsoft Fabric", "DAX", "SAP BusinessObjects"],
  },
  {
    company: "Collabera",
    location: "Basking Ridge, New Jersey",
    role: "Data Analyst Intern",
    period: "May 2023 - July 2023",
    summary:
      "Focused on KPI reporting, performance tuning, and modeling improvements for business users.",
    impact: [
      "Optimized SQL queries and Power BI models, reducing report rendering time by 30%.",
      "Built a dimensional calendar and DAX-led reporting structure that improved reporting efficiency by 15%.",
      "Delivered KPI dashboards that improved operational visibility for business stakeholders.",
    ],
    tools: ["Power BI", "DAX", "SQL Server"],
  },
  {
    company: "LabWare",
    location: "Wilmington, Delaware",
    role: "Data Science Intern",
    period: "June 2022 - September 2022",
    summary:
      "Worked across ETL, machine learning, and visualization to make technical analysis useful for non-technical teams.",
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
      "Built an interactive geospatial intelligence app that helps H-1B applicants evaluate county-level wage competitiveness under the FY 2027 weighted selection rule.",
    whyItMatters:
      "Shows end-to-end product thinking across data processing, geospatial UX, and real-world decision support for a high-stakes user need.",
    problem:
      "Applicants need a clearer way to evaluate how job titles, counties, and wage levels affect H-1B odds under the new selection process.",
    highlights: [
      "Combined DOL wage data with historical filing data into a geospatial decision tool.",
      "Used static JSON sharding to support fast search across 200,000+ filing records without a traditional backend database.",
      "Added county-level safety visualization, employer filing lookup, and AI-assisted SOC matching.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Mapbox", "Python", "Pandas"],
    github: "https://github.com/idealidler/h1b-wage-map",
    demo: "https://h1b-wage-map.vercel.app",
    image: "/assets/wagemap.jpg",
    featured: true,
  },
  {
    title: "GitDecode Backend",
    slug: "gitdecode-backend",
    client: "Real-world application backend",
    industry: "Developer intelligence",
    year: "2026",
    role: "Backend engineer, data engineer, and AI systems builder",
    status: "Production support",
    summary:
      "Built a FastAPI backend that analyzes public GitHub activity, computes deterministic engineering signals, and returns recruiter-friendly candidate summaries for a Chrome extension workflow.",
    whyItMatters:
      "Shows real-world backend ownership across API design, GitHub data ingestion, feature engineering, scoring logic, and AI-assisted narrative generation.",
    problem:
      "Recruiters and hiring teams need a faster way to turn public GitHub activity into structured engineering signals instead of relying on manual repo scanning.",
    highlights: [
      "Queries GitHub GraphQL activity and converts it into normalized behavioral features.",
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
      "Built a private financial dashboard for wealth tracking, historical snapshots, portfolio analysis, and long-term financial goal monitoring.",
    whyItMatters:
      "Shows polished frontend execution, thoughtful data UX, and product sensibility beyond traditional analytics reporting.",
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
    title: "Stock Sentiment Dashboard",
    slug: "stock-sentiment-dashboard",
    client: "Independent product build",
    industry: "Market analytics",
    year: "2025",
    role: "Full-stack data science builder",
    status: "Live",
    summary:
      "Built a stock analysis dashboard that combines ETL, warehousing, predictive modeling, and AI-generated market commentary.",
    whyItMatters:
      "Demonstrates how I connect data ingestion, modeling, and narrative explanation into a single analyst workflow.",
    problem:
      "Stock price movement analysis is often split across disconnected tools for data collection, modeling, and interpretation.",
    highlights: [
      "Fetched market prices and news headlines into a structured pipeline.",
      "Built a PostgreSQL star schema and Random Forest price direction model.",
      "Added AI-generated narrative explanations alongside model outputs for easier interpretation.",
    ],
    stack: ["Python", "PostgreSQL", "Pandas", "Scikit-learn", "Streamlit"],
    github: "https://github.com/idealidler/Stock-Sentiment-Dashboard",
    demo: "https://stock-sentiment-dashboard-project.streamlit.app",
    image: "/assets/stock.jpg",
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
      "Analyzed social media data to uncover Starbucks brand perception and engagement patterns through topic modeling.",
    whyItMatters:
      "A strong example of turning noisy, unstructured text into usable audience insight.",
    problem:
      "The project aimed to understand what Starbucks fans discussed online and how topic emphasis shifted over time.",
    highlights: [
      "Applied topic modeling to Reddit content around Starbucks conversations.",
      "Explored user engagement trends and brand-perception themes.",
      "Framed the output as a business insight project rather than a notebook-only analysis.",
    ],
    stack: ["Python", "NLP", "Topic Modeling", "Rest API", "Data Scrapping"],
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
      "Analyzed customer reviews and recommendation behavior to identify the themes and patterns behind product advocacy.",
    whyItMatters:
      "Shows customer insight work, topic analysis, and the translation of raw review data into actionable merchandising signals.",
    problem:
      "The project focused on understanding what drives recommendations in women's e-commerce review data.",
    highlights: [
      "Used exploratory analysis, topic modeling, and segmentation to uncover recommendation drivers.",
      "Connected themes like fit, feel, and online shopping experience to recommendation outcomes.",
      "Translated findings into concrete business improvement suggestions.",
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
    label: "Analytics Engineering",
    items: ["Power BI", "dbt", "DAX", "Semantic modeling"],
  },
  {
    label: "Data Products",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Streamlit", "Mapbox"],
  },
  {
    label: "Data Stack",
    items: ["SQL", "T-SQL", "Oracle SQL", "dbt", "Databricks", "Microsoft Fabric", "PostgreSQL"],
  },
  {
    label: "Programming & ML",
    items: ["Python", "Pandas", "Scikit-learn", "XGBoost", "NLP workflows", "ETL automation"],
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
      "Akshay is an Analytics Engineer and data product builder based in the United States. His strongest real-world experience comes from Holman, where he has worked across SAP BusinessObjects, Power BI, SQL, Python, dbt, Databricks, and Microsoft Fabric to turn messy operational data into reporting systems that leaders and frontline teams actively use. His portfolio combines enterprise BI execution with independent product builds in finance, immigration intelligence, and AI-assisted experiences.",
  },
  problemSolving: {
    title: "Problem Solving",
    body:
      "Akshay approaches problem-solving by first clarifying the business need with stakeholders, then breaking the problem into smaller analytical and system-design components. At Holman, this has meant turning loosely defined requests from Account Managers, Fleet Managers, IT Supervisors, and leaders into SQL logic, Power BI dashboards, Python scoring methods, and reusable reporting systems. He is strongest in ambiguous environments where communication, iteration, and practical business impact matter as much as technical correctness.",
  },
  careerGoals: {
    title: "Career Goals",
    body:
      "Akshay is aiming for roles that sit at the intersection of analytics engineering, business intelligence, and data product development. Long term, he wants to build durable analytics platforms, mentor other data professionals, and create systems that make complex information easier for businesses to act on.",
  },
  workStyle: {
    title: "Working Style",
    body:
      "Akshay balances technical rigor with practicality. That means listening carefully to business users, translating their needs into dashboards and models they can trust, and explaining the output in simple language. He values ownership, communication, reusable systems, and reporting that actually gets adopted by the people it was built for.",
  },
  backendNotes: {
    title: "Backend Notes",
    body:
      "Akshay has been working with Python since 2019, primarily through personal projects, and has also used it in professional settings including his LabWare internship and his work at Holman for analytics, scoring logic, ETL, and data problem-solving. He is also familiar with medallion-style data architecture and has worked with dbt and Databricks SQL transformations to move curated data from silver to gold layers, then support Power BI semantic models built on top of gold-layer data for enterprise reporting consumption. Beyond implementation, he regularly works in a consulting-style capacity with business stakeholders to translate ambiguous requirements into scalable analytical solutions. That includes helping teams understand what options are available, what questions the data can realistically answer, and how to shape reporting so decision-makers can get to the right information quickly through clear, low-effort, visually intuitive experiences.",
  },
};
