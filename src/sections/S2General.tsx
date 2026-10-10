import { useMemo, useState, type CSSProperties } from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BigFromLog2, Pow2 } from '../components/Num';
import { Prose, T } from '../components/Text';
import { useTheme } from '../components/theme';
import { Legend, Section, Slider, Tile, TooltipBox } from '../components/ui';
import { useI18n, type MessageKey } from '../i18n';
import { DAYS, log2SamplesForCollision, log2TriesForPreimage, peopleForCollision, peopleForMatchYours, probCollisionExact } from '../lib/birthday';
import { fmtInt, fmtNum, fmtPct } from '../lib/format';

const ROWS: Array<{ key: MessageKey; bits: number }> = [
  { key: 's2.row.b32', bits: 32 },
  { key: 's2.row.b64', bits: 64 },
  { key: 's2.row.md5', bits: 128 },
  { key: 's2.row.sha1', bits: 160 },
  { key: 's2.row.sha256', bits: 256 },
];

export function S2General() {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const [bits, setBits] = useState(64);

  // Universal curve: x = n / √N. Exact N = 365 values plotted on top as dots.
  const data = useMemo(() => {
    const pts: Array<{ x: number; approx?: number; exact?: number; n?: number }> = [];
    for (let i = 0; i <= 80; i++) {
      const x = i * 0.05;
      pts.push({ x, approx: -Math.expm1(-(x * x) / 2) });
    }
    for (let n = 2; n <= 76; n += 2) pts.push({ x: n / Math.sqrt(DAYS), exact: probCollisionExact(n), n });
    return pts.sort((a, b) => a.x - b.x);
  }, []);

  const coll = log2SamplesForCollision(bits);
  const pre = log2TriesForPreimage(bits);

  return (
    <Section id="any-n" title="s2.title">
      <Prose k="s2.intro" />
      <div className="formula">
        P(n) ≈ 1 − e<sup>−n(n−1) / 2N</sup>
      </div>
      <Prose k="s2.after" />

      <div className="card stack">
        <Slider
          label={t('s2.slider')}
          value={bits}
          min={8}
          max={256}
          display={
            <>
              {t('s2.bitsValue', { bits })} · N = <Pow2 bits={bits} />
            </>
          }
          onChange={setBits}
        />
        <div className="tiles">
          <Tile label={t('s2.tile.N')} value={<Pow2 bits={bits} />} note={<BigFromLog2 log2={bits} approx />} />
          <Tile
            label={t('s2.tile.coll')}
            color={colors.collision}
            value={<Pow2 bits={coll} approx />}
            note={<BigFromLog2 log2={coll} approx />}
          />
          <Tile
            label={t('s2.tile.pre')}
            color={colors.preimage}
            value={<Pow2 bits={pre} approx />}
            note={<BigFromLog2 log2={pre} approx />}
          />
          <Tile label={t('s2.tile.ratio')} value={<Pow2 bits={pre - coll} approx />} note={t('s2.tile.ratioNote')} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="chart-head">
            <h3>{t('s2.chart.title')}</h3>
          </div>
          <p className="small">{t('s2.chart.desc')}</p>
          <Legend
            items={[
              { label: t('s2.chart.approx'), color: colors.collision, kind: 'line' },
              { label: t('s2.chart.exact'), color: colors.ink2, kind: 'dot' },
            ]}
          />
          <div className="chart" style={{ height: 260 }}>
            <ResponsiveContainer>
              <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 20, left: 0 }}>
                <CartesianGrid stroke={colors.grid} vertical={false} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  stroke={colors.axis}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  label={{ value: 'n / √N', position: 'insideBottom', offset: -12, fill: colors.muted, fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.5, 1]}
                  tickFormatter={(v: number) => fmtPct(v, lang, 0)}
                  stroke={colors.axis}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  width={48}
                />
                <ReferenceLine y={0.5} stroke={colors.axis} />
                <ReferenceLine x={1.1774} stroke={colors.axis} label={{ value: fmtNum(1.1774, lang, 2), position: 'top', fill: colors.muted, fontSize: 11 }} />
                <Tooltip
                  cursor={{ stroke: colors.axis }}
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as { x: number; approx?: number; exact?: number; n?: number } | undefined;
                    if (!active || !p) return null;
                    return (
                      <TooltipBox
                        title={`n / √N = ${fmtNum(p.x, lang, 2)}`}
                        rows={[
                          p.approx !== undefined
                            ? { label: t('s2.chart.approx'), value: fmtPct(p.approx, lang), color: colors.collision }
                            : { label: `${t('s2.chart.exact')} (n = ${p.n})`, value: fmtPct(p.exact!, lang), color: colors.ink2 },
                        ]}
                      />
                    );
                  }}
                />
                <Line dataKey="approx" stroke={colors.collision} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
                <Scatter dataKey="exact" fill={colors.ink2} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t('s2.table.space')}</th>
                <th>
                  <span className="key" style={{ '--c': colors.collision, marginRight: 6 } as CSSProperties} />
                  {t('s2.table.coll')}
                </th>
                <th>
                  <span className="key" style={{ '--c': colors.preimage, marginRight: 6 } as CSSProperties} />
                  {t('s2.table.pre')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('s2.row.days')}</td>
                <td className="num">{fmtInt(peopleForCollision(0.5), lang)}</td>
                <td className="num">{fmtInt(peopleForMatchYours(0.5) - 1, lang)}</td>
              </tr>
              {ROWS.map((r) => (
                <tr key={r.key}>
                  <td>
                    <T k={r.key} />
                  </td>
                  <td className="num">
                    <Pow2 bits={log2SamplesForCollision(r.bits)} approx />
                  </td>
                  <td className="num">
                    <Pow2 bits={log2TriesForPreimage(r.bits)} approx />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
