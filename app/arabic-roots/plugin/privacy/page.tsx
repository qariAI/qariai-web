import type { Metadata } from 'next';
import { Bullets, Card, PageTitle, PLUGIN_BASE, PluginShell, SUPPORT_EMAIL, Updated } from '../PluginShell';

export const metadata: Metadata = {
  title: 'Privacy Policy — QariAI Arabic Roots Plugin | QariAI',
  description:
    'What the QariAI Arabic Roots ChatGPT plugin receives and what it does not: no accounts, no audio, no ads, no stored answers or progress.',
  alternates: { canonical: `${PLUGIN_BASE}/privacy` },
};

export default function Privacy() {
  return (
    <PluginShell>
      <PageTitle
        title="Privacy Policy"
        intro="QariAI Arabic Roots is a ChatGPT plugin by Qaf Studio. It is built to know as little about you as possible."
      />
      <Updated />

      <Card heading="What the plugin receives">
        <p>Only what is needed to answer you:</p>
        <Bullets
          items={[
            'The word or verse reference you ask about (for example, 21:33).',
            'The answers you type during a drill in ChatGPT.',
          ]}
        />
      </Card>

      <Card heading="What it does not collect">
        <Bullets
          items={[
            'No accounts or sign-in.',
            'No audio. The plugin never hears your voice.',
            'No ads and no ad tracking.',
            'No stored answers and no stored progress. Each drill stands on its own.',
            'Server logs hold no personal data.',
          ]}
        />
      </Card>

      <Card heading="ChatGPT">
        <p>
          You use the plugin inside ChatGPT, which is a separate service. How ChatGPT handles your conversations is governed by
          its own terms and privacy policy, not this one.
        </p>
      </Card>

      <Card heading="Changes and questions">
        <p>
          If this policy changes, we will update this page and its date. Questions? Email{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:underline">{SUPPORT_EMAIL}</a>.
        </p>
      </Card>
    </PluginShell>
  );
}
