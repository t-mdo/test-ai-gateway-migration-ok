"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export default function Chat() {
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <h1 className="text-4xl font-semibold text-white/30">ChatGPT</h1>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "assistant" ? "bg-[#444654]" : ""}
          >
            <div className="mx-auto flex max-w-3xl gap-6 px-4 py-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#19c37d] text-sm font-bold">
                {m.role === "assistant" ? "AI" : "U"}
              </div>
              <div className="min-w-0 whitespace-pre-wrap leading-7">
                {m.parts.map((part, i) =>
                  part.type === "text" ? <span key={i}>{part.text}</span> : null
                )}
              </div>
            </div>
          </div>
        ))}
        {status === "submitted" && (
          <div className="bg-[#444654]">
            <div className="mx-auto flex max-w-3xl gap-6 px-4 py-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#19c37d] text-sm font-bold">
                AI
              </div>
              <div className="h-5 w-5 animate-pulse rounded-full bg-white/20" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-[#343541] p-4">
        <form onSubmit={submit} className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-white/20 bg-[#40414f] px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/40"
          />
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="rounded-lg bg-[#19c37d] px-4 py-3 font-medium text-white transition-colors hover:bg-[#1a9d63] disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
