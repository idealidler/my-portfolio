"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { chatPrompts } from "@/data/portfolio";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

const heroPhrases = [
  "Ask about Akshay",
  "Ask about my work at Holman",
  "Ask about my projects",
  "Ask about my impact",
  "Ask about my strengths",
  "Ask about role fit",
];

const BotMessageMarkdown = dynamic(
  () =>
    import("@/components/chat/bot-message-markdown").then((module) => module.BotMessageMarkdown),
  {
    loading: () => <div className="text-sm leading-6 text-slate-500">Formatting response...</div>,
  },
);

function toApiMessages(messages: Message[], latestQuestion: string) {
  const history = messages.map((message) => ({
    role: message.role === "bot" ? "assistant" : "user",
    content: message.content,
  }));

  return [...history, { role: "user", content: latestQuestion }] as Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export function AkshayGptShell() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isAnswering]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    input.style.height = "0px";
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
  }, [question]);

  useEffect(() => {
    if (hasMessages) {
      return;
    }

    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % heroPhrases.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [hasMessages]);

  async function askQuestion(prompt?: string) {
    const currentQuestion = (prompt ?? question).trim();
    if (!currentQuestion || isAnswering) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setError(null);
    setIsAnswering(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: toApiMessages(messages, currentQuestion),
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "The chat request failed.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming is unavailable in this environment.");
      }

      const decoder = new TextDecoder();
      const botId = `bot-${Date.now()}`;
      let buffer = "";

      setMessages((prev) => [...prev, { id: botId, role: "bot", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as { message?: { content?: string } };
            if (parsed.message?.content) {
              buffer += parsed.message.content;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === botId ? { ...message, content: buffer } : message,
                ),
              );
            }
          } catch {
            // Ignore malformed stream fragments and continue.
          }
        }
      }

      if (!buffer) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === botId
              ? {
                  ...message,
                  content: "I couldn't find a supported answer in the current portfolio data.",
                }
              : message,
          ),
        );
      }
    } catch (chatError) {
      const message =
        chatError instanceof Error ? chatError.message : "Something went wrong while answering.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-error-${Date.now()}`,
          role: "bot",
          content: `Sorry, I ran into an issue: ${message}`,
        },
      ]);
    } finally {
      setIsAnswering(false);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion();
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void askQuestion();
    }
  }

  function clearConversation() {
    setMessages([]);
    setError(null);
    setQuestion("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="px-4 pb-14 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="surface flex min-h-[78vh] flex-col rounded-[2rem] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>
            <button
              type="button"
              onClick={clearConversation}
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </button>
          </div>

          {!hasMessages ? (
            <div className="flex flex-1 flex-col items-center justify-center px-2 pb-6 pt-8 text-center sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                AkshayGPT
              </p>
              <h1 className="mt-4 min-h-[3.5rem] text-3xl font-semibold tracking-tight text-slate-950 transition sm:min-h-[4.5rem] sm:text-5xl">
                {heroPhrases[phraseIndex]}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Ask one question and keep the conversation going naturally from there.
              </p>
              <div className="mt-8 w-full max-w-3xl">
                <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-3 shadow-sm">
                  <form onSubmit={handleSubmit} className="flex items-end gap-3">
                    <textarea
                      ref={inputRef}
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      onKeyDown={handleComposerKeyDown}
                      rows={1}
                      placeholder="sk about my work at Holman, projects, strengths, impact..."
                      className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
                      disabled={isAnswering}
                    />
                    <button
                      type="submit"
                      disabled={isAnswering || !question.trim()}
                      className={cn(buttonVariants({ variant: "accent", size: "lg" }), "min-w-12 px-4")}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {chatPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void askQuestion(prompt)}
                      className="rounded-[1.25rem] border border-slate-200/80 bg-white/82 px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-white hover:text-slate-950"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={listRef}
              className="mt-6 flex-1 overflow-y-auto rounded-[1.75rem] border border-slate-200/70 bg-white/72 px-4 py-4 sm:px-5"
            >
              <div className="space-y-4 pb-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[92%] rounded-[1.5rem] px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[86%]",
                      message.role === "user"
                        ? "ml-auto border border-sky-100 bg-sky-50/90 text-slate-800"
                        : "border border-slate-200/70 bg-white text-slate-700",
                    )}
                  >
                    {message.role === "bot" ? (
                      message.content ? (
                        <BotMessageMarkdown content={message.content} />
                      ) : isAnswering ? (
                        "AkshayGPT is thinking..."
                      ) : (
                        ""
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                ))}

                {isAnswering && messages[messages.length - 1]?.role !== "bot" ? (
                  <div className="max-w-[92%] rounded-[1.5rem] border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-500 sm:max-w-[86%]">
                    AkshayGPT is thinking...
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {hasMessages ? (
            <div className="mt-6 rounded-[1.75rem] border border-slate-200/80 bg-white/88 p-3 shadow-sm">
              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  rows={1}
                  placeholder="Ask about my work at Holman, projects, strengths, impact..."
                  className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={isAnswering}
                />
                <button
                  type="submit"
                  disabled={isAnswering || !question.trim()}
                  className={cn(buttonVariants({ variant: "accent", size: "lg" }), "min-w-12 px-4")}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : null}

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
