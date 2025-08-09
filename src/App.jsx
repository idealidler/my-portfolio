import React, { useState } from 'react';

// Sample data — replace with your own case studies and skill highlights
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
    thumbnail: '/assets/increase.png',
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
    thumbnail: '/assets/customer.png',
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
    thumbnail: '/assets/budget.png',
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

export default function App() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [filter, setFilter] = useState('all');

  const openCase = (c) => setSelectedCase(c);
  const closeCase = () => setSelectedCase(null);

  const filteredCases =
    filter === 'all' ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.industry.toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-white text-gray-800">
      <header className="bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">AJ</div>
            <div>
              <h1 className="text-xl font-semibold">Akshay Jain — Data & BI Consultant</h1>
              <p className="text-sm text-gray-500">Power BI • DAX • Python • SQL — I turn messy data into decision-ready insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/idealidler" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
            >View Projects</a>
            <a href="/resume.pdf"
              className="px-4 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
            >Download Resume</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* About */}
        <section id="about" className="mt-4 bg-white/90 rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-2">About Me</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 text-gray-700">
              <p>Hi, I’m Akshay. I build dashboards and analytics that people actually use. My background spans finance and product analytics where I focused on building reliable metrics and automated reporting. I enjoy turning raw data into clear stories that leaders can act on.</p>
              <ul className="mt-4 text-sm space-y-1 text-gray-600">
                <li>• 5+ years building analytics & dashboards</li>
                <li>• Comfortable working end-to-end: data collection to visualization</li>
                <li>• Passionate about UX for dashboards & effective storytelling</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <a href="/resume.pdf"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition text-center"
              >Download Resume</a>
              <a href="https://www.linkedin.com/in/akshayjain128" target="_blank" rel="noreferrer"
                className="px-4 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition text-center"
              >LinkedIn</a>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold">Case Study Lab: Projects that drove measurable outcomes</h2>
            <p className="mt-4 text-gray-600">Explore a selection of projects where I used Power BI, DAX, and Python to solve business problems. Each case study focuses on problem, approach, and measurable results — exactly what hiring managers want to see.</p>
            <div className="mt-6 flex gap-3">
              <a href="#contact"
                className="px-4 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
              >Contact Me</a>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
              <div className="p-3 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-xs text-gray-500">Primary Tools</div>
                <div className="font-semibold">Power BI • Python • SQL</div>
              </div>
              <div className="p-3 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-xs text-gray-500">Industries</div>
                <div className="font-semibold">Retail • SaaS • Finance</div>
              </div>
              <div className="p-3 bg-white rounded-xl shadow hover:shadow-md transition">
                <div className="text-xs text-gray-500">Deliverables</div>
                <div className="font-semibold">Dashboards • Automation • Reports</div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-xl bg-white flex items-center justify-center border border-indigo-100">
              <img src="/assets/profile.jpg" alt="Akshay" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mt-12">
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-semibold">Featured Case Studies</h3>
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 cursor-pointer group"
                onClick={() => openCase(c)}
                tabIndex={0}
                onKeyPress={e => (e.key === 'Enter' ? openCase(c) : null)}
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-2xl">
                  <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold">{c.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{c.client} • {c.industry}</p>
                  <ul className="mt-3 text-sm text-gray-700 space-y-1">
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

        {/* Skills */}
        <section id="skills" className="mt-12">
          <h3 className="text-2xl font-semibold">Skills & Toolbox</h3>
          <p className="text-gray-600 mt-2">Click a tool to see how I use it in projects.</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {SKILLS.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-xl p-3 shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                tabIndex={0}
              >
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-gray-500">{s.level}</div>
                <div className="mt-2 text-sm text-gray-600">{s.blurb}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mt-12">
          <div className="bg-white/90 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold">Contact</h3>
            <p className="text-gray-600 mt-2">If you'd like to discuss a role or project, email me or schedule a quick call.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </section>

        <footer className="mt-12 py-6 text-center text-sm text-gray-500">
          Built with Copilot and ChatGPT with Zero Development Knowledge.
        </footer>
      </main>

      {/* Case Study Modal */}
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
              <a href="/resume.pdf" className="px-4 py-2 border rounded-lg hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition">Resume</a>
              <a href="#contact" onClick={closeCase} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition">Contact</a>
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
    </div>
  );
}