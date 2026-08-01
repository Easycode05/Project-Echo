import os
import random
import itertools

os.makedirs(r"C:\Users\USE\Desktop\Project-Echo\lib", exist_ok=True)

out_file = r"C:\Users\USE\Desktop\Project-Echo\lib\data.ts"

decks_str = """import { Deck, Prompt } from './types';

export const DECKS: Deck[] = [
  { id: 'reflection', name: 'Reflection', description: 'Practice speaking about personal experiences and opinions.', roomSubtitle: 'Develop confidence in articulating personal views and individual perspectives.', environmentMood: 'A quiet forest at dawn. Deep greens and focused atmosphere.', accentColor: '#1B2E1E', glowClass: 'from-emerald-950/80 via-emerald-900/30 to-transparent', cardBgClass: 'bg-[#121f15]', iconBgClass: 'bg-[#1B2E1E]', iconName: 'Trees' },
  { id: 'stories', name: 'Stories', description: 'Practice storytelling with clear structure and engaging delivery.', roomSubtitle: 'Structure engaging narratives with captivating pacing and vocal clarity.', environmentMood: 'An old library. Warm wood, aged paper, storytelling focus.', accentColor: '#3D2B1F', glowClass: 'from-amber-950/80 via-amber-900/30 to-transparent', cardBgClass: 'bg-[#261b14]', iconBgClass: 'bg-[#3D2B1F]', iconName: 'BookOpen' },
  { id: 'life', name: 'Life', description: 'Practice discussing everyday topics with confidence.', roomSubtitle: 'Build verbal fluency when discussing practical daily situations.', environmentMood: 'Slate blue horizons, gentle breeze, grounded focus.', accentColor: '#1E293B', glowClass: 'from-slate-900/80 via-slate-800/30 to-transparent', cardBgClass: 'bg-[#131b26]', iconBgClass: 'bg-[#1E293B]', iconName: 'Compass' },
  { id: 'philosophy', name: 'Philosophy', description: 'Practice organizing complex ideas into clear explanations and arguments.', roomSubtitle: 'Refine structured reasoning and express abstract concepts clearly.', environmentMood: 'Deep indigo accents, intellectual clarity, crisp acoustics.', accentColor: '#1E1B4B', glowClass: 'from-indigo-950/80 via-indigo-900/30 to-transparent', cardBgClass: 'bg-[#141233]', iconBgClass: 'bg-[#1E1B4B]', iconName: 'Sparkles' },
  { id: 'spirituality', name: 'Religion & Spirituality', description: 'Practice discussing beliefs and perspectives respectfully and thoughtfully.', roomSubtitle: 'Articulate deep values, core beliefs, and convictions with poise.', environmentMood: 'Respectful atmosphere, soft golden light, focused quiet.', accentColor: '#4A3E1B', glowClass: 'from-yellow-950/80 via-amber-900/30 to-transparent', cardBgClass: 'bg-[#29220e]', iconBgClass: 'bg-[#4A3E1B]', iconName: 'SunMedium' },
  { id: 'imagination', name: 'Imagination', description: 'Practice creative thinking and spontaneous speaking.', roomSubtitle: 'Unlock vocal agility and rapid creative improvisation.', environmentMood: 'Organic movement, vibrant purple-cyan aura, expansive creativity.', accentColor: '#2A1B4E', glowClass: 'from-purple-950/80 via-fuchsia-900/30 to-transparent', cardBgClass: 'bg-[#1a1131]', iconBgClass: 'bg-[#2A1B4E]', iconName: 'Palette' },
  { id: 'fun', name: 'Fun', description: 'Practice conversational fluency through lighthearted topics.', roomSubtitle: 'Build quick, engaging, and relaxed conversational flow.', environmentMood: 'Warm orange glow, spontaneous delight, dynamic energy.', accentColor: '#4A261B', glowClass: 'from-orange-950/80 via-orange-900/30 to-transparent', cardBgClass: 'bg-[#2b160f]', iconBgClass: 'bg-[#4A261B]', iconName: 'Smile' },
  { id: 'relationships', name: 'Relationships', description: 'Practice communicating about emotions and interpersonal situations.', roomSubtitle: 'Express interpersonal feelings and empathetic communication clearly.', environmentMood: 'Safe intimate space, natural soft lighting, empathetic clarity.', accentColor: '#451A22', glowClass: 'from-rose-950/80 via-rose-900/30 to-transparent', cardBgClass: 'bg-[#291014]', iconBgClass: 'bg-[#451A22]', iconName: 'Heart' },
  { id: 'career', name: 'Career', description: 'Practice professional communication, interviews, presentations, and leadership discussions.', roomSubtitle: 'Master executive presence, persuasive delivery, and professional interviews.', environmentMood: 'Emerald accents, elegant geometry, executive presence.', accentColor: '#064E3B', glowClass: 'from-emerald-950/80 via-teal-900/30 to-transparent', cardBgClass: 'bg-[#042e23]', iconBgClass: 'bg-[#064E3B]', iconName: 'Building2' },
  { id: 'medicine', name: 'Medicine & Dentistry', description: 'Practice explaining medical and dental concepts clearly to patients, students, and colleagues.', roomSubtitle: 'Explain complex health, clinical, and scientific topics with clarity and empathy.', environmentMood: 'Precision, trust, empathetic clarity, clinical focus.', accentColor: '#134E4A', glowClass: 'from-teal-950/80 via-cyan-900/30 to-transparent', cardBgClass: 'bg-[#0b2e2b]', iconBgClass: 'bg-[#134E4A]', iconName: 'Activity' },
  { id: 'surprise', name: 'Surprise', description: 'Practice speaking confidently on unexpected topics.', roomSubtitle: 'Test your spontaneous speaking skills on random topics.', environmentMood: 'Unpredictable challenges, instant verbal readiness.', accentColor: '#313030', glowClass: 'from-neutral-900/80 via-neutral-800/30 to-transparent', cardBgClass: 'bg-[#1f1f1f]', iconBgClass: 'bg-[#313030]', iconName: 'Shuffle' },
];

export const PROMPTS: Prompt[] = [
"""

