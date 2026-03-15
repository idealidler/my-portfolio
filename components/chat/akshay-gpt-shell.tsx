"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatPrompts } from "@/data/portfolio";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

function BotMessageMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 prose-p:my-2 prose-p:leading-6 prose-strong:text-slate-950 prose-a:text-sky-700 prose-a:no-underline hover:prose-a:text-sky-800 hover:prose-a:underline prose-ul:my-2 prose-ul:pl-5 prose-ol:my-2 prose-ol:pl-5 prose-li:my-1 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-slate-800 prose-code:before:content-[''] prose-code:after:content-['']">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const initialMessage: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hello! I'm AkshayGPT. I answer from Akshay's structured portfolio data, so feel free to ask about roles, projects, strengths, or how he works.",
};

function toApiMessages(messages: Message[], latestQuestion: string) {
  const history = messages
    .filter((message) => message.id !== "welcome")
    .map((message) => ({
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
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isAnswering]);

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

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
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
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion();
  }

  function clearConversation() {
    setMessages([initialMessage]);
    setError(null);
  }

  return (
    <div className="px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="surface rounded-[2rem] p-6 sm:p-8">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back home
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
              AkshayGPT
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              A portfolio assistant powered by structured portfolio data and `gpt-4o-mini`.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The chat now grounds itself in the same project, role, and skills data used by the rest of the site, so the answers stay consistent with the portfolio itself.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5">
              <p className="text-sm font-semibold text-slate-950">What this workspace is good at</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Summarizing role fit, technical strengths, and measurable impact</li>
                <li>Explaining featured GitHub projects in recruiter-friendly language</li>
                <li>Answering within portfolio facts instead of improvising unsupported claims</li>
              </ul>
            </div>
          </aside>

          <section className="surface overflow-hidden rounded-[2rem]">
            <header className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold text-slate-950">Conversation workspace</p>
                <p className="text-sm text-slate-500">
                  Ask targeted questions or start with a suggested prompt.
                </p>
              </div>
              <button
                type="button"
                onClick={clearConversation}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </button>
            </header>

            <div ref={listRef} className="h-[32rem] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "max-w-[88%] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm",
                      message.role === "user"
                        ? "ml-auto bg-slate-950 text-white"
                        : "border border-slate-200/70 bg-white/85 text-slate-700",
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
                  <div className="max-w-[88%] rounded-[1.5rem] border border-slate-200/70 bg-white/85 px-4 py-3 text-sm text-slate-500">
                    AkshayGPT is thinking...
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t border-slate-200/70 px-5 py-4 sm:px-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {chatPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void askQuestion(prompt)}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-slate-950"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask about roles, projects, impact, or how Akshay works..."
                  className="min-h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  disabled={isAnswering}
                />
                <button
                  type="submit"
                  disabled={isAnswering}
                  className={cn(buttonVariants({ variant: "accent", size: "lg" }), "min-w-12 px-4")}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
