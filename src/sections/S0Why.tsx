import { useState } from 'react';
import { Prose, T } from '../components/Text';
import { Section } from '../components/ui';
import { useI18n } from '../i18n';
import { fmtInt } from '../lib/format';
import { sha256Hex, utf8ToBytes } from '../lib/hash';

/** Book §5.1: why we sign a short hash instead of the whole document. */
export function S0Why() {
  const { t, lang } = useI18n();
  const [edited, setEdited] = useState<string | null>(null);
  const doc = edited ?? t('why.doc');
  const hex = sha256Hex(doc);

  return (
    <Section id="why" title="why.title">
      <Prose k="why.intro" />

      <div className="flow">
        <label className="card flow-step">
          <span className="flow-num">1</span>
          <span className="flow-title">{t('why.docLabel')}</span>
          <textarea value={doc} onChange={(e) => setEdited(e.target.value)} rows={5} spellCheck={false} />
          <span className="small muted">{t('why.bytes', { n: fmtInt(utf8ToBytes(doc).length, lang) })}</span>
        </label>
        <div className="flow-arrow" aria-hidden="true">
          <span>SHA-256</span>→
        </div>
        <div className="card flow-step">
          <span className="flow-num">2</span>
          <span className="flow-title">{t('why.digest')}</span>
          <code className="flow-hash">{hex}</code>
          <span className="small muted">{t('why.bytes', { n: 32 })}</span>
        </div>
        <div className="flow-arrow" aria-hidden="true">
          <span>{t('why.signVerb')}</span>→
        </div>
        <div className="card flow-step">
          <span className="flow-num">3</span>
          <span className="flow-title">{t('why.sign')}</span>
          <span className="flow-sig">✍ Alice</span>
          <span className="small muted">{t('why.signNote')}</span>
        </div>
      </div>
      <p className="small muted" style={{ margin: '8px 0 0' }}>{t('why.tryIt')}</p>

      <div className="callout">
        <p>
          <T k="why.callout" />
        </p>
      </div>
    </Section>
  );
}