topics = {
    "reflection": {
        "templates": [
            "Describe a time when you {action}.",
            "How has your perspective on {concept} changed over the last {timeframe}?",
            "What does {concept} mean to you, and how has that definition evolved?",
            "Reflect on the impact of {influence} in shaping who you are today.",
            "If you could go back and change one {event} from your past, what would it be and why?",
            "When did you realize that {concept} was going to be a major part of your life?"
        ],
        "vars": {
            "action": ["changed your mind about something important", "had to overcome a major fear", "learned a difficult lesson", "felt truly proud of yourself", "realized you were wrong about a fundamental belief", "discovered a new passion", "had to make a life-altering choice", "forgave someone who wronged you", "took a stand for something you believed in", "experienced a profound moment of clarity"],
            "concept": ["success", "happiness", "freedom", "responsibility", "integrity", "failure", "wisdom", "courage", "vulnerability", "resilience", "patience", "ambition", "creativity", "trust", "authenticity"],
            "timeframe": ["five years", "decade", "few months", "year", "chapter of your life"],
            "influence": ["a mentor", "a failure", "a childhood experience", "a difficult conversation", "a book you read", "a significant relationship", "an unexpected setback", "a moment of isolation", "a major achievement", "a cultural shift"],
            "event": ["decision", "conversation", "habit", "assumption", "missed opportunity", "spontaneous choice"]
        }
    },
    "stories": {
        "templates": [
            "Tell a story about a time you {experience}.",
            "Narrate an experience where {situation}.",
            "Describe the moment when {realization} during a memorable trip.",
            "Share a time when you had to deal with {challenge} and how it unfolded.",
            "What happened when you unexpectedly {action}?"
        ],
        "vars": {
            "experience": ["got completely lost in a new city", "met someone who changed your life", "found something valuable that wasn't yours", "experienced a bizarre coincidence", "had a misunderstanding that turned out to be hilarious", "took a massive risk and it paid off", "failed spectacularly at something simple"],
            "situation": ["you had to quickly adapt to a chaotic situation", "a stranger showed you unexpected kindness", "everything went wrong during a trip", "you had a seemingly supernatural or unexplained encounter", "you won a competition or achieved a goal against all odds"],
            "realization": ["you realized you were out of your depth", "everything suddenly made sense", "you had to change your plans entirely", "you discovered a hidden talent"],
            "challenge": ["a difficult personality", "a sudden loss of resources", "a mechanical failure", "a profound miscommunication", "a test of endurance"],
            "action": ["ran into an old friend far from home", "volunteered for a daunting task", "found yourself in the middle of a major event", "had to speak in front of a large crowd unprepared"]
        }
    },
    "life": {
        "templates": [
            "What is your perspective on {topic}?",
            "How do you handle {challenge} in your daily routine?",
            "Discuss the importance of {concept} for modern adults.",
            "Why is {habit} so difficult to maintain, and how can we improve it?",
            "How has technology changed the way we approach {activity}?"
        ],
        "vars": {
            "topic": ["work-life balance", "social media usage", "the importance of hobbies", "maintaining friendships as an adult", "the value of traveling", "managing personal finances", "healthy eating habits", "morning routines", "the gig economy"],
            "challenge": ["daily stress", "conflict with neighbors or acquaintances", "unexpected changes to your schedule", "the pressure to constantly be productive", "information overload in the digital age", "maintaining a tidy living space", "setting boundaries with technology"],
            "concept": ["financial literacy", "emotional intelligence", "continuous learning", "community engagement", "mindful consumption"],
            "habit": ["waking up early", "regular exercise", "reading daily", "disconnecting from screens", "meal prepping"],
            "activity": ["dating", "learning new skills", "staying informed", "relaxing", "communicating with family"]
        }
    },
    "philosophy": {
        "templates": [
            "Argue for or against the idea that {premise}.",
            "How would you define {concept}, and what are its implications for modern society?",
            "What is the philosophical significance of {phenomenon}?",
            "If {assumption} is true, how does that change our moral obligations?",
            "Discuss the balance between {value1} and {value2} in a just society."
        ],
        "vars": {
            "premise": ["humans have free will", "morality is objective", "artificial intelligence can ever possess consciousness", "truth is relative to the observer", "society is progressing towards a better future", "suffering is necessary for personal growth"],
            "concept": ["justice", "the good life", "existential dread", "human nature", "the social contract", "the line between art and not-art"],
            "phenomenon": ["technological advancement", "globalization", "individualism", "collective memory", "the pursuit of happiness"],
            "assumption": ["determinism", "utilitarianism", "nihilism", "altruism", "solipsism"],
            "value1": ["freedom", "equality", "security", "tradition", "innovation"],
            "value2": ["security", "equity", "privacy", "progress", "stability"]
        }
    },
    "spirituality": {
        "templates": [
            "Discuss the role of {concept} in a person's spiritual or religious journey.",
            "How do different belief systems approach the concept of {phenomenon}?",
            "What does {value} mean to you in a secular vs. spiritual context?",
            "Explore the connection between {practice} and mental well-being.",
            "How can we find a sense of {state} in a chaotic world?"
        ],
        "vars": {
            "concept": ["faith", "ritual", "community", "meditation", "forgiveness", "gratitude", "doubt", "reverence", "sacrifice"],
            "phenomenon": ["the afterlife", "suffering", "the divine", "inner peace", "moral obligation", "creation", "destiny"],
            "value": ["compassion", "humility", "wisdom", "grace", "redemption"],
            "practice": ["prayer", "mindfulness", "fasting", "pilgrimage", "chanting"],
            "state": ["purpose", "tranquility", "belonging", "transcendence", "harmony"]
        }
    },
    "imagination": {
        "templates": [
            "Imagine you wake up and discover you can {ability}. How do you spend your first week?",
            "If you were tasked with designing a new {invention}, what would it look like and how would it function?",
            "Describe a world where {scenario}.",
            "What would happen if {event} occurred tomorrow?",
            "Invent a new {category} and explain its rules or characteristics."
        ],
        "vars": {
            "ability": ["speak every language fluently", "read people's thoughts", "time travel, but only to the past", "breathe underwater", "teleport anywhere in the world", "control the weather", "communicate with animals"],
            "invention": ["planet", "system of government", "holiday", "primary color", "sport", "musical instrument", "mode of transportation"],
            "scenario": ["gravity fluctuates based on emotion", "dreams are broadcast on television", "people stop aging at 25", "plants can physically defend themselves", "music is a visible phenomenon"],
            "event": ["the internet permanently vanished", "aliens made peaceful contact", "dinosaurs reappeared in major cities", "everyone forgot how to lie"],
            "category": ["Olympic sport", "genre of literature", "culinary tradition", "type of weather", "social media platform"]
        }
    },
    "fun": {
        "templates": [
            "If you could only eat {food} for the rest of your life, how would you prepare it differently each day?",
            "Defend the controversial opinion that {opinion}.",
            "Describe the plot of a terrible movie about {movie_plot}.",
            "What would be the absolute worst {item} to bring to a desert island?",
            "Explain the rules of a made-up game called {game}."
        ],
        "vars": {
            "food": ["pizza", "tacos", "sushi", "pasta", "sandwiches", "ice cream", "potatoes"],
            "opinion": ["pineapple belongs on pizza", "hot dogs are sandwiches", "cats are better than dogs", "winter is the best season", "socks should be worn with sandals", "cereal is a type of soup", "Die Hard is a Christmas movie"],
            "movie_plot": ["a rogue toaster", "a detective who is allergic to clues", "a superhero whose only power is making people slightly uncomfortable", "a time traveler stuck in a grocery store", "a haunted pair of pants", "an overly aggressive houseplant"],
            "item": ["kitchen appliance", "piece of furniture", "board game", "type of footwear", "musical instrument"],
            "game": ["Flonkerton", "Extreme Sitting", "Competitive Whispering", "Blindfolded Tag", "Speed Loafing"]
        }
    },
    "relationships": {
        "templates": [
            "How do you navigate {challenge} in a close relationship?",
            "What is the most important quality in a {person} and why do you believe that is the case?",
            "Discuss a time when you had to {action} to preserve a relationship.",
            "How do you balance {value1} and {value2} when interacting with loved ones?",
            "What role does {concept} play in building strong connections with others?"
        ],
        "vars": {
            "challenge": ["setting healthy boundaries", "communication breakdowns", "differences in core values", "long-distance dynamics", "resolving past conflicts", "supporting a partner through a tough time", "financial disagreements"],
            "person": ["friend", "romantic partner", "coworker", "mentor", "roommate", "sibling", "parent"],
            "action": ["compromise on a deeply held belief", "apologize when you didn't feel entirely wrong", "step away for a period of time", "have a difficult and honest conversation", "forgive a major betrayal"],
            "value1": ["honesty", "independence", "loyalty", "ambition", "spontaneity"],
            "value2": ["tact", "togetherness", "flexibility", "contentment", "routine"],
            "concept": ["vulnerability", "active listening", "shared humor", "mutual respect", "empathy"]
        }
    },
    "career": {
        "templates": [
            "Describe your approach to {challenge}.",
            "What are the ethical implications of {issue} in the modern workplace?",
            "How do you build a culture of {value} within a team?",
            "Discuss a time you had to pivot your strategy regarding {task}.",
            "What is the most undervalued skill in {field} and why?"
        ],
        "vars": {
            "challenge": ["handling constructive criticism", "managing a difficult team member", "negotiating a salary", "leading a project under a tight deadline", "transitioning to a new industry", "balancing ambition with well-being", "building professional networks", "presenting complex information to executives"],
            "issue": ["automation", "corporate lobbying", "data collection by tech companies", "unpaid internships", "the gig economy", "using AI for creative work", "outsourcing labor", "workplace surveillance"],
            "value": ["innovation", "accountability", "psychological safety", "diversity", "resilience"],
            "task": ["a major presentation", "a critical project launch", "client negotiations", "conflict resolution", "budget management"],
            "field": ["leadership", "management", "entrepreneurship", "remote work", "professional development"]
        }
    },
    "medicine": {
        "templates": [
            "Explain the importance of {topic} to a non-medical audience.",
            "How would you address a patient's concerns regarding {concern} with empathy and clarity?",
            "Discuss the impact of {trend} on the future of healthcare.",
            "What are the ethical considerations surrounding {issue} in clinical practice?",
            "Describe the optimal approach to {practice} in a fast-paced environment."
        ],
        "vars": {
            "topic": ["preventative care", "vaccinations", "flossing daily", "mental health awareness", "maintaining a balanced diet", "regular health screenings", "sleep hygiene", "understanding family medical history", "patient-centered communication", "interdisciplinary collaboration in healthcare"],
            "concern": ["a complex surgical procedure", "a chronic illness diagnosis", "the side effects of a medication", "dental anxiety", "lifestyle changes required for recovery", "alternative medicine approaches", "navigating the healthcare system", "end-of-life care options"],
            "trend": ["telemedicine", "artificial intelligence in diagnostics", "personalized medicine", "wearable health technology", "global health initiatives"],
            "issue": ["patient privacy", "resource allocation", "informed consent", "medical error disclosure", "genetic testing"],
            "practice": ["triage", "delivering bad news", "patient education", "infection control", "clinical documentation"]
        }
    },
    "surprise": {
        "templates": [
            "Give a spontaneous 2-minute speech on {topic}.",
            "Why is {topic} secretly the most important thing in the world?",
            "Explain {topic} as if you were talking to a time traveler from the year 1800.",
            "What is the most fascinating aspect of {topic}?",
            "Connect {topic} to the meaning of life in 3 minutes."
        ],
        "vars": {
            "topic": ["the history of the fork", "the structural integrity of cardboard", "the social hierarchy of pigeons", "the psychology of waiting in line", "the mechanics of a zipper", "the cultural impact of bubble wrap", "the evolution of the umbrella", "the physics of skipping stones", "the aesthetic appeal of rust", "the complexities of choosing a grocery store checkout lane", "the art of cloud watching", "the aerodynamics of a paper airplane", "the philosophy of dust", "the geopolitical implications of cheese", "the emotional resonance of neon signs"]
        }
    }
}

