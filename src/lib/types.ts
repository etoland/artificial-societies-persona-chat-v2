export type SeasonAnswer = "Spring" | "Summer" | "Autumn" | "Winter";

export interface Persona {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  gender: "Male" | "Female";
  generation: "Gen Z" | "Millennial" | "Gen X" | "Boomer";
  seniority: "Executive Level" | "Senior Level" | "Mid Level" | "Entry Level";
  industry: string;
  avatarSeed: string;
  answer: SeasonAnswer;
  comment: string;
  color: string; // hex, tied to answer
}

export interface ChatMessage {
  id: string;
  role: "user" | "persona";
  content: string;
  timestamp: number;
  /**
   * For persona messages only: the user question that produced this reply.
   * Lets "regenerate" re-run the mock generator against the same prompt.
   */
  promptText?: string;
  /**
   * Only present on persona messages. Tells the client whether this line
   * was pulled from the persona's actual survey response/comment, or
   * extrapolated from their profile traits. This is the mechanism behind
   * the "is this backed by real data?" trust feature.
   */
  grounding?: {
    type: "grounded" | "inferred";
    sourceQuote?: string; // the actual survey comment text, when grounded
  };
}

export interface Conversation {
  personaId: string;
  messages: ChatMessage[];
  lastActive: number;
  archived?: boolean;
}
