import { useMemo, useState, type ReactElement } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Prose, T } from '../components/Text';
import { useTheme } from '../components/theme';
import { Legend, Section, Slider, Tile, TooltipBox } from '../components/ui';
import { useI18n } from '../i18n';
import { DAYS, pairs, probCollisionExact, probMatchYours, randomBirthdays, sharedBirthdays, simulateRooms } from '../lib/birthday';
import { fmtDayOfYear, fmtInt, fmtPct, monthName } from '../lib/format';

const MAX_PEOPLE = 100;
const SIM_ROOMS = 10_000;
const YEAR = 2025; // any non-leap year

export function S1Paradox() {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const [n, setN] = useState(23);

  const curve = useMemo(
    () =>
      Array.from({ length: MAX_PEOPLE }, (_, i) => ({
        n: i + 1,
        any: probCollisionExact(i + 1),
        yours: probMatchYours(i + 1),
      })),
    [],
  );

  return (
    <Section id="paradox" title="s1.title">
      <GuessCard />

      <Prose k="s1.why" />
      <div>
        <div className="formula">
          {t('s1.f.none')} = <Frac a="365" b="365" /> × <Frac a="364" b="365" /> × <Frac a="363" b="365" /> × … ×{' '}
          <Frac a="365 − n + 1" b="365" />
        </div>
        <div className="formula">
          {t('s1.f.match')} = 1 − {t('s1.f.none')}
        </div>
      </div>

      <div className="card stack">
        <Slider label={t('s1.slider')} value={n} min={2} max={MAX_PEOPLE} onChange={setN} />
        <div className="tiles">
          <Tile label={<T k="s1.tile.any" />} value={fmtPct(probCollisionExact(n), lang)} color={colors.collision} />
          <Tile label={<T k="s1.tile.yours" />} value={fmtPct(probMatchYours(n), lang)} color={colors.preimage} />
          <Tile label={<T k="s1.tile.pairs" />} value={fmtInt(pairs(n), lang)} />
        </div>

        <div>
          <div className="chart-head">
            <h3>{t('s1.chart.title')}</h3>
            <Legend
              items={[
                { label: t('s1.chart.any'), color: colors.collision, kind: 'line' },
                { label: t('s1.chart.yours'), color: colors.preimage, kind: 'line' },
              ]}
            />
          </div>
          <div className="chart">
            <ResponsiveContainer>
              <LineChart data={curve} margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
                <CartesianGrid stroke={colors.grid} vertical={false} />
                <XAxis
                  dataKey="n"
                  type="number"
                  domain={[1, MAX_PEOPLE]}
                  ticks={[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                  stroke={colors.axis}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  label={{ value: t('s1.chart.x'), position: 'insideBottom', offset: -12, fill: colors.muted, fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.25, 0.5, 0.75, 1]}
                  tickFormatter={(v: number) => fmtPct(v, lang, 0)}
                  stroke={colors.axis}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  width={48}
                />
                <ReferenceLine y={0.5} stroke={colors.axis} />
                <ReferenceLine x={n} stroke={colors.axis} />
                <Tooltip
                  cursor={{ stroke: colors.axis }}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <TooltipBox
                        title={`${t('s1.chart.x')}: ${payload[0].payload.n}`}
                        rows={[
                          { label: t('s1.chart.any'), value: fmtPct(payload[0].payload.any, lang), color: colors.collision },
                          { label: t('s1.chart.yours'), value: fmtPct(payload[0].payload.yours, lang), color: colors.preimage },
                        ]}
                      />
                    ) : null
                  }
                />
                <Line dataKey="any" stroke={colors.collision} strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line dataKey="yours" stroke={colors.preimage} strokeWidth={2} dot={false} isAnimationActive={false} />
                <ReferenceDot x={n} y={probCollisionExact(n)} r={5} fill={colors.collision} stroke={colors.surface} strokeWidth={2} />
                <ReferenceDot x={n} y={probMatchYours(n)} r={5} fill={colors.preimage} stroke={colors.surface} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="callout">
        <p>
          <T k="s1.insight" />
        </p>
      </div>

      <RoomCard n={n} />

      <a className="card live-cta" href="#live">
        <span className="live-dot" aria-hidden="true" />
        <span>
          <T k="s1.live" />
        </span>
        <span className="btn live-btn">{t('s1.live.open')}</span>
      </a>
    </Section>
  );
}

function Frac({ a, b }: { a: string; b: string }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', fontSize: '0.85em', lineHeight: 1.15, margin: '0 2px' }}>
      <span style={{ borderBottom: '1px solid currentColor', padding: '0 2px' }}>{a}</span>
      <span>{b}</span>
    </span>
  );
}

