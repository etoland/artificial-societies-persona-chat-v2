"use client";

import { useMemo, useState } from "react";
import { PERSONAS } from "@/lib/mockData";
import { DotGraph } from "@/components/DotGraph";
import { PersonaCard } from "@/components/PersonaCard";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ConversationsRail } from "@/components/ConversationsRail";
import { CommentSearch } from "@/components/CommentSearch";
import { PanelChat } from "@/components/PanelChat";
import { InfoTooltip } from "@/components/InfoTooltip";
import { HeaderGlossary } from "@/components/HeaderGlossary";
import { WelcomeToast } from "@/components/WelcomeToast";
import { Logo } from "@/components/Logo";
import { useConversations } from "@/lib/useConversations";
import { ChatMessage, SeasonAnswer } from "@/lib/types";
import { personasForAnswer } from "@/lib/mockData";

const FILTERS = [
  "Technology",
  "Software Development",
  "Higher Education",
  "Financial Services",
  "Venture Capital",
  "IT Services and IT Consulting",
];

export default function Home() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [chatOpenFor, setChatOpenFor] = useState<string | null>(null);
  const [panelAnswer, setPanelAnswer] = useState<SeasonAnswer | null>(null);

  const { hydrated, activeConversations, getConversation, appendMessage, updateMessage } = useConversations();

  const personas = useMemo(() => {
    if (activeFilters.length === 0) return PERSONAS;
    return PERSONAS.filter((p) => activeFilters.includes(p.industry));
  }, [activeFilters]);

  const selectedPersona = PERSONAS.find((p) => p.id === selectedId) ?? null;
  const chatPersona = PERSONAS.find((p) => p.id === chatOpenFor) ?? null;

  function toggleFilter(f: string) {
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  function handleSend(personaId: string, userMsg: ChatMessage, replyMsg: ChatMessage) {
    appendMessage(personaId, userMsg);
    appendMessage(personaId, replyMsg);
  }

  return (
    <div className="h-screen flex flex-col">
      <WelcomeToast />
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Logo size={20} />
          <span className="font-semibold text-[15px]">Artificial Societies</span>
        </div>
        <HeaderGlossary />
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] shrink-0">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFilter(f)}
                  className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                    activeFilters.includes(f)
                      ? "border-[var(--foreground)] bg-[var(--foreground)] text-white"
                      : "border-[var(--border)] hover:border-[var(--foreground)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <CommentSearch personas={PERSONAS} onSelectPersona={setSelectedId} />
          </div>

          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="flex items-center justify-center gap-2 mb-4 text-[12.5px] text-[var(--muted)]">
              <span>Dot size reflects seniority · drag or scroll to rotate</span>
              <InfoTooltip label="What do the dots mean?" align="left">
                <div className="font-medium text-[var(--foreground)] mb-1.5">Reading the graph</div>
                <ul className="space-y-1.5">
                  <li>
                    <strong className="text-[var(--foreground)]">Color</strong> — which
                    answer they gave.
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">Size</strong> — their
                    seniority. Executives render largest, entry-level smallest.
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">Drag or scroll</strong> —
                    rotates the sphere. Every dot keeps its fixed position; rotating just
                    brings different ones to the front so you can click them.
                  </li>
                </ul>
              </InfoTooltip>
            </div>

            <DotGraph personas={personas} selectedId={selectedId} onSelect={setSelectedId} />

            {selectedPersona && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] md:absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2">
                <PersonaCard
                  persona={selectedPersona}
                  onClose={() => setSelectedId(null)}
                  onStartConversation={() => {
                    setChatOpenFor(selectedPersona.id);
                    setSelectedId(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <ResultsPanel onOpenPanel={setPanelAnswer} />
      </div>

      {chatPersona && hydrated && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setChatOpenFor(null)}
          />
          <div className="relative ml-auto h-full w-full max-w-[820px] bg-[var(--surface-elevated)] shadow-[-12px_0_40px_rgba(0,0,0,0.15)] flex animate-fade-in-up">
            <ConversationsRail
              conversations={activeConversations}
              personaLookup={(id) => PERSONAS.find((p) => p.id === id)}
              activeId={chatPersona.id}
              onSelect={(id) => setChatOpenFor(id)}
            />
            <ChatPanel
              persona={chatPersona}
              messages={getConversation(chatPersona.id)?.messages ?? []}
              onSend={(u, r) => handleSend(chatPersona.id, u, r)}
              onUpdateMessage={(messageId, patch) => updateMessage(chatPersona.id, messageId, patch)}
              onClose={() => setChatOpenFor(null)}
            />
          </div>
        </div>
      )}

      {panelAnswer && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/20" onClick={() => setPanelAnswer(null)} />
          <div className="relative ml-auto h-full w-full max-w-[820px] bg-[var(--surface-elevated)] shadow-[-12px_0_40px_rgba(0,0,0,0.15)] flex animate-fade-in-up">
            <PanelChat
              answer={panelAnswer}
              personas={personasForAnswer(panelAnswer)}
              onClose={() => setPanelAnswer(null)}
              onOpenPersona={(id) => {
                setPanelAnswer(null);
                setChatOpenFor(id);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
