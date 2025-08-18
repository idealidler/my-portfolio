// src/components/SuggestedPrompts.js

import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const SuggestedPrompts = ({ onPromptClick }) => {
  const prompts = [
    "What are Akshay's key technical skills?",
    "Why is Akshay passionate about learning new things?",
    "What are Akshay's career goals?",
    "How does Akshay approach problem-solving?"
  ];

  return (
    <div className="my-12 w-full max-w-3xl">
      <p className="text-gray-600 text-base font-medium mb-6 text-center">
        Try asking one of these:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="group w-full flex items-center justify-start p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-200 ease-in-out"
          >
            <SparklesIcon className="h-5 w-5 mr-3 text-indigo-400 group-hover:text-purple-500 transition-colors" />
            <span className="text-gray-800 text-sm font-medium group-hover:text-indigo-700">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
