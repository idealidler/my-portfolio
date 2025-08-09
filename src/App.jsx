import React, { useState } from 'react';

const CASE_STUDIES = [
  {
    id: 1,
    title: 'Optimizing Sales Forecast Accuracy by 22%',
    client: 'Confidential - Retail Client',
    industry: 'Retail',
    problem: 'Sales forecasts were inconsistent across regions and required heavy manual work every week.',
    approach: [
      'Consolidated multiple data sources using SQL and Python (pandas).',
      'Built a Power BI model with robust date intelligence using DAX (rolling forecasts).',
      'Automated ETL scripts to refresh dataset and reduced latency.',
    ],
    results: [
      'Forecast accuracy improved by 22%',
      'Reporting time reduced from 5 hours to 15 minutes',
      'Decision-makers received automated weekly insights via scheduled email',
    ],
    tools: ['Power BI', 'DAX', 'Python', 'SQL'],
    thumbnail: `${import.meta.env.BASE_URL}assets/increase.png`,
  },
  {
    id: 2,
    title: 'Customer Churn Dashboard with Actionable Segments',
    client: 'SaaS Provider (Anon)',
    industry: 'SaaS',
    problem: 'High churn rate with poor visibility into at-risk customers.',
    approach: [
      'Performed cohort analysis in Python and summarized results in Power BI.',
      'Created RFM segmentation and churn prediction model prototype.',
      'Built drill-through reports for product & customer success teams.',
    ],
    results: [
      'Identified 3 high-risk segments and targeted campaigns',
      'Estimated potential revenue retention: ~$120k/year',
    ],
    tools: ['Python', 'Power BI', 'DAX', 'Excel'],
    thumbnail: `${import.meta.env.BASE_URL}assets/customer.png`,
  },
  {
    id: 3,
    title: 'Executive KPI Suite for Finance Operations',
    client: 'Mid-size Financial Services',
    industry: 'Finance',
    problem: 'Executives lacked a unified view of KPIs and had conflicting numbers across teams.',
    approach: [
      'Aligned definitions across teams and built central metrics layer in Power BI.',
      'Implemented measures in DAX with robust context handling and performance tuning.',
      'Created paginated report-like pages for exporting board-ready PDFs.',
    ],
    results: [
      'Single source of truth cut reconciliation time by 70%',
      'Board reports generated automatically saving 8 person-hours/week',
    ],
    tools: ['Power BI', 'DAX', 'Power Automate'],
    thumbnail: `${import.meta.env.BASE_URL}assets/budget.png`,
  },
];

