"use client";

import { useState } from "react";
import { Persona, SeasonAnswer, ChatMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { CitationMarker } from "./Citation";
import { InfoTooltip } from "./InfoTooltip";
import { generateMockReply, themeForAnswer, ANSWER_COLORS } from "@/lib/mockData";
import { X, Send, Users, Sparkles } from "lucide-react";

interface PanelAnswer {
  persona: Persona;
  content: string;
  grounding: ChatMessage["grounding"];
}

export function PanelChat({
  answer,
  personas,
  onClose,
  onOpenPersona,
}: {
  answer: SeasonAnswer;
  personas: Persona[];
  onClose: () => void;
  onOpenPersona: (personaId: string) => void;
}) {
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
  const [responses, setResponses] = useState<PanelAnswer[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const color = ANSWER_COLORS[answer];
  const theme = themeForAnswer(answer);

  function ask() {
    const trimmed = question.trim();
    if (!trimmed) return;
    const all: PanelAnswer[] = personas.map((persona) => {
      const { content, grounding } = generateMockReply(persona, trimmed);
      return { persona, content, grounding };
    });
    setAskedQuestion(trimmed);
    setResponses(all);
    setRevealedCount(0);
    setQuestion("");
    // Stagger reveal so a 20-person panel doesn't just dump onto the
    // screen at once — reads more like responses arriving in real time.
    all.forEach((_, i) => {
      setTimeout(() => setRevealedCount((c) => Math.max(c, i + 1)), i * 220);
    });
  }

  const groundedCount = responses.filter((r) => r.grounding?.type === "grounded").length;
  const allRevealed = revealedCount >= responses.length && responses.length > 0;

  return (
    <div className="w-full h-full flex flex-col bg-[var(--surface-elevated)]">
      <div className="border-b border-[var(--border)] px-5 py-4 flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${color}1f`, color }}
          >
            <Users size={18} />
          </div>
          <div>
            <div className="font-semibold text-[14.5px] leading-tight">
              Everyone who chose {answer}
            </div>
            <div className="text-[13px] text-[var(--muted)]">
              {personas.length} respondents · ask one question, see every answer
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--muted-subtle)] hover:text-[var(--foreground)] p-1"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-5 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 flex items-center justify-end">
        <InfoTooltip label="How to read replies" align="right">
          <div className="font-medium text-[var(--foreground)] mb-1.5">How to read replies</div>
          <ul className="space-y-1.5">
            <li>
              <span className="font-serif italic text-[var(--foreground)]">Large quoted text</span>{" "}
              is pulled directly from their real survey comment.
            </li>
            <li>
              <span className="text-[var(--muted)]">Smaller plain text</span> is a
              simulated interpretation, not a fixed fact.
            </li>
          </ul>
        </InfoTooltip>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!askedQuestion ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-11 h-11 rounded-full bg-[var(--surface)] flex items-center justify-center mb-3">
              <Users size={20} className="text-[var(--muted)]" />
            </div>
            <p className="text-[14px] font-medium">
              Ask the whole {answer} panel a question
            </p>
            <p className="mt-1.5 text-[13px] text-[var(--muted)] max-w-[320px] leading-relaxed">
              Instead of opening {personas.length} separate chats, send one question
              to everyone who gave this answer and see how their reasoning compares
              side by side.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-[640px]">
            <div>
              <div className="text-[10.5px] uppercase tracking-wide font-medium text-[var(--muted-subtle)] mb-1">
                You asked the panel
              </div>
              <div className="text-[14.5px] font-medium">{askedQuestion}</div>
            </div>

            {allRevealed && (
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-4 animate-fade-in-up">
                <div className="flex items-center gap-1.5 text-[12.5px] font-semibold">
                  <Sparkles size={13} />
                  Synthesized takeaway
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">
                  {theme.title} — {theme.blurb} Across this panel, {groundedCount} of{" "}
                  {responses.length} answers quote their original survey comment directly;
                  the rest extrapolate from their profile.
                </p>
              </div>
            )}

            <div className="space-y-5">
              {responses.slice(0, revealedCount).map(({ persona, content, grounding }) => (
                <div key={persona.id} className="animate-fade-in-up">
                  <button
                    onClick={() => onOpenPersona(persona.id)}
                    className="flex items-center gap-2 mb-1.5 hover:opacity-70 transition-opacity"
                  >
                    <Avatar name={persona.name} color={persona.color} size={22} />
                    <span className="text-[12px] font-medium text-[var(--foreground)]">
                      {persona.name}
                    </span>
                    <span className="text-[11.5px] text-[var(--muted-subtle)]">
                      {persona.title}
                    </span>
                  </button>
                  {grounding?.type === "grounded" ? (
                    <blockquote className="pl-4 border-l-2 border-[var(--foreground)]">
                      <p className="font-serif text-[16.5px] leading-[1.5] italic text-[var(--foreground)]">
                        &ldquo;{content}&rdquo;
                        <CitationMarker grounding={grounding} />
                      </p>
                    </blockquote>
                  ) : (
                    <p className="pl-4 text-[13.5px] leading-relaxed text-[var(--muted)]">
                      {content}
                      {grounding && <CitationMarker grounding={grounding} />}
                    </p>
                  )}
                </div>
              ))}
              {revealedCount < responses.length && (
                <div className="flex items-center gap-2 pl-1 text-[12px] text-[var(--muted-subtle)]">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--muted-subtle)]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  {revealedCount}/{responses.length} responded
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-4 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask all ${personas.length} respondents...`}
            className="flex-1 rounded-full border border-[var(--border)] px-4 py-2.5 text-[14px] outline-none focus:border-[var(--foreground)] transition-colors"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className="w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
            aria-label="Ask panel"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
