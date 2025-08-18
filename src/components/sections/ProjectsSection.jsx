// src/components/sections/ProjectsSection.jsx

import React from 'react';

// Data for the case studies. Using a constant makes it easy to manage and update projects.
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
      'Identified “Employee discussions” and “Drink recommendations” as the most dominant conversation topics on r/Starbucks.',
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
    industry: 'Pune University',
    problem: 'Enable a system that detects handwritten numbers and operators from an image, then automatically computes the result of the math problem — bridging visual input and computation seamlessly.',
    summary: 'Developed a computer vision pipeline to detect and solve handwritten math problems from images.',
    approach: [
      'Preprocess and Train: Used image processing techniques and a custom neural network to detect handwritten digits and basic operators (+, –, ×), using a curated 45×45 pixel dataset.',
      'Model Deployment: Trained the model to recognize and classify the handwritten inputs accurately.',
      'Image-to-Solution Pipeline: Captured a picture of the handwritten math problem, processed it to detect each component, and programmatically solved it using the neural network outputs.',
    ],
    results: [
      'Built a working end-to-end recognition system that reads a snapped image of a handwritten equation and outputs the correct solution.',
      'Demonstrates the potential of combining CV and ML to automate handwriting-to-computation tasks — a useful foundation for educational tools or smart calculators.',
    ],
    tools: ['Python', 'OpenCV ', 'TensorFlow', 'Keras', 'NumPy', 'Scikit-learn'],
    thumbnail: `${import.meta.env.BASE_URL}assets/equation.jpg`,
    github: 'https://github.com/idealidler/Solve-basic-math-problem-using-computer-vision'
  },
  {
    id: 3,
    title: 'E-Commerce Customer Purchase Analysis: What Makes Reviewers Recommend Products',
    client: 'College Project',
    industry: 'Drexel University',
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


/**
 * Renders the "Featured Case Studies" section.
 * It maps over the CASE_STUDIES array to display a grid of project cards.
 * @param {function} openCase - A function passed from the parent to open the details modal.
 */
export default function ProjectsSection({ openCase }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {CASE_STUDIES.map((c) => (
        <article
          key={c.id}
          className="bg-white/70 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group flex flex-col overflow-hidden border border-slate-200/80"
          onClick={() => openCase(c)}
          tabIndex={0}
          onKeyPress={e => (e.key === 'Enter' ? openCase(c) : null)}
        >
          <div className="h-48 overflow-hidden">
            <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="font-bold text-lg text-indigo-800">{c.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{c.client} • {c.industry}</p>
            <p className="mt-3 text-sm text-gray-700 flex-1">{c.summary}</p>
            <div className="mt-4 pt-4 border-t border-indigo-100">
               <span className="text-sm font-semibold text-indigo-600">Read Case Study →</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}