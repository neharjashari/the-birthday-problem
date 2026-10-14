import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { expectedCollisionAttempts, expectedPreimageAttempts } from '../lib/birthday';
import { fmtInt, fmtNum } from '../lib/format';
import { CounterMessages, randomNonce, sha256Bytes, truncBits, utf8ToBytes } from '../lib/hash';
import { T } from './Text';
import { useTheme } from './theme';

const SIZES = [8, 10, 12] as const;
const CANVAS = 480; // drawing units; CSS scales the canvas to its column
const RECENT = 10; // how many of the latest throws glow

/** Throws per second: starts slow enough to follow by eye, then speeds up. */
const rateAt = (seconds: number) => Math.min(4000, 6 * 1.45 ** seconds);

interface Side {
  throws: number;
  done: boolean;
  /** cell state: 0 empty, 1 hit once */
  cells: Uint8Array;
  recent: number[];
  /** collision: the bucket hit twice; preimage: the target bucket */
  special: number;
  msgs: [string, string] | null;
}

function emptySide(N: number): Side {
  return { throws: 0, done: false, cells: new Uint8Array(N), recent: [], special: -1, msgs: null };
}

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#c53030';
}

/**
 * Ideas 1 + 2: the same "year with 2^k days" answers two different questions.
 * Left, every hash lands in its bucket until one bucket is hit twice (collision).
 * Right, darts aim for one fixed bucket (preimage). Both use real truncated SHA-256.
 */
