import { describe, expect, it } from 'vitest';
import { durationFromLog10, fmtDayOfYear, fmtInt, fmtNum, fmtPct, monthName, sciFromLog10, sciFromLog2 } from './format';

const nbsp = (s: string) => s.replace(/[  ]/g, ' ');

describe('format', () => {
  it('formats integers per locale', () => {
    expect(fmtInt(12345, 'en')).toBe('12,345');
    expect(nbsp(fmtInt(12345, 'sq'))).toBe('12 345');
    expect(fmtInt(1234, 'sq')).toBe('1234');
    expect(nbsp(fmtInt(1234567, 'sq'))).toBe('1 234 567');
    expect(fmtNum(1.1774, 'sq', 2)).toBe('1,18');
    expect(fmtNum(-2.5, 'sq', 1)).toBe('-2,5');
  });

  it('formats dates in Albanian without relying on Intl locale data', () => {
    expect(monthName(2, 'sq')).toBe('Mars');
    expect(monthName(2, 'en')).toBe('March');
    expect(fmtDayOfYear(70, 'sq')).toBe('12 Mars');
    expect(fmtDayOfYear(70, 'en')).toBe('March 12');
  });

  it('formats percentages without fake 0% / 100%', () => {
    expect(fmtPct(0.5073, 'en')).toBe('50.7%');
    expect(fmtPct(0.5073, 'sq')).toBe('50,7%');
    expect(fmtPct(0.99999, 'en')).toBe('> 99.9%');
    expect(fmtPct(0.00001, 'en')).toBe('< 0.1%');
    expect(fmtPct(0, 'en')).toBe('0.0%');
    expect(fmtPct(1, 'en')).toBe('100.0%');
  });

  it('scientific notation from logs', () => {
    expect(sciFromLog10(19.2656)).toMatchObject({ exponent: 19 });
    const s = sciFromLog2(64);
    expect(s.exponent).toBe(19);
    expect(s.mantissa).toBeCloseTo(1.8447, 3);
    expect(sciFromLog2(256).exponent).toBe(77);
    expect(sciFromLog10(2.99999)).toMatchObject({ exponent: 3 }); // no "10.0 × 10^2"
  });

  it('picks duration units', () => {
    expect(durationFromLog10(Math.log10(0.2)).unit).toBe('ms');
    expect(durationFromLog10(Math.log10(30)).unit).toBe('s');
    expect(durationFromLog10(Math.log10(600)).unit).toBe('min');
    expect(durationFromLog10(Math.log10(5 * 3600)).unit).toBe('h');
    expect(durationFromLog10(Math.log10(30 * 86400)).unit).toBe('d');
    const y = durationFromLog10(Math.log10(10 * 365.25 * 86400));
    expect(y.unit).toBe('y');
    expect(10 ** y.log10Value).toBeCloseTo(10, 6);
  });
});
