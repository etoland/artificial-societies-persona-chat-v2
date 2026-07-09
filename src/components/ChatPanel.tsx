"use client";

import { useEffect, useRef, useState } from "react";
import { Persona, ChatMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { CitationMarker } from "./Citation";
import { InfoTooltip } from "./InfoTooltip";
import { suggestedQuestions, generateMockReply } from "@/lib/mockData";
import { X, Send, Info, MessageCircle, Copy, RefreshCw, Check, ThumbsUp, ThumbsDown } from "lucide-react";

function QuestionLine({ content }: { content: string }) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-[10.5px] uppercase tracking-wide font-medium text-[var(--muted-subtle)] mb-1">
        You asked
      </div>
      <div className="text-[14.5px] font-medium text-[var(--foreground)]">{content}</div>
    </div>
  );
}

function AnswerBlock({
  message,
  persona,
  onRegenerate,
}: {
  message: ChatMessage;
  persona: Persona;
  onRegenerate: (messageId: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const isGrounded = message.grounding?.type === "grounded";

  function copy() {
    navigator.clipboard?.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="animate-fade-in-up group">
      <div className="flex items-center gap-2 mb-1.5">
        <Avatar name={persona.name} color={persona.color} size={22} />
        <span className="text-[12px] font-medium text-[var(--muted)]">{persona.name}</span>
      </div>

      {isGrounded ? (
        // Confidence = size: a grounded answer is quoted straight from
        // real survey data, so it gets the large, editorial pull-quote
        // treatment. Inferred answers stay visually smaller/quieter.
        <blockquote className="pl-4 border-l-2 border-[var(--foreground)]">
          <p className="font-serif text-[19px] leading-[1.5] italic text-[var(--foreground)]">
            &ldquo;{message.content}&rdquo;
            {message.grounding && <CitationMarker grounding={message.grounding} />}
          </p>
        </blockquote>
      ) : (
        <p className="pl-4 text-[14px] leading-relaxed text-[var(--muted)]">
          {message.content}
          {message.grounding && <CitationMarker grounding={message.grounding} />}
        </p>
      )}

      <div className="pl-4 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11.5px] text-[var(--muted-subtle)] hover:text-[var(--foreground)] px-1.5 py-1 rounded-md hover:bg-[var(--surface)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
        {!isGrounded && (
          <button
            onClick={() => onRegenerate(message.id)}
            className="flex items-center gap-1 text-[11.5px] text-[var(--muted-subtle)] hover:text-[var(--foreground)] px-1.5 py-1 rounded-md hover:bg-[var(--surface)]"
            title="Regenerate — this line is interpreted, not a fixed fact, so it can vary"
          >
            <RefreshCw size={12} />
            Regenerate
          </button>
        )}
        <div className="ml-auto flex items-center gap-0.5">
          <button
            onClick={() => setRating(rating === "up" ? null : "up")}
            aria-label="Feels realistic"
            className={`p-1 rounded-md hover:bg-[var(--surface)] ${rating === "up" ? "text-emerald-600" : "text-[var(--muted-subtle)]"}`}
          >
            <ThumbsUp size={12} />
          </button>
          <button
            onClick={() => setRating(rating === "down" ? null : "down")}
            aria-label="Doesn't feel realistic"
            className={`p-1 rounded-md hover:bg-[var(--surface)] ${rating === "down" ? "text-red-500" : "text-[var(--muted-subtle)]"}`}
          >
            <ThumbsDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingLine({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-center gap-2 animate-fade-in-up">
      <Avatar name={persona.name} color={persona.color} size={22} />
      <div className="flex gap-1 items-center pl-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--muted-subtle)]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({
  persona,
  messages,
  onSend,
  onUpdateMessage,
  onClose,
}: {
  persona: Persona;
  messages: ChatMessage[];
  onSend: (userMsg: ChatMessage, replyMsg: ChatMessage) => void;
  onUpdateMessage: (messageId: string, patch: Partial<ChatMessage>) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    setInput("");
    setIsTyping(true);
    const { content, grounding } = generateMockReply(persona, trimmed);
    // Simulated latency stands in for a real LLM call.
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "persona",
        content,
        timestamp: Date.now(),
        promptText: trimmed,
        grounding,
      };
      setIsTyping(false);
      onSend(userMsg, replyMsg);
    }, 700 + Math.random() * 500);
  }

  function regenerate(messageId: string) {
    const target = messages.find((m) => m.id === messageId);
    if (!target || !target.promptText) return;
    const { content, grounding } = generateMockReply(
      persona,
      target.promptText,
      Math.floor(Math.random() * 10000)
    );
    onUpdateMessage(messageId, { content, grounding });
  }

  return (
    <div className="w-full h-full flex flex-col bg-[var(--surface-elevated)]">
      {/* Persistent persona context — always visible, not just on the pre-chat card */}
      <div className="border-b border-[var(--border)] px-5 py-4 flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Avatar name={persona.name} color={persona.color} size={40} />
          <div>
            <div className="font-semibold text-[14.5px] leading-tight">{persona.name}</div>
            <div className="text-[13px] text-[var(--muted)]">
              {persona.title} · {persona.company}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--muted-subtle)] hover:text-[var(--foreground)] p-1"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Their actual survey answer, kept pinned so trust context never disappears */}
      <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12.5px]">
          <span className="w-2 h-2 rounded-full" style={{ background: persona.color }} />
          <span className="text-[var(--muted)]">Survey answer:</span>
          <span className="font-medium">{persona.answer}</span>
        </div>
        <InfoTooltip label="How to read replies" align="right">
          <div className="font-medium text-[var(--foreground)] mb-1.5">How to read replies</div>
          <ul className="space-y-1.5">
            <li>
              <span className="font-serif italic text-[var(--foreground)]">Large quoted text</span>{" "}
              is pulled directly from their real survey comment — the bigger and more
              confident the styling, the more it&apos;s grounded in real data.
            </li>
            <li>
              <span className="text-[var(--muted)]">Smaller plain text</span> is the
              persona&apos;s simulated interpretation, not a fixed fact — that&apos;s why
              it can be regenerated.
            </li>
          </ul>
        </InfoTooltip>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-11 h-11 rounded-full bg-[var(--surface)] flex items-center justify-center mb-3">
              <MessageCircle size={20} className="text-[var(--muted)]" />
            </div>
            <p className="text-[14px] font-medium">Ask {persona.name.split(" ")[0]} about their answer</p>
            <p className="mt-1.5 text-[13px] text-[var(--muted)] max-w-[280px] leading-relaxed">
              Use this to dig into the &ldquo;why&rdquo; behind a response — like a quick
              interview transcript. Quoted answers are cited with{" "}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[9px] font-semibold align-middle">
                1
              </span>{" "}
              back to their real survey comment.
            </p>
            <div className="mt-4 flex flex-col gap-2 w-full max-w-[300px]">
              {suggestedQuestions(persona).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left text-[13px] px-3.5 py-2.5 rounded-[12px] border border-[var(--border)] hover:border-[var(--foreground)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) =>
              m.role === "user" ? (
                <QuestionLine key={m.id} content={m.content} />
              ) : (
                <AnswerBlock key={m.id} message={m} persona={persona} onRegenerate={regenerate} />
              )
            )}
            {isTyping && <TypingLine persona={persona} />}
          </>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-4 shrink-0">
        <div className="flex items-center gap-2 text-[11.5px] text-[var(--muted-subtle)] mb-2 px-1">
          <Info size={12} />
          Simulated persona — views are AI-generated, not the real person&apos;s.
          Saved automatically.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-full border border-[var(--border)] px-4 py-2.5 text-[14px] outline-none focus:border-[var(--foreground)] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
