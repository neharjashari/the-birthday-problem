import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Prose, T } from '../components/Text';
import { Section } from '../components/ui';
import { useI18n, type MessageKey } from '../i18n';
import { fmtInt, fmtPct } from '../lib/format';
import { bytesToHex, sha256Bytes, utf8ToBytes } from '../lib/hash';

const PROPS: Array<{ key: string; work?: 'n' | 'half' }> = [
  { key: 'compress' },
  { key: 'efficient' },
  { key: 'oneway', work: 'n' },
  { key: 'weak', work: 'n' },
  { key: 'strong', work: 'half' },
];

/** What a cryptographic hash is, shown on real SHA-256. */
export function S0Hash() {
  const { t, lang } = useI18n();
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const textA = a ?? t('hash.defaultA');
  const textB = b ?? t('hash.defaultB');

  const da = useMemo(() => sha256Bytes(utf8ToBytes(textA)), [textA]);
  const db = useMemo(() => sha256Bytes(utf8ToBytes(textB)), [textB]);
  const diff = useMemo(() => {
    const bits: boolean[] = [];
    for (let i = 0; i < 32; i++) for (let j = 7; j >= 0; j--) bits.push((((da[i] ^ db[i]) >> j) & 1) === 1);
    return bits;
  }, [da, db]);
  const changed = diff.filter(Boolean).length;
  const rate = useHashRate();

  return (
    <Section id="hash" title="hash.title">
      <Prose k="hash.intro" />

      <div className="card stack">
        <h3>{t('hash.lab')}</h3>
        <div className="grid-2">
          <HashInput label={t('hash.a')} value={textA} onChange={setA} hex={bytesToHex(da)} diff={diff} />
          <HashInput label={t('hash.b')} value={textB} onChange={setB} hex={bytesToHex(db)} diff={diff} />
        </div>
        <div className="avalanche">
          <div className="bitgrid" aria-hidden="true">
            {diff.map((d, i) => (
              <span key={i} className={d ? 'on' : undefined} />
            ))}
          </div>
          <div>
            <div className="hero-number" style={{ margin: 0 }}>
              <b>{changed}</b>
              <span className="muted">/ 256</span>
            </div>
            <p style={{ margin: 0 }}>
              <T k="hash.changed" vars={{ pct: fmtPct(changed / 256, lang, 0) }} />
            </p>
          </div>
        </div>
      </div>

      <h3>{t('hash.props.title')}</h3>
      <div className="props">
        {PROPS.map((p) => (
          <div key={p.key} className={`card prop${p.work === 'half' ? ' highlight' : ''}`}>
            <div className="prop-name">
              <T k={`hash.p.${p.key}.name` as MessageKey} />
            </div>
            <p className="small" style={{ margin: 0 }}>
              <T k={`hash.p.${p.key}.desc` as MessageKey} vars={{ rate: rate ? fmtInt(rate, lang) : '…' }} />
            </p>
            {p.work && (
              <div className="prop-work">
                <span className="small muted">{t('hash.work')}</span>
                <b>
                  2<sup>{p.work === 'n' ? 'n' : 'n/2'}</sup>
                </b>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="callout">
        <p>
          <T k="hash.toParadox" />{' '}
          <a href="#paradox">{t('hash.toParadox.link')}</a>
        </p>
      </div>
    </Section>
  );
}

function HashInput(props: { label: string; value: string; onChange: (v: string) => void; hex: string; diff: boolean[] }) {
  const { label, value, onChange, hex, diff } = props;
  return (
    <label className="field" style={{ display: 'grid', gap: 6 }}>
      <span className="small muted">{label}</span>
      <input type="text" className="text-input" value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
      <code className="hex-diff">
        {hex.split('').map((c, i) => {
          // a hex digit covers bits 4i..4i+3
          const hit = diff[4 * i] || diff[4 * i + 1] || diff[4 * i + 2] || diff[4 * i + 3];
          return (
            <span key={i} className={hit ? 'hit' : undefined} style={{ '--i': i } as CSSProperties}>
              {c}
            </span>
          );
        })}
      </code>
    </label>
  );
}

/** Measures SHA-256 throughput on this device for ~40 ms, once. */
function useHashRate(): number | null {
  const [rate, setRate] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      const msg = utf8ToBytes('the birthday problem');
      let count = 0;
      const t0 = performance.now();
      // the count cap keeps this finite even where the clock does not advance (e.g. headless virtual time)
      while (performance.now() - t0 < 40 && count < 200_000) {
        for (let i = 0; i < 200; i++) sha256Bytes(msg);
        count += 200;
      }
      setRate(Math.round(count / ((performance.now() - t0) / 1000)));
    }, 300);
    return () => clearTimeout(id);
  }, []);
  return rate;
}
