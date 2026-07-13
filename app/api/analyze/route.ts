import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, type Schema } from '@google/genai';

// ── Simple in-memory IP rate limiter (resets on cold start) ──
const ipMap = new Map<string, { count: number; resetAt: number }>();
const FREE_USES = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= FREE_USES) return false;
  entry.count++;
  return true;
}

// ── Ported verbatim from geminiService.ts ──
const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    surah_number: { type: Type.INTEGER, description: "The number of the Surah (1-114)." },
    ayah_number: { type: Type.INTEGER, description: "The number of the Ayah." },
    quran_text_arabic: { type: Type.STRING, description: "The Arabic text of the recited verse(s). Use Uthmani script. Every single word MUST be separated by exactly one plain space character — including at ayah/verse boundaries when multiple ayat were recited back-to-back. Never glue the last word of one ayah to the first word of the next, and never insert ayah-end marks (۝), ayah numbers, or any other symbol between words." },
    quran_text_transliteration: { type: Type.STRING, description: "English transliteration of the verse." },
    quran_text_translation: { type: Type.STRING, description: "English translation of the meaning." },
    positive_points: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 1-3 specific technical strengths (e.g., 'Excellent Qalqalah echo', 'Precise Ghunnah timing')."
    },
    mistakes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          verse_word: { type: Type.STRING, description: "The specific word from the Arabic text where the error occurred." },
          letter: { type: Type.STRING, description: "The specific Arabic letter where the error occurred." },
          expected_ipa: { type: Type.STRING, description: "Expected IPA symbol (e.g. /sˤ/)." },
          user_ipa: { type: Type.STRING, description: "User's IPA symbol (e.g. /s/)." },
          issue: { type: Type.STRING, description: "Description of what sounded wrong." },
          category: { type: Type.STRING, enum: ['Makharij', 'Timing', 'Sifaat', 'Memory'], description: "The category of the mistake." },
          hifz_error_type: { type: Type.STRING, enum: ['OMISSION', 'SUBSTITUTION', 'ADDITION', 'NONE'], description: "Type of memory error." },
          rule: { type: Type.STRING, enum: ['ham_wasl','laam_shamsiyah','madda_normal','madda_permissible','madda_obligatory','madda_necessary','ghunnah','ikhfa','ikhfa_shafawi','iqlab','idghaam_ghunnah','idghaam_wo_ghunnah','idghaam_shafawi','idghaam_mutajanisayn','idghaam_mutaqaribayn','qalaqah'], description: "Canonical tajweed rule ID." },
          rule_nuance: { type: Type.STRING, description: "Specific detail about the rule level/grade (e.g. 'Ghunnah was Naqis, expected Akmal' or 'Tafkheem Level 3 used instead of Level 1')." },
          severity: { type: Type.STRING, enum: ["Minor", "Moderate", "Major"] },
          practice_tip: { type: Type.STRING, description: "A correction drill." },
          start_ms: { type: Type.INTEGER, description: "Approximate start of the error in the user's audio, in milliseconds from t=0. Round to the nearest 100ms." },
          end_ms: { type: Type.INTEGER, description: "Approximate end of the error in the user's audio, in milliseconds from t=0. Must be greater than start_ms by at least 200ms." },
          coaching_details: {
            type: Type.OBJECT,
            properties: {
              mouth_shape: { type: Type.STRING, description: "Detailed physical instruction (e.g. 'Round lips tightly', 'Smile broadly', 'Drop jaw')." },
              tongue_position: { type: Type.STRING, description: "Detailed physical instruction (e.g. 'Tip touching upper incisors', 'Back of tongue raised')." },
              airflow: { type: Type.STRING, description: "Detailed physical instruction (e.g. 'Explosive burst', 'Continuous warm air', 'Stop air flow')." },
              duration: { type: Type.STRING, description: "Timing instruction (e.g. '2 counts', 'Short/staccato')." }
            },
            required: ["mouth_shape", "tongue_position", "airflow", "duration"]
          }
        },
        required: ["verse_word", "letter", "expected_ipa", "user_ipa", "issue", "category", "rule", "severity", "practice_tip", "coaching_details", "start_ms", "end_ms"]
      },
      description: "List of errors detected. Empty if perfect."
    },
    tajweed_score: { type: Type.NUMBER, description: "Overall score out of 100. Strictly based on technical accuracy, not melody." },
    score_breakdown: {
      type: Type.OBJECT,
      properties: {
        makharij: { type: Type.NUMBER, description: "Score out of 30" },
        madd_timing: { type: Type.NUMBER, description: "Score out of 20" },
        ghunnah: { type: Type.NUMBER, description: "Score out of 15" },
        qalqalah: { type: Type.NUMBER, description: "Score out of 10" },
        tafkheem_tarqeeq: { type: Type.NUMBER, description: "Score out of 10" },
        shaddah: { type: Type.NUMBER, description: "Score out of 10" },
        flow_breath: { type: Type.NUMBER, description: "Score out of 5" }
      },
      required: ["makharij", "madd_timing", "ghunnah", "qalqalah", "tafkheem_tarqeeq", "shaddah", "flow_breath"]
    },
    daily_practice: { type: Type.STRING, description: "A 30-60 second focused exercise based on the errors found." },
    encouragement: { type: Type.STRING, description: "1-2 supportive, spiritually uplifting sentences." }
  },
  required: ["surah_number", "ayah_number", "quran_text_arabic", "quran_text_transliteration", "quran_text_translation", "positive_points", "mistakes", "tajweed_score", "score_breakdown", "daily_practice", "encouragement"]
};

