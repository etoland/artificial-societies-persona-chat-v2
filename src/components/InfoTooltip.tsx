"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

/**
 * Small (i) affordance that reveals an explanation on hover/click/focus.
 * Used anywhere a feature's meaning isn't obvious from looking at it —
 * dot sizing, panel chat, the pull-quote styling, etc.
 */
export function InfoTooltip({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
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
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        aria-label={label}
        className="text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors"
      >
        <Info size={13} />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-2 ${align === "left" ? "left-0" : "right-0"} w-[240px] rounded-[12px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_12px_28px_rgba(0,0,0,0.14)] p-3 text-[12px] leading-relaxed text-[var(--muted)] z-50`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
