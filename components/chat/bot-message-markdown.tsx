"use client";

import { ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BotMessageMarkdownProps = {
  content: string;
};

export function BotMessageMarkdown({ content }: BotMessageMarkdownProps) {
  return (
    <div className="max-w-none text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1 className="mb-4 mt-6 text-2xl font-semibold tracking-tight text-slate-950" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-slate-950" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3 className="mb-3 mt-5 text-lg font-semibold text-slate-950" {...props} />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="my-3 text-sm leading-7 text-slate-700" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="my-3 list-disc space-y-2 pl-5 text-sm leading-7 marker:text-sky-600" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="my-3 list-decimal space-y-2 pl-5 text-sm leading-7 marker:font-medium marker:text-sky-600" {...props} />
          ),
          li: ({ node: _node, ...props }) => (
            <li className="pl-1 text-slate-700" {...props} />
          ),
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-slate-950" {...props} />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote className="my-4 border-l-2 border-sky-200 pl-4 text-sm italic leading-7 text-slate-600" {...props} />
          ),
          code: ({ node: _node, className, children, ...props }) => {
            const isBlock = typeof className === "string" && className.includes("language-");

            if (isBlock) {
              return (
                <code
                  className="block overflow-x-auto rounded-2xl bg-slate-950/95 px-4 py-3 text-sm text-slate-100"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em] text-slate-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node: _node, ...props }) => <pre className="my-4 overflow-x-auto" {...props} />,
          a: ({ node: _node, children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-md px-0.5 font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 transition hover:text-sky-800 hover:decoration-sky-400"
            >
              <span>{children}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
