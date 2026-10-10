import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { DAYS, probCollisionExact } from '../lib/birthday';
import { fmtPct } from '../lib/format';
import { T } from './Text';

const STEP_MS = 260;
const HOLD_MS = 2600;

interface Run {
  days: number[];
  match: [number, number] | null; // indexes of the two people who share a day
}

function reducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The hero animation: random people walk into a room one by one, each lighting up
 * their birthday among 365 cells, until two land on the same day. Then it starts over.
 */
export function HeroVisual() {
  const { lang } = useI18n();
  const [run, setRun] = useState<Run>({ days: [], match: null });

  useEffect(() => {
    if (reducedMotion()) {
      // a fixed, typical room of 23 with one shared day
      const days = Array.from({ length: 22 }, (_, i) => (i * 97 + 13) % DAYS);
      setRun({ days: [...days, days[6]], match: [6, 22] });
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = (r: Run) => {
      if (r.match) {
        timer = setTimeout(() => {
          const next = { days: [], match: null };
          setRun(next);
          tick(next);
        }, HOLD_MS);
        return;
      }
      timer = setTimeout(() => {
        const d = Math.floor(Math.random() * DAYS);
        const j = r.days.indexOf(d);
        const next: Run = { days: [...r.days, d], match: j >= 0 ? [j, r.days.length] : null };
        setRun(next);
        tick(next);
      }, STEP_MS);
    };
    tick(run);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const n = run.days.length;
  const taken = new Set(run.days);
  const hit = run.match ? run.days[run.match[0]] : -1;
  const last = run.days[n - 1];

  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hv-head">
        <div>
          <span className="hv-n">{n}</span>
          <span className="hv-label">
            <T k="hero.people" />
          </span>
        </div>
        <div className="hv-p">
          <span className="hv-label">P</span>
          <b>{fmtPct(probCollisionExact(n), lang)}</b>
        </div>
      </div>
      <div className="hv-grid">
        {Array.from({ length: DAYS }, (_, d) => (
          <span
            key={d}
            className={d === hit ? 'hit' : d === last && !run.match ? 'new' : taken.has(d) ? 'on' : undefined}
          />
        ))}
      </div>
      <div className={`hv-foot${run.match ? ' match' : ''}`}>
        {run.match ? <T k="hero.match" vars={{ n }} /> : <T k="hero.caption" />}
      </div>
    </div>
  );
}
