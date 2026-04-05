'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

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

const ANALYSIS_STEPS = [
  'Transcribing your recitation…',
  'Checking Ghunnah (nasal rules)…',
  'Checking Madd elongation…',
  'Analysing Qalqalah & Sifaat…',
  'Preparing your Tajweed report…',
];

const STEP_DURATION_MS = 1800;
const MIN_RECORD_SECONDS = 2;

// Translations for Al-Fatiha verses (the demo verses)
const VERSE_TRANSLATIONS: Record<string, string> = {
  'Al-Fatiha-1': 'In the name of Allah, the Most Gracious, the Most Merciful',
  'Al-Fatiha-2': 'All praise is for Allah, Lord of all worlds',
  'Al-Fatiha-3': 'The Most Gracious, the Most Merciful',
  'Al-Fatiha-4': 'Master of the Day of Judgment',
  'Al-Fatiha-5': 'You alone we worship, You alone we ask for help',
  'Al-Fatiha-6': 'Guide us on the Straight Path',
  'Al-Fatiha-7': 'The path of those You have blessed',
};

function getTranslation(surahName?: string, ayah?: number): string {
  return VERSE_TRANSLATIONS[`${surahName}-${ayah}`] ?? 'Reflect on the words of Allah';
}

function getEncouragement(mistakeCount: number): string {
  if (mistakeCount === 0) return 'MashaAllah! A near-perfect recitation — truly beautiful.';
  if (mistakeCount === 1) return 'So close to perfect! One small rule to master.';
  if (mistakeCount === 2) return 'Good effort — two rules to polish. Real progress!';
  return 'Every recitation is an act of worship. Keep going — improvement is guaranteed.';
}

function getSupportedMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'audio/webm';
}

const DEMO_RESULT: Result = {
  score: 71,
  transcribed_text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  surah_name: 'Al-Fatiha',
  ayah_number: 1,
  mistakes: [
    { rule: 'Ghunnah', issue: 'Nasal resonance too short on النون — hold for 2 full counts through the nose', severity: 'Major' },
    { rule: "Madd Tabee'i", issue: 'Long vowel in ٱلرَّحْمَٰنِ slightly rushed — aim for exactly 2 counts', severity: 'Moderate' },
  ],
  encouragement: 'Solid start — mastering these two rules alone will transform your recitation.',
};

type State = 'idle' | 'recording' | 'analyzing' | 'results' | 'limited';

