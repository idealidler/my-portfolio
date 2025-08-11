import React from 'react';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="mb-16 flex flex-col md:flex-row items-center gap-10"
    >
      <div className="flex-1">
        <h2 className="text-4xl font-bold mb-4 text-indigo-700">About Me</h2>
        <p className="text-lg text-gray-700 mb-6">
          Hi, I am Akshay. I help businesses make sense of their data. Over the years, I’ve built dashboards, models, 
          and analytics solutions that have turned messy spreadsheets and complex databases into clear, actionable stories. 
          I work with Power BI, Python, SQL, and DAX to solve real problems — whether that’s improving reporting speed, 
          uncovering hidden trends, or giving teams the tools they need to make faster, smarter decisions. 
          I love digging into the details, but my real focus is always on the bigger picture: delivering something useful
           that people can actually act on.
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
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium shadow-sm hover:from-indigo-600 hover:to-blue-600 transition-colors duration-200"

          >
            Download Resume
          </a>
          <a
            href="https://www.linkedin.com/in/akshayjain128"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full border border-indigo-400 text-indigo-500 font-medium hover:bg-indigo-50 transition-colors duration-200"

          >
            Go to LinkedIn
          </a>
        </div>
      </div>
      <div className="flex-shrink-0">
        
      </div>
    </section>
  );
}
