import { notFound } from 'next/navigation';
import SeoPageLayout, { SeoPageData } from '../components/SeoPageLayout';

const PAGES: Record<string, SeoPageData> = {
  'ghunnah': {
    slug: 'ghunnah',
    title: 'Fix Ghunnah Mistakes Fast (With AI Recitation Checker) | QariAI',
    h1: 'Fix Ghunnah Mistakes Fast — AI Recitation Checker',
    description: 'Check your ghunnah pronunciation instantly with AI. Record your recitation and get real-time feedback on nasal sounds. Free Tajweed checker.',
    intro: 'Ghunnah (غُنَّة) is one of the most commonly missed rules in Tajweed. Many reciters shorten the nasal sound or apply it to the wrong letters. Recite any verse below — the AI will detect ghunnah errors in seconds.',
    whatIsIt: 'Ghunnah is the nasal resonance produced from the nose when pronouncing certain letters — primarily Noon (ن) and Meem (م) with shaddah, or when they appear in specific combinations. It should last approximately 2 counts (harakat).',
    commonMistakes: [
      'Ghunnah too short — cutting the nasal sound before 2 full beats',
      'Missing ghunnah on Noon or Meem with shaddah entirely',
      'Applying ghunnah to letters that don\'t require it',
      'Weak nasal resonance — sound comes from throat, not nose',
    ],
    rule: 'ghunnah',
  },
  'qalqalah': {
    slug: 'qalqalah',
    title: 'Fix Qalqalah Pronunciation Online (AI Checker) | QariAI',
    h1: 'Fix Qalqalah Pronunciation — AI Recitation Checker',
    description: 'Practice qalqalah letters with instant AI feedback. Check your recitation of ق ط ب ج د online free. No account needed.',
    intro: 'Qalqalah (قلقلة) is the echoing bounce produced on five specific letters when they appear with sukoon. It\'s easy to miss — and even easier to apply incorrectly. Test your recitation below.',
    whatIsIt: 'Qalqalah applies to five letters: ق ط ب ج د. When any of these letters has a sukoon (no vowel), it produces a distinctive echoing sound. The intensity varies — light qalqalah in the middle of a word, stronger at the end.',
    commonMistakes: [
      'No bounce on qalqalah letters at the end of a verse',
      'Bounce too strong mid-word (should be subtle)',
      'Missing qalqalah on ج or ب entirely',
      'Adding qalqalah to letters that don\'t require it',
    ],
    rule: 'qalqalah',
  },
  'madd-rules': {
    slug: 'madd-rules',
    title: 'Check Madd Elongation Mistakes Online | QariAI Tajweed Checker',
    h1: 'Check Your Madd Elongation — AI Tajweed Feedback',
    description: 'Instantly check madd rules in your Quran recitation. AI detects short, long, and obligatory madd errors. Free online Tajweed checker.',
    intro: 'Madd (مَدّ) — the elongation of vowels — has multiple types, each with a specific required length. Getting madd wrong is one of the most common Tajweed mistakes. Recite below and the AI will measure your elongations.',
    whatIsIt: 'Madd refers to lengthening the sound of a vowel. Types include: Natural Madd (2 counts), Permissible Madd (2–6 counts), Obligatory Madd (4–5 counts), and Necessary Madd (6 counts). The rules depend on what follows or precedes the madd letter.',
    commonMistakes: [
      'Natural madd too long — extending beyond 2 counts',
      'Obligatory madd too short — not reaching 4–5 counts',
      'Missing madd before hamza or sukoon entirely',
      'Inconsistent madd length within the same verse',
    ],
    rule: 'madda_obligatory',
  },
  'noon-sakinah': {
    slug: 'noon-sakinah',
    title: 'Noon Sakinah Rules — Check Your Tajweed Online | QariAI',
    h1: 'Check Noon Sakinah & Tanween Mistakes — AI Checker',
    description: 'Practice noon sakinah and tanween rules with instant AI feedback. Detect ikhfa, idghaam, iqlab and izhar errors in your recitation. Free.',
    intro: 'Noon sakinah (نْ) and tanween have four distinct rules depending on the following letter. Confusing them is extremely common, even among experienced reciters. Record your recitation and the AI will identify exactly which rule was misapplied.',
    whatIsIt: 'When noon sakinah or tanween appears before another letter, four rules apply: Izhar (clear pronunciation before throat letters), Idghaam (merging — with or without ghunnah), Iqlab (converting to meem before ب), and Ikhfa (hidden nasalisation before 15 letters).',
    commonMistakes: [
      'Missing idghaam — pronouncing noon clearly when it should merge',
      'Applying ikhfa when izhar is required (before throat letters)',
      'Forgetting iqlab — not converting noon to meem before ب',
      'Ghunnah missing during ikhfa',
    ],
    rule: 'ikhfa',
  },
  'meem-sakinah': {
    slug: 'meem-sakinah',
    title: 'Meem Sakinah Rules — AI Tajweed Checker | QariAI',
    h1: 'Check Meem Sakinah Mistakes — AI Recitation Checker',
    description: 'Check meem sakinah rules in your Quran recitation online. Detect ikhfa shafawi, idghaam shafawi, and izhar shafawi errors. Free.',
    intro: 'Meem sakinah (مْ) has three rules based on the following letter. The most commonly missed is Ikhfa Shafawi — hiding the meem before ب. Recite below to test your application of all three rules.',
    whatIsIt: 'When meem sakinah appears: before ب → Ikhfa Shafawi (hidden with ghunnah); before another meem → Idghaam Shafawi (merging with ghunnah); before all other letters → Izhar Shafawi (clear pronunciation).',
    commonMistakes: [
      'Pronouncing meem clearly before ب (missing ikhfa shafawi)',
      'Weak or absent ghunnah during ikhfa shafawi',
      'Missing the merge during idghaam shafawi',
    ],
    rule: 'ikhfa_shafawi',
  },
  'tajweed-for-beginners': {
    slug: 'tajweed-for-beginners',
    title: 'Tajweed for Beginners — Learn & Check with AI | QariAI',
    h1: 'Tajweed for Beginners — Learn the Rules, Check Your Recitation',
    description: 'Learn Tajweed step by step. Practice and check your recitation with AI feedback. The easiest way to start learning Tajweed rules. Free.',
    intro: 'Tajweed is the set of rules governing the correct pronunciation of the Quran. As a beginner, the best way to learn is to recite and get immediate feedback. Try it below — the AI will explain what you got right and what to focus on next.',
    whatIsIt: 'Tajweed covers pronunciation of letters (Makharij), characteristics of sounds (Sifaat), rules for nun and meem sakinah, elongation (Madd), and rules for stopping and starting. Beginners should focus on: correct letter pronunciation, basic madd rules, and ghunnah.',
    commonMistakes: [
      'Mispronouncing ق (qaf) as a k sound',
      'Confusing ع (ain) with alif',
      'Missing madd — shortening long vowels',
      'Not applying ghunnah on noon and meem with shaddah',
    ],
    rule: 'makhaarij',
  },
  'arabic-pronunciation': {
    slug: 'arabic-pronunciation',
    title: 'Arabic Pronunciation Checker — AI Feedback | QariAI',
    h1: 'Check Your Arabic Pronunciation with AI',
    description: 'Check how accurately you pronounce Arabic letters in Quran recitation. AI detects makhaarij (articulation point) errors instantly. Free online tool.',
    intro: 'Arabic has sounds that don\'t exist in any other language — and getting them right is essential for correct Quran recitation. The AI below analyses your articulation and flags letters pronounced from the wrong position.',
    whatIsIt: 'Each Arabic letter has a specific Makhraj (مخرج) — a precise articulation point in the mouth or throat where the sound originates. Mispronouncing even one letter can change the meaning of a word in the Quran.',
    commonMistakes: [
      'ح (ha) pronounced like the English h — should be deeper, from the throat',
      'ع (ain) replaced with alif — completely different articulation point',
      'ض (dad) mispronounced — unique to Arabic, no equivalent in other languages',
      'ق (qaf) pronounced as k — should come from the back of the throat',
    ],
    rule: 'makhaarij',
  },
  'tajweed-checker': {
    slug: 'tajweed-checker',
    title: 'Free AI Tajweed Checker Online — Instant Feedback | QariAI',
    h1: 'Free AI Tajweed Checker — Instant Recitation Feedback',
    description: 'Check your Tajweed online free with AI. Record your Quran recitation and get an instant score, mistake breakdown, and coaching. No account needed.',
    intro: 'The most accurate way to check your Tajweed is to recite and get real-time feedback. QariAI analyses your recitation against 24 Tajweed rules using Gemini AI — the same technology used by thousands of users in our mobile app.',
    whatIsIt: 'QariAI checks your recitation for all major Tajweed categories: Madd (elongation), Ghunnah (nasalisation), Qalqalah, rules of Noon and Meem Sakinah, letter articulation (Makharij), and characteristics of sounds (Sifaat).',
    commonMistakes: [
      'Shortening madd letters — the most common mistake across all levels',
      'Weak ghunnah on shaddah letters',
      'Missing qalqalah on ق ط ب ج د with sukoon',
      'Incorrect application of idghaam and ikhfa',
    ],
    rule: 'ghunnah',
  },
  'quran-pronunciation-checker': {
    slug: 'quran-pronunciation-checker',
    title: 'Quran Pronunciation Checker — AI Feedback | QariAI',
    h1: 'Check Your Quran Pronunciation Instantly with AI',
    description: 'Record your Quran recitation and check pronunciation accuracy with AI. Get instant feedback on every letter and Tajweed rule. Free online.',
    intro: 'Correct Quran pronunciation is a combination of accurate letter articulation (Makharij) and application of Tajweed rules. The AI below checks both simultaneously and gives you a score with specific corrections.',
    whatIsIt: 'Quran pronunciation accuracy depends on two things: pronouncing each Arabic letter from its correct articulation point, and applying the relevant Tajweed rule based on context. Even native Arabic speakers have Tajweed mistakes.',
    commonMistakes: [
      'Carrying pronunciation habits from your native language into Arabic',
      'Shortening long vowels (madd) to the same length as short vowels',
      'Missing nasal sounds (ghunnah) that aren\'t obvious in the written text',
      'Stopping at wrong places — breaking a word across a breath',
    ],
    rule: 'makhaarij',
  },
  'quran-recitation-mistakes': {
    slug: 'quran-recitation-mistakes',
    title: 'Common Quran Recitation Mistakes — Detect & Fix | QariAI',
    h1: 'Detect & Fix Common Quran Recitation Mistakes with AI',
    description: 'Discover and fix the most common Quran recitation and Tajweed mistakes. Use our free AI checker to detect errors in your recitation instantly.',
    intro: 'Every reciter — from beginner to advanced — has blind spots: mistakes they repeat without realising. The AI below analyses your recitation and surfaces the specific rules you\'re missing, so you can fix them deliberately.',
    whatIsIt: 'Research across thousands of recitations shows that 80% of Tajweed mistakes fall into five categories: madd length, ghunnah quality, qalqalah, noon/meem sakinah rules, and letter articulation. The AI checks all five in one pass.',
    commonMistakes: [
      'Madd too short — the most universal mistake regardless of level',
      'Ghunnah applied inconsistently — present sometimes, absent other times',
      'Qalqalah missing at end of verse — especially on ق and ط',
      'Idghaam applied where izhar is required',
      'Letters mispronounced due to native language influence',
    ],
    rule: 'ghunnah',
  },
};

export async function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function SeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <SeoPageLayout page={page} />;
}
