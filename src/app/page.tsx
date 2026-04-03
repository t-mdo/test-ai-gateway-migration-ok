"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

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
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-white/20 bg-[#40414f] px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/40"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-[#19c37d] px-4 py-3 font-medium text-white transition-colors hover:bg-[#1a9d63] disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
