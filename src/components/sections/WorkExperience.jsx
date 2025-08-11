import React, { useState, useEffect } from "react";

// A simple icon for list items to add a polished touch.
const ChevronRightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);


export default function WorkExperience() {
  // State to trigger animations on mount for a smooth entrance effect.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after a short delay to allow the component to render first.
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const experiences = [
    {
      company: "HOLMAN",
      location: "Mt Laurel, New Jersey",
      role: "Analytics Engineer",
      date: "July 2023 – Present",
      points: [
        "Collaborated with Data Science & Engineering to build an enterprise-scale semantic model powering the Annual Business Review.",
        "Utilized CI/CD pipelines and Git for collaborative development of Power BI semantic models using .pbip and .tmdl files.",
        "Developed advanced SQL logic (T-SQL, Oracle SQL, PySQL) to translate complex business requirements into scalable data models.",
        "Built ETL pipelines and statistical models in Microsoft Fabric notebooks using Python to normalize client KPIs.",
        "Effectively managed competing priorities and cross-functional stakeholders across multiple high-impact initiatives.",
      ],
    },
    {
      company: "COLLABERA",
      location: "Basking Ridge, New Jersey",
      role: "Data Analyst Intern",
      date: "May 2023 – July 2023",
      points: [
        "Optimized SQL queries and utilized Power BI data modeling techniques to reduce report generation time by 30%.",
        "Implemented a Dimensional Calendar in Power BI using DAX functions tailored to the company’s specific needs.",
        "Developed a dashboard analyzing key business KPIs, delivering actionable insights to drive business outcomes.",
      ],
    },
    {
      company: "LABWARE",
      location: "Wilmington, Delaware",
      role: "Data Science Intern",
      date: "June 2022 – September 2022",
      points: [
        "Developed an end-to-end ETL pipeline for Crime data analysis using Python, AWS S3, and Snowflake.",
        "Engineered an XGBoost model to predict crime types with 80% accuracy, supporting proactive law enforcement.",
        "Integrated machine learning insights into Tableau dashboards for intuitive data exploration.",
      ],
    },
  ];

  return (
    // Section styling updated to match the 'About' section's spacing.
    // Assuming the parent container will handle max-width and horizontal padding.
    <section id="experience" className="mb-16">
      {/* Section Heading updated to match 'About' section style */}
      <h2 className="text-4xl font-bold mb-12 text-indigo-700 text-left">
        Work Experience
      </h2>

      {/* Experience Cards Container */}
      <div className="space-y-10">
        {experiences.map((exp, i) => (
          <div
            key={i}
            // Card animations are kept for a dynamic feel.
            className={`bg-white rounded-xl shadow-md border border-slate-200/80 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1
              ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`
            }
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className="p-6 sm:p-8">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                {/* Company name color updated for consistency */}
                <p className="text-indigo-600 font-semibold text-sm mt-1 sm:mt-0">{exp.company}</p>
              </div>
              {/* Meta info (location, date) color updated to gray for consistency */}
              <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mb-5">
                <span>{exp.location}</span>
                <span className="italic">{exp.date}</span>
              </div>

              {/* Experience Points - text color updated to gray-700 */}
              <ul className="space-y-3">
                {/* FIXED: Now mapping over the 'points' for the current experience */}
                {exp.points.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    {/* Icon color uses a lighter indigo to match button styles from 'About' */}
                    <ChevronRightIcon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-base text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
