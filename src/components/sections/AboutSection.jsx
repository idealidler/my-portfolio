import React from 'react';
import { motion } from 'framer-motion';
import { Download, Linkedin, BarChart3, Puzzle, Eye, Code } from 'lucide-react';

// Animation variants for the container and its children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// A small component for the highlight cards
const HighlightCard = ({ icon, title, subtitle }) => (
  <motion.div
    variants={itemVariants}
    className="flex items-center gap-4 p-4 bg-white/50 rounded-lg"
  >
    <div className="text-indigo-500 bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  </motion.div>
);

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="pt-0 pb-14"
    >
      <div className="max-w-10xl mx-auto px-4 grid grid-cols-1 md:grid-cols- gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="md:col-span-3">
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
          >
            About
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-gray-700 mb-8 leading-relaxed">
            Hi, I am Akshay. I help businesses make sense of their data. Over the years, I’ve built dashboards, models,
            and analytics solutions that have turned messy spreadsheets and complex databases into clear, actionable stories.
            I work with Power BI, Python, SQL, and DAX to solve real problems — whether that’s improving reporting speed,
            uncovering hidden trends, or giving teams the tools they need to make faster, smarter decisions.
            I love digging into the details, but my real focus is always on the bigger picture: delivering something useful
            that people can actually act on.
          </motion.p>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <HighlightCard
              icon={<BarChart3 size={24} />}
              title="2+ Years Experience"
              subtitle="Building analytics solutions"
            />
            <HighlightCard
              icon={<Puzzle size={24} />}
              title="End-to-End Projects"
              subtitle="From data collection to deployment"
            />
            <HighlightCard
              icon={<Eye size={24} />}
              title="Dashboard UX Focus"
              subtitle="Passionate about effective storytelling"
            />
            <HighlightCard
              icon={<Code size={24} />}
              title="Advanced SQL & Python"
              subtitle="Proficient in data manipulation and analysis"
            />
          </div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
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
        </div>

        {/* Right Column: Image */}
        
      </div>
    </motion.section>
  );
}