import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { DurationMs, Pow2 } from '../components/Num';
import { Prose, T, TNodes } from '../components/Text';
import { CheckIcon, HashHex, ProgressBar, Section, Slider } from '../components/ui';
import { useAttackWorker } from '../hooks/useAttackWorker';
import { useI18n } from '../i18n';
import type { YuvalResult } from '../lib/attacks';
import { CONTRACTS, choiceCount, parseTemplate, renderVariant, variantParts, type Segment } from '../lib/contracts';
import { fmtInt } from '../lib/format';
import { sha256Hex } from '../lib/hash';
import { signAndVerify, type SignatureDemo } from '../lib/signature';

export function S5Yuval() {
  const { t, lang } = useI18n();
  const [bits, setBits] = useState(32);
  const [showWs, setShowWs] = useState(true);
  const yuval = useAttackWorker<YuvalResult>();
  const [sig, setSig] = useState<SignatureDemo | null>(null);
  const { state } = yuval;
  const running = state.status === 'running';
  const result = state.status === 'done' ? state.result : null;

  const templates = CONTRACTS[lang];
  const fair = useMemo(() => parseTemplate(templates.fair), [templates]);
  const fraud = useMemo(() => parseTemplate(templates.fraud), [templates]);
  const choices = Math.min(choiceCount(fair), choiceCount(fraud));

  // Results refer to the template of one language: start over when the language changes.
  const { reset } = yuval;
  useEffect(() => {
    reset();
    setSig(null);
  }, [lang, reset]);

  useEffect(() => {
    setSig(null);
    if (result) signAndVerify(result.fairHash, result.fraudHash, result.bits).then(setSig, () => setSig(null));
  }, [result]);

  const half = 2 ** Math.ceil(bits / 2);
  // while the worker runs, show the variant it is hashing right now (the "factory")
  const fairCount = Math.min(half, 2 ** choiceCount(fair));
  const liveFair = state.phase === 'fraud' ? fairCount - 1 : Math.max(0, state.attempts - 1);
  const liveFraud = state.phase === 'fraud' ? Math.max(0, state.attempts - fairCount - 1) : 0;
  const fairIndex = result?.fairIndex ?? (running ? liveFair : 0);
  const fraudIndex = result?.fraudIndex ?? (running ? liveFraud : 0);
  const fairHash = result?.fairHash ?? sha256Hex(renderVariant(fair, fairIndex));
  const fraudHash = result?.fraudHash ?? sha256Hex(renderVariant(fraud, fraudIndex));
  const forged = !!(result && sig?.validOnFair && sig.validOnFraud);

  return (
    <Section id="yuval" title="s5.title">
      <Prose k="s5.intro" />
      <ol className="steps">
        {(['s5.step1', 's5.step2', 's5.step3', 's5.step4'] as const).map((k) => (
          <li key={k}>
            <T k={k} />
          </li>
        ))}
      </ol>
      <Prose k="s5.why" vars={{ choices }} />

      <div className="card stack">
        <Slider
          label={t('s3.bits')}
          value={bits}
          min={16}
          max={36}
          step={4}
          display={t('s2.bitsValue', { bits })}
          disabled={running}
          onChange={(b) => {
            setBits(b);
            yuval.reset();
          }}
        />
        <div className="btn-row">
          <button
            className="btn"
            disabled={running}
            onClick={() => yuval.start({ type: 'yuval', bits, fair: templates.fair, fraud: templates.fraud })}
          >
            {t('s5.run')}
          </button>
          {running && (
            <button className="btn ghost" onClick={yuval.stop}>
              {t('s3.stop')}
            </button>
          )}
          <label className="check">
            <input type="checkbox" checked={showWs} onChange={(e) => setShowWs(e.target.checked)} />
            {t('s5.showInvisible')}
          </label>
        </div>

        <div aria-live="polite">
          {state.status === 'idle' && <p className="small muted">{t('s5.placeholder')}</p>}
          {running && (
            <div className="stack" style={{ maxWidth: 480 }}>
              <span className="small">
                {t(state.phase === 'fraud' ? 's5.phase.fraud' : 's5.phase.fair')} {fmtInt(state.attempts, lang)}
              </span>
              <ProgressBar
                fraction={state.phase === 'fraud' ? 0.5 + Math.min(0.5, (state.attempts - half) / half / 2) : state.attempts / half / 2}
                color="var(--accent)"
              />
            </div>
          )}
          {result && (
            <p style={{ color: 'var(--ink)' }}>
              <TNodes
                k="s5.result"
                vars={{ fair: fmtInt(result.fairVariantsTried, lang), fraud: fmtInt(result.fraudVariantsTried, lang) }}
                nodes={{ time: <DurationMs ms={result.elapsedMs} />, brute: <Pow2 bits={result.bits} /> }}
              />
            </p>
          )}
          {state.status === 'done' && !result && <p className="small muted">–</p>}
        </div>
      </div>

      <div className={`grid-2 yuval-pair${running ? ' factory' : ''}`}>
        {result && (
          <div className="match-bridge" aria-live="polite">
            <span>{t('s5.sameHash')}</span>
            <code>{result.fairHash.slice(0, Math.ceil(bits / 4))}</code>
          </div>
        )}
        <ContractCard
          title={t('s5.fair')}
          stamp={forged ? 'signed' : null}
          segments={fair}
          index={fairIndex}
          hash={fairHash}
          bits={bits}
          showWs={showWs}
          tone="var(--collision-soft)"
        />
        <ContractCard
          title={t('s5.fraud')}
          stamp={forged ? 'forged' : null}
          segments={fraud}
          index={fraudIndex}
          hash={fraudHash}
          bits={bits}
          showWs={showWs}
          tone="var(--preimage-soft)"
        />
      </div>
      <p className="small muted" style={{ marginTop: 8 }}>
        {t('s5.legend')}
      </p>

      {result && sig && (
        <div className="card">
          <div className="sig-ok">
            <CheckIcon /> {t('s5.sigOk')}
          </div>
          <div className="hash-box">
            <div className="muted small">ECDSA P-256 · Alice</div>
            <span className="hex">{sig.signatureHex}</span>
          </div>
          <p className="small muted" style={{ margin: '8px 0 0' }}>
            verify(fair) = {String(sig.validOnFair)} · verify(fraud) = {String(sig.validOnFraud)}
          </p>
        </div>
      )}

      <div className="callout">
        <p>
          <T k="s5.defense" />
        </p>
      </div>
    </Section>
  );
}

