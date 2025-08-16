import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";

export default function AkshayGPTChat({ switchToLanding, initialQuestion, switchVersion }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const chatContainerRef = useRef(null);
  const hasProcessedInitial = useRef(false);

  useEffect(() => {
    if (initialQuestion && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      handleAsk({ preventDefault: () => {} }, initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAnswering]);

  const handleAsk = async (e, overrideQuestion) => {
    e.preventDefault();
    const query = overrideQuestion || question;
    if (!query.trim()) return;

    const isDuplicate = messages.some(
      (msg) => msg.role === "user" && msg.content === query
    );
    if (isDuplicate) return;

    const newUserMessage = { role: "user", content: query, id: Date.now() };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setIsAnswering(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await response.json();
      const answer = data.error ? "Error: " + data.error : data.answer;

      const isAnswerDuplicate = messages.some(
        (msg) => msg.role === "bot" && msg.content === answer
      );
      if (!isAnswerDuplicate) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: answer, id: Date.now() + 1 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to the server.", id: Date.now() + 1 },
      ]);
    }
    setIsAnswering(false);
  };

  const clearChat = () => {
    setMessages([]);
    hasProcessedInitial.current = false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-indigo-100">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                switchToLanding();
                switchVersion(null);
              }}
              className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
              title="Back to Home"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
              Akshay<span className="text-blue-500">GPT</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full pt-20 pb-24 px-4 overflow-y-auto" ref={chatContainerRef} style={{ scrollBehavior: 'smooth' }}>
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
                msg.role === "user" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-800"
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

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-t p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={clearChat}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            title="Clear Chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <InputBar
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onSubmit={handleAsk}
            isDisabled={isAnswering}
          />
        </div>
      </div>

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