import React, { useState } from 'react';

const CASE_STUDIES = [
  {
    id: 1,
    title: 'Studying Starbucks Through the Lens of Social Media',
    client: 'Retail Client',
    industry: 'Retail',
    problem: 'I wanted to understand what topics Starbucks fans were talking about online and whether those conversations shifted before versus after the pandemic. Specifically, the goal was to identify dominant discussion themes and pinpoint when users were most active throughout the day.',
    summary: 'Analyzed Starbucks’ brand perception by applying sentiment analysis to thousands of social media posts.',
    approach: [
      'Collect the Data: Used the Pushshift API to pull thousands of Starbucks subreddit posts from before and after COVID-19.',
      'Clean and Prepare: Removed extra symbols, punctuation, and filler words so the text was ready for analysis.',
      'Analyze and Visualize: Applied LDA topic modeling to find the main themes, and created charts to see how posting activity changed over time.',
    ],
    results: [
      'Identified “Employee discussion” and “Drink recommendations” as the most dominant conversation topics on r/Starbucks.',
      'Discovered distinct discussion topics such as seasonal drinks, service quality, and brand loyalty trends.',
      'Quantified a notable drop in in-store experience discussions and a rise in convenience-related themes post-pandemic.',
    ],
    tools: ['Python', 'pandas', 'matplotlib', 'seaborn', 'LDA', 'Pushshift API', 'requests library'],
    thumbnail: `${import.meta.env.BASE_URL}assets/star.jpg`,
    github: 'https://github.com/idealidler/Studying-Starbucks-through-the-lens-of-social-media'
  },
  {
    id: 2,
    title: 'Solve Simple Handwritten Math Problems Using Computer Vision',
    client: 'Capstone Project',
    problem: 'Enable a system that detects handwritten numbers and operators from an image, then automatically computes the result of the math problem — bridging visual input and computation seamlessly.',
    summary: 'Developed a computer vision pipeline to detect and solve handwritten math problems from images.',
    approach: [
      'Preprocess and Train: Used image processing techniques and a custom neural network to detect handwritten digits and basic operators (+, –, ×), using a curated 45×45 pixel dataset.',
      'Model Deployment: Trained your model (model_final.h5) to recognize and classify the handwritten inputs accurately.',
      'Image-to-Solution Pipeline: Captured a picture of the handwritten math problem, processed it to detect each component, and programmatically solved it using the neural network outputs.',
    ],
    results: [
      'Built a working end-to-end recognition system that reads a snapped image of a handwritten equation and outputs the correct solution.',
      'Demonstrates the potential of combining CV and ML to automate handwriting-to-computation tasks — a useful foundation for educational tools or smart calculators.',
    ],
    tools: ['Python', 'OpenCV ', 'pytesseract', 'TensorFlow', 'Keras', 'NumPy', 'Scikit-learn'],
    thumbnail: `${import.meta.env.BASE_URL}assets/equation.jpg`,
    github: 'https://github.com/idealidler/Solve-basic-math-problem-using-computer-vision'
  },
  {
    id: 3,
    title: 'E-Commerce Customer Purchase Analysis: What Makes Reviewers Recommend Products',
    client: 'College Project',
    problem: 'Dig into women’s e-commerce clothing reviews to discover what influences shoppers to recommend (or not recommend) a product.',
    summary: 'Explored customer purchasing behavior in e-commerce to uncover trends and patterns for better decision-making.',
    approach: [
      'Clean & Prep the Data: Used Pandas and NLTK to remove duplicates, punctuation, numbers, and stop words, and then performed lemmatization and one-hot encoding of categories.',
      'Explore & Visualize Trends: Created visuals like donut charts, bar plots, histograms, word clouds, and correlation matrices to uncover how age, department, sentiment, and other features relate to recommendations.',
      'Extract Topics & Build Models: Applied LDA topic modeling to surface the top three recurring themes in reviews—Product Feeling, Online Shopping, Dress Sizing & Fitting—and trained ML models to predict whether a review will include a recommendation.',
    ],
    results: [
      'Three key themes emerged: customer sentiment leaned heavily on product feel, online experience, and sizing/fitting feedback.',
      'Identified department- and age-specific trends, like which segments had more recommendations and which suffered more complaints.' ,
      'Enabled actionable insights: suggested improving sizing in “Trend” department, enhancing product visuals and feel—all aimed at boosting recommendation rates.'
    ],
    tools: ['Power BI', 'DAX', 'Python', 'pandas', 'matplotlib', 'seaborn', 'NLTK', 'LDA', 'Scikit-learn'],
    thumbnail: `${import.meta.env.BASE_URL}assets/dress.jpg`,
    github: 'https://github.com/idealidler/E-Commerce-Customer-Purchase-Analysis'
  },
];

const SKILLS = [
  { name: 'Power BI', level: 'Advanced', blurb: 'Star schema data modeling, DAX, performance tuning, custom visuals' },
  { name: 'DAX', level: 'Advanced', blurb: 'Time intelligence, context transition, optimization, calculation groups' },
  { name: 'Python', level: 'Intermediate', blurb: 'Data cleaning (pandas), automation scripts, simple ML prototypes' },
  { name: 'SQL', level: 'Advanced', blurb: 'Complex joins, window functions, ETL queries' },
  { name: 'Data Viz', level: 'Advanced', blurb: 'Storytelling, dashboard UX, KPI design' },
  { name: 'AI & ML', level: 'Intermediate', blurb: 'Regression & classification, neural networks, NLP (NLTK, spaCy), computer vision (OpenCV)' },
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
              Hi, I am Akshay. I help businesses make sense of their data. Over the years, I’ve built dashboards, models, and analytics solutions that have turned messy spreadsheets and complex databases into clear, actionable stories. I work with Power BI, Python, SQL, and DAX to solve real problems — whether that’s improving reporting speed, uncovering hidden trends, or giving teams the tools they need to make faster, smarter decisions. I love digging into the details, but my real focus is always on the bigger picture: delivering something useful that people can actually act on.
            </p>
            <ul className="space-y-2 text-base text-gray-600 mb-6">
              <li>• 2+ years building analytics & dashboards</li>
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
                  <p className="mt-3 text-sm text-gray-700 flex-1">{c.summary}</p>
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
    <div className="flex-1 w-full">
      <h2 className="text-4xl font-bold text-indigo-700 mb-4">Contact</h2>
      <p className="text-gray-600 mb-8">
        If you'd like to discuss a role or project, email me or schedule a quick call.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Email */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12H8m8-4H8m-2 8h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h4 className="font-semibold">Email</h4>
          </div>
          <a
            href="mailto:akshayjain128@gmail.com"
            className="text-indigo-600 hover:underline break-all"
          >
            akshayjain128@gmail.com
          </a>
        </div>

        {/* Availability */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7 6h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h4 className="font-semibold">Availability</h4>
          </div>
          <p className="text-gray-600">
            Open to full-time roles. Available for interviews.<br />Mornings ET preferred.
          </p>
        </div>

        {/* Schedule a Call */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7 6h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h4 className="font-semibold">Schedule a Call</h4>
          </div>
          <a
            href="https://calendly.com/akshayjain128/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
          >
            Book 30-min Call
          </a>
        </div>
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
      <div className="mt-4 flex flex-col gap-6">
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
          {selectedCase.github && (
            <a
              href={selectedCase.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-gray-700 hover:text-indigo-700 font-medium transition"
            >
              {/* GitHub SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          )}
        </div>
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
        &copy; {new Date().getFullYear()} Akshay Jain. Built with ChatGPT and Copilot with absolute zero web development knowledge.
      </footer>
    </div>
  );
}