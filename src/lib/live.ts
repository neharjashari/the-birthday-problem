/**
 * Live classroom mode: students send their birthday (day + month only) from a phone,
 * the projector collects them. Messages travel through ntfy.sh, a free pub/sub
 * service that needs no account and allows cross-origin requests.
 *
 * A message body is "<voterId>:<dayOfYear>". Each phone has one voter id, so a
 * repeated send replaces the earlier birthday instead of adding a second person.
 */

/**
 * The ntfy server. Override at build time with VITE_NTFY_BASE (e.g. a self-hosted
 * ntfy, or a local mock for tests).
 */
export const NTFY_BASE: string = (import.meta.env?.VITE_NTFY_BASE as string | undefined) || 'https://ntfy.sh';

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

/* ------------------------------------------------------------------------- */
/* URLs                                                                       */
/* ------------------------------------------------------------------------- */

/** Server-Sent Events stream for a room; `since` is "all" or the id of the last message seen. */
export function sseUrl(room: string, since: string = 'all'): string {
  return `${NTFY_BASE}/${topicFor(room)}/sse?since=${encodeURIComponent(since)}`;
}

export function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '[::1]' || hostname.startsWith('127.') || hostname.endsWith('.local');
}

/**
 * The link the QR code encodes. When the projector runs on localhost (npm run dev),
 * phones can't reach it, so point them at the published site instead: votes go through
 * ntfy either way, so a local projector and a published vote page work together.
 */
export function voteUrlFor(here: { hostname: string; origin: string; pathname: string }, room: string, publicUrl: string) {
  const local = isLocalHost(here.hostname);
  const base = local ? publicUrl : `${here.origin}${here.pathname}`;
  return { url: `${base}#vote/${room}`, usesPublicUrl: local };
}

/* ------------------------------------------------------------------------- */
/* Sending with retries                                                       */
/* ------------------------------------------------------------------------- */

/** Backoff before retry 1, 2, 3, 4 (ms). A classroom shares one public IP, and ntfy
 * rate-limits per IP, so a burst of phones can get HTTP 429 for a few seconds. */
export const RETRY_DELAYS_MS = [1000, 2000, 4000, 8000];

export interface PostOptions {
  fetchFn?: typeof fetch;
  delays?: number[];
  sleep?: (ms: number) => Promise<void>;
  /** Called before each retry with the retry number (1-based). */
  onRetry?: (attempt: number) => void;
}

/** POSTs `body`, retrying on network errors, HTTP 429 and 5xx. Throws when out of retries. */
export async function postWithRetry(url: string, body: string, opts: PostOptions = {}): Promise<void> {
  const fetchFn = opts.fetchFn ?? fetch;
  const delays = opts.delays ?? RETRY_DELAYS_MS;
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  for (let attempt = 0; ; attempt++) {
    let status = 0; // 0 = network error
    try {
      // a text/plain body keeps this a "simple" CORS request: no preflight, half the requests
      const res = await fetchFn(url, { method: 'POST', body });
      if (res.ok) return;
      status = res.status;
    } catch {
      status = 0;
    }
    const retryable = status === 0 || status === 429 || status >= 500;
    if (!retryable || attempt >= delays.length) throw new Error(status ? `ntfy HTTP ${status}` : 'network error');
    opts.onRetry?.(attempt + 1);
    // jitter, so 30 phones that were refused together don't all retry together
    await sleep(delays[attempt] * (0.75 + Math.random() * 0.5));
  }
}

export function sendVote(room: string, voter: string, day: number, opts: PostOptions = {}): Promise<void> {
  return postWithRetry(`${NTFY_BASE}/${topicFor(room)}`, encodeVote(voter, day), opts);
}
