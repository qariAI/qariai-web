import Image from 'next/image';
import RecorderWidget from './components/RecorderWidget';
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
            <Image src="/logo.png" alt="QariAI" width={56} height={56} className="object-contain flex-shrink-0" />
            <span className="font-bold text-xl tracking-tight">
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

      {/* Live Tool */}
      <section className="px-6 pb-10 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
          <RecorderWidget />
        </div>
        <p className="text-slate-400 text-xs mt-3 text-center">
          3 free sessions per day · No account required
        </p>
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
