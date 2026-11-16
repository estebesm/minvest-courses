import {evolvePath, getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {bounceStyle, useBounce, useProgress, useTime} from '../anim';
import {Coin, type CoinKind} from '../media/Coin';
import {color, motion, radius, shadow, tone as toneOf, type, weight, type Tone} from '../tokens';

type Point = {x: number; y: number};

export type FlowOptions = {
  /** Когда пустить поток, сек (по умолчанию — как только стрелка дорисуется) */
  at?: number;
  /** Когда остановить, сек */
  until?: number;
  /** Интервал между монетками, сек */
  every?: number;
  /** Время полёта одной монетки, сек */
  travel?: number;
  /** dollar — деньги, percent — доход/купон */
  kind?: CoinKind;
};

type Props = {
  from: Point;
  to: Point;
  /** Изгиб в px: 0 — прямая, >0 — дуга (выгибается влево по ходу движения) */
  curve?: number;
  label?: string;
  tone?: Tone;
  at?: number;
  duration?: number;
  /** Поток монеток вдоль стрелки — «деньги идут туда» */
  flow?: boolean | FlowOptions;
};

const HEAD = 22;

/** Геометрия дуги от точки до точки. */
export const curvePath = (from: Point, to: Point, curve = 0) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const n = {x: dy / len, y: -dx / len};
  const ctrl = {x: (from.x + to.x) / 2 + n.x * curve, y: (from.y + to.y) / 2 + n.y * curve};
  return {d: `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`, n, ctrl};
};

const Flow: React.FC<{d: string; opts: FlowOptions & {at: number}}> = ({d, opts}) => {
  const t = useTime();
  const total = getLength(d);
  const every = opts.every ?? 0.45;
  const travel = opts.travel ?? 1.3;
  const until = opts.until ?? Infinity;
  const coins: React.ReactNode[] = [];
  // Только монетки, которые сейчас в полёте
  const firstIdx = Math.max(0, Math.floor((t - opts.at - travel) / every));
  for (let i = firstIdx; ; i++) {
    const launch = opts.at + i * every;
    if (launch > t || launch > until) break;
    const k = (t - launch) / travel;
    if (k > 1) continue;
    const eased = Easing.inOut(Easing.quad)(k);
    const pt = getPointAtLength(d, total * eased);
    if (!pt) continue;
    const s = interpolate(k, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);
    const o = interpolate(k, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
    coins.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%) scale(${s}) rotate(${Math.sin(k * Math.PI * 2) * 14}deg)`,
          opacity: o,
        }}
      >
        <Coin kind={opts.kind} size={64} />
      </div>,
    );
  }
  return <>{coins}</>;
};

/**
 * Стрелка, которая «рисуется» от начала к концу. Может пускать поток монеток.
 * Координаты — в пикселях области сцены (используйте в <Scene layout="free">).
 */
export const Arrow: React.FC<Props> = ({
  from,
  to,
  curve = 0,
  label,
  tone = 'primary',
  at = 0,
  duration = motion.draw as number,
  flow,
}) => {
  const p = useProgress(at, duration);
  const pLabel = useBounce(at + duration * 0.5, 'strong');
  const t = toneOf(tone);
  const {d, n, ctrl} = curvePath(from, to, curve);

  const total = getLength(d);
  const tipLen = total * p;
  const tip = getPointAtLength(d, tipLen) ?? to;
  const tan = getTangentAtLength(d, Math.max(0.01, tipLen)) ?? {x: to.x - from.x, y: to.y - from.y};
  const angle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
  const evolved = evolvePath(Math.max(0, (tipLen - HEAD * 0.6) / total), d);

  const mid = getPointAtLength(d, total / 2) ?? ctrl;
  const side = Math.sign(curve || 1);
  const labelPos = {x: mid.x + n.x * side * 40, y: mid.y + n.y * side * 40};
  const flowOpts = flow ? {...(flow === true ? {} : flow), at: (flow !== true && flow.at) || at + duration} : null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" style={{position: 'absolute', overflow: 'visible'}}>
        {/* Мягкая «тень» линии для объёма */}
        <path d={d} fill="none" stroke={t.soft} strokeWidth={18} strokeLinecap="round" {...evolved} />
        <path d={d} fill="none" stroke={t.fg} strokeWidth={6} strokeLinecap="round" {...evolved} />
        {p > 0.02 ? (
          <polygon
            points={`0,0 ${-HEAD},${-HEAD * 0.6} ${-HEAD * 0.75},0 ${-HEAD},${HEAD * 0.6}`}
            fill={t.fg}
            transform={`translate(${tip.x} ${tip.y}) rotate(${angle})`}
          />
        ) : null}
      </svg>
      {flowOpts ? <Flow d={d} opts={flowOpts} /> : null}
      {label ? (
        <div style={{position: 'absolute', left: labelPos.x, top: labelPos.y, transform: 'translate(-50%, -50%)'}}>
          <div
            style={{
              ...bounceStyle(pLabel, 0.4),
              background: color.surface,
              color: t.fg,
              fontSize: type.small + 4,
              fontWeight: weight.bold,
              padding: '10px 22px',
              borderRadius: radius.pill,
              boxShadow: shadow.pill,
              whiteSpace: 'nowrap',
              border: `2px solid ${t.soft}`,
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
