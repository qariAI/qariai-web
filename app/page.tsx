import Image from 'next/image';
import Footer from './components/Footer';

export const metadata = {
  title: 'QariAI — Check Your Tajweed Instantly with AI',
  description: 'Recite a Quran verse and get instant AI-powered Tajweed feedback. Free to try. No account required.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header — logo always on white */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image src="/logo.png" alt="QariAI" width={44} height={44} className="object-contain flex-shrink-0" />
            <span className="font-bold text-2xl tracking-tight">
              <span className="text-slate-800">Qari</span><span className="text-emerald-600">AI</span>
            </span>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=app.qari.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              width={130}
              height={40}
              style={{ height: 'auto' }}
              className="object-contain"
            />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-14 pb-8 max-w-lg mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 leading-tight mb-3">
          Check your Tajweed<br />
          <span className="text-emerald-600">instantly with AI</span>
        </h1>
        <p className="text-slate-500 text-base">
          Recite any verse and get real-time correction in seconds.
        </p>
      </section>

      {/* Maqam spotlight — v1.18's headline feature. Dark forest-green
          surface (same palette as the in-app Maqam flow) so the
          section reads as a distinct "what's new" moment, not just
          another light-theme card. The waveform-comparison-with-
          master-reciters pitch is the strongest differentiator for
          QariAI right now; no other Tajweed app does this. */}
      <section className="px-6 pb-2 max-w-lg mx-auto w-full">
        <div
          className="relative overflow-hidden rounded-2xl text-white px-6 py-7"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,196,140,0.16) 0%, rgba(6,19,17,0) 70%), linear-gradient(180deg, #06231C 0%, #0A2E25 100%)',
            boxShadow: '0 18px 48px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,196,140,0.18)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: '#00C48C' }}>
            New · Train your ear
          </p>
          <h2 className="mt-2.5 text-2xl sm:text-[28px] font-bold leading-tight tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            See where your voice<br />
            <span style={{ color: '#9FE1CB' }}>drifts from the master.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-[14.5px] leading-relaxed text-slate-200/90">
            Side-by-side waveform comparison with master reciters across eight maqamat. The wave colors green where you tracked, coral where you drifted &mdash; diagnostic, not decorative.
          </p>

          {/* Mini-spec strip — three concrete capabilities so the
              section names what's actually different, not just
              marketing adjectives. */}
          <ul className="mt-5 grid grid-cols-3 gap-2.5 list-none p-0">
            {[
              { num: '8', label: 'Maqamat' },
              { num: '4', label: 'Master reciters' },
              { num: 'Live', label: 'Sync feedback' },
            ].map((it) => (
              <li
                key={it.label}
                className="rounded-xl px-2.5 py-2.5 text-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-base font-black tabular-nums" style={{ color: '#FFE9A8' }}>{it.num}</p>
                <p className="text-[10px] mt-0.5 text-slate-300/85">{it.label}</p>
              </li>
            ))}
          </ul>

          <a
            href="https://play.google.com/store/apps/details?id=app.qari.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[13px] font-bold tracking-wide transition-all hover:brightness-110 active:scale-[0.98]"
            style={{
              background: '#00C48C',
              color: '#08231C',
              boxShadow: '0 0 24px rgba(0,196,140,0.30)',
            }}
          >
            Try Maqam in the QariAI app →
          </a>
        </div>
      </section>

      {/* Get the app — replaces the prior in-page Tajweed checker. The
          live tool moved into the QariAI mobile app; this card is the
          single download CTA for users who arrived expecting the web
          analyzer. */}
      <section className="px-6 pt-8 pb-6 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">
            Available on Android · iOS soon
          </p>
          <p className="text-slate-700 text-base leading-relaxed">
            Live tajweed feedback, memorize mode, streaks, and your Mosque Journey — all in the QariAI app.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=app.qari.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            <Image
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              width={170}
              height={52}
              style={{ height: 'auto' }}
              className="object-contain"
            />
          </a>
        </div>
        <p className="text-slate-400 text-xs mt-3 text-center">
          Free to start · No account required · Free worldwide
        </p>
      </section>

      {/* What's new — three cards summarizing the v1.18 ship beyond
          the Maqam spotlight above. Cream/light theme so it reads as
          part of the calm landing, with each card carrying a distinct
          accent matching the in-app section it represents. */}
      <section className="px-6 pb-10 max-w-lg mx-auto w-full">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 mb-3 text-center">
          What&rsquo;s new
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Diagnostic feedback',
              body: 'Per-segment colored waveform shows you exactly where you tracked the master vs where you drifted.',
              tint: '#DCFCE7',
              accent: '#0F6E56',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h3l3-7 4 14 3-9 2 5h3" />
                </svg>
              ),
            },
            {
              title: 'Masjid Journey',
              body: 'Unlock ten sacred mosques as you grow — from the Kaʿba to Al-Qarawiyyin.',
              tint: '#FEF3C7',
              accent: '#B45309',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21V12M21 21V12M7 21V14M17 21V14" />
                  <path d="M7 14a5 5 0 0 1 10 0" />
                  <path d="M12 9V6" />
                </svg>
              ),
            },
            {
              title: 'Du&rsquo;a cards',
              body: 'Pick a dua, write your own, or start from a favorite — pick a design and share the image.',
              tint: '#EDE9FE',
              accent: '#6D28D9',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 15h8" />
                </svg>
              ),
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl bg-white border border-slate-100 p-4 flex flex-col gap-2"
              style={{ boxShadow: '0 1px 2px rgba(15,40,20,0.04), 0 4px 12px rgba(15,40,20,0.04)' }}
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: c.tint }}
                aria-hidden="true"
              >
                {c.icon}
              </span>
              <p className="text-[14px] font-bold leading-tight" style={{ color: c.accent }}>
                {c.title}
              </p>
              <p className="text-[12px] text-slate-500 leading-snug">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-slate-100 bg-white px-6 py-6">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { stat: '24', label: 'Tajweed rules checked' },
            { stat: 'AI', label: 'Powered by Gemini' },
            { stat: '< 10s', label: 'Instant feedback' },
          ].map((item) => (
            <div key={item.stat}>
              <p className="text-emerald-600 font-bold text-lg">{item.stat}</p>
              <p className="text-slate-400 text-xs mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
