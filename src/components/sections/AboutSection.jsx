// src/components/sections/AboutSection.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Linkedin, BarChart3, Puzzle, Eye, Code } from 'lucide-react';

// Animation variants for a staggered fade-in effect on child elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Reusable component for the highlight cards
const HighlightCard = ({ icon, title, subtitle }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-slate-200/80 shadow-sm"
  >
    <div className="text-indigo-500 bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  </motion.div>
);

/**
 * Renders the "About Me" section content.
 * This component focuses solely on the content, while the <Section> wrapper provides the title and spacing.
 */
export default function AboutSection() {
  return (
    <motion.div
      className="max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p variants={itemVariants} className="text-center text-lg text-gray-700 mb-10 leading-relaxed">
        Hi, I'm Akshay. I help businesses make sense of their data. I work with Power BI, Python, SQL, and DAX to
        turn messy spreadsheets and complex databases into clear, actionable stories. My real focus is always on the
        bigger picture: delivering something useful that people can actually act on.
      </motion.p>

      {/* Grid of highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <HighlightCard icon={<BarChart3 size={24} />} title="2+ Years Experience" subtitle="Building analytics solutions" />
        <HighlightCard icon={<Puzzle size={24} />} title="End-to-End Projects" subtitle="From data collection to deployment" />
        <HighlightCard icon={<Eye size={24} />} title="Dashboard UX Focus" subtitle="Passionate about effective storytelling" />
        <HighlightCard icon={<Code size={24} />} title="Advanced SQL & Python" subtitle="Data manipulation and analysis" />
      </div>

      {/* Action Buttons (Resume and LinkedIn) */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
        <a
          href={`${import.meta.env.BASE_URL}resume.pdf`}
          download
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <Download size={18} />
          Download Resume
        </a>
        <a
          href="https://www.linkedin.com/in/akshayjain128"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-indigo-400 text-indigo-600 font-semibold hover:bg-indigo-50 hover:border-indigo-500 transition-colors duration-300"
        >
          <Linkedin size={18} />
          View my LinkedIn
        </a>
      </motion.div>
    </motion.div>
  );
}