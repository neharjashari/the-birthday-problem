import { describe, expect, it } from 'vitest';
import { dayOfYear, daysInMonth, decodeVote, encodeVote, isValidRoom, newRoomCode, tallyVotes } from './live';

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
