// Motivational quotes for different loading states

import type { QuoteCategory, Quote } from "@/lib/types";

// Re-export for backwards compatibility
export type { QuoteCategory, Quote };

export const MOTIVATIONAL_QUOTES: Quote[] = [
  // Analyzing (Schritt 8 → 9 Übergang)
  {
    text: "Die Veränderung beginnt in dem Moment, in dem du bereit bist, dich selbst zu sehen.",
    category: 'analyzing'
  },
  {
    text: "Bewusstsein ist der erste Schritt zur Transformation.",
    category: 'analyzing'
  },
  {
    text: "Du erkennst jetzt, wer du warst. Gleich erschaffst du, wer du sein wirst.",
    category: 'analyzing'
  },
  {
    text: "Jede Erkenntnis über dich selbst ist ein Geschenk.",
    category: 'analyzing'
  },
  {
    text: "Du hast den Mut, hinzuschauen. Das ist bereits Transformation.",
    category: 'analyzing'
  },

  // Manifest Creation
  {
    text: "Deine Gedanken von heute erschaffen deine Realität von morgen.",
    category: 'manifest'
  },
  {
    text: "Du bist dabei, eine neue Version von dir selbst zu gebären.",
    category: 'manifest'
  },
  {
    text: "Dein neues Selbst wartet schon auf dich. Fühle es jetzt.",
    category: 'manifest'
  },
  {
    text: "Die Zukunft gehört denen, die heute schon die Emotionen ihrer Träume fühlen.",
    category: 'manifest'
  },
  {
    text: "Du erschaffst nicht nur einen Wunsch – du wirst zum Wunder.",
    category: 'manifest'
  },

  // PDF Generation
  {
    text: "Du hältst bald dein neues Leben in den Händen. 📄✨",
    category: 'pdf'
  },
  {
    text: "Deine Transformation wird greifbar. Gleich kannst du sie festhalten.",
    category: 'pdf'
  },
  {
    text: "Jedes Wort in diesem Dokument ist ein Versprechen an dich selbst.",
    category: 'pdf'
  },
  {
    text: "Dein persönliches Manifest entsteht. Ein Kompass für deine neue Realität.",
    category: 'pdf'
  },

  // Audio Generation
  {
    text: "Deine Worte werden zu Schwingungen. Lass sie in dein Unterbewusstsein fließen.",
    category: 'audio'
  },
  {
    text: "Höre dir selbst zu – und werde, wer du sein möchtest.",
    category: 'audio'
  },
  {
    text: "Deine Stimme trägt die Frequenz deiner neuen Realität.",
    category: 'audio'
  },
  {
    text: "Gleich kannst du deine Transformation hören und fühlen.",
    category: 'audio'
  },

  // General (für alle Wartezeiten)
  {
    text: "Du machst das großartig! 💫",
    category: 'general'
  },
  {
    text: "Jeder Schritt bringt dich näher zu deinem wahren Selbst.",
    category: 'general'
  },
  {
    text: "Vertraue dem Prozess. Du bist genau da, wo du sein sollst.",
    category: 'general'
  },
  {
    text: "Deine Transformation ist bereits in Bewegung.",
    category: 'general'
  },
  {
    text: "Du investierst in die wichtigste Person: dich selbst.",
    category: 'general'
  },
  {
    text: "Geduld ist Teil der Transformation. Atme tief ein.",
    category: 'general'
  },
  {
    text: "Deine Zukunft formt sich genau jetzt.",
    category: 'general'
  },
];

/**
 * Get a random quote for a specific category
 */
export function getRandomQuote(category: QuoteCategory): string {
  const categoryQuotes = MOTIVATIONAL_QUOTES.filter(q => q.category === category);
  
  if (categoryQuotes.length === 0) {
    // Fallback to general quotes
    const generalQuotes = MOTIVATIONAL_QUOTES.filter(q => q.category === 'general');
    const randomIndex = Math.floor(Math.random() * generalQuotes.length);
    return generalQuotes[randomIndex].text;
  }
  
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex].text;
}

/**
 * Get multiple random quotes for rotation during long loading times
 */
export function getRandomQuotes(category: QuoteCategory, count: number = 3): string[] {
  const categoryQuotes = MOTIVATIONAL_QUOTES.filter(q => q.category === category);
  const quotes = categoryQuotes.length > 0 ? categoryQuotes : MOTIVATIONAL_QUOTES.filter(q => q.category === 'general');
  
  // Shuffle and take first 'count' items
  const shuffled = [...quotes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(q => q.text);
}

