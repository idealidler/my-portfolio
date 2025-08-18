import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Mail,
  Linkedin,
  MapPin,
  Star,
  Home,
  FileText,
  CheckCircle2,
} from 'lucide-react';

// --- ANIMATION VARIANTS ---
// A single, clean animation for all sections to use as they enter the viewport.
const sectionAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }, // A smooth ease-out curve
  },
};

// --- HELPER COMPONENT (This was the missing piece) ---
/**
 * A styled badge for displaying skills.
 * @param {string} skill - The name of the skill/technology to display.
 */
const SkillBadge = ({ skill }) => (
  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
    {skill}
  </span>
);

// --- DATA ---
// Centralizing data makes the component cleaner and easier to update.
const workExperience = [
    {
    company: "HOLMAN",
    location: "Mt Laurel, New Jersey",
    role: "Analytics Engineer",
    date: "July 2023 – Present",
    tech: ["Power BI", "SQL", "Python", "Microsoft Fabric", "CI/CD", "Git", "DAX"],
    points: [
      "Built an enterprise Power BI dashboard replacing 15+ legacy reports, saving 40+ hours per consultant.",
      "Developed scalable data models and ETL pipelines using SQL and Python in Microsoft Fabric.",
      "Managed cross-functional projects, ensuring timely delivery in an Agile environment.",
    ],
  },
  {
    company: "COLLABERA",
    location: "Basking Ridge, New Jersey",
    role: "Data Analyst Intern",
    date: "May 2023 – July 2023",
    tech: ["Power BI", "DAX", "SQL Server"],
    points: [
      "Optimized SQL queries and Power BI models, reducing report rendering time by 30%.",
      "Delivered key KPI dashboards providing actionable insights for business improvement.",
    ],
  },
  {
    company: "LABWARE",
    location: "Wilmington, Delaware",
    role: "Data Science Intern",
    date: "June 2022 – September 2022",
    tech: ["Python", "Tableau", "AWS S3", "Snowflake", "XGBoost"],
    points: [
      "Engineered an XGBoost model to predict crime types with 80% accuracy.",
      "Built an end-to-end ETL pipeline for crime data analysis using Python, AWS S3, and Snowflake.",
    ],
  },
];

const coreTechnologies = ["Power BI", "SQL", "Python", "Microsoft Fabric", "DAX", "Tableau", "Git", "CI/CD"];
const education = [
    {
        degree: "M.S. in Business Analytics",
        school: "Drexel University, Philadelphia, PA",
        date: "2021 – 2023",
    },
    {
        degree: "B.S. in Electronics & Telecom",
        school: "Pune University, India",
        date: "2016 – 2020",
    }
];

// --- MAIN COMPONENT ---
export default function RecruiterFriendly({ switchVersion }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {/* --- PROFILE HEADER --- */}
        {/* This header section contains all critical info and actions. */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={sectionAnimation}
          className="bg-white/70 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200/80"
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-4xl shadow-md">
              AJ
            </div>
            <div className="flex-grow">
              <h1 className="text-4xl font-extrabold text-indigo-800">Akshay Jain</h1>
              <p className="text-xl font-medium text-gray-600 mt-1">Analytics Engineer</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a href="mailto:akshayjain128@gmail.com" className="flex items-center gap-2 text-indigo-600 hover:underline">
                  <Mail size={16} /> akshayjain128@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/akshayjain128" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline">
                  <Linkedin size={16} /> LinkedIn Profile
                </a>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} /> Philadelphia, PA
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Authorized to work in the U.S. (F1 OPT STEM Ext. until May 2026)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Open to relocation & available for immediate start</li>
            </ul>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => switchVersion(null)}
                className="p-2 rounded-full border-2 border-indigo-400 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
                title="Back to Home"
              >
                <Home size={18} />
              </button>
              <button
                onClick={() => switchVersion("hiringManager")}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
              >
                <FileText size={16} />
                View Detailed Version
              </button>
            </div>
          </div>
        </motion.header>

        {/* --- MAIN CONTENT SECTIONS --- */}
        <main className="mt-8 space-y-8">
          {/* --- Summary --- */}
          <motion.section variants={sectionAnimation} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-center text-lg text-gray-700 bg-white/50 p-6 rounded-2xl border border-slate-200/80">
              I translate complex data into actionable insights and clear stories. My expertise lies in building efficient data models and dashboards with Power BI, SQL, and Python to drive smarter business decisions.
            </p>
          </motion.section>

          {/* --- Work Experience --- */}
          <motion.section variants={sectionAnimation} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-3"><Briefcase size={22} /> Work Experience</h2>
            <div className="space-y-6">
              {workExperience.map(job => (
                <div key={job.company} className="p-5 rounded-xl bg-white/70 shadow-md border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <h3 className="text-lg font-bold text-indigo-700">{job.role}</h3>
                    <p className="text-sm font-semibold text-gray-500 mt-1 sm:mt-0">{job.date}</p>
                  </div>
                  <p className="font-medium text-gray-600">{job.company}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-3 text-sm">
                    {job.points.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tech.map(t => <SkillBadge key={t} skill={t} />)}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* --- Core Technologies --- */}
          <motion.section variants={sectionAnimation} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-3"><Star size={22} /> Core Technologies</h2>
            <div className="p-5 rounded-xl bg-white/70 shadow-md border border-slate-200/80 flex flex-wrap gap-3">
              {coreTechnologies.map(tech => <SkillBadge key={tech} skill={tech} />)}
            </div>
          </motion.section>

          {/* --- Education --- */}
          <motion.section variants={sectionAnimation} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-3"><GraduationCap size={22} /> Education</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {education.map(edu => (
                <div key={edu.school} className="p-5 rounded-xl bg-white/70 shadow-md border border-slate-200/80">
                  <h3 className="font-bold text-indigo-700">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500 mt-1">{edu.date}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </main>

        {/* --- Footer --- */}
        <motion.footer variants={sectionAnimation} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center pt-12 mt-8">
          <p className="text-sm text-gray-500">
            Akshay Jain © {new Date().getFullYear()}
          </p>
        </motion.footer>
      </div>
    </div>
  );
}