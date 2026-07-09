"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Persona } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Search, X } from "lucide-react";

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--accent-primary)]/20 text-[var(--foreground)] rounded-[2px]">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function CommentSearch({
  personas,
  onSelectPersona,
}: {
  personas: Persona[];
  onSelectPersona: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return personas
      .filter(
        (p) =>
          p.comment.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [personas, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[320px]">
      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 focus-within:border-[var(--foreground)] transition-colors">
        <Search size={14} className="text-[var(--muted-subtle)] shrink-0" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search what people said..."
          className="flex-1 text-[13px] outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-[var(--muted-subtle)] hover:text-[var(--foreground)] shrink-0"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_12px_32px_rgba(0,0,0,0.12)] max-h-[360px] overflow-y-auto z-50">
          {results.length === 0 ? (
            <div className="px-4 py-4 text-[13px] text-[var(--muted-subtle)]">
              No comments match &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPersona(p.id);
                  setOpen(false);
                }}
                className="w-full flex items-start gap-2.5 px-4 py-3 text-left border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors"
              >
                <Avatar name={p.name} color={p.color} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[12.5px]">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-[var(--muted-subtle)]">· {p.answer}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-[var(--muted)] leading-snug line-clamp-2">
                    &ldquo;{highlight(p.comment, query)}&rdquo;
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
