import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  UserCheck,
  Phone,
  Mail,
  Linkedin,
  MapPin,
  Star,
  Code,
  Database,
  BriefcaseBusiness,
  Lightbulb, // For Projects
  Github, // For Projects
  ExternalLink, // For Projects
} from "lucide-react";

// Helper components for better structure and reusability

const Section = ({ icon, title, children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className={`mb-8 ${className}`}
  >
    <h2 className="text-xl font-bold flex items-center gap-3 text-indigo-800 mb-4">
      {icon}
      {title}
    </h2>
    {children}
  </motion.div>
);

const TimelineItem = ({ title, company, date, details }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    }}
    className="relative pl-8 pb-8 border-l-2 border-indigo-200 last:border-l-transparent"
  >
    {/* Timeline Dot */}
    <div className="absolute -left-[11px] top-1 h-5 w-5 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center">
      <Briefcase className="text-indigo-500" size={12} />
    </div>
    <p className="font-semibold text-lg text-indigo-700">{title}</p>
    <p className="font-medium text-gray-600">{company}</p>
    <p className="text-sm text-gray-500 mb-2">{date}</p>
    <ul className="list-disc list-inside text-gray-700 space-y-1.5 marker:text-indigo-400">
      {details.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </motion.div>
);

const SkillBadge = ({ skill, className = "" }) => (
  <span
    className={`px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium tracking-wide ${className}`}
  >
    {skill}
  </span>
);

// NEW: Reusable component for project cards
const ProjectCard = ({ title, description, tech, github, live }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className="p-5 rounded-xl bg-white/60 shadow-md hover:shadow-lg border border-gray-200 transition-shadow duration-300"
  >
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-indigo-700 text-lg">{title}</h3>
      <div className="flex items-center gap-3">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            aria-label="GitHub repository"
          >
            <Github size={20} />
          </a>
        )}
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-indigo-600 transition-colors"
            aria-label="Live demo"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>
    </div>
    <p className="text-gray-700 my-2 text-sm">{description}</p>
    <div className="flex flex-wrap gap-2 mt-3">
      {tech.map((skill) => (
        <SkillBadge key={skill} skill={skill} className="!px-2 !py-0.5 !text-xs !bg-gray-200 !text-gray-700" />
      ))}
    </div>
  </motion.div>
);