function GuessCard() {
  const { t } = useI18n();
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const g = Number(guess);
  const feedback = !guess ? null : g > 30 ? 's1.guess.high' : g >= 18 ? 's1.guess.close' : 's1.guess.low';

  return (
    <div className="card">
      <p style={{ color: 'var(--ink)', fontWeight: 550 }}>{t('s1.guess.q')}</p>
      <form
        className="btn-row"
        onSubmit={(e) => {
          e.preventDefault();
          setRevealed(true);
        }}
      >
        <input
          type="number"
          min={2}
          max={1000}
          placeholder={t('s1.guess.placeholder')}
          aria-label={t('s1.guess.placeholder')}
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            setRevealed(false);
          }}
        />
        <button className="btn" type="submit">
          {t('s1.guess.reveal')}
        </button>
      </form>
      {revealed && (
        <div style={{ marginTop: 16 }} aria-live="polite">
          <div className="hero-number" style={{ margin: '8px 0' }}>
            <b>23</b>
            <span className="muted">
              <T k="s1.guess.answer" />
            </span>
          </div>
          {feedback && (
            <p style={{ margin: 0 }}>
              <T k={feedback} vars={{ guess: g }} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function RoomCard({ n }: { n: number }) {
  const { t, lang } = useI18n();
  const [days, setDays] = useState<number[] | null>(null);
  const [sim, setSim] = useState<{ n: number; rate: number } | null>(null);

  const monthNames = useMemo(() => Array.from({ length: 12 }, (_, m) => monthName(m, lang, 'short')), [lang]);

  const people = useMemo(() => {
    const byDay = new Map<number, number[]>();
    days?.forEach((d, p) => byDay.set(d, [...(byDay.get(d) ?? []), p]));
    return byDay;
  }, [days]);
  const shared = useMemo(() => (days ? [...sharedBirthdays(days)].sort((x, y) => x[1][1] - y[1][1]) : []), [days]);

  // calendar cells: 12 months × up to 31 days
  const cells: ReactElement[] = [];
  let dayIndex = 0;
  for (let m = 0; m < 12; m++) {
    cells.push(
      <span className="month" key={`m${m}`}>
        {monthNames[m]}
      </span>,
    );
    const len = new Date(YEAR, m + 1, 0).getDate();
    for (let d = 0; d < 31; d++) {
      if (d >= len) {
        cells.push(<span className="gap" key={`g${m}-${d}`} />);
        continue;
      }
      const who = people.get(dayIndex) ?? [];
      const cls = who.length >= 2 ? 'day many' : who.length === 1 ? 'day one' : 'day';
      const title = who.length
        ? `${fmtDayOfYear(dayIndex, lang)}: ${who.map((p) => p + 1).join(', ')}`
        : undefined;
      cells.push(<span className={cls} key={`d${dayIndex}`} title={title} />);
      dayIndex++;
    }
  }


  return (
    <div className="card stack">
      <h3>{t('s1.room.title')}</h3>
      <div className="btn-row">
        <button className="btn" onClick={() => setDays(randomBirthdays(n))}>
          {t('s1.room.fill', { n })}
        </button>
        <button className="btn secondary" onClick={() => setSim({ n, rate: simulateRooms(n, SIM_ROOMS) })}>
          {t('s1.room.sim', { rooms: fmtInt(SIM_ROOMS, lang) })}
        </button>
      </div>

      <div className="calendar" aria-label={`${DAYS}`}>
        {cells}
      </div>
      <Legend
        items={[
          { label: t('s1.room.one'), color: 'color-mix(in srgb, var(--ink-2) 45%, transparent)', kind: 'dot' },
          { label: t('s1.room.many'), color: 'var(--collision)', kind: 'dot' },
        ]}
      />

      <div aria-live="polite">
        {!days && <p className="muted">{t('s1.room.empty')}</p>}
        {days && shared.length === 0 && <p>{t('s1.room.none')}</p>}
        {days && shared.length > 0 && (
          <p style={{ color: 'var(--ink)' }}>
            <T k="s1.room.found" vars={{ a: shared[0][1][0] + 1, b: shared[0][1][1] + 1, date: fmtDayOfYear(shared[0][0], lang) }} />
            {shared.length > 1 && <span className="muted"> {t('s1.room.more', { count: shared.length - 1 })}</span>}
          </p>
        )}
        {sim && (
          <p className="small">
            <T
              k="s1.room.simResult"
              vars={{ rate: fmtPct(sim.rate, lang), rooms: fmtInt(SIM_ROOMS, lang), theory: fmtPct(probCollisionExact(sim.n), lang) }}
            />{' '}
            <span className="muted">(n = {sim.n})</span>
          </p>
        )}
      </div>
    </div>
  );
}
