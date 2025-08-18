// src/components/SuggestedPrompts.jsx

import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

/**
 * A component that displays a grid of suggested prompts for the user to click.
 * This helps guide the conversation and showcase the chatbot's capabilities.
 */
export default function SuggestedPrompts({ onPromptClick }) {
  const prompts = [
    "What are Akshay's key technical skills?",
    "Summarize his work experience at Holman.",
    "What are his education details?",
    "How does he approach problem-solving?",
  ];

  return (
    // FIX: Added 'mt-8' (margin-top) to create space from the input bar above.
    <div className="w-full max-w-3xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="group w-full text-left p-3 bg-white/60 border border-slate-200/80 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300/70 hover:bg-indigo-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3"> {/* FIX: Changed items-start to items-center for better alignment */}
              <SparklesIcon className="h-5 w-5 text-indigo-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
              <span className="text-gray-700 text-sm font-medium group-hover:text-indigo-700">
                {prompt}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};