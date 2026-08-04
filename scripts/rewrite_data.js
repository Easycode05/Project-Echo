
const fs = require('fs');

const DECKS = [
  { id: 'reflection', name: 'Reflection', description: 'Practice speaking about personal experiences and opinions.', roomSubtitle: 'Develop confidence in articulating personal views and individual perspectives.', environmentMood: 'A quiet forest at dawn. Deep greens and focused atmosphere.', accentColor: '#1B2E1E', glowClass: 'from-emerald-950/80 via-emerald-900/30 to-transparent', cardBgClass: 'bg-[#121f15]', iconBgClass: 'bg-[#1B2E1E]', iconName: 'Trees' },
  { id: 'stories', name: 'Stories', description: 'Practice storytelling with clear structure and engaging delivery.', roomSubtitle: 'Structure engaging narratives with captivating pacing and vocal clarity.', environmentMood: 'An old library. Warm wood, aged paper, storytelling focus.', accentColor: '#3D2B1F', glowClass: 'from-amber-950/80 via-amber-900/30 to-transparent', cardBgClass: 'bg-[#261b14]', iconBgClass: 'bg-[#3D2B1F]', iconName: 'BookOpen' },
  { id: 'life', name: 'Life', description: 'Practice discussing everyday topics with confidence.', roomSubtitle: 'Build verbal fluency when discussing practical daily situations.', environmentMood: 'Slate blue horizons, gentle breeze, grounded focus.', accentColor: '#1E293B', glowClass: 'from-slate-900/80 via-slate-800/30 to-transparent', cardBgClass: 'bg-[#131b26]', iconBgClass: 'bg-[#1E293B]', iconName: 'Compass' },
  { id: 'philosophy', name: 'Philosophy', description: 'Practice organizing complex ideas into clear explanations and arguments.', roomSubtitle: 'Refine structured reasoning and express abstract concepts clearly.', environmentMood: 'Deep indigo accents, intellectual clarity, crisp acoustics.', accentColor: '#1E1B4B', glowClass: 'from-indigo-950/80 via-indigo-900/30 to-transparent', cardBgClass: 'bg-[#141233]', iconBgClass: 'bg-[#1E1B4B]', iconName: 'Sparkles' },
  { id: 'spirituality', name: 'Religion & Spirituality', description: 'Practice discussing beliefs and perspectives respectfully and thoughtfully.', roomSubtitle: 'Articulate deep values, core beliefs, and convictions with poise.', environmentMood: 'Respectful atmosphere, soft golden light, focused quiet.', accentColor: '#4A3E1B', glowClass: 'from-yellow-950/80 via-amber-900/30 to-transparent', cardBgClass: 'bg-[#29220e]', iconBgClass: 'bg-[#4A3E1B]', iconName: 'SunMedium' },
  { id: 'imagination', name: 'Imagination', description: 'Practice creative thinking and spontaneous speaking.', roomSubtitle: 'Unlock vocal agility and rapid creative improvisation.', environmentMood: 'Organic movement, vibrant purple-cyan aura, expansive creativity.', accentColor: '#2A1B4E', glowClass: 'from-purple-950/80 via-fuchsia-900/30 to-transparent', cardBgClass: 'bg-[#1a1131]', iconBgClass: 'bg-[#2A1B4E]', iconName: 'Palette' },
  { id: 'fun', name: 'Fun', description: 'Practice conversational fluency through lighthearted topics.', roomSubtitle: 'Build quick, engaging, and relaxed conversational flow.', environmentMood: 'Warm orange glow, spontaneous delight, dynamic energy.', accentColor: '#4A261B', glowClass: 'from-orange-950/80 via-orange-900/30 to-transparent', cardBgClass: 'bg-[#2b160f]', iconBgClass: 'bg-[#4A261B]', iconName: 'Smile' },
  { id: 'relationships', name: 'Relationships', description: 'Practice communicating about emotions and interpersonal situations.', roomSubtitle: 'Express interpersonal feelings and empathetic communication clearly.', environmentMood: 'Safe intimate space, natural soft lighting, empathetic clarity.', accentColor: '#451A22', glowClass: 'from-rose-950/80 via-rose-900/30 to-transparent', cardBgClass: 'bg-[#291014]', iconBgClass: 'bg-[#451A22]', iconName: 'Heart' },
  { id: 'career', name: 'Career', description: 'Practice professional communication, interviews, presentations, and leadership discussions.', roomSubtitle: 'Master executive presence, persuasive delivery, and professional interviews.', environmentMood: 'Emerald accents, elegant geometry, executive presence.', accentColor: '#064E3B', glowClass: 'from-emerald-950/80 via-teal-900/30 to-transparent', cardBgClass: 'bg-[#042e23]', iconBgClass: 'bg-[#064E3B]', iconName: 'Building2' },
  { id: 'medicine', name: 'Medicine', description: 'Practice explaining medical concepts clearly to patients, students, and colleagues.', roomSubtitle: 'Explain complex health, clinical, and scientific topics with clarity and empathy.', environmentMood: 'Precision, trust, empathetic clarity, clinical focus.', accentColor: '#134E4A', glowClass: 'from-teal-950/80 via-cyan-900/30 to-transparent', cardBgClass: 'bg-[#0b2e2b]', iconBgClass: 'bg-[#134E4A]', iconName: 'Activity' },
  { id: 'dentistry', name: 'Dentistry', description: 'Practice explaining dental procedures, oral health, and treatment plans.', roomSubtitle: 'Master case presentations and clear patient communication in dentistry.', environmentMood: 'Clean, precise, clinical and reassuring.', accentColor: '#0284c7', glowClass: 'from-sky-950/80 via-sky-900/30 to-transparent', cardBgClass: 'bg-[#042436]', iconBgClass: 'bg-[#0284c7]', iconName: 'Tooth' },
  { id: 'surprise', name: 'Surprise', description: 'Practice speaking confidently on unexpected topics.', roomSubtitle: 'Test your spontaneous speaking skills on random topics.', environmentMood: 'Unpredictable challenges, instant verbal readiness.', accentColor: '#313030', glowClass: 'from-neutral-900/80 via-neutral-800/30 to-transparent', cardBgClass: 'bg-[#1f1f1f]', iconBgClass: 'bg-[#313030]', iconName: 'Shuffle' }
];