function ContractCard(props: {
  title: string;
  segments: Segment[];
  index: number;
  hash: string;
  bits: number;
  showWs: boolean;
  tone: string;
  stamp: 'signed' | 'forged' | null;
}) {
  const { t } = useI18n();
  const { title, segments, index, hash, bits, showWs, tone, stamp } = props;
  const parts = useMemo(() => variantParts(segments, index), [segments, index]);

  return (
    <div className="card contract-card">
      {stamp && (
        <div className={`stamp ${stamp}`} aria-label={t('s5.stamp.valid')}>
          <span className="stamp-sig">✍ Alice</span>
          <span className="stamp-ok">✓ {t('s5.stamp.valid')}</span>
        </div>
      )}
      <h3 style={{ marginBottom: 0 }}>{title}</h3>
      <div className="small muted">{t('s5.variant', { i: index })}</div>
      <div className="contract" key={index}>
        {parts.map((p, i) =>
          p.choice === undefined ? (
            <span key={i}>{p.text}</span>
          ) : p.whitespace ? (
            <span key={i} className="ws">
              {showWs && p.text.length > 1 ? ' ␣' : p.text}
            </span>
          ) : (
            <span key={i} className="choice">
              {p.text}
            </span>
          ),
        )}
      </div>
      <div className="hash-box" style={{ '--c-soft': tone } as CSSProperties}>
        <div className="muted small">SHA-256</div>
        <HashHex hex={hash} bits={bits} />
      </div>
    </div>
  );
}
