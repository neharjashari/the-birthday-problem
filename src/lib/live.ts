/**
 * Live classroom mode: students send their birthday (day + month only) from a phone,
 * the projector collects them. Messages travel through ntfy.sh, a free pub/sub
 * service that needs no account and allows cross-origin requests.
 *
 * A message body is "<voterId>:<dayOfYear>". Each phone has one voter id, so a
 * repeated send replaces the earlier birthday instead of adding a second person.
 */

export const NTFY_BASE = 'https://ntfy.sh';

const ROOM_RE = /^[a-z0-9]{4,16}$/;

export function isValidRoom(room: string): boolean {
  return ROOM_RE.test(room);
}

/** Random room code such as "k3j9x2" (also used as an unguessable topic suffix). */
export function newRoomCode(length = 6): string {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'; // no look-alikes (l/1, o/0)
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export function topicFor(room: string): string {
  return `bp-fiek-${room}`;
}

/** Day of year 0..364 in a non-leap year. `month` is 0..11, `day` is 1..31. */
export function dayOfYear(month: number, day: number): number {
  return Math.round((Date.UTC(2025, month, day) - Date.UTC(2025, 0, 1)) / 86_400_000);
}

export function daysInMonth(month: number): number {
  return new Date(Date.UTC(2025, month + 1, 0)).getUTCDate();
}

export function encodeVote(voter: string, day: number): string {
  return `${voter}:${day}`;
}

export function decodeVote(body: string): { voter: string; day: number } | null {
  const m = /^([a-z0-9-]{1,40}):(\d{1,3})$/.exec(body.trim());
  if (!m) return null;
  const day = Number(m[2]);
  return day >= 0 && day < 365 ? { voter: m[1], day } : null;
}

export interface Tally {
  /** Birthdays in arrival order; person i is student #(i+1). */
  days: number[];
  /** Day -> student numbers (1-based) born that day, only for days shared by 2+. */
  shared: Map<number, number[]>;
  /** Number of matching pairs: sum over days of C(k, 2). */
  matchingPairs: number;
}

/** Folds votes in arrival order. A later vote from the same voter overwrites their day. */
export function tallyVotes(votes: Array<{ voter: string; day: number }>): Tally {
  const order: string[] = [];
  const byVoter = new Map<string, number>();
  for (const v of votes) {
    if (!byVoter.has(v.voter)) order.push(v.voter);
    byVoter.set(v.voter, v.day);
  }
  const days = order.map((v) => byVoter.get(v)!);

  const byDay = new Map<number, number[]>();
  days.forEach((d, i) => byDay.set(d, [...(byDay.get(d) ?? []), i + 1]));
  const shared = new Map([...byDay].filter(([, people]) => people.length >= 2));
  let matchingPairs = 0;
  for (const people of shared.values()) matchingPairs += (people.length * (people.length - 1)) / 2;

  return { days, shared, matchingPairs };
}
