import { useState } from 'react';
import { T } from '../components/Text';
import { sendVote } from '../hooks/useLiveVotes';
import { useI18n } from '../i18n';
import { fmtDayOfYear, monthName } from '../lib/format';
import { dayOfYear, daysInMonth, newRoomCode } from '../lib/live';

type SendState = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; day: number } | { kind: 'error' };

function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: the phone just won't remember */
  }
}

/** One stable id per phone, so a second send replaces the first instead of adding a person. */
function voterId(): string {
  const saved = load('bp.voter');
  if (saved) return saved;
  const id = newRoomCode(10);
  save('bp.voter', id);
  return id;
}

/** Phone page: pick day + month, send once. */
export function VotePage({ room }: { room: string }) {
  const { t, lang, setLang } = useI18n();
  const votedKey = `bp.voted.${room}`;
  const previous = load(votedKey);
  const [state, setState] = useState<SendState>(previous ? { kind: 'sent', day: Number(previous) } : { kind: 'idle' });
  const [month, setMonth] = useState(-1);
  const [day, setDay] = useState(-1);

  const submit = async () => {
    if (month < 0 || day < 1) return;
    const d = dayOfYear(month, day);
    setState({ kind: 'sending' });
    try {
      await sendVote(room, voterId(), d);
      save(votedKey, String(d));
      setState({ kind: 'sent', day: d });
    } catch {
      setState({ kind: 'error' });
    }
  };

  return (
    <main className="vote-page">
      <div className="card stack">
        <div className="btn-row" style={{ justifyContent: 'space-between' }}>
          <span className="step-label">{t('live.room', { room })}</span>
          <div className="segmented" role="group" aria-label={t('ui.language')}>
            <button aria-pressed={lang === 'sq'} onClick={() => setLang('sq')}>SQ</button>
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
        </div>
        <h1 style={{ fontSize: '1.6rem', margin: 0 }}>{t('vote.title')}</h1>

        {state.kind === 'sent' ? (
          <div className="stack" aria-live="polite">
            <p className="vote-done">
              <T k="vote.sent" vars={{ date: fmtDayOfYear(state.day, lang) }} />
            </p>
            <p className="muted">{t('vote.look')}</p>
            <button className="btn ghost" onClick={() => setState({ kind: 'idle' })}>
              {t('vote.change')}
            </button>
          </div>
        ) : (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <p className="muted" style={{ margin: 0 }}>{t('vote.privacy')}</p>
            <div className="vote-fields">
              <select
                aria-label={t('vote.month')}
                value={month}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  setMonth(m);
                  if (day > daysInMonth(m)) setDay(-1);
                }}
              >
                <option value={-1} disabled>
                  {t('vote.month')}
                </option>
                {Array.from({ length: 12 }, (_, m) => (
                  <option key={m} value={m}>
                    {monthName(m, lang)}
                  </option>
                ))}
              </select>
              <select aria-label={t('vote.day')} value={day} onChange={(e) => setDay(Number(e.target.value))}>
                <option value={-1} disabled>
                  {t('vote.day')}
                </option>
                {Array.from({ length: month < 0 ? 31 : daysInMonth(month) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <p className="small muted" style={{ margin: 0 }}>{t('vote.feb29')}</p>
            <button className="btn" type="submit" disabled={month < 0 || day < 1 || state.kind === 'sending'}>
              {state.kind === 'sending' ? t('vote.sending') : t('vote.send')}
            </button>
            {state.kind === 'error' && <p style={{ color: 'var(--bad)', margin: 0 }}>{t('vote.error')}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
