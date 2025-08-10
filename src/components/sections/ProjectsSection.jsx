import React from 'react';

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
      'Model Deployment: Trained the model (model_final.h5) to recognize and classify the handwritten inputs accurately.',
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

export default function ProjectsSection({ openCase }) {
  return (
    <section id="projects" className="mb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-indigo-700 mb-2">Featured Case Studies</h2>
          <p className="text-gray-600">Projects that drove measurable outcomes.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CASE_STUDIES.map((c) => (
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
  );
}
