import { describe, expect, it } from 'vitest';
import { dayOfYear, daysInMonth, decodeVote, encodeVote, isValidRoom, newRoomCode, postWithRetry, tallyVotes, voteUrlFor } from './live';

describe('dayOfYear', () => {
  it('maps calendar dates to 0..364', () => {
    expect(dayOfYear(0, 1)).toBe(0);
    expect(dayOfYear(1, 1)).toBe(31);
    expect(dayOfYear(2, 1)).toBe(59); // non-leap year
    expect(dayOfYear(11, 31)).toBe(364);
  });

  it('knows month lengths', () => {
    expect(daysInMonth(1)).toBe(28);
    expect(daysInMonth(3)).toBe(30);
    expect(daysInMonth(11)).toBe(31);
  });
});

describe('vote encoding', () => {
  it('round-trips', () => {
    expect(decodeVote(encodeVote('abc123', 70))).toEqual({ voter: 'abc123', day: 70 });
  });

  it('rejects garbage and out-of-range days', () => {
    expect(decodeVote('hello')).toBeNull();
    expect(decodeVote('abc:365')).toBeNull();
    expect(decodeVote('ABC:1')).toBeNull();
  });
});

describe('rooms', () => {
  it('generates valid room codes', () => {
    for (let i = 0; i < 20; i++) expect(isValidRoom(newRoomCode())).toBe(true);
    expect(isValidRoom('x')).toBe(false);
    expect(isValidRoom('abc/../def')).toBe(false);
  });
});

describe('tallyVotes', () => {
  it('keeps arrival order and lets a voter change their day', () => {
    const t = tallyVotes([
      { voter: 'a', day: 10 },
      { voter: 'b', day: 20 },
      { voter: 'a', day: 30 },
    ]);
    expect(t.days).toEqual([30, 20]);
    expect(t.shared.size).toBe(0);
    expect(t.matchingPairs).toBe(0);
  });

  it('finds shared days and counts matching pairs', () => {
    const t = tallyVotes([
      { voter: 'a', day: 5 },
      { voter: 'b', day: 5 },
      { voter: 'c', day: 9 },
      { voter: 'd', day: 5 },
      { voter: 'e', day: 9 },
    ]);
    expect(t.shared.get(5)).toEqual([1, 2, 4]);
    expect(t.shared.get(9)).toEqual([3, 5]);
    expect(t.matchingPairs).toBe(3 + 1);
  });
});

describe('voteUrlFor', () => {
  const pub = 'https://example.github.io/app/';
  it('uses the current page when published', () => {
    const r = voteUrlFor({ hostname: 'example.github.io', origin: 'https://example.github.io', pathname: '/app/' }, 'abc123', pub);
    expect(r).toEqual({ url: 'https://example.github.io/app/#vote/abc123', usesPublicUrl: false });
  });
  it('points phones at the published site when the projector runs locally', () => {
    for (const hostname of ['localhost', '127.0.0.1', 'my-mac.local']) {
      const r = voteUrlFor({ hostname, origin: `http://${hostname}:5173`, pathname: '/' }, 'abc123', pub);
      expect(r).toEqual({ url: 'https://example.github.io/app/#vote/abc123', usesPublicUrl: true });
    }
  });
});

describe('postWithRetry', () => {
  const noSleep = () => Promise.resolve();
  const response = (status: number) => ({ ok: status >= 200 && status < 300, status }) as Response;

  it('retries rate limits and server errors, then succeeds', async () => {
    const statuses = [429, 503, 200];
    const calls: string[] = [];
    const retries: number[] = [];
    const fetchFn = (async (url: string, init?: RequestInit) => {
      calls.push(`${init?.method} ${url} ${init?.body}`);
      return response(statuses.shift()!);
    }) as unknown as typeof fetch;
    await postWithRetry('https://x/topic', 'a:1', { fetchFn, sleep: noSleep, onRetry: (n) => retries.push(n) });
    expect(calls).toEqual(['POST https://x/topic a:1', 'POST https://x/topic a:1', 'POST https://x/topic a:1']);
    expect(retries).toEqual([1, 2]);
  });

  it('retries network errors', async () => {
    let n = 0;
    const fetchFn = (async () => {
      if (n++ === 0) throw new TypeError('Failed to fetch');
      return response(200);
    }) as unknown as typeof fetch;
    await expect(postWithRetry('https://x/t', 'a:1', { fetchFn, sleep: noSleep })).resolves.toBeUndefined();
  });

  it('gives up after the last retry, and at once on client errors', async () => {
    let n = 0;
    const always429 = (async () => (n++, response(429))) as unknown as typeof fetch;
    await expect(postWithRetry('https://x/t', 'a:1', { fetchFn: always429, sleep: noSleep, delays: [1, 1] })).rejects.toThrow('429');
    expect(n).toBe(3);

    let m = 0;
    const bad = (async () => (m++, response(400))) as unknown as typeof fetch;
    await expect(postWithRetry('https://x/t', 'a:1', { fetchFn: bad, sleep: noSleep })).rejects.toThrow('400');
    expect(m).toBe(1);
  });
});
