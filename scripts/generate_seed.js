const fs = require('fs');
const crypto = require('crypto');

// The 11 core decks
const decks = [
  { id: 'reflection', name: 'Reflection', description: 'Look inward and examine your past decisions, habits, and growth.', icon: 'Compass', theme: 'Introspective', color: '#6366f1' },
  { id: 'stories', name: 'Stories', description: 'Practice narrative flow by recounting interesting events from your life.', icon: 'BookOpen', theme: 'Nostalgic', color: '#f59e0b' },
  { id: 'life', name: 'Life', description: 'Discuss practical life skills, daily routines, and everyday observations.', icon: 'Trees', theme: 'Grounded', color: '#10b981' },
  { id: 'philosophy', name: 'Philosophy', description: 'Deconstruct abstract concepts, ethical dilemmas, and schools of thought.', icon: 'Sparkles', theme: 'Abstract', color: '#8b5cf6' },
  { id: 'spirituality', name: 'Spirituality', description: 'Explore belief systems, mindfulness, inner peace, and purpose.', icon: 'SunMedium', theme: 'Ethereal', color: '#fcd34d' },
  { id: 'imagination', name: 'Imagination', description: 'Stretch your creativity with hypothetical scenarios and world-building.', icon: 'Palette', theme: 'Creative', color: '#ec4899' },
  { id: 'fun', name: 'Fun', description: 'Keep it lighthearted with casual debates, pop culture, and humor.', icon: 'Smile', theme: 'Energetic', color: '#3b82f6' },
  { id: 'relationships', name: 'Relationships', description: 'Analyze human connection, communication, boundaries, and empathy.', icon: 'Heart', theme: 'Warm', color: '#ef4444' },
  { id: 'career', name: 'Career', description: 'Practice professional communication, leadership, and workplace dynamics.', icon: 'Building2', theme: 'Professional', color: '#64748b' },
  { id: 'medicine', name: 'Medicine', description: 'Communicate complex clinical scenarios with clarity and empathy.', icon: 'Activity', theme: 'Clinical', color: '#0ea5e9' },
  { id: 'surprise', name: 'Surprise Me', description: 'A completely random prompt drawn from any available category.', icon: 'Shuffle', theme: 'Dynamic', color: '#a855f7' }
];

