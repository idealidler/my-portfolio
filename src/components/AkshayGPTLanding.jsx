// src/components/AkshayGPTLanding.js
import React, { useState, useEffect } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";

export default function AkshayGPTLanding({ switchToChat, setInitialQuestion, switchVersion }) {
  const [question, setQuestion] = useState("");
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact I deliver results.",
  ];

  // Typing effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!isDeleting) {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeEffect, 2000);
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
      setTimeout(typeEffect, isDeleting ? 60 : 90);
    };
    typeEffect();
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setInitialQuestion(question);
    switchToChat();
    setQuestion("");
  };

  // Handler for clicking a suggested prompt
  const handlePromptClick = (prompt) => {
    setInitialQuestion(prompt);
    switchToChat();
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-indigo-300 via-pink-200 to-white">
      {/* Home button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            switchVersion(null);
          }}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Home
        </button>
      </div>

      {/* Centered main content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-700 mb-4 tracking-tight drop-shadow-sm">
          Akshay<span className="text-blue-500">GPT</span>
        </h1>

        {/* Typing effect */}
        <p className="text-lg md:text-xl text-gray-600 h-8 mb-6 font-light">
          {typedText}
          {cursorVisible && <span className="text-indigo-600">|</span>}
        </p>

        {/* Subheading */}
        <p className="text-lg text-gray-700 mb-8 animate-fadeIn">
          💼 Looking for your next data & AI expert?{" "}
          <span className="font-semibold text-indigo-600 inline-block animate-pulse-subtle">
            Hire Me!
          </span>
        </p>

        {/* Input / search bar */}
        <div className="w-full max-w-2xl animate-fadeInUp">
          <InputBar
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onSubmit={handleAsk}
            isDisabled={false}
            onPromptClick={handlePromptClick}
          />
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 mb-8 max-w-lg mx-auto text-xs sm:text-sm text-gray-500 italic leading-relaxed px-4 text-center">
        I had no prior experience building AI chatbots, but I figured it out.  
        My strongest skill is <span className="font-medium text-indigo-600">the ability to learn</span>.  
        I’m a problem solver who knows how to navigate the unknown.
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 1s ease-out 0.4s forwards;
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
