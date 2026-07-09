import { Persona, SeasonAnswer, ChatMessage } from "./types";

export const ANSWER_COLORS: Record<SeasonAnswer, string> = {
  Spring: "#E29A4F",
  Summer: "#3F4E8C",
  Autumn: "#7C5CBF",
  Winter: "#C0574A",
};

export const SURVEY_QUESTION =
  "If you could live in one season year-round, which would you choose?";

const industries = [
  "Technology",
  "Software Development",
  "Higher Education",
  "Financial Services",
  "Venture Capital",
  "IT Services and IT Consulting",
];

const firstNames = [
  "Mark", "Sara", "Daniel", "Priya", "James", "Wei", "Fatima", "Lucas",
  "Elena", "Noah", "Aisha", "Marcus", "Yuki", "Carlos", "Grace", "Omar",
  "Sofia", "Ben", "Nadia", "Ryan", "Chloe", "Amir", "Ines", "Tom",
  "Leila", "Sam", "Maya", "Victor", "Hannah", "Ken",
];
const lastNames = [
  "Zuckerberg", "Chen", "Okafor", "Patel", "Nakamura", "Silva", "Novak",
  "Reyes", "Bergström", "Hassan", "Kowalski", "Dubois", "Ito", "Fischer",
  "Alvarez", "Kaur", "Larsen", "Costa", "Weiss", "Tanaka", "Osei",
  "Mercer", "Volkov", "Haddad", "Lindqvist", "Moreau", "Abara", "Sato",
  "Bianchi", "Kim",
];
const titles = [
  "CEO", "Founder & CEO", "VP of Product", "Engineering Lead",
  "Angel Investor", "Chief of Staff", "Head of Talent", "Partner",
  "Professor", "Dean of Admissions", "Managing Director", "COO",
  "Head of Growth", "Principal Engineer", "CFO",
];
const seniorities: Persona["seniority"][] = [
  "Executive Level", "Senior Level", "Mid Level", "Entry Level",
];
const generations: Persona["generation"][] = [
  "Gen Z", "Millennial", "Gen X", "Boomer",
];
const cities = [
  "Palo Alto, United States", "London, United Kingdom", "Austin, United States",
  "Berlin, Germany", "Singapore", "Toronto, Canada", "New York, United States",
  "Amsterdam, Netherlands", "Bangalore, India", "Sydney, Australia",
];

const commentsByAnswer: Record<SeasonAnswer, string[]> = {
  Autumn: [
    "It mirrors how I think about strategy — harvesting what you planted, tightening up before the next cycle. There's a clarity to it that summer doesn't have.",
    "The crisp air actually helps me focus. I do my best deep work in autumn, no contest.",
    "New academic year, new cohort, new energy. Autumn just feels like the real new year to me.",
    "It's the season of consolidation. Spring and summer are for planting and growing, autumn is when you actually bring it home.",
    "Everything gets sharper in autumn — deadlines, priorities, the whole team's focus. I do my best decision-making this time of year.",
    "It's less flashy than summer but it's when the real work gets finished. I trust autumn-me more than summer-me.",
    "There's a natural rhythm to it — you spent the year building, autumn is when you actually see if it holds up.",
    "I like that it forces a close. Spring and summer are open-ended, autumn has a deadline built into the weather itself.",
    "Cooler air, longer nights for reading — it's the season where I actually catch up on everything I put off.",
    "It's the one season that rewards patience. Everyone else chases the sprint, I'd rather be good at the close.",
  ],
  Summer: [
    "It mirrors how I think about work and projects — pushing forward, building something new. It's a season that's all about progress, you know?",
    "Summer is the season that best represents the energy of building and scaling. Everything is in high gear.",
    "Longer days mean more runway to actually ship things. I've always been more energized by momentum than by slowing down.",
    "It's when I feel most 'on'. High energy, high output, no excuses about the weather.",
    "There's no natural excuse to slow down in summer, and honestly I like that pressure. It keeps me moving.",
    "Everything about summer says 'go' to me — long days, high energy, no downtime built in. That's how I like to operate.",
    "I associate it with launches. Every big thing I've shipped happened in a summer-brain headspace, if that makes sense.",
    "It's the season where ambition doesn't feel out of place. I like environments that match that energy.",
    "More daylight literally means more hours I can be productive without forcing it — practical as much as it is a mood thing.",
    "Summer is when I stop overthinking and just execute. I do my worst work when I have too much time to deliberate.",
  ],
  Spring: [
    "That feeling of things just coming alive, everything pushing upwards. That's what building an awesome team feels like to me, you start with these seeds.",
    "It's all about new beginnings, that fresh burst of growth after winter. For me, that feeling perfectly mirrors the startup hustle.",
    "Spring is optimism you can actually see happening outside your window. I need that for my own motivation.",
    "New product cycles, new hires, new budget — spring at work always feels like actual spring.",
    "It's the only season where starting over doesn't feel like failure — it's just what the season is for.",
    "I do my best brainstorming in spring. Something about everything visibly growing makes we want to build too.",
    "It matches how I like to work best: messy, early-stage, full of half-formed ideas that haven't been judged yet.",
    "There's an honesty to spring — nothing's polished yet, and I find that more energizing than a finished product.",
    "It's the season of permission to try things. I need that mindset more than I need good weather.",
    "Everything feels reversible in spring, low stakes, easy to experiment. That's when I do my most creative work.",
  ],
  Winter: [
    "Everyone else is out there, I like the quiet. It's the one season where nobody expects you to be 'on' all the time.",
    "I do my most focused thinking when the world slows down. Winter forces a kind of stillness I actually need.",
    "Cabin, fireplace, long-form thinking. It's the only season where deep work doesn't feel like a fight against FOMO.",
    "Unpopular opinion, but winter is when I actually get to rest and reset instead of running on empty.",
    "It's permission to not be productive for a stretch, and I think that's underrated. I come back sharper because of it.",
    "I like that everyone else slows down too — it's the one season where rest doesn't feel like falling behind.",
    "Long nights are made for reading and actually thinking, not just reacting to whatever's urgent that day.",
    "There's less noise in winter, fewer social obligations, more room to actually hear my own thinking.",
    "It's the season I associate with planning rather than doing — and I think good planning needs that kind of quiet.",
    "Honestly it's the only season where I don't feel guilty about doing less. That matters more to me than people admit.",
  ],
};

