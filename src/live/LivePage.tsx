import { useEffect, useMemo, useState, type ReactElement } from 'react';
import QRCode from 'qrcode';
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { T } from '../components/Text';
import { useTheme } from '../components/theme';
import { MoonIcon, SunIcon } from '../components/Header';
import { Tile } from '../components/ui';
import { sendVote, useLiveVotes } from '../hooks/useLiveVotes';
import { useI18n } from '../i18n';
import { DAYS, pairs, probCollisionExact } from '../lib/birthday';
import { fmtDayOfYear, fmtInt, fmtNum, fmtPct, monthName } from '../lib/format';
import { dayOfYear, daysInMonth, newRoomCode, tallyVotes } from '../lib/live';

const YEAR = 2025;
/** How many of the most recent factors of the product to spell out. */
const SHOWN_FACTORS = 4;

/** Projector page: QR code, live calendar and the theory recomputed as each birthday arrives. */
export function LivePage({ room }: { room: string }) {
  const { t, lang, setLang } = useI18n();
  const { colors, theme, toggle } = useTheme();
  const { votes, status } = useLiveVotes(room);
  const tally = useMemo(() => tallyVotes(votes), [votes]);
  const n = tally.days.length;

  const voteUrl = `${location.origin}${location.pathname}#vote/${room}`;
  // SVG needs no <canvas>, so it renders the same everywhere
  const [qr, setQr] = useState<{ svg: string } | { error: string } | null>(null);
  useEffect(() => {
    QRCode.toString(voteUrl, { type: 'svg', margin: 1 }).then(
      (svg) => setQr({ svg }),
      (e: unknown) => setQr({ error: String(e) }),
    );
  }, [voteUrl]);

  const curveMax = Math.max(60, n + 10);
  const curve = useMemo(
    () => Array.from({ length: curveMax }, (_, i) => ({ n: i + 1, p: probCollisionExact(i + 1) })),
    [curveMax],
  );

  const pNone = 1 - probCollisionExact(n);
  const firstMatch = [...tally.shared].sort((a, b) => a[1][1] - b[1][1])[0];

  return (
    <main className="live-page">
      <header className="live-bar">
        <a href="#top" className="bar-btn back-btn">
          <ArrowLeft />
          <span>{t('live.back')}</span>
        </a>
        <div className="live-title">
          <span className="brand-mark" aria-hidden="true">
            23
          </span>
          <strong>{t('live.title')}</strong>
          <span className="room-chip" title={t('live.room', { room })}>
            {room}
          </span>
          <span className={`live-status ${status}`}>
            <span className="status-dot" aria-hidden="true" />
            {t(`live.status.${status}`)}
          </span>
        </div>
        <div className="live-actions">
          <button className="bar-btn" onClick={() => (location.hash = `#live/${newRoomCode()}`)}>
            <RefreshIcon />
            <span>{t('live.newRoom')}</span>
          </button>
          <div className="segmented" role="group" aria-label={t('ui.language')}>
            <button aria-pressed={lang === 'sq'} onClick={() => setLang('sq')}>
              SQ
            </button>
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
          <button className="icon-btn" onClick={toggle} aria-label={t('ui.theme')} title={t('ui.theme')}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      {/* one screen: QR | calendar | theory, so every new birthday visibly changes both */}
      <div className="live-grid">
        <div className="card stack live-qr">
          <h3>{t('live.scan')}</h3>
          {qr && 'svg' in qr ? (
            <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(qr.svg)}`} alt={voteUrl} />
          ) : (
            <div className="qr-placeholder">{qr && 'error' in qr && <span className="small">{qr.error}</span>}</div>
          )}
          <code className="small" style={{ wordBreak: 'break-all' }}>{voteUrl}</code>
          <div className="hero-number" style={{ margin: 0 }}>
            <b>{n}</b>
            <span className="muted">{t('live.students')}</span>
          </div>
        </div>

        <div className="card stack live-center">
          <div aria-live="polite" className="live-banner">
            {firstMatch ? (
              <p className="live-match" key={firstMatch[0]}>
                <T
                  k="live.match"
                  vars={{ date: fmtDayOfYear(firstMatch[0], lang), people: firstMatch[1].map((p) => `#${p}`).join(', ') }}
                />
                {tally.shared.size > 1 && <span className="muted"> {t('s1.room.more', { count: tally.shared.size - 1 })}</span>}
              </p>
            ) : (
              <p className="muted" style={{ margin: 0 }}>{n === 0 ? t('live.waiting') : t('live.noMatch')}</p>
            )}
          </div>
          <Calendar days={tally.days} />
          <div className="chart" style={{ height: 170 }}>
            <ResponsiveContainer>
              <LineChart data={curve} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid stroke={colors.grid} vertical={false} />
                <XAxis dataKey="n" type="number" domain={[1, curveMax]} stroke={colors.axis} tick={{ fill: colors.muted, fontSize: 12 }} />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.5, 1]}
                  tickFormatter={(v: number) => fmtPct(v, lang, 0)}
                  stroke={colors.axis}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  width={48}
                />
                <ReferenceLine y={0.5} stroke={colors.axis} />
                <Line dataKey="p" stroke={colors.collision} strokeWidth={2} dot={false} isAnimationActive={false} />
                {n >= 1 && (
                  <ReferenceDot x={n} y={1 - pNone} r={7} fill={colors.collision} stroke={colors.surface} strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ManualAdd room={room} />
        </div>

        <div className="card stack live-theory">
          <h3>{t('live.theory')}</h3>
          <div className="live-big" key={n}>
            <span className="muted small">
              <T k="live.tile.p" />
            </span>
            <b>{fmtPct(1 - pNone, lang)}</b>
          </div>
          <div className="tiles">
            <Tile label={t('live.tile.n')} value={fmtInt(n, lang)} />
            <Tile label={t('live.tile.pairs')} value={fmtInt(pairs(n), lang)} note={`n(n−1)/2`} />
          </div>
          <Formula n={n} pNone={pNone} />
          <p style={{ margin: 0 }}>
            <T
              k="live.expected"
              vars={{
                pairs: fmtInt(pairs(n), lang),
                expected: fmtNum(pairs(n) / DAYS, lang, 2),
                observed: tally.matchingPairs,
              }}
            />
          </p>
        </div>
      </div>
    </main>
  );
}

