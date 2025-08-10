import React from 'react';

const SKILLS = [
  { name: 'Power BI', level: 'Advanced', blurb: 'Star schema data modeling, DAX, performance tuning, custom visuals' },
  { name: 'DAX', level: 'Advanced', blurb: 'Time intelligence, context transition, optimization, calculation groups' },
  { name: 'Python', level: 'Intermediate', blurb: 'Data cleaning (pandas), automation scripts, simple ML prototypes' },
  { name: 'SQL', level: 'Advanced', blurb: 'Complex joins, window functions, ETL queries' },
  { name: 'Data Viz', level: 'Advanced', blurb: 'Storytelling, dashboard UX, KPI design' },
  { name: 'AI & ML', level: 'Intermediate', blurb: 'Regression & classification, neural networks, NLP (NLTK, spaCy), computer vision (OpenCV)' },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="mb-16">
      <h2 className="text-4xl font-bold text-indigo-700 mb-6">Skills & Toolbox</h2>
      <p className="text-gray-600 mb-6">Click a tool to see how I use it in projects.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {SKILLS.map((s) => (
          <div
            key={s.name}
            className="bg-white/90 backdrop-blur rounded-xl p-5 shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
            tabIndex={0}
          >
            <div className="font-semibold text-indigo-700">{s.name}</div>
            <div className="text-xs text-gray-500">{s.level}</div>
            <div className="mt-2 text-sm text-gray-600">{s.blurb}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