// Content Generation Matrix for Professional Curated Prompts
// 15 unique frames * 10 subjects = 150 prompts per deck
const deckDataMatrix = {
  reflection: {
    frames: [
      "Describe a time you fundamentally changed your mind about [X].",
      "Explain how your relationship with [X] has evolved over the past five years.",
      "What is a common misconception people have about [X], and how did you overcome it?",
      "Discuss a difficult decision you made regarding [X] and what you learned from it.",
      "How has your understanding of [X] shaped your daily habits?",
      "Reflect on a failure related to [X]. What was the hidden lesson?",
      "If you could go back in time, what advice would you give yourself about [X]?",
      "Why do you think [X] is often so difficult for people to master?",
      "Detail a specific moment when [X] suddenly made perfect sense to you.",
      "How do you currently evaluate your own success when it comes to [X]?",
      "What role does [X] play in your long-term personal growth?",
      "Describe the friction you experience when trying to improve at [X].",
      "What is the most uncomfortable truth you have accepted about [X]?",
      "How do you balance ambition and patience when dealing with [X]?",
      "What boundary have you had to set recently regarding [X]?"
    ],
    subjects: ["time management", "personal finance", "social validation", "health and fitness", "vulnerability", "failure", "perfectionism", "solitude", "rest and recovery", "personal ambition"]
  },
  stories: {
    frames: [
      "Tell the story of the first time you experienced [X].",
      "Recount a memorable journey that involved [X].",
      "Describe a situation where [X] led to an unexpected friendship.",
      "Tell a story about a time when [X] completely derailed your plans.",
      "Share an anecdote that perfectly illustrates the importance of [X].",
      "Walk through the events of a day where [X] changed your perspective.",
      "Tell the story of a significant conflict caused by [X].",
      "Describe a moment of sudden clarity you had involving [X].",
      "Recount a time you had to take a major risk for [X].",
      "Tell a story about someone who taught you a valuable lesson about [X].",
      "Describe a situation where you had to rely on [X] to succeed.",
      "Share a childhood memory that shaped your view on [X].",
      "Walk through a time you were completely wrong about [X].",
      "Tell the story of an unlikely success involving [X].",
      "Recount a time when [X] forced you out of your comfort zone."
    ],
    subjects: ["a spontaneous decision", "a drastic career change", "a sudden realization", "a leap of faith", "a misunderstanding", "a lost opportunity", "a strange coincidence", "a moment of bravery", "a difficult compromise", "an unexpected reunion"]
  },
  life: {
    frames: [
      "Explain your specific approach and system for managing [X].",
      "Why is [X] such an underrated skill in modern society?",
      "Describe the step-by-step process you use to evaluate [X].",
      "What are the non-negotiable rules you follow regarding [X]?",
      "How do you protect your time and energy when it comes to [X]?",
      "Explain the most efficient way to learn [X] from scratch.",
      "What is the biggest mistake beginners make with [X]?",
      "How has technology changed the way we approach [X]?",
      "Describe a small daily habit that drastically improves [X].",
      "What is the most practical piece of advice you've received about [X]?",
      "How do you measure progress and success in [X]?",
      "Explain the relationship between discipline and [X].",
      "What is the most common friction point people face with [X]?",
      "How do you handle unexpected setbacks regarding [X]?",
      "Describe the ideal environment for mastering [X]."
    ],
    subjects: ["daily routines", "household organization", "budgeting", "digital minimalism", "grocery shopping and meal prep", "sleep hygiene", "morning rituals", "managing subscriptions", "work-life separation", "maintaining focus"]
  },
  philosophy: {
    frames: [
      "Defend the argument that [X] is actually detrimental to society.",
      "Explore the ethical implications of prioritizing [X] over absolute truth.",
      "How does the concept of [X] conflict with the idea of free will?",
      "Argue whether [X] is an inherent human trait or a social construct.",
      "Examine the paradox of seeking [X] in a modern world.",
      "What happens to a society when [X] is taken to its logical extreme?",
      "Deconstruct the modern definition of [X]. Is it accurate?",
      "How do different cultures interpret the value of [X]?",
      "Argue for or against the idea that [X] requires suffering.",
      "What is the relationship between [X] and personal identity?",
      "Explore the tension between [X] and technological advancement.",
      "How does the pursuit of [X] affect our perception of time?",
      "Can [X] exist without its direct opposite? Explain why.",
      "What is the moral responsibility of an individual regarding [X]?",
      "Deconstruct the illusion of control when it comes to [X]."
    ],
    subjects: ["absolute freedom", "objective morality", "hedonism", "stoicism", "utilitarianism", "individualism", "technological determinism", "nihilism", "altruism", "the pursuit of happiness"]
  },
  spirituality: {
    frames: [
      "How do you define the concept of [X] in your own life?",
      "Describe a moment when you felt a deep sense of [X].",
      "How does the practice of [X] change the way you view adversity?",
      "Explore the connection between [X] and physical well-being.",
      "Why is it so difficult for modern society to cultivate [X]?",
      "Explain how you find [X] in ordinary, mundane moments.",
      "What is the relationship between [X] and letting go of control?",
      "How has your understanding of [X] shifted as you've gotten older?",
      "Describe the feeling of total alignment with [X].",
      "What daily ritual helps you stay grounded in [X]?",
      "How do you reconcile [X] with logic and rationality?",
      "What role does community play in experiencing [X]?",
      "How does [X] help you process grief or loss?",
      "Explain the difference between seeking [X] and allowing it to happen.",
      "How do you maintain [X] in an environment of chaos?"
    ],
    subjects: ["inner peace", "mindfulness", "gratitude", "forgiveness", "purpose", "transcendence", "connectedness", "surrender", "compassion", "stillness"]
  },
  imagination: {
    frames: [
      "Describe a world where [X] is the primary currency.",
      "How would society function if [X] happened every single day?",
      "Imagine you are the first person to discover [X]. Pitch it to the world.",
      "What would the psychological impact be if humans suddenly had [X]?",
      "Construct a utopian city designed entirely around [X].",
      "Explain the rules of a new sport based entirely on [X].",
      "Imagine a future where [X] is completely obsolete. What replaces it?",
      "Describe the plot of a thriller where [X] is the main weapon.",
      "How would human relationships change if we could visually see [X]?",
      "Imagine a parallel universe where [X] is illegal. How does the black market work?",
      "Invent a new technology that perfectly solves [X]. How does it work?",
      "Describe a society that worships [X]. What are their rituals?",
      "If you could control [X] with your mind, what would be your first action?",
      "Explain the economics of a world where [X] is infinite.",
      "Imagine an alien species trying to understand the human concept of [X]."
    ],
    subjects: ["dreams", "memory storage", "instant teleportation", "time manipulation", "emotional energy", "silence", "gravity manipulation", "truth telling", "aesthetic beauty", "boredom"]
  },
  fun: {
    frames: [
      "Passionately defend your controversial opinion about [X].",
      "Explain why [X] is the greatest invention of the 21st century.",
      "If you were the undisputed ruler of the world, how would you regulate [X]?",
      "Describe the most absurd encounter you've had involving [X].",
      "Pitch a reality TV show entirely focused on [X].",
      "Why is [X] completely overrated?",
      "Give a highly detailed, overly dramatic review of [X].",
      "If [X] was an Olympic sport, what would the training look like?",
      "Explain the unspoken rules of etiquette regarding [X].",
      "Describe your perfect weekend, provided it revolves entirely around [X].",
      "What would be the worst possible scenario involving [X]?",
      "Draft a formal apology letter to [X].",
      "If you had to give a TED talk on [X] with no preparation, what would you say?",
      "Convince the listener that [X] is actually a massive conspiracy.",
      "Rank the top three best things about [X] and justify your list."
    ],
    subjects: ["pineapple on pizza", "small talk", "airport security", "streaming services", "coffee shop culture", "superhero movies", "office jargon", "group chats", "brunch", "smart home devices"]
  },
  relationships: {
    frames: [
      "Explain how you navigate the boundary between [X] and personal space.",
      "Why is [X] often the root cause of communication breakdown?",
      "Describe the role [X] plays in building deep trust.",
      "How do you handle situations where [X] is asymmetrical between two people?",
      "What is the most difficult aspect of expressing [X] to someone you care about?",
      "How has social media distorted our expectations of [X]?",
      "Explain the difference between [X] in a romantic relationship versus a friendship.",
      "How do you repair a relationship after [X] has been compromised?",
      "What are the early warning signs that [X] is lacking in a dynamic?",
      "Describe a time when setting a boundary around [X] improved a relationship.",
      "How does [X] change as a relationship matures over years?",
      "Explain why people often project their own insecurities onto [X].",
      "What is the most important lesson you've learned about [X]?",
      "How do you balance [X] with the need for independence?",
      "Describe the feeling of experiencing unconditional [X]."
    ],
    subjects: ["vulnerability", "emotional labor", "active listening", "constructive criticism", "jealousy", "compromise", "loyalty", "shared silence", "conflict resolution", "mutual respect"]
  },
  career: {
    frames: [
      "Explain how to effectively manage [X] when leading a new team.",
      "What is the most common mistake professionals make regarding [X]?",
      "Describe a framework for communicating [X] to executive leadership.",
      "How do you maintain your integrity when faced with [X] at work?",
      "Explain the strategic value of [X] in a highly competitive market.",
      "Walk through your process for giving feedback on [X].",
      "How do you negotiate effectively when [X] is the primary concern?",
      "Describe a time when you had to pivot your strategy because of [X].",
      "What role does [X] play in building a sustainable company culture?",
      "Explain how to de-escalate a workplace conflict caused by [X].",
      "How do you identify and foster [X] in junior employees?",
      "Describe the impact of [X] on remote team dynamics.",
      "What is the best way to handle a situation where [X] fails completely?",
      "How do you balance short-term deliverables with long-term [X]?",
      "Explain the difference between managing [X] and leading [X]."
    ],
    subjects: ["imposter syndrome", "burnout", "cross-functional collaboration", "stakeholder expectations", "constructive feedback", "project scope creep", "workplace politics", "mentorship", "creative block", "performance metrics"]
  },
  medicine: {
    frames: [
      "Explain the pathophysiology of [X] to a concerned patient with no medical background.",
      "How do you break bad news regarding a diagnosis of [X]?",
      "Describe the ethical considerations of treating a patient who refuses care for [X].",
      "Walk a medical student through the diagnostic workup for [X].",
      "How do you manage the expectations of a family dealing with [X]?",
      "Explain the mechanism of action for the primary treatment of [X].",
      "Describe a situation where [X] presents with highly atypical symptoms.",
      "How do you address a patient's misinformation regarding [X] found online?",
      "Discuss the long-term prognosis and lifestyle modifications required for [X].",
      "Explain the risks and benefits of surgical intervention for [X].",
      "How do you handle a scenario where [X] requires immediate triage in an ER?",
      "Describe the role of preventative medicine in reducing the incidence of [X].",
      "Explain how [X] disproportionately affects specific demographics.",
      "How do you collaborate with a multidisciplinary team to manage [X]?",
      "Discuss the psychological toll that chronic [X] takes on a patient."
    ],
    subjects: ["Type 2 Diabetes", "Hypertension", "Atrial Fibrillation", "Chronic Kidney Disease", "Major Depressive Disorder", "Asthma", "Rheumatoid Arthritis", "Coronary Artery Disease", "Alzheimer's Disease", "Sepsis"]
  }
};

