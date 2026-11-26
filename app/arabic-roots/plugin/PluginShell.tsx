import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import Footer from '../../components/Footer';

export const PLUGIN_BASE = 'https://qariai.app/arabic-roots/plugin';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.qari.ai';
export const SUPPORT_EMAIL = 'salam@qariai.app';
export const LAST_UPDATED = '26 November 2026';

const NAV = [
  { href: '/arabic-roots/plugin', label: 'Overview' },
  { href: '/arabic-roots/plugin/privacy', label: 'Privacy' },
  { href: '/arabic-roots/plugin/terms', label: 'Terms' },
  { href: '/arabic-roots/plugin/support', label: 'Support' },
];

export function PluginShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.png" alt="QariAI" width={56} height={56} className="object-contain flex-shrink-0" />
            <span className="font-bold text-xl tracking-tight">
              <span className="text-slate-800">Qari</span><span className="text-emerald-600">AI</span>
            </span>
          </Link>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
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
        {children}

        <nav aria-label="Plugin pages" className="border-t border-slate-100 pt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Arabic Roots plugin</p>
          <div className="flex flex-wrap gap-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-xs text-emerald-600 border border-emerald-200 bg-white rounded-full px-3 py-1.5 hover:bg-emerald-50 transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <Footer />
    </main>
  );
}

export function PageTitle({ title, intro }: { title: string; intro?: string }) {
  return (
    <section>
      <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 leading-tight mb-4">{title}</h1>
      {intro && <p className="text-slate-500 text-base leading-relaxed">{intro}</p>}
    </section>
  );
}

export function Card({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-emerald-100 rounded-2xl px-6 py-5 shadow-sm">
      <h2 className="font-bold text-emerald-900 text-lg mb-2">{heading}</h2>
      <div className="text-slate-500 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-emerald-600 mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Updated() {
  return <p className="text-slate-400 text-xs">Last updated: {LAST_UPDATED}</p>;
}
