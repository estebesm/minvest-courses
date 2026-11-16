import React from 'react';
import {Easing, interpolate} from 'remotion';
import {bounceStyle, useBounce, useProgress, useTime} from '../anim';
import {color, tone as toneOf, type, weight, type Tone} from '../tokens';

type Props = {
  value: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Показывать «+» у положительных чисел */
  showSign?: boolean;
  label?: string;
  /** По умолчанию: зелёный для >0, красный для <0 */
  tone?: Tone;
  at?: number;
  duration?: number;
  size?: number;
};

const fmt = (n: number, decimals: number) =>
  new Intl.NumberFormat('ru-RU', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}).format(n);

/** Крупное число, которое «набегает» от `from` до `value`. */
export const BigNumber: React.FC<Props> = ({
  value,
  from = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  showSign = false,
  label,
  tone,
  at = 0,
  duration = 1.2,
  size = type.display + 40,
}) => {
  const p = useBounce(at);
  const count = useProgress(at, duration);
  const time = useTime();
  const done = at + duration;
  const kick = interpolate(time, [done - 0.05, done + 0.12, done + 0.45], [1, 1.12, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const current = from + (value - from) * count;
  const tn: Tone = tone ?? (value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral');
  const sign = showSign && current > 0 ? '+' : '';
  return (
    <div style={{...bounceStyle(p, 0.5), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
      <div
        style={{
          fontSize: size,
          fontWeight: weight.black,
          letterSpacing: -3,
          lineHeight: 1,
          color: toneOf(tn).fg,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
          transform: `scale(${kick})`,
        }}
      >
        {sign}
        {prefix}
        {fmt(current, decimals)}
        {suffix}
      </div>
      {label ? (
        <div style={{fontSize: type.caption, fontWeight: weight.semibold, color: color.inkMuted, textAlign: 'center'}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};