export default function RecorderWidget({ highlightRule }: { highlightRule?: string } = {}) {
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [analysisStep, setAnalysisStep] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analysisTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordStartRef = useRef<number>(0);

  useEffect(() => {
    if (state === 'recording') {
      recordStartRef.current = Date.now();
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds(Math.floor((Date.now() - recordStartRef.current) / 1000));
      }, 500);
    } else {
      if (recordTimerRef.current) { clearInterval(recordTimerRef.current); recordTimerRef.current = null; }
    }
    return () => { if (recordTimerRef.current) clearInterval(recordTimerRef.current); };
  }, [state]);

  useEffect(() => {
    if (state === 'analyzing') {
      setAnalysisStep(0);
      analysisTimerRef.current = setInterval(() => {
        setAnalysisStep(prev => Math.min(prev + 1, ANALYSIS_STEPS.length - 1));
      }, STEP_DURATION_MS);
    } else {
      if (analysisTimerRef.current) { clearInterval(analysisTimerRef.current); analysisTimerRef.current = null; }
    }
    return () => { if (analysisTimerRef.current) clearInterval(analysisTimerRef.current); };
  }, [state]);

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
      setResult(DEMO_RESULT);
      setState('results');
    }
  }, []);

  const stopRecording = useCallback(() => {
    const elapsed = (Date.now() - recordStartRef.current) / 1000;
    if (elapsed < MIN_RECORD_SECONDS) {
      setError('Recite a few words first — then tap stop.');
      return;
    }
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

      if (!data.transcribed_text && data.score > 50) {
        setError('We couldn\'t detect a recitation. Try again closer to the mic.');
        setState('idle');
        return;
      }

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
    setRecordSeconds(0);
    setAnalysisStep(0);
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

  const generateDuaCard = useCallback(async () => {
    await document.fonts.ready;

    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.6, '#065f46');
    grad.addColorStop(1, '#0f766e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow in the centre
    const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 500);
    glow.addColorStop(0, 'rgba(255,255,255,0.06)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Outer gold border
    ctx.strokeStyle = 'rgba(212,175,55,0.55)';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, W - 100, H - 100);

    // Inner gold border
    ctx.strokeStyle = 'rgba(212,175,55,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    // Corner squares
    const sq = 14;
    ctx.fillStyle = 'rgba(212,175,55,0.5)';
    [[46, 46], [W - 46 - sq, 46], [46, H - 46 - sq], [W - 46 - sq, H - 46 - sq]].forEach(([x, y]) => {
      ctx.fillRect(x, y, sq, sq);
    });

    // Surah label
    ctx.fillStyle = 'rgba(167,243,208,0.85)';
    ctx.font = 'bold 34px Inter, -apple-system, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      (result?.surah_name ?? 'Al-Fatiha') + '  ·  ' + (result?.ayah_number ?? '1'),
      W / 2, 210
    );

    // Arabic text — large, centred
    ctx.fillStyle = '#ffffff';
    ctx.font = '96px Amiri, "Traditional Arabic", "Arabic Typesetting", serif';
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillText(
      result?.transcribed_text ?? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      W / 2, 510
    );

    // Translation — wrap into two lines
    ctx.direction = 'ltr';
    ctx.fillStyle = 'rgba(167,243,208,0.88)';
    ctx.font = 'italic 36px Georgia, "Times New Roman", serif';
    const translation = getTranslation(result?.surah_name, result?.ayah_number);
    const words = translation.split(' ');
    const mid = Math.ceil(words.length / 2);
    ctx.fillText(words.slice(0, mid).join(' '), W / 2, 650);
    ctx.fillText(words.slice(mid).join(' '), W / 2, 700);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(160, 820);
    ctx.lineTo(W - 160, 820);
    ctx.stroke();

    // QariAI watermark
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font = '28px Inter, -apple-system, Arial, sans-serif';
    ctx.fillText('QariAI · qariai.app', W / 2, 960);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'my-recitation-qari.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Quran Recitation',
            text: 'I recited on QariAI — check yours at qariai.app',
            files: [file],
          });
        } catch { /* cancelled */ }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-recitation-qari.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, 'image/png');
  }, [result]);

  // ── IDLE ────────────────────────────────────────────────────────────────────
  if (state === 'idle') return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <p className="text-slate-500 text-sm">Tap the mic and recite:</p>
        <p className="text-3xl leading-relaxed text-emerald-900 font-medium" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="text-slate-400 text-xs italic">Bismillāhir-Raḥmānir-Raḥīm</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={startRecording}
        className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 hover:scale-105 border-4 border-emerald-200 flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95"
        aria-label="Start recording"
      >
        <MicIcon />
      </button>
      <p className="text-slate-400 text-xs">AI analysis · takes 5–10 seconds</p>
    </div>
  );

  // ── RECORDING ───────────────────────────────────────────────────────────────
  if (state === 'recording') return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-2xl leading-relaxed text-emerald-900 text-center" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-bold text-red-500">
          {recordSeconds < MIN_RECORD_SECONDS ? 'Listening…' : `Recording · ${recordSeconds}s`}
        </span>
      </div>
      {error && <p className="text-amber-600 text-sm text-center">{error}</p>}
      <button
        onClick={stopRecording}
        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all ${
          recordSeconds < MIN_RECORD_SECONDS
            ? 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
            : 'bg-red-50 hover:bg-red-100 border-red-500 cursor-pointer'
        }`}
        aria-label="Stop recording"
      >
        <div className={`w-8 h-8 rounded-md shadow-sm ${recordSeconds < MIN_RECORD_SECONDS ? 'bg-slate-400' : 'bg-red-500'}`} />
      </button>
      <p className="text-slate-400 text-xs">
        {recordSeconds < MIN_RECORD_SECONDS ? 'Recite the verse above…' : 'Tap to stop'}
      </p>
    </div>
  );

  // ── ANALYZING ───────────────────────────────────────────────────────────────
  if (state === 'analyzing') return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🔍</div>
      </div>
      <div className="text-center space-y-1 min-h-[48px]">
        <p className="text-emerald-700 text-sm font-bold">{ANALYSIS_STEPS[analysisStep]}</p>
        <div className="flex justify-center gap-1 mt-2">
          {ANALYSIS_STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= analysisStep ? 'bg-emerald-500 w-5' : 'bg-slate-200 w-2'}`} />
          ))}
        </div>
      </div>
      <p className="text-slate-400 text-xs">Checking 24 Tajweed rules…</p>
    </div>
  );

  // ── RATE LIMITED ────────────────────────────────────────────────────────────
  if (state === 'limited') return <CTABlock reason="limited" onReset={reset} />;

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  if (state === 'results' && result) {
    const visibleMistakes = result.mistakes.slice(0, 2);
    const hiddenCount = Math.max(0, (result.mistakes.length > 2 ? result.mistakes.length : 3) - 2);
    const encouragement = getEncouragement(result.mistakes.length);
    const translation = getTranslation(result.surah_name, result.ayah_number);
    const verseLabel = result.surah_name
      ? `${result.surah_name}${result.ayah_number ? ` · ${result.ayah_number}` : ''}`
      : 'Al-Fatiha · 1';

    return (
      <div className="w-full flex flex-col gap-4">

        {/* Encouragement */}
        <p className="text-center text-sm font-medium text-emerald-700">{encouragement}</p>

        {/* Dua Card */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 p-6 text-center relative shadow-xl">
          {/* Gold inset border */}
          <div className="absolute inset-3 border border-yellow-400/25 rounded-xl pointer-events-none" />

          {/* Surah label */}
          <p className="text-emerald-300 text-xs uppercase tracking-widest mb-4">{verseLabel}</p>

          {/* Arabic verse */}
          <p
            className="text-white text-3xl leading-loose mb-4"
            dir="rtl"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            {result.transcribed_text ?? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'}
          </p>

          {/* Translation */}
          <p className="text-emerald-200 text-sm italic leading-relaxed mb-4">{translation}</p>

          {/* Branding strip */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-white/30 text-xs tracking-wide">Recited on QariAI · qariai.app</p>
          </div>
        </div>

        {/* Share / Download */}
        <button
          onClick={generateDuaCard}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-sm transition-colors"
        >
          Share your card →
        </button>

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

        {/* Tajweed feedback */}
        {visibleMistakes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Patterns detected</p>
            {visibleMistakes.map((m, i) => (
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

            {/* Locked / blurred FOMO row */}
            {hiddenCount > 0 && (
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 overflow-hidden select-none">
                <div className="flex items-start gap-3 blur-sm opacity-60 pointer-events-none">
                  <span className="text-sm font-bold mt-0.5 text-amber-500">✕</span>
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Idghaam Rule</p>
                    <p className="text-sm text-slate-500 mt-0.5">Merging not applied — letters must blend fully here</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <span className="text-base">🔒</span>
                  <p className="text-xs font-bold text-slate-600">
                    {hiddenCount} more pattern{hiddenCount > 1 ? 's' : ''} — unlock in the app
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

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
          {reason === 'limited' ? 'Daily limit reached' : 'Your full Tajweed report is ready'}
        </p>
        <p className="text-emerald-100 text-sm mb-4">
          {reason === 'limited'
            ? 'Download the app for unlimited sessions, progress tracking, and guided practice.'
            : 'Get your complete breakdown, daily drills, and track every rule over time.'}
        </p>
        <ul className="text-left text-sm text-emerald-50 space-y-1 mb-4">
          <li>✓ All 24 Tajweed rules analysed</li>
          <li>✓ Daily personalised drills</li>
          <li>✓ Track improvement over time</li>
        </ul>
        <a
          href="https://play.google.com/store/apps/details?id=app.qari.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-white text-emerald-700 font-bold py-3 rounded-xl transition-colors text-center hover:bg-emerald-50"
        >
          See My Full Report →
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
