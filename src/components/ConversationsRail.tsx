"use client";

import { Persona, Conversation } from "@/lib/types";
import { Avatar } from "./Avatar";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ConversationsRail({
  conversations,
  personaLookup,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  personaLookup: (id: string) => Persona | undefined;
  activeId: string | null;
  onSelect: (personaId: string) => void;
}) {
  return (
    <div className="w-[260px] shrink-0 border-r border-[var(--border)] h-full flex flex-col">
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <h3 className="text-[14px] font-semibold">Conversations</h3>
        <p className="text-[12px] text-[var(--muted)] mt-0.5">
          Saved on this device
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="px-4 py-6 text-[12.5px] text-[var(--muted-subtle)] leading-relaxed">
            No conversations yet. Start one from a persona on the graph — it&apos;ll
            show up here and stay saved.
          </div>
        ) : (
          conversations.map((c) => {
            const persona = personaLookup(c.personaId);
            if (!persona) return null;
            const last = c.messages[c.messages.length - 1];
            const isActive = c.personaId === activeId;
            return (
              <button
                key={c.personaId}
                onClick={() => onSelect(c.personaId)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-[var(--border)] transition-colors ${
                  isActive ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]"
                }`}
              >
                <Avatar name={persona.name} color={persona.color} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium truncate">{persona.name}</span>
                    <span className="text-[11px] text-[var(--muted-subtle)] shrink-0">
                      {timeAgo(c.lastActive)}
                    </span>
                  </div>
                  <div className="text-[12px] text-[var(--muted)] truncate">
                    {last?.role === "user" ? "You: " : ""}
                    {last?.content}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
