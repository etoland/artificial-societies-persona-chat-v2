# Persona Chat v2 — Societies Engineer Task

**Live demo:** https://artificial-societies-persona-chat-v.vercel.app/

A redesign of the persona chat feature in Radiant, built around the five pieces of client feedback in the brief. Built with Next.js (App Router), TypeScript, and Tailwind, styled to match the existing Apple-minimal look of the platform.

## Running it

```bash
npm install
npm run dev
```

Open `localhost:3000`. No backend/API keys needed — everything, including chat replies, is mocked locally (see "What's real vs. mocked" below).

---

## How each piece of feedback was addressed

**"I don't know when or why I should use the chats"**
The empty state in a new chat explains the use case directly ("Use this to dig into the 'why' behind a response — like a quick interview transcript") and offers four suggested starter questions so there's an obvious first move instead of a blank input field.

**"I keep losing my chats after I log off"**
Every conversation persists to `localStorage`, keyed by persona (`src/lib/useConversations.ts`). A "Conversations" rail inside the chat overlay lists every past conversation with a preview and timestamp, so chats are actually browsable, not just saved silently.

*Caveat:* this solves it for one browser on one device — there's no real auth system here, so "log off" doesn't map to an actual account. `localStorage` survives a refresh, closed tab, or the next day, but not clearing browser data, and it won't follow a user across devices. A real implementation would persist to a database keyed to the logged-in user, not the browser.

**"I don't know any details about who I'm talking to"**
Previously persona details only lived in the pre-chat popup and vanished once you opened the chat. Now the persona's name, title, company, and their actual survey answer are pinned in a fixed header for the entire conversation.

**"I don't trust the chat and their responses"**
This is about trust in the interaction as a whole, separate from the data-provenance question below. Addressed with:

- **A standing disclaimer** ("Simulated persona — views are AI-generated, not the real person's") visible above the input at all times, not a one-time modal you can miss and forget.
- **Pinned persona identity** in the chat header throughout the conversation — trust starts with knowing exactly who/what you're talking to, consistently, not just at the start.
- **Thumbs up/down** on every reply, as a lightweight feedback loop — gives clients a way to flag "this doesn't feel realistic" in the moment, which would feed into Societies' own persona-quality data over time (see the eval pipeline note below).
- **Panel/group chat.** Trusting a single response in isolation is fragile; asking a whole group the same question and seeing how their answers compare gives a client a way to cross-check one persona's response against the pattern of many, rather than taking any single reply at face value.

**"How do I know if what they're saying is backed by real data or just made up?"**
This is the specific data-provenance question, and the one I spent the most effort on:

- **Inline citations.** Every quoted reply carries a small numbered marker (Gemini/Perplexity-style) that expands to show the *exact* original survey comment it's drawn from — not just a disclaimer, an actual per-message source.
- **Transcript/pull-quote visual language.** Answers grounded in real survey data render as large serif pull-quotes; answers extrapolated from persona traits render smaller and muted. Visual confidence maps to data confidence, so the distinction is legible even before reading the citation.
- **Regenerate is disabled on grounded replies.** You can regenerate an interpreted line, but not a quoted fact — reinforcing, through the interface itself, that quoted data isn't negotiable the way inferred commentary is.
- **A permanent "How this works" glossary in the header**, plus a one-time onboarding toast pointing at it — because a citation mechanism doesn't help if people don't know it's there or how to read it.

---

## Additional UI polish beyond the stated feedback

A few smaller changes weren't direct responses to the five complaints, but felt like reasonable craft/attention-to-detail improvements while in the code:

- **Dot sizing by seniority** on the persona graph — executives render larger than entry-level, so the graph itself hints at who might be worth clicking first (the same idea as headliner-sized acts on a festival lineup).
- **Top-choice highlighting** in the Results breakdown — the leading answer gets a tinted background, bolded/color-matched text, and a small "Top choice" badge, so the standout result is scannable at a glance rather than requiring you to compare four percentages manually.
- **The survey question boxed and labeled** ("Question") separately from the "Results" header, so it doesn't run together with the page title.
- The "Ask group" affordance turns red on hover, giving it a bit more visual weight against an otherwise fairly neutral, monochrome UI.

None of these were asked for — they're small enough that I'd flag them as "nice to have, cut if time-constrained" in a real sprint, but they were cheap here and improve scannability.

---

## What's real vs. mocked (important caveat)

Per an early decision in this project, chat replies are **fully templated, not a real LLM call** — no API key required, runs entirely client-side. The grounded/inferred distinction is currently keyword-matching on the user's question (e.g. "why did you choose..." → pull the real comment) rather than a real retrieval or citation mechanism.