function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function makePersona(i: number): Persona {
  const first = seededPick(firstNames, i);
  const last = seededPick(lastNames, i * 7 + 3);
  const answerPool: SeasonAnswer[] = [
    "Autumn", "Autumn", "Autumn", "Autumn", // ~40%
    "Spring", "Spring", "Spring", // ~25%
    "Summer", "Summer", "Summer", // ~25%
    "Winter", // ~10%
  ];
  const answer = seededPick(answerPool, i * 13 + 5);
  const comment = seededPick(commentsByAnswer[answer], i * 3 + 1);

  return {
    id: `persona-${i}`,
    name: `${first} ${last}`,
    title: seededPick(titles, i * 5 + 2),
    company: seededPick(
      ["Meta Platforms, Inc.", "Northwind Labs", "Aster Capital", "Bluepeak",
       "Horizon Partners", "Cursive", "Fieldstone University", "Lumen Group",
       "Ridgeline Ventures", "Compass IT Consulting"],
      i * 11 + 4
    ),
    location: seededPick(cities, i * 9 + 6),
    gender: i % 2 === 0 ? "Male" : "Female",
    generation: seededPick(generations, i * 5 + 1),
    seniority: seededPick(seniorities, i * 3 + 2),
    industry: seededPick(industries, i * 7 + 1),
    avatarSeed: `${first}${last}${i}`,
    answer,
    comment,
    color: ANSWER_COLORS[answer],
  };
}

export const PERSONAS: Persona[] = Array.from({ length: 60 }, (_, i) => makePersona(i));

// Make persona-0 the "Mark Zuckerberg" example from the brief screenshots
PERSONAS[0] = {
  id: "persona-0",
  name: "Mark Zuckerberg",
  title: "CEO",
  company: "Meta Platforms, Inc.",
  location: "Palo Alto, United States",
  gender: "Male",
  generation: "Millennial",
  seniority: "Executive Level",
  industry: "Technology",
  avatarSeed: "MarkZuckerberg0",
  answer: "Summer",
  comment:
    "It mirrors how I think about work and projects — pushing forward, building something new. It's a season that's all about progress, you know?",
  color: ANSWER_COLORS.Summer,
};

export function themeForAnswer(answer: SeasonAnswer): { title: string; blurb: string } {
  return THEME_META[answer];
}

export function personasForAnswer(answer: SeasonAnswer): Persona[] {
  return PERSONAS.filter((p) => p.answer === answer);
}

