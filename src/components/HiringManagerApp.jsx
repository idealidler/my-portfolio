import React, { useState } from 'react';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import WorkExperience from './sections/WorkExperience';
import FocusSectionSimple from './FocusSectionSimple';
import FocusSectionDetailed from './FocusSectionDetailed';

export default function App({ switchVersion }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [focusedSection, setFocusedSection] = useState(null);

  const openCase = (caseData) => setSelectedCase(caseData);
  const closeCase = () => setSelectedCase(null);

  const NAV_LINKS = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id, e) => {
    e.preventDefault();
    setFocusedSection(id);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-pink-50 to-white text-gray-800 flex flex-col">
      {/* Sticky Modern Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur shadow-md">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-bold text-xl select-none">
              AJ
            </div>
            <h1 className="font-bold text-xl text-indigo-700 select-none">Akshay Jain</h1>
          </div>
          <ul className="flex gap-8 text-indigo-600 font-semibold items-center">
            {NAV_LINKS.map(({ label, id }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(id, e)}
                  className="hover:text-indigo-900 transition"
                >
                  {label}
                </a>
              </li>
            ))}
            {/* Switch Version Button */}
      <div className="flex justify-center pt-1">
  <button
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      switchVersion();
    }}
    className="ml-4 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full shadow hover:bg-yellow-500 transition font-semibold"
  >
    Switch to Recruiter Version
  </button>
</div>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-28 max-w-6xl mx-auto px-8 flex-grow">
        {!focusedSection && (
          <>
            <AboutSection />
            <WorkExperience />
            <ProjectsSection openCase={openCase} />
            <SkillsSection />
            <ContactSection />
          </>
        )}

        {/* Focused Section Modal */}
        {focusedSection && (
          <FocusSectionDetailed onClose={() => setFocusedSection(null)}>
            {focusedSection === 'about' && <AboutSection />}
            {focusedSection === 'projects' && <ProjectsSection openCase={openCase} />}
            {focusedSection === 'skills' && <SkillsSection />}
            {focusedSection === 'contact' && <ContactSection />}
          </FocusSectionDetailed>
        )}

        {/* Case Study Detail Modal */}
        {selectedCase && (
          <FocusSectionDetailed onClose={closeCase}>
            <article className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto relative">
              <h2 className="text-3xl font-bold mb-4 text-indigo-700">{selectedCase.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedCase.client} • {selectedCase.industry}
              </p>
              <p className="mb-4">{selectedCase.problem}</p>
              <h3 className="font-semibold text-indigo-700 mb-2">Approach</h3>
              <ul className="list-disc list-inside mb-4">
                {selectedCase.approach.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <h3 className="font-semibold text-indigo-700 mb-2">Results</h3>
              <ul className="list-disc list-inside mb-4">
                {selectedCase.results.map((result, i) => (
                  <li key={i}>{result}</li>
                ))}
              </ul>
              <h3 className="font-semibold text-indigo-700 mb-2">Tools</h3>
              <p>{selectedCase.tools.join(', ')}</p>
              {selectedCase.github && (
                <a
                  href={selectedCase.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 px-5 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
                >
                  View Code
                </a>
              )}
            </article>
          </FocusSectionDetailed>
        )}
      </main>

      <footer className="w-full text-center py-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Akshay Jain. Built with ChatGPT and Copilot with absolute zero web development knowledge.
      </footer>
    </div>
  );
}