export function BucketDuel() {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const [k, setK] = useState<(typeof SIZES)[number]>(10);
  const N = 2 ** k;
  const cols = 2 ** Math.ceil(k / 2);
  const rows = N / cols;

  const [running, setRunning] = useState(false);
  const [, setTick] = useState(0); // re-render the counters
  const coll = useRef<Side>(emptySide(N));
  const pre = useRef<Side>(emptySide(N));
  const gen = useRef<{ c: CounterMessages; p: CounterMessages; targetMsg: string } | null>(null);
  const canvasC = useRef<HTMLCanvasElement>(null);
  const canvasP = useRef<HTMLCanvasElement>(null);
  const seen = useRef(new Map<number, number>());

  const reset = useCallback(() => {
    setRunning(false);
    coll.current = emptySide(N);
    pre.current = emptySide(N);
    seen.current = new Map();
    const nonce = randomNonce(6);
    const targetMsg = `target-${nonce}`;
    pre.current.special = truncBits(sha256Bytes(utf8ToBytes(targetMsg)), k);
    gen.current = { c: new CounterMessages(`a-${nonce}-`), p: new CounterMessages(`b-${nonce}-`), targetMsg };
    setTick((x) => x + 1);
  }, [N, k]);

  useEffect(reset, [reset]);

  // ------------------------------------------------------------------ drawing
  const draw = useCallback(() => {
    const bad = cssVar('--bad');
    const paint = (canvas: HTMLCanvasElement | null, side: Side, color: string, kind: 'c' | 'p') => {
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      const cw = CANVAS / cols;
      const ch = (CANVAS * rows) / cols / rows;
      const gap = cw > 8 ? 1.5 : 0.75;
      ctx.clearRect(0, 0, CANVAS, (CANVAS * rows) / cols);
      for (let i = 0; i < N; i++) {
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        ctx.fillStyle = side.cells[i] ? color : colors.grid;
        ctx.globalAlpha = side.cells[i] ? 0.55 : 1;
        ctx.fillRect(x + gap / 2, y + gap / 2, cw - gap, ch - gap);
      }
      ctx.globalAlpha = 1;
      // latest throws glow brighter
      side.recent.forEach((i, j) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.35 + (0.65 * (j + 1)) / side.recent.length;
        const x = (i % cols) * cw;
        const y = Math.floor(i / cols) * ch;
        ctx.fillRect(x - 1, y - 1, cw + 2, ch + 2);
      });
      ctx.globalAlpha = 1;
      if (side.special >= 0 && (kind === 'p' || side.done)) {
        const x = (side.special % cols) * cw + cw / 2;
        const y = Math.floor(side.special / cols) * ch + ch / 2;
        const r = Math.max(cw, 6);
        ctx.fillStyle = bad;
        ctx.globalAlpha = kind === 'p' && !side.done ? 0.25 : 0.3;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = bad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.1, 0, Math.PI * 2);
        ctx.stroke();
        if (side.done) ctx.fillRect(x - cw / 2, y - ch / 2, cw, ch);
      }
    };
    paint(canvasC.current, coll.current, colors.collision, 'c');
    paint(canvasP.current, pre.current, colors.preimage, 'p');
  }, [N, cols, rows, colors]);

  useEffect(draw, [draw, k]);

  // --------------------------------------------------------------- simulation
  useEffect(() => {
    if (!running || !gen.current) return;
    const g = gen.current;
    let frame = 0;
    let budget = 0;
    const t0 = performance.now();
    let last = t0;

    const throwOne = () => {
      const c = coll.current;
      if (!c.done) {
        const i = c.throws++;
        const h = truncBits(sha256Bytes(g.c.bytes(i)), k);
        const j = seen.current.get(h);
        if (j !== undefined) {
          c.done = true;
          c.special = h;
          c.msgs = [g.c.text(j), g.c.text(i)];
        } else seen.current.set(h, i);
        c.cells[h] = 1;
        c.recent = [...c.recent.slice(-(RECENT - 1)), h];
      }
      const p = pre.current;
      if (!p.done) {
        const i = p.throws++;
        const h = truncBits(sha256Bytes(g.p.bytes(i)), k);
        if (h === p.special) {
          p.done = true;
          p.msgs = [g.targetMsg, g.p.text(i)];
        }
        p.cells[h] = 1;
        p.recent = [...p.recent.slice(-(RECENT - 1)), h];
      }
    };

    const loop = (now: number) => {
      budget += (rateAt((now - t0) / 1000) * (now - last)) / 1000;
      last = now;
      while (budget >= 1 && !(coll.current.done && pre.current.done)) {
        throwOne();
        budget -= 1;
      }
      draw();
      setTick((x) => x + 1);
      if (coll.current.done && pre.current.done) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running, k, draw]);

  const c = coll.current;
  const p = pre.current;
  const finished = c.done && p.done;
  const hexDigits = Math.ceil(k / 4);
  const hex = (v: number) => v.toString(16).padStart(hexDigits, '0');

  return (
    <div className="card stack duel">
      <div className="duel-head">
        <div>
          <h3 style={{ margin: 0 }}>
            <T k="duel.title" vars={{ k }} />
          </h3>
          <p className="small" style={{ margin: '4px 0 0' }}>
            <T k="duel.desc" vars={{ k, N: fmtInt(N, lang) }} />
          </p>
        </div>
        <div className="duel-controls">
          <div className="segmented" role="group" aria-label={t('s3.bits')}>
            {SIZES.map((s) => (
              <button key={s} aria-pressed={s === k} disabled={running} onClick={() => setK(s)}>
                k = {s}
              </button>
            ))}
          </div>
          {running ? (
            <button className="btn ghost" onClick={() => setRunning(false)}>
              {t('s3.stop')}
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                if (finished || c.throws > 0) reset();
                setRunning(true);
              }}
            >
              {c.throws > 0 ? t('duel.again') : t('duel.start')}
            </button>
          )}
        </div>
      </div>

      <div className="duel-grid">
        <DuelSide
          title={t('duel.collision')}
          question={t('duel.collision.q')}
          color={colors.collision}
          side={c}
          expected={expectedCollisionAttempts(k)}
          canvas={canvasC}
          aspect={`${cols} / ${rows}`}
          result={c.msgs && <T k="duel.collision.found" vars={{ a: c.msgs[0], b: c.msgs[1], h: hex(c.special) }} />}
        />
        <DuelSide
          title={t('duel.preimage')}
          question={t('duel.preimage.q', { h: hex(p.special) })}
          color={colors.preimage}
          side={p}
          expected={expectedPreimageAttempts(k)}
          canvas={canvasP}
          aspect={`${cols} / ${rows}`}
          result={p.msgs && <T k="duel.preimage.found" vars={{ b: p.msgs[1], h: hex(p.special) }} />}
        />
      </div>

      <div className="duel-verdict" aria-live="polite">
        {finished && p.throws <= c.throws * 2 ? (
          // a single run is random: a lucky preimage must not read as "1× more work"
          <T
            k="duel.lucky"
            vars={{
              c: fmtInt(c.throws, lang),
              p: fmtInt(p.throws, lang),
              ec: fmtInt(expectedCollisionAttempts(k), lang),
              ep: fmtInt(expectedPreimageAttempts(k), lang),
            }}
          />
        ) : finished ? (
          <T
            k="duel.verdict"
            vars={{ c: fmtInt(c.throws, lang), p: fmtInt(p.throws, lang), x: fmtNum(p.throws / c.throws, lang, 0), k }}
          />
        ) : c.done ? (
          <T k="duel.waiting" vars={{ c: fmtInt(c.throws, lang) }} />
        ) : (
          <span className="muted">{t('duel.hint')}</span>
        )}
      </div>
    </div>
  );
}

function DuelSide(props: {
  title: string;
  question: string;
  color: string;
  side: Side;
  expected: number;
  canvas: React.RefObject<HTMLCanvasElement | null>;
  aspect: string;
  result: React.ReactNode;
}) {
  const { lang, t } = useI18n();
  const { title, question, color, side, expected, canvas, aspect, result } = props;
  return (
    <div className={`duel-side${side.done ? ' done' : ''}`} style={{ '--c': color } as React.CSSProperties}>
      <div className="duel-side-head">
        <span className="key" />
        <strong>{title}</strong>
        {side.done && <span className="duel-badge">{t('duel.found')}</span>}
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {question}
      </p>
      <canvas ref={canvas} width={CANVAS} height={CANVAS} style={{ aspectRatio: aspect }} className="duel-canvas" />
      <div className="duel-count">
        <b>{fmtInt(side.throws, lang)}</b>
        <span className="small muted">
          {t('duel.hashes')} · {t('s3.expected')} ≈ {fmtInt(expected, lang)}
        </span>
      </div>
      <div className="duel-result small">{result}</div>
    </div>
  );
}
