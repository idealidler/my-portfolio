// src/components/HiringManagerApp.jsx

import React, { useState } from 'react';

// Import all section components and the new Section wrapper
import Section from './sections/Section';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import EducationSection from './sections/EducationSection';
import WorkExperience from './sections/WorkExperience';
import FocusSectionDetailed from './FocusSectionDetailed';
import { Home } from "lucide-react";

/**
 * This is the main component for the "Hiring Manager" view.
 * It serves as the primary layout, assembling all the individual sections.
 * It manages the state for the case study modal and handles smooth-scroll navigation.
 */
export default function HiringManagerApp({ switchVersion }) {
  // State to manage which case study is currently open in a modal. 'null' means none are open.
  const [selectedCase, setSelectedCase] = useState(null);

  // Handlers to open and close the case study modal
  const openCase = (caseData) => setSelectedCase(caseData);
  const closeCase = () => setSelectedCase(null);

  // Data for the navigation links in the header
  const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Education', id: 'education' }, 
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' }
  ];

  // Handles smooth scrolling when a nav link is clicked
  const handleNavClick = (id, e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-pink-50 to-white text-gray-800 flex flex-col">
      {/* Sticky Modern Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-lg shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-bold text-lg select-none">
              AJ
            </div>
            <h1 className="font-bold text-xl text-indigo-700 select-none">Akshay Jain</h1>
          </div>
          <ul className="hidden md:flex gap-8 text-indigo-600 font-semibold items-center">
            {NAV_LINKS.map(({ label, id }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(id, e)}
                  className="hover:text-indigo-900 transition-colors duration-300"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
           <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' }); // <-- ADD THIS LINE
              switchVersion("recruiter");
            }}
            className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full shadow-sm hover:bg-yellow-500 transition font-semibold text-sm"
          >
            Recruiter Version
          </button>
            <button
              onClick={() => switchVersion(null)}
              className="p-2 bg-indigo-600 text-white rounded-full shadow-sm hover:bg-indigo-700 transition"
              title="Back to Landing Page"
            >
              <Home size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 max-w-7xl mx-auto px-6 flex-grow">
        {/* Each section is now wrapped with our consistent <Section> component */}
        <Section id="about" title="About Me">
          <AboutSection />
        </Section>
        <Section id="experience" title="Work Experience">
          <WorkExperience />
        </Section>
        <Section id="education" title="Education">
          <EducationSection />
        </Section>
        <Section id="projects" title="Featured Case Studies" subtitle="Projects that drove measurable outcomes.">
          <ProjectsSection openCase={openCase} />
        </Section>
        <Section id="skills" title="Skills & Toolbox" subtitle="My technical skills and the tools I use to bring ideas to life.">
          <SkillsSection />
        </Section>
        <Section id="contact" title="Get In Touch">
          <ContactSection />
        </Section>
      </main>

      {/* Modal for displaying detailed Case Study information */}
      {selectedCase && (
        <FocusSectionDetailed onClose={closeCase}>
          <article className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-indigo-700">{selectedCase.title}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {selectedCase.client} • {selectedCase.industry}
            </p>
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg text-indigo-700 mb-2 border-b pb-1">The Problem</h3>
                <p>{selectedCase.problem}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-indigo-700 mb-2 border-b pb-1">My Approach</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedCase.approach.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-indigo-700 mb-2 border-b pb-1">Key Results</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedCase.results.map((result, i) => <li key={i}>{result}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-indigo-700 mb-2 border-b pb-1">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tools.map(tool => (
                    <span key={tool} className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">{tool}</span>
                  ))}
                </div>
              </div>
              {selectedCase.github && (
                <a
                  href={selectedCase.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
                >
                  View Code on GitHub
                </a>
              )}
            </div>
          </article>
        </FocusSectionDetailed>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Akshay Jain. All rights reserved.
      </footer>
    </div>
  );
}