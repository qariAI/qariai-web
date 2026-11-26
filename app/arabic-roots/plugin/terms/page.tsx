import Link from 'next/link';
import type { Metadata } from 'next';
import { Bullets, Card, PageTitle, PLUGIN_BASE, PluginShell, SUPPORT_EMAIL, Updated } from '../PluginShell';

export const metadata: Metadata = {
  title: 'Terms of Use — QariAI Arabic Roots Plugin | QariAI',
  description:
    'Plain-language terms for the QariAI Arabic Roots ChatGPT plugin: educational use only, not a source of religious rulings or tafsir, provided as is.',
  alternates: { canonical: `${PLUGIN_BASE}/terms` },
};

export default function Terms() {
  return (
    <PluginShell>
      <PageTitle
        title="Terms of Use"
        intro="Plain-language terms for QariAI Arabic Roots, a ChatGPT plugin by Qaf Studio. By using the plugin you agree to them."
      />
      <Updated />

      <Card heading="Educational use only">
        <p>
          The plugin helps you learn Arabic word roots from words in the Quran. It is a study aid, nothing more.
        </p>
      </Card>

      <Card heading="Not a source of rulings or tafsir">
        <Bullets
          items={[
            'It does not give fatwas or religious rulings.',
            'It is not tafsir (Quranic commentary) and does not interpret the meaning of verses.',
            'For rulings or interpretation, ask a qualified scholar.',
          ]}
        />
      </Card>

      <Card heading="Provided as is">
        <p>
          The plugin is provided “as is”, without warranties of any kind. At launch it covers only verified words, but we
          cannot promise it is free of errors or always available. To the extent the law allows, Qaf Studio is not liable for
          any loss from using it. If you spot a mistake, please tell us via the{' '}
          <Link href="/arabic-roots/plugin/support" className="text-emerald-600 hover:underline">support page</Link>.
        </p>
      </Card>

      <Card heading="Using it fairly">
        <p>Please do not misuse the plugin or try to disrupt it. We may change or stop it at any time.</p>
      </Card>

      <Card heading="Your data">
        <p>
          See the <Link href="/arabic-roots/plugin/privacy" className="text-emerald-600 hover:underline">privacy policy</Link> for
          what the plugin receives.
        </p>
      </Card>

      <Card heading="Contact">
        <p>
          Questions about these terms:{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-emerald-600 hover:underline">{SUPPORT_EMAIL}</a>.
        </p>
      </Card>
    </PluginShell>
  );
}
