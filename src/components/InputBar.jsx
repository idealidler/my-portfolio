// src/components/InputBar.js
import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function InputBar({ value, onChange, onSubmit, isDisabled, onPromptClick }) {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const prompts = [
    "What are Akshay's key technical skills?",
    "Why is Akshay passionate about learning new things?",
  ];

  // Filter suggestions based on input
  const filteredPrompts = prompts.filter((p) =>
    p.toLowerCase().includes(value.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (!isFocused || filteredPrompts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredPrompts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev === -1 ? filteredPrompts.length - 1 : (prev - 1 + filteredPrompts.length) % filteredPrompts.length
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      onPromptClick(filteredPrompts[highlightIndex]);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmit} className="flex items-center w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay allows click
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-800"
          disabled={isDisabled}
        />
        <button
          type="submit"
          className="ml-3 px-5 py-3 rounded-full bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && filteredPrompts.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {filteredPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onPromptClick(prompt)}
              className={`w-full text-left px-5 py-3 text-sm transition ${
                highlightIndex === index
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
