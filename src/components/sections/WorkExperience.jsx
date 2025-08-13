import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

// --- DATA ---
// I've added a 'tech' array to each experience object.
// This is a powerful way to show recruiters your skills in context.
const experiences = [
  {
    company: "HOLMAN",
    location: "Mt Laurel, New Jersey",
    role: "Analytics Engineer",
    date: "July 2023 – Present",
    tech: ["Power BI", "SQL", "Python", "Microsoft Fabric", "CI/CD", "Git", "DAX"],
    points: [
      "Collaborated with Data Science & Engineering to build an enterprise-scale semantic model powering the Annual Business Review, enabling 200+ stakeholders to replace 15+ legacy reports with a unified Power BI dashboard, saving 30–40 hours per consultant.",
      "Utilized CI/CD pipelines and Git for collaborative development of Power BI semantic models using .pbip and .tmdl files, enabling version control and streamlined deployment.",
      "Developed advanced SQL (T-SQL, Oracle SQL) using Window Functions and CTEs to translate complex business requirements into scalable data models.",
      "Built ETL pipelines and statistical models in Microsoft Fabric notebooks using Python to normalize 20 client KPIs for benchmarking and health scoring.",
      "Effectively managed competing priorities and cross-functional stakeholders across multiple high-impact initiatives, delivering under tight deadlines.",
    ],
  },
  {
    company: "COLLABERA",
    location: "Basking Ridge, New Jersey",
    role: "Data Analyst Intern",
    date: "May 2023 – July 2023",
    tech: ["Power BI", "DAX", "SQL Server"],
    points: [
      "Optimized SQL queries and Power BI data modeling to integrate data from multiple tables, reducing report generation time by 30%.",
      "Implemented a Dimensional Calendar in Power BI using DAX, improving data reporting efficiency by 15%.",
      "Developed a Power BI dashboard to analyze key business KPIs, delivering actionable insights to drive business improvements.",
    ],
  },
  {
    company: "LABWARE",
    location: "Wilmington, Delaware",
    role: "Data Science Intern",
    date: "June 2022 – September 2022",
    tech: ["Python", "Tableau", "AWS S3", "Snowflake", "XGBoost"],
    points: [
      "Developed an end-to-end ETL pipeline for Crime data analysis using Python, AWS S3, and Snowflake.",
      "Engineered an XGBoost model to predict crime types with 80% accuracy, supporting proactive law enforcement strategies.",
      "Integrated machine learning insights into Tableau dashboards for intuitive data exploration by non-technical stakeholders.",
    ],
  },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// --- COMPONENT ---
export default function WorkExperience() {
  return (
    <motion.section
      id="experience"
      className="py-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-10xl mx-auto px-4">
        <motion.h2
          className="text-4xl lg:text-4xl font-bold mb-12 text-left bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Work Experience
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* The vertical line */}
          <div className="absolute left-5 top-2 w-0.5 h-screen bg-indigo-200/80"></div>

          {experiences.map((exp, i) => (
            <motion.div key={i} className="relative pl-12 pb-12" variants={itemVariants}>
              {/* Timeline Dot */}
              <div className="absolute left-0 top-1">
                <div className="w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                </div>
              </div>

              {/* Card Content */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                  <p className="text-indigo-600 font-semibold text-base mt-1 md:mt-0">{exp.company}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-5">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="ml-3 text-base text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}