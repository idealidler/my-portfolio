import React, { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function AkshayGPT() {
  const [question, setQuestion] = useState("");
  const [typedText, setTypedText] = useState("");

  // Recruiter-focused phrases
  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact — I deliver results."
  ];

  // Typewriter effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!deleting) {
        setTypedText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === currentPhrase.length) {
          deleting = true;
          setTimeout(typeEffect, 1600); // pause before deleting
          return;
        }
      } else {
        setTypedText(currentPhrase.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeEffect, deleting ? 50 : 80);
    };

    typeEffect();
  }, []);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    console.log("User asked:", question);
    setQuestion("");
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      {/* Title */}
      <h1 className="text-6xl font-extrabold text-indigo-700 mb-2 tracking-tight">
        Akshay<span className="text-blue-500">GPT</span>
      </h1>

      {/* Typing Animation */}
      <p className="text-lg text-gray-500 h-6 mb-6">
        {typedText}
        <span className="animate-pulse">|</span>
      </p>

      {/* Hire Me (Fade-in from left) */}
      <p className="text-lg text-gray-600 mb-8 animate-slideIn">
        💼 Looking for your next data & AI expert?{" "}
        <span className="font-semibold text-indigo-600">Hire Me!</span>
      </p>

      {/* Input Box */}
      <form
        onSubmit={handleAsk}
        className="w-full max-w-3xl flex items-center bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition"
      >
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 px-6 py-4 text-gray-700 focus:outline-none text-lg"
        />
        <button
          type="submit"
          className="p-4 bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center justify-center"
        >
          <PaperAirplaneIcon className="h-6 w-6 transform rotate-45 hover:translate-x-1 transition" />
        </button>
      </form>

      {/* Footer / Tagline */}
      <p className="mt-10 text-sm text-gray-500">
        Powered by AI & backed by <span className="text-indigo-500">real experience</span>.
      </p>

      {/* Custom Animation Style */}
      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
