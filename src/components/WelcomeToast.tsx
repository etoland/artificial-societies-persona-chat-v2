"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

/**
 * Briefly shown once when the page loads, then fades. Its whole job is to
 * point at the permanent "How this works" glossary in the header so people
 * know it exists before they need it, rather than discovering it by
 * accident (or never).
 */
export function WelcomeToast() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 150);
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const removeTimer = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[600] flex items-center justify-center pointer-events-none transition-opacity duration-400 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.16)]">
        <HelpCircle size={16} className="text-[var(--muted)] shrink-0" />
        <span className="text-[13.5px] text-[var(--foreground)]">
          New here? Click <strong>&ldquo;How this works&rdquo;</strong> in the header
          anytime — it&apos;s always there.
        </span>
      </div>
    </div>
  );
}
