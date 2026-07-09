"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";

/**
 * Inline citation marker, Perplexity/Gemini-style — a small superscript
 * "[1]" sitting right in the reply text rather than a separate tag below
 * it. Clicking expands the exact source line it was pulled from.
 */
export function CitationMarker({ grounding }: { grounding: NonNullable<ChatMessage["grounding"]> }) {
  const [open, setOpen] = useState(false);

  if (grounding.type !== "grounded") {
    return (
      <span className="ml-1.5 align-middle text-[10.5px] font-medium uppercase tracking-wide text-[var(--muted-subtle)]">
        interpreted
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`ml-1 inline-flex items-center justify-center align-super text-[10px] font-semibold w-4 h-4 rounded-full border transition-colors ${
          open
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
        }`}
        aria-label="View source"
      >
        1
      </button>
      {open && grounding.sourceQuote && (
        <span className="mt-2 block text-[12.5px] text-[var(--muted)] border-l-2 border-emerald-300 pl-3 leading-relaxed not-italic font-sans">
          <span className="font-medium text-emerald-700">Source — original survey comment: </span>
          &ldquo;{grounding.sourceQuote}&rdquo;
        </span>
      )}
    </>
  );
}
