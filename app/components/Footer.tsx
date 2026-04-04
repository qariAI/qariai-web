import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="QariAI" width={40} height={40} className="object-contain" />
              <span className="font-bold text-lg">
                <span className="text-slate-800">Qari</span><span className="text-emerald-600">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered Tajweed &amp; Hifz coaching for Muslims worldwide.
            </p>
            <a href="mailto:salam@qariai.app" className="text-emerald-600 text-sm hover:underline">
              salam@qariai.app
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="https://www.qariai.app/best-ai-quran-app" className="hover:text-emerald-600 transition-colors font-medium text-emerald-700">⭐ Best Quran AI App</a></li>
              <li><a href="https://qariai.app/how-qari-ai-works" className="hover:text-emerald-600 transition-colors">How It Works</a></li>
              <li><a href="https://qariai.app/tajweed-mistakes-checker" className="hover:text-emerald-600 transition-colors">Free Tajweed Checker</a></li>
              <li><a href="/tajweed-checker" className="hover:text-emerald-600 transition-colors">AI Tajweed Checker</a></li>
              <li><a href="https://play.google.com/store/apps/details?id=app.qari.ai" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Download App</a></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/ghunnah" className="hover:text-emerald-600 transition-colors">Fix Ghunnah Mistakes</a></li>
              <li><a href="/qalqalah" className="hover:text-emerald-600 transition-colors">Qalqalah Practice</a></li>
              <li><a href="/madd-rules" className="hover:text-emerald-600 transition-colors">Madd Rules</a></li>
              <li><a href="/noon-sakinah" className="hover:text-emerald-600 transition-colors">Noon Sakinah</a></li>
              <li><a href="/tajweed-for-beginners" className="hover:text-emerald-600 transition-colors">Tajweed for Beginners</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} QariAI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://qariai.app/privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="https://qariai.app/terms" className="hover:text-slate-600 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
