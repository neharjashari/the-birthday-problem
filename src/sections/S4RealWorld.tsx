import { useState } from 'react';
import { Duration } from '../components/Num';
import { T } from '../components/Text';
import { CheckIcon, CrossIcon, Section } from '../components/ui';
import { useI18n, type MessageKey } from '../i18n';
import { LOG10_2 } from '../lib/format';
import { log2SamplesForCollision } from '../lib/birthday';

const SPEEDS: Array<{ key: MessageKey; log10: number }> = [
  { key: 's4.speed.cpu', log10: 7 },
  { key: 's4.speed.gpu', log10: 10 },
  { key: 's4.speed.cluster', log10: 13 },
  { key: 's4.speed.state', log10: 18 },
];

const HASHES: Array<{ name: string; bits: number; broken: boolean; known: MessageKey }> = [
  { name: 'MD5', bits: 128, broken: true, known: 's4.known.md5' },
  { name: 'SHA-1', bits: 160, broken: true, known: 's4.known.sha1' },
  { name: 'SHA-256', bits: 256, broken: false, known: 's4.known.none' },
  { name: 'SHA-512 / SHA3-512', bits: 512, broken: false, known: 's4.known.none' },
];

const CARDS: Array<[MessageKey, MessageKey]> = [
  ['s4.card.sig.title', 's4.card.sig'],
  ['s4.card.sweet32.title', 's4.card.sweet32'],
  ['s4.card.gcm.title', 's4.card.gcm'],
  ['s4.card.uuid.title', 's4.card.uuid'],
];

export function S4RealWorld() {
  const { t } = useI18n();
  const [speed, setSpeed] = useState(SPEEDS[1]);

  return (
    <Section id="practice" title="s4.title">
      <div className="callout">
        <p>
          <T k="s4.rule" />
        </p>
      </div>

      <div className="card stack">
        <div className="btn-row" style={{ justifyContent: 'space-between' }}>
          <span className="small muted">{t('s4.speed')}</span>
          <div className="segmented" role="group" aria-label={t('s4.speed')}>
            {SPEEDS.map((s) => (
              <button key={s.key} aria-pressed={s === speed} onClick={() => setSpeed(s)}>
                {t(s.key)} · 10<sup>{s.log10}</sup>/s
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="wide">
            <thead>
              <tr>
                <th>{t('s4.th.fn')}</th>
                <th>{t('s4.th.out')}</th>
                <th>{t('s4.th.res')}</th>
                <th>{t('s4.th.time')}</th>
                <th>{t('s4.th.known')}</th>
              </tr>
            </thead>
            <tbody>
              {HASHES.map((h) => (
                <tr key={h.name}>
                  <td>
                    <strong>{h.name}</strong>
                    <br />
                    {h.broken ? (
                      <span className="badge bad">
                        <CrossIcon /> {t('s4.broken')}
                      </span>
                    ) : (
                      <span className="badge good">
                        <CheckIcon /> {t('s4.secure')}
                      </span>
                    )}
                  </td>
                  <td className="num" data-label={t('s4.th.out')}>
                    <span>{t('s4.bits', { bits: h.bits })}</span>
                  </td>
                  <td className="num" data-label={t('s4.th.res')}>
                    <span>
                      2<sup>{h.bits / 2}</sup>
                    </span>
                  </td>
                  <td className="num" data-label={t('s4.th.time')}>
                    <Duration log10Seconds={log2SamplesForCollision(h.bits) * LOG10_2 - speed.log10} />
                  </td>
                  <td className="small known" data-label={t('s4.th.known')}>
                    <T k={h.known} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          <T k="s4.timeNote" />
        </p>
      </div>

      <h3>{t('s4.cards.title')}</h3>
      <div className="grid-2">
        {CARDS.map(([title, body]) => (
          <div className="card" key={title}>
            <h3>{t(title)}</h3>
            <p style={{ margin: 0 }}>
              <T k={body} />
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
