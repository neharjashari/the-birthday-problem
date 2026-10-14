import type { MessageKey } from './i18n';

/**
 * The order of the steps on the page. Step numbers and the header nav come from this list.
 */
export const STEPS: Array<{ id: string; nav: MessageKey }> = [
  { id: 'why', nav: 'nav.why' },
  { id: 'hash', nav: 'nav.hash' },
  { id: 'paradox', nav: 'nav.s1' },
  { id: 'any-n', nav: 'nav.s2' },
  { id: 'hash-lab', nav: 'nav.s3' },
  { id: 'yuval', nav: 'nav.s5' },
  { id: 'practice', nav: 'nav.s4' },
  { id: 'summary', nav: 'nav.summary' },
];

export function stepOf(id: string) {
  const i = STEPS.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`unknown step ${id}`);
  return { n: i + 1, ...STEPS[i] };
}
