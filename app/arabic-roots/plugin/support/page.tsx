import type { Metadata } from 'next';
import { Bullets, Card, PageTitle, PLAY_STORE_URL, PLUGIN_BASE, PluginShell, SUPPORT_EMAIL } from '../PluginShell';

export const metadata: Metadata = {
  title: 'Support — QariAI Arabic Roots Plugin | QariAI',
  description:
    'Contact QariAI support, report a wrong root or gloss in the Arabic Roots ChatGPT plugin, and read short answers to common questions.',
  alternates: { canonical: `${PLUGIN_BASE}/support` },
};

const FAQ = [
  {
    q: 'Which words are covered?',
    a: 'At launch only verified words. Currently that is 21:33 يَسْبَحُونَ. More will be added as they are verified.',
  },
  {
    q: 'Does it need an account?',
    a: 'No. There is no sign-up, and it does not store your answers or progress.',
  },
  {
    q: 'Can it check my recitation?',
    a: 'Not in ChatGPT. Live Tajweed analysis is in the QariAI Android app.',
  },
  {
    q: 'Is it a source of religious rulings or tafsir?',
    a: 'No. It is for learning Arabic roots only. For rulings or interpretation, ask a qualified scholar.',
  },
];

export default function Support() {
  return (
    <PluginShell>
      <PageTitle title="Support" intro="Help with QariAI Arabic Roots, a ChatGPT plugin by Qaf Studio." />

      <Card heading="Contact">
        <p>
          Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 font-semibold hover:underline">{SUPPORT_EMAIL}</a>.
        </p>
      </Card>

      <Card heading="Report a wrong root or gloss">
        <p>Accuracy matters. If something looks wrong, email us with:</p>
        <Bullets
          items={[
            'The word and its verse reference (for example, 21:33).',
            'What the plugin said — the root or the gloss.',
            'What you think is correct, and a source if you have one.',
          ]}
        />
        <p>We will review it and correct the entry if it is wrong.</p>
      </Card>

      <section>
        <h2 className="font-bold text-emerald-900 text-lg mb-3">FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((f) => (
            <div key={f.q} className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
              <h3 className="font-semibold text-slate-800 text-sm mb-1">{f.q}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-sm mt-4">
          Looking for live Tajweed feedback?{' '}
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            Get the QariAI Android app
          </a>.
        </p>
      </section>
    </PluginShell>
  );
}
