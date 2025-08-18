// src/components/sections/EducationSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

// Data for your education history.
const degrees = [
  {
    school: "Drexel University",
    location: "Philadelphia, PA",
    degree: "M.S. in Business Analytics",
    date: "August 2021 – March 2023",
  },
  {
    school: "Pune University",
    location: "Pune, India",
    degree: "Bachelors in Electronics and Communication Engineering",
    date: "July 2016 – April 2020",
  },
];

// Animation variants for the timeline items, consistent with other sections.
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Renders the education history as a vertical timeline.
 * It's designed to be visually consistent with the WorkExperience component.
 */
export default function EducationSection() {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* The vertical timeline bar */}
      <div className="absolute left-5 top-2 w-0.5 h-full bg-indigo-200/80 -z-10"></div>

      {degrees.map((degree, i) => (
        <motion.div
          key={i}
          className="relative pl-16 pb-12 last:pb-0"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Timeline Dot with Icon */}
          <div className="absolute left-0 top-1">
            <div className="w-10 h-10 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
            </div>
          </div>

          {/* Degree Information Card */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/80">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
              <h3 className="text-xl font-bold text-slate-900">{degree.degree}</h3>
              <p className="text-indigo-600 font-semibold text-base mt-1 md:mt-0">{degree.school}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{degree.date}</span></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /><span>{degree.location}</span></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}