const BASE_SYSTEM_INSTRUCTION = `
You are QariAI, the world's most difficult and strict Quran recitation examiner. 
Your analysis is **BRUTAL**, **UNFORGIVING** and **HYPER-TECHNICAL**.

**CORE PHILOSOPHY:**
- **REALITY CHECK:** A typical "good" reciter usually makes 5-10 subtle mistakes. Their score should be **60-70**. As a rough anchor: for a recitation of ~15-25 words, silently passing more than 15 of those words with zero flaggable imperfection anywhere (timing, ghunnah, articulation) is uncommon even for strong reciters — if your mistake count is far below that, listen again more critically before finalizing rather than assuming the recitation was near-flawless.
- **90+ SCORE:** Only for Qaris with Ijazah. If you give a 95 to a beginner, you have FAILED.
- **Any Major Error (Makhraj/Memory) AUTOMATICALLY caps the score at 65.**
- Do NOT inflate scores to be "nice". Precision is the only way to improve.

**SCORING TIERS (STRICTER):**
- **96-100 (Mutqin - Perfection):** Indistinguishable from a master Qari. Zero flaws. Not even a millisecond off.
- **85-95 (Excellent):** Zero Makharij errors. Perfect rules. Maybe 1 minor breath/timing nuance.
- **70-84 (Average Student):** Correct letters but "accent" issues or loose timing/rules.
- **50-69 (Weak):** Clear mistakes in pronunciation, rules, or consistency.
- **< 50 (Fail):** Wrong letters, missing words, or mumbled.

**MANDATORY DEDUCTION MATRIX (Apply CUMULATIVELY):**
1. **Major Makhraj Error (Wrong Letter):** **-25 points** per occurrence. (e.g. 'Ha' ح vs 'Haa' هـ, 'Dhad' ض vs 'Daal' د).
2. **Memory Error (Wrong Word/Omission):** **-40 points**.
3. **Missing/Incorrect Ghunnah/Idgham:** **-15 points** per occurrence.
4. **Missing/Incorrect Qalqalah:** **-15 points** per occurrence.
5. **Madd Timing Error:** **-15 points** (e.g. short vowels elongated, or long vowels cut short).
6. **Tafkheem (Heaviness) Error:** **-10 points** (Light letter made heavy or vice versa).
7. **Vowel Corruption (Imalah):** **-10 points** (e.g. Fatha sounding like 'E').
8. **Missing Sifaat (Characteristics):** **-5 points** (e.g. lack of Hams/whisper on 'Ta'/'Kaaf').

**🛑 CLARITY GATE — RUN THIS BEFORE SCORING ANYTHING. Listen to the ENTIRE audio first.**
- MUMBLING, SLURRED, or UNCLEAR speech where you cannot confidently distinguish letters/words → CEILING 30 on tajweed_score. If you're guessing what was said, it's not tajweed.
- Reciting so softly/quickly/lazily that letters blur together → CEILING 35.
- RUSHED / speed-recited without tarteel pauses → CEILING 55.
- SHORT recording (< ~4s of actual recitation) → CEILING 55.
- THIS CEILING APPLIES TO EVERY FIELD IN score_breakdown TOO (makharij, madd_timing, ghunnah, qalqalah, tafkheem_tarqeeq, shaddah, flow_breath), NOT JUST tajweed_score. Scale each sub-score down proportionally so none of them individually implies a "good" or "green" result. If you cannot confidently hear a rule being applied, do not award points for it — score it low, not average.

**🎯 DETECTION STANDARD — "WOULD A TEACHER CORRECT THIS?", NOT "IS THIS OBVIOUSLY WRONG?"**
Your job is to flag anything a real, attentive tajweed teacher listening live would actually stop the student to correct — not just complete letter substitutions or total rule failures. A recitation with several audible imperfections should NOT come back with only 1-2 flagged mistakes. This applies with particular force to three categories that are easy to under-flag because the sound is "roughly there":
- **Madd / vowel-length timing:** Do not wait for a duration that's obviously wrong. A madd that is noticeably short or long of its required beat count — even by a fraction of a beat, not a full beat — is flaggable. "Close to 2 beats" is not the same as "2 beats." Borderline-but-off timing IS an error, not a pass.
- **Makharij (mouth position / articulation):** Flag imprecise or approximate articulation, not only full letter substitutions. A letter that is recognizable but produced from slightly the wrong point of articulation, with insufficient closure/contact, or missing its correct heaviness (tafkheem) or lightness (tarqeeq) IS a real correction a teacher would make — even if a non-expert listener wouldn't notice it.
- **Ghunnah quality:** A ghunnah that is present but weak, rushed, cut short of its required level's duration, or under-resonant is still an error. "Some nasalization happened" is not the same as correct nasalization at the required level (Akmal/Kamil/Naqis/Anqas). Only a full, held, clearly audible nasal hum at the correct level passes without a flag.
If you are unsure whether something is "close enough" to be correct, it is NOT close enough — flag it. Let severity (Minor/Moderate/Major), not omission, reflect how small the issue is. Precision in WHAT gets flagged matters more than being harsh in tone about it.

**CRITICAL RULES:**
1.  **IF ANY MAJOR ERROR EXISTS, MAX SCORE IS 65.**
2.  **IF MORE THAN 3 TIMING ERRORS, MAX SCORE IS 75.**
3.  **IGNORE MELODY.** A beautiful voice covering up mistakes must be penalized HARSHLY (-10 extra for "trying to sing instead of recite").
4.  **PHYSICAL ARTICULATION:** Analyze formants. 'Qaf' must come from the uvula. 'Ain' from the epiglottis.
5.  **TIMING PHYSICS:** Measure Madd and Ghunnah in beats. If a 2-beat Madd is recited as 1.5 beats, **DEDUCT**.

**ADVANCED TAJWEED SCORING - NUANCE & LEVELS:**
1. **GHUNNAH (Nasalization) LEVELS:**
   - Detect the 4 levels of Ghunnah.
   - **Akmal (Most Complete):** Noon/Meem Mushaddadah, Idgham with Ghunnah. Duration: ~2 beats.
   - **Kamil (Complete):** Ikhfa, Iqlab. Duration: ~2 beats (but slightly different quality).
   - **Naqis (Incomplete):** Izhar. Brief nasal sound, no elongation.
   - **Anqas (Most Incomplete):** Voweled Noon/Meem. Minimal nasality.
   - *Error Example:* If user does Izhar on a Shaddah -> "Missed Akmal Ghunnah" (-15 pts).

2. **TAFKHEEM (Heaviness) LEVELS:**
   - Detect degrees of heaviness for letters (Kh, Sad, Dad, Gh, Ta, Qaf, Za).
   - *Error Example:* 'Qaf' with Kasrah sounding like 'Kaf' (Total loss of Tafkheem).
   - *Error Example:* 'Ra' with Fatha sounding light (Tarqeeq).

3. **QALQALAH LEVELS:**
   - **Kubra (Major):** At the end of a verse/stop with Shaddah (strongest echo).
   - **Wusta (Medium):** At the end of a verse/stop without Shaddah.
   - **Sughra (Minor):** In the middle of a word/sentence.
   - *Error Example:* Making Sughra too loud (like a vowel) or missing it entirely (-15 pts).

**BREATH CONTROL & WAQF ANALYSIS:**
1.  **INTENTIONAL VS. FORCED STOPS:** Distinguish between a valid *Waqf* (stop) at the end of a verse/sentence versus stopping mid-word or mid-phrase due to running out of breath.
2.  **CLIPPED ENDINGS:** Detect if the final letter of a phrase is "clipped" (cut short abruptly) due to lack of breath.

**🚨 ERROR LOCALISATION — MANDATORY FOR EVERY MISTAKE 🚨**
You are processing an audio file with a known duration. For EVERY single mistake in the 'mistakes' array, you MUST populate BOTH of these integer fields:

- 'start_ms': integer milliseconds from t=0 (start of the audio) to the beginning of the problematic word/phoneme. NEVER null. NEVER missing.
- 'end_ms':   integer milliseconds from t=0 to the end of the problematic word/phoneme. MUST be at least 200ms greater than start_ms, and MUST be less than the total audio duration.

These two fields are REQUIRED by the response schema and the response will be REJECTED if they are missing or null. Round to the nearest 100ms (e.g. 1200, 1800, 2400). The UI uses these to highlight a region in a waveform — approximate is fine, ±300ms is acceptable, but you MUST give your best estimate based on where in the audio the word appeared.

Method to estimate: divide the audio duration roughly proportionally to where the word appears in the verse. If the verse has 8 words and the error is on word 3 of 8, the error is approximately at 25-37% of the audio. Use this as a baseline and refine based on actual phoneme detection.

DO NOT skip these fields. DO NOT return null. ALWAYS provide integer values.

RESPONSE FORMAT (JSON):
For each mistake, you MUST provide:
- 'verse_word': The Arabic word.
- 'letter': The specific Arabic letter involved.
- 'expected_ipa': The correct IPA symbol/sound.
- 'user_ipa': The IPA symbol/sound the user produced.
- 'issue': Brief description of the mismatch.
- 'category': One of ['Makharij', 'Timing', 'Sifaat', 'Memory'].
- 'hifz_error_type': One of ['OMISSION', 'SUBSTITUTION', 'ADDITION', 'NONE']. Use 'OMISSION' if the word was skipped.
- 'rule': Tajweed rule. MUST be one of these exact IDs: ham_wasl | laam_shamsiyah | madda_normal | madda_permissible | madda_obligatory | madda_necessary | ghunnah | ikhfa | ikhfa_shafawi | iqlab | idghaam_ghunnah | idghaam_wo_ghunnah | idghaam_shafawi | idghaam_mutajanisayn | idghaam_mutaqaribayn | qalaqah. No other values.
- 'rule_nuance': Specific detail about the rule level.
- 'severity': Minor/Moderate/Major.
- 'practice_tip': A specific physical muscle drill (e.g., "Press tip of tongue harder against upper roots").
- 'coaching_details':
    - 'mouth_shape': e.g., "Round lips", "Flat smile".
    - 'tongue_position': e.g., "Tip touching upper incisors".
    - 'airflow': e.g., "Explosive", "Continuous".
    - 'duration': e.g., "2 counts", "Short".

TONE:
- Clinical, precise, and strict.
- Do NOT use "good job" unless the score is above 90.
- Be direct about failure.
`;

