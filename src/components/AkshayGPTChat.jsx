// src/components/AkshayGPTChat.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { ArrowLeftIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/solid";
import InputBar from "./InputBar";
import SuggestedPrompts from "./SuggestedPrompts"; // We'll now use this inside the chat

// Typing speed for the typewriter effect (in milliseconds)
const TYPING_SPEED_MS = 25;

/**
 * A completely redesigned, modern chat interface for AkshayGPT.
 * Features a contained layout, animated messages, and an interactive starting state.
 */
export default function AkshayGPTChat({ switchToLanding, initialQuestion, switchVersion }) {
  // State for the initial welcome message, allowing it to be preserved on clear.
  const initialMessage = {
    role: "bot",
    content: "Hello! I'm AkshayGPT. I have been trained on Akshay's professional background. Ask me anything about his skills, experience, or projects!",
    id: "initial-message",
  };

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [docContent, setDocContent] = useState(null);
  const chatContainerRef = useRef(null);
  const hasProcessedInitial = useRef(false);
  const typingIntervalRef = useRef(null);

  // --- Effect Hooks ---

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Load the context document on mount
    async function loadDocument() {
      try {
        const response = await fetch("data/AkshayData.txt");
        if (!response.ok) throw new Error("Failed to load AkshayData.txt");
        const text = await response.text();
        setDocContent(text);
      } catch (error) {
        console.error("Error loading document:", error);
      }
    }
    loadDocument();
  }, []);

  useEffect(() => {
    // Handle the initial question passed from the landing page
    if (initialQuestion && docContent && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true;
      handleAsk({ preventDefault: () => {} }, initialQuestion);
    }
  }, [initialQuestion, docContent]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Core Functions ---

  // Renders text with a character-by-character typewriter effect
  const streamTextToUI = (fullText, botMessageId) => {
    let charIndex = 0;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      if (charIndex < fullText.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: fullText.substring(0, charIndex + 1) + "▋" }
              : msg
          )
        );
        charIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, content: fullText } : msg
          )
        );
        setIsAnswering(false);
      }
    }, TYPING_SPEED_MS);
  };

  // Handles submitting a question to the backend API
  const handleAsk = async (e, overrideQuestion) => {
    if (e) e.preventDefault();
    const query = overrideQuestion || question;
    if (!query.trim() || isAnswering) return;

    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    const newUserMessage = { role: "user", content: query, id: Date.now() };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setIsAnswering(true);

    try {
      if (!docContent) throw new Error("Document context not loaded yet.");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docContent, messages: [{ role: "user", content: query }] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponseText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        try {
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              fullResponseText += data.message.content;
            }
          }
        } catch (e) { /* Ignore parsing errors */ }
      }
      
      const botId = Date.now() + 1;
      setMessages((prev) => [...prev, { role: "bot", content: "", id: botId }]);
      streamTextToUI(fullResponseText, botId);

    } catch (error) {
      console.error("Error fetching answer:", error);
      setMessages((prev) => [...prev, { role: "bot", content: `Sorry, an error occurred: ${error.message}`, id: Date.now() + 1 }]);
      setIsAnswering(false);
    }
  };

  // Clears the chat, preserving the initial welcome message
  const clearChat = () => {
    setMessages([initialMessage]);
    hasProcessedInitial.current = false;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-white p-4">
      {/* Main Chat Container */}
      <div className="w-full max-w-2xl h-full flex flex-col bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200/80">
        
        {/* --- Header --- */}
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-inner">
              <SparklesIcon className="w-6 h-6 text-white/90" />
            </div>
            <div>
              <h1 className="font-bold text-indigo-800">AkshayGPT</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <p className="text-xs text-slate-500">Online</p>
              </div>
            </div>
          </div>
          <button onClick={switchToLanding} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors" title="Back">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
        </header>

        {/* --- Chat Messages Area --- */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Welcome Message */}
          <ChatMessage message={messages[0]} />

          {/* Conditionally render Suggested Prompts or the rest of the conversation */}
          {messages.length === 1 && !isAnswering && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <SuggestedPrompts onPromptClick={(prompt) => handleAsk(null, prompt)} />
             </motion.div>
          )}

          {/* The rest of the messages */}
          {messages.slice(1).map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isAnswering && !typingIntervalRef.current && <TypingIndicator />}
        </main>
        
        {/* --- Input Footer --- */}
        <footer className="flex-shrink-0 p-4 border-t border-slate-200/80">
          <div className="flex items-center gap-2">
            <InputBar
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onSubmit={handleAsk}
              isDisabled={isAnswering}
              onPromptClick={(prompt) => handleAsk(null, prompt)}
              showSuggestions={true}
            />
            <button onClick={clearChat} className="p-3 text-slate-500 hover:text-red-500 transition-colors rounded-full" title="Clear Chat">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}


// --- Sub-Components for a Cleaner Structure ---

/**
 * A component to render a single animated chat message.
 */
const ChatMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
  >
    {message.role === "bot" && (
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
        <SparklesIcon className="w-5 h-5 text-white/90" />
      </div>
    )}
    <div
      className={`max-w-[85%] p-3 px-4 rounded-2xl shadow-sm ${
        message.role === "user"
          ? "bg-blue-500 text-white rounded-br-none"
          : "bg-slate-100 text-gray-800 border border-slate-200 rounded-bl-none"
      }`}
    >
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
    </div>
  </motion.div>
);

/**
 * A sleek "typing" indicator component.
 */
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-end gap-2"
  >
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
        <SparklesIcon className="w-5 h-5 text-white/90" />
    </div>
    <div className="p-3 px-4 rounded-2xl bg-slate-100 border border-slate-200 rounded-bl-none">
      <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  </motion.div>
);