// Main Component
const RecruiterView = ({ switchVersion }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      variants={containerVariants}
      className="max-w-6xl mx-auto p-6 md:p-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* === LEFT COLUMN (Main Content) === */}
        <div className="lg:col-span-2">
          {/* --- Header --- */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="border-b border-gray-200 pb-6 mb-8"
          >
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Akshay Jain
            </h1>
            <p className="text-xl text-gray-700 mt-1">Analytics Engineer | Data Consultant</p>
            <p className="mt-4 text-gray-800 leading-relaxed max-w-2xl">
              A results-driven data professional adept at transforming complex data into actionable insights. I bridge the gap between technical teams and business stakeholders, delivering high-impact solutions using Power BI, SQL, and Python. My expertise lies in building efficient data pipelines in Microsoft Fabric and managing projects in fast-paced Agile environments.
            </p>
          </motion.div>

          {/* --- Experience Timeline --- */}
          <Section icon={<BriefcaseBusiness size={24} />} title="Work Experience">
            <div className="relative">
              <TimelineItem
                title="Analytics Engineer"
                company="Holman"
                date="July 2023 - Present"
                details={[
                  "Built enterprise Power BI dashboards replacing 15+ reports, saving 30–40 hours per consultant.",
                  "Developed scalable SQL and Python-based data models for KPI tracking and benchmarking.",
                  "Managed cross-functional projects with strong prioritization and communication skills.",
                ]}
              />
              <TimelineItem
                title="Data Analyst"
                company="Collabera"
                date="May 2023 - July 2023"
                details={[
                  "Optimized SQL and Power BI models, reducing report generation time by 30%.",
                  "Created a custom Dimensional Calendar, improving reporting efficiency by 15%.",
                  "Delivered KPI dashboards with actionable insights for business improvement.",
                ]}
              />
              <TimelineItem
                title="Data Science Intern"
                company="Labware"
                date="June 2022 - September 2022"
                details={[
                  "Built ETL pipelines using Python, AWS S3, and Snowflake for crime data analysis.",
                  "Developed an XGBoost model predicting crime types with 80% accuracy.",
                  "Integrated ML results into Tableau dashboards for non-technical users.",
                ]}
              />
            </div>
          </Section>
          
          {/* --- NEW: Featured Projects Section --- */}
          <Section icon={<Lightbulb size={24} />} title="Featured Projects">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectCard 
                  title="Starbucks Reddit Review Analysis"
                  description="Analyzed Starbucks’ brand perception by applying sentiment analysis to thousands of social media posts."
                  tech={["Python", "Scikit-learn", "seaborn", "Pushshift API", "pandas"]}
                />
                 <ProjectCard 
                  title="E-Commerce Customer Purcahse Analysis"
                  description="Explored customer purchasing behavior in e-commerce to uncover trends and patterns by analysing customer reviews."
                  tech={["PowerBI", "DAX", "Python", "Python", "Azure"]}
                />
             </div>
          </Section>
        </div>

        {/* === RIGHT COLUMN (Sidebar) === */}
        <aside className="lg:col-span-1 lg:sticky top-10 h-min">
          <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            {/* --- Contact & Location --- */}
            <div className="space-y-3.5 text-gray-700 text-sm border-b border-gray-200 pb-6 mb-6">
               <a href="mailto:akshayjain128@gmail.com" className="flex items-center gap-3 text-indigo-600 hover:underline">
                <Mail size={18} /> akshayjain128@gmail.com
              </a>
              <div className="flex items-center gap-3">
                <Phone size={18} /> +1 (445) 208-1735
              </div>
              <a href="https://www.linkedin.com/in/akshayjain128" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-600 hover:underline">
                 <Linkedin size={18} /> LinkedIn
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={18} /> Philadelphia, PA • Open to Relocation
              </div>
            </div>
            
            {/* --- Categorized Skills, Key Info, Education sections --- */}
            <Section icon={<Star size={22} />} title="Core Competencies" className="!mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2"><Database size={16} /> Data & Analytics</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Power BI", "Microsoft Fabric", "Tableau", "Databricks", "Business Objects"].map(skill => <SkillBadge key={skill} skill={skill} />)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2"><Code size={16} /> Languages & Databases</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Python", "SQL", "MS SQL", "JavaScript / React"].map(skill => <SkillBadge key={skill} skill={skill} />)}
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold text-gray-600 mb-2 flex items-center gap-2"><Briefcase size={16} /> Professional</h3>
                    <div className="flex flex-wrap gap-2">
                        {["Agile Methodologies", "Git CI/CD", "Azure DevOps", "Problem Solving", "Effective Communication"].map(skill => <SkillBadge key={skill} skill={skill} />)}
                    </div>
                  </div>
                </div>
            </Section>
            
            <Section icon={<UserCheck size={22} />} title="Key Info" className="!mb-6">
                <ul className="list-disc list-inside text-gray-700 space-y-2 marker:text-indigo-400 text-sm">
                  <li>Authorized to work in the U.S. (F1 OPT STEM Ext. until May 2026)</li>
                  <li>Available for immediate start</li>
                </ul>
            </Section>

            <Section icon={<GraduationCap size={22} />} title="Education" className="!mb-0">
                <div className="space-y-2 text-gray-700 text-sm">
                    <div><p className="font-semibold">M.S. in Business Analytics</p><p>Drexel University, 2023</p></div>
                    <div><p className="font-semibold">B.S. in Electronics & Telecom</p><p>Pune University, 2020</p></div>
                </div>
            </Section>
          </div>
        </aside>
      </main>

      {/* --- Switch Version Button & Footer --- */}
      <footer className="text-center pt-16">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            switchVersion();
          }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all transform"
        >
          Switch to Hiring Manager Version
        </button>
        <p className="mt-8 text-sm text-gray-500">
          With Absolute Zero Web Development Knowledge Designed & Built by Akshay Jain © {new Date().getFullYear()}
        </p>
      </footer>
    </motion.div>
  );
};

export default RecruiterView;