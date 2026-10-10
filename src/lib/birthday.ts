/**
 * Birthday-problem math. Everything here is pure and unit-tested.
 *
 * N = number of equally likely values ("days in a year", or 2^bits for a hash).
 * n = number of samples drawn ("people in the room", or hashes computed).
 */

export const DAYS = 365;

/** Number of distinct pairs among n people: n(n-1)/2. */
export function pairs(n: number): number {
  return n < 2 ? 0 : (n * (n - 1)) / 2; // n < 2 also avoids -0 for n = 0
}

/**
 * Exact probability that at least two of n samples share a value.
 * P = 1 - prod_{i=0}^{n-1} (1 - i/N), computed in log space for stability.
 */
export function probCollisionExact(n: number, N: number = DAYS): number {
  if (n <= 1) return 0;
  if (n > N) return 1;
  let logNoMatch = 0;
  for (let i = 1; i < n; i++) logNoMatch += Math.log1p(-i / N);
  return 1 - Math.exp(logNoMatch);
}

/** Standard approximation P ≈ 1 - e^(-n(n-1)/2N). Works for any N, including 2^256. */
export function probCollisionApprox(n: number, N: number): number {
  if (n <= 1) return 0;
  return -Math.expm1(-pairs(n) / N);
}

/**
 * Probability that at least one of the OTHER n-1 people shares YOUR birthday.
 * This is the "preimage" version of the question: matching one fixed value.
 */
export function probMatchYours(n: number, N: number = DAYS): number {
  if (n <= 1) return 0;
  return -Math.expm1((n - 1) * Math.log1p(-1 / N));
}

/** Smallest n such that probCollisionExact(n, N) >= p. Only for small N (iterates). */
export function peopleForCollision(p: number, N: number = DAYS): number {
  let n = 1;
  while (probCollisionExact(n, N) < p) n++;
  return n;
}

/** Smallest n (room size incl. you) such that probMatchYours(n, N) >= p. */
export function peopleForMatchYours(p: number, N: number = DAYS): number {
  const others = Math.ceil(Math.log1p(-p) / Math.log1p(-1 / N));
  return others + 1;
}

/**
 * log2 of the number of samples needed for collision probability p when N = 2^bits.
 * From p = 1 - e^(-n²/2N)  =>  n = sqrt(2N ln(1/(1-p))).
 * For p = 0.5 this is the famous n ≈ 1.1774 · √N.
 */
export function log2SamplesForCollision(bits: number, p = 0.5): number {
  return 0.5 * Math.log2(2 * -Math.log1p(-p)) + bits / 2;
}

/**
 * log2 of the number of tries needed to hit ONE specific value with probability p
 * when N = 2^bits. From p = 1 - (1 - 1/N)^t  =>  t ≈ N ln(1/(1-p)).
 */
export function log2TriesForPreimage(bits: number, p = 0.5): number {
  return Math.log2(-Math.log1p(-p)) + bits;
}

/** Mean number of draws until the first repeat: ≈ sqrt(πN/2). */
export function expectedCollisionAttempts(bits: number): number {
  return Math.sqrt((Math.PI / 2) * 2 ** bits);
}

/** Mean number of tries to hit one fixed value (geometric distribution): N. */
export function expectedPreimageAttempts(bits: number): number {
  return 2 ** bits;
}

export type Rng = () => number;

/** n random birthdays as day-of-year indexes 0..364. */
export function randomBirthdays(n: number, rng: Rng = Math.random): number[] {
  return Array.from({ length: n }, () => Math.floor(rng() * DAYS));
}

/** Groups people by birthday; returns only days shared by 2+ people. */
export function sharedBirthdays(days: number[]): Map<number, number[]> {
  const byDay = new Map<number, number[]>();
  days.forEach((d, person) => {
    const list = byDay.get(d);
    if (list) list.push(person);
    else byDay.set(d, [person]);
  });
  for (const [d, people] of byDay) if (people.length < 2) byDay.delete(d);
  return byDay;
}

/** Monte Carlo: fraction of `rooms` simulated rooms of size n that contain a shared birthday. */
export function simulateRooms(n: number, rooms: number, rng: Rng = Math.random): number {
  let hits = 0;
  const seen = new Uint32Array(DAYS);
  for (let r = 1; r <= rooms; r++) {
    for (let i = 0; i < n; i++) {
      const d = Math.floor(rng() * DAYS);
      if (seen[d] === r) {
        hits++;
        break;
      }
      seen[d] = r;
    }
  }
  return hits / rooms;
}

/** Small deterministic PRNG (mulberry32) for reproducible tests and demos. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
