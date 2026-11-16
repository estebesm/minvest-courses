import React from 'react';
import {easeAt, springAt, useClock, windowAt} from '../anim';
import {fontFamily} from '../fonts';
import {Avatar, type AvatarName} from '../media/Asset';
import {color, weight} from '../tokens';

type Segment = {
  value: number;
  fill: keyof typeof color;
  avatar?: AvatarName;
};

type Props = {
  segments: Segment[];
  size?: number;
  at?: number;
  /** Пауза между появлением долей, сек */
  stagger?: number;
  /** Подписи снаружи: логотип + процент */
  labels?: boolean;
  /** Когда какую долю выделить */
  focus?: {at: number; index: number; until?: number}[];
  /** Что показать в центре */
  children?: React.ReactNode;
};

const LABEL_SPACE = 150;

/** «Пончик» состава портфеля: доли вырастают по очереди, у каждой — логотип и процент. */
export const Donut: React.FC<Props> = ({segments, size = 420, at = 0, stagger = 0.3, labels = true, focus = [], children}) => {
  const {frame, fps, t} = useClock();
  const total = segments.reduce((s, x) => s + x.value, 0);
  const th = size * 0.17;
  const r = size / 2 - th * 0.7;
  const C = 2 * Math.PI * r;
  const box = size + (labels ? LABEL_SPACE * 2 : 0);
  const c = box / 2;

  const focusOf = (i: number) =>
    Math.max(
      0,
      ...focus
        .filter((f) => f.index === i)
        .map((f) => windowAt(t, f.at, f.until ?? f.at + 0.9, 0.25)),
    );
  const fs = segments.map((_, i) => focusOf(i));
  const anyFocus = Math.max(0, ...fs);

  let acc = 0;
  const arcs: React.ReactNode[] = [];
  const tags: React.ReactNode[] = [];
  segments.forEach((s, i) => {
    const frac = s.value / total;
    const p = easeAt(t, at + i * stagger, 0.7);
    const len = Math.max(0, frac * C * p - 6);
    arcs.push(
      <circle
        key={i}
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color[s.fill]}
        strokeWidth={th * (1 + 0.28 * fs[i])}
        strokeDasharray={`${len} ${C}`}
        transform={`rotate(${-90 + acc * 360} ${c} ${c})`}
        opacity={1 - 0.65 * (anyFocus - fs[i])}
      />,
    );
    if (labels) {
      const a = (acc + frac / 2) * Math.PI * 2 - Math.PI / 2;
      const ro = size / 2 + 74;
      const pop = springAt(frame, fps, at + i * stagger + 0.35, 'strong');
      tags.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c + Math.cos(a) * ro,
            top: c + Math.sin(a) * ro,
            transform: `translate(-50%, -50%) scale(${Math.max(0, pop) * (1 + 0.22 * fs[i])})`,
            opacity: 1 - 0.6 * (anyFocus - fs[i]),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {s.avatar ? <Avatar name={s.avatar} size={76} shadow /> : null}
          <div style={{fontFamily, fontSize: 30, fontWeight: weight.black, color: color.ink, fontVariantNumeric: 'tabular-nums'}}>
            {Math.round(frac * 100)}%
          </div>
        </div>,
      );
    }
    acc += frac;
  });

  return (
    <div style={{position: 'relative', width: box, height: box}}>
      <svg width={box} height={box} style={{position: 'absolute', overflow: 'visible', transform: `rotate(${(1 - easeAt(t, at, 1.2)) * -40}deg)`}}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={color.surface} strokeWidth={th} opacity={easeAt(t, at - 0.2, 0.4)} />
        {arcs}
      </svg>
      {tags}
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    </div>
  );
};
