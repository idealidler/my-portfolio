// src/components/InputBar.jsx

import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

/**
 * A reusable, enhanced input bar component.
 * Features include suggested prompts that can be toggled on or off,
 * keyboard navigation for suggestions, and a modern design.
 * @param {boolean} showSuggestions - Prop to control the visibility of the suggestions dropdown.
 */
export default function InputBar({ value, onChange, onSubmit, isDisabled, onPromptClick, showSuggestions = true }) {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const prompts = [
    "What are Akshay's key technical skills?",
    "Summarize his work experience at Holman.",
    "What was the result of his Starbucks project?",
    "How does Akshay approach problem-solving?",
  ];

  // Filter suggestions based on the current input value
  const filteredPrompts = prompts.filter((p) =>
    p.toLowerCase().includes(value.toLowerCase())
  );

  // Handle keyboard events for navigating suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions || !isFocused || filteredPrompts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredPrompts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (prev) => (prev - 1 + filteredPrompts.length) % filteredPrompts.length
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      onPromptClick(filteredPrompts[highlightIndex]);
      setIsFocused(false);
      setHighlightIndex(-1);
    }
  };

  const handlePromptSelection = (prompt) => {
    onPromptClick(prompt);
    setIsFocused(false);
    setHighlightIndex(-1);
  };

  return (
    <div className="relative w-full">
      {/* Suggestions Dropdown (conditionally rendered) */}
      {showSuggestions && isFocused && filteredPrompts.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          {filteredPrompts.map((prompt, index) => (
            <button
              key={index}
              onMouseDown={() => handlePromptSelection(prompt)} // Use onMouseDown to fire before onBlur
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                highlightIndex === index
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="flex items-center w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay allows click events to register
          onKeyDown={handleKeyDown}
          placeholder="Ask about skills, projects, experience..."
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-800 disabled:bg-gray-100"
          disabled={isDisabled}
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="ml-2 flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}