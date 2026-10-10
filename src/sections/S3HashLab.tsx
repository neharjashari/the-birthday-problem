import { useMemo, useState, type CSSProperties } from 'react';
import { BucketDuel } from '../components/BucketDuel';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Big, Duration, DurationMs, Pow2 } from '../components/Num';
import { Prose, T, TNodes } from '../components/Text';
import { useTheme } from '../components/theme';
import { HashHex, Legend, ProgressBar, Section, Slider, TooltipBox } from '../components/ui';
import { useAttackWorker, type AttackState } from '../hooks/useAttackWorker';
import { useI18n } from '../i18n';
import { DEFAULT_EXPERIMENT, type CollisionResult, type PreimageResult } from '../lib/attacks';
import { expectedCollisionAttempts, expectedPreimageAttempts } from '../lib/birthday';
import { fmtInt, fmtNum } from '../lib/format';

export function S3HashLab() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const [bits, setBits] = useState(24);
  const collision = useAttackWorker<CollisionResult>();
  const preimage = useAttackWorker<PreimageResult>();
  const running = collision.state.status === 'running' || preimage.state.status === 'running';

  const changeBits = (b: number) => {
    setBits(b);
    collision.reset();
    preimage.reset();
  };

  return (
    <Section id="hash-lab" title="s3.title">
      <Prose k="s3.intro" />
      <div className="grid-2">
        <div className="card def" style={{ '--c': colors.collision } as CSSProperties}>
          <p>
            <T k="s3.def.collision" />
          </p>
        </div>
        <div className="card def" style={{ '--c': colors.preimage } as CSSProperties}>
          <p>
            <T k="s3.def.preimage" />
          </p>
        </div>
      </div>

      <BucketDuel />

      <h3 style={{ marginBottom: 0 }}>{t('s3.real.title')}</h3>
      <p className="small" style={{ marginTop: 4 }}>{t('s3.real.desc')}</p>

      <div className="card stack">
        <Slider
          label={t('s3.bits')}
          value={bits}
          min={8}
          max={40}
          step={4}
          display={
            <>
              {t('s2.bitsValue', { bits })} · N = <Pow2 bits={bits} />
            </>
          }
          onChange={changeBits}
          disabled={running}
        />
        <div className="btn-row">
          <button className="btn" disabled={running} onClick={() => collision.start({ type: 'collision', bits })}>
            {t('s3.run.collision')}
          </button>
          <button className="btn" disabled={running} onClick={() => preimage.start({ type: 'preimage', bits })}>
            {t('s3.run.preimage')}
          </button>
          <button
            className="btn secondary"
            disabled={running}
            onClick={() => {
              collision.start({ type: 'collision', bits });
              preimage.start({ type: 'preimage', bits });
            }}
          >
            {t('s3.run.race')}
          </button>
          <button
            className="btn ghost"
            disabled={!running}
            onClick={() => {
              collision.stop();
              preimage.stop();
            }}
          >
            {t('s3.stop')}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <AttackPanel kind="collision" bits={bits} state={collision.state} color={colors.collision} />
        <AttackPanel kind="preimage" bits={bits} state={preimage.state} color={colors.preimage} />
      </div>

      <Experiment />
    </Section>
  );
}

function AttackPanel({
  kind,
  bits,
  state,
  color,
}: {
  kind: 'collision' | 'preimage';
  bits: number;
  state: AttackState<CollisionResult | PreimageResult>;
  color: string;
}) {
  const { t, lang } = useI18n();
  const expected = kind === 'collision' ? expectedCollisionAttempts(bits) : expectedPreimageAttempts(bits);
  const rate = state.elapsedMs > 50 ? state.attempts / (state.elapsedMs / 1000) : 0;
  const r = state.result;

  const statusText =
    state.status === 'running'
      ? t('s3.status.running')
      : state.status === 'stopped'
        ? t('s3.status.stopped')
        : state.status === 'done' && r
          ? null
          : t('s3.status.idle');

  return (
    <div
      className="card panel"
      style={{ '--c': color, '--c-soft': kind === 'collision' ? 'var(--collision-soft)' : 'var(--preimage-soft)' } as CSSProperties}
      aria-live="polite"
    >
      <h3>
        {t(kind === 'collision' ? 's3.panel.collision' : 's3.panel.preimage')}
        {statusText && <span className="status">{statusText}</span>}
      </h3>
      <div className="muted small">{t('s3.attempts')}</div>
      <div className="big-count">{fmtInt(state.attempts, lang)}</div>
      <ProgressBar fraction={state.attempts / expected} color={color} />
      <dl className="kv">
        <dt>{t('s3.expected')}</dt>
        <dd>
          <Big log10={Math.log10(expected)} approx />
        </dd>
        <dt>{t('s3.rate')}</dt>
        <dd>{rate ? t('s3.rateValue', { rate: fmtInt(rate, lang) }) : '–'}</dd>
        <dt>{t('s3.eta')}</dt>
        <dd>{rate ? <Duration log10Seconds={Math.log10(expected / rate)} /> : '–'}</dd>
      </dl>

      {state.status === 'done' && r && (
        <div>
          <p className="small" style={{ margin: '12px 0 0', color: 'var(--ink)' }}>
            <strong>
              <TNodes k="s3.status.done" vars={{ attempts: fmtInt(r.attempts, lang) }} nodes={{ time: <DurationMs ms={r.elapsedMs} /> }} />
            </strong>
          </p>
          {r.kind === 'collision' ? (
            <>
              <HashBox label={t('s3.msgA')} message={r.a.message} hash={r.a.hash} bits={bits} />
              <HashBox label={t('s3.msgB')} message={r.b.message} hash={r.b.hash} bits={bits} />
            </>
          ) : (
            <>
              <HashBox label={t('s3.target')} message={r.target.message} hash={r.target.hash} bits={bits} />
              <HashBox label={t('s3.match')} message={r.found.message} hash={r.found.hash} bits={bits} />
            </>
          )}
          <p className="small muted" style={{ marginTop: 8 }}>
            {t('s3.highlight', { k: bits })}
          </p>
        </div>
      )}
    </div>
  );
}

