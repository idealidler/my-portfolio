import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, HomeIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function AkshayGPT({ switchVersion }) {
  const [question, setQuestion] = useState("");
  const [typedText, setTypedText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const chatContainerRef = useRef(null);

  const phrases = [
    "I turn complex data into clear business wins.",
    "Helping companies make smarter, faster decisions.",
    "From raw numbers to real impact — I deliver results.",
  ];

  // Typewriter effect for header
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

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAnswering]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message to chat
    const newUserMessage = { role: "user", content: question, id: Date.now() };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setIsAnswering(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      const answer = data.error ? "Error: " + data.error : data.answer;
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: answer, id: Date.now() + 1 },
      ]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I am currenlty working on deploying the backend, so hold tight :) ", id: Date.now() + 1 },
      ]);
    }
    setIsAnswering(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                switchVersion(null);
              }}
              className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              <HomeIcon className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
              Akshay<span className="text-blue-500">GPT</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full pt-20 pb-24 px-4 overflow-y-auto" ref={chatContainerRef}>
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 animate-slideIn">
            💼 Looking for your next data & AI expert?{" "}
            <span className="font-semibold text-indigo-600">Hire Me!</span>
          </p>
        </div>

        {messages.length === 0 && !isAnswering && (
          <div className="text-center text-gray-500 mt-10">
            Start the conversation by asking a question below!
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4 animate-slideIn`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.role === "bot" && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mr-2">
                    A
                  </div>
                  <span className="text-xs text-gray-500">AkshayGPT</span>
                </div>
              )}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}

        {isAnswering && (
          <div className="flex justify-start mb-4 animate-slideIn">
            <div className="max-w-[70%] p-4 rounded-lg bg-gray-100 text-gray-800">
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mr-2">
                  A
                </div>
                <span className="text-xs text-gray-500">AkshayGPT</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-t p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={clearChat}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            title="Clear Chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <form
            onSubmit={handleAsk}
            className="flex-1 flex items-center bg-white rounded-full shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 transition"
          >
            <input
              type="text"
              placeholder="Ask about Akshay here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-6 py-3 text-gray-700 focus:outline-none text-base"
              disabled={isAnswering}
            />
            <button
              type="submit"
              disabled={isAnswering}
              className={`p-3 text-white flex items-center justify-center transition ${
                isAnswering ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <PaperAirplaneIcon className="h-5 w-5 transform rotate-45 hover:translate-x-1 transition" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-gray-500">
        Powered by AI & backed by{" "}
        <span className="text-indigo-500">real experience</span>.
      </div>

      <style>{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .shadow-t {
          box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}