import type { MessageKey } from './i18n';

/**
 * The order of the steps on the page, and the book section each one covers
 * (Stamp, Information Security, ch. 5). Step numbers, the header nav and the
 * "Book §5.x" labels all come from this list.
 */
export const STEPS: Array<{ id: string; nav: MessageKey; book: string | null }> = [
  { id: 'why', nav: 'nav.why', book: '5.1' },
  { id: 'hash', nav: 'nav.hash', book: '5.2' },
  { id: 'paradox', nav: 'nav.s1', book: '5.3' },
  { id: 'any-n', nav: 'nav.s2', book: '5.3' },
  { id: 'hash-lab', nav: 'nav.s3', book: '5.4' },
  { id: 'yuval', nav: 'nav.s5', book: '5.4' },
  { id: 'practice', nav: 'nav.s4', book: null },
  { id: 'summary', nav: 'nav.summary', book: null },
];

export function stepOf(id: string) {
  const i = STEPS.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`unknown step ${id}`);
  return { n: i + 1, ...STEPS[i] };
}
