"use client";

import { Persona } from "@/lib/types";
import { Avatar } from "./Avatar";
import { MapPin, User, BarChart3, Building2, MessageCircle } from "lucide-react";

function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[13px] text-[var(--foreground)]">
      {icon}
      {label}
    </span>
  );
}

export function PersonaCard({
  persona,
  onStartConversation,
  onClose,
}: {
  persona: Persona;
  onStartConversation: () => void;
  onClose: () => void;
}) {
  return (
    <div className="w-[380px] max-w-[90vw] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={persona.name} color={persona.color} size={44} />
          <div>
            <div className="font-semibold text-[15px] leading-tight">{persona.name}</div>
            <div className="text-[13px] text-[var(--muted)]">{persona.title}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--muted-subtle)] hover:text-[var(--foreground)] text-sm px-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 text-[13px] text-[var(--muted)]">{persona.company}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill icon={<MapPin size={13} />} label={persona.location} />
        <Pill icon={<User size={13} />} label={persona.gender} />
        <Pill icon={<User size={13} />} label={persona.generation} />
        <Pill icon={<BarChart3 size={13} />} label={persona.seniority} />
        <Pill icon={<Building2 size={13} />} label={persona.industry} />
      </div>

      <div className="mt-5">
        <div className="text-[12px] uppercase tracking-wide text-[var(--muted-subtle)] font-medium">
          Response
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: persona.color }}
          />
          <span className="text-[14px] font-medium">{persona.answer}</span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[12px] uppercase tracking-wide text-[var(--muted-subtle)] font-medium">
          Comment
        </div>
        <p className="mt-1 text-[14px] leading-relaxed text-[var(--foreground)] italic">
          &ldquo;{persona.comment}&rdquo;
        </p>
      </div>

      <button
        onClick={onStartConversation}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-primary)] text-white text-[14px] font-medium py-2.5 hover:opacity-90 transition-opacity"
      >
        <MessageCircle size={16} />
        Start conversation
      </button>
    </div>
  );
}
