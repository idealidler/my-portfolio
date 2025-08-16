import React, { useState, useEffect } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";

export default function AkshayGPTLanding({ switchToChat, setInitialQuestion, switchVersion }) {
  const [question, setQuestion] = useState("");
  const [typedText, setTypedText] = useState("");

  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact — I deliver results.",
  ];

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
          setTimeout(typeEffect, 1600);
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
    setInitialQuestion(question);
    switchToChat();
    setQuestion("");
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            switchVersion(null);
          }}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all transform flex items-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Home
        </button>
      </div>

      <h1 className="text-6xl font-extrabold text-indigo-700 mb-2 tracking-tight">
        Akshay<span className="text-blue-500">GPT</span>
      </h1>

      <p className="text-lg text-gray-500 h-6 mb-6">
        {typedText}
        <span className="animate-pulse">|</span>
      </p>

      <p className="text-lg text-gray-600 mb-8 animate-slideIn">
        💼 Looking for your next data & AI expert?{" "}
        <span className="font-semibold text-indigo-600">Hire Me!</span>
      </p>

      <InputBar
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onSubmit={handleAsk}
        isDisabled={false}
      />

      <p className="mt-10 text-sm text-gray-500">
        Powered by AI & backed by{" "}
        <span className="text-indigo-500">real experience</span>.
      </p>

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