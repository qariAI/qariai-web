import Image from 'next/image';
import RecorderWidget from './RecorderWidget';

export interface SeoPageData {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  whatIsIt: string;
  commonMistakes: string[];
  rule: string;
}

export default function SeoPageLayout({ page }: { page: SeoPageData }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header — logo always on white */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1">
            <Image src="/logo.png" alt="QariAI" width={56} height={56} className="object-contain flex-shrink-0" />
            <span className="font-bold text-xl tracking-tight">
              <span className="text-slate-800">Qari</span><span className="text-emerald-600">AI</span>
            </span>
          </a>
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

      <div className="max-w-2xl mx-auto px-6 py-10 w-full flex flex-col gap-8">

        {/* Intro */}
        <section>
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 leading-tight mb-4">{page.h1}</h1>
          <p className="text-slate-500 text-base leading-relaxed">{page.intro}</p>
        </section>

        {/* What is it */}
        <section className="bg-white border border-emerald-100 rounded-2xl px-6 py-5 shadow-sm">
          <h2 className="font-bold text-emerald-900 text-lg mb-2">What is {page.slug.replace(/-/g, ' ')}?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{page.whatIsIt}</p>
          {page.commonMistakes.length > 0 && (
            <ul className="mt-4 space-y-2">
              {page.commonMistakes.map((m, i) => (
                <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                  {m}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Live Tool */}
        <section>
          <div className="mb-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              Live AI Checker
            </span>
          </div>
          <p className="text-slate-400 text-sm text-center mb-5">
            Recite below — the AI will flag any {page.slug.replace(/-/g, ' ')} errors instantly.
          </p>
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
            <RecorderWidget highlightRule={page.rule} />
          </div>
          <p className="text-slate-400 text-xs mt-3 text-center">3 free sessions per day · No account required</p>
        </section>

        {/* Related pages */}
        <section className="border-t border-slate-100 pt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Related Tajweed Rules</p>
          <div className="flex flex-wrap gap-2">
            {RELATED_PAGES.filter(p => p.slug !== page.slug).map(p => (
              <a
                key={p.slug}
                href={`/${p.slug}`}
                className="text-xs text-emerald-600 border border-emerald-200 bg-white rounded-full px-3 py-1.5 hover:bg-emerald-50 transition-colors"
              >
                {p.label}
              </a>
            ))}
          </div>
        </section>

      </div>

      <footer className="text-center py-4 text-slate-300 text-xs border-t border-slate-100 mt-auto bg-white">
        © {new Date().getFullYear()} QariAI
      </footer>
    </main>
  );
}

export const RELATED_PAGES = [
  { slug: 'ghunnah', label: 'Ghunnah' },
  { slug: 'qalqalah', label: 'Qalqalah' },
  { slug: 'madd-rules', label: 'Madd Rules' },
  { slug: 'noon-sakinah', label: 'Noon Sakinah' },
  { slug: 'meem-sakinah', label: 'Meem Sakinah' },
  { slug: 'tajweed-for-beginners', label: 'Tajweed for Beginners' },
  { slug: 'arabic-pronunciation', label: 'Arabic Pronunciation' },
  { slug: 'tajweed-checker', label: 'Tajweed Checker' },
  { slug: 'quran-pronunciation-checker', label: 'Quran Pronunciation Checker' },
  { slug: 'quran-recitation-mistakes', label: 'Recitation Mistakes' },
];