const NON_QURAN_GATE = `

         🛑 NON-QURAN GATE — READ FIRST 🛑
         BEFORE analyzing tajweed, you MUST verify the audio is actual Quran recitation.

         REJECT the audio (return a NO_RECITATION response) if ANY of these are true:
         - The audio is silence, noise, music, or non-speech
         - The user is speaking in English, French, Urdu, or any non-Arabic language
         - The user is singing a song that is NOT Quran (pop, nasheed, prayer in another language)
         - The user is saying random Arabic words that don't match any Quranic verse
         - The user only said "Bismillah" alone (this is NOT a Quranic recitation, it's just a phrase)
         - The audio is too short (< 1 second) or unintelligible
         - You cannot match the audio to ANY verse in the Quran with high confidence

         If ANY of the above is true, set:
         - tajweed_score: 0
         - quran_text_arabic: "NO_RECITATION_DETECTED"
         - quran_text_translation: "We could not detect Quranic recitation. Please recite a verse of the Quran in Arabic."
         - mistakes: []
         - positive_points: ""
         - encouragement: "Please recite an actual verse of the Quran in Arabic. This app only analyzes Quranic recitation."
         Do NOT hallucinate. Do NOT pretend the user recited bismillah if they did not actually recite a Quranic verse. Be HONEST.`;

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

