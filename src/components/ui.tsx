import type { CSSProperties, ReactNode } from 'react';
import { useI18n, type MessageKey } from '../i18n';
import { stepOf } from '../steps';
import { T } from './Text';

/** A numbered step; its number and book section come from STEPS (src/steps.ts). */
export function Section({ id, title, children }: { id: string; title: MessageKey; children: ReactNode }) {
  const { t } = useI18n();
  const { n, book } = stepOf(id);
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container stack">
        <div>
          <span className="step-label">
            {t('ui.step', { n })}
            {book && <span className="book-chip">{t('ui.book', { s: book })}</span>}
          </span>
          <h2 id={`${id}-title`}>
            <T k={title} />
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

export function Slider(props: {
  label: ReactNode;
  value: number;
  display?: ReactNode;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const { label, value, display, min, max, step = 1, onChange, disabled } = props;
  return (
    <label className="field">
      <span className="field-head">
        <span>{label}</span>
        <output>{display ?? value}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Tile({ label, value, note, color }: { label: ReactNode; value: ReactNode; note?: ReactNode; color?: string }) {
  return (
    <div className="tile">
      <div className="label">
        {color && <span className="key" style={{ '--c': color } as CSSProperties} />}
        <span>{label}</span>
      </div>
      <div className="value">{value}</div>
      {note && <div className="note">{note}</div>}
    </div>
  );
}

export interface LegendItem {
  label: ReactNode;
  color: string;
  kind?: 'dot' | 'line' | 'dash';
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="legend">
      {items.map((it, i) => (
        <li key={i}>
          <span className={`key ${it.kind ?? 'dot'}`} style={{ '--c': it.color } as CSSProperties} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export function TooltipBox({ title, rows }: { title: ReactNode; rows: Array<{ label: ReactNode; value: ReactNode; color?: string }> }) {
  return (
    <div className="chart-tooltip">
      <div className="title">{title}</div>
      {rows.map((r, i) => (
        <div className="row" key={i}>
          {r.color && <span className="key" style={{ '--c': r.color } as CSSProperties} />}
          {r.label}
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ fraction, color }: { fraction: number; color: string }) {
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  return (
    <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${pct}%`, '--c': color } as CSSProperties} />
    </div>
  );
}

/** Full SHA-256 hex with the first k bits highlighted. */
export function HashHex({ hex, bits }: { hex: string; bits: number }) {
  const chars = Math.floor(bits / 4);
  return (
    <span className="hex">
      <mark>{hex.slice(0, chars)}</mark>
      {hex.slice(chars)}
    </span>
  );
}

export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4.8 8.3l2.1 2.1 4.3-4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 5.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
