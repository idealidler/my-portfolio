// src/components/sections/Section.jsx

import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable wrapper component to ensure consistent styling for all page sections.
 * It provides a standardized layout for the section ID, title, subtitle, and content.
 * framer-motion is used for a subtle fade-in animation as the user scrolls.
 * @param {string} id - The HTML id for the section, used for navigation.
 * @param {string} title - The main heading for the section.
 * @param {string} subtitle - The subheading displayed below the title.
 * @param {React.ReactNode} children - The content of the section.
 */
export default function Section({ id, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      className="py-16 sm:py-20" // Consistent vertical padding for all sections
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        )}
      </div>

      {/* Section Content */}
      {children}
    </motion.section>
  );
}