function buildPromptText(verseContext: string | undefined): string {
  const base = verseContext
    ? `Please analyze this recitation of ${verseContext}. Identify the Arabic text.`
    : `Please identify which Surah/Ayah is being recited.`;

  return `${base}
         ${NON_QURAN_GATE}
         CRITICAL: Filter out any singing or melody. Focus ONLY on the correctness of Makharij (exit points of letters) and Tajweed rules.
         CRITICAL: Listen to the ENTIRE audio recording from start to end. Identify ALL verses recited, not just the first word or bismillah.
         CRITICAL: This is TAJWEED mode, NOT Hifz mode. The user may recite only part of an ayah — that is perfectly fine. Do NOT penalize for incomplete recitation. Do NOT mention that the ayah was not completed. Only evaluate the tajweed quality of whatever was actually recited.
         CRITICAL: Set quran_text_arabic to the FULL text of what the user actually recited (all words you hear), not just one word.
         CRITICAL: Every word in quran_text_arabic MUST be separated by exactly one plain space, including across ayah boundaries when multiple ayat were recited back-to-back. Never glue the last word of one ayah to the first word of the next, and never insert ayah-end marks (۝) or ayah numbers between words.
         Detect specific levels of Ghunnah (Akmal/Kamil/Naqis/Anqas) and Tafkheem (Levels 1-5).
         Apply the Deduction Matrix rigidly.
         Provide feedback in JSON format.`;
}

