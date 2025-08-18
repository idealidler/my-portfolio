import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";

export default function AkshayGPTChat({ switchToLanding, initialQuestion, switchVersion }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [docContent, setDocContent] = useState(null);
  const [currentStreamingId, setCurrentStreamingId] = useState(null);
  const chatContainerRef = useRef(null);
  const hasProcessedInitial = useRef(false);

  // Load Akshay.txt on component mount
  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await fetch("data/AkshayData.txt");
        if (!response.ok) throw new Error("Failed to load AkshayData.txt");
        const text = await response.text();
        setDocContent(text);
      } catch (error) {
        console.error("Error loading document:", error);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Error: Could not load Akshay.txt. Ensure it's in the public folder.", id: Date.now() + 1 },
        ]);
      }
    }
    loadDocument();
  }, []);

  // Handle initial question
  useEffect(() => {
    if (initialQuestion && docContent && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      handleAsk({ preventDefault: () => {} }, initialQuestion);
    }
  }, [initialQuestion, docContent]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAnswering]);

  const handleAsk = async (e, overrideQuestion) => {
    e.preventDefault();
    const query = overrideQuestion || question;
    if (!query.trim()) return;

    // Check for duplicate user question
    const isDuplicate = messages.some((msg) => msg.role === "user" && msg.content === query);
    if (isDuplicate) return;

    const newUserMessage = { role: "user", content: query, id: Date.now() };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setIsAnswering(true);

    try {
      if (!docContent) {
        throw new Error("Document not loaded");
      }

    // ... inside handleAsk function
    const response = await fetch("/api/chat", { // <-- CHANGED URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // We only need to send the messages and the document now
        docContent: docContent,
        messages: [
            // You could also send the whole message history if you want context
            { role: "user", content: query }
        ]
      }),
    });
    // ...

      if (!response.ok) {
        const errorData = await response.json();
        // This makes the error much more useful for debugging!
        throw new Error(errorData.error || "API request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      const botId = Date.now() + 1;
      setMessages((prev) => [...prev, { role: "bot", content: "", id: botId }]);
      setCurrentStreamingId(botId);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.trim() === "") continue;
          try {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              accumulatedContent += data.message.content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = accumulatedContent;
                return newMessages;
              });
            }
            if (data.done) {
              break;
            }
          } catch (parseError) {
            console.error("Error parsing stream line:", parseError);
          }
        }
      }

      // Check for duplicate bot response
      const isAnswerDuplicate = messages.some((msg) => msg.role === "bot" && msg.content === accumulatedContent && msg.id !== botId);
      if (isAnswerDuplicate) {
        setMessages((prev) => prev.filter((msg) => msg.id !== botId));
      }
 } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [
        ...prev,
        // A more generic and accurate error message for the user.
        { role: "bot", content: `Error: Could not get a response. ${error.message}`, id: Date.now() + 1 },
      ]);
    } finally {
// ...
      setIsAnswering(false);
      setCurrentStreamingId(null);
    }
  };

  const clearChat = () => {
    setMessages([]);
    hasProcessedInitial.current = false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50 font-sans antialiased">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/70 backdrop-blur-md shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                switchToLanding();
                switchVersion(null);
              }}
              className="p-2 rounded-full bg-blue-500/80 text-white hover:bg-blue-600 transition-colors"
              title="Back to Home"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-blue-700 tracking-tight">
              Akshay<span className="text-blue-500">GPT</span>
            </h1>
          </div>
        </div>
      </div>

      <div
        className="flex-1 max-w-4xl mx-auto w-full pt-20 pb-24 px-4 overflow-y-auto"
        ref={chatContainerRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 && !isAnswering && (
          <div className="text-center text-gray-500 mt-10">
            Start the conversation by asking a question below!
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4 animate-fadeIn`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-100 text-gray-900"
              }`}
            >
              {msg.role === "bot" && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mr-2">
                    A
                  </div>
                  <span className="text-xs text-gray-500">AkshayGPT</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">
                {msg.content}
                {isAnswering && msg.id === currentStreamingId && (
                  <span className="inline-block ml-1 animate-pulse text-gray-500">▋</span>
                )}
              </p>
            </div>
          </div>
        ))}

        {isAnswering && !currentStreamingId && (
          <div className="flex justify-start mb-4 animate-fadeIn">
            <div className="max-w-[70%] p-3 rounded-2xl bg-white border border-gray-100 text-gray-900 shadow-sm">
              <div className="flex items-center mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold mr-2">
                  A
                </div>
                <span className="text-xs text-gray-500">AkshayGPT</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-t p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <button
            onClick={clearChat}
            className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
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
        <span className="text-blue-500">real experience</span>.
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .shadow-t {
          box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}