// src/components/AkshayGPTLanding.jsx

import React, { useState, useEffect } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";
import SuggestedPrompts from "./SuggestedPrompts"; // Import the suggestions component

/**
 * The main landing page for the AkshayGPT feature.
 * Features a dynamic typing effect, a clear call-to-action, and suggested prompts to guide the user.
 */
export default function AkshayGPTLanding({ switchToChat, setInitialQuestion, switchVersion }) {
  // State for the controlled input field
  const [question, setQuestion] = useState("");
  // State for the typing animation text
  const [typedText, setTypedText] = useState("");
  // State for the blinking cursor visibility
  const [cursorVisible, setCursorVisible] = useState(true);

  // Phrases for the typing animation
  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact.",
  ];

  // Typing animation effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!isDeleting) {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          timeoutId = setTimeout(typeEffect, 2000);
          return;
        }
      } else {
        setTypedText(currentPhrase.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      timeoutId = setTimeout(typeEffect, isDeleting ? 60 : 90);
    };
    typeEffect();

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Submits the question and switches to the chat view
  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setInitialQuestion(question);
    switchToChat();
    setQuestion("");
  };

  // Handles clicking a suggested prompt, immediately switching to the chat view
  const handlePromptClick = (prompt) => {
    setInitialQuestion(prompt);
    switchToChat();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-white text-center">
      {/* Home button positioned for easy access */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => switchVersion(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm text-indigo-600 font-semibold border border-slate-200/80 shadow-sm hover:bg-white transition-colors"
        >
          <HomeIcon className="h-5 w-5" />
          Home
        </button>
      </div>

      <div className="w-full max-w-3xl">
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm">
          Akshay<span className="text-blue-500">GPT</span>
        </h1>

        {/* Typing effect container */}
        <p className="text-lg md:text-xl text-gray-600 h-8 mt-4 mb-8 font-light">
          {typedText}
          {cursorVisible && <span className="text-indigo-600">|</span>}
        </p>

        {/* Input Bar */}
        <div className="w-full max-w-2xl mx-auto">
          <InputBar
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onSubmit={handleAsk}
            isDisabled={false}
            onPromptClick={handlePromptClick}
            showSuggestions={false} // We hide the dropdown on the landing page
          />
        </div>

        {/* Suggested Prompts Section */}
        <SuggestedPrompts onPromptClick={handlePromptClick} />
      </div>

      {/* Footer note */}
      <div className="absolute bottom-4 w-full px-4 text-xs text-gray-500 italic leading-relaxed">
        <p className="text-center">
        I had no prior experience building AI Chatbot, but I figured it out.
        My strongest skill is <span className="font-medium text-indigo-600">the ability to learn</span>.<br />
        I’m a problem solver who knows how to navigate the unknown.
      </p>
      </div>
    </div>
  );
}