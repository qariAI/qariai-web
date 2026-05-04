import Image from 'next/image';
import Footer from './components/Footer';

export const metadata = {
  title: 'QariAI — Recite with the voice, breath, and ear of a master',
  description: 'QariAI is the first AI coach that trains the three skills behind every great reciter — not just the rules. Free worldwide.',
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

      {/* Hero — repositioned 2026-05-03. Pivot from "Tajweed checker"
          framing to "voice / breath / ear" skill-coach framing. Maps
          directly to the in-app surfaces (Recite / Nafs / Maqam) and
          claims the category against rules-based competitors. The
          line break sits between "breath," and "and ear of a master"
          for cadence + cleaner mobile wrap. */}
      <section className="flex flex-col items-center text-center px-6 pt-14 pb-8 max-w-lg mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 leading-tight mb-3">
          Recite the Quran with the<br className="hidden sm:inline" />{' '}
          <span className="text-emerald-600">voice, breath, and ear of a master.</span>
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          QariAI is the first AI coach that trains the three skills behind every great reciter — not just the rules.
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

      {/* What's new — three cards summarizing the v1.18 ship beyond
          the Maqam spotlight above. Cream/light theme so it reads as
          part of the calm landing, with each card carrying a distinct
          accent matching the in-app section it represents.
          Section reordered (2026-05-03) — was AFTER the Get-the-app
          CTA, which asked for the install before showing what's new.
          Now it sits between Maqam and Get-the-app so the buying
          journey reads: hero → headline feature → other features →
          install → trust. */}
      <section className="px-6 pt-8 pb-6 max-w-lg mx-auto w-full">
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

      {/* Social proof — real Play Store reviews. Sits between
          What's-new (product proof) and Get-the-app (CTA) because
          this is the highest-leverage spot for testimonials: the
          user has just seen what the app does, this confirms other
          reciters thought it was worth it. Replace the review text
          with the latest from Play Console as more arrive; bump the
          month label to keep it feeling current. */}
      <section className="px-6 pt-4 pb-6 max-w-lg mx-auto w-full">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600 mb-1 text-center">
          What reciters are saying
        </p>
        <p className="text-[11px] text-slate-400 text-center mb-4">
          From real Play Store reviews
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              initials: 'MR',
              quote: 'An incredible app. I’ve tested both Hifz and Tajweed mode — they work great. Set to Advanced, it works perfectly picking up any small mistakes.',
              name: 'Matti-Ur Rehman',
              meta: 'Google Play review · March 2026',
            },
            {
              initials: 'SA',
              quote: 'I think it is very nice and accurate, Mashallah.',
              name: 'Sayeed Ahmed',
              meta: 'Google Play review · April 2026',
            },
          ].map((r) => (
            <div
              key={r.name}
              className="rounded-2xl bg-white border border-slate-100 p-4 flex flex-col gap-3"
              style={{ boxShadow: '0 1px 2px rgba(15,40,20,0.04), 0 4px 12px rgba(15,40,20,0.04)' }}
            >
              {/* 5-star row — Play Store reviews here are 5-star;
                  if a quoted review is ever sub-5 the stars below
                  should reflect its rating exactly. */}
              <div className="flex gap-0.5" aria-label="Five stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
              <div className="flex items-center gap-2.5 mt-auto">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background: '#DCFCE7', color: '#0F6E56' }}
                  aria-hidden="true"
                >
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 leading-tight">{r.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get the app — single intentional install CTA, sits AFTER the
          product proof (Maqam + What's new + social proof) so the
          user has seen the value AND the validation before being
          asked to convert. */}
      <section className="px-6 pt-2 pb-10 max-w-lg mx-auto w-full">
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

      {/* Trust strip — credibility, not capabilities (was "24 rules /
          AI / < 10s" which only restated what the page already said).
          Real launch-day numbers carry far more weight than feature
          claims. The install count is from Play Console; bump as the
          number grows. */}
      <section className="border-t border-slate-100 bg-white px-6 py-6">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { stat: '935+', label: 'Reciters installed worldwide' },
            { stat: '24', label: 'Tajweed rules checked' },
            { stat: 'Gemini AI', label: 'Real-time analysis' },
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