const SKILLS = [
  { name: 'Power BI', level: 'Advanced', blurb: 'Data modeling, DAX, performance tuning, custom visuals' },
  { name: 'DAX', level: 'Advanced', blurb: 'Time intelligence, context transition, optimization' },
  { name: 'Python', level: 'Intermediate', blurb: 'Data cleaning (pandas), automation scripts, simple ML prototypes' },
  { name: 'SQL', level: 'Advanced', blurb: 'Complex joins, window functions, ETL queries' },
  { name: 'Data Viz', level: 'Advanced', blurb: 'Storytelling, dashboard UX, KPI design' },
  { name: 'Automation', level: 'Intermediate', blurb: 'Power Automate, scheduled ETL, scripting' },
];

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function App() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState('all');

  const openCase = (c) => setSelectedCase(c);
  const closeCase = () => setSelectedCase(null);

  const filteredCases =
    filter === 'all' ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.industry.toLowerCase() === filter);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-pink-50 to-white text-gray-800 flex flex-col">
      {/* Sticky Modern Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur shadow-md">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg">AJ</div>
            <span className="font-semibold text-lg tracking-tight">Akshay Jain</span>
          </div>
          <ul className="flex gap-6 items-center">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                download
                className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content with top padding for fixed nav */}
      <main className="flex-1 pt-28 pb-12 px-4 md:px-0 max-w-6xl mx-auto w-full">
        {/* About Section */}
        <section
          id="about"
          className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-10 mb-16 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4 text-indigo-700">About Me</h2>
            <p className="text-lg text-gray-700 mb-6">
              Hi, I’m Akshay. I build dashboards and analytics that people actually use. My background spans finance and product analytics where I focused on building reliable metrics and automated reporting. I enjoy turning raw data into clear stories that leaders can act on.
            </p>
            <ul className="space-y-2 text-base text-gray-600 mb-6">
              <li>• 5+ years building analytics & dashboards</li>
              <li>• Comfortable working end-to-end: data collection to visualization</li>
              <li>• Passionate about UX for dashboards & effective storytelling</li>
            </ul>
            <div className="flex gap-4">
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                download
                className="px-5 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
              >
                Download Resume
              </a>
              <a
                href="https://www.linkedin.com/in/akshayjain128"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border border-indigo-300 rounded-full text-indigo-700 hover:bg-indigo-50 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl bg-white flex items-center justify-center border border-indigo-100">
              <img
                src={`${import.meta.env.BASE_URL}assets/profile.jpg`}
                alt="Akshay"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-bold text-indigo-700 mb-2">Featured Case Studies</h2>
              <p className="text-gray-600">Projects that drove measurable outcomes.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Filter:</label>
              <select className="border border-indigo-200 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-400 transition"
                value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="retail">Retail</option>
                <option value="saas">SaaS</option>
                <option value="finance">Finance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCases.map((c) => (
              <article
                key={c.id}
                className="bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer group flex flex-col"
                onClick={() => openCase(c)}
                tabIndex={0}
                onKeyPress={e => (e.key === 'Enter' ? openCase(c) : null)}
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-2xl">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="font-semibold text-lg text-indigo-700">{c.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{c.client} • {c.industry}</p>
                  <ul className="mt-3 text-sm text-gray-700 space-y-1 flex-1">
                    <li className="truncate">{c.problem}</li>
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">{c.tools.join(' • ')}</div>
                    <button
                      onClick={e => { e.stopPropagation(); openCase(c); }}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
                    >Read</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Skills Section */}
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

        {/* Contact Section */}
        <section id="contact" className="mb-16">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-indigo-700 mb-4">Contact</h2>
              <p className="text-gray-600 mb-6">If you'd like to discuss a role or project, email me or schedule a quick call.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <a className="text-indigo-600 hover:underline" href="mailto:akshayjain128@gmail.com">akshayjain128@gmail.com</a>
                </div>
                <div>
                  <h4 className="font-semibold">Availability</h4>
                  <p className="text-gray-600">Open to full-time roles. Available for interviews. Mornings ET preferred.</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl bg-white flex items-center justify-center border border-indigo-100">
                <img
                  src={`${import.meta.env.BASE_URL}assets/profile.jpg`}
                  alt="Akshay"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Case Study */}
      {selectedCase && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeCase}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl animate-fadeInUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                <img src={selectedCase.thumbnail} alt={selectedCase.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedCase.title}</h3>
                <p className="text-sm text-gray-500">{selectedCase.client} • {selectedCase.industry}</p>
              </div>
              <button
                onClick={closeCase}
                className="text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
                aria-label="Close"
              >✕</button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold">Problem</h4>
                <p className="text-gray-700 mt-2">{selectedCase.problem}</p>
                <h4 className="font-semibold mt-4">Approach</h4>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  {selectedCase.approach.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-4">Results</h4>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  {selectedCase.results.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-4">Tools</h4>
                <div className="mt-2 text-sm text-gray-600">{selectedCase.tools.join(', ')}</div>
              </div>
              <div>
                <h4 className="font-semibold">Demo / Visual</h4>
                <div className="mt-2 bg-gray-100 rounded-xl overflow-hidden h-56 flex items-center justify-center">
                  <img src={selectedCase.thumbnail} alt="Demo" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">Notes</h4>
                  <p className="text-sm text-gray-600 mt-2">Use this area to briefly describe technical decisions, DAX snippets, or links to public notebooks and repos.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                download
                className="px-4 py-2 border rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
              >
                Resume
              </a>
              <a
                href="#contact"
                onClick={closeCase}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s;
        }
      `}</style>

      <footer className="w-full text-center py-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Akshay Jain. Built with ❤️ using React & Vite.
      </footer>
    </div>
  );
}