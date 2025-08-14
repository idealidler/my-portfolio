import React, { useState, useEffect } from "react";
import { PaperAirplaneIcon, HomeIcon } from "@heroicons/react/24/solid";

export default function AkshayGPT({ switchVersion }) {
  const [question, setQuestion] = useState("");
  const [typedText, setTypedText] = useState("");
  const [knowledgeBaseText, setKnowledgeBaseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);

  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact — I deliver results.",
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

  // Load knowledge base from AkshayData.txt in public folder
  useEffect(() => {
    setLoading(true);
    fetch("/AkshayData.txt")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch knowledge base");
        return res.text();
      })
      .then((text) => {
        setKnowledgeBaseText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading knowledge base:", err);
        setLoading(false);
      });
  }, []);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (loading) {
      alert("Knowledge base is still loading, please wait...");
      return;
    }

    setIsAnswering(true);
    const response = await getAnswer(question, knowledgeBaseText);
    setAnswer(response);
    setQuestion("");
    setIsAnswering(false);
  };

  return (
    <section 
    className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      {/* Home Button */}
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

      <form
        onSubmit={handleAsk}
        className="w-full max-w-3xl flex items-center bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition"
      >
        <input
          type="text"
          placeholder={
            loading ? "Loading knowledge base..." : "Ask about Akshay here..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 px-6 py-4 text-gray-700 focus:outline-none text-lg"
          disabled={loading || isAnswering}
        />
        <button
          type="submit"
          disabled={loading || isAnswering}
          className={`p-4 text-white flex items-center justify-center transition ${
            loading || isAnswering
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <PaperAirplaneIcon className="h-6 w-6 transform rotate-45 hover:translate-x-1 transition" />
        </button>
      </form>

      {answer && (
        <div className="mt-8 max-w-3xl bg-white rounded-lg shadow p-6 text-gray-800 text-lg whitespace-pre-wrap">
          {answer}
        </div>
      )}

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