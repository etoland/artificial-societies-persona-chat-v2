import { SURVEY_QUESTION, resultsBreakdown, commentThemes } from "@/lib/mockData";
import { SeasonAnswer } from "@/lib/types";
import { Users } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

export function ResultsPanel({ onOpenPanel }: { onOpenPanel: (answer: SeasonAnswer) => void }) {
  const breakdown = resultsBreakdown();
  const top = breakdown.reduce((a, b) => (b.pct > a.pct ? b : a));
  const themes = commentThemes();

  return (
    <aside className="w-[340px] shrink-0 border-l border-[var(--border)] px-6 py-6 overflow-y-auto">
      <h2 className="text-[15px] font-semibold">Results</h2>
      <div className="mt-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="text-[10.5px] uppercase tracking-wide font-medium text-[var(--muted-subtle)] mb-1">
          Question
        </div>
        <p className="text-[14px] leading-snug text-[var(--foreground)] font-medium">
          {SURVEY_QUESTION}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        <h3 className="text-[13px] font-medium text-[var(--muted)]">Breakdown</h3>
        <InfoTooltip label="What does clicking a bar do?">
          <div className="font-medium text-[var(--foreground)] mb-1">Group chat</div>
          Click any bar below to open a panel chat with everyone who gave that
          answer — ask one question and see every respondent&apos;s reasoning
          side by side, instead of opening separate 1:1 chats.
        </InfoTooltip>
      </div>
      <div className="mt-3 space-y-4">
        {breakdown.map((b) => (
          <div key={b.answer} className="group">
            <div className="flex items-center justify-between text-[13px] mb-1.5">
              <span className="text-[var(--muted)]">{b.answer}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{b.pct}%</span>
                <button
                  onClick={() => onOpenPanel(b.answer)}
                  className="flex items-center gap-1 text-[11px] font-medium text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Users size={11} />
                  Ask group
                </button>
              </div>
            </div>
            <button
              onClick={() => onOpenPanel(b.answer)}
              className="w-full h-1.5 rounded-full bg-[var(--surface)] overflow-hidden block"
              title={`Ask everyone who chose ${b.answer} a question`}
            >
              <div
                className="h-full rounded-full transition-transform group-hover:scale-y-150 origin-center"
                style={{ width: `${b.pct}%`, background: b.color }}
              />
            </button>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-[14px] font-semibold">Insights</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">
        {top.answer} is the top choice, favored by {top.pct}% of respondents —
        well ahead of the rest of the field. Click any dot on the graph to see
        that person&apos;s full response, or start a conversation to ask them why.
      </p>

      <h3 className="mt-8 text-[14px] font-semibold">Comment Analysis</h3>
      <div className="mt-3 space-y-6">
        {themes.map((theme) => (
          <div key={theme.answer}>
            <div className="text-[13.5px] font-semibold">{theme.title}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
              {theme.pct}% of respondents who chose {theme.answer.toLowerCase()} {theme.blurb}
            </p>
            <div className="mt-2.5 space-y-2.5">
              {theme.examples.map((ex, i) => (
                <div
                  key={i}
                  className="border-l-2 pl-3"
                  style={{ borderColor: "#8fbf9f" }}
                >
                  <div className="text-[11.5px] font-medium text-[var(--foreground)]">
                    {ex.title}, {ex.industry}
                  </div>
                  <p className="mt-0.5 text-[12.5px] italic leading-relaxed text-[var(--muted)]">
                    &ldquo;{ex.quote}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