/** P(no match) = 365/365 × 364/365 × … with the newest factors spelled out. */
function Formula({ n, pNone }: { n: number; pNone: number }) {
  const { t, lang } = useI18n();
  if (n < 2) return <p className="muted" style={{ margin: 0 }}>{t('live.formulaWait')}</p>;
  const from = Math.max(0, n - SHOWN_FACTORS);
  const factors = Array.from({ length: n - from }, (_, i) => from + i);
  return (
    <div>
      <div className="formula live-formula">
        {t('s1.f.none')} = {from > 0 && <>365/365 × … × </>}
        {factors.map((i, idx) => (
          <span key={i} className={i === n - 1 ? 'factor new' : 'factor'}>
            {idx > 0 && ' × '}
            {DAYS - i}/{DAYS}
          </span>
        ))}{' '}
        = <b>{fmtNum(pNone, lang, 4)}</b>
      </div>
      <div className="formula">
        {t('s1.f.match')} = 1 − {fmtNum(pNone, lang, 4)} = <b>{fmtPct(1 - pNone, lang)}</b>
      </div>
    </div>
  );
}

function Calendar({ days }: { days: number[] }) {
  const { lang } = useI18n();
  const counts = new Map<number, number[]>();
  days.forEach((d, i) => counts.set(d, [...(counts.get(d) ?? []), i + 1]));

  const cells: ReactElement[] = [];
  let dayIndex = 0;
  for (let m = 0; m < 12; m++) {
    cells.push(
      <span className="month" key={`m${m}`}>
        {monthName(m, lang, 'short')}
      </span>,
    );
    const len = new Date(YEAR, m + 1, 0).getDate();
    for (let d = 0; d < 31; d++) {
      if (d >= len) {
        cells.push(<span className="gap" key={`g${m}-${d}`} />);
        continue;
      }
      const who = counts.get(dayIndex) ?? [];
      const cls = who.length >= 2 ? 'day many' : who.length === 1 ? 'day one' : 'day';
      const title = who.length ? `${fmtDayOfYear(dayIndex, lang)}: ${who.map((p) => `#${p}`).join(', ')}` : undefined;
      cells.push(<span className={cls} key={`d${dayIndex}`} title={title} />);
      dayIndex++;
    }
  }
  return <div className="calendar live-calendar">{cells}</div>;
}

/** Plan B: the presenter types in birthdays called out by students without a phone. */
function ManualAdd({ room }: { room: string }) {
  const { t, lang } = useI18n();
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="btn-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await sendVote(room, `m-${newRoomCode(8)}`, dayOfYear(month, day));
        } finally {
          setBusy(false);
        }
      }}
    >
      <span className="small muted">{t('live.manual')}</span>
      <select
        aria-label={t('vote.month')}
        value={month}
        onChange={(e) => {
          const m = Number(e.target.value);
          setMonth(m);
          setDay((d) => Math.min(d, daysInMonth(m)));
        }}
      >
        {Array.from({ length: 12 }, (_, m) => (
          <option key={m} value={m}>
            {monthName(m, lang)}
          </option>
        ))}
      </select>
      <select aria-label={t('vote.day')} value={day} onChange={(e) => setDay(Number(e.target.value))}>
        {Array.from({ length: daysInMonth(month) }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <button className="btn secondary" type="submit" disabled={busy}>
        {t('live.add')}
      </button>
    </form>
  );
}

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
  </svg>
);
