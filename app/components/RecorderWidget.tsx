'use client';

import { useState, useRef, useCallback } from 'react';

type Mistake = {
  rule: string;
  issue: string;
  severity: 'Major' | 'Moderate' | 'Minor';
};

type Result = {
  score: number;
  transcribed_text?: string;
  surah_name?: string;
  ayah_number?: number;
  mistakes: Mistake[];
  encouragement?: string;
};

const DEMO_RESULT: Result = {
  score: 68,
  transcribed_text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  surah_name: 'Al-Fatiha',
  ayah_number: 1,
  mistakes: [
    { rule: 'ghunnah', issue: 'Nasal sound (ghunnah) too short — should last 2 beats', severity: 'Major' },
    { rule: 'madda_obligatory', issue: 'Madd elongation incomplete before hamza', severity: 'Moderate' },
  ],
  encouragement: 'Good effort — with a little practice these will come naturally.',
};

const SEVERITY_COLOR: Record<string, string> = {
  Major: 'text-red-500',
  Moderate: 'text-amber-500',
  Minor: 'text-sky-500',
};

const SEVERITY_BG: Record<string, string> = {
  Major: 'bg-red-50 border-red-100',
  Moderate: 'bg-amber-50 border-amber-100',
  Minor: 'bg-sky-50 border-sky-100',
};

function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'audio/webm';
}

type State = 'idle' | 'recording' | 'analyzing' | 'results' | 'limited' | 'demo';

export default function RecorderWidget({ highlightRule }: { highlightRule?: string } = {}) {
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setUserAudioUrl(url);
        await analyze(blob, mimeType);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setState('recording');
    } catch {
      setState('demo');
      setResult(DEMO_RESULT);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setState('analyzing');
    }
  }, []);

  const analyze = async (blob: Blob, mimeType: string) => {
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, mimeType }),
      });

      if (res.status === 429) { setState('limited'); return; }
      if (!res.ok) throw new Error('analysis failed');

      const data: Result = await res.json();
      setResult(data);
      setState('results');
    } catch {
      setError('Analysis failed. Please try again.');
      setState('idle');
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    if (userAudioUrl) { URL.revokeObjectURL(userAudioUrl); setUserAudioUrl(null); }
    setState('idle');
  };

  const playUserAudio = () => {
    if (!userAudioUrl) return;
    if (userAudioRef.current) userAudioRef.current.pause();
    const audio = new Audio(userAudioUrl);
    userAudioRef.current = audio;
    audio.play();
  };

  // ── IDLE ──────────────────────────────────────────────────────────────
  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center gap-5">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-emerald-600/70 text-sm">Tap the microphone to begin</p>
        <button
          onClick={startRecording}
          className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 hover:scale-105 border-4 border-emerald-200 flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95"
          aria-label="Start recording"
        >
          <MicIcon />
        </button>
      </div>
    );
  }

  // ── RECORDING ─────────────────────────────────────────────────────────
  if (state === 'recording') {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-emerald-700 text-sm font-medium animate-pulse">Listening…</p>
        <button
          onClick={stopRecording}
          className="w-20 h-20 rounded-full bg-red-50 hover:bg-red-100 border-2 border-red-500 flex items-center justify-center transition-colors"
          aria-label="Stop recording"
        >
          <div className="w-8 h-8 bg-red-500 rounded-md shadow-sm" />
        </button>
        <p className="text-slate-400 text-xs">Tap to stop</p>
      </div>
    );
  }

  // ── ANALYZING ─────────────────────────────────────────────────────────
  if (state === 'analyzing') {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-700 text-sm font-bold animate-pulse">Analyzing Recitation…</p>
        <p className="text-slate-400 text-xs">Usually takes 5–10 seconds</p>
      </div>
    );
  }

  // ── RATE LIMITED ──────────────────────────────────────────────────────
  if (state === 'limited') {
    return <CTABlock reason="limited" onReset={reset} />;
  }

  // ── RESULTS / DEMO ────────────────────────────────────────────────────
  if ((state === 'results' || state === 'demo') && result) {
    const isDemo = state === 'demo';
    const scoreColor = result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-500' : 'text-red-500';

    return (
      <div className="w-full flex flex-col gap-4">
        {isDemo && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center">
            <p className="text-slate-400 text-xs">Microphone not available — showing a demo result</p>
          </div>
        )}

        {/* Score card */}
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Tajweed Score</p>
            {result.surah_name && (
              <p className="text-xs text-slate-500 font-medium">{result.surah_name}{result.ayah_number ? ` · Ayah ${result.ayah_number}` : ''}</p>
            )}
          </div>
          <p className={`text-4xl font-bold ${scoreColor}`}>
            {result.score}<span className="text-lg text-slate-400">%</span>
          </p>
        </div>

        {/* Arabic text */}
        {result.transcribed_text && (
          <p className="text-center text-2xl leading-relaxed text-emerald-900" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
            {result.transcribed_text}
          </p>
        )}

        {/* Play back */}
        {userAudioUrl && (
          <button
            onClick={playUserAudio}
            className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors mx-auto font-medium"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs">▶</span>
            Play your recitation
          </button>
        )}

        {/* Mistakes */}
        {result.mistakes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Mistakes found</p>
            {result.mistakes.slice(0, 3).map((m, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${SEVERITY_BG[m.severity]} ${highlightRule && m.rule === highlightRule ? 'ring-2 ring-emerald-400' : ''}`}
              >
                <span className={`text-sm font-bold mt-0.5 ${SEVERITY_COLOR[m.severity]}`}>✕</span>
                <div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">{m.rule.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{m.issue}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Encouragement */}
        {result.encouragement && (
          <p className="text-center text-sm text-slate-400 italic">{result.encouragement}</p>
        )}

        {/* CTA */}
        <CTABlock reason="results" onReset={reset} />
      </div>
    );
  }

  return null;
}

function CTABlock({ reason, onReset }: { reason: 'results' | 'limited'; onReset: () => void }) {
  return (
    <div className="flex flex-col gap-3 mt-1">
      <div className="bg-emerald-600 rounded-2xl px-5 py-5 text-center shadow-lg">
        <p className="font-bold text-white text-base mb-1">
          {reason === 'limited' ? 'Daily limit reached' : 'Improve this in 3 minutes'}
        </p>
        <p className="text-emerald-100 text-sm mb-4">
          {reason === 'limited'
            ? 'Download the app for unlimited sessions, progress tracking, and guided practice.'
            : 'Get a full breakdown, guided drills, and track your progress over time.'}
        </p>
        <ul className="text-left text-sm text-emerald-50 space-y-1 mb-4">
          <li>✓ Track mistakes over time</li>
          <li>✓ Full 24-rule Tajweed breakdown</li>
          <li>✓ Daily improvement plan</li>
        </ul>
        <a
          href="https://play.google.com/store/apps/details?id=app.qari.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-emerald-700 font-bold py-3 rounded-xl transition-colors text-center hover:bg-emerald-50"
        >
          Continue in App →
        </a>
      </div>
      <button onClick={onReset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors text-center">
        Try another verse
      </button>
    </div>
  );
}

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}
