import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Simple in-memory IP rate limiter (resets on cold start)
const ipMap = new Map<string, { count: number; resetAt: number }>();
const FREE_USES = 3; // TODO: restore to 3 before deploying
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

const SYSTEM_INSTRUCTION = `You are an expert Quran recitation coach specialising in Tajweed.
Analyse the provided audio and return ONLY valid JSON (no markdown) matching this exact schema:

{
  "score": <integer 0–100>,
  "transcribed_text": "<Arabic text you heard>",
  "surah_name": "<surah name or null>",
  "ayah_number": <number or null>,
  "mistakes": [
    {
      "rule": "<tajweed rule ID>",
      "issue": "<concise English description>",
      "severity": "Major" | "Moderate" | "Minor"
    }
  ],
  "encouragement": "<one short encouraging sentence>"
}

Return at most 3 mistakes. The "rule" field must be one of:
ghunnah | ikhfa | iqlab | idghaam_ghunnah | idghaam_wo_ghunnah | qalqalah |
madda_normal | madda_permissible | madda_obligatory | madda_necessary |
laam_shamsiyah | ham_wasl | ikhfa_shafawi | idghaam_shafawi | makhaarij`;

export async function POST(req: NextRequest) {
  // Rate limit by IP
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

  try {
    const body = await req.json();
    audioBase64 = body.audio;
    mimeType = body.mimeType ?? 'audio/webm';
    if (!audioBase64) throw new Error('missing audio');
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: SYSTEM_INSTRUCTION, responseMimeType: 'application/json' },
      contents: {
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          { text: 'Analyse this recitation and return JSON.' },
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
