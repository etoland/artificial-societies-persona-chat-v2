"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";

interface GlossaryItem {
  title: string;
  body: React.ReactNode;
}

const ITEMS: GlossaryItem[] = [
  {
    title: "Reading the persona graph",
    body: (
      <>
        <strong className="text-[var(--foreground)]">Color</strong> shows which answer
        they gave. <strong className="text-[var(--foreground)]">Size</strong> reflects
        seniority — executives render largest, entry-level smallest.{" "}
        <strong className="text-[var(--foreground)]">Drag or scroll</strong> to rotate;
        every dot keeps its fixed position, rotating just brings different ones to the
        front so you can click them.
      </>
    ),
  },
  {
    title: "Group / panel chat",
    body: (
      <>
        Click <strong className="text-[var(--foreground)]">&ldquo;Ask group&rdquo;</strong> next
        to any answer bar in the Results panel to send one question to everyone who gave
        that answer, and see all their reasoning side by side instead of opening
        separate 1:1 chats.
      </>
    ),
  },
  {
    title: "How replies are cited",
    body: (
      <>
        <span className="font-serif italic text-[var(--foreground)]">Large quoted text</span>{" "}
        with a numbered marker is pulled directly from that person&apos;s real survey
        comment — click the marker to see the source.{" "}
        <span className="text-[var(--muted)]">Smaller plain text</span> is a simulated
        interpretation, not a fixed fact, which is why it can be regenerated.
      </>
    ),
  },
];

export function HeaderGlossary() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-full px-3 py-1.5 transition-colors"
      >
        <HelpCircle size={14} />
        How this works
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-[320px] rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_16px_40px_rgba(0,0,0,0.14)] z-50 animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <span className="text-[13.5px] font-semibold">How this works</span>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {ITEMS.map((item) => (
              <div key={item.title}>
                <div className="text-[12.5px] font-semibold mb-1">{item.title}</div>
                <p className="text-[12.5px] leading-relaxed text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