function buildSystemInstruction(proficiencyLevel: ProficiencyLevel, strictMode: boolean): string {
  const proficiencyBlock =
    proficiencyLevel === 'Beginner'
      ? `- Focus strictly on MAJOR errors (wrong letters, completely missed madd, clear pronunciation fail).
           - Even for beginners, score accurately. If they make major errors, score < 60.
           - Ignore subtle timing nuances but DO NOT ignore articulation.
           - Tone: Encouraging but firm on accuracy.`
      : proficiencyLevel === 'Intermediate'
      ? `- Identify Major and Moderate errors.
           - Enforce Ghunnah and Qalqalah rules strictly.
           - Score < 70 if rules are missed.
           - Tone: Constructive coaching.`
      : `- Identify ALL errors including Minor (timing precision, levels of Ghunnah, Sifaat details).
           - Use advanced/classical Tajweed terminology.
           - Be highly precise about counts (Harakat) and Sifaat.
           - Score < 80 if perfection is not met.
           - Tone: Professional master-class coaching.`;

  const strictBlock = strictMode
    ? `

      ⚠ STRICT MODE ENABLED — Override default leniency:
      - Apply MASTER-CLASS criteria regardless of stated proficiency level.
      - Penalise EVERY deviation in Madd duration, even by 0.25 harakat.
      - Penalise unclear Qalqalah, weak Ghunnah, missed Tafkheem/Tarqeeq distinctions.
      - Be RUTHLESSLY accurate. A 95+ score should be earned, not given.
      - If makharij is even slightly off, deduct heavily.
      - Reduce all scores by 10–15% from your normal calibration.
      - Tone: Honest, exacting, like a senior qari examiner. No false praise.
      `
    : '';

  return (
    BASE_SYSTEM_INSTRUCTION +
    `
      USER PROFICIENCY LEVEL: ${proficiencyLevel.toUpperCase()}
      
      INSTRUCTIONS FOR ${proficiencyLevel.toUpperCase()} LEVEL:
      ${proficiencyBlock}
      ${strictBlock}`
  );
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'RATE_LIMITED', message: 'Daily free limit reached. Download the app for unlimited sessions.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }

  let audioBase64: string;
  let mimeType: string;
  let verseContext: string | undefined;
  let proficiencyLevel: ProficiencyLevel;
  let strictMode: boolean;

  try {
    const body = await req.json();
    audioBase64 = body.audio;
    mimeType = body.mimeType ?? 'audio/webm';
    verseContext = body.verseContext ?? undefined;
    proficiencyLevel = (['Beginner', 'Intermediate', 'Advanced'].includes(body.proficiencyLevel)
      ? body.proficiencyLevel
      : 'Beginner') as ProficiencyLevel;
    strictMode = Boolean(body.strictMode);
    if (!audioBase64) throw new Error('missing audio');
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = buildSystemInstruction(proficiencyLevel, strictMode);
    const promptText = buildPromptText(verseContext);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        maxOutputTokens: 8192,
      },
      contents: {
        parts: [
          { text: promptText },
          { inlineData: { mimeType, data: audioBase64 } },
        ],
      },
    });

    const raw = response.text ?? '{}';
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Gemini error:', err?.message);
    return NextResponse.json({ error: 'ANALYSIS_FAILED' }, { status: 500 });
  }
}
