import type {Icon as PhosphorIcon} from '@phosphor-icons/react';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {bounceStyle, easeAt, springAt, useBounce, useClock} from '../anim';
import {fontFamily} from '../fonts';
import {defaultSurface, surfaceStyle} from '../surface';
import {color, tone as toneOf, type, weight, type Tone} from '../tokens';
import {curvePath} from './Arrow';

type OrbitProps = {
  x: number;
  y: number;
  /** Радиусы эллипса, px */
  rx: number;
  ry?: number;
  at?: number;
  stagger?: number;
  /** Скорость вращения, рад/сек */
  speed?: number;
  startAngle?: number;
  children: React.ReactNode;
};

/** Элементы вылетают из центра и медленно кружат вокруг него — «всё собрано вокруг приложения». */
export const Orbit: React.FC<OrbitProps> = ({x, y, rx, ry = rx, at = 0, stagger = 0.18, speed = 0.22, startAngle = -Math.PI / 2, children}) => {
  const {frame, fps, t} = useClock();
  const items = React.Children.toArray(children);
  return (
    <>
      {items.map((child, i) => {
        const p = springAt(frame, fps, at + i * stagger, 'medium');
        if (p <= 0.001) return null;
        const a = startAngle + (i / items.length) * Math.PI * 2 + Math.max(0, t - at) * speed;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * rx * p,
              top: y + Math.sin(a) * ry * p,
              opacity: Math.min(1, p * 2.5),
              transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * p})`,
            }}
          >
            {child}
          </div>
        );
      })}
    </>
  );
};

const rnd = (n: number) => {
  const v = Math.sin(n * 91.7) * 43758.5453;
  return v - Math.floor(v);
};

type Box = {x0: number; y0: number; x1: number; y1: number};

type ScatterProps = {
  icon: PhosphorIcon;
  count?: number;
  /** Где разбросать */
  bounds: Box;
  /** Область, которую не занимать (там главный объект) */
  hole?: Box;
  at?: number;
  out?: number;
  stagger?: number;
  size?: number;
  tone?: Tone;
  seed?: number;
};

/** Россыпь одинаковых значков по большой области — «их на самом деле гораздо больше». */
export const Scatter: React.FC<ScatterProps> = ({icon: I, count = 24, bounds, hole, at = 0, out, stagger = 0.07, size = 84, tone = 'neutral', seed = 1}) => {
  const {frame, fps, t} = useClock();
  const tn = toneOf(tone);
  const po = out === undefined ? 0 : easeAt(t, out, 0.4);
  const pts: {x: number; y: number}[] = [];
  for (let k = 0; pts.length < count && k < count * 30; k++) {
    const x = bounds.x0 + rnd(seed * 13 + k) * (bounds.x1 - bounds.x0);
    const y = bounds.y0 + rnd(seed * 29 + k * 1.7) * (bounds.y1 - bounds.y0);
    if (hole && x > hole.x0 && x < hole.x1 && y > hole.y0 && y < hole.y1) continue;
    if (pts.some((q) => Math.hypot(q.x - x, q.y - y) < size * 2.3)) continue;
    pts.push({x, y});
  }
  return (
    <>
      {pts.map((pt, i) => {
        const p = springAt(frame, fps, at + i * stagger, 'strong');
        if (p <= 0.001) return null;
        const box = size * 1.7;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pt.x,
              top: pt.y + Math.sin(t * 1.2 + i) * 8,
              width: box,
              height: box,
              marginLeft: -box / 2,
              marginTop: -box / 2,
              borderRadius: '50%',
              background: tn.soft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: Math.min(1, p * 2) * (1 - po),
              transform: `scale(${p})`,
            }}
          >
            <I size={size} weight="duotone" color={tn.fg} />
          </div>
        );
      })}
    </>
  );
};

type FlyProps = {
  from: {x: number; y: number};
  to: {x: number; y: number};
  curve?: number;
  at: number;
  duration?: number;
  /** Поворачивать по направлению полёта */
  orient?: boolean;
  children: React.ReactNode;
};

/** Один элемент пролетает по дуге из точки в точку (заявка «улетела», идея «прилетела»). */
export const Fly: React.FC<FlyProps> = ({from, to, curve = 0, at, duration = 1, orient = false, children}) => {
  const {t} = useClock();
  const k = (t - at) / duration;
  if (k < 0 || k > 1) return null;
  const {d} = curvePath(from, to, curve);
  const len = getLength(d);
  const e = Easing.inOut(Easing.cubic)(k);
  const pt = getPointAtLength(d, len * e) ?? to;
  const tan = getTangentAtLength(d, Math.max(0.01, len * e)) ?? {x: 1, y: 0};
  const ang = orient ? (Math.atan2(tan.y, tan.x) * 180) / Math.PI : 0;
  const o = interpolate(k, [0, 0.12, 0.8, 1], [0, 1, 1, 0]);
  const s = interpolate(k, [0, 0.2, 1], [0.4, 1, 0.7]);
  return (
    <div style={{position: 'absolute', left: pt.x, top: pt.y, opacity: o, transform: `translate(-50%, -50%) rotate(${ang}deg) scale(${s})`}}>{children}</div>
  );
};

/** Небольшая серая карточка-контейнер: картинка/график и подпись в одно слово. */
export const Tile: React.FC<{at?: number; width?: number; rotate?: number; title?: string; tone?: Tone; children?: React.ReactNode}> = ({
  at = 0,
  width = 320,
  rotate = 0,
  title,
  tone = 'primary',
  children,
}) => {
  const p = useBounce(at, 'medium');
  return (
    <div
      style={{
        ...surfaceStyle(defaultSurface, tone),
        width,
        padding: 22,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        fontFamily,
        opacity: bounceStyle(p).opacity,
        transform: `translate3d(0, ${(1 - p) * 50}px, 0) scale(${0.6 + 0.4 * p}) rotate(${rotate + (1 - p) * 8}deg)`,
      }}
    >
      {children}
      {title ? <div style={{fontSize: type.caption + 2, fontWeight: weight.black, color: color.ink}}>{title}</div> : null}
    </div>
  );
};
