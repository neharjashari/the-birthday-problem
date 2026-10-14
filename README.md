# The Birthday Problem · Problemi i ditëlindjes

An interactive web app that explains the birthday paradox and why it matters for
cryptographic hash functions. Built for the **Information Security** course
(Siguria e Informacionit), FIEK, University of Prishtina.

Authors: Nehar Jashari, Albena Veseli.

The UI is in Albanian by default, with an English toggle.

## What's inside

| Step | Section | What the student does |
|---|---|---|
| 1 | **Why hash** | Edits a document and sees that a signature covers only its 32-byte SHA-256 digest. |
| 2 | **Hash function** | Compares two inputs bit by bit (avalanche effect) and reads the security properties, with the work each attack needs. |
| 3 | **Paradox** | Guesses the answer, moves a slider, fills a 365-day calendar, simulates 10,000 rooms. The chart compares "any two match" (collision) with "someone matches *you*" (preimage). |
| 4 | **Any N** | Generalises from 365 days to N = 2^k: one universal curve, √N rule, table for MD5 / SHA-1 / SHA-256. |
| 5 | **Hash lab** | Watches both attacks fill a "year with 2^k days", then runs real birthday and preimage attacks on truncated SHA-256 in a Web Worker, plus an experiment that plots measured work against theory. |
| 6 | **Yuval's attack** | Mallory varies a fair and a fraudulent contract until two share a truncated hash; Alice's real ECDSA P-256 signature then verifies on both. |
| 7 | **In practice** | n-bit hash → n/2-bit collision security, time-to-break table, real cases (MD5/Flame, SHAttered, Sweet32, AES-GCM nonces, UUIDs). |
| 8 | **Summary** | The answers in one place and a short quiz. |

## Live classroom mode

Open the app and press **Live** (or go to `#live`). The projector shows a QR code; students
scan it, pick their birthday (day and month only, no name) and the calendar and the
theory update with every answer.

- **How it works.** Phones POST `"<random voter id>:<day of year>"` to a public
  [ntfy.sh](https://ntfy.sh) topic named after the room code; the projector listens with
  Server-Sent Events. No backend or account is needed, so it works on GitHub Pages.
  Reloading the projector replays the answers (ntfy keeps them about 12 hours).
- **Close voting** freezes the result, so late answers, or a classmate sending fake ones
  (the topic is public and anyone in the room knows its name), don't change it. **New room**
  starts from zero.
- **Plan B.** The presenter can type birthdays in by hand under the calendar.
- **Before class, test on the classroom Wi-Fi.** ntfy rate-limits per public IP, and a whole
  class behind one university IP shares that limit (by default a burst of about 60 requests,
  then one every 5 seconds). Phones retry automatically with backoff; if it is still too slow,
  ask students to switch to mobile data.
- **Running the projector locally.** On `localhost` the QR code points to the published site
  instead (`PUBLIC_URL` in `src/config.ts`), because phones can't reach your laptop. Votes
  still arrive on the local projector.
- **Own server.** Build with `VITE_NTFY_BASE=https://your-ntfy.example` to use a self-hosted
  ntfy instead of ntfy.sh.

## Quick start

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Project structure

```
src/
  lib/                pure logic, unit-tested (*.test.ts next to each file)
    birthday.ts       probabilities, approximations, Monte Carlo
    hash.ts           SHA-256 (@noble/hashes), truncation to k bits, fast message encoder
    attacks.ts        collision, preimage, scaling experiment, Yuval's attack
    contracts.ts      contract templates with {a|b} choice points (sq + en)
    signature.ts      ECDSA P-256 sign/verify over a truncated digest (Web Crypto)
    format.ts         number/date formatting (Albanian done by hand, see below)
    live.ts           live mode: room codes, vote encoding, tally, ntfy URLs, retrying POST
  live/               live mode pages: LivePage (projector) and VotePage (phones)
  workers/            Web Worker that runs the attacks off the main thread
  hooks/              useAttackWorker (attack runs), useLiveVotes (ntfy stream), scroll helpers
  i18n/               sq.ts (default) and en.ts; TypeScript enforces identical keys
  components/         shared UI: sliders, tiles, legends, header, footer, theme
  sections/           one file per step; their order and numbers come from src/steps.ts
  config.ts           authors, repo and published URL, references (footer)
```

### Notes for developers

- **Truncated SHA-256 as a toy hash.** Taking the first k bits of SHA-256 gives a
  function with N = 2^k outputs that behaves like a random oracle, so real attacks
  finish in seconds for k ≤ 40.
- **Speed.** Hashing runs at roughly 300–500k hashes/s per worker. The preimage attack
  at k = 24 takes about a minute; at k = 32 the panel shows an ETA of hours, which is the point.
- **Strings.** Translation strings support a tiny markup: `**bold**`, `*italic*`,
  `` `code` ``, `^{sup}`, `_{sub}`, plus `{placeholders}`.
- **Albanian formatting.** Chrome ships no Intl data for Albanian and silently falls
  back to English, so `src/lib/format.ts` formats numbers (`12 345,6`) and month names by hand.
- **Charts** use Recharts with colours from `src/components/theme.tsx`, which mirror the
  CSS tokens in `src/styles.css` (light + dark).

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` runs the tests, builds and publishes on every push to `main`
(the repository must be public, or on a paid plan, for Pages).

1. One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`, or run the workflow by hand from the **Actions** tab.
3. The app is published at <https://neharjashari.github.io/the-birthday-problem/>.
   If the repository is renamed or moved, update `PUBLIC_URL` in `src/config.ts`.

The app uses hash routes (`#live/…`, `#vote/…`) and relative asset paths (`base: './'`),
so it needs no server configuration and works from any sub-path.

## References

- Birthday problem / birthday attack (Wikipedia)
- G. Yuval, "How to Swindle Rabin", *Cryptologia* 3(3), 1979
- M. Stevens et al., SHAttered, 2017 · G. Leurent & T. Peyrin, SHA-1 is a Shambles, 2020
- K. Bhargavan & G. Leurent, Sweet32, 2016
- NIST SP 800-38D (GCM)