const PROMPTS = [
  // Reflection
  { id: 'ref-1', deckId: 'reflection', text: 'Talk about a time you had to change your mind about something important.' },
  { id: 'ref-2', deckId: 'reflection', text: 'Describe a small, seemingly insignificant moment that actually shaped who you are today.' },
  { id: 'ref-3', deckId: 'reflection', text: 'What is a piece of advice you were given that you initially rejected, but later realized was brilliant?' },
  { id: 'ref-4', deckId: 'reflection', text: 'If you could sit down with your 18-year-old self for ten minutes, what is the core message you would deliver?' },
  { id: 'ref-5', deckId: 'reflection', text: 'Talk about a failure that felt crushing at the time, but ended up being exactly what you needed.' },
  { id: 'ref-6', deckId: 'reflection', text: 'How do you personally distinguish between being productive and just being busy?' },
  { id: 'ref-7', deckId: 'reflection', text: 'Describe a time when you realized you were holding a grudge, and how you let it go.' },
  { id: 'ref-8', deckId: 'reflection', text: 'What is a belief you hold strongly that most people disagree with?' },
  { id: 'ref-9', deckId: 'reflection', text: 'How do you handle the feeling of being overwhelmed when life throws too much at you?' },
  { id: 'ref-10', deckId: 'reflection', text: 'What is a personal flaw you’ve learned to accept, and how do you work around it?' },
  
  // Stories
  { id: 'st-1', deckId: 'stories', text: 'Tell the story of the most chaotic travel experience you’ve ever had.' },
  { id: 'st-2', deckId: 'stories', text: 'Describe a moment when you laughed harder than you ever have before.' },
  { id: 'st-3', deckId: 'stories', text: 'Tell the story of how you met your closest friend.' },
  { id: 'st-4', deckId: 'stories', text: 'Recount a time you were completely lost, either literally or figuratively.' },
  { id: 'st-5', deckId: 'stories', text: 'Tell a story about a time you took a big risk and it completely backfired.' },
  { id: 'st-6', deckId: 'stories', text: 'Describe an encounter with a complete stranger that you still think about.' },
  { id: 'st-7', deckId: 'stories', text: 'Tell a story about a childhood misunderstanding that makes you smile now.' },
  { id: 'st-8', deckId: 'stories', text: 'Recount the story of the best meal you’ve ever eaten.' },
  { id: 'st-9', deckId: 'stories', text: 'Tell a story about a time you had to confront a deep fear.' },
  { id: 'st-10', deckId: 'stories', text: 'Describe a moment in your life that felt like it was straight out of a movie.' },

  // Life (Mix of light & deep)
  { id: 'lf-1', deckId: 'life', text: 'If you had to live in a different country for a year, where would you go and why?' },
  { id: 'lf-2', deckId: 'life', text: 'What does an ideal Sunday morning look like for you?' },
  { id: 'lf-3', deckId: 'life', text: 'How has the way you spend your free time changed over the last five years?' },
  { id: 'lf-4', deckId: 'life', text: 'What is a daily habit you’ve picked up that drastically improved your quality of life?' },
  { id: 'lf-5', deckId: 'life', text: 'Discuss the concept of home. Is it a place, a feeling, or people?' },
  { id: 'lf-6', deckId: 'life', text: 'How do you balance the desire to save for the future with the desire to enjoy the present?' },
  { id: 'lf-7', deckId: 'life', text: 'What is a simple pleasure that you think people don’t appreciate enough?' },
  { id: 'lf-8', deckId: 'life', text: 'Describe your relationship with technology. Are you controlling it, or is it controlling you?' },
  { id: 'lf-9', deckId: 'life', text: 'How do you deal with the pressure of social expectations in your daily life?' },
  { id: 'lf-10', deckId: 'life', text: 'If you could eliminate one mundane chore from your life forever, what would it be?' },

  // Philosophy (Kept complex)
  { id: 'ph-1', deckId: 'philosophy', text: 'Do you believe human nature is fundamentally self-interested, or fundamentally cooperative?' },
  { id: 'ph-2', deckId: 'philosophy', text: 'If total determinism is true, how do we justify the concept of moral responsibility?' },
  { id: 'ph-3', deckId: 'philosophy', text: 'What constitutes a meaningful life in a universe that appears inherently indifferent?' },
  { id: 'ph-4', deckId: 'philosophy', text: 'Should absolute freedom of speech include the right to spread harmful misinformation?' },
  { id: 'ph-5', deckId: 'philosophy', text: 'How do we define consciousness, and at what point might artificial intelligence possess it?' },
  { id: 'ph-6', deckId: 'philosophy', text: 'Is morality objective, or is it merely a cultural construct that evolves over time?' },
  { id: 'ph-7', deckId: 'philosophy', text: 'If you could plug into a machine that simulated a perfect reality, would you choose to do it?' },
  { id: 'ph-8', deckId: 'philosophy', text: 'What is the ethical threshold for sacrificing the few to save the many?' },

  // Spirituality
  { id: 'sp-1', deckId: 'spirituality', text: 'How do you find moments of stillness and peace in a loud, chaotic world?' },
  { id: 'sp-2', deckId: 'spirituality', text: 'What role does gratitude play in your overall sense of well-being?' },
  { id: 'sp-3', deckId: 'spirituality', text: 'Do you believe everything happens for a reason, or do we create our own meaning from random events?' },
  { id: 'sp-4', deckId: 'spirituality', text: 'How has your understanding of the soul or the human spirit evolved as you’ve grown older?' },
  { id: 'sp-5', deckId: 'spirituality', text: 'Describe a moment in nature where you felt a profound sense of connection to something larger than yourself.' },
  { id: 'sp-6', deckId: 'spirituality', text: 'How do you navigate the balance between ego and humility?' },
  { id: 'sp-7', deckId: 'spirituality', text: 'What does forgiveness mean to you in a spiritual sense? Is it for them, or for you?' },

  // Imagination
  { id: 'im-1', deckId: 'imagination', text: 'If you could invent a new primary color, what would it look like and what feelings would it evoke?' },
  { id: 'im-2', deckId: 'imagination', text: 'Imagine you wake up and animals can suddenly speak English. What is the first conversation you have?' },
  { id: 'im-3', deckId: 'imagination', text: 'Pitch a concept for a restaurant where the gimmick is entirely based around time travel.' },
  { id: 'im-4', deckId: 'imagination', text: 'If you were tasked with designing a new human sense to replace smell, how would it work?' },
  { id: 'im-5', deckId: 'imagination', text: 'Describe a typical day in a futuristic city built entirely underwater.' },
  { id: 'im-6', deckId: 'imagination', text: 'If clouds were solid objects you could harvest, what would we use them for?' },
  { id: 'im-7', deckId: 'imagination', text: 'Invent a new national holiday. What does it celebrate and how do people observe it?' },

  // Fun
  { id: 'fn-1', deckId: 'fun', text: 'What is the most ridiculous thing you’ve ever convinced someone was true?' },
  { id: 'fn-2', deckId: 'fun', text: 'If you had to eat one meal for the rest of your life, but it had to be a fast food combo, what are you choosing?' },
  { id: 'fn-3', deckId: 'fun', text: 'Debate: Is a hotdog a sandwich? Lay out your most passionate argument.' },
  { id: 'fn-4', deckId: 'fun', text: 'If you were a pro wrestler, what would your entrance music and gimmick be?' },
  { id: 'fn-5', deckId: 'fun', text: 'What is an extremely common, everyday task that you are embarrassingly bad at?' },
  { id: 'fn-6', deckId: 'fun', text: 'If you could instantly become a world-class expert in an incredibly obscure hobby, what would it be?' },
  { id: 'fn-7', deckId: 'fun', text: 'Describe the worst haircut you’ve ever had and the aftermath.' },

  // Relationships
  { id: 'rl-1', deckId: 'relationships', text: 'How do you navigate a conversation with a friend when you strongly disagree with their life choices?' },
  { id: 'rl-2', deckId: 'relationships', text: 'What is the most important boundary you have learned to set in your personal relationships?' },
  { id: 'rl-3', deckId: 'relationships', text: 'Describe the qualities you value most in a mentor or role model.' },
  { id: 'rl-4', deckId: 'relationships', text: 'How do you rebuild trust with someone after it has been broken?' },
  { id: 'rl-5', deckId: 'relationships', text: 'What is a small, everyday gesture that makes you feel deeply appreciated?' },
  { id: 'rl-6', deckId: 'relationships', text: 'How do you handle a situation where two of your close friends are in a conflict?' },
  { id: 'rl-7', deckId: 'relationships', text: 'What is the hardest part about outgrowing a friendship?' },

  // Career
  { id: 'cr-1', deckId: 'career', text: 'Tell me about a time you had to lead a project when you had no official authority over the team.' },
  { id: 'cr-2', deckId: 'career', text: 'How do you handle receiving critical feedback that you believe is completely unjustified?' },
  { id: 'cr-3', deckId: 'career', text: 'Describe a moment in your career when you experienced imposter syndrome and how you overcame it.' },
  { id: 'cr-4', deckId: 'career', text: 'What is your strategy for saying no to your boss when you are at maximum capacity?' },
  { id: 'cr-5', deckId: 'career', text: 'Tell me about a time you made a significant mistake at work. How did you own it and fix it?' },
  { id: 'cr-6', deckId: 'career', text: 'How do you motivate a team member who is clearly burned out and disengaged?' },
  { id: 'cr-7', deckId: 'career', text: 'Describe your ideal company culture. What behaviors are rewarded, and what is not tolerated?' },

  // Medicine
  { id: 'md-1', deckId: 'medicine', text: 'Explain the purpose of a lumbar puncture to a nervous teenager.' },
  { id: 'md-2', deckId: 'medicine', text: 'How do you break bad news to a patient’s family while maintaining empathy and professionalism?' },
  { id: 'md-3', deckId: 'medicine', text: 'Explain the mechanism of action of SSRIs to a patient who is skeptical about taking psychiatric medication.' },
  { id: 'md-4', deckId: 'medicine', text: 'A patient demands antibiotics for a viral cold. How do you respectfully decline while educating them?' },
  { id: 'md-5', deckId: 'medicine', text: 'Describe the pathophysiology of Type 2 Diabetes to a newly diagnosed patient without using medical jargon.' },
  { id: 'md-6', deckId: 'medicine', text: 'How do you manage a situation where a patient refuses a life-saving blood transfusion due to religious beliefs?' },
  { id: 'md-7', deckId: 'medicine', text: 'Explain the risks and benefits of an epidural during labor to an expecting mother.' },

  // Dentistry
  { id: 'dn-1', deckId: 'dentistry', text: 'Explain to a highly anxious patient why they need a root canal instead of just pulling the tooth.' },
  { id: 'dn-2', deckId: 'dentistry', text: 'How do you explain the link between periodontal disease and systemic health to an elderly patient?' },
  { id: 'dn-3', deckId: 'dentistry', text: 'A parent asks why their 4-year-old needs a filling on a baby tooth that will fall out anyway. How do you respond?' },
  { id: 'dn-4', deckId: 'dentistry', text: 'Explain the step-by-step process of getting a dental implant to a patient who hates needles.' },
  { id: 'dn-5', deckId: 'dentistry', text: 'How do you address a patient who relies entirely on TikTok trends for their oral hygiene routine?' },
  { id: 'dn-6', deckId: 'dentistry', text: 'Explain the difference between a veneer and a crown to a patient looking for cosmetic improvements.' },
  { id: 'dn-7', deckId: 'dentistry', text: 'How do you manage a situation where a patient is dissatisfied with the shade of their new anterior crown?' },
  
  // Surprise
  { id: 'su-1', deckId: 'surprise', text: 'If you had to give a 5-minute TED talk right now with zero preparation, what would the topic be?' },
  { id: 'su-2', deckId: 'surprise', text: 'What is the most niche piece of trivia you know, and why do you know it?' },
  { id: 'su-3', deckId: 'surprise', text: 'Explain the plot of your favorite movie as poorly and confusingly as possible.' },
  { id: 'su-4', deckId: 'surprise', text: 'If you were the dictator of a small island nation, what is the first wildly specific law you would enact?' }
];

const fileContent = // @ts-nocheck
import { Deck, Prompt } from './types';

export const DECKS: Deck[] = ;

export const PROMPTS: Prompt[] = ;
;

fs.writeFileSync('lib/data.ts', fileContent, 'utf-8');
console.log('Successfully wrote data.ts');

