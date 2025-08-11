import React from "react";
import {
  Briefcase,
  GraduationCap,
  UserCheck,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

const RecruiterFriendly = ({ setMode }) => {
  return (
    <section className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 backdrop-blur-lg rounded-3xl shadow-2xl space-y-10 border border-gray-200">
      
      {/* Header / Summary Snapshot */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-300 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Akshay Jain
          </h1>
          <p className="text-lg text-gray-700">Analytics Engineer | Data Consultant</p>
          <p className="text-sm text-gray-500">Philadelphia, PA • Open to Relocation</p>

      {/* New Summary */}
      <p className="mt-4 text-gray-700 leading-relaxed max-w-xl">
        I am a data professional who excels at solving problems, translating complex data into clear and 
        actionable insights, and quickly adapting to new tools and technologies. 
        I am proficient in Power BI, SQL, and Python, with strong experience in building pipelines 
        in Microsoft Fabric. I am skilled at scoping and planning projects with accurate time estimates, 
        working efficiently in Agile environments, and collaborating with business teams to deliver solutions 
        that not only meet requirements but also provide additional value through data-driven recommendations.
      </p>
      </div>
      <div className="flex flex-col items-start md:items-end text-gray-600 text-sm space-y-1">
        <div className="flex items-center gap-2"><Phone size={16}/> +1 (445) 208-1735</div>
        <div className="flex items-center gap-2"><Mail size={16}/><a href="mailto:akshayjain128@gmail.com" 
        className="text-indigo-600 hover:underline">
      akshayjain128@gmail.com
      </a>
        </div>
        </div>
      </div>

      {/* Work Authorization & Availability */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><UserCheck size={20}/> Work Authorization & Availability</h2>
        <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
          <li>Authorized to work in the U.S. (F1 OPT STEM Extension valid until May 2026)</li>
          <li>Available to start immediately</li>
          <li>Open to remote, hybrid, or relocation opportunities</li>
        </ul>
      </div>

      {/* Years of Experience & Core Skills */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><Clock size={20}/> Experience & Skills</h2>
        <p className="mt-2 text-gray-700">2+ years of experience building data-driven analytics solutions</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Python", "SQL", "Microsoft Fabric", "Power BI", "Git CI/CD", "JavaScript / React"].map(skill => (
            <span key={skill} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Most Recent Experience Highlights */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><Briefcase size={20}/> Recent Roles</h2>
        <div className="mt-4 grid gap-4">
          {/* Holman */}
          <div className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
            <p className="font-semibold text-indigo-600">Analytics Engineer — Holman</p>
            <p className="text-sm text-gray-500">July 2023 - Present</p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Built enterprise Power BI dashboards replacing 15+ reports, saving 30–40 hours per consultant.</li>
              <li>Developed scalable SQL and Python-based data models for KPI tracking and benchmarking.</li>
              <li>Managed cross-functional projects with strong prioritization and communication skills.</li>
            </ul>
          </div>
          {/* Collabera */}
          <div className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
            <p className="font-semibold text-indigo-600">Data Analyst — Collabera</p>
            <p className="text-sm text-gray-500">May 2023 - July 2023</p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Optimized SQL and Power BI models, reducing report time by 30%.</li>
              <li>Created a custom Dimensional Calendar, improving reporting efficiency by 15%.</li>
              <li>Delivered KPI dashboards with actionable insights for business improvement.</li>
            </ul>
          </div>
          {/* Labware */}
          <div className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
            <p className="font-semibold text-indigo-600">Data Science Intern — Labware</p>
            <p className="text-sm text-gray-500">June 2022 - September 2022</p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Built ETL pipelines using Python, AWS S3, and Snowflake for crime data analysis.</li>
              <li>Developed an XGBoost model predicting crime types with 80% accuracy.</li>
              <li>Integrated ML results into Tableau dashboards for non-technical users.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-700"><GraduationCap size={20}/> Education</h2>
        <div className="mt-2 space-y-1 text-gray-700">
          <p><span className="font-medium">Master’s in Business Analytics</span> — Drexel University (2023)</p>
          <p><span className="font-medium">Bachelor’s in Electronics and Telecommunications</span> — Pune University (2020)</p>
        </div>
      </div>

      {/* Switch Version Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setMode("hiringManager")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 hover:shadow-lg transition-transform"
        >
          View Hiring Manager Version
        </button>
      </div>
    </section>
  );
};

export default RecruiterFriendly;