This means the credibility features above are a **UI/UX prototype of the trust mechanism**, not a production implementation of it. If I were shipping this for real, closing that gap would be my top priority — the specifics are below.

## With more time: making the credibility story real

The interface can *say* "this is grounded in real data," but nothing today verifies that claim against an actual model call. In a real implementation, I'd focus on:

**1. Strict grounding via RAG.** Move off the LLM's parametric memory entirely for persona facts. Every reply-generation call would retrieve the persona's actual survey response (and any other verified profile data) from a vector store — Postgres with `pgvector` is probably sufficient at Societies' likely scale, Pinecone if retrieval volume justifies a managed service — and inject it into context, rather than trusting the model to "remember" or infer it correctly. The current inline citation UI is designed to plug directly into this: the citation marker already expects a `sourceQuote`, it just needs to come from a real retrieval step instead of a lookup on mock data.

**2. Deterministic guardrails, not just a disclaimer.** An orchestration layer (LangChain or custom middleware) would evaluate outputs before they reach the user, with a fallback matrix: if the query falls outside what's retrievable for a given persona, respond with something like "I don't have data on that for this persona" rather than letting the model improvise. One implementation note: LLMs don't expose a native confidence score, so "confidence-based" fallback would need a secondary step — either a lightweight entailment/consistency check between the reply and the retrieved source, or a self-critique pass — rather than reading confidence off the model directly.

*A concrete example of why this matters, from building this prototype:* the current mock reply generator classifies intent with keyword matching, and an early version over-matched on "why" — questions like "what's your role day to day" got miscategorized as asking about the survey choice, because the matcher was too broad. I fixed the specific bug (word-boundary matching, more categories, stricter ordering), but the underlying failure mode is real: any keyword- or embedding-based intent router will occasionally misfire, and without a guardrail layer to catch a low-confidence or malformed match, it fails silently by returning a confidently-worded wrong answer instead of admitting uncertainty. That's the exact shape of problem a real guardrail layer exists to catch before it reaches the user.

**3. UI/UX accountability triggers.** Confidence badges (already prototyped here as the grounded/inferred distinction) and, potentially, a "view reasoning" expandable trace for complex queries — though I'd want to user-test that specifically before shipping it broadly. A reasoning trace that looks speculative can undermine trust as easily as it can build it; this is a hypothesis worth validating, not something I'd assume works.

**4. Continuous evaluation in production.** An async eval pipeline (Braintrust or LangSmith) using a stronger model to audit live conversation logs against the source survey data for truthfulness and drift — closing the loop on "how do we know the personas are staying accurate over time," not just at time of generation.

---

## Other things I'd do with more time

Roughly in priority order:

- **Edit & resend** the last message, and **streaming text** for replies instead of popping in fully formed — standard chat UX I deprioritized in favor of the trust-specific features above.
- **Stop generating** button for mid-stream replies (depends on streaming being implemented first).
- **Auto-generated conversation titles** in the conversations rail, instead of just showing the last message.
- **Session recap** when reopening an idle conversation ("You asked about X, they mentioned Y") so a long-dormant chat doesn't require re-reading everything.
- **Export a conversation** as a transcript — several clients use this for "1:1 market research interviews" per the brief, and will want to paste findings into a report.
- **Keyboard shortcuts** (Esc to close, Cmd+K to jump between personas).
- **A real accessibility pass.** The rotating 3D persona graph in particular is mouse/trackpad-first; keyboard and screen-reader users need an equivalent way to browse personas (e.g. a list-view toggle), which I did not build.
- **User testing on the discoverability fixes.** I added three separate (i)-icon tooltips plus a header glossary in response to feedback that features were invisible — but stacking that many "click to learn more" affordances is itself a smell. I'd want to validate with real users whether the underlying visual language (dot sizing, pull-quote styling) can be made self-explanatory enough that the tooltips become backup rather than load-bearing.

## User research I'd want to run before finalizing any of this

- **Card sort / tree test** on the panel-chat entry point specifically — "click a bar to ask the group" is a novel interaction, and I'm not confident people will find it without the tooltip prompting them to.
- **A/B test grounded vs. inferred visual weighting** — is size-as-confidence actually read correctly by users, or does it just read as "some text is bigger"? Worth testing with and without the citation marker to isolate which signal is doing the work.
- **Interviews with clients who already distrust the chat** (the actual people behind the original feedback) — walk them through this v2 and see whether the citation mechanism specifically moves their trust, or whether the root issue is something this UI can't fix (e.g. skepticism about simulated personas generally, which no amount of citation styling resolves).