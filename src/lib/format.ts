/** Locale-aware number/time formatting helpers (pure, unit-tested). */

export type Lang = 'sq' | 'en';

export const LOG10_2 = Math.log10(2);

/*
 * Albanian is formatted by hand: Chrome ships Intl data only for its own UI languages,
 * and Albanian is not one of them, so Intl.NumberFormat('sq-AL') silently falls back
 * to English there. Rules (CLDR "sq"): decimal comma, no-break space as thousands
 * separator, grouping only from 5 integer digits (1234 but 12 345).
 */
const NBSP = '\u00a0';

function formatSq(x: number, minFrac: number, maxFrac: number): string {
  const s = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
    useGrouping: false,
  }).format(x);
  const [intPart, frac] = s.split('.');
  const neg = intPart.startsWith('-');
  const digits = neg ? intPart.slice(1) : intPart;
  const grouped = digits.length >= 5 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) : digits;
  return (neg ? '-' : '') + grouped + (frac ? ',' + frac : '');
}

function formatNumber(x: number, lang: Lang, minFrac: number, maxFrac: number): string {
  if (lang === 'sq') return formatSq(x, minFrac, maxFrac);
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: minFrac, maximumFractionDigits: maxFrac }).format(x);
}

export function fmtInt(n: number, lang: Lang): string {
  return formatNumber(Math.round(n), lang, 0, 0);
}

export function fmtNum(x: number, lang: Lang, digits = 2): string {
  return formatNumber(x, lang, 0, digits);
}

/** Percentage that never rounds a non-zero/non-one value to exactly 0% or 100%. */
export function fmtPct(p: number, lang: Lang, digits = 1): string {
  const f = (v: number) => formatNumber(v * 100, lang, digits, digits) + '%';
  const step = 10 ** -(digits + 2);
  if (p > 0 && p < step) return '< ' + f(step);
  if (p < 1 && p > 1 - step) return '> ' + f(1 - step);
  return f(p);
}

const SQ_MONTHS = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
const SQ_MONTHS_SHORT = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Korr', 'Gush', 'Sht', 'Tet', 'Nën', 'Dhj'];

export function monthName(month: number, lang: Lang, style: 'short' | 'long' = 'long'): string {
  if (lang === 'sq') return (style === 'short' ? SQ_MONTHS_SHORT : SQ_MONTHS)[month];
  return new Intl.DateTimeFormat('en-US', { month: style }).format(new Date(2025, month, 1));
}

/** "12 mars" / "March 12" for a day-of-year index (0..364, non-leap year). */
export function fmtDayOfYear(day: number, lang: Lang): string {
  const d = new Date(2025, 0, 1 + day);
  const month = monthName(d.getMonth(), lang);
  return lang === 'sq' ? `${d.getDate()} ${month}` : `${month} ${d.getDate()}`;
}

export interface Sci {
  mantissa: number;
  exponent: number;
}

/** x = mantissa × 10^exponent, from log10(x). Works far beyond Number.MAX_VALUE. */
export function sciFromLog10(log10x: number): Sci {
  let exponent = Math.floor(log10x);
  let mantissa = 10 ** (log10x - exponent);
  if (mantissa >= 9.995) {
    mantissa /= 10;
    exponent += 1;
  }
  return { mantissa, exponent };
}

export const sciFromLog2 = (log2x: number): Sci => sciFromLog10(log2x * LOG10_2);

export type TimeUnit = 'ms' | 's' | 'min' | 'h' | 'd' | 'y';

const SECONDS: Record<TimeUnit, number> = {
  ms: 1e-3,
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  y: 365.25 * 86400,
};

/** Picks a readable unit for a duration given as log10(seconds). */
export function durationFromLog10(log10s: number): { log10Value: number; unit: TimeUnit } {
  const s = 10 ** log10s;
  const unit: TimeUnit =
    s < 1 ? 'ms' : s < 120 ? 's' : s < 7200 ? 'min' : s < 3 * 86400 ? 'h' : s < 2 * SECONDS.y ? 'd' : 'y';
  return { log10Value: log10s - Math.log10(SECONDS[unit]), unit };
}
