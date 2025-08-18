// src/components/sections/SkillsSection.jsx

import React from 'react';

// Data for the skills, including name, level, and a descriptive blurb.
const SKILLS = [
  { name: 'Power BI', level: 'Advanced', blurb: 'Star schema data modeling, DAX, performance tuning, custom visuals' },
  { name: 'DAX', level: 'Advanced', blurb: 'Time intelligence, context transition, optimization, calculation groups' },
  { name: 'Python', level: 'Intermediate', blurb: 'Data cleaning (pandas), automation scripts, simple ML prototypes' },
  { name: 'SQL', level: 'Advanced', blurb: 'Complex joins, window functions, ETL queries' },
  { name: 'Data Viz', level: 'Advanced', blurb: 'Storytelling, dashboard UX, KPI design' },
  { name: 'AI & ML', level: 'Intermediate', blurb: 'Regression & classification, neural networks, NLP (NLTK, spaCy), computer vision (OpenCV)' },
];


/**
 * Renders the "Skills & Toolbox" section.
 * Displays a grid of cards, each representing a technical skill.
 */
export default function SkillsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
      {SKILLS.map((s) => (
        <div
          key={s.name}
          className="bg-white/70 backdrop-blur rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border border-slate-200/80"
          tabIndex={0}
        >
          <div className="font-bold text-lg text-indigo-700">{s.name}</div>
          <div className="text-xs text-indigo-400 font-medium uppercase tracking-wider">{s.level}</div>
          {/* A future enhancement could be to make these cards clickable to filter projects. */}
        </div>
      ))}
    </div>
  );
}