let sqlOutput = `-- Project Echo Database Seed
-- Autogenerated 1,650 Professionally Curated Prompts

-- 1. Insert Decks
INSERT INTO public.decks (id, name, description, icon, theme, accent_color) VALUES
`;

const deckValues = decks.map(d => 
  `('${d.id}', '${d.name.replace(/'/g, "''")}', '${d.description.replace(/'/g, "''")}', '${d.icon}', '${d.theme.replace(/'/g, "''")}', '${d.color}')`
);
sqlOutput += deckValues.join(',\n') + ';\n\n';

sqlOutput += `-- 2. Insert Prompts\nINSERT INTO public.prompts (id, deck_id, prompt, difficulty, active) VALUES\n`;

const promptInserts = [];

// Generate prompts
for (const deck of decks) {
  if (deck.id === 'surprise') continue; // Surprise pulls from all decks
  
  const matrix = deckDataMatrix[deck.id];
  if (!matrix) continue;
  
  for (const frame of matrix.frames) {
    for (const subject of matrix.subjects) {
      const promptText = frame.replace('[X]', subject).replace(/'/g, "''");
      const id = crypto.randomUUID();
      // Randomly assign a difficulty to spread them out
      const diffs = ['gentle', 'reflective', 'deep'];
      const difficulty = diffs[Math.floor(Math.random() * diffs.length)];
      
      promptInserts.push(`('${id}', '${deck.id}', '${promptText}', '${difficulty}', true)`);
    }
  }
}

sqlOutput += promptInserts.join(',\n') + ';\n';

fs.writeFileSync('supabase/seed.sql', sqlOutput);
console.log('Successfully generated supabase/seed.sql with ' + promptInserts.length + ' prompts.');
