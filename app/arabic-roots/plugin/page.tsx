import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Bullets, Card, PageTitle, PLAY_STORE_URL, PLUGIN_BASE, PluginShell } from './PluginShell';

export const metadata: Metadata = {
  title: 'QariAI Arabic Roots — ChatGPT Plugin for Quran Word Roots | QariAI',
  description:
    'Ask ChatGPT about a word from an ayah, see its Arabic root, then run a five-minute drill in the same chat. A ChatGPT plugin by Qaf Studio.',
  alternates: { canonical: PLUGIN_BASE },
};

const PROMPTS = [
  'What is the root of يَسْبَحُونَ in Quran 21:33?',
  'Break down the word يَسْبَحُونَ from 21:33 and show me how it is built from its root.',
  'Start a five-minute root drill on يَسْبَحُونَ from 21:33.',
];

export default function PluginLanding() {
  return (
    <PluginShell>
      <PageTitle
        title="QariAI Arabic Roots"
        intro="A ChatGPT plugin by Qaf Studio. Ask about a word from an ayah, see its root, then practise it with a five-minute drill — all in the same chat."
      />

      <Card heading="How it works">
        <ol className="space-y-3">
          <li><span className="font-semibold text-emerald-700">1. Ask.</span> Name a word and its verse, such as 21:33.</li>
          <li><span className="font-semibold text-emerald-700">2. See the root.</span> Get the word’s Arabic root and how the word is built from it.</li>
          <li><span className="font-semibold text-emerald-700">3. Drill.</span> Do a five-minute drill without leaving the chat.</li>
        </ol>
      </Card>

      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">Try these prompts</p>
        <div className="flex flex-col gap-3">
          {PROMPTS.map((p) => (
            <div key={p} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-slate-700 text-sm leading-relaxed" dir="auto">“{p}”</p>
            </div>
          ))}
        </div>
      </section>

      <Card heading="Verified words only, for now">
        <p>
          At launch the plugin covers only words we have verified. Right now that is one word:
        </p>
        <p className="text-center text-3xl text-emerald-800 py-2" dir="rtl" lang="ar" style={{ fontFamily: 'Amiri, serif' }}>
          يَسْبَحُونَ <span className="text-sm text-slate-400" dir="ltr" style={{ fontFamily: 'inherit' }}>(21:33)</span>
        </p>
        <p>
          For anything not yet verified, the plugin will say so rather than guess. More words will be added as they are checked.
        </p>
      </Card>

      <section>
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3">Live Tajweed analysis</p>
          <p className="text-slate-700 text-base leading-relaxed">
            Want feedback on how you recite? Live Tajweed analysis is in the QariAI Android app.
          </p>
          <a
            href={PLAY_STORE_URL}
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
      </section>

      <Card heading="Good to know">
        <Bullets
          items={[
            'No account and no ads.',
            'Educational use only — not a source of religious rulings or tafsir.',
            <>See the <Link href="/arabic-roots/plugin/privacy" className="text-emerald-600 hover:underline">privacy policy</Link>, <Link href="/arabic-roots/plugin/terms" className="text-emerald-600 hover:underline">terms</Link> and <Link href="/arabic-roots/plugin/support" className="text-emerald-600 hover:underline">support</Link>.</>,
          ]}
        />
      </Card>
    </PluginShell>
  );
}
