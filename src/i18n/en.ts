/**
 * English strings. This file defines the set of keys; sq.ts must provide the same keys
 * (TypeScript enforces it).
 *
 * Mini-markup supported in strings: **bold**, *italic*, `code`, ^{superscript}, _{subscript}.
 * Placeholders: {name}. A blank line starts a new paragraph (in <Prose>).
 */
export const en = {
  'app.title': 'The Birthday Problem',
  'app.subtitle': 'and why it decides how long a cryptographic hash must be',
  'app.lead':
    'In a room of just 23 people, the chance that two share a birthday is better than 50%. The same counter-intuitive math is the reason a 256-bit hash gives only 128 bits of security against collisions.',
  'app.start': 'Start exploring',

  'nav.s1': 'Paradox',
  'nav.s2': 'Any N',
  'nav.s3': 'Hash lab',
  'nav.s4': 'In practice',
  'nav.s5': "Yuval's attack",
  'ui.language': 'Language',
  'ui.theme': 'Switch light / dark theme',
  'ui.step': 'Step {n}',

  /* ---------------------------------- 1 ---------------------------------- */
  's1.title': 'How many people until two share a birthday?',
  's1.guess.q':
    'Before you look: how many people must be in a room for the chance of a shared birthday to exceed 50%?',
  's1.guess.placeholder': 'Your guess',
  's1.guess.reveal': 'Reveal',
  's1.guess.answer': 'The answer is **23**.',
  's1.guess.high':
    'You guessed {guess}. Most people guess far too high: intuition counts *people*, but the math counts *pairs*.',
  's1.guess.close': 'Well done, {guess} is close. Most people guess 100 or more.',
  's1.guess.low': 'You guessed {guess}, a bit low, but closer than most people get.',
  's1.why':
    'Each new person has to avoid **every** birthday already in the room. With n people there are n(n−1)/2 pairs, and each pair has a 1/365 chance of matching. 23 people already form **253 pairs**.\n\nIt is easier to compute the chance that *nobody* matches and subtract it from 1:',
  's1.f.none': 'P(nobody matches)',
  's1.f.match': 'P(match)',
  's1.slider': 'People in the room',
  's1.tile.any': 'Any two share a birthday',
  's1.tile.yours': 'Someone shares *your* birthday',
  's1.tile.pairs': 'Pairs in the room',
  's1.chart.title': 'Probability vs. number of people',
  's1.chart.any': 'Any two match (collision)',
  's1.chart.yours': 'Someone matches you (preimage)',
  's1.chart.x': 'People in the room',
  's1.insight':
    'Look at the gap between the two curves. Finding **any** match is much easier than matching **one specific** value: 23 people for the first, 253 others for the second. That gap is exactly the difference between a hash **collision** and a **preimage**.',
  's1.room.title': 'Try it: fill a room',
  's1.room.fill': 'Fill the room with {n} people',
  's1.room.empty': 'Press the button to place people on the calendar.',
  's1.room.found': 'Match! Person {a} and person {b} were both born on {date}.',
  's1.room.more': '+ {count} more shared days',
  's1.room.none': 'No shared birthday this time. Try again.',
  's1.room.one': 'One person',
  's1.room.many': 'Shared birthday',
  's1.room.sim': 'Simulate {rooms} rooms',
  's1.room.simResult': '{rate} of {rooms} rooms had a shared birthday. Theory: {theory}.',

  /* ---------------------------------- 2 ---------------------------------- */
  's2.title': 'From 365 days to any N',
  's2.intro':
    'Nothing in the argument depends on birthdays. If values are drawn uniformly from N possibilities (days, ID numbers, hash outputs), the chance of a repeat after n draws is approximately:',
  's2.after':
    'So a 50% chance of a collision needs only **n ≈ 1.18·√N** draws: the **square root** of the space. Matching one *specific* value instead needs about **0.69·N** tries.',
  's2.slider': 'Output size',
  's2.bitsValue': '{bits} bits',
  's2.tile.N': 'Possible values N',
  's2.tile.coll': 'Draws for 50% collision',
  's2.tile.pre': 'Tries for 50% preimage',
  's2.tile.ratio': "Attacker's shortcut",
  's2.tile.ratioNote': 'times less work',
  's2.chart.title': 'One curve for every N',
  's2.chart.desc':
    'Plotted against n/√N, the collision probability follows the same curve whatever the size of the space.',
  's2.chart.approx': 'Approximation, any N',
  's2.chart.exact': 'Exact, N = 365',
  's2.table.space': 'Space',
  's2.table.coll': '50% collision after',
  's2.table.pre': '50% preimage after',
  's2.row.days': 'Birthdays (365 days)',
  's2.row.b32': '32-bit value',
  's2.row.b64': '64-bit value',
  's2.row.md5': 'MD5 (128 bits)',
  's2.row.sha1': 'SHA-1 (160 bits)',
  's2.row.sha256': 'SHA-256 (256 bits)',

  /* ---------------------------------- 3 ---------------------------------- */
  's3.title': 'Hash collision lab',
  's3.intro':
    'A cryptographic hash maps any input to a fixed-size fingerprint. Full SHA-256 has 256 output bits, far too many to attack. So we **truncate** SHA-256 to its first k bits. That gives a toy hash with N = 2^{k} outputs that behaves like the real thing, only smaller. Every hash below is computed live in your browser.',
  's3.def.collision':
    '**Collision:** find *any* two different messages with the same hash. Protected by *strong collision resistance*. Expected work ≈ 2^{k/2}.',
  's3.def.preimage':
    '**Second preimage:** given *one* message, find a different one with the same hash. Protected by *weak collision resistance*. Expected work ≈ 2^{k}.',
  's3.bits': 'Hash size k',
  's3.run.collision': 'Run birthday attack',
  's3.run.preimage': 'Run preimage attack',
  's3.run.race': 'Race both',
  's3.stop': 'Stop',
  's3.panel.collision': 'Birthday attack (collision)',
  's3.panel.preimage': 'Preimage attack',
  's3.attempts': 'Hashes computed',
  's3.expected': 'Expected (average)',
  's3.rate': 'Speed',
  's3.rateValue': '{rate} hashes/s',
  's3.eta': 'Expected time at this speed',
  's3.status.idle': 'Not started',
  's3.status.running': 'Running…',
  's3.status.stopped': 'Stopped',
  's3.status.done': 'Found after {attempts} hashes in {time}',
  's3.msgA': 'Message A',
  's3.msgB': 'Message B',
  's3.target': 'Target message',
  's3.match': 'Matching message',
  's3.highlight':
    'Highlighted: the first {k} bits, the only part our toy hash looks at. The full SHA-256 values are still different.',
  's3.exp.title': 'How does the work grow?',
  's3.exp.desc':
    'Run each attack {trials} times for many values of k and plot the average work on a log scale. The collision line climbs 1 step for every 2 bits; the preimage line climbs 1 step for every bit. That factor of 2 in the exponent is the whole story.',
  's3.exp.run': 'Run experiment',
  's3.exp.running': 'Measuring k = {bits}…',
  's3.exp.collision': 'Collision, measured',
  's3.exp.preimage': 'Preimage, measured',
  's3.exp.theoryC': 'Theory: k/2',
  's3.exp.theoryP': 'Theory: k',
  's3.exp.x': 'Hash size k (bits)',
  's3.exp.y': 'log₂(hashes computed)',
  's3.exp.note':
    'Preimage is measured only up to k = 16. Beyond that it takes too long in a browser, which is exactly the point.',

  /* ---------------------------------- 4 ---------------------------------- */
  's4.title': 'Why it matters in practice',
  's4.rule':
    '**Rule of thumb:** an n-bit hash gives at most n/2 bits of collision resistance. To get 128-bit security against collisions you need a hash of at least 256 bits.',
  's4.speed': 'Attacker speed',
  's4.speed.cpu': 'One CPU core',
  's4.speed.gpu': 'One GPU',
  's4.speed.cluster': 'GPU cluster',
  's4.speed.state': 'Hypothetical superpower',
  's4.th.fn': 'Function',
  's4.th.out': 'Output',
  's4.th.res': 'Collision resistance',
  's4.th.time': 'Generic attack time',
  's4.th.known': 'Known attacks',
  's4.bits': '{bits} bits',
  's4.broken': 'Broken',
  's4.secure': 'Secure',
  's4.known.md5':
    'First collision published in 2004 (Wang et al.); today found in seconds on a laptop. A chosen-prefix collision was used to forge a Microsoft code-signing certificate for the Flame malware (2012).',
  's4.known.sha1':
    'SHAttered (2017): first public collision, about 2^{63} SHA-1 computations. Chosen-prefix collision “SHA-1 is a Shambles” (2020).',
  's4.known.none': 'Nothing better than the generic birthday attack.',
  's4.timeNote':
    'Time to reach a 50% chance with a generic birthday attack. For comparison, the universe is about 1.4 × 10^{10} years old.',
  's4.cards.title': 'Where else the birthday bound shows up',
  's4.card.sig.title': 'Digital signatures',
  's4.card.sig':
    'A signature signs the **hash** of a document. A collision lets an attacker swap one document for another without invalidating the signature. See step 6.',
  's4.card.sweet32.title': 'Sweet32 (2016)',
  's4.card.sweet32':
    '64-bit block ciphers such as 3DES and Blowfish start producing repeated blocks after about 2^{32} blocks (≈ 32 GB) under one key. Researchers used this to recover secret cookies from HTTPS traffic.',
  's4.card.gcm.title': 'AES-GCM nonces',
  's4.card.gcm':
    'With random 96-bit nonces, NIST SP 800-38D limits a key to 2^{32} messages so the chance of a repeated nonce stays negligible. A single repeat breaks GCM authentication.',
  's4.card.uuid.title': 'Random IDs',
  's4.card.uuid':
    'A random UUID (version 4) has 122 random bits. You would need about 2.7 × 10^{18} of them for a 50% chance of a duplicate.',

  /* ---------------------------------- 5 ---------------------------------- */
  's5.title': "Yuval's attack: forging a signature",
  's5.intro':
    'In 1979 Gideon Yuval showed how the birthday paradox breaks digital signatures. Mallory wants Alice to sign a fair contract, then present a fraudulent one with the same signature.',
  's5.step1':
    'Mallory writes many harmless variants of the **fair** contract: “will” or “shall”, one space or two. Every variant means the same thing, but each has a different hash.',
  's5.step2':
    'He does the same with the **fraudulent** contract, until one variant has the same hash as some fair variant.',
  's5.step3': 'Alice reads the fair contract and signs its hash.',
  's5.step4': "Mallory attaches Alice's signature to the fraudulent contract. Same hash, so the signature verifies.",
  's5.why':
    'Each contract here has {choices} choice points, so 2^{{choices}} variants. Mallory only needs about 2^{k/2} of each, not 2^{k}.',
  's5.run': 'Search for a matching pair',
  's5.phase.fair': 'Hashing fair variants…',
  's5.phase.fraud': 'Hashing fraudulent variants…',
  's5.fair': 'Fair contract (Alice signs this)',
  's5.fraud': 'Fraudulent contract (Mallory presents this)',
  's5.variant': 'Variant #{i}',
  's5.showInvisible': 'Show invisible changes (double spaces)',
  's5.legend': 'Highlighted words are choice points; ␣ marks an extra space.',
  's5.result':
    'Found after {fair} fair + {fraud} fraudulent variants, in {time}. Matching one *fixed* contract by brute force would take about {brute} variants instead.',
  's5.sigOk': "Alice's signature verifies on both contracts",
  's5.defense':
    '**Defences:** use a hash of at least 256 bits, and never sign exactly what someone else prepared: add something unpredictable of your own (for example a random value) before signing. That ruins Mallory’s precomputed table.',
  's5.placeholder': 'Press the button to let Mallory search for a matching pair of contracts.',

  's1.live': '**Try it with a real room:** the class sends birthdays from their phones and the projector shows the calendar fill up live.',
  's1.live.open': 'Open live mode →',

  /* ------------------------------- live mode ------------------------------ */
  'live.title': 'Live classroom',
  'live.back': 'Back to the app',
  'live.room': 'Room {room}',
  'live.newRoom': 'New room',
  'live.status.connecting': 'Connecting…',
  'live.status.live': 'Live',
  'live.status.error': 'Connection lost',
  'live.scan': 'Scan and send your birthday',
  'live.students': 'students so far',
  'live.theory': 'The theory, recomputed with every new birthday',
  'live.tile.n': 'Students n',
  'live.tile.pairs': 'Pairs to compare',
  'live.tile.p': 'Chance of a shared birthday',
  'live.formulaWait': 'The formula appears once two students have sent their birthday.',
  'live.expected':
    'Expected matching pairs: {pairs} pairs × 1/365 = **{expected}**. Observed in this room: **{observed}**.',
  'live.waiting': 'Waiting for the first birthday…',
  'live.noMatch': 'No shared birthday yet.',
  'live.match': 'Match! Students {people} were all born on **{date}**.',
  'live.manual': 'Add by hand:',
  'live.add': 'Add',

  'vote.title': 'When is your birthday?',
  'vote.privacy': 'Only the day and month are sent, with no name. Nobody sees who sent what.',
  'vote.month': 'Month',
  'vote.day': 'Day',
  'vote.feb29': 'Born on 29 February? Pick 28 February (the model uses a 365-day year).',
  'vote.send': 'Send',
  'vote.sending': 'Sending…',
  'vote.sent': 'Sent: **{date}**.',
  'vote.look': 'Now look at the projector.',
  'vote.change': 'Change my answer',
  'vote.error': 'Could not send. Check your internet connection and try again.',

  /* ------------------------------ structure ------------------------------ */
  'nav.why': 'Why hash',
  'nav.hash': 'Hash function',
  'nav.summary': 'Summary',
  'nav.live': 'Live',
  'ui.book': 'Book {s}',
  'app.live': 'Live classroom demo',
  'app.covers': 'Covers chapter 5 of the book:',
  'book.5.1': 'Introduction',
  'book.5.2': 'Crypto hash function',
  'book.5.3': 'Birthday problem',
  'book.5.4': 'Birthday attack',

  /* ---------------------------------- 5.1 --------------------------------- */
  'why.title': 'Why do we need hash functions?',
  'why.intro':
    'A digital signature is slow, and it works on a short, fixed-size input. So we never sign the document itself: we sign its **hash**, a short fingerprint of the document. Anyone can recompute the hash and check the signature against it.',
  'why.doc': 'Contract: Alice pays Bob 100 € by 1 March.',
  'why.docLabel': 'The document (any length)',
  'why.bytes': '{n} bytes',
  'why.digest': 'Its hash (always the same length)',
  'why.signVerb': 'sign',
  'why.sign': 'The signature',
  'why.signNote': 'Alice signs only these 32 bytes.',
  'why.tryIt': 'Edit the document: the hash changes completely, but it stays 32 bytes long.',
  'why.callout':
    'The catch: the signature belongs to the **hash**, not to the text. If two different documents had the same hash, a signature on one would also be valid on the other. Steps 3–6 show how much work it takes to find such a pair.',

  /* ---------------------------------- 5.2 --------------------------------- */
  'hash.title': 'What is a cryptographic hash function?',
  'hash.intro':
    'A hash function h(x) turns an input of any length into a fixed-length output. For a **cryptographic** hash it must also be impossible in practice to run backwards or to find two inputs with the same output. Try it on real SHA-256:',
  'hash.lab': 'Change one character, compare the hashes',
  'hash.a': 'Message A',
  'hash.b': 'Message B',
  'hash.defaultA': 'Alice pays Bob 100 €',
  'hash.defaultB': 'Alice pays Bob 900 €',
  'hash.changed':
    'bits differ ({pct}). A tiny change in the input flips about half of the output bits. This is the **avalanche effect**: similar inputs give unrelated hashes.',
  'hash.props.title': 'The five properties (book 5.2)',
  'hash.p.compress.name': '**Compression**',
  'hash.p.compress.desc': 'Any input length gives an output of n bits (here n = 256).',
  'hash.p.efficient.name': '**Efficiency**',
  'hash.p.efficient.desc': 'Fast to compute: your browser just did about **{rate}** SHA-256 hashes per second.',
  'hash.p.oneway.name': '**One-way** (preimage resistance)',
  'hash.p.oneway.desc': 'Given a hash y, it is infeasible to find any x with h(x) = y.',
  'hash.p.weak.name': '**Weak collision resistance**',
  'hash.p.weak.desc': 'Given x, it is infeasible to find a different x′ with h(x′) = h(x).',
  'hash.p.strong.name': '**Strong collision resistance**',
  'hash.p.strong.desc': 'It is infeasible to find **any** two x ≠ x′ with h(x) = h(x′). Only half the bits of work, because of the birthday problem.',
  'hash.work': 'Generic attack:',
  'hash.toParadox': 'Why does strong collision resistance cost only 2^{n/2} and not 2^{n}? That is the birthday problem.',
  'hash.toParadox.link': 'Step 3 →',

  /* -------------------------------- summary ------------------------------- */
  'sum.title': 'Summary: the answers in one place',
  'sum.q.calc': 'What does the app calculate?',
  'sum.a.calc':
    'The exact probability 1 − (365/365)(364/365)…, the approximation 1 − e^{−n²/2N}, the work for a collision (≈ 1.18·√N) and for a preimage (≈ 0.69·N), and it runs real attacks on SHA-256 to measure them.',
  'sum.q.logic': 'Why is it a "paradox"?',
  'sum.a.logic':
    'We count people, but matches happen between **pairs**. 23 people form 253 pairs, so a shared birthday is already more likely than not. In general a repeat appears after about √N draws, not N.',
  'sum.q.hash': 'Why does it matter for hashes?',
  'sum.a.hash':
    'Signatures sign the hash, so a collision lets one signature cover two documents. A hash with N = 2^{n} outputs is a "year" with 2^{n} days: a collision needs only about 2^{n/2} hashes.',
  'sum.q.security': 'How does it affect security?',
  'sum.a.security':
    'An n-bit hash gives at most **n/2 bits** of collision resistance. MD5 (64) and SHA-1 (80) are broken; use SHA-256 or larger (128+). The birthday attack (Yuval) turns a collision into a forged signature.',
  'quiz.title': 'Check yourself',
  'quiz.1.q': 'About how many hashes does a birthday attack on a 64-bit hash need?',
  'quiz.1.a': '2^{64}',
  'quiz.1.b': '2^{32}',
  'quiz.1.c': '64 × 365',
  'quiz.1.why': 'A collision needs about √N = √(2^{64}) = 2^{32} hashes.',
  'quiz.2.q': 'How many bits of collision resistance does SHA-256 give?',
  'quiz.2.a': '128',
  'quiz.2.b': '256',
  'quiz.2.c': '64',
  'quiz.2.why': 'n/2 = 256/2 = 128 bits.',
  'quiz.3.q': 'Which is easier for an attacker?',
  'quiz.3.a': 'Finding a message with a given hash',
  'quiz.3.b': 'Both take the same work',
  'quiz.3.c': 'Finding any two messages with the same hash',
  'quiz.3.why': 'Any pair can match, so the number of pairs grows like n²: 2^{n/2} work instead of 2^{n}.',
  'quiz.right': 'Correct!',
  'quiz.wrong': 'Not quite.',
  'quiz.retry': 'Try again',

  /* --------------------------------- website -------------------------------- */
  'hero.eyebrow': 'Information Security · Chapter 5',
  'hero.people': 'people in the room',
  'hero.caption': 'Random birthdays arriving one by one…',
  'hero.match': '**Match!** Two people share a birthday after only **{n}** people.',
  'stats.people': 'people give a **50%** chance of a shared birthday',
  'stats.pairs': 'pairs hide in a room of 23',
  'stats.sha256': 'work to find a SHA-256 collision, not 2^{256}',
  'stats.md5': 'generic work for MD5, which is why it fell',
  'footer.tagline': 'An interactive guide to the birthday paradox and why it sets the length of every cryptographic hash.',
  'footer.steps': 'Steps',

  /* ------------------------------ attack visuals ----------------------------- */
  'duel.title': 'See it: a year with 2^{{k}} days',
  'duel.desc':
    'Each square is one possible hash value, like a day of the year: here **{N}** of them (k = {k} bits). Every real SHA-256 hash lands in its square. Same squares, two different questions:',
  'duel.start': 'Start both attacks',
  'duel.again': 'Run again',
  'duel.collision': 'Birthday attack',
  'duel.collision.q': 'Stop when ANY square is hit twice.',
  'duel.preimage': 'Preimage attack',
  'duel.preimage.q': 'Stop only when the red target square {h} is hit.',
  'duel.found': 'Found',
  'duel.hashes': 'hashes',
  'duel.collision.found': '`{a}` and `{b}` both land in square **{h}**.',
  'duel.preimage.found': '`{b}` finally hits the target **{h}**.',
  'duel.hint': 'Watch the left grid: a repeat shows up long before the right one hits its single target.',
  'duel.waiting': '**Collision after {c} hashes.** The preimage attack is still throwing…',
  'duel.verdict':
    'Collision after **{c}** hashes, preimage after **{p}**: about **{x}×** more work. With 256 bits instead of {k}, that gap is 2^{128} vs 2^{256}.',
  'duel.lucky':
    'Collision after **{c}** hashes, preimage after only **{p}**: the preimage got lucky this time. On average it needs about **{ep}** hashes, the collision only about **{ec}**. Run it again!',
  's3.real.title': 'Now at full speed',
  's3.real.desc': 'The same two attacks without animation, in a background worker, for much larger k.',
  's5.sameHash': 'same hash',
  's5.stamp.valid': 'Valid signature',

  /* -------------------------------- footer -------------------------------- */
  'footer.course': 'Information Security · MSc Computer and Software Engineering (FIEK), University of Prishtina',
  'footer.authors': 'Authors',
  'footer.refs': 'References',
  'footer.source': 'Source code',
  'footer.ai': 'Co-Authored-By: Claude Opus 5.5 (Anthropic)',

  /* --------------------------------- units -------------------------------- */
  'unit.ms': 'ms',
  'unit.s': 's',
  'unit.min': 'min',
  'unit.h': 'hours',
  'unit.d': 'days',
  'unit.y': 'years',
  'unit.instant': 'instant',
};

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