export function resultsBreakdown() {
  const counts: Record<SeasonAnswer, number> = { Spring: 0, Summer: 0, Autumn: 0, Winter: 0 };
  PERSONAS.forEach((p) => counts[p.answer]++);
  const total = PERSONAS.length;
  return (Object.keys(counts) as SeasonAnswer[]).map((k) => ({
    answer: k,
    pct: Math.round((counts[k] / total) * 100),
    color: ANSWER_COLORS[k],
  }));
}

const THEME_META: Record<SeasonAnswer, { title: string; blurb: string }> = {
  Spring: {
    title: "Renewal and Growth",
    blurb: "associate their answer with metaphors for new beginnings, startup energy, and things coming alive again.",
  },
  Summer: {
    title: "Peak Performance Energy",
    blurb: "view their answer as a period of high output, momentum, and pushing projects forward without friction.",
  },
  Autumn: {
    title: "Focus and Consolidation",
    blurb: "link their answer to clarity, tightening up, and harvesting the results of earlier work.",
  },
  Winter: {
    title: "Quiet and Deep Work",
    blurb: "connect their answer to stillness, rest, and escaping the pressure to always be \"on.\"",
  },
};

export interface CommentTheme {
  answer: SeasonAnswer;
  title: string;
  pct: number;
  blurb: string;
  examples: { title: string; industry: string; quote: string }[];
}

/**
 * Groups the underlying survey comments into named themes (mirroring the
 * "Comment Analysis" section of the results panel). Each theme reports
 * what share of respondents gave that answer, plus a couple of real
 * example quotes pulled straight from persona data for attribution.
 */
export function commentThemes(): CommentTheme[] {
  const total = PERSONAS.length;
  const byAnswer: Record<SeasonAnswer, Persona[]> = {
    Spring: [], Summer: [], Autumn: [], Winter: [],
  };
  PERSONAS.forEach((p) => byAnswer[p.answer].push(p));

  return (Object.keys(byAnswer) as SeasonAnswer[])
    .filter((a) => byAnswer[a].length > 0)
    .sort((a, b) => byAnswer[b].length - byAnswer[a].length)
    .slice(0, 3)
    .map((answer) => {
      const group = byAnswer[answer];
      const uniqueByComment = Array.from(
        new Map(group.map((p) => [p.comment, p])).values()
      );
      return {
        answer,
        title: THEME_META[answer].title,
        pct: Math.round((group.length / total) * 100),
        blurb: THEME_META[answer].blurb,
        examples: uniqueByComment.slice(0, 2).map((p) => ({
          title: p.title,
          industry: p.industry,
          quote: p.comment,
        })),
      };
    });
}

/**
 * Suggested opening questions shown in the empty chat state.
 * Answers when why-questions map directly to the persona's actual comment.
 */
export function suggestedQuestions(persona: Persona): string[] {
  return [
    `Why did you choose ${persona.answer.toLowerCase()}?`,
    "Tell me a bit about your role.",
    "How does this connect to how you work?",
    "What would change your mind?",
  ];
}

const roleFlavor: Record<string, string[]> = {
  role: [
    "I lead {title} work at {company} — day to day that means a lot of prioritization calls and fewer hours in the weeds than I'd like.",
    "At {company} I'm {title}. Most of my week is split between planning and actually getting things unstuck for the team.",
    "{title} at {company}, which mostly means I'm translating between strategy and whatever's actually happening on the ground that week.",
  ],
  changeMind: [
    "Honestly, not much — I've thought about this more than a survey question usually deserves. Ask me again in five years, maybe.",
    "If my day-to-day looked totally different, sure. But given how I actually work, this is a pretty settled answer for me.",
    "Probably a total shift in how I structure my year — different job, different rhythm. Barring that, this holds.",
  ],
  connect: [
    "It's less about the literal weather and more a metaphor for how I want my work to feel most of the year.",
    "I notice I'm more decisive and less precious about ideas during {answer_lower} — that's the connection for me.",
    "It maps to a rhythm I've noticed in myself over a few years now, more than any single season being objectively better.",
  ],
  favorite: [
    "Honestly the pace of it — everything about {answer_lower} matches how I want a normal week to feel.",
    "The mindset it puts me in. It's less about the season itself and more what it gives me permission to do.",
    "Probably that it doesn't require any explanation — it's just obviously the right fit for how I already operate.",
  ],
  challenge: [
    "Trying to make the rest of the year feel more like {answer_lower}, honestly. That's the ongoing project.",
    "Convincing other people it's not just a personal quirk — most people have a strong opinion about this without thinking about why.",
    "Not much of a challenge, if I'm honest — this is one of the more settled opinions I hold.",
  ],
  advice: [
    "Pay attention to which season you actually get things done in, not which one you're supposed to like.",
    "Don't pick the season you're nostalgic for — pick the one that matches how you want to be operating right now.",
    "Notice the pattern over a few years before you commit to an answer. Mine took a while to become obvious.",
  ],
  default: [
    "That's a fair question. I don't have a sharp answer for that one beyond my gut reaction on the survey.",
    "Good question — I'd need to sit with that one a bit more than I can here.",
    "Not sure I've thought about it from that angle — my answer was more instinct than analysis.",
  ],
};