# Add words for generating completely random unique sentences to avoid repetition
fallback_adjectives = ["unprecedented", "fascinating", "challenging", "unexpected", "profound", "controversial", "complex", "simple", "overlooked", "essential", "dynamic", "mysterious", "valuable", "difficult", "rewarding", "bizarre", "compelling", "inspiring", "terrifying", "mundane"]
fallback_nouns = ["phenomenon", "experience", "concept", "tradition", "innovation", "habit", "relationship", "decision", "perspective", "challenge", "opportunity", "strategy", "belief", "lesson", "memory", "paradigm", "dilemma", "discovery", "obstacle", "triumph"]
fallback_contexts = ["in today's society", "for personal growth", "in the workplace", "throughout history", "in daily life", "for future generations", "in a globalized world", "on a personal level", "in your own experience", "when facing adversity", "in a rapidly changing environment", "during a crisis", "in interpersonal dynamics", "for long-term success", "in the digital age"]
fallback_verbs = ["navigating", "understanding", "mastering", "overcoming", "embracing", "challenging", "redefining", "analyzing", "simplifying", "questioning"]

def generate_prompts(deck_id, prefix, count=500):
    gen_data = topics.get(deck_id, {"templates": ["Discuss {concept}."], "vars": {"concept": ["something"]}})
    templates = gen_data["templates"]
    vars_dict = gen_data["vars"]
    
    generated = set()
    attempts = 0
    
    while len(generated) < count and attempts < count * 50:
        attempts += 1
        
        # Strategy 1: Templates (high quality)
        if random.random() < 0.7:
            template = random.choice(templates)
            # Find which vars are in the template
            formatted_vars = {}
            for var_name, var_options in vars_dict.items():
                if f"{{{var_name}}}" in template:
                    formatted_vars[var_name] = random.choice(var_options)
            
            try:
                prompt = template.format(**formatted_vars)
            except KeyError:
                prompt = "Discuss " + random.choice(fallback_nouns) + "."
                
        # Strategy 2: Combinatorial Fallback (ensure uniqueness)
        else:
            adj = random.choice(fallback_adjectives)
            noun = random.choice(fallback_nouns)
            ctx = random.choice(fallback_contexts)
            verb = random.choice(fallback_verbs)
            
            starters = [
                f"Discuss a time you encountered an {adj} {noun} {ctx}.",
                f"Why is {verb} a {adj} {noun} so critical {ctx}?",
                f"How does a {adj} {noun} impact our decisions {ctx}?",
                f"Reflect on the most {adj} {noun} you've observed {ctx}.",
                f"What makes a {noun} truly {adj} {ctx}?",
                f"Explain the process of {verb} the {noun} {ctx}.",
                f"In what ways does an {adj} {noun} alter our worldview {ctx}?"
            ]
            prompt = random.choice(starters)
            
            # Fix grammar for a/an
            if " an " in prompt:
                for vowel in ["an a", "an e", "an i", "an o", "an u"]:
                    pass # an is correct
                # simplistic fix: just replace "an" if not followed by vowel sound
                word_after_an = prompt.split(" an ")[1].split(" ")[0].lower()
                if not word_after_an.startswith(tuple("aeiou")):
                    prompt = prompt.replace(" an " + word_after_an, " a " + word_after_an)
            if " a " in prompt:
                word_after_a = prompt.split(" a ")[1].split(" ")[0].lower()
                if word_after_a.startswith(tuple("aeiou")):
                    prompt = prompt.replace(" a " + word_after_a, " an " + word_after_a)
                    
        generated.add(prompt)
        
    # fallback if set wasn't large enough
    gen_list = list(generated)
    while len(gen_list) < count:
        suffix_id = len(gen_list) + 1
        gen_list.append(f"Explore the topic of {deck_id} in scenario {suffix_id}.")
        
    return gen_list[:count]

prefixes = {
    'reflection': 'ref',
    'stories': 'sto',
    'life': 'lif',
    'philosophy': 'phi',
    'spirituality': 'spi',
    'imagination': 'ima',
    'fun': 'fun',
    'relationships': 'rel',
    'career': 'car',
    'medicine': 'med',
    'surprise': 'sur' # Add surprise here
}

with open(out_file, "w", encoding="utf-8") as f:
    f.write(decks_str)
    
    for deck_id in [d for d in prefixes.keys() if d != 'surprise']:
        prefix = prefixes[deck_id]
        prompts = generate_prompts(deck_id, prefix, 500)
        for i, text in enumerate(prompts):
            idx = i + 1
            f.write(f"  {{ id: '{prefix}-{idx}', deckId: '{deck_id}', text: {repr(text)} }},\n")
            
    # Do surprise
    prompts = generate_prompts('surprise', 'sur', 500)
    for i, text in enumerate(prompts):
        idx = i + 1
        f.write(f"  {{ id: 'sur-{idx}', deckId: 'surprise', text: {repr(text)} }},\n")

    f.write("];\n")