function HashBox({ label, message, hash, bits }: { label: string; message: string; hash: string; bits: number }) {
  return (
    <div className="hash-box">
      <div className="muted small">{label}</div>
      <div className="msg">“{message}”</div>
      <HashHex hex={hash} bits={bits} />
    </div>
  );
}

function Experiment() {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const exp = useAttackWorker();
  const running = exp.state.status === 'running';

  const data = useMemo(() => {
    const rows = [];
    for (let k = 4; k <= 32; k += 2) {
      const c = exp.state.points.find((p) => p.kind === 'collision' && p.bits === k);
      const p = exp.state.points.find((p) => p.kind === 'preimage' && p.bits === k);
      rows.push({
        k,
        theoryC: Math.log2(expectedCollisionAttempts(k)),
        theoryP: k,
        measuredC: c ? Math.log2(c.meanAttempts) : undefined,
        measuredP: p ? Math.log2(p.meanAttempts) : undefined,
      });
    }
    return rows;
  }, [exp.state.points]);

  const total = DEFAULT_EXPERIMENT.collisionBits.length + DEFAULT_EXPERIMENT.preimageBits.length;
  const last = exp.state.points[exp.state.points.length - 1];

  return (
    <div className="card stack">
      <div>
        <h3>{t('s3.exp.title')}</h3>
        <p className="small">{t('s3.exp.desc', { trials: DEFAULT_EXPERIMENT.trials })}</p>
        <div className="btn-row">
          <button className="btn" disabled={running} onClick={() => exp.start({ type: 'experiment', plan: DEFAULT_EXPERIMENT })}>
            {t('s3.exp.run')}
          </button>
          {running && (
            <>
              <button className="btn ghost" onClick={exp.stop}>
                {t('s3.stop')}
              </button>
              <span className="small muted">
                {exp.state.points.length} / {total}
                {last ? ` · k = ${last.bits}` : ''}
              </span>
            </>
          )}
        </div>
      </div>

      <div>
        <Legend
          items={[
            { label: t('s3.exp.collision'), color: colors.collision, kind: 'dot' },
            { label: t('s3.exp.theoryC'), color: colors.collision, kind: 'dash' },
            { label: t('s3.exp.preimage'), color: colors.preimage, kind: 'dot' },
            { label: t('s3.exp.theoryP'), color: colors.preimage, kind: 'dash' },
          ]}
        />
        <div className="chart" style={{ height: 320 }}>
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 20, left: 0 }}>
              <CartesianGrid stroke={colors.grid} vertical={false} />
              <XAxis
                dataKey="k"
                type="number"
                domain={[4, 32]}
                ticks={[4, 8, 12, 16, 20, 24, 28, 32]}
                stroke={colors.axis}
                tick={{ fill: colors.muted, fontSize: 12 }}
                label={{ value: t('s3.exp.x'), position: 'insideBottom', offset: -12, fill: colors.muted, fontSize: 12 }}
              />
              <YAxis
                domain={[0, 32]}
                ticks={[0, 8, 16, 24, 32]}
                stroke={colors.axis}
                tick={{ fill: colors.muted, fontSize: 12 }}
                width={44}
                label={{ value: t('s3.exp.y'), angle: -90, position: 'insideLeft', offset: 14, fill: colors.muted, fontSize: 12, style: { textAnchor: 'middle' } }}
              />
              <Tooltip
                cursor={{ stroke: colors.axis }}
                content={({ active, payload }) => {
                  const p = payload?.[0]?.payload as (typeof data)[number] | undefined;
                  if (!active || !p) return null;
                  const pow = (v?: number) => (v === undefined ? '–' : `2^${fmtNum(v, lang, 1)}`);
                  return (
                    <TooltipBox
                      title={`k = ${p.k}`}
                      rows={[
                        { label: t('s3.exp.collision'), value: pow(p.measuredC), color: colors.collision },
                        { label: t('s3.exp.theoryC'), value: pow(p.theoryC) },
                        { label: t('s3.exp.preimage'), value: pow(p.measuredP), color: colors.preimage },
                        { label: t('s3.exp.theoryP'), value: pow(p.theoryP) },
                      ]}
                    />
                  );
                }}
              />
              <Line dataKey="theoryC" stroke={colors.collision} strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
              <Line dataKey="theoryP" stroke={colors.preimage} strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
              <Scatter dataKey="measuredC" fill={colors.collision} stroke={colors.surface} strokeWidth={2} isAnimationActive={false} />
              <Scatter dataKey="measuredP" fill={colors.preimage} stroke={colors.surface} strokeWidth={2} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="small muted">{t('s3.exp.note')}</p>
      </div>
    </div>
  );
}