function wb(word: string) {
  return new RegExp(`\\b${word}\\b`, "i");
}

/**
 * Fully mocked/templated response generator standing in for an LLM call.
 * Returns both the reply text AND a grounding tag so the UI can show
 * whether the line is sourced from the real survey comment ("grounded")
 * or extrapolated from persona traits ("inferred").
 *
 * `seedOverride` lets "regenerate" produce a genuinely different inferred
 * variant on request, rather than the deterministic default. Grounded
 * replies deliberately ignore the seed — you can't regenerate a fact.
 *
 * Matching uses word boundaries (not raw substring checks) and checks
 * more specific categories before the broad "why" bucket, so a question
 * like "what's your role day to day" doesn't get miscategorized as
 * asking about their survey choice just because it shares a stray word.
 */
export function generateMockReply(
  persona: Persona,
  userMessage: string,
  seedOverride?: number
): { content: string; grounding: ChatMessage["grounding"] } {
  const msg = userMessage.toLowerCase();
  const seed = seedOverride ?? persona.id.length;
  const has = (word: string) => wb(word).test(msg);

  const asksRole =
    has("role") || has("job") || has("company") || (has("do") && has("do you do")) || msg.includes("work on");
  if (asksRole) {
    const template = seededPick(roleFlavor.role, seed);
    return {
      content: template.replace("{title}", persona.title).replace("{company}", persona.company),
      grounding: { type: "inferred" },
    };
  }

  const asksChangeMind = msg.includes("change your mind") || has("convince") || (has("what") && has("if"));
  if (asksChangeMind) {
    return {
      content: seededPick(roleFlavor.changeMind, seed + 1),
      grounding: { type: "inferred" },
    };
  }

  const asksFavorite = has("favorite") || has("favourite") || has("best") || has("love");
  if (asksFavorite) {
    const template = seededPick(roleFlavor.favorite, seed + 3);
    return {
      content: template.replace("{answer_lower}", persona.answer.toLowerCase()),
      grounding: { type: "inferred" },
    };
  }

  const asksChallenge = has("challenge") || has("hard") || has("difficult") || has("struggle");
  if (asksChallenge) {
    const template = seededPick(roleFlavor.challenge, seed + 4);
    return {
      content: template.replace("{answer_lower}", persona.answer.toLowerCase()),
      grounding: { type: "inferred" },
    };
  }

  const asksAdvice = has("advice") || has("suggest") || has("recommend") || has("tip");
  if (asksAdvice) {
    return {
      content: seededPick(roleFlavor.advice, seed + 5),
      grounding: { type: "inferred" },
    };
  }

  const asksConnect = has("connect") || has("mean") || has("relate");
  if (asksConnect) {
    const template = seededPick(roleFlavor.connect, seed + 2);
    return {
      content: template.replace("{answer_lower}", persona.answer.toLowerCase()),
      grounding: { type: "inferred" },
    };
  }

  // Deliberately checked last and narrowly: only questions clearly asking
  // about the reasoning behind their actual survey pick get the grounded,
  // quoted reply — everything else falls through to an inferred response
  // above, rather than defaulting to "why" for anything vaguely related.
  const asksWhy =
    has("why") ||
    (has("choose") && (has("season") || has("answer") || has("pick"))) ||
    has("chose") ||
    (has("pick") && (has("why") || has("season")));
  if (asksWhy) {
    return {
      content: persona.comment,
      grounding: { type: "grounded", sourceQuote: persona.comment },
    };
  }

  return {
    content: seededPick(roleFlavor.default, seed),
    grounding: { type: "inferred" },
  